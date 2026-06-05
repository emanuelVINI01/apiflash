"use client";

import { motion } from "framer-motion";
import { Clock3, Play } from "lucide-react";
import type { HistoryEntry } from "@/lib/history-storage";
import { formatDateTime, type AppLanguage } from "@/utils/date-format";
import { statusClass } from "@/utils/request-display";

interface HistoryEntryCardProps {
  entry: HistoryEntry;
  index: number;
  language: AppLanguage;
  runAgainLabel: string;
  onRunAgain: (entry: HistoryEntry) => void;
}

export default function HistoryEntryCard({
  entry,
  index,
  language,
  runAgainLabel,
  onRunAgain,
}: HistoryEntryCardProps) {
  return (
    <motion.article
      key={entry.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025 }}
      className="rounded-2xl border border-dracula-card/70 bg-dracula-surface/55 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-dracula-purple/25 bg-dracula-purple/10 px-2 py-1 font-mono text-xs font-bold text-dracula-purple">
              {entry.method}
            </span>
            <span className={`rounded-lg border px-2 py-1 font-mono text-xs font-bold ${statusClass(entry.status)}`}>
              {entry.status} {entry.statusText}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-dracula-card bg-dracula-bg/45 px-2 py-1 font-mono text-xs text-dracula-comment">
              <Clock3 className="h-3 w-3" />
              {entry.duration}ms
            </span>
          </div>
          <p className="mt-3 break-all font-mono text-sm text-dracula-cyan">{entry.url}</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <time className="text-xs text-dracula-comment">{formatDateTime(entry.createdAt, language)}</time>
          <button
            type="button"
            onClick={() => onRunAgain(entry)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-dracula-purple px-3 text-xs font-semibold text-dracula-bg transition-opacity hover:opacity-90"
          >
            <Play className="h-3.5 w-3.5" />
            {runAgainLabel}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

