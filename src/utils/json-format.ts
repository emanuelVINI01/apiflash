export function isValidJson(value: string): boolean {
  if (!value.trim()) return true;

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function prettyJson(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

