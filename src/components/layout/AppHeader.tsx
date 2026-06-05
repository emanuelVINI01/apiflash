"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, UserCircle } from "lucide-react";
import ApiFlashLogo from "@/components/ApiFlashLogo";
import LanguageToggle from "@/components/LanguageToggle";
import DesktopNav from "./DesktopNav";
import type { NavItem } from "./nav-items";

interface AppHeaderProps {
  pathname: string;
  navItems: NavItem[];
  subtitle: string;
  loginLabel: string;
  logoutLabel: string;
}

export default function AppHeader({ pathname, navItems, subtitle, loginLabel, logoutLabel }: AppHeaderProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-40 border-b border-dracula-card/50 bg-dracula-bg/86 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <ApiFlashLogo markClassName="h-9 w-9 transition-colors group-hover:border-dracula-purple/50" />
          <span className="hidden min-w-0 truncate text-sm text-dracula-comment sm:inline">/ {subtitle}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <DesktopNav pathname={pathname} items={navItems} />
          <LanguageToggle />
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dracula-green/25 bg-dracula-green/10 px-2.5 text-xs font-semibold uppercase tracking-widest text-dracula-green transition-colors hover:border-dracula-green/60 hover:bg-dracula-green/15 sm:px-3"
            >
              <UserCircle className="h-3.5 w-3.5" />
              <span className="hidden max-w-28 truncate sm:inline">{session.user?.name ?? logoutLabel}</span>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          ) : (
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dracula-cyan/25 bg-dracula-cyan/10 px-2.5 text-xs font-semibold uppercase tracking-widest text-dracula-cyan transition-colors hover:border-dracula-cyan/60 hover:bg-dracula-cyan/15 sm:px-3"
          >
            <span className="hidden sm:inline">{loginLabel}</span>
            <LogIn className="h-3.5 w-3.5" />
          </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
