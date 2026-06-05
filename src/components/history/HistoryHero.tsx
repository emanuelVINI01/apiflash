"use client";

import { motion } from "framer-motion";
import { History, Trash2 } from "lucide-react";

interface HistoryHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  clearLabel: string;
  onClear: () => void;
}

export default function HistoryHero({ badge, title, subtitle, clearLabel, onClear }: HistoryHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
    >
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan sm:text-xs">
          <History className="h-3.5 w-3.5" />
          {badge}
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-dracula-red/25 bg-dracula-red/10 px-5 text-sm font-semibold text-dracula-red transition-colors hover:border-dracula-red/50"
      >
        <Trash2 className="h-4 w-4" />
        {clearLabel}
      </button>
    </motion.section>
  );
}

