"use client";

import { Activity, Gauge, Link2, ShieldCheck } from "lucide-react";
import type { RequestWorkbenchController } from "@/hooks/useRequestWorkbench";

interface WorkspaceOverviewProps {
  workbench: RequestWorkbenchController;
  labels: {
    method: string;
    url: string;
    status: string;
    response: string;
    emptyUrl: string;
    idle: string;
  };
}

export default function WorkspaceOverview({ workbench, labels }: WorkspaceOverviewProps) {
  const responseLabel = workbench.response
    ? `${workbench.response.status} ${workbench.response.statusText}`
    : labels.idle;
  const statusLabel = workbench.isLoading ? "..." : responseLabel;

  const cards = [
    { label: labels.method, value: workbench.method, icon: Activity, color: "text-dracula-purple" },
    { label: labels.url, value: workbench.url || labels.emptyUrl, icon: Link2, color: "text-dracula-cyan" },
    { label: labels.status, value: statusLabel, icon: ShieldCheck, color: "text-dracula-green" },
    {
      label: labels.response,
      value: workbench.response ? `${workbench.response.duration}ms` : labels.idle,
      icon: Gauge,
      color: "text-dracula-orange",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="min-w-0 rounded-xl border border-dracula-card/70 bg-dracula-card/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-xs font-semibold uppercase tracking-widest text-dracula-comment">{label}</span>
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
          </div>
          <p className="mt-3 truncate font-mono text-lg font-semibold text-dracula-fg">{value}</p>
        </div>
      ))}
    </section>
  );
}

