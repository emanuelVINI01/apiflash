"use client";

import { Plus, Trash2 } from "lucide-react";
import { createId, type KeyValueRow } from "@/lib/request-model";

interface KeyValueRowsEditorProps<T extends KeyValueRow> {
  rows: T[];
  onChange: (rows: T[]) => void;
  title: string;
  addLabel: string;
  emptyLabel: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  removeLabel: string;
  idPrefix: string;
}

export default function KeyValueRowsEditor<T extends KeyValueRow>({
  rows,
  onChange,
  title,
  addLabel,
  emptyLabel,
  keyPlaceholder,
  valuePlaceholder,
  removeLabel,
  idPrefix,
}: KeyValueRowsEditorProps<T>) {
  const addRow = () => {
    const newRow = {
      id: createId(idPrefix),
      key: "",
      value: "",
      enabled: true,
    } as T;

    onChange([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    onChange(rows.filter((row) => row.id !== id));
  };

  const updateRow = (id: string, updates: Partial<T>) => {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...updates } : row)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 flex min-w-0 items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dracula-comment">{title}</h3>
        <button
          onClick={addRow}
          type="button"
          className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-dracula-cyan transition-colors hover:text-dracula-cyan/80"
        >
          <Plus className="h-3 w-3" />
          {addLabel}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {rows.length === 0 ? (
          <p className="py-2 text-xs italic text-dracula-comment">{emptyLabel}</p>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex min-w-0 animate-in items-start gap-2 fade-in slide-in-from-left-2 duration-200 sm:items-center"
            >
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={(event) => updateRow(row.id, { enabled: event.target.checked } as Partial<T>)}
                className="mt-2 h-4 w-4 rounded border-dracula-card bg-dracula-bg text-dracula-purple focus:ring-dracula-purple/50 focus:ring-offset-0 sm:mt-0"
              />
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={row.key}
                  onChange={(event) => updateRow(row.id, { key: event.target.value } as Partial<T>)}
                  placeholder={keyPlaceholder}
                  className="h-9 min-w-0 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment transition-all focus:border-dracula-purple focus:outline-none"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(event) => updateRow(row.id, { value: event.target.value } as Partial<T>)}
                  placeholder={valuePlaceholder}
                  className="h-9 min-w-0 rounded-lg border border-dracula-card bg-dracula-bg px-3 font-mono text-xs text-dracula-fg placeholder-dracula-comment transition-all focus:border-dracula-purple focus:outline-none"
                />
              </div>
              <button
                onClick={() => removeRow(row.id)}
                type="button"
                className="p-2 text-dracula-comment transition-colors hover:text-dracula-red"
                title={removeLabel}
                aria-label={removeLabel}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
