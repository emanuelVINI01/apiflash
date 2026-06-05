"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface WorkspaceNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface WorkspaceSideNavProps {
  title: string;
  items: readonly WorkspaceNavigationItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function WorkspaceSideNav({ title, items, activeId, onSelect }: WorkspaceSideNavProps) {
  return (
    <aside className="sticky top-24 hidden self-start rounded-xl border border-dracula-card/70 bg-dracula-bg/70 p-2 backdrop-blur lg:block">
      <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-widest text-dracula-comment">{title}</p>
      <nav className="grid gap-1">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = activeId === id;

          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              whileTap={{ scale: 0.97 }}
              className={`relative flex h-10 min-w-0 items-center gap-2 rounded-lg px-3 text-left text-sm transition-colors ${
                isActive ? "text-dracula-fg" : "text-dracula-comment hover:text-dracula-cyan"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="workspace-sidebar-active"
                  className="absolute inset-0 rounded-lg border border-dracula-cyan/30 bg-dracula-card/70"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10 truncate">{label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

