"use client";

import AppChrome from "@/components/AppChrome";
import { useLanguage } from "@/context/LanguageContext";
import { useHistoryEntries } from "@/hooks/useHistoryEntries";
import HistoryEmptyState from "./HistoryEmptyState";
import HistoryHero from "./HistoryHero";
import HistoryList from "./HistoryList";

export default function HistoryPage() {
  const { language, t } = useLanguage();
  const history = useHistoryEntries();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <HistoryHero
          badge={t.historyPage.badge}
          title={t.historyPage.title}
          subtitle={t.historyPage.subtitle}
          clearLabel={t.historyPage.clear}
          onClear={history.clearEntries}
        />

        {history.entries.length === 0 ? (
          <HistoryEmptyState
            title={t.historyPage.emptyTitle}
            text={t.historyPage.emptyText}
            actionLabel={t.historyPage.sendFirst}
          />
        ) : (
          <HistoryList
            entries={history.entries}
            language={language}
            runAgainLabel={t.historyPage.runAgain}
            onRunAgain={history.runAgain}
          />
        )}
      </main>
    </AppChrome>
  );
}

