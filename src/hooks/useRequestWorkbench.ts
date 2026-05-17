"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { consumeQueuedRequest } from "@/lib/collection-storage";
import { appendHistoryEntry } from "@/lib/history-storage";
import {
  DEFAULT_AUTH,
  DEFAULT_REQUEST_OPTIONS,
  normalizeDraft,
  type AuthConfig,
  type BodyType,
  type HeaderRow,
  type HttpMethod,
  type QueryParamRow,
  type RequestDraft,
  type RequestOptions,
  type ResponseData,
} from "@/lib/request-model";

export function useRequestWorkbench() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderRow[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParamRow[]>([]);
  const [auth, setAuth] = useState<AuthConfig>(DEFAULT_AUTH);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState<BodyType>("json");
  const [options, setOptions] = useState<RequestOptions>(DEFAULT_REQUEST_OPTIONS);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentDraft = useMemo<RequestDraft>(
    () => normalizeDraft({ method, url, headers, queryParams, auth, body, bodyType, options }),
    [auth, body, bodyType, headers, method, options, queryParams, url]
  );

  const applyDraft = useCallback((draft: Partial<RequestDraft>) => {
    const normalized = normalizeDraft(draft);
    setMethod(normalized.method);
    setUrl(normalized.url);
    setHeaders(normalized.headers);
    setQueryParams(normalized.queryParams);
    setAuth(normalized.auth);
    setBody(normalized.body);
    setBodyType(normalized.bodyType);
    setOptions(normalized.options);
    setError(null);
  }, []);

  useEffect(() => {
    const queuedRequest = consumeQueuedRequest();
    if (!queuedRequest) return;

    queueMicrotask(() => {
      applyDraft(queuedRequest);
      requestAnimationFrame(() => {
        document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, [applyDraft]);

  const handleResponse = useCallback(
    (data: ResponseData) => {
      setResponse(data);
      setError(null);
      appendHistoryEntry(data, currentDraft);
    },
    [currentDraft]
  );

  const handleError = useCallback((message: string) => {
    setError(message);
    setResponse(null);
  }, []);

  return {
    method,
    url,
    headers,
    queryParams,
    auth,
    body,
    bodyType,
    options,
    response,
    error,
    isLoading,
    currentDraft,
    setMethod,
    setUrl,
    setHeaders,
    setQueryParams,
    setAuth,
    setBody,
    setBodyType,
    setOptions,
    setIsLoading,
    applyDraft,
    handleResponse,
    handleError,
  };
}

export type RequestWorkbenchController = ReturnType<typeof useRequestWorkbench>;
