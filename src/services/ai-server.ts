import { createHash } from "crypto";
import { GoogleGenAI } from "@google/genai";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/prisma";
import type { ClientCodeRequestPayload, ResponseAnalysis } from "@/services/ai-client";

const DEFAULT_AI_DAILY_LIMIT = 50;
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export class AiUsageLimitError extends Error {
  constructor() {
    super("AI usage limit reached for today");
  }
}

export class AiConfigurationError extends Error {
  constructor() {
    super("Gemini API key is not configured");
  }
}

export class AiConcurrencyError extends Error {
  constructor() {
    super("Another AI operation is already in progress");
  }
}

const activeUserLocks = new Set<string>();

function isPendingAnalysis(result: Prisma.JsonValue) {
  return typeof result === "object" && result !== null && !Array.isArray(result) && result.status === "pending";
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

class AiServerService {
  private getApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "replace-with-gemini-api-key" || apiKey.startsWith("replace-with-")) {
      throw new AiConfigurationError();
    }
    return apiKey;
  }

  private getModel() {
    return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  }

  private getDailyLimit() {
    const configuredLimit = Number(process.env.AI_DAILY_LIMIT);
    return Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.floor(configuredLimit)
      : DEFAULT_AI_DAILY_LIMIT;
  }

  private getUsageWindow() {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { end, start };
  }

  async getUsageSummary(userId: string) {
    const { start, end } = this.getUsageWindow();
    const [used, cacheHits, totalRequests] = await Promise.all([
      prisma.aiUsageEvent.count({
        where: { userId, cacheHit: false, createdAt: { gte: start, lt: end } },
      }),
      prisma.aiUsageEvent.count({
        where: { userId, cacheHit: true, createdAt: { gte: start, lt: end } },
      }),
      prisma.aiUsageEvent.count({
        where: { userId, createdAt: { gte: start, lt: end } },
      }),
    ]);
    const limit = this.getDailyLimit();

    return {
      used,
      cacheHits,
      totalRequests,
      limit,
      remaining: Math.max(limit - used, 0),
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
    };
  }

  private async recordUsageEvent(input: {
    userId: string;
    cacheHit: boolean;
    reqHash: string | null;
    model: string;
  }) {
    if (input.reqHash) {
      const exists = await prisma.aiFlashAnalysis.findUnique({
        where: { reqHash: input.reqHash },
      });
      if (!exists) {
        try {
          await prisma.aiFlashAnalysis.create({
            data: {
              reqHash: input.reqHash,
              model: input.model,
              result: { status: "placeholder" },
            },
          });
        } catch {}
      }
    }
    return prisma.aiUsageEvent.create({
      data: {
        userId: input.userId,
        cacheHit: input.cacheHit,
        reqHash: input.reqHash,
        model: input.model,
      },
    });
  }

  async generateRequestFromPrompt(userId: string, promptText: string, locale: "pt-BR" | "en") {
    const usage = await this.getUsageSummary(userId);
    if (usage.remaining <= 0) {
      throw new AiUsageLimitError();
    }

    const apiKey = this.getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const model = this.getModel();

    const outputLang = locale === "pt-BR" ? "Portuguese from Brazil" : "English";

    const systemPrompt = [
      "You are apiFlash's HTTP request generator assistant.",
      "The user will describe an API call they want to configure.",
      "Generate the method, full URL, headers, query parameters, auth configurations, and JSON body templates.",
      "Always default to JSON body type if a body is generated.",
      "Respond strictly with a JSON object matching the requested schema.",
      `Ensure user instructions are parsed accurately into appropriate key-value headers. All instructions should be translated to ${outputLang} for placeholders if relevant.`,
    ].join("\n");

    const response = await ai.models.generateContent({
      model,
      contents: [systemPrompt, `Prompt: "${promptText}"`].join("\n"),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
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
                properties: {
                  key: { type: "string" },
                  value: { type: "string" },
                  enabled: { type: "boolean" },
                },
              },
            },
            queryParams: {
              type: "array",
              items: {
                type: "object",
                required: ["key", "value", "enabled"],
                properties: {
                  key: { type: "string" },
                  value: { type: "string" },
                  enabled: { type: "boolean" },
                },
              },
            },
            body: { type: "string", description: "JSON raw body string or empty string" },
            bodyType: { type: "string", enum: ["json", "text", "form", "none"] },
          },
        },
        temperature: 0.2,
      },
    });

    const result = JSON.parse(response.text ?? "{}");

    await this.recordUsageEvent({
      userId,
      cacheHit: false,
      reqHash: null,
      model,
    });

    return {
      result,
      usage: await this.getUsageSummary(userId),
    };
  }

  async analyzeResponse(
    userId: string,
    reqResData: {
      method: string;
      url: string;
      requestHeaders: string; // JSON string
      requestBody: string;
      responseStatus: number;
      responseHeaders: string; // JSON string
      responseBody: string; // response payload
    },
    locale: "pt-BR" | "en",
    forceRefresh = false
  ) {
    if (activeUserLocks.has(userId)) {
      throw new AiConcurrencyError();
    }
    activeUserLocks.add(userId);

    try {
      const reqHashPayload = `${reqResData.method}_${reqResData.url}_${reqResData.responseStatus}_${reqResData.responseBody}`;
      const reqHash = createHash("sha256").update(reqHashPayload, "utf8").digest("hex");
      const model = this.getModel();

      if (forceRefresh) {
        try {
          await prisma.aiFlashAnalysis.delete({ where: { reqHash } });
        } catch {}
      }

      let cached = forceRefresh ? null : await prisma.aiFlashAnalysis.findUnique({ where: { reqHash } });

      if (cached) {
        if (isPendingAnalysis(cached.result)) {
          let attempts = 0;
          while (attempts < 60) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await prisma.aiFlashAnalysis.findUnique({ where: { reqHash } });
            if (!cached || !isPendingAnalysis(cached.result)) break;
            attempts++;
          }
        }

        if (cached && !isPendingAnalysis(cached.result)) {
          await this.recordUsageEvent({
            userId,
            cacheHit: true,
            reqHash,
            model: cached.model,
          });

          return {
            analysis: cached.result as unknown as ResponseAnalysis,
            cacheHit: true,
            reqHash,
            usage: await this.getUsageSummary(userId),
          };
        }
      }

      const usage = await this.getUsageSummary(userId);
      if (usage.remaining <= 0) {
        throw new AiUsageLimitError();
      }

      let pendingCreated = false;
      try {
        await prisma.aiFlashAnalysis.create({
          data: {
            reqHash,
            model,
            result: { status: "pending" },
          },
        });
        pendingCreated = true;
      } catch (err: unknown) {
        if (isUniqueConstraintError(err)) {
          let attempts = 0;
          while (attempts < 60) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await prisma.aiFlashAnalysis.findUnique({ where: { reqHash } });
            if (!cached || !isPendingAnalysis(cached.result)) break;
            attempts++;
          }
          if (cached && !isPendingAnalysis(cached.result)) {
            await this.recordUsageEvent({
              userId,
              cacheHit: true,
              reqHash,
              model: cached.model,
            });
            return {
              analysis: cached.result as unknown as ResponseAnalysis,
              cacheHit: true,
              reqHash,
              usage: await this.getUsageSummary(userId),
            };
          }
        }
        throw err;
      }

      if (pendingCreated) {
        try {
          const apiKey = this.getApiKey();
          const ai = new GoogleGenAI({ apiKey });

          const langName = locale === "pt-BR" ? "Portuguese from Brazil" : "English";

          const prompt = locale === "pt-BR"
            ? [
                "Você é o especialista de diagnóstico de APIs do apiFlash.",
                `Responda apenas em ${langName}.`,
                "Analise esta chamada de API (URL, método, status e payloads) e retorne um objeto JSON combinando perfeitamente com o esquema.",
                `URL do Request: ${reqResData.url}`,
                `Método: ${reqResData.method}`,
                `Status de Resposta: ${reqResData.responseStatus}`,
                `Headers do Request: ${reqResData.requestHeaders}`,
                `Corpo do Request: ${reqResData.requestBody}`,
                `Headers da Resposta: ${reqResData.responseHeaders}`,
                `Corpo da Resposta (Payload):`,
                reqResData.responseBody.slice(0, 10000), // Limit size sent
                "",
                "Tarefas do JSON:",
                "1. 'description': Explicação resumida do que o endpoint retornou.",
                "2. 'tsType': Uma declaração de interface ou tipo TypeScript correspondente ao JSON de resposta. Formate com quebras de linha reais \\n.",
                "3. 'securityReview': Lista de vulnerabilidades ou problemas observados (ex: falta de cabeçalhos de segurança CORS, tokens vazados, senhas em plaintext).",
                "4. 'riskLevel': Nível geral de risco de vazamento/configuração: 'low', 'medium' ou 'high'.",
              ].join("\n")
            : [
                "You are apiFlash's API diagnostics expert.",
                `Reply only in ${langName}.`,
                "Analyze the HTTP call metadata below and return a JSON match for the schema.",
                `Request URL: ${reqResData.url}`,
                `Method: ${reqResData.method}`,
                `Response Status: ${reqResData.responseStatus}`,
                `Request Headers: ${reqResData.requestHeaders}`,
                `Request Body: ${reqResData.requestBody}`,
                `Response Headers: ${reqResData.responseHeaders}`,
                `Response Body (Payload):`,
                reqResData.responseBody.slice(0, 10000),
                "",
                "JSON Tasks:",
                "1. 'description': Brief explanation of what the payload represents.",
                "2. 'tsType': Complete TypeScript interface/type corresponding to the response payload. Format with line breaks \\n.",
                "3. 'securityReview': Bullet points of security leaks or concerns (e.g. leaked authorization headers, missing HSTS, CORS issues).",
                "4. 'riskLevel': Overall risk assessment: 'low', 'medium', or 'high'.",
              ].join("\n");

          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                additionalProperties: false,
                required: ["description", "tsType", "securityReview", "riskLevel"],
                properties: {
                  description: { type: "string" },
                  tsType: { type: "string", description: "Formatted TypeScript interface string" },
                  securityReview: { type: "array", items: { type: "string" } },
                  riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                },
              },
              temperature: 0.25,
            },
          });

          const result = JSON.parse(response.text ?? "{}");

          await prisma.aiFlashAnalysis.update({
            where: { reqHash },
            data: { result },
          });

          await this.recordUsageEvent({
            userId,
            cacheHit: false,
            reqHash,
            model,
          });

          return {
            analysis: result,
            cacheHit: false,
            reqHash,
            usage: await this.getUsageSummary(userId),
          };
        } catch (error) {
          try {
            await prisma.aiFlashAnalysis.delete({ where: { reqHash } });
          } catch {}
          throw error;
        }
      }

      throw new Error("Failed to process API analysis.");
    } finally {
      activeUserLocks.delete(userId);
    }
  }

  async generateClientCode(userId: string, reqData: ClientCodeRequestPayload, language: string) {
    const apiKey = this.getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const model = this.getModel();

    const prompt = [
      "You are apiFlash's technical writer helper.",
      `Generate a code snippet to perform this HTTP request using: ${language}.`,
      `Request URL: ${reqData.url}`,
      `Method: ${reqData.method}`,
      `Headers: ${JSON.stringify(reqData.headers)}`,
      `Body: ${reqData.body}`,
      `Body Type: ${reqData.bodyType}`,
      "",
      "Ensure that the code is formatted beautifully with line breaks (using '\\n') and correct spacing. Return a JSON object with: { code: string }.",
    ].join("\n");

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          additionalProperties: false,
          required: ["code"],
          properties: {
            code: { type: "string" },
          },
        },
        temperature: 0.1,
      },
    });

    const result = JSON.parse(response.text ?? "{}");
    return result as { code: string };
  }
}

export const aiServerService = new AiServerService();
