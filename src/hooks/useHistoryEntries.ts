"use client";

import { useEffect, useState } from "react";
import { queueRequestLoad } from "@/lib/collection-storage";
import { clearHistory, readHistory, type HistoryEntry } from "@/lib/history-storage";
import { DEFAULT_AUTH, DEFAULT_REQUEST_OPTIONS, normalizeDraft, type RequestDraft } from "@/lib/request-model";

export function useHistoryEntries() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setEntries(readHistory());
    });
  }, []);

  const clearEntries = () => {
    clearHistory();
    setEntries([]);
  };

  const runAgain = (entry: HistoryEntry) => {
    queueRequestLoad(
      entry.request ??
        normalizeDraft({
          method: entry.method as RequestDraft["method"],
          url: entry.url,
          auth: DEFAULT_AUTH,
          options: DEFAULT_REQUEST_OPTIONS,
        })
    );
    window.location.assign("/workspace#workbench");
  };

  return {
    entries,
    clearEntries,
    runAgain,
  };
}
