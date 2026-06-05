"use client";

import { Wifi } from "lucide-react";

interface ResponseEmptyStateProps {
  label: string;
}

export default function ResponseEmptyState({ label }: ResponseEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dracula-card/50 bg-dracula-card/20 p-10 text-dracula-comment">
      <Wifi className="h-10 w-10 opacity-20" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

