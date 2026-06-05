import { BODY_METHODS, HTTP_METHODS } from "@/lib/request-model";

export const PROXY_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

const BLOCKED_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "origin",
  "referer",
  "access-control-request-method",
  "access-control-request-headers",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-fetch-dest",
]);

export interface ProxyRequestPayload {
  url?: string;
  method?: string;
  headers?: Record<string, unknown>;
  body?: string;
  timeoutMs?: number;
  followRedirects?: boolean;
}

export interface ProxyResponsePayload {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  duration: number;
}

export function validateProxyUrl(url: unknown): string | null {
  if (typeof url !== "string" || !url) return null;

  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}

export function normalizeProxyMethod(method: unknown) {
  return typeof method === "string" && (HTTP_METHODS as readonly string[]).includes(method) ? method : "GET";
}

export function normalizeProxyTimeout(timeoutMs: unknown) {
  return Math.min(Math.max(Number(timeoutMs) || 30000, 1000), 120000);
}

export function createProxyHeaders(headers: ProxyRequestPayload["headers"]) {
  const fetchHeaders = new Headers();

  Object.entries(headers || {}).forEach(([key, value]) => {
    if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase()) && typeof value === "string") {
      fetchHeaders.append(key, value);
    }
  });

  return fetchHeaders;
}

export async function readProxyResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json") || !text) return text;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function collectResponseHeaders(response: Response) {
  const responseHeaders: Record<string, string> = {};

  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return responseHeaders;
}

export async function executeProxyRequest(payload: ProxyRequestPayload): Promise<ProxyResponsePayload> {
  const url = validateProxyUrl(payload.url);
  if (!url) {
    throw new Error("Invalid URL");
  }

  const method = normalizeProxyMethod(payload.method);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), normalizeProxyTimeout(payload.timeoutMs));
  const start = performance.now();

  try {
    const response = await fetch(url, {
      method,
      headers: createProxyHeaders(payload.headers),
      body: (BODY_METHODS as readonly string[]).includes(method) ? payload.body : undefined,
      cache: "no-store",
      redirect: payload.followRedirects === false ? "manual" : "follow",
      signal: controller.signal,
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: collectResponseHeaders(response),
      body: await readProxyResponseBody(response),
      duration: Math.round(performance.now() - start),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function formatProxyError(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") return "Request timed out";
  if (error instanceof Error) return error.message;
  return "Error occurred while fetching";
}

