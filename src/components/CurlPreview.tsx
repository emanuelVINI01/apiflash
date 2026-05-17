"use client";

import { useState } from "react";
import { CheckCheck, Copy, Terminal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { buildCurlCommand, type RequestDraft } from "@/lib/request-model";

interface CurlPreviewProps {
  draft: RequestDraft;
}

export default function CurlPreview({ draft }: CurlPreviewProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const curl = buildCurlCommand(draft);

  const handleCopy = async () => {
    if (!curl) return;
    await navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl border border-dracula-card bg-dracula-bg/35 p-4">
      <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-dracula-cyan" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dracula-comment">{t.request.curl.title}</h3>
          </div>
          <p className="mt-1 text-xs leading-5 text-dracula-comment">{t.request.curl.hint}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!curl}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-dracula-card px-2.5 text-xs text-dracula-comment transition-colors hover:border-dracula-comment hover:text-dracula-fg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? <CheckCheck className="h-3.5 w-3.5 text-dracula-green" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t.common.copied : t.common.copy}
        </button>
      </div>
      <pre className="max-h-40 overflow-auto rounded-lg border border-dracula-card bg-dracula-card/30 p-3 font-mono text-xs leading-5 text-dracula-fg">
        {curl || t.request.curl.empty}
      </pre>
    </div>
  );
}
