"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import ApiFlashLogo from "@/components/ApiFlashLogo";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const footerLinks = [
    { label: t.common.home, href: "/" },
    { label: t.common.workbench, href: "/workspace" },
    { label: t.common.collections, href: "/collections" },
    { label: t.common.history, href: "/history" },
    { label: t.common.docs, href: "/docs" },
  ];

  return (
    <footer className="relative z-10 w-full border-t border-dracula-card/70 bg-dracula-bg text-dracula-comment">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-32 pt-10 sm:gap-10 sm:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 text-dracula-fg">
              <ApiFlashLogo />
            </Link>
            <p className="mt-4 text-sm leading-relaxed">{t.footer.description}</p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-fg">
              <Sparkles className="h-3.5 w-3.5 text-dracula-purple" />
              {t.footer.navigation}
            </div>
            <div className="grid gap-2 text-sm">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-dracula-cyan">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-fg">
              <ShieldCheck className="h-3.5 w-3.5 text-dracula-green" />
              {t.footer.project}
            </div>
            <div className="grid gap-3 text-sm">
              <a
                href="https://github.com/emanuelVINI01/api-flash"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-dracula-cyan/20 bg-dracula-cyan/10 px-3 py-2 text-dracula-fg transition-colors hover:border-dracula-cyan/50 hover:text-dracula-cyan"
              >
                <FaGithub className="h-4 w-4" />
                {t.common.repository}
              </a>
              <a
                href="https://apiflash.emanuelvini.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 transition-colors hover:text-dracula-cyan"
              >
                {t.common.website}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-dracula-card/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} apiFlash. {t.footer.rights}</p>
          <p className="text-dracula-comment/80">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
