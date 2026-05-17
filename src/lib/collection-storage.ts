import {
  DEFAULT_AUTH,
  DEFAULT_REQUEST_OPTIONS,
  createId,
  normalizeDraft,
  type RequestCollection,
  type RequestDraft,
  type SavedRequest,
} from "@/lib/request-model";

export const COLLECTIONS_KEY = "apiflash-collections-v1";
export const COLLECTIONS_SEEDED_KEY = "apiflash-collections-seeded-v1";
export const LOAD_REQUEST_KEY = "apiflash-load-request-v1";

function now() {
  return new Date().toISOString();
}

function createDefaultCollections(): RequestCollection[] {
  const createdAt = now();

  return [
    {
      id: createId("collection"),
      name: "REST smoke tests",
      description: "Checks rapidos de GET, POST e PATCH para validar endpoints.",
      createdAt,
      updatedAt: createdAt,
      requests: [
        createSavedRequest("Public JSON", {
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts/1",
          headers: [],
          queryParams: [],
          auth: DEFAULT_AUTH,
          body: "",
          bodyType: "json",
          options: DEFAULT_REQUEST_OPTIONS,
        }),
        createSavedRequest("Create post", {
          method: "POST",
          url: "https://jsonplaceholder.typicode.com/posts",
          headers: [],
          queryParams: [],
          auth: DEFAULT_AUTH,
          body: JSON.stringify({ title: "apiFlash", body: "Reusable request", userId: 1 }, null, 2),
          bodyType: "json",
          options: DEFAULT_REQUEST_OPTIONS,
        }),
      ],
    },
    {
      id: createId("collection"),
      name: "Auth templates",
      description: "Requests base para bearer token, API key e perfil protegido.",
      createdAt,
      updatedAt: createdAt,
      requests: [
        createSavedRequest("Protected profile", {
          method: "GET",
          url: "https://api.example.com/v1/me",
          headers: [{ id: createId("header"), key: "Accept", value: "application/json", enabled: true }],
          queryParams: [],
          auth: { ...DEFAULT_AUTH, type: "bearer", token: "<token>" },
          body: "",
          bodyType: "json",
          options: DEFAULT_REQUEST_OPTIONS,
        }),
      ],
    },
  ];
}

function parseCollections(value: string | null): RequestCollection[] | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as RequestCollection[];
    if (!Array.isArray(parsed)) return null;

    return parsed.map((collection) => ({
      id: collection.id || createId("collection"),
      name: collection.name || "Untitled collection",
      description: collection.description || "",
      createdAt: collection.createdAt || now(),
      updatedAt: collection.updatedAt || now(),
      requests: Array.isArray(collection.requests)
        ? collection.requests.map((request) => ({
            ...normalizeDraft(request),
            id: request.id || createId("request"),
            name: request.name || "Untitled request",
            createdAt: request.createdAt || now(),
            updatedAt: request.updatedAt || now(),
          }))
        : [],
    }));
  } catch {
    return null;
  }
}

export function readCollections() {
  if (typeof window === "undefined") return [];

  const parsed = parseCollections(window.localStorage.getItem(COLLECTIONS_KEY));
  if (parsed) return parsed;

  const seeded = window.localStorage.getItem(COLLECTIONS_SEEDED_KEY);
  if (seeded) return [];

  const defaults = createDefaultCollections();
  writeCollections(defaults);
  window.localStorage.setItem(COLLECTIONS_SEEDED_KEY, "true");
  return defaults;
}

export function writeCollections(collections: RequestCollection[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

export function createCollection(name: string, description = ""): RequestCollection {
  const createdAt = now();

  return {
    id: createId("collection"),
    name: name.trim() || "Untitled collection",
    description: description.trim(),
    requests: [],
    createdAt,
    updatedAt: createdAt,
  };
}

export function createSavedRequest(name: string, draft: RequestDraft): SavedRequest {
  const createdAt = now();

  return {
    ...normalizeDraft(draft),
    id: createId("request"),
    name: name.trim() || "Untitled request",
    createdAt,
    updatedAt: createdAt,
  };
}

export function queueRequestLoad(request: RequestDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOAD_REQUEST_KEY, JSON.stringify(normalizeDraft(request)));
}

export function consumeQueuedRequest() {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(LOAD_REQUEST_KEY);
  if (!value) return null;

  window.localStorage.removeItem(LOAD_REQUEST_KEY);
  try {
    return normalizeDraft(JSON.parse(value) as Partial<RequestDraft>);
  } catch {
    return null;
  }
}
