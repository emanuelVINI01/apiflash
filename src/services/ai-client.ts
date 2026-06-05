import type { BodyType, HttpMethod, KeyValueRow, RequestDraft } from "@/types/request";

export interface AiUsageSummary {
  used: number;
  cacheHits: number;
  totalRequests: number;
  limit: number;
  remaining: number;
  periodStart: string;
  periodEnd: string;
}

export interface GeneratedRequest {
  name: string;
  method: HttpMethod;
  url: string;
  headers: KeyValueRow[];
  queryParams: KeyValueRow[];
  body: string;
  bodyType: BodyType | "none";
}

export type GeneratedRequestDraft = Partial<RequestDraft> & Pick<GeneratedRequest, "name">;

export interface ResponseAnalysis {
  description: string;
  tsType: string;
  securityReview: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface AnalyzeRequestPayload {
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: string;
}

export interface ClientCodeRequestPayload {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  bodyType: string;
}

export async function fetchAiUsage(): Promise<AiUsageSummary> {
  const res = await fetch("/api/ai/usage");
  if (!res.ok) throw new Error("Failed to load AI usage statistics.");
  return res.json();
}

export async function generateRequestFromPrompt(promptText: string, locale: string): Promise<{ result: GeneratedRequest; usage: AiUsageSummary }> {
  const res = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promptText, locale }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to generate request.");
  }
  return res.json();
}

export async function analyzeResponse(reqResData: AnalyzeRequestPayload, locale: string, forceRefresh?: boolean): Promise<{ analysis: ResponseAnalysis; cacheHit: boolean; usage: AiUsageSummary }> {
  const res = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...reqResData, locale, forceRefresh }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to analyze response.");
  }
  return res.json();
}

export async function generateClientCode(reqData: ClientCodeRequestPayload, language: string): Promise<{ code: string }> {
  const res = await fetch("/api/ai/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reqData, language }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to generate client code.");
  }
  return res.json();
}
