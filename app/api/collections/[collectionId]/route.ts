import { NextResponse } from "next/server";
import { deleteUserCollection } from "@/services/collections-server";
import { requireUserId } from "@/services/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ collectionId: string }> }) {
  const userId = await requireUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await params;
  await deleteUserCollection(userId, collectionId);

  return NextResponse.json({ ok: true });
}
