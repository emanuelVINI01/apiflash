"use client";

import { KeyRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { ApiKeyLocation, AuthConfig, AuthType } from "@/lib/request-model";

interface AuthSettingsProps {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}

const AUTH_TYPES: AuthType[] = ["none", "bearer", "basic", "apiKey"];
const API_KEY_LOCATIONS: ApiKeyLocation[] = ["header", "query"];

export default function AuthSettings({ auth, onChange }: AuthSettingsProps) {
  const { t } = useLanguage();

  const update = (updates: Partial<AuthConfig>) => {
    onChange({ ...auth, ...updates });
  };

  const authLabel: Record<AuthType, string> = {
    none: t.request.auth.none,
    bearer: t.request.auth.bearer,
    basic: t.request.auth.basic,
    apiKey: t.request.auth.apiKey,
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-dracula-purple" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dracula-comment">{t.request.auth.title}</h3>
      </div>

      <label className="grid gap-1.5 text-xs font-medium text-dracula-comment">
        {t.request.auth.typeLabel}
        <select
          value={auth.type}
          onChange={(event) => update({ type: event.target.value as AuthType })}
          className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg focus:border-dracula-purple focus:outline-none"
        >
          {AUTH_TYPES.map((type) => (
            <option key={type} value={type} className="bg-dracula-bg text-dracula-fg">
              {authLabel[type]}
            </option>
          ))}
        </select>
      </label>

      {auth.type === "bearer" && (
        <input
          type="password"
          value={auth.token}
          onChange={(event) => update({ token: event.target.value })}
          placeholder={t.request.auth.tokenPlaceholder}
          className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
        />
      )}

      {auth.type === "basic" && (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="text"
            value={auth.username}
            onChange={(event) => update({ username: event.target.value })}
            placeholder={t.request.auth.usernamePlaceholder}
            className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
          />
          <input
            type="password"
            value={auth.password}
            onChange={(event) => update({ password: event.target.value })}
            placeholder={t.request.auth.passwordPlaceholder}
            className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
          />
        </div>
      )}

      {auth.type === "apiKey" && (
        <div className="grid gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={auth.apiKeyName}
              onChange={(event) => update({ apiKeyName: event.target.value })}
              placeholder={t.request.auth.keyPlaceholder}
              className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
            />
            <input
              type="password"
              value={auth.apiKeyValue}
              onChange={(event) => update({ apiKeyValue: event.target.value })}
              placeholder={t.request.auth.valuePlaceholder}
              className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
            />
          </div>
          <label className="grid gap-1.5 text-xs font-medium text-dracula-comment">
            {t.request.auth.locationLabel}
            <select
              value={auth.apiKeyLocation}
              onChange={(event) => update({ apiKeyLocation: event.target.value as ApiKeyLocation })}
              className="h-10 rounded-lg border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg focus:border-dracula-purple focus:outline-none"
            >
              {API_KEY_LOCATIONS.map((location) => (
                <option key={location} value={location} className="bg-dracula-bg text-dracula-fg">
                  {location === "header" ? t.request.auth.header : t.request.auth.query}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
