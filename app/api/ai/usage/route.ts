import { NextResponse } from "next/server";
import { requireUserId } from "@/services/auth-server";
import { aiServerService } from "@/services/ai-server";
import { getErrorMessage } from "@/utils/error-message";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await aiServerService.getUsageSummary(userId);
    return NextResponse.json(summary);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to load usage") }, { status: 500 });
  }
}
