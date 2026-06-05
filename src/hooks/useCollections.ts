"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { queueRequestLoad } from "@/lib/collection-storage";
import type { RequestCollection, SavedRequest } from "@/lib/request-model";
import {
  createRemoteCollection,
  deleteRemoteCollection,
  deleteRemoteRequest,
  fetchCollections,
} from "@/services/collections-client";

export function useCollections() {
  const [collections, setCollections] = useState<RequestCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      queueMicrotask(() => {
        setCollections([]);
        setIsLoading(false);
      });
      return;
    }

    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setIsLoading(true);
      setError("");
    });

    fetchCollections()
      .then((nextCollections) => {
        if (active) setCollections(nextCollections);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Failed to load collections.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

  const addCollection = async (name: string, description: string) => {
    if (!name.trim()) return;
    const collection = await createRemoteCollection(name, description);
    setCollections((currentCollections) => [collection, ...currentCollections]);
  };

  const deleteCollection = async (collectionId: string) => {
    await deleteRemoteCollection(collectionId);
    setCollections((currentCollections) => currentCollections.filter((collection) => collection.id !== collectionId));
  };

  const deleteRequest = async (collectionId: string, requestId: string) => {
    await deleteRemoteRequest(collectionId, requestId);
    setCollections((currentCollections) =>
      currentCollections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.filter((request) => request.id !== requestId),
              updatedAt: new Date().toISOString(),
            }
          : collection,
      )
    );
  };

  const runRequest = (request: SavedRequest) => {
    queueRequestLoad(request);
    window.location.assign("/workspace#workbench");
  };

  return {
    collections,
    isAuthenticated: status === "authenticated",
    isLoading,
    error,
    addCollection,
    deleteCollection,
    deleteRequest,
    runRequest,
  };
}

export type CollectionsController = ReturnType<typeof useCollections>;
