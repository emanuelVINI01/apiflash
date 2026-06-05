export type AppLanguage = "pt" | "en";

export function formatDateTime(value: string, language: AppLanguage): string {
  return new Date(value).toLocaleString(language === "pt" ? "pt-BR" : "en-US");
}

