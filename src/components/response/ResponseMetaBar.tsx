"use client";

import { Clock, Sparkles } from "lucide-react";
import type { ResponseData } from "@/lib/request-model";
import { responseStatusStyle } from "@/utils/request-display";

interface ResponseMetaBarProps {
  response: ResponseData;
  onAnalyze?: () => void;
}

export default function ResponseMetaBar({ response, onAnalyze }: ResponseMetaBarProps) {
  const statusStyle = responseStatusStyle(response.status);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className={`flex min-w-0 items-center gap-2 rounded-xl border px-4 py-2 font-mono text-sm font-bold ${statusStyle.textColor} ${statusStyle.bgColor} ${statusStyle.borderColor} ${statusStyle.glow}`}
      >
        <span className="text-lg">{response.status}</span>
        <span className="font-normal opacity-75">{response.statusText}</span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-dracula-card/50 px-3 py-1.5 font-mono text-xs text-dracula-comment">
        <Clock className="h-3.5 w-3.5" />
        <span>{response.duration}ms</span>
      </div>
      {onAnalyze && (
        <button
          onClick={onAnalyze}
          className="flex min-w-0 items-center gap-1.5 rounded-lg bg-[#bd93f9]/10 hover:bg-[#bd93f9]/20 border border-[#bd93f9]/20 px-3 py-1.5 font-mono text-xs text-[#bd93f9] transition-colors cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Analyze with AI</span>
        </button>
      )}
    </div>
  );
}

