"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, History, Play, Trash2 } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import { useLanguage } from "@/context/LanguageContext";
import { useHistoryEntries } from "@/hooks/useHistoryEntries";
import { statusClass } from "@/lib/request-style";

export default function HistoryPage() {
  const { language, t } = useLanguage();
  const history = useHistoryEntries();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan sm:text-xs">
              <History className="h-3.5 w-3.5" />
              {t.historyPage.badge}
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">
              {t.historyPage.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">
              {t.historyPage.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={history.clearEntries}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-dracula-red/25 bg-dracula-red/10 px-5 text-sm font-semibold text-dracula-red transition-colors hover:border-dracula-red/50"
          >
            <Trash2 className="h-4 w-4" />
            {t.historyPage.clear}
          </button>
        </motion.section>

        {history.entries.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-8 text-center">
            <History className="mb-5 h-12 w-12 text-dracula-cyan" />
            <h2 className="text-2xl font-semibold text-dracula-fg">{t.historyPage.emptyTitle}</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-dracula-comment">{t.historyPage.emptyText}</p>
            <Link href="/#workbench" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-dracula-cyan px-5 text-sm font-semibold text-dracula-bg">
              {t.historyPage.sendFirst}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <section className="grid gap-3">
            {history.entries.map((entry, index) => (
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
                    <time className="text-xs text-dracula-comment">
                      {new Date(entry.createdAt).toLocaleString(language === "pt" ? "pt-BR" : "en-US")}
                    </time>
                    <button
                      type="button"
                      onClick={() => history.runAgain(entry)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-dracula-purple px-3 text-xs font-semibold text-dracula-bg transition-opacity hover:opacity-90"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {t.historyPage.runAgain}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </main>
    </AppChrome>
  );
}
