import { NextRequest, NextResponse } from 'next/server';

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
  try {
    const { url, method, headers, body } = await req.json();

    if (!url) {
      return jsonWithCors({ error: 'URL is required' }, 400);
    }

    const start = performance.now();

    // Create the fetch options, filtering out headers that might cause issues
    const fetchHeaders = new Headers();
    Object.entries(headers || {}).forEach(([key, value]) => {
      // Avoid passing host and other restricted headers if they exist
      if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase())) {
        fetchHeaders.append(key, value as string);
      }
    });

    const response = await fetch(url, {
      method: method || 'GET',
      headers: fetchHeaders,
      body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
      cache: 'no-store',
    });

    const duration = Math.round(performance.now() - start);

    // Extract headers for client
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      responseHeaders[k] = v;
    });

    let responseBody: unknown;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
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
    const message = error instanceof Error ? error.message : 'Error occurred while fetching';
    return jsonWithCors({ error: message }, 500);
  }
}
