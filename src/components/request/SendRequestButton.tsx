"use client";

import { Loader2, Send } from "lucide-react";

interface SendRequestButtonProps {
  disabled: boolean;
  isLoading: boolean;
  sendLabel: string;
  sendingLabel: string;
}

export default function SendRequestButton({
  disabled,
  isLoading,
  sendLabel,
  sendingLabel,
}: SendRequestButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex h-12 min-w-0 shrink-0 items-center justify-center gap-2 rounded-xl bg-dracula-purple px-6 text-sm font-semibold text-dracula-bg transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{sendingLabel}</span>
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          <span>{sendLabel}</span>
        </>
      )}
    </button>
  );
}

