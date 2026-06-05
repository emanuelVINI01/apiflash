import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  PROXY_CORS_HEADERS,
  executeProxyRequest,
  formatProxyError,
  validateProxyUrl,
  type ProxyRequestPayload,
} from "@/services/proxy-server";
import { requireUserId } from "@/services/auth-server";
import { prisma } from "@/src/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonWithCors(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: PROXY_CORS_HEADERS,
  });
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: PROXY_CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();

  try {
    const payload = (await req.json()) as ProxyRequestPayload;

    if (!payload.url) {
      return jsonWithCors({ error: "URL is required" }, 400);
    }

    if (!validateProxyUrl(payload.url)) {
      return jsonWithCors({ error: "Invalid URL" }, 400);
    }

    const result = await executeProxyRequest(payload);

    // Asynchronously log the proxy request metadata in the background
    const bodyStr = typeof result.body === "string" ? result.body : JSON.stringify(result.body || "");
    const size = Buffer.byteLength(bodyStr, "utf8");

    prisma.proxyRequestLog.create({
      data: {
        userId,
        method: payload.method || "GET",
        url: payload.url || "",
        requestHeaders: payload.headers as Prisma.InputJsonValue | undefined,
        responseStatus: result.status,
        responseDuration: result.duration,
        responseSize: size,
      },
    }).catch((dbErr) => {
      console.error("Failed to save proxy log:", dbErr);
    });

    return jsonWithCors(result);
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return jsonWithCors({ error: formatProxyError(error) }, 500);
  }
}
