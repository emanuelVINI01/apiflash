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
    const { promptText, locale } = await request.json();
    if (!promptText?.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const lang = locale === "pt-BR" ? "pt-BR" : "en";
    const result = await aiServerService.generateRequestFromPrompt(userId, promptText, lang);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to generate request");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
