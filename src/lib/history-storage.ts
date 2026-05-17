import { createId, normalizeDraft, type RequestDraft, type ResponseData } from "@/lib/request-model";

export const HISTORY_KEY = "apiflash-history-v1";

export interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  duration: number;
  createdAt: string;
  request?: RequestDraft;
}

function parseHistory(value: string | null): HistoryEntry[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as HistoryEntry[];
    if (!Array.isArray(parsed)) return [];

    return parsed.map((entry) => ({
      ...entry,
      id: entry.id || createId("history"),
      request: entry.request ? normalizeDraft(entry.request) : undefined,
    }));
  } catch {
    return [];
  }
}

export function readHistory() {
  if (typeof window === "undefined") return [];
  return parseHistory(window.localStorage.getItem(HISTORY_KEY));
}

export function writeHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function appendHistoryEntry(response: ResponseData, request: RequestDraft) {
  if (typeof window === "undefined" || !request.url.trim()) return;

  const entry: HistoryEntry = {
    id: createId("history"),
    method: request.method,
    url: request.url.trim(),
    status: response.status,
    statusText: response.statusText,
    duration: response.duration,
    createdAt: new Date().toISOString(),
    request: normalizeDraft(request),
  };

  writeHistory([entry, ...readHistory()].slice(0, 24));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}
