"use client";

import { useEffect } from "react";
import { consumeQueuedRequest } from "@/lib/collection-storage";
import type { RequestDraft } from "@/lib/request-model";

export function useQueuedRequestLoader(applyDraft: (draft: Partial<RequestDraft>) => void, onDraftLoaded: () => void) {
  useEffect(() => {
    const queuedRequest = consumeQueuedRequest();
    if (!queuedRequest) return;

    queueMicrotask(() => {
      applyDraft(queuedRequest);
      onDraftLoaded();
      requestAnimationFrame(() => {
        document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, [applyDraft, onDraftLoaded]);
}

