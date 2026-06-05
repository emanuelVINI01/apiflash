"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Library, Send, ShieldCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import AppChrome from "@/components/AppChrome";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <AppChrome>
      <main className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-5xl items-center px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <section className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-3xl border border-dracula-card/75 bg-dracula-surface/60 p-6 shadow-2xl shadow-black/25 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-dracula-cyan">
              <ShieldCheck className="h-4 w-4" />
              {t.loginPage.badge}
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-dracula-fg sm:text-5xl">
              {t.loginPage.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-dracula-comment sm:text-base">{t.loginPage.subtitle}</p>

            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              {isAuthenticated ? (
                <Link
                  href="/collections"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-dracula-green px-5 text-sm font-semibold text-dracula-bg transition-opacity hover:opacity-90"
                >
                  <Library className="h-4 w-4" />
                  {t.loginPage.openCollections}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/collections" })}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-dracula-cyan px-5 text-sm font-semibold text-dracula-bg transition-opacity hover:opacity-90"
                >
                  <FaGithub className="h-4 w-4" />
                  {t.loginPage.githubCta}
                </button>
              )}
              <Link
                href="/workspace"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-dracula-card/70 bg-dracula-bg/35 px-5 text-sm font-semibold text-dracula-comment transition-colors hover:text-dracula-fg"
              >
                <Send className="h-4 w-4" />
                {t.loginPage.workbenchCta}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-dracula-card/70 bg-[radial-gradient(circle_at_top_right,rgba(139,233,253,0.16),transparent_34%),rgba(40,42,54,0.5)] p-5">
            <div className="grid gap-3">
              {t.loginPage.benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl border border-dracula-card/75 bg-dracula-bg/45 p-4">
                  <p className="font-semibold text-dracula-fg">{benefit.title}</p>
                  <p className="mt-2 text-sm leading-6 text-dracula-comment">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppChrome>
  );
}
