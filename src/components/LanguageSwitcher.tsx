"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Flag, { FLAGS, type LocaleCode } from "@/components/Flag";

const LOCALES: LocaleCode[] = ["pt", "en"];

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.common.toggleLanguage}
      className={`inline-flex items-center gap-1 rounded-lg border border-dracula-card bg-dracula-card/30 p-1 ${className ?? ""}`}
    >
      {LOCALES.map((locale) => {
        const isActive = language === locale;

        return (
          <motion.button
            key={locale}
            type="button"
            onClick={() => setLanguage(locale)}
            whileTap={{ scale: 0.92 }}
            aria-pressed={isActive}
            title={FLAGS[locale].label}
            className={`flex h-7 w-9 items-center justify-center rounded-md transition-colors ${
              isActive ? "bg-dracula-cyan/15 ring-1 ring-dracula-cyan/60" : "opacity-50 hover:opacity-90"
            }`}
          >
            <Flag locale={locale} size={18} />
          </motion.button>
        );
      })}
    </div>
  );
}
