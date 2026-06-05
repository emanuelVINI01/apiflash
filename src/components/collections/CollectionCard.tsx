"use client";

import { motion } from "framer-motion";
import { Play, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { methodClass } from "@/utils/request-display";
import type { RequestCollection, SavedRequest } from "@/lib/request-model";

interface CollectionCardProps {
  collection: RequestCollection;
  index: number;
  onDeleteCollection: (collectionId: string) => void;
  onDeleteRequest: (collectionId: string, requestId: string) => void;
  onRunRequest: (request: SavedRequest) => void;
}

export default function CollectionCard({
  collection,
  index,
  onDeleteCollection,
  onDeleteRequest,
  onRunRequest,
}: CollectionCardProps) {
  const { t } = useLanguage();

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="rounded-2xl border border-dracula-card/75 bg-dracula-surface/60 p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-dracula-fg">{collection.name}</h2>
          {collection.description && <p className="mt-2 text-sm leading-6 text-dracula-comment">{collection.description}</p>}
          <p className="mt-3 font-mono text-xs text-dracula-comment">
            {collection.requests.length} {t.collectionsPage.savedRequests}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDeleteCollection(collection.id)}
          className="inline-flex h-9 w-fit items-center gap-2 rounded-lg border border-dracula-red/25 bg-dracula-red/10 px-3 text-xs font-semibold text-dracula-red transition-colors hover:border-dracula-red/50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t.collectionsPage.deleteCollection}
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {collection.requests.length === 0 ? (
          <p className="rounded-xl border border-dracula-card bg-dracula-bg/35 p-4 text-sm text-dracula-comment">
            {t.collectionsPage.noRequests}
          </p>
        ) : (
          collection.requests.map((request) => (
            <div
              key={request.id}
              className="grid gap-3 rounded-xl border border-dracula-card bg-dracula-bg/35 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center"
            >
              <span className={`w-fit rounded-lg border px-2 py-1 font-mono text-xs font-bold ${methodClass(request.method)}`}>
                {request.method}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-dracula-fg">{request.name}</h3>
                <p className="mt-1 break-all font-mono text-xs text-dracula-cyan">{request.url}</p>
                <p className="mt-2 text-xs text-dracula-comment">
                  {request.queryParams.filter((param) => param.enabled).length} params /{" "}
                  {request.headers.filter((header) => header.enabled).length} headers / {request.auth.type}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onRunRequest(request)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-dracula-purple px-3 text-xs font-semibold text-dracula-bg transition-opacity hover:opacity-90"
                >
                  <Play className="h-3.5 w-3.5" />
                  {t.collectionsPage.runRequest}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(collection.id, request.id)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-dracula-red/25 bg-dracula-red/10 px-3 text-xs font-semibold text-dracula-red transition-colors hover:border-dracula-red/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t.collectionsPage.deleteRequest}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.article>
  );
}
