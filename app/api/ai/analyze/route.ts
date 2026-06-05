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
    const reqResData = await request.json();
    const { locale, forceRefresh } = reqResData;
    const lang = locale === "pt-BR" ? "pt-BR" : "en";

    const result = await aiServerService.analyzeResponse(
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
