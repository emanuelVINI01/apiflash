"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { normalizeDraft, type RequestCollection, type RequestDraft } from "@/lib/request-model";
import { createRemoteRequest, fetchCollections } from "@/services/collections-client";

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const { status } = useSession();
  const suggestedName = useMemo(() => defaultRequestName(draft), [draft]);

  useEffect(() => {
    if (status !== "authenticated") {
      setCollections([]);
      setCollectionId("");
      return;
    }

    let active = true;
    fetchCollections()
      .then((nextCollections) => {
        if (!active) return;
        setCollections(nextCollections);
        setCollectionId((current) => current || nextCollections[0]?.id || "");
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Failed to load collections.");
      });

    return () => {
      active = false;
    };
  }, [status]);

  const saveRequest = async () => {
    if (!collectionId || !draft.url.trim()) return;

    setIsSaving(true);
    setError("");

    try {
      const savedRequest = await createRemoteRequest(collectionId, requestName || suggestedName, draft);
      setCollections((currentCollections) =>
        currentCollections.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                requests: [savedRequest, ...collection.requests],
                updatedAt: new Date().toISOString(),
              }
            : collection,
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to save request.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    collections,
    collectionId,
    requestName,
    saved,
    isAuthenticated: status === "authenticated",
    isSaving,
    error,
    suggestedName,
    setCollectionId,
    setRequestName,
    saveRequest,
  };
}
