"use client";

import { Workflow } from "lucide-react";

interface LifecycleStep {
  title: string;
  text: string;
}

interface DocsLifecycleProps {
  title: string;
  steps: readonly LifecycleStep[];
}

export default function DocsLifecycle({ title, steps }: DocsLifecycleProps) {
  return (
    <section className="rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Workflow className="h-5 w-5 text-dracula-purple" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">{title}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border border-dracula-card bg-dracula-bg/35 p-4">
            <span className="font-mono text-xs text-dracula-purple">0{index + 1}</span>
            <h3 className="mt-3 font-semibold text-dracula-fg">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-dracula-comment">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
