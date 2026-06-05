"use client";

import { AlertTriangle } from "lucide-react";

interface ResponseErrorStateProps {
  title: string;
  message: string;
}

export default function ResponseErrorState({ title, message }: ResponseErrorStateProps) {
  return (
    <div className="flex w-full min-w-0 items-start gap-4 rounded-xl border border-dracula-red/30 bg-dracula-red/5 p-6">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dracula-red/20">
        <AlertTriangle className="h-4 w-4 text-dracula-red" />
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-sm font-semibold text-dracula-red">{title}</p>
        <p className="font-mono text-sm leading-relaxed text-dracula-comment">{message}</p>
      </div>
    </div>
  );
}

