import { AiRepository } from "./ai.repository";

const DEFAULT_AI_DAILY_LIMIT = 50;

export class QuotaService {
  constructor(private readonly repository: AiRepository) {}

  getDailyLimit(): number {
    const configuredLimit = Number(process.env.AI_DAILY_LIMIT);
    return Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.floor(configuredLimit)
      : DEFAULT_AI_DAILY_LIMIT;
  }

  getUsageWindow() {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { end, start };
  }

  async getUsageSummary(userId: string) {
    const { start, end } = this.getUsageWindow();
    const [used, cacheHits, totalRequests] = await Promise.all([
      this.repository.countUsage(userId, false, start, end),
      this.repository.countUsage(userId, true, start, end),
      this.repository.countTotalUsage(userId, start, end),
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
}
