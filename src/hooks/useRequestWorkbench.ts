"use client";

import { useQueuedRequestLoader } from "@/hooks/useQueuedRequestLoader";
import { useRequestDraftState } from "@/hooks/useRequestDraftState";
import { useRequestResultState } from "@/hooks/useRequestResultState";

export function useRequestWorkbench() {
  const draft = useRequestDraftState();
  const result = useRequestResultState(draft.currentDraft);

  useQueuedRequestLoader(draft.applyDraft, result.clearError);

  return {
    ...draft,
    response: result.response,
    error: result.error,
    isLoading: result.isLoading,
    setIsLoading: result.setIsLoading,
    handleResponse: result.handleResponse,
    handleError: result.handleError,
  };
}

export type RequestWorkbenchController = ReturnType<typeof useRequestWorkbench>;
