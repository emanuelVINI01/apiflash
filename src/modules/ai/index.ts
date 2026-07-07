import { AiRepository } from "./ai.repository";
import { QuotaService } from "./quota.service";
import { LockService } from "./lock.service";
import { PromptBuilder } from "./prompt.builder";
import { GeminiProvider } from "./ai.provider";
import { AiService } from "./ai.service";

// Dependency Injection Composition Root for AI Module
const repository = new AiRepository();
const quotaService = new QuotaService(repository);
const lockService = new LockService();
const promptBuilder = new PromptBuilder();
const provider = new GeminiProvider();

export const aiService = new AiService(
  repository,
  quotaService,
  lockService,
  promptBuilder,
  provider
);
