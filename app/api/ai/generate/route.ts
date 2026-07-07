import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/services/auth-server";
import { aiService } from "@/modules/ai";
import { getErrorMessage } from "@/utils/error-message";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string(),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const jsonBody = await request.json();
    const parseResult = generateSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload.", details: parseResult.error.issues }, { status: 400 });
    }

    const { prompt: promptText, locale } = parseResult.data;

    if (!promptText.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const lang = locale === "pt-BR" ? "pt-BR" : "en";
    const result = await aiService.generateRequestFromPrompt(userId, promptText, lang);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to generate request");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
