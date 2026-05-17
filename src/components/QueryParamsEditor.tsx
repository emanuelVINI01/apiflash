"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { QueryParamRow } from "@/lib/request-model";
import KeyValueRowsEditor from "./KeyValueRowsEditor";

interface QueryParamsEditorProps {
  queryParams: QueryParamRow[];
  onChange: (queryParams: QueryParamRow[]) => void;
}

export default function QueryParamsEditor({ queryParams, onChange }: QueryParamsEditorProps) {
  const { t } = useLanguage();

  return (
    <KeyValueRowsEditor
      rows={queryParams}
      onChange={onChange}
      title={t.request.query.title}
      addLabel={t.request.query.add}
      emptyLabel={t.request.query.empty}
      keyPlaceholder={t.request.query.keyPlaceholder}
      valuePlaceholder={t.request.query.valuePlaceholder}
      removeLabel={t.request.query.remove}
      idPrefix="param"
    />
  );
}
