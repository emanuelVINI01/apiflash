"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Braces, KeyRound, Library, RefreshCw, ShieldCheck, Webhook } from "lucide-react";
import AppChrome from "@/components/AppChrome";

const collections = [
  {
    title: "REST smoke tests",
    icon: Webhook,
    accent: "text-dracula-cyan",
    description: "Fast GET/POST checks for public APIs, CRUD demos and status validation.",
    requests: ["GET /posts/1", "POST /posts", "PATCH /posts/:id"],
  },
  {
    title: "Auth templates",
    icon: KeyRound,
    accent: "text-dracula-purple",
    description: "Headers and body examples for bearer-token and JSON-login workflows.",
    requests: ["POST /auth/login", "GET /users/me", "Authorization: Bearer <token>"],
  },
  {
    title: "Payload QA",
    icon: Braces,
    accent: "text-dracula-green",
    description: "Reusable JSON structures for formatting, previewing and validating request bodies.",
    requests: ["JSON body", "Content-Type", "Error inspection"],
  },
];

const recipes = [
  {
    title: "Public resource check",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    note: "Useful for validating proxy availability and response rendering.",
  },
  {
    title: "Create a record",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    note: "Use the body editor with a formatted JSON payload.",
  },
  {
    title: "Protected profile",
    method: "GET",
    url: "https://api.example.com/v1/me",
    note: "Add Authorization and Accept headers before sending.",
  },
];

export default function CollectionsPage() {
  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
          className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-dracula-purple/25 bg-dracula-purple/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-purple sm:text-xs">
              <Library className="h-3.5 w-3.5" />
              Request collections
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-dracula-fg sm:text-5xl">
              Reusable API recipes for common debugging loops.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-base">
              These collections document the request patterns apiFlash is optimized for. Start from a recipe, then run it in the workbench.
            </p>
          </div>
          <Link
            href="/#workbench"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-dracula-purple px-5 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-purple/20"
          >
            Open workbench
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-3">
          {collections.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-dracula-card/75 bg-dracula-surface/60 p-5"
            >
              <item.icon className={`h-6 w-6 ${item.accent}`} />
              <h2 className="mt-5 text-lg font-semibold text-dracula-fg">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-dracula-comment">{item.description}</p>
              <div className="mt-5 grid gap-2">
                {item.requests.map((request) => (
                  <span key={request} className="rounded-lg border border-dracula-card bg-dracula-bg/45 px-3 py-2 font-mono text-xs text-dracula-comment">
                    {request}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </section>

        <section className="rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-dracula-cyan" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">Starter recipes</h2>
          </div>
          <div className="grid gap-3">
            {recipes.map((recipe) => (
              <article key={recipe.title} className="grid gap-3 rounded-xl border border-dracula-card bg-dracula-bg/35 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <span className="w-fit rounded-lg border border-dracula-cyan/25 bg-dracula-cyan/10 px-2 py-1 font-mono text-xs font-bold text-dracula-cyan">
                  {recipe.method}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-dracula-fg">{recipe.title}</h3>
                  <p className="mt-1 break-all font-mono text-xs text-dracula-cyan">{recipe.url}</p>
                  <p className="mt-2 text-sm leading-6 text-dracula-comment">{recipe.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-dracula-green/20 bg-dracula-green/5 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <ShieldCheck className="h-7 w-7 text-dracula-green" />
          <p className="text-sm leading-6 text-dracula-comment">
            Collections are intentionally transparent: no hidden secrets are stored, and browser history remains local to the current device.
          </p>
        </section>
      </main>
    </AppChrome>
  );
}
