"use client";

import { ShieldCheck } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import CollectionForm from "@/components/collections/CollectionForm";
import CollectionsEmptyState from "@/components/collections/CollectionsEmptyState";
import CollectionsHeader from "@/components/collections/CollectionsHeader";
import CollectionsList from "@/components/collections/CollectionsList";
import { useLanguage } from "@/context/LanguageContext";
import { useCollections } from "@/hooks/useCollections";

export default function CollectionsPage() {
  const { t } = useLanguage();
  const collections = useCollections();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <CollectionsHeader />
        <CollectionForm onCreate={collections.addCollection} />
        {collections.collections.length === 0 ? <CollectionsEmptyState /> : <CollectionsList controller={collections} />}
        <section className="grid gap-4 rounded-2xl border border-dracula-green/20 bg-dracula-green/5 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <ShieldCheck className="h-7 w-7 text-dracula-green" />
          <p className="text-sm leading-6 text-dracula-comment">{t.collectionsPage.seedNote}</p>
        </section>
      </main>
    </AppChrome>
  );
}
