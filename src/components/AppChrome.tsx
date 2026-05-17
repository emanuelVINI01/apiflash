"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpenText, History, Home, Library } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import ApiFlashLogo from "@/components/ApiFlashLogo";
import Footer from "@/components/Footer";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const navItems = [
    { href: "/", label: t.common.workbench, icon: Home },
    { href: "/collections", label: t.common.collections, icon: Library },
    { href: "/history", label: t.common.history, icon: History },
    { href: "/docs", label: t.common.docs, icon: BookOpenText },
  ];

  return (
    <div className="min-h-screen bg-dracula-bg text-dracula-fg">
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-40 border-b border-dracula-card/50 bg-dracula-bg/86 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <ApiFlashLogo markClassName="h-9 w-9 transition-colors group-hover:border-dracula-purple/50" />
            <span className="hidden min-w-0 truncate text-sm text-dracula-comment sm:inline">
              / {t.nav.subtitle}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-5 md:flex">
              {navItems.map(({ href, label }) => {
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

            <LanguageToggle />
            <a
              href="https://github.com/emanuelVINI01/api-flash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dracula-cyan/25 bg-dracula-cyan/10 px-2.5 text-xs font-semibold uppercase tracking-widest text-dracula-cyan transition-colors hover:border-dracula-cyan/60 hover:bg-dracula-cyan/15 sm:px-3"
            >
              <span className="hidden sm:inline">{t.common.github}</span>
              <FaGithub className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 pt-14 sm:pt-16">{children}</div>
      <Footer />

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-dracula-card/80 bg-dracula-bg/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-stretch gap-0.5 sm:gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-full min-w-0 flex-col items-center justify-between rounded-xl px-0.5 py-1.5 text-[9px] font-semibold uppercase tracking-tight transition-colors sm:px-1 sm:text-[10px] ${
                  isActive ? "text-dracula-fg" : "text-dracula-comment hover:text-dracula-cyan"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="apiflash-mobile-nav-pill"
                    className="absolute inset-0 rounded-xl border border-dracula-cyan/35 bg-dracula-surface shadow-lg shadow-black/25"
                    transition={{ type: "spring", stiffness: 430, damping: 36 }}
                  />
                )}
                <span
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-7 sm:w-7 ${
                    isActive ? "bg-dracula-cyan/15 text-dracula-cyan" : "text-dracula-comment"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="relative z-10 block h-3 max-w-full truncate leading-3">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
