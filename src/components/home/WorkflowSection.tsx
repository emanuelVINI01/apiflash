"use client";

import { Code2, History, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const workflowIcons = [Layers3, ShieldCheck, History, Code2];

export default function WorkflowSection() {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-dracula-card/70 bg-dracula-bg/35 p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-green">
            <Sparkles className="h-4 w-4" />
            {t.home.workflowBadge}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-dracula-fg">{t.home.workflowTitle}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.home.workflowItems.map((text, index) => {
            const Icon = workflowIcons[index];

            return (
              <div
                key={text}
                className="rounded-xl border border-dracula-card/70 bg-dracula-card/20 p-4 text-sm leading-6 text-dracula-comment"
              >
                <Icon className="mb-3 h-5 w-5 text-dracula-cyan" />
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
