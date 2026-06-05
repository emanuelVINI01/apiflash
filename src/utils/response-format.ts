export function formatResponseBody(body: unknown): string {
  if (typeof body === "string") {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }

  return JSON.stringify(body, null, 2);
}

export function detectResponseLanguage(body: unknown): string {
  if (typeof body !== "string") return "json";

  const trimmed = body.trim();
  if (trimmed.startsWith("<")) return "html";

  try {
    JSON.parse(trimmed);
    return "json";
  } catch {
    return "text";
  }
}

export function shouldShowLineNumbers(source: string): boolean {
  return source.split("\n").length > 5;
}

