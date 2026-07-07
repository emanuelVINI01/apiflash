import { createHash } from "crypto";
import type { ClientCodeRequestPayload, ResponseAnalysis } from "@/services/ai-client";
import { AiUsageLimitError } from "./errors";
import { AiRepository } from "./ai.repository";
import { QuotaService } from "./quota.service";
import { LockService } from "./lock.service";
import { PromptBuilder } from "./prompt.builder";
import { IAiProvider } from "./ai.provider";

export class AiService {
  constructor(
    private readonly repository: AiRepository,
    private readonly quotaService: QuotaService,
    private readonly lockService: LockService,
    private readonly promptBuilder: PromptBuilder,
    private readonly aiProvider: IAiProvider
  ) {}

  async getUsageSummary(userId: string) {
    return this.quotaService.getUsageSummary(userId);
  }

  async generateRequestFromPrompt(userId: string, promptText: string, locale: "pt-BR" | "en") {
    const usage = await this.quotaService.getUsageSummary(userId);
    if (usage.remaining <= 0) {
      throw new AiUsageLimitError();
    }

    const prompt = this.promptBuilder.buildGenerateRequestPrompt(promptText, locale);
    
    const schema = {
      type: "object",
      additionalProperties: false,
      required: ["method", "url", "headers", "queryParams", "body", "bodyType", "name"],
      properties: {
        name: { type: "string", description: "A short descriptive name for this request" },
        method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] },
        url: { type: "string" },
        headers: {
          type: "array",
          items: {
            type: "object",
            required: ["key", "value", "enabled"],
            properties: { key: { type: "string" }, value: { type: "string" }, enabled: { type: "boolean" } },
          },
        },
        queryParams: {
          type: "array",
          items: {
            type: "object",
            required: ["key", "value", "enabled"],
            properties: { key: { type: "string" }, value: { type: "string" }, enabled: { type: "boolean" } },
          },
        },
        body: { type: "string", description: "JSON raw body string or empty string" },
        bodyType: { type: "string", enum: ["json", "text", "form", "none"] },
      },
    };

    const result = await this.aiProvider.generateObject(prompt, schema, 0.2);

    await this.repository.recordUsageEvent({
      userId,
      cacheHit: false,
      reqHash: null,
      model: this.aiProvider.getModelName(),
    });

    return {
      result,
      usage: await this.quotaService.getUsageSummary(userId),
    };
  }

  async analyzeResponse(
    userId: string,
    reqResData: Record<string, unknown>,
    locale: "pt-BR" | "en",
    forceRefresh = false
  ) {
    const lockKey = `analyze:${userId}`;
    await this.lockService.acquire(lockKey);

    try {
      const reqHashPayload = `${reqResData.method}_${reqResData.url}_${reqResData.responseStatus}_${reqResData.responseBody}`;
      const reqHash = createHash("sha256").update(reqHashPayload, "utf8").digest("hex");
      const model = this.aiProvider.getModelName();

      if (forceRefresh) {
        try { await this.repository.deleteAnalysisByHash(reqHash); } catch {}
      }

      let cached = forceRefresh ? null : await this.repository.getAnalysisByHash(reqHash);

      if (cached) {
        if (this.repository.isPendingAnalysis(cached.result as Record<string, unknown>)) {
          let attempts = 0;
          while (attempts < 10) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await this.repository.getAnalysisByHash(reqHash);
            if (!cached || !this.repository.isPendingAnalysis(cached.result as Record<string, unknown>)) break;
            attempts++;
          }
        }

        if (cached && !this.repository.isPendingAnalysis(cached.result as Record<string, unknown>)) {
          await this.repository.recordUsageEvent({
            userId,
            cacheHit: true,
            reqHash,
            model: cached.model,
          });

          return {
            analysis: cached.result as unknown as ResponseAnalysis,
            cacheHit: true,
            reqHash,
            usage: await this.quotaService.getUsageSummary(userId),
          };
        }
      }

      const usage = await this.quotaService.getUsageSummary(userId);
      if (usage.remaining <= 0) {
        throw new AiUsageLimitError();
      }

      let pendingCreated = false;
      try {
        await this.repository.createAnalysis({
          reqHash,
          model,
          result: { status: "pending" },
        });
        pendingCreated = true;
      } catch (err: unknown) {
        if (this.repository.isUniqueConstraintError(err)) {
          let attempts = 0;
          while (attempts < 10) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await this.repository.getAnalysisByHash(reqHash);
            if (!cached || !this.repository.isPendingAnalysis(cached.result as Record<string, unknown>)) break;
            attempts++;
          }
          if (cached && !this.repository.isPendingAnalysis(cached.result as Record<string, unknown>)) {
            await this.repository.recordUsageEvent({
              userId,
              cacheHit: true,
              reqHash,
              model: cached.model,
            });
            return {
              analysis: cached.result as unknown as ResponseAnalysis,
              cacheHit: true,
              reqHash,
              usage: await this.quotaService.getUsageSummary(userId),
            };
          }
        }
        throw err;
      }

      if (pendingCreated) {
        try {
          const prompt = this.promptBuilder.buildAnalyzeResponsePrompt(reqResData, locale);
          const schema = {
            type: "object",
            additionalProperties: false,
            required: ["description", "tsType", "securityReview", "riskLevel"],
            properties: {
              description: { type: "string" },
              tsType: { type: "string", description: "Formatted TypeScript interface string" },
              securityReview: { type: "array", items: { type: "string" } },
              riskLevel: { type: "string", enum: ["low", "medium", "high"] },
            },
          };

          const result = await this.aiProvider.generateObject(prompt, schema, 0.25);

          await this.repository.updateAnalysis(reqHash, result);

          await this.repository.recordUsageEvent({
            userId,
            cacheHit: false,
            reqHash,
            model,
          });

          return {
            analysis: result,
            cacheHit: false,
            reqHash,
            usage: await this.quotaService.getUsageSummary(userId),
          };
        } catch (error) {
          try { await this.repository.deleteAnalysisByHash(reqHash); } catch {}
          throw error;
        }
      }

      throw new Error("Failed to process API analysis.");
    } finally {
      await this.lockService.release(lockKey);
    }
  }

  async generateClientCode(userId: string, reqData: ClientCodeRequestPayload, language: string) {
    const usage = await this.quotaService.getUsageSummary(userId);
    if (usage.remaining <= 0) {
      throw new AiUsageLimitError();
    }

    const prompt = this.promptBuilder.buildClientCodePrompt(reqData, language);
    const schema = {
      type: "object",
      additionalProperties: false,
      required: ["code"],
      properties: { code: { type: "string" } },
    };

    const result = await this.aiProvider.generateObject(prompt, schema, 0.1);

    await this.repository.recordUsageEvent({
      userId,
      cacheHit: false,
      reqHash: null,
      model: this.aiProvider.getModelName(),
    });

    return result as { code: string };
  }
}
