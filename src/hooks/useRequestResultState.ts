"use client";

import { useCallback, useState } from "react";
import { appendHistoryEntry } from "@/lib/history-storage";
import type { RequestDraft, ResponseData } from "@/lib/request-model";

export function useRequestResultState(currentDraft: RequestDraft) {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

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
    response,
    error,
    isLoading,
    setIsLoading,
    clearError,
    handleResponse,
    handleError,
  };
}

