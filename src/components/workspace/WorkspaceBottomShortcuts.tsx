"use client";

import { motion } from "framer-motion";
import type { WorkspaceNavigationItem } from "./WorkspaceSideNav";

interface WorkspaceBottomShortcutsProps {
  label: string;
  items: readonly WorkspaceNavigationItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function WorkspaceBottomShortcuts({ label, items, activeId, onSelect }: WorkspaceBottomShortcutsProps) {
  return (
    <nav aria-label={label} className="fixed inset-x-3 bottom-24 z-40 lg:hidden">
      <div className="mx-auto flex max-w-md gap-1 overflow-x-auto rounded-2xl border border-dracula-card/80 bg-dracula-bg/95 p-1.5 shadow-[0_18px_44px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {items.map(({ id, label: itemLabel, icon: Icon }) => {
          const isActive = activeId === id;

          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              whileTap={{ scale: 0.92, y: 2 }}
              className={`relative flex h-11 min-w-[4.35rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[9px] font-semibold uppercase tracking-tight transition-colors ${
                isActive ? "text-dracula-fg" : "text-dracula-comment"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="workspace-bottom-active"
                  className="absolute inset-0 rounded-xl border border-dracula-cyan/35 bg-dracula-surface"
                  transition={{ type: "spring", stiffness: 430, damping: 32 }}
                />
              )}
              <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-dracula-cyan" : ""}`} />
              <span className="relative z-10 max-w-full truncate">{itemLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

