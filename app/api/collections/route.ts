import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUserCollection, listCollections } from "@/services/collections-server";
import { requireUserId } from "@/services/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Collection name is required"),
  description: z.string().optional(),
});

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

  try {
    const jsonBody = await request.json();
    const parseResult = createCollectionSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request payload", details: parseResult.error.issues }, { status: 400 });
    }

    const { name, description } = parseResult.data;
    const collection = await createUserCollection(userId, name, description ?? "");
    return NextResponse.json({ collection }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}
