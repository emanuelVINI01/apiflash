import { Prisma } from "@prisma/client";
import { prisma } from "@/src/prisma";

export class AiRepository {
  async countUsage(userId: string, cacheHit: boolean, start: Date, end: Date) {
    return prisma.aiUsageEvent.count({
      where: { userId, cacheHit, createdAt: { gte: start, lt: end } },
    });
  }

  async countTotalUsage(userId: string, start: Date, end: Date) {
    return prisma.aiUsageEvent.count({
      where: { userId, createdAt: { gte: start, lt: end } },
    });
  }

  async getAnalysisByHash(reqHash: string) {
    return prisma.aiFlashAnalysis.findUnique({ where: { reqHash } });
  }

  async deleteAnalysisByHash(reqHash: string) {
    return prisma.aiFlashAnalysis.delete({ where: { reqHash } });
  }

  async createAnalysis(data: { reqHash: string; model: string; result: Prisma.InputJsonValue }) {
    return prisma.aiFlashAnalysis.create({ data });
  }

  async updateAnalysis(reqHash: string, result: Prisma.InputJsonValue) {
    return prisma.aiFlashAnalysis.update({
      where: { reqHash },
      data: { result },
    });
  }

  async recordUsageEvent(data: { userId: string; cacheHit: boolean; reqHash: string | null; model: string }) {
    return prisma.aiUsageEvent.create({ data });
  }

  isUniqueConstraintError(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error && (error as Record<string, unknown>).code === "P2002";
  }

  isPendingAnalysis(result: Prisma.JsonValue) {
    return typeof result === "object" && result !== null && !Array.isArray(result) && (result as Record<string, unknown>).status === "pending";
  }
}
