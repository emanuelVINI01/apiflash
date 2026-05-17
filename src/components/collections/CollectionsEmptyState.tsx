"use client";

import { Library } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CollectionsEmptyState() {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-8 text-center">
      <Library className="mb-5 h-12 w-12 text-dracula-purple" />
      <h2 className="text-2xl font-semibold text-dracula-fg">{t.collectionsPage.emptyTitle}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-dracula-comment">{t.collectionsPage.emptyText}</p>
    </section>
  );
}
