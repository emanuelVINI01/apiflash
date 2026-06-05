"use client";

import { Code2 } from "lucide-react";
import type { HttpMethod } from "@/lib/request-model";

interface RequestBodyUnavailableProps {
  method: HttpMethod;
  message: string;
}

export default function RequestBodyUnavailable({ method, message }: RequestBodyUnavailableProps) {
  return (
    <div className="flex w-full items-center justify-center gap-3 rounded-xl border border-dracula-card bg-dracula-card/30 p-6 text-dracula-comment">
      <Code2 className="h-5 w-5 opacity-50" />
      <span className="font-mono text-sm">{message.replace("{method}", method)}</span>
    </div>
  );
}

