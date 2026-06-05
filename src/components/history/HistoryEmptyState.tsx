"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";

interface HistoryEmptyStateProps {
  title: string;
  text: string;
  actionLabel: string;
}

export default function HistoryEmptyState({ title, text, actionLabel }: HistoryEmptyStateProps) {
  return (
    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-8 text-center">
      <History className="mb-5 h-12 w-12 text-dracula-cyan" />
      <h2 className="text-2xl font-semibold text-dracula-fg">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-dracula-comment">{text}</p>
      <Link
        href="/workspace#workbench"
        className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-dracula-cyan px-5 text-sm font-semibold text-dracula-bg"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
