"use client";

import { SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { BodyType, RequestOptions } from "@/lib/request-model";

interface RequestOptionsEditorProps {
  options: RequestOptions;
  bodyType: BodyType;
  onOptionsChange: (options: RequestOptions) => void;
  onBodyTypeChange: (bodyType: BodyType) => void;
}

const BODY_TYPES: BodyType[] = ["json", "text", "form"];

export default function RequestOptionsEditor({
  options,
  bodyType,
  onOptionsChange,
  onBodyTypeChange,
}: RequestOptionsEditorProps) {
  const { t } = useLanguage();

  const bodyTypeLabel: Record<BodyType, string> = {
    json: t.request.body.jsonLabel,
    text: t.request.body.textLabel,
    form: t.request.body.formLabel,
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-dracula-green" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dracula-comment">{t.request.options.title}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-medium text-dracula-comment">
          {t.request.options.timeout}
          <input
            type="number"
            min={1000}
            max={120000}
            step={1000}
            value={options.timeoutMs}
            onChange={(event) => onOptionsChange({ ...options, timeoutMs: Number(event.target.value) || 30000 })}
            className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg focus:border-dracula-purple focus:outline-none"
          />
        </label>

        <label className="grid gap-1.5 text-xs font-medium text-dracula-comment">
          {t.request.options.bodyType}
          <select
            value={bodyType}
            onChange={(event) => onBodyTypeChange(event.target.value as BodyType)}
            className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg focus:border-dracula-purple focus:outline-none"
          >
            {BODY_TYPES.map((type) => (
              <option key={type} value={type} className="bg-dracula-bg text-dracula-fg">
                {bodyTypeLabel[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-dracula-comment">
        <input
          type="checkbox"
          checked={options.followRedirects}
          onChange={(event) => onOptionsChange({ ...options, followRedirects: event.target.checked })}
          className="h-4 w-4 rounded border-dracula-card bg-dracula-bg text-dracula-purple focus:ring-dracula-purple/50 focus:ring-offset-0"
        />
        {t.request.options.followRedirects}
      </label>
    </div>
  );
}
