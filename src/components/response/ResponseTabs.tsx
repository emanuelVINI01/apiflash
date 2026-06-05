"use client";

import { CheckCheck, Copy } from "lucide-react";

export type ResponseTab = "body" | "headers";

interface ResponseTabsProps {
  activeTab: ResponseTab;
  copied: boolean;
  labels: {
    body: string;
    headers: string;
    copy: string;
    copied: string;
  };
  onTabChange: (tab: ResponseTab) => void;
  onCopy: () => void;
}

const RESPONSE_TABS: ResponseTab[] = ["body", "headers"];

export default function ResponseTabs({ activeTab, copied, labels, onTabChange, onCopy }: ResponseTabsProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1 border-b border-dracula-card">
      {RESPONSE_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`-mb-px border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            activeTab === tab
              ? "border-dracula-purple text-dracula-purple"
              : "border-transparent text-dracula-comment hover:text-dracula-fg"
          }`}
        >
          {labels[tab]}
        </button>
      ))}
      {activeTab === "body" && (
        <button
          type="button"
          onClick={onCopy}
          className="ml-auto flex min-w-0 items-center gap-1.5 rounded-lg border border-dracula-card px-3 py-1.5 text-xs text-dracula-comment transition-all duration-200 hover:border-dracula-comment hover:text-dracula-fg sm:mb-1"
        >
          {copied ? (
            <>
              <CheckCheck className="h-3 w-3 text-dracula-green" /> {labels.copied}
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> {labels.copy}
            </>
          )}
        </button>
      )}
    </div>
  );
}

