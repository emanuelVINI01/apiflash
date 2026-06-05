"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, X, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLanguage } from "@/context/LanguageContext";
import { useAiActions } from "@/hooks/useAi";
import type { ResponseAnalysis } from "@/services/ai-client";
import type { KeyValueRow } from "@/types/request";
import { getErrorMessage } from "@/utils/error-message";

interface AiAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  requestData: {
    method: string;
    url: string;
    headers: KeyValueRow[];
    body: string;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
  } | null;
}

export default function AiAnalysisModal({ open, onClose, requestData, response }: AiAnalysisModalProps) {
  const { language } = useLanguage();
  const { analyze, isAnalyzing } = useAiActions();
  const [analysis, setAnalysis] = useState<ResponseAnalysis | null>(null);
  const [isCacheHit, setIsCacheHit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && response) {
      queueMicrotask(() => {
        setAnalysis(null);
        setError(null);

        const responseBodyString =
          typeof response.body === "string"
            ? response.body
            : JSON.stringify(response.body, null, 2);

        const requestHeaders = requestData.headers.reduce<Record<string, string>>((headers, row) => {
          if (row.enabled && row.key.trim()) {
            headers[row.key.trim()] = row.value;
          }
          return headers;
        }, {});

        const payload = {
          method: requestData.method,
          url: requestData.url,
          requestHeaders,
          requestBody: requestData.body || "",
          responseStatus: response.status,
          responseHeaders: response.headers || {},
          responseBody: responseBodyString,
        };

        analyze(payload, language === "pt" ? "pt-BR" : "en")
          .then((res) => {
            setAnalysis(res.analysis);
            setIsCacheHit(res.cacheHit);
          })
          .catch((err: unknown) => {
            setError(getErrorMessage(err, "Failed to analyze response"));
          });
      });
    }
  }, [analyze, language, open, requestData.body, requestData.headers, requestData.method, requestData.url, response]);

  const handleCopyType = async () => {
    if (!analysis?.tsType) return;
    await navigator.clipboard.writeText(analysis.tsType);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  const getRiskColor = (level = "") => {
    if (level === "low") return "text-[#50fa7b] bg-[#50fa7b]/10 border-[#50fa7b]/20";
    if (level === "medium") return "text-[#ffb86c] bg-[#ffb86c]/10 border-[#ffb86c]/20";
    return "text-[#ff5555] bg-[#ff5555]/10 border-[#ff5555]/20";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="flex max-h-[94dvh] w-full max-w-2xl flex-col border border-dracula-comment/20 bg-[#1e1f29] rounded-t-[26px] p-5 sm:max-h-[88vh] sm:rounded-2xl sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dracula-comment/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bd93f9]/10">
              <Sparkles className="h-4 w-4 text-[#bd93f9]" />
            </div>
            <h3 className="text-lg font-black text-white sm:text-xl">
              AI Response Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-dracula-card hover:bg-dracula-card-hover text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 scrollbar-thin">
          {isAnalyzing ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#bd93f9]/10 opacity-75"></span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#bd93f9]/20">
                  <Loader2 className="h-6 w-6 animate-spin text-[#bd93f9]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Analyzing payload structure...</p>
                <p className="mt-1 text-xs text-dracula-comment">Scanning headers, generating types, checking security policies</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5555]/10">
                <AlertTriangle className="h-6 w-6 text-[#ff5555]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Analysis Failed</p>
                <p className="mt-1 text-xs text-[#ff5555]">{error}</p>
              </div>
              <button
                onClick={() => onClose()}
                className="rounded-lg bg-dracula-card px-4 py-2 text-xs font-bold text-white hover:bg-dracula-card-hover"
              >
                Close
              </button>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Cache Hit */}
              {isCacheHit && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#50fa7b]/10 border border-[#50fa7b]/20 px-3 py-1.5 text-xs text-[#50fa7b]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cache hit! Request resolved instantly with no daily quota consumed.</span>
                </div>
              )}

              {/* Description */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#bd93f9]">AI Summary</span>
                <p className="mt-1 text-sm leading-relaxed text-[#f8f8f2]">
                  {analysis.description}
                </p>
              </div>

              {/* TS Type Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#bd93f9]">TypeScript Interface</span>
                  <button
                    onClick={handleCopyType}
                    className="flex items-center gap-1 text-xs text-[#8be9fd] hover:text-[#bd93f9] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy declaration"}</span>
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl border border-dracula-comment/10">
                  <SyntaxHighlighter
                    language="typescript"
                    style={dracula}
                    customStyle={{ margin: 0, padding: "1rem", fontSize: "0.8rem", background: "#111217" }}
                  >
                    {analysis.tsType}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Security Audit */}
              <div className="rounded-xl border border-dracula-comment/10 bg-black/25 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-[#8be9fd]" />
                    <span className="text-xs font-bold text-white">Security & Header Audit</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded ${getRiskColor(analysis.riskLevel)}`}>
                    {analysis.riskLevel} Risk
                  </span>
                </div>
                {analysis.securityReview && analysis.securityReview.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.securityReview.map((item: string, i: number) => (
                      <li key={i} className="text-xs leading-relaxed text-[#a7b0c8] flex items-start gap-2">
                        <span className="text-[#ff5555] font-black">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[#50fa7b]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>No vulnerabilities or concerns detected. Good configuration!</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
