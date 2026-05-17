"use client";

import { useEffect, useState } from "react";
import {
  createCollection,
  queueRequestLoad,
  readCollections,
  writeCollections,
} from "@/lib/collection-storage";
import type { RequestCollection, SavedRequest } from "@/lib/request-model";

export function useCollections() {
  const [collections, setCollections] = useState<RequestCollection[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setCollections(readCollections());
    });
  }, []);

  const persist = (nextCollections: RequestCollection[]) => {
    setCollections(nextCollections);
    writeCollections(nextCollections);
  };

  const addCollection = (name: string, description: string) => {
    if (!name.trim()) return;
    persist([createCollection(name, description), ...collections]);
  };

  const deleteCollection = (collectionId: string) => {
    persist(collections.filter((collection) => collection.id !== collectionId));
  };

  const deleteRequest = (collectionId: string, requestId: string) => {
    persist(
      collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.filter((request) => request.id !== requestId),
              updatedAt: new Date().toISOString(),
            }
          : collection
      )
    );
  };

  const runRequest = (request: SavedRequest) => {
    queueRequestLoad(request);
    window.location.assign("/#workbench");
  };

  return {
    collections,
    addCollection,
    deleteCollection,
    deleteRequest,
    runRequest,
  };
}

export type CollectionsController = ReturnType<typeof useCollections>;
