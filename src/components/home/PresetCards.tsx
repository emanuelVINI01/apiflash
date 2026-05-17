"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { presetDrafts } from "@/lib/workbench-presets";
import type { RequestDraft } from "@/lib/request-model";

interface PresetCardsProps {
  onApply: (draft: RequestDraft) => void;
}

export default function PresetCards({ onApply }: PresetCardsProps) {
  const { t } = useLanguage();

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {presetDrafts.map((preset, index) => (
        <motion.button
          key={`${preset.method}-${preset.url}`}
          type="button"
          onClick={() => onApply(preset)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ delay: index * 0.05, duration: 0.32 }}
          className="group rounded-xl border border-dracula-card/75 bg-dracula-card/25 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-dracula-cyan/45 hover:bg-dracula-card/35"
        >
          <span className="rounded-lg border border-dracula-cyan/20 bg-dracula-cyan/10 px-2 py-1 font-mono text-xs font-bold text-dracula-cyan">
            {preset.method}
          </span>
          <h2 className="mt-4 text-base font-semibold text-dracula-fg">{t.home.presets[index].title}</h2>
          <p className="mt-2 text-sm leading-6 text-dracula-comment">{t.home.presets[index].description}</p>
        </motion.button>
      ))}
    </section>
  );
}
