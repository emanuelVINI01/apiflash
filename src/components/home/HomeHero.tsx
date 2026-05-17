"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Code2, Send, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { HttpMethod, ResponseData } from "@/lib/request-model";

interface HomeHeroProps {
  method: HttpMethod;
  response: ResponseData | null;
}

export default function HomeHero({ method, response }: HomeHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="grid min-h-[calc(100svh-10rem)] items-center gap-8 lg:grid-cols-[1fr_0.86fr] lg:gap-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan sm:text-xs">
          <Zap className="h-3.5 w-3.5 fill-dracula-cyan" />
          {t.home.badge}
        </div>

        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-dracula-fg sm:text-5xl lg:text-6xl">
          {t.home.title}
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-lg sm:leading-8">
          {t.home.subtitle}
        </p>

        <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
          <a
            href="#workbench"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-dracula-cyan px-5 py-3 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-cyan/20 transition-transform hover:-translate-y-0.5"
          >
            {t.home.openWorkbench}
            <Send className="h-4 w-4" />
          </a>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dracula-card/70 bg-dracula-bg/25 px-5 py-3 text-sm font-semibold text-dracula-comment transition-colors hover:border-dracula-card hover:text-dracula-fg"
          >
            {t.home.browseCollections}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.48, delay: 0.08, ease: "easeOut" }}
        className="terminal-scan relative overflow-hidden rounded-2xl border border-dracula-card/70 bg-dracula-surface/70 p-4 shadow-2xl shadow-black/35 backdrop-blur"
      >
        <div className="mb-4 flex items-center gap-2 border-b border-dracula-card/60 pb-3">
          <span className="h-3 w-3 rounded-full bg-dracula-red/80" />
          <span className="h-3 w-3 rounded-full bg-dracula-green/70" />
          <span className="h-3 w-3 rounded-full bg-dracula-comment/50" />
          <span className="ml-2 truncate text-[10px] text-dracula-comment sm:text-xs">{t.home.terminalUrl}</span>
        </div>
        <div className="grid gap-3">
          {[
            {
              label: t.home.metrics.latency,
              value: response ? `${response.duration}ms` : t.home.metrics.ready,
              icon: Clock3,
              color: "text-dracula-green",
            },
            {
              label: t.home.metrics.status,
              value: response ? `${response.status}` : t.home.metrics.idle,
              icon: ShieldCheck,
              color: "text-dracula-cyan",
            },
            { label: t.home.metrics.mode, value: method, icon: Code2, color: "text-dracula-purple" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-dracula-card bg-dracula-bg/45 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-dracula-comment">{label}</span>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="mt-2 font-mono text-2xl font-bold text-dracula-fg">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
