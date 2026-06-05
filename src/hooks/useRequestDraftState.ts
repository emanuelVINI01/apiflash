"use client";

import { useCallback, useMemo, useState } from "react";
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
} from "@/lib/request-model";

export function useRequestDraftState() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderRow[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParamRow[]>([]);
  const [auth, setAuth] = useState<AuthConfig>(DEFAULT_AUTH);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState<BodyType>("json");
  const [options, setOptions] = useState<RequestOptions>(DEFAULT_REQUEST_OPTIONS);

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
    currentDraft,
    setMethod,
    setUrl,
    setHeaders,
    setQueryParams,
    setAuth,
    setBody,
    setBodyType,
    setOptions,
    applyDraft,
  };
}

