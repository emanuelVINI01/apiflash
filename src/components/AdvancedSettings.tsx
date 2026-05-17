"use client";

import { Settings2 } from "lucide-react";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import { useLanguage } from "@/context/LanguageContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import type { AuthConfig, BodyType, HeaderRow, QueryParamRow, RequestOptions } from "@/lib/request-model";
import AuthSettings from "./AuthSettings";
import HeadersEditor from "./HeadersEditor";
import QueryParamsEditor from "./QueryParamsEditor";
import RequestOptionsEditor from "./RequestOptionsEditor";

interface AdvancedSettingsProps {
  headers: HeaderRow[];
  queryParams: QueryParamRow[];
  auth: AuthConfig;
  options: RequestOptions;
  bodyType: BodyType;
  onHeadersChange: (headers: HeaderRow[]) => void;
  onQueryParamsChange: (queryParams: QueryParamRow[]) => void;
  onAuthChange: (auth: AuthConfig) => void;
  onOptionsChange: (options: RequestOptions) => void;
  onBodyTypeChange: (bodyType: BodyType) => void;
}

export default function AdvancedSettings({
  headers,
  queryParams,
  auth,
  options,
  bodyType,
  onHeadersChange,
  onQueryParamsChange,
  onAuthChange,
  onOptionsChange,
  onBodyTypeChange,
}: AdvancedSettingsProps) {
  const { t } = useLanguage();
  const { isOpen, toggle } = useDisclosure(false);

  const enabledHeaders = headers.filter((header) => header.enabled && header.key.trim()).length;
  const enabledParams = queryParams.filter((param) => param.enabled && param.key.trim()).length;
  const authSummary = auth.type === "none" ? t.request.advanced.authNone : auth.type;
  const summary = (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <Settings2 className="h-4 w-4 text-dracula-comment" />
      <span className="text-sm font-medium text-dracula-fg">{t.request.advanced.title}</span>
      <span className="rounded-full bg-dracula-card px-1.5 py-0.5 font-mono text-[10px] text-dracula-comment">
        {enabledParams} {t.request.advanced.paramsCount}
      </span>
      <span className="rounded-full bg-dracula-card px-1.5 py-0.5 font-mono text-[10px] text-dracula-comment">
        {enabledHeaders} {t.request.advanced.headersCount}
      </span>
      <span className="rounded-full bg-dracula-card px-1.5 py-0.5 font-mono text-[10px] text-dracula-comment">
        {authSummary}
      </span>
      <span className="rounded-full bg-dracula-card px-1.5 py-0.5 font-mono text-[10px] text-dracula-comment">
        {options.timeoutMs}ms
      </span>
    </div>
  );

  return (
    <AnimatedDisclosure
      isOpen={isOpen}
      onToggle={toggle}
      summary={summary}
      className="transition-colors duration-300"
      contentClassName="grid gap-5 bg-dracula-card/10 p-4"
    >
      <QueryParamsEditor queryParams={queryParams} onChange={onQueryParamsChange} />
      <div className="grid gap-5 lg:grid-cols-2">
        <AuthSettings auth={auth} onChange={onAuthChange} />
        <RequestOptionsEditor
          options={options}
          bodyType={bodyType}
          onOptionsChange={onOptionsChange}
          onBodyTypeChange={onBodyTypeChange}
        />
      </div>
      <HeadersEditor headers={headers} onChange={onHeadersChange} />
    </AnimatedDisclosure>
  );
}
