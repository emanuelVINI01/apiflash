export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
export type BodyType = "json" | "text" | "form";
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

