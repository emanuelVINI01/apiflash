import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/services/auth-server";
import { aiService } from "@/modules/ai";
import { getErrorMessage } from "@/utils/error-message";
import { z } from "zod";

const codeSchema = z.object({
  language: z.string(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.unknown()).optional(),
  body: z.string().optional(),
  bodyType: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const jsonBody = await request.json();
    const parseResult = codeSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request data.", details: parseResult.error.issues }, { status: 400 });
    }

    const reqData = parseResult.data;
    const language = reqData.language;

    const result = await aiService.generateClientCode(userId, reqData, language);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to generate code") }, { status: 500 });
  }
}
