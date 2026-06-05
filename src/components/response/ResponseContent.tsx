"use client";

import type { ResponseData } from "@/lib/request-model";
import { detectResponseLanguage, formatResponseBody } from "@/utils/response-format";
import ResponseBodyPanel from "./ResponseBodyPanel";
import ResponseHeadersPanel from "./ResponseHeadersPanel";
import type { ResponseTab } from "./ResponseTabs";

interface ResponseContentProps {
  response: ResponseData;
  activeTab: ResponseTab;
  labels: {
    emptyBody: string;
    emptyHeaders: string;
  };
}

export default function ResponseContent({ response, activeTab, labels }: ResponseContentProps) {
  const formattedBody = formatResponseBody(response.body);

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-dracula-card">
      {activeTab === "body" ? (
        <ResponseBodyPanel
          body={formattedBody}
          language={detectResponseLanguage(response.body)}
          emptyLabel={labels.emptyBody}
        />
      ) : (
        <ResponseHeadersPanel headers={response.headers} emptyLabel={labels.emptyHeaders} />
      )}
    </div>
  );
}

