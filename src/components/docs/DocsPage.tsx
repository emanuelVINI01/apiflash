"use client";

import AppChrome from "@/components/AppChrome";
import { useLanguage } from "@/context/LanguageContext";
import DocsCards from "./DocsCards";
import DocsHero from "./DocsHero";
import DocsLifecycle from "./DocsLifecycle";

export default function DocsPage() {
  const { t } = useLanguage();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <DocsHero
          badge={t.docsPage.badge}
          title={t.docsPage.title}
          subtitle={t.docsPage.subtitle}
          actionLabel={t.docsPage.runRequest}
        />
        <DocsCards cards={t.docsPage.cards} />
        <DocsLifecycle title={t.docsPage.lifecycleTitle} steps={t.docsPage.lifecycle} />
      </main>
    </AppChrome>
  );
}

