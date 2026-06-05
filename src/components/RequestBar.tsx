"use client";

import HttpMethodSelect from "@/components/request/HttpMethodSelect";
import RequestUrlInput from "@/components/request/RequestUrlInput";
import SendRequestButton from "@/components/request/SendRequestButton";
import { useLanguage } from "@/context/LanguageContext";
import { useSendRequest } from "@/hooks/useSendRequest";
import type { HttpMethod, RequestDraft, ResponseData } from "@/lib/request-model";
import { Sparkles } from "lucide-react";

export type { HttpMethod, ResponseData };

interface RequestBarProps {
  draft: RequestDraft;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onResponse: (data: ResponseData) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onAiGenerateClick?: () => void;
}

export default function RequestBar({
  draft,
  onMethodChange,
  onUrlChange,
  onResponse,
  onError,
  isLoading,
  setIsLoading,
  onAiGenerateClick,
}: RequestBarProps) {
  const { t } = useLanguage();
  const handleSubmit = useSendRequest({
    draft,
    messages: {
      validUrlError: t.request.validUrlError,
      invalidUrlError: t.request.invalidUrlError,
      unknownError: t.request.unknownError,
      connectionError: t.request.connectionError,
      requestError: t.request.requestError,
    },
    onResponse,
    onError,
    setIsLoading,
  });

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
        <HttpMethodSelect method={draft.method} onChange={onMethodChange} disabled={isLoading} />
        <RequestUrlInput
          value={draft.url}
          onChange={onUrlChange}
          placeholder={t.request.urlPlaceholder}
          disabled={isLoading}
        />
        {onAiGenerateClick && (
          <button
            type="button"
            onClick={onAiGenerateClick}
            disabled={isLoading}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#bd93f9]/20 bg-[#bd93f9]/10 text-[#bd93f9] hover:bg-[#bd93f9]/20 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="Generate Request with AI"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}
        <SendRequestButton
          disabled={isLoading || !draft.url.trim()}
          isLoading={isLoading}
          sendLabel={t.request.send}
          sendingLabel={t.request.sending}
        />
      </div>
    </form>
  );
}
