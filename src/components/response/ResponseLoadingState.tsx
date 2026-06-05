"use client";

interface ResponseLoadingStateProps {
  label: string;
}

export default function ResponseLoadingState({ label }: ResponseLoadingStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-dracula-card bg-dracula-card/30 p-10">
      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dracula-purple/30 border-t-dracula-purple" />
      </div>
      <p className="animate-pulse font-mono text-sm text-dracula-comment">{label}</p>
    </div>
  );
}

