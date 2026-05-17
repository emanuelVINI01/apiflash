"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createSavedRequest,
  readCollections,
  writeCollections,
} from "@/lib/collection-storage";
import { normalizeDraft, type RequestCollection, type RequestDraft } from "@/lib/request-model";

function defaultRequestName(draft: RequestDraft) {
  const normalized = normalizeDraft(draft);
  const path = normalized.url.trim().replace(/^https?:\/\//i, "").split("?")[0] || "request";
  return `${normalized.method} ${path}`;
}

export function useSaveToCollection(draft: RequestDraft) {
  const [collections, setCollections] = useState<RequestCollection[]>([]);
  const [collectionId, setCollectionId] = useState("");
  const [requestName, setRequestName] = useState("");
  const [saved, setSaved] = useState(false);
  const suggestedName = useMemo(() => defaultRequestName(draft), [draft]);

  useEffect(() => {
    queueMicrotask(() => {
      const nextCollections = readCollections();
      setCollections(nextCollections);
      setCollectionId((current) => current || nextCollections[0]?.id || "");
    });
  }, []);

  const saveRequest = () => {
    if (!collectionId || !draft.url.trim()) return;

    const savedRequest = createSavedRequest(requestName || suggestedName, draft);
    const updatedCollections = collections.map((collection) =>
      collection.id === collectionId
        ? {
            ...collection,
            requests: [savedRequest, ...collection.requests],
            updatedAt: new Date().toISOString(),
          }
        : collection
    );

    setCollections(updatedCollections);
    writeCollections(updatedCollections);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return {
    collections,
    collectionId,
    requestName,
    saved,
    suggestedName,
    setCollectionId,
    setRequestName,
    saveRequest,
  };
}
