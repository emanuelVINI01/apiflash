import type { Prisma } from "@prisma/client";
import { prisma } from "@/prisma";
import { normalizeDraft, type RequestCollection, type RequestDraft, type SavedRequest } from "@/lib/request-model";

type CollectionWithRequests = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  requests: Array<{
    id: string;
    name: string;
    method: string;
    url: string;
    headers: unknown;
    queryParams: unknown;
    auth: unknown;
    body: string;
    bodyType: string;
    options: unknown;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export async function listCollections(userId: string): Promise<RequestCollection[]> {
  const collections = await prisma.requestCollection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      requests: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return collections.map(mapCollection);
}

export async function createUserCollection(userId: string, name: string, description: string) {
  const collection = await prisma.requestCollection.create({
    data: {
      userId,
      name: name.trim() || "Untitled collection",
      description: description.trim(),
    },
    include: { requests: true },
  });

  return mapCollection(collection);
}

export async function deleteUserCollection(userId: string, collectionId: string) {
  await prisma.requestCollection.deleteMany({
    where: {
      id: collectionId,
      userId,
    },
  });
}

export async function createCollectionRequest(userId: string, collectionId: string, name: string, draft: RequestDraft) {
  const collection = await prisma.requestCollection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
    select: { id: true },
  });

  if (!collection) {
    return null;
  }

  const normalized = normalizeDraft(draft);
  const savedRequest = await prisma.savedRequest.create({
    data: {
      collectionId,
      name: name.trim() || defaultRequestName(normalized),
      method: normalized.method,
      url: normalized.url,
      headers: toJsonInput(normalized.headers),
      queryParams: toJsonInput(normalized.queryParams),
      auth: toJsonInput(normalized.auth),
      body: normalized.body,
      bodyType: normalized.bodyType,
      options: toJsonInput(normalized.options),
    },
  });

  await prisma.requestCollection.update({
    where: { id: collectionId },
    data: { updatedAt: new Date() },
  });

  return mapSavedRequest(savedRequest);
}

export async function deleteCollectionRequest(userId: string, collectionId: string, requestId: string) {
  const request = await prisma.savedRequest.findFirst({
    where: {
      id: requestId,
      collectionId,
      collection: { userId },
    },
    select: { id: true },
  });

  if (!request) {
    return false;
  }

  await prisma.savedRequest.delete({
    where: { id: requestId },
  });

  await prisma.requestCollection.update({
    where: { id: collectionId },
    data: { updatedAt: new Date() },
  });

  return true;
}

function mapCollection(collection: CollectionWithRequests): RequestCollection {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    requests: collection.requests.map(mapSavedRequest),
  };
}

function mapSavedRequest(request: CollectionWithRequests["requests"][number]): SavedRequest {
  return {
    ...normalizeDraft({
      method: request.method as RequestDraft["method"],
      url: request.url,
      headers: request.headers as RequestDraft["headers"],
      queryParams: request.queryParams as RequestDraft["queryParams"],
      auth: request.auth as RequestDraft["auth"],
      body: request.body,
      bodyType: request.bodyType as RequestDraft["bodyType"],
      options: request.options as RequestDraft["options"],
    }),
    id: request.id,
    name: request.name,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}

function defaultRequestName(draft: RequestDraft) {
  const path = draft.url.trim().replace(/^https?:\/\//i, "").split("?")[0] || "request";
  return `${draft.method} ${path}`;
}

function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
