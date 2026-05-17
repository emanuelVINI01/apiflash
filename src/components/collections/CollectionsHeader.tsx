"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Library } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CollectionsHeader() {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
    >
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-purple/25 bg-dracula-purple/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-purple sm:text-xs">
          <Library className="h-3.5 w-3.5" />
          {t.collectionsPage.badge}
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">
          {t.collectionsPage.title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">
          {t.collectionsPage.subtitle}
        </p>
      </div>
      <Link
        href="/#workbench"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-dracula-purple px-5 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-purple/20"
      >
        {t.collectionsPage.openWorkbench}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.section>
  );
}
