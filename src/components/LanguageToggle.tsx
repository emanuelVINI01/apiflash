"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <motion.button
      type="button"
      onClick={toggleLanguage}
      whileTap={{ scale: 0.94 }}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dracula-card bg-dracula-card/30 px-2.5 text-xs font-semibold uppercase tracking-widest text-dracula-fg transition-colors hover:border-dracula-purple/50 hover:text-dracula-purple sm:px-3"
      title={t.common.toggleLanguage}
      aria-label={t.common.toggleLanguage}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{language.toUpperCase()}</span>
    </motion.button>
  );
}
