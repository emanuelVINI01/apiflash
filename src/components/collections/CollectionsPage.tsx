"use client";

import { signIn } from "next-auth/react";
import { Loader2, LockKeyhole } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import AppChrome from "@/components/AppChrome";
import { useLanguage } from "@/context/LanguageContext";
import { useCollections } from "@/hooks/useCollections";
import CollectionForm from "./CollectionForm";
import CollectionsEmptyState from "./CollectionsEmptyState";
import CollectionsHeader from "./CollectionsHeader";
import CollectionsList from "./CollectionsList";
import CollectionsSeedNote from "./CollectionsSeedNote";

export default function CollectionsPage() {
  const { t } = useLanguage();
  const collections = useCollections();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <CollectionsHeader />
        {!collections.isAuthenticated ? (
          <CollectionsAuthGate />
        ) : (
          <>
            <CollectionForm onCreate={collections.addCollection} disabled={collections.isLoading} />
            {collections.isLoading ? (
              <section className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dracula-card/70 bg-dracula-card/20 text-dracula-comment">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-dracula-cyan" />
                {t.collectionsPage.loading}
              </section>
            ) : collections.collections.length === 0 ? (
              <CollectionsEmptyState />
            ) : (
              <CollectionsList controller={collections} />
            )}
            {collections.error && (
              <p className="rounded-xl border border-dracula-red/30 bg-dracula-red/10 p-3 text-sm text-dracula-red">
                {collections.error}
              </p>
            )}
          </>
        )}
        <CollectionsSeedNote text={t.collectionsPage.seedNote} />
      </main>
    </AppChrome>
  );
}

function CollectionsAuthGate() {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-8 text-center">
      <LockKeyhole className="mb-5 h-12 w-12 text-dracula-cyan" />
      <h2 className="text-2xl font-semibold text-dracula-fg">{t.collectionsPage.loginTitle}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-dracula-comment">{t.collectionsPage.loginText}</p>
      <button
        type="button"
        onClick={() => signIn("github", { callbackUrl: "/collections" })}
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-dracula-cyan px-5 text-sm font-semibold text-dracula-bg transition-opacity hover:opacity-90"
      >
        <FaGithub className="h-4 w-4" />
        {t.collectionsPage.loginCta}
      </button>
    </section>
  );
}
