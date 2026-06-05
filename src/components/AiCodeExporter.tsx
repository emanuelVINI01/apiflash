"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles, Loader2, Copy, Check, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLanguage } from "@/context/LanguageContext";
import { useAiActions } from "@/hooks/useAi";
import type { RequestDraft } from "@/lib/request-model";
import { getErrorMessage } from "@/utils/error-message";

interface AiCodeExporterProps {
  draft: RequestDraft;
}

type TargetLang = "fetch" | "axios" | "python" | "go";

export default function AiCodeExporter({ draft }: AiCodeExporterProps) {
  useLanguage();
  const { generateCode, isGeneratingCode } = useAiActions();
  const [selectedLang, setSelectedLang] = useState<TargetLang>("fetch");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCode = useCallback(async (lang: TargetLang) => {
    setError(null);
    try {
      const reqPayload = {
        method: draft.method,
        url: draft.url,
        headers: draft.headers.reduce<Record<string, string>>((acc, h) => {
          if (h.enabled && h.key) acc[h.key] = h.value;
          return acc;
        }, {}),
        body: draft.body,
        bodyType: draft.bodyType,
      };

      const codeString = await generateCode(reqPayload, lang);
      setGeneratedCode(codeString);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to generate SDK code."));
    }
  }, [draft.body, draft.bodyType, draft.headers, draft.method, draft.url, generateCode]);

  useEffect(() => {
    if (draft.url) {
      queueMicrotask(() => {
        void fetchCode(selectedLang);
      });
    }
  }, [fetchCode, selectedLang, draft.url]);

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang: TargetLang) => {
    switch (lang) {
      case "fetch":
        return "Fetch API";
      case "axios":
        return "Axios (JS)";
      case "python":
        return "Python Requests";
      case "go":
        return "Go net/http";
    }
  };

  return (
    <div className="rounded-xl border border-dracula-card bg-dracula-bg/35 p-4 flex flex-col justify-between">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#bd93f9]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dracula-comment">
              AI Client SDK Exporter
            </h3>
          </div>
          <p className="mt-1 text-xs text-dracula-comment">
            Generate client integration code snippets dynamically.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap gap-1 rounded-lg bg-black/25 p-1 border border-dracula-comment/10">
          {(["fetch", "axios", "python", "go"] as TargetLang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                selectedLang === lang
                  ? "bg-[#bd93f9] text-black"
                  : "text-dracula-comment hover:text-dracula-fg"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Code Body */}
      {isGeneratingCode ? (
        <div className="flex min-h-[140px] flex-col items-center justify-center space-y-2 text-center bg-dracula-card/25 border border-dracula-comment/5 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-[#bd93f9]" />
          <p className="text-[10px] text-dracula-comment">Generating technical SDK code...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-[140px] flex-col items-center justify-center space-y-2 text-center bg-[#ff5555]/5 border border-[#ff5555]/10 rounded-lg p-3">
          <p className="text-xs text-[#ff5555] font-semibold">Generation Failed</p>
          <p className="text-[10px] text-dracula-comment leading-relaxed">{error}</p>
        </div>
      ) : generatedCode ? (
        <div className="space-y-3">
          <div className="relative group overflow-hidden rounded-lg border border-dracula-comment/10 bg-[#111217]">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-dracula-card hover:bg-dracula-card-hover border border-dracula-comment/15 flex items-center justify-center text-white transition-all opacity-90 hover:opacity-100 cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#50fa7b]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            
            <SyntaxHighlighter
              language={selectedLang === "python" ? "python" : selectedLang === "go" ? "go" : "javascript"}
              style={dracula}
              customStyle={{ margin: 0, padding: "1.2rem", fontSize: "0.75rem", background: "#111217", maxHeight: "200px" }}
            >
              {generatedCode}
            </SyntaxHighlighter>
          </div>
          <div className="flex justify-between items-center text-[10px] text-dracula-comment px-1">
            <span>Generated as {getLanguageLabel(selectedLang)}</span>
            <span className="flex items-center gap-1 text-[#bd93f9]">
              <Sparkles className="h-3 w-3 animate-pulse" /> AI Native
            </span>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[140px] flex-col items-center justify-center text-center bg-dracula-card/10 border border-dashed border-dracula-comment/10 rounded-lg">
          <p className="text-xs text-dracula-comment">Enter a URL to generate SDK integration code</p>
        </div>
      )}
    </div>
  );
}
