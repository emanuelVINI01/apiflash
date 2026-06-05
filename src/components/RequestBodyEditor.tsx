"use client";

import { useState } from "react";
import RequestBodyHeader from "@/components/request/RequestBodyHeader";
import RequestBodyPreview from "@/components/request/RequestBodyPreview";
import RequestBodyTextarea from "@/components/request/RequestBodyTextarea";
import RequestBodyUnavailable from "@/components/request/RequestBodyUnavailable";
import { useLanguage } from "@/context/LanguageContext";
import { canSendBody, type BodyType, type HttpMethod } from "@/lib/request-model";
import { isValidJson, prettyJson } from "@/utils/json-format";

interface RequestBodyEditorProps {
  body: string;
  method: HttpMethod;
  bodyType: BodyType;
  onChange: (value: string) => void;
}

export default function RequestBodyEditor({ body, method, bodyType, onChange }: RequestBodyEditorProps) {
  const { t } = useLanguage();
  const [previewMode, setPreviewMode] = useState(false);
  const [focused, setFocused] = useState(false);

  const isBodyMethod = canSendBody(method);
  const validatesJson = bodyType === "json";
  const valid = !validatesJson || isValidJson(body);

  const handleFormat = () => {
    if (validatesJson && valid && body.trim()) {
      onChange(prettyJson(body));
    }
  };

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
    return <RequestBodyUnavailable method={method} message={t.request.body.unavailable} />;
  }

  const previewBody = validatesJson && valid ? prettyJson(body) : body;
  const showsJsonStatus = validatesJson && Boolean(body.trim());
  const canFormat = showsJsonStatus && valid;

  return (
    <div className="flex w-full flex-col gap-2">
      <RequestBodyHeader
        title={t.request.body.title}
        typeLabel={bodyTypeLabel[bodyType]}
        previewMode={previewMode}
        canFormat={canFormat}
        showsJsonStatus={showsJsonStatus}
        validJson={valid}
        labels={{
          validJson: t.request.body.validJson,
          invalidJson: t.request.body.invalidJson,
          format: t.request.body.format,
          edit: t.request.body.edit,
          preview: t.request.body.preview,
        }}
        onFormat={handleFormat}
        onTogglePreview={() => setPreviewMode((current) => !current)}
      />

      <div
        className={`relative min-w-0 overflow-hidden rounded-xl border transition-all duration-200 ${
          focused && !previewMode ? "border-dracula-purple ring-1 ring-dracula-purple/30" : "border-dracula-card"
        }`}
      >
        {previewMode ? (
          <RequestBodyPreview
            body={previewBody}
            language={previewLanguage[bodyType]}
            emptyLabel={t.request.body.emptyPreview}
          />
        ) : (
          <RequestBodyTextarea
            value={body}
            placeholder={placeholder[bodyType]}
            onChange={onChange}
            onFocusChange={setFocused}
          />
        )}
      </div>
    </div>
  );
}
