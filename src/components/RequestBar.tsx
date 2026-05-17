"use client";

import type { FormEvent } from "react";
import { ChevronDown, Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  HTTP_METHODS,
  applyQueryParams,
  buildHeaders,
  canSendBody,
  normalizeUrl,
  type AuthConfig,
  type BodyType,
  type HeaderRow,
  type HttpMethod,
  type QueryParamRow,
  type RequestOptions,
  type ResponseData,
} from "@/lib/request-model";

export type { HttpMethod, ResponseData };

interface RequestBarProps {
  method: HttpMethod;
  url: string;
  headers: HeaderRow[];
  queryParams: QueryParamRow[];
  auth: AuthConfig;
  body: string;
  bodyType: BodyType;
  options: RequestOptions;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onResponse: (data: ResponseData) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-dracula-cyan",
  POST: "text-dracula-green",
  PUT: "text-dracula-orange",
  PATCH: "text-dracula-purple",
  DELETE: "text-dracula-red",
  HEAD: "text-dracula-yellow",
  OPTIONS: "text-dracula-pink",
};

export default function RequestBar({
  method,
  url,
  headers,
  queryParams,
  auth,
  body,
  bodyType,
  options,
  onMethodChange,
  onUrlChange,
  onResponse,
  onError,
  isLoading,
  setIsLoading,
}: RequestBarProps) {
  const { t } = useLanguage();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      onError(t.request.validUrlError);
      return;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      onError(t.request.invalidUrlError);
      return;
    }

    setIsLoading(true);
    try {
      const hasBody = canSendBody(method) && body.trim().length > 0;
      const finalUrl = applyQueryParams(normalizedUrl, queryParams, auth);
      const requestHeaders = buildHeaders(headers, auth, bodyType, hasBody);

      const proxyBody = {
        url: finalUrl,
        method,
        headers: requestHeaders,
        body: hasBody ? body : undefined,
        timeoutMs: options.timeoutMs,
        followRedirects: options.followRedirects,
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proxyBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const proxyData: ResponseData = await response.json();
      onResponse(proxyData);
    } catch (error) {
      const message = error instanceof Error ? error.message : t.request.unknownError;
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        onError(t.request.connectionError);
      } else {
        onError(`${t.request.requestError}: ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 shrink-0">
          <select
            value={method}
            onChange={(event) => onMethodChange(event.target.value as HttpMethod)}
            disabled={isLoading}
            className={`h-12 w-full cursor-pointer appearance-none rounded-xl border border-dracula-card bg-dracula-card pl-4 pr-8 font-mono text-sm font-bold transition-all duration-200 focus:border-dracula-purple focus:outline-none focus:ring-1 focus:ring-dracula-purple/50 disabled:opacity-50 sm:w-auto ${METHOD_COLORS[method]}`}
          >
            {HTTP_METHODS.map((httpMethod) => (
              <option key={httpMethod} value={httpMethod} className="bg-dracula-bg text-dracula-fg">
                {httpMethod}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-dracula-comment" />
          </div>
        </div>

        <input
          type="text"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder={t.request.urlPlaceholder}
          disabled={isLoading}
          className="h-12 min-w-0 flex-1 rounded-xl border border-dracula-card bg-dracula-card px-4 font-mono text-sm text-dracula-fg placeholder-dracula-comment transition-all duration-200 hover:border-dracula-comment focus:border-dracula-purple focus:outline-none focus:ring-1 focus:ring-dracula-purple/50 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="flex h-12 min-w-0 shrink-0 items-center justify-center gap-2 rounded-xl bg-dracula-purple px-6 text-sm font-semibold text-dracula-bg transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t.request.sending}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{t.request.send}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
