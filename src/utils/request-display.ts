import type { HttpMethod } from "@/lib/request-model";

export const METHOD_TEXT_COLORS: Record<HttpMethod, string> = {
  GET: "text-dracula-cyan",
  POST: "text-dracula-green",
  PUT: "text-dracula-orange",
  PATCH: "text-dracula-purple",
  DELETE: "text-dracula-red",
  HEAD: "text-dracula-yellow",
  OPTIONS: "text-dracula-pink",
};

export function methodClass(method: string) {
  if (method === "GET") return "border-dracula-cyan/25 bg-dracula-cyan/10 text-dracula-cyan";
  if (method === "POST") return "border-dracula-green/25 bg-dracula-green/10 text-dracula-green";
  if (method === "DELETE") return "border-dracula-red/25 bg-dracula-red/10 text-dracula-red";
  if (method === "PUT") return "border-dracula-orange/25 bg-dracula-orange/10 text-dracula-orange";
  if (method === "PATCH") return "border-dracula-purple/25 bg-dracula-purple/10 text-dracula-purple";
  return "border-dracula-yellow/25 bg-dracula-yellow/10 text-dracula-yellow";
}

export function statusClass(status: number) {
  if (status >= 200 && status < 300) return "border-dracula-green/30 bg-dracula-green/10 text-dracula-green";
  if (status >= 400) return "border-dracula-red/30 bg-dracula-red/10 text-dracula-red";
  return "border-dracula-cyan/30 bg-dracula-cyan/10 text-dracula-cyan";
}

export function responseStatusStyle(status: number) {
  if (status >= 200 && status < 300) {
    return {
      textColor: "text-dracula-green",
      bgColor: "bg-dracula-green/10",
      borderColor: "border-dracula-green/30",
      glow: "shadow-[0_0_12px_rgba(80,250,123,0.2)]",
    };
  }

  if (status >= 400 && status < 500) {
    return {
      textColor: "text-dracula-orange",
      bgColor: "bg-dracula-orange/10",
      borderColor: "border-dracula-orange/30",
      glow: "shadow-[0_0_12px_rgba(255,184,108,0.2)]",
    };
  }

  if (status >= 500) {
    return {
      textColor: "text-dracula-red",
      bgColor: "bg-dracula-red/10",
      borderColor: "border-dracula-red/30",
      glow: "shadow-[0_0_12px_rgba(255,85,85,0.2)]",
    };
  }

  return {
    textColor: "text-dracula-cyan",
    bgColor: "bg-dracula-cyan/10",
    borderColor: "border-dracula-cyan/30",
    glow: "",
  };
}

