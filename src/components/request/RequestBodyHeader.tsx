"use client";

import { AlertCircle, CheckCircle2, Code2, Eye, EyeOff } from "lucide-react";

interface RequestBodyHeaderProps {
  title: string;
  typeLabel: string;
  previewMode: boolean;
  canFormat: boolean;
  showsJsonStatus: boolean;
  validJson: boolean;
  labels: {
    validJson: string;
    invalidJson: string;
    format: string;
    edit: string;
    preview: string;
  };
  onFormat: () => void;
  onTogglePreview: () => void;
}

export default function RequestBodyHeader({
  title,
  typeLabel,
  previewMode,
  canFormat,
  showsJsonStatus,
  validJson,
  labels,
  onFormat,
  onTogglePreview,
}: RequestBodyHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Code2 className="h-4 w-4 text-dracula-purple" />
        <span className="text-xs font-semibold uppercase tracking-widest text-dracula-comment">{title}</span>
        <span className="text-xs text-dracula-comment">({typeLabel})</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showsJsonStatus && (
          <div
            className={`flex min-w-0 items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs ${
              validJson ? "bg-dracula-green/10 text-dracula-green" : "bg-dracula-red/10 text-dracula-red"
            }`}
          >
            {validJson ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> {labels.validJson}
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" /> {labels.invalidJson}
              </>
            )}
          </div>
        )}
        {canFormat && (
          <button
            type="button"
            onClick={onFormat}
            className="rounded-lg border border-dracula-card px-3 py-1 text-xs text-dracula-comment transition-all duration-200 hover:border-dracula-comment hover:text-dracula-fg"
          >
            {labels.format}
          </button>
        )}
        <button
          type="button"
          onClick={onTogglePreview}
          className="flex items-center gap-1.5 rounded-lg border border-dracula-card px-3 py-1 text-xs text-dracula-comment transition-all duration-200 hover:border-dracula-comment hover:text-dracula-fg"
        >
          {previewMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {previewMode ? labels.edit : labels.preview}
        </button>
      </div>
    </div>
  );
}

