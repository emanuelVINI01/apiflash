"use client";

import { useCallback, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AlertCircle, CheckCircle2, Code2, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { canSendBody, type BodyType, type HttpMethod } from "@/lib/request-model";

interface RequestBodyEditorProps {
  body: string;
  method: HttpMethod;
  bodyType: BodyType;
  onChange: (value: string) => void;
}

function isValidJson(str: string): boolean {
  if (!str.trim()) return true;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function prettyJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export default function RequestBodyEditor({ body, method, bodyType, onChange }: RequestBodyEditorProps) {
  const { t } = useLanguage();
  const [previewMode, setPreviewMode] = useState(false);
  const [focused, setFocused] = useState(false);

  const isBodyMethod = canSendBody(method);
  const validatesJson = bodyType === "json";
  const valid = !validatesJson || isValidJson(body);

  const handleFormat = useCallback(() => {
    if (validatesJson && valid && body.trim()) {
      onChange(prettyJson(body));
    }
  }, [body, valid, validatesJson, onChange]);

  const bodyTypeLabel: Record<BodyType, string> = {
    json: t.request.body.jsonLabel,
    text: t.request.body.textLabel,
    form: t.request.body.formLabel,
  };

  const placeholder: Record<BodyType, string> = {
    json: t.request.body.jsonPlaceholder,
    text: t.request.body.textPlaceholder,
    form: t.request.body.formPlaceholder,
  };

  const previewLanguage: Record<BodyType, string> = {
    json: "json",
    text: "text",
    form: "text",
  };

  if (!isBodyMethod) {
    return (
      <div className="flex w-full items-center justify-center gap-3 rounded-xl border border-dracula-card bg-dracula-card/30 p-6 text-dracula-comment">
        <Code2 className="h-5 w-5 opacity-50" />
        <span className="font-mono text-sm">
          {t.request.body.unavailable.replace("{method}", method)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Code2 className="h-4 w-4 text-dracula-purple" />
          <span className="text-xs font-semibold uppercase tracking-widest text-dracula-comment">
            {t.request.body.title}
          </span>
          <span className="text-xs text-dracula-comment">({bodyTypeLabel[bodyType]})</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {validatesJson && body.trim() && (
            <div
              className={`flex min-w-0 items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs ${
                valid ? "bg-dracula-green/10 text-dracula-green" : "bg-dracula-red/10 text-dracula-red"
              }`}
            >
              {valid ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> {t.request.body.validJson}
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" /> {t.request.body.invalidJson}
                </>
              )}
            </div>
          )}
          {validatesJson && valid && body.trim() && (
            <button
              type="button"
              onClick={handleFormat}
              className="rounded-lg border border-dracula-card px-3 py-1 text-xs text-dracula-comment transition-all duration-200 hover:border-dracula-comment hover:text-dracula-fg"
            >
              {t.request.body.format}
            </button>
          )}
          <button
            type="button"
            onClick={() => setPreviewMode((current) => !current)}
            className="flex items-center gap-1.5 rounded-lg border border-dracula-card px-3 py-1 text-xs text-dracula-comment transition-all duration-200 hover:border-dracula-comment hover:text-dracula-fg"
          >
            {previewMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {previewMode ? t.request.body.edit : t.request.body.preview}
          </button>
        </div>
      </div>

      <div
        className={`relative min-w-0 overflow-hidden rounded-xl border transition-all duration-200 ${
          focused && !previewMode ? "border-dracula-purple ring-1 ring-dracula-purple/30" : "border-dracula-card"
        }`}
      >
        {previewMode ? (
          <div className="min-h-[180px] max-w-full overflow-auto">
            <SyntaxHighlighter
              language={previewLanguage[bodyType]}
              style={dracula}
              customStyle={{
                margin: 0,
                padding: "16px",
                background: "transparent",
                fontSize: "13px",
                lineHeight: "1.6",
                minHeight: "180px",
              }}
              wrapLongLines
            >
              {body.trim() ? (validatesJson && valid ? prettyJson(body) : body) : t.request.body.emptyPreview}
            </SyntaxHighlighter>
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder[bodyType]}
            spellCheck={false}
            className="min-h-[180px] w-full min-w-0 resize-y bg-dracula-card/50 p-4 font-mono text-sm leading-relaxed text-dracula-fg placeholder-dracula-comment/50 transition-colors duration-200 focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
