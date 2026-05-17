import { NextRequest, NextResponse } from 'next/server';
import { BODY_METHODS, HTTP_METHODS } from '@/lib/request-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

const BLOCKED_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'content-length',
  'origin',
  'referer',
  'access-control-request-method',
  'access-control-request-headers',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-fetch-dest',
]);

function jsonWithCors(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: CORS_HEADERS,
  });
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const { url, method = 'GET', headers, body, timeoutMs = 30000, followRedirects = true } = await req.json();

    if (!url) {
      return jsonWithCors({ error: 'URL is required' }, 400);
    }

    try {
      new URL(url);
    } catch {
      return jsonWithCors({ error: 'Invalid URL' }, 400);
    }

    const safeMethod = (HTTP_METHODS as readonly string[]).includes(method) ? method : 'GET';
    const safeTimeout = Math.min(Math.max(Number(timeoutMs) || 30000, 1000), 120000);
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), safeTimeout);
    const start = performance.now();

    const fetchHeaders = new Headers();
    Object.entries(headers || {}).forEach(([key, value]) => {
      if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase()) && typeof value === 'string') {
        fetchHeaders.append(key, value as string);
      }
    });

    const response = await fetch(url, {
      method: safeMethod,
      headers: fetchHeaders,
      body: (BODY_METHODS as readonly string[]).includes(safeMethod) ? body : undefined,
      cache: 'no-store',
      redirect: followRedirects ? 'follow' : 'manual',
      signal: controller.signal,
    });

    const duration = Math.round(performance.now() - start);

    // Extract headers for client
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      responseHeaders[k] = v;
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    let responseBody: unknown = text;

    if (contentType.includes('application/json') && text) {
      try {
        responseBody = JSON.parse(text);
      } catch {
        responseBody = text;
      }
    }

    return jsonWithCors({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      duration,
    });
  } catch (error: unknown) {
    console.error('Proxy error:', error);
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Request timed out'
        : error instanceof Error
          ? error.message
          : 'Error occurred while fetching';
    return jsonWithCors({ error: message }, 500);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
