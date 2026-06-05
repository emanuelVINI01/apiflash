"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NavItem } from "./nav-items";

interface DesktopNavProps {
  pathname: string;
  items: NavItem[];
}

export default function DesktopNav({ pathname, items }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-5 md:flex">
      {items.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`relative text-xs font-semibold uppercase tracking-widest transition-colors hover:text-dracula-cyan ${
              isActive ? "text-dracula-cyan" : "text-dracula-comment"
            }`}
          >
            {label}
            {isActive && (
              <motion.span
                layoutId="apiflash-desktop-nav-active"
                className="absolute -bottom-2 left-0 right-0 mx-auto h-0.5 rounded-full bg-dracula-cyan shadow-[0_0_10px_rgba(139,233,253,0.75)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

