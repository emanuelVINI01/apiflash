"use client";

import { signIn } from "next-auth/react";
import { CheckCheck, Library, Loader2, Save } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useSaveToCollection } from "@/hooks/useSaveToCollection";
import type { RequestDraft } from "@/lib/request-model";

interface SaveToCollectionProps {
  draft: RequestDraft;
}

export default function SaveToCollection({ draft }: SaveToCollectionProps) {
  const { t } = useLanguage();
  const {
    collections,
    collectionId,
    requestName,
    saved,
    isAuthenticated,
    isSaving,
    error,
    suggestedName,
    setCollectionId,
    setRequestName,
    saveRequest,
  } = useSaveToCollection(draft);

  return (
    <div className="rounded-xl border border-dracula-card bg-dracula-card/20 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Library className="h-4 w-4 text-dracula-purple" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dracula-comment">
          {t.request.saveToCollection.title}
        </h3>
      </div>

      {!isAuthenticated ? (
        <div className="grid gap-3">
          <p className="text-sm leading-6 text-dracula-comment">{t.request.saveToCollection.loginRequired}</p>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/workspace" })}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-dracula-cyan px-4 text-sm font-semibold text-dracula-bg transition-opacity hover:opacity-90"
          >
            <FaGithub className="h-4 w-4" />
            {t.common.login}
          </button>
        </div>
      ) : collections.length === 0 ? (
        <p className="text-sm leading-6 text-dracula-comment">{t.request.saveToCollection.emptyCollections}</p>
      ) : (
        <div className="grid gap-2">
          <input
            type="text"
            value={requestName}
            onChange={(event) => setRequestName(event.target.value)}
            placeholder={suggestedName || t.request.saveToCollection.namePlaceholder}
            className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
          />
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <select
              value={collectionId}
              onChange={(event) => setCollectionId(event.target.value)}
              className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg focus:border-dracula-purple focus:outline-none"
            >
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id} className="bg-dracula-bg text-dracula-fg">
                  {collection.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={saveRequest}
              disabled={!draft.url.trim() || !collectionId || isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-dracula-purple px-4 text-sm font-semibold text-dracula-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCheck className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? t.request.saveToCollection.saved : t.request.saveToCollection.save}
            </button>
          </div>
          {error && <p className="text-xs text-dracula-red">{error}</p>}
        </div>
      )}
    </div>
  );
}
