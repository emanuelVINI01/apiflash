"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Code2,
  History,
  Layers3,
  Library,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import AppChrome from "@/components/AppChrome";
import RequestBar, { type HttpMethod, type ResponseData } from "@/components/RequestBar";
import RequestBodyEditor from "@/components/RequestBodyEditor";
import ResponseViewer from "@/components/ResponseViewer";
import AdvancedSettings from "@/components/AdvancedSettings";
import type { HeaderRow } from "@/components/HeadersEditor";

const HISTORY_KEY = "apiflash-history-v1";

type RequestPreset = {
  title: string;
  description: string;
  method: HttpMethod;
  url: string;
  body?: string;
  headers?: HeaderRow[];
};

const presets: RequestPreset[] = [
  {
    title: "Public JSON",
    description: "Check a simple resource endpoint and inspect response headers.",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
  },
  {
    title: "Create Payload",
    description: "Send a JSON body through the proxy and validate formatting.",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    body: JSON.stringify({ title: "apiFlash", body: "Mobile-first HTTP test", userId: 1 }, null, 2),
  },
  {
    title: "Bearer Template",
    description: "Start an authenticated request with a ready Authorization row.",
    method: "GET",
    url: "https://api.example.com/v1/me",
    headers: [
      { id: "authorization", key: "Authorization", value: "Bearer <token>", enabled: true },
      { id: "accept", key: "Accept", value: "application/json", enabled: true },
    ],
  },
];

const resourceLinks = [
  {
    href: "/collections",
    icon: Library,
    title: "Collections",
    text: "Reusable endpoint recipes for REST checks, auth flows and JSON payloads.",
  },
  {
    href: "/history",
    icon: History,
    title: "Local history",
    text: "Browser-side call log with status, duration and endpoint metadata.",
  },
  {
    href: "/docs",
    icon: BookOpenText,
    title: "Docs",
    text: "Proxy behavior, safety notes and the request lifecycle documented clearly.",
  },
];

export default function Home() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderRow[]>([]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const applyPreset = (preset: RequestPreset) => {
    setMethod(preset.method);
    setUrl(preset.url);
    setBody(preset.body ?? "");
    setHeaders(preset.headers ?? []);
    setError(null);
  };

  const saveHistory = (data: ResponseData) => {
    if (typeof window === "undefined" || !url.trim()) return;

    try {
      const previous = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as unknown[];
      const entry = {
        id: crypto.randomUUID(),
        method,
        url: url.trim(),
        status: data.status,
        statusText: data.statusText,
        duration: data.duration,
        createdAt: new Date().toISOString(),
      };

      window.localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...previous].slice(0, 24)));
    } catch {
      // History is a convenience feature; request execution should never fail because storage is unavailable.
    }
  };

  const handleResponse = (data: ResponseData) => {
    setResponse(data);
    setError(null);
    saveHistory(data);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setResponse(null);
  };

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <section className="grid min-h-[calc(100svh-10rem)] items-center gap-8 lg:grid-cols-[1fr_0.86fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan sm:text-xs">
              <Zap className="h-3.5 w-3.5 fill-dracula-cyan" />
              Mobile-first HTTP workbench
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-dracula-fg sm:text-5xl lg:text-6xl">
              Test endpoints fast with a focused Dracula request cockpit.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-dracula-comment sm:text-lg sm:leading-8">
              apiFlash keeps the core flow close to your thumb: method, URL, headers, body, response, history and reusable request recipes.
            </p>

            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="#workbench"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-dracula-cyan px-5 py-3 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-cyan/20 transition-transform hover:-translate-y-0.5"
              >
                Open workbench
                <Send className="h-4 w-4" />
              </a>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dracula-card/70 bg-dracula-bg/25 px-5 py-3 text-sm font-semibold text-dracula-comment transition-colors hover:border-dracula-card hover:text-dracula-fg"
              >
                Browse collections
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
              <span className="ml-2 truncate text-[10px] text-dracula-comment sm:text-xs">
                apiflash.emanuelvini.dev/request
              </span>
            </div>
            <div className="grid gap-3">
              {[
                { label: "Latency", value: response ? `${response.duration}ms` : "ready", icon: Clock3, color: "text-dracula-green" },
                { label: "Status", value: response ? `${response.status}` : "idle", icon: ShieldCheck, color: "text-dracula-cyan" },
                { label: "Mode", value: method, icon: Code2, color: "text-dracula-purple" },
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

        <section className="grid gap-4 sm:grid-cols-3">
          {presets.map((preset, index) => (
            <motion.button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ delay: index * 0.05, duration: 0.32 }}
              className="group rounded-xl border border-dracula-card/75 bg-dracula-card/25 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-dracula-cyan/45 hover:bg-dracula-card/35"
            >
              <span className="rounded-lg border border-dracula-cyan/20 bg-dracula-cyan/10 px-2 py-1 font-mono text-xs font-bold text-dracula-cyan">
                {preset.method}
              </span>
              <h2 className="mt-4 text-base font-semibold text-dracula-fg">{preset.title}</h2>
              <p className="mt-2 text-sm leading-6 text-dracula-comment">{preset.description}</p>
            </motion.button>
          ))}
        </section>

        <section id="workbench" className="grid scroll-mt-24 gap-5 lg:grid-cols-[0.96fr_1.04fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-4 rounded-2xl border border-dracula-card bg-dracula-card/20 p-4 backdrop-blur-sm sm:p-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-dracula-purple" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">Request</h2>
            </div>

            <RequestBar
              method={method}
              url={url}
              headers={headers}
              body={body}
              onMethodChange={setMethod}
              onUrlChange={setUrl}
              onResponse={handleResponse}
              onError={handleError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            <AdvancedSettings headers={headers} onHeadersChange={setHeaders} />
            <RequestBodyEditor body={body} method={method} onChange={setBody} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.06 }}
            className="flex flex-col gap-4 rounded-2xl border border-dracula-card bg-dracula-card/20 p-4 backdrop-blur-sm sm:p-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-dracula-cyan" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">Response</h2>
            </div>

            <ResponseViewer response={response} error={error} isLoading={isLoading} />
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {resourceLinks.map((resource, index) => (
            <motion.div
              key={resource.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-dracula-card/75 bg-dracula-surface/55 p-5"
            >
              <resource.icon className="h-6 w-6 text-dracula-cyan" />
              <h2 className="mt-5 text-lg font-semibold text-dracula-fg">{resource.title}</h2>
              <p className="mt-2 text-sm leading-6 text-dracula-comment">{resource.text}</p>
              <Link href={resource.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dracula-purple">
                Open
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </section>

        <section className="rounded-2xl border border-dracula-card/70 bg-dracula-bg/35 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-green">
                <Sparkles className="h-4 w-4" />
                Product workflow
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-dracula-fg">Built for repeated API checks, not a one-off demo.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Layers3, text: "Preset requests keep common flows one tap away." },
                { icon: ShieldCheck, text: "The proxy route isolates browser CORS friction from the UI." },
                { icon: History, text: "Successful calls are saved locally for quick review." },
                { icon: Code2, text: "JSON validation and preview help catch payload issues before send." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="rounded-xl border border-dracula-card/70 bg-dracula-card/20 p-4 text-sm leading-6 text-dracula-comment">
                  <Icon className="mb-3 h-5 w-5 text-dracula-cyan" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppChrome>
  );
}
