import { normalizeUrl } from "@/lib/request-model";

export type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; reason: "missing" | "invalid" };

export function validateRequestUrl(url: string): UrlValidationResult {
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) return { ok: false, reason: "missing" };

  try {
    new URL(normalizedUrl);
    return { ok: true, url: normalizedUrl };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

