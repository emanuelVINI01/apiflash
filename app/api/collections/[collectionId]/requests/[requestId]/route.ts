import { NextResponse } from "next/server";
import { deleteCollectionRequest } from "@/services/collections-server";
import { requireUserId } from "@/services/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collectionId: string; requestId: string }> }
) {
  const userId = await requireUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId, requestId } = await params;
  const deleted = await deleteCollectionRequest(userId, collectionId, requestId);

  if (!deleted) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
