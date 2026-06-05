"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText } from "lucide-react";

interface DocsHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  actionLabel: string;
}

export default function DocsHero({ badge, title, subtitle, actionLabel }: DocsHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
    >
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-green/25 bg-dracula-green/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-green sm:text-xs">
          <BookOpenText className="h-3.5 w-3.5" />
          {badge}
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">{subtitle}</p>
      </div>
      <Link
        href="/workspace#workbench"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-dracula-green px-5 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-green/20"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.section>
  );
}
