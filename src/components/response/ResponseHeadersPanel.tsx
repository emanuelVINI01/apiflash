"use client";

interface ResponseHeadersPanelProps {
  headers: Record<string, string>;
  emptyLabel: string;
}

export default function ResponseHeadersPanel({ headers, emptyLabel }: ResponseHeadersPanelProps) {
  const entries = Object.entries(headers);

  return (
    <div className="max-h-[480px] max-w-full overflow-auto p-4">
      {entries.length === 0 ? (
        <p className="font-mono text-sm text-dracula-comment">{emptyLabel}</p>
      ) : (
        <table className="w-full table-fixed border-collapse font-mono text-sm">
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key} className="border-b border-dracula-card/50 transition-colors hover:bg-dracula-card/30">
                <td className="w-2/5 break-all py-2 pr-4 align-top text-dracula-purple">{key}</td>
                <td className="break-all py-2 text-dracula-fg">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

