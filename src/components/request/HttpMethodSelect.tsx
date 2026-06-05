"use client";

import { ChevronDown } from "lucide-react";
import { HTTP_METHODS, type HttpMethod } from "@/lib/request-model";
import { METHOD_TEXT_COLORS } from "@/utils/request-display";

interface HttpMethodSelectProps {
  method: HttpMethod;
  disabled: boolean;
  onChange: (method: HttpMethod) => void;
}

export default function HttpMethodSelect({ method, disabled, onChange }: HttpMethodSelectProps) {
  return (
    <div className="relative min-w-0 shrink-0">
      <select
        value={method}
        onChange={(event) => onChange(event.target.value as HttpMethod)}
        disabled={disabled}
        className={`h-12 w-full cursor-pointer appearance-none rounded-xl border border-dracula-card bg-dracula-card pl-4 pr-8 font-mono text-sm font-bold transition-all duration-200 focus:border-dracula-purple focus:outline-none focus:ring-1 focus:ring-dracula-purple/50 disabled:opacity-50 sm:w-auto ${METHOD_TEXT_COLORS[method]}`}
      >
        {HTTP_METHODS.map((httpMethod) => (
          <option key={httpMethod} value={httpMethod} className="bg-dracula-bg text-dracula-fg">
            {httpMethod}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronDown className="h-4 w-4 text-dracula-comment" />
      </div>
    </div>
  );
}

