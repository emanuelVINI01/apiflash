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
import { logger } from "@/shared/utils/logger";

import { z } from "zod";

const proxyPayloadSchema = z.object({
  url: z.string().url(),
  method: z.string().optional(),
  headers: z.record(z.string(), z.unknown()).optional(),
  body: z.string().optional(),
  timeoutMs: z.number().min(1000).max(120000).optional(),
  followRedirects: z.boolean().optional(),
});

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
    const jsonBody = await req.json();
    const parseResult = proxyPayloadSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return jsonWithCors({ error: "Invalid payload", details: parseResult.error.issues }, 400);
    }

    const payload = parseResult.data as ProxyRequestPayload;

    if (!(await validateProxyUrl(payload.url))) {
      return jsonWithCors({ error: "Invalid URL or blocked by security policies" }, 400);
    }

    const result = await executeProxyRequest(payload);

    // Asynchronously log the proxy request metadata in the background
    const bodyStr = typeof result.body === "string" ? result.body : JSON.stringify(result.body || "");
    const size = Buffer.byteLength(bodyStr, "utf8");

    try {
      await prisma.proxyRequestLog.create({
        data: {
          userId,
          method: payload.method || "GET",
          url: payload.url || "",
          requestHeaders: payload.headers as Prisma.InputJsonValue | undefined,
          responseStatus: result.status,
          responseDuration: result.duration,
          responseSize: size,
        },
      });
    } catch (dbErr) {
      logger.error({ error: dbErr, route: "/api/proxy" }, "Failed to save proxy log");
    }

    return jsonWithCors(result);
  } catch (error: unknown) {
    logger.error({ error, route: "/api/proxy" }, "Proxy error");
    return jsonWithCors({ error: formatProxyError(error) }, 500);
  }
}
