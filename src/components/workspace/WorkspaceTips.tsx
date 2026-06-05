"use client";

import { CheckCircle2 } from "lucide-react";

interface WorkspaceTipsProps {
  title: string;
  tips: readonly string[];
}

export default function WorkspaceTips({ title, tips }: WorkspaceTipsProps) {
  return (
    <section className="rounded-xl border border-dracula-green/20 bg-dracula-green/5 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {tips.map((tip) => (
          <div key={tip} className="flex min-w-0 gap-3 text-sm leading-6 text-dracula-comment">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dracula-green" />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

