import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/services/auth-server";
import { aiService } from "@/modules/ai";
import { getErrorMessage } from "@/utils/error-message";
import { z } from "zod";

const analyzeSchema = z.object({
  method: z.string(),
  url: z.string(),
  responseStatus: z.number(),
  requestHeaders: z.record(z.string(), z.string()).optional(),
  requestBody: z.string().optional(),
  responseHeaders: z.record(z.string(), z.string()).optional(),
  responseBody: z.string().optional(),
  locale: z.string().optional(),
  forceRefresh: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const jsonBody = await request.json();
    const parseResult = analyzeSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request payload", details: parseResult.error.issues }, { status: 400 });
    }

    const reqResData = parseResult.data;
    const lang = reqResData.locale === "pt-BR" ? "pt-BR" : "en";

    const result = await aiService.analyzeResponse(
      userId,
      {
        method: reqResData.method,
        url: reqResData.url,
        requestHeaders: JSON.stringify(reqResData.requestHeaders || {}),
        requestBody: reqResData.requestBody || "",
        responseStatus: reqResData.responseStatus,
        responseHeaders: JSON.stringify(reqResData.responseHeaders || {}),
        responseBody: reqResData.responseBody || "",
      },
      lang,
      !!forceRefresh
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to analyze response");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
