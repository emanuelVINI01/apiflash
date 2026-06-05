import { NextRequest, NextResponse } from "next/server";
import { createUserCollection, listCollections } from "@/services/collections-server";
import { requireUserId } from "@/services/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ collections: await listCollections(userId) });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as { name?: string; description?: string };

  if (!payload.name?.trim()) {
    return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
  }

  const collection = await createUserCollection(userId, payload.name, payload.description ?? "");
  return NextResponse.json({ collection }, { status: 201 });
}
