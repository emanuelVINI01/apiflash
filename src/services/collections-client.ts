import type { RequestCollection, RequestDraft, SavedRequest } from "@/lib/request-model";

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;

  if (!response.ok) {
    throw new Error("error" in (payload as object) ? String((payload as { error: unknown }).error) : "Request failed");
  }

  return payload;
}

export async function fetchCollections() {
  const response = await fetch("/api/collections", { cache: "no-store" });
  const payload = await readJson<{ collections: RequestCollection[] }>(response);
  return payload.collections;
}

export async function createRemoteCollection(name: string, description: string) {
  const response = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  const payload = await readJson<{ collection: RequestCollection }>(response);
  return payload.collection;
}

export async function deleteRemoteCollection(collectionId: string) {
  const response = await fetch(`/api/collections/${collectionId}`, { method: "DELETE" });
  await readJson<{ ok: true }>(response);
}

export async function createRemoteRequest(collectionId: string, name: string, draft: RequestDraft) {
  const response = await fetch(`/api/collections/${collectionId}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, draft }),
  });
  const payload = await readJson<{ request: SavedRequest }>(response);
  return payload.request;
}

export async function deleteRemoteRequest(collectionId: string, requestId: string) {
  const response = await fetch(`/api/collections/${collectionId}/requests/${requestId}`, { method: "DELETE" });
  await readJson<{ ok: true }>(response);
}
