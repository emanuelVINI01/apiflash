"use client";

import { useState } from "react";
import ResponseContent from "@/components/response/ResponseContent";
import ResponseEmptyState from "@/components/response/ResponseEmptyState";
import ResponseErrorState from "@/components/response/ResponseErrorState";
import ResponseLoadingState from "@/components/response/ResponseLoadingState";
import ResponseMetaBar from "@/components/response/ResponseMetaBar";
import ResponseTabs, { type ResponseTab } from "@/components/response/ResponseTabs";
import { useLanguage } from "@/context/LanguageContext";
import type { ResponseData } from "@/lib/request-model";
import type { KeyValueRow } from "@/types/request";
import { formatResponseBody } from "@/utils/response-format";
import AiAnalysisModal from "@/components/modals/AiAnalysisModal";

interface ResponseViewerProps {
  response: ResponseData | null;
  error: string | null;
  isLoading: boolean;
  requestData?: {
    method: string;
    url: string;
    headers: KeyValueRow[];
    body: string;
  };
}

export default function ResponseViewer({ response, error, isLoading, requestData }: ResponseViewerProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const handleCopy = async () => {
    if (!response) return;
    const text = formatResponseBody(response.body);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <ResponseLoadingState label={t.response.waiting} />;
  }

  if (error) {
    return <ResponseErrorState title={t.response.errorTitle} message={error} />;
  }

  if (!response) {
    return <ResponseEmptyState label={t.response.empty} />;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <ResponseMetaBar response={response} onAnalyze={requestData ? () => setAnalysisOpen(true) : undefined} />
      <ResponseTabs
        activeTab={activeTab}
        copied={copied}
        labels={{
          body: t.response.body,
          headers: t.response.headers,
          copy: t.common.copy,
          copied: t.common.copied,
        }}
        onTabChange={setActiveTab}
        onCopy={handleCopy}
      />
      <ResponseContent
        response={response}
        activeTab={activeTab}
        labels={{
          emptyBody: t.response.emptyBody,
          emptyHeaders: t.response.emptyHeaders,
        }}
      />

      {requestData && (
        <AiAnalysisModal
          open={analysisOpen}
          onClose={() => setAnalysisOpen(false)}
          requestData={requestData}
          response={response}
        />
      )}
    </div>
  );
}
