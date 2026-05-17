"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Code2, LockKeyhole, Route, ShieldCheck, Workflow } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import { useLanguage } from "@/context/LanguageContext";

const docIcons = [Route, Code2, LockKeyhole, ShieldCheck];

export default function DocsPage() {
  const { t } = useLanguage();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-green/25 bg-dracula-green/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-green sm:text-xs">
              <BookOpenText className="h-3.5 w-3.5" />
              {t.docsPage.badge}
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">
              {t.docsPage.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">
              {t.docsPage.subtitle}
            </p>
          </div>
          <Link
            href="/#workbench"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-dracula-green px-5 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-green/20"
          >
            {t.docsPage.runRequest}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-2">
          {t.docsPage.cards.map((item, index) => {
            const Icon = docIcons[index];

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-dracula-card/75 bg-dracula-surface/60 p-5"
              >
                <Icon className="h-6 w-6 text-dracula-cyan" />
                <h2 className="mt-5 text-lg font-semibold text-dracula-fg">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-dracula-comment">{item.text}</p>
              </motion.article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-dracula-purple" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">
              {t.docsPage.lifecycleTitle}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {t.docsPage.lifecycle.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-dracula-card bg-dracula-bg/35 p-4">
                <span className="font-mono text-xs text-dracula-purple">0{index + 1}</span>
                <h3 className="mt-3 font-semibold text-dracula-fg">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-dracula-comment">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppChrome>
  );
}
