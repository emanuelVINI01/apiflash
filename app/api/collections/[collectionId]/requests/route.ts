import { NextRequest, NextResponse } from "next/server";
import { createCollectionRequest } from "@/services/collections-server";
import { requireUserId } from "@/services/auth-server";
import type { RequestDraft } from "@/lib/request-model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  const userId = await requireUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await params;
  const payload = (await request.json()) as { name?: string; draft?: RequestDraft };

  if (!payload.draft?.url?.trim()) {
    return NextResponse.json({ error: "Request URL is required" }, { status: 400 });
  }

  const savedRequest = await createCollectionRequest(userId, collectionId, payload.name ?? "", payload.draft);

  if (!savedRequest) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  return NextResponse.json({ request: savedRequest }, { status: 201 });
}
