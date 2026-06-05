"use client";

import { motion } from "framer-motion";
import { ArrowDown, PanelsTopLeft } from "lucide-react";

interface WorkspaceHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onOpenRequest: () => void;
}

export default function WorkspaceHero({ badge, title, subtitle, actionLabel, onOpenRequest }: WorkspaceHeroProps) {
  return (
    <section id="workspace-overview" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan sm:text-xs">
            <PanelsTopLeft className="h-3.5 w-3.5" />
            {badge}
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-dracula-comment sm:text-base">{subtitle}</p>
        </div>
        <motion.button
          type="button"
          onClick={onOpenRequest}
          whileTap={{ scale: 0.96 }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-dracula-cyan px-5 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-cyan/20"
        >
          {actionLabel}
          <ArrowDown className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </section>
  );
}

