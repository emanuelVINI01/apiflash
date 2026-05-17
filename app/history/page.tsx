"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, History, Trash2, Zap } from "lucide-react";
import AppChrome from "@/components/AppChrome";

const HISTORY_KEY = "apiflash-history-v1";

type HistoryEntry = {
  id: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  duration: number;
  createdAt: string;
};

function statusClass(status: number) {
  if (status >= 200 && status < 300) return "border-dracula-green/30 bg-dracula-green/10 text-dracula-green";
  if (status >= 400) return "border-dracula-red/30 bg-dracula-red/10 text-dracula-red";
  return "border-dracula-cyan/30 bg-dracula-cyan/10 text-dracula-cyan";
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as HistoryEntry[];
        setEntries(Array.isArray(stored) ? stored : []);
      } catch {
        setEntries([]);
      }
    });
  }, []);

  const clearHistory = () => {
    window.localStorage.removeItem(HISTORY_KEY);
    setEntries([]);
  };

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan sm:text-xs">
              <History className="h-3.5 w-3.5" />
              Local request history
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">
              Review the calls that succeeded in this browser.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">
              apiFlash stores the latest successful responses in localStorage, keeping endpoint debugging fast without adding accounts or a backend database.
            </p>
          </div>
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-dracula-red/25 bg-dracula-red/10 px-5 text-sm font-semibold text-dracula-red transition-colors hover:border-dracula-red/50"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        </motion.section>

        {entries.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-8 text-center">
            <Zap className="mb-5 h-12 w-12 text-dracula-cyan" />
            <h2 className="text-2xl font-semibold text-dracula-fg">No requests saved yet</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-dracula-comment">
              Run a successful request from the workbench and it will appear here with status, duration and timestamp.
            </p>
            <Link href="/#workbench" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-dracula-cyan px-5 text-sm font-semibold text-dracula-bg">
              Send first request
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <section className="grid gap-3">
            {entries.map((entry, index) => (
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
                  <time className="text-xs text-dracula-comment">
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </main>
    </AppChrome>
  );
}
