"use client";

import type { FormEvent } from "react";
import { sendProxyRequest } from "@/services/proxy-client";
import type { RequestDraft, ResponseData } from "@/lib/request-model";
import { validateRequestUrl } from "@/utils/request-validation";

interface SendRequestMessages {
  validUrlError: string;
  invalidUrlError: string;
  unknownError: string;
  connectionError: string;
  requestError: string;
}

interface UseSendRequestParams {
  draft: RequestDraft;
  messages: SendRequestMessages;
  onResponse: (data: ResponseData) => void;
  onError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}

function formatRequestError(error: unknown, messages: SendRequestMessages) {
  const message = error instanceof Error ? error.message : messages.unknownError;

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return messages.connectionError;
  }

  return `${messages.requestError}: ${message}`;
}

export function useSendRequest({ draft, messages, onResponse, onError, setIsLoading }: UseSendRequestParams) {
  return async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validation = validateRequestUrl(draft.url);
    if (!validation.ok) {
      onError(validation.reason === "missing" ? messages.validUrlError : messages.invalidUrlError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendProxyRequest({ ...draft, normalizedUrl: validation.url });
      onResponse(response);
    } catch (error) {
      onError(formatRequestError(error, messages));
    } finally {
      setIsLoading(false);
    }
  };
}

