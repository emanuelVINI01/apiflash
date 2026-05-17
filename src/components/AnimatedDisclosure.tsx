"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AnimatedDisclosureProps {
  isOpen: boolean;
  onToggle: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
}

export default function AnimatedDisclosure({
  isOpen,
  onToggle,
  summary,
  children,
  className = "",
  buttonClassName = "",
  contentClassName = "",
}: AnimatedDisclosureProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-dracula-card ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-3 bg-dracula-card/30 p-3 transition-colors hover:bg-dracula-card/50 ${buttonClassName}`}
      >
        {summary}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="shrink-0 text-dracula-comment"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-dracula-card"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={contentClassName}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
