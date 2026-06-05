import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/services/auth-server";
import { aiServerService } from "@/services/ai-server";
import { getErrorMessage } from "@/utils/error-message";

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { reqData, language } = await request.json();
    if (!reqData || !language) {
      return NextResponse.json({ error: "Request data and language are required." }, { status: 400 });
    }

    const result = await aiServerService.generateClientCode(userId, reqData, language);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to generate code") }, { status: 500 });
  }
}
