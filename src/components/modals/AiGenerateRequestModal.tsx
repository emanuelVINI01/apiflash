"use client";

import { useState } from "react";
import { Sparkles, Loader2, X, AlertTriangle, ArrowRight, CornerDownRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAiActions } from "@/hooks/useAi";
import type { GeneratedRequest, GeneratedRequestDraft } from "@/services/ai-client";
import { getErrorMessage } from "@/utils/error-message";

interface AiGenerateRequestModalProps {
  open: boolean;
  onClose: () => void;
  onApplied: (draft: GeneratedRequestDraft) => void;
}

export default function AiGenerateRequestModal({ open, onClose, onApplied }: AiGenerateRequestModalProps) {
  const { language } = useLanguage();
  const { generateRequest, isGenerating } = useAiActions();
  const [promptText, setPromptText] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setError(null);
    setGeneratedDraft(null);

    try {
      const res = await generateRequest(promptText, language === "pt" ? "pt-BR" : "en");
      setGeneratedDraft(res.result);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to generate request."));
    }
  };

  const handleApply = () => {
    if (!generatedDraft) return;
    onApplied({
      ...generatedDraft,
      bodyType: generatedDraft.bodyType === "none" ? "json" : generatedDraft.bodyType,
    });
    onClose();
    // Reset states
    setPromptText("");
    setGeneratedDraft(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="flex max-h-[94dvh] w-full max-w-lg flex-col border border-dracula-comment/20 bg-[#1e1f29] rounded-t-[26px] p-5 sm:max-h-[88vh] sm:rounded-2xl sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dracula-comment/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bd93f9]/10">
              <Sparkles className="h-4 w-4 text-[#bd93f9]" />
            </div>
            <h3 className="text-lg font-black text-white sm:text-xl">
              AI Request Designer
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
        <div className="flex-1 overflow-y-auto py-5 space-y-5 scrollbar-thin">
          {!generatedDraft ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#bd93f9]">
                  Describe your HTTP request
                </label>
                <textarea
                  className="w-full rounded-xl bg-black/35 border border-dracula-comment/20 p-3.5 text-sm text-white placeholder-white/20 h-24 focus:outline-none focus:border-[#bd93f9] focus:ring-1 focus:ring-[#bd93f9] resize-none"
                  placeholder="E.g., Fetch list of users from github, passing application/json accept header and page=1 as query param"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-[#ff5555]/30 bg-[#ff5555]/10 px-4 py-2.5 text-xs text-[#ff5555] flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || !promptText.trim()}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#bd93f9] hover:bg-[#bd93f9]/90 text-black text-sm font-black transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Endpoint Configuration
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-xs text-dracula-comment leading-relaxed">
                Review the generated HTTP configuration from the AI. Click &quot;Apply to Workbench&quot; to load it.
              </p>

              {/* Method and URL */}
              <div className="rounded-xl border border-dracula-comment/10 bg-black/25 p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="rounded bg-[#ff79c6]/10 border border-[#ff79c6]/20 px-2 py-0.5 font-bold text-[#ff79c6]">
                    {generatedDraft.method}
                  </span>
                  <span className="text-[#f8f8f2] break-all">{generatedDraft.url}</span>
                </div>
                {generatedDraft.name && (
                  <p className="text-[11px] text-dracula-comment pl-1.5 border-l border-dracula-comment/30">
                    Named: {generatedDraft.name}
                  </p>
                )}
              </div>

              {/* Headers / Params Summary */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#bd93f9]">Extracted Headers</span>
                {generatedDraft.headers && generatedDraft.headers.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {generatedDraft.headers.map((h, i) => (
                      <li key={i} className="flex gap-2 text-[#a7b0c8]">
                        <CornerDownRight className="h-3.5 w-3.5 text-dracula-comment shrink-0" />
                        <span className="font-bold text-white font-mono">{h.key}:</span>
                        <span className="font-mono truncate">{h.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs italic text-dracula-comment pl-2">No headers generated</p>
                )}
              </div>

              {/* Body summary */}
              {generatedDraft.body && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#bd93f9]">Raw Body Template</span>
                    <span className="text-[10px] uppercase font-bold text-dracula-comment">{generatedDraft.bodyType}</span>
                  </div>
                  <pre className="rounded-xl border border-dracula-comment/10 bg-[#111217] p-3 text-xs text-[#f8f8f2] max-h-32 overflow-y-auto font-mono scrollbar-thin">
                    {generatedDraft.body}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setGeneratedDraft(null)}
                  className="h-10 rounded-xl bg-dracula-card hover:bg-dracula-card-hover text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit prompt
                </button>
                <button
                  onClick={handleApply}
                  className="h-10 rounded-xl bg-[#bd93f9] hover:bg-[#bd93f9]/90 text-black text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Apply to Workbench
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
