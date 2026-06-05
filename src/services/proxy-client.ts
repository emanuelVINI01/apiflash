import {
  applyQueryParams,
  buildHeaders,
  canSendBody,
  type RequestDraft,
  type ResponseData,
} from "@/lib/request-model";

export type SendProxyRequestInput = RequestDraft & {
  normalizedUrl: string;
};

export async function sendProxyRequest(input: SendProxyRequestInput): Promise<ResponseData> {
  const hasBody = canSendBody(input.method) && input.body.trim().length > 0;
  const finalUrl = applyQueryParams(input.normalizedUrl, input.queryParams, input.auth);
  const requestHeaders = buildHeaders(input.headers, input.auth, input.bodyType, hasBody);

  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: finalUrl,
      method: input.method,
      headers: requestHeaders,
      body: hasBody ? input.body : undefined,
      timeoutMs: input.options.timeoutMs,
      followRedirects: input.options.followRedirects,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}

