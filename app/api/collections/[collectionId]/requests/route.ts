import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCollectionRequest } from "@/services/collections-server";
import { requireUserId } from "@/services/auth-server";
import type { RequestDraft } from "@/lib/request-model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const keyValueRowSchema = z.object({
  id: z.string().optional(),
  key: z.string(),
  value: z.string(),
  enabled: z.boolean(),
});

const authConfigSchema = z
  .object({
    type: z.enum(["none", "bearer", "basic", "apiKey"]),
    token: z.string(),
    username: z.string(),
    password: z.string(),
    apiKeyName: z.string(),
    apiKeyValue: z.string(),
    apiKeyLocation: z.enum(["header", "query"]),
  })
  .partial();

const requestOptionsSchema = z
  .object({
    timeoutMs: z.number(),
    followRedirects: z.boolean(),
  })
  .partial();

const requestDraftSchema = z.object({
  method: z.string().optional(),
  url: z.string().trim().min(1, "Request URL is required"),
  headers: z.array(keyValueRowSchema).optional(),
  queryParams: z.array(keyValueRowSchema).optional(),
  auth: authConfigSchema.optional(),
  body: z.string().optional(),
  bodyType: z.string().optional(),
  options: requestOptionsSchema.optional(),
});

const createRequestSchema = z.object({
  name: z.string().optional(),
  draft: requestDraftSchema,
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  const userId = await requireUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collectionId } = await params;
    const jsonBody = await request.json();
    const parseResult = createRequestSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request payload", details: parseResult.error.issues }, { status: 400 });
    }

    const { name, draft } = parseResult.data;
    const savedRequest = await createCollectionRequest(userId, collectionId, name ?? "", draft as RequestDraft);

    if (!savedRequest) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ request: savedRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }
}
