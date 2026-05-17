"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { HeaderRow } from "@/lib/request-model";
import KeyValueRowsEditor from "./KeyValueRowsEditor";

export type { HeaderRow };

interface HeadersEditorProps {
  headers: HeaderRow[];
  onChange: (headers: HeaderRow[]) => void;
}

export default function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const { t } = useLanguage();

  return (
    <KeyValueRowsEditor
      rows={headers}
      onChange={onChange}
      title={t.request.headers.title}
      addLabel={t.request.headers.add}
      emptyLabel={t.request.headers.empty}
      keyPlaceholder={t.request.headers.keyPlaceholder}
      valuePlaceholder={t.request.headers.valuePlaceholder}
      removeLabel={t.request.headers.remove}
      idPrefix="header"
    />
  );
}
