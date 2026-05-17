"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AlertTriangle, CheckCheck, Clock, Copy, Wifi } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { ResponseData } from "@/lib/request-model";

interface ResponseViewerProps {
  response: ResponseData | null;
  error: string | null;
  isLoading: boolean;
}

function getStatusStyle(status: number) {
  if (status >= 200 && status < 300) {
    return {
      textColor: "text-dracula-green",
      bgColor: "bg-dracula-green/10",
      borderColor: "border-dracula-green/30",
      glow: "shadow-[0_0_12px_rgba(80,250,123,0.2)]",
    };
  }
  if (status >= 400 && status < 500) {
    return {
      textColor: "text-dracula-orange",
      bgColor: "bg-dracula-orange/10",
      borderColor: "border-dracula-orange/30",
      glow: "shadow-[0_0_12px_rgba(255,184,108,0.2)]",
    };
  }
  if (status >= 500) {
    return {
      textColor: "text-dracula-red",
      bgColor: "bg-dracula-red/10",
      borderColor: "border-dracula-red/30",
      glow: "shadow-[0_0_12px_rgba(255,85,85,0.2)]",
    };
  }
  return {
    textColor: "text-dracula-cyan",
    bgColor: "bg-dracula-cyan/10",
    borderColor: "border-dracula-cyan/30",
    glow: "",
  };
}

function formatBody(body: unknown): string {
  if (typeof body === "string") {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }
  return JSON.stringify(body, null, 2);
}

function detectLanguage(body: unknown): string {
  if (typeof body === "string") {
    const trimmed = body.trim();
    if (trimmed.startsWith("<")) return "html";
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      return "text";
    }
  }
  return "json";
}

type Tab = "body" | "headers";

export default function ResponseViewer({ response, error, isLoading }: ResponseViewerProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("body");

  const handleCopy = async () => {
    if (!response) return;
    const text = formatBody(response.body);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-dracula-card bg-dracula-card/30 p-10">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-dracula-purple/30 border-t-dracula-purple" />
        </div>
        <p className="animate-pulse font-mono text-sm text-dracula-comment">{t.response.waiting}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full min-w-0 items-start gap-4 rounded-xl border border-dracula-red/30 bg-dracula-red/5 p-6">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dracula-red/20">
          <AlertTriangle className="h-4 w-4 text-dracula-red" />
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-sm font-semibold text-dracula-red">{t.response.errorTitle}</p>
          <p className="font-mono text-sm leading-relaxed text-dracula-comment">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dracula-card/50 bg-dracula-card/20 p-10 text-dracula-comment">
        <Wifi className="h-10 w-10 opacity-20" />
        <p className="text-sm">{t.response.empty}</p>
      </div>
    );
  }

  const statusStyle = getStatusStyle(response.status);
  const lang = detectLanguage(response.body);
  const formattedBody = formatBody(response.body);

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
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
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-1 border-b border-dracula-card">
        {(["body", "headers"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeTab === tab
                ? "border-dracula-purple text-dracula-purple"
                : "border-transparent text-dracula-comment hover:text-dracula-fg"
            }`}
          >
            {tab === "body" ? t.response.body : t.response.headers}
          </button>
        ))}
        {activeTab === "body" && (
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto flex min-w-0 items-center gap-1.5 rounded-lg border border-dracula-card px-3 py-1.5 text-xs text-dracula-comment transition-all duration-200 hover:border-dracula-comment hover:text-dracula-fg sm:mb-1"
          >
            {copied ? (
              <>
                <CheckCheck className="h-3 w-3 text-dracula-green" /> {t.common.copied}
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> {t.common.copy}
              </>
            )}
          </button>
        )}
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-dracula-card">
        {activeTab === "body" ? (
          <SyntaxHighlighter
            language={lang}
            style={dracula}
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "rgba(68,71,90,0.3)",
              fontSize: "13px",
              lineHeight: "1.6",
              maxHeight: "480px",
              overflowY: "auto",
            }}
            wrapLongLines
            showLineNumbers={formattedBody.split("\n").length > 5}
            lineNumberStyle={{ color: "#6272a4", fontSize: "11px" }}
          >
            {formattedBody || t.response.emptyBody}
          </SyntaxHighlighter>
        ) : (
          <div className="max-h-[480px] max-w-full overflow-auto p-4">
            {Object.entries(response.headers).length === 0 ? (
              <p className="font-mono text-sm text-dracula-comment">{t.response.emptyHeaders}</p>
            ) : (
              <table className="w-full table-fixed border-collapse font-mono text-sm">
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className="border-b border-dracula-card/50 transition-colors hover:bg-dracula-card/30">
                      <td className="w-2/5 break-all py-2 pr-4 align-top text-dracula-purple">{key}</td>
                      <td className="break-all py-2 text-dracula-fg">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
