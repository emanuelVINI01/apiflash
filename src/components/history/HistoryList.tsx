"use client";

import type { HistoryEntry } from "@/lib/history-storage";
import type { AppLanguage } from "@/utils/date-format";
import HistoryEntryCard from "./HistoryEntryCard";

interface HistoryListProps {
  entries: HistoryEntry[];
  language: AppLanguage;
  runAgainLabel: string;
  onRunAgain: (entry: HistoryEntry) => void;
}

export default function HistoryList({ entries, language, runAgainLabel, onRunAgain }: HistoryListProps) {
  return (
    <section className="grid gap-3">
      {entries.map((entry, index) => (
        <HistoryEntryCard
          key={entry.id}
          entry={entry}
          index={index}
          language={language}
          runAgainLabel={runAgainLabel}
          onRunAgain={onRunAgain}
        />
      ))}
    </section>
  );
}

