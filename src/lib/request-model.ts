export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;
export const BODY_METHODS = ["POST", "PUT", "PATCH"] as const;
export const BODY_TYPES = ["json", "text", "form"] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];
export type BodyType = (typeof BODY_TYPES)[number];
export type AuthType = "none" | "bearer" | "basic" | "apiKey";
export type ApiKeyLocation = "header" | "query";

export interface KeyValueRow {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export type HeaderRow = KeyValueRow;
export type QueryParamRow = KeyValueRow;

export interface AuthConfig {
  type: AuthType;
  token: string;
  username: string;
  password: string;
  apiKeyName: string;
  apiKeyValue: string;
  apiKeyLocation: ApiKeyLocation;
}

export interface RequestOptions {
  timeoutMs: number;
  followRedirects: boolean;
}

export interface RequestDraft {
  method: HttpMethod;
  url: string;
  headers: HeaderRow[];
  queryParams: QueryParamRow[];
  auth: AuthConfig;
  body: string;
  bodyType: BodyType;
  options: RequestOptions;
}

export interface ResponseData {
  status: number;
  statusText: string;
  body: unknown;
  headers: Record<string, string>;
  duration: number;
}

export interface SavedRequest extends RequestDraft {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestCollection {
  id: string;
  name: string;
  description: string;
  requests: SavedRequest[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_AUTH: AuthConfig = {
  type: "none",
  token: "",
  username: "",
  password: "",
  apiKeyName: "x-api-key",
  apiKeyValue: "",
  apiKeyLocation: "header",
};

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
  timeoutMs: 30000,
  followRedirects: true,
};

export function createId(prefix = "item") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function canSendBody(method: HttpMethod) {
  return (BODY_METHODS as readonly string[]).includes(method);
}

export function cloneRows<T extends KeyValueRow>(rows: T[]): T[] {
  return rows.map((row) => ({ ...row, id: row.id || createId("row") }));
}

export function normalizeDraft(draft: Partial<RequestDraft>): RequestDraft {
  return {
    method: draft.method && (HTTP_METHODS as readonly string[]).includes(draft.method) ? draft.method : "GET",
    url: draft.url ?? "",
    headers: cloneRows(draft.headers ?? []),
    queryParams: cloneRows(draft.queryParams ?? []),
    auth: { ...DEFAULT_AUTH, ...(draft.auth ?? {}) },
    body: draft.body ?? "",
    bodyType: draft.bodyType && (BODY_TYPES as readonly string[]).includes(draft.bodyType) ? draft.bodyType : "json",
    options: { ...DEFAULT_REQUEST_OPTIONS, ...(draft.options ?? {}) },
  };
}

export function enabledRows(rows: KeyValueRow[]) {
  return rows.filter((row) => row.enabled && row.key.trim());
}

export function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function applyQueryParams(url: string, queryParams: QueryParamRow[], auth: AuthConfig) {
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) return "";

  const target = new URL(normalizedUrl);

  enabledRows(queryParams).forEach((param) => {
    target.searchParams.set(param.key.trim(), param.value);
  });

  if (auth.type === "apiKey" && auth.apiKeyLocation === "query" && auth.apiKeyName.trim() && auth.apiKeyValue) {
    target.searchParams.set(auth.apiKeyName.trim(), auth.apiKeyValue);
  }

  return target.toString();
}

export function buildHeaders(headers: HeaderRow[], auth: AuthConfig, bodyType: BodyType, hasBody: boolean) {
  const result: Record<string, string> = {};

  enabledRows(headers).forEach((header) => {
    result[header.key.trim()] = header.value;
  });

  if (auth.type === "bearer" && auth.token.trim()) {
    result.Authorization = `Bearer ${auth.token.trim()}`;
  }

  if (auth.type === "basic" && (auth.username || auth.password)) {
    result.Authorization = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
  }

  if (auth.type === "apiKey" && auth.apiKeyLocation === "header" && auth.apiKeyName.trim() && auth.apiKeyValue) {
    result[auth.apiKeyName.trim()] = auth.apiKeyValue;
  }

  if (hasBody && !Object.keys(result).some((key) => key.toLowerCase() === "content-type")) {
    if (bodyType === "json") result["Content-Type"] = "application/json";
    if (bodyType === "text") result["Content-Type"] = "text/plain";
    if (bodyType === "form") result["Content-Type"] = "application/x-www-form-urlencoded";
  }

  return result;
}

function shellQuote(value: string) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

export function buildCurlCommand(draft: RequestDraft) {
  const normalized = normalizeDraft(draft);
  const hasBody = canSendBody(normalized.method) && normalized.body.trim().length > 0;
  const finalUrl = applyQueryParams(normalized.url, normalized.queryParams, normalized.auth);

  if (!finalUrl) return "";

  const headers = buildHeaders(normalized.headers, normalized.auth, normalized.bodyType, hasBody);
  const parts = ["curl", "-i", "-X", normalized.method, shellQuote(finalUrl)];

  Object.entries(headers).forEach(([key, value]) => {
    parts.push("-H", shellQuote(`${key}: ${value}`));
  });

  if (hasBody) {
    parts.push("--data-raw", shellQuote(normalized.body));
  }

  if (!normalized.options.followRedirects) {
    parts.push("--max-redirs", "0");
  }

  if (normalized.options.timeoutMs > 0) {
    parts.push("--max-time", String(Math.ceil(normalized.options.timeoutMs / 1000)));
  }

  return parts.join(" ");
}
