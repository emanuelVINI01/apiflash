import { DEFAULT_AUTH, normalizeDraft, type RequestDraft } from "@/lib/request-model";

export const presetDrafts: RequestDraft[] = [
  normalizeDraft({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
  }),
  normalizeDraft({
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    body: JSON.stringify({ title: "apiFlash", body: "Mobile-first HTTP test", userId: 1 }, null, 2),
    bodyType: "json",
  }),
  normalizeDraft({
    method: "GET",
    url: "https://api.example.com/v1/me",
    headers: [{ id: "accept", key: "Accept", value: "application/json", enabled: true }],
    auth: { ...DEFAULT_AUTH, type: "bearer", token: "<token>" },
  }),
];
