"use client";

import { motion } from "framer-motion";
import { Activity, BellRing, Braces, ChartNoAxesColumnIncreasing, Globe2, RadioTower, Repeat2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { regionHealthPreview } from "@/lib/monitoring-preview";

const pillarIcons = [Activity, RadioTower, Globe2, Braces];

export default function MonitoringPlatformSections() {
  const { t } = useLanguage();
  const metricCards = [
    { label: t.home.metricsPreview.uptime, value: "99.98%", icon: ShieldCheck, colorClass: "text-dracula-green" },
    { label: t.home.metricsPreview.p95, value: "142ms", icon: ChartNoAxesColumnIncreasing, colorClass: "text-dracula-cyan" },
    { label: t.home.metricsPreview.incidents, value: "1", icon: BellRing, colorClass: "text-dracula-red" },
    { label: t.home.metricsPreview.regions, value: "3/4", icon: Globe2, colorClass: "text-dracula-yellow" },
  ];

  return (
    <>
      <section className="grid gap-4 md:grid-cols-4">
        {t.home.pillars.map((pillar, index) => {
          const Icon = pillarIcons[index];

          return (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-dracula-card/75 bg-dracula-surface/55 p-5"
            >
              <Icon className="h-6 w-6 text-dracula-cyan" />
              <h2 className="mt-5 text-lg font-semibold text-dracula-fg">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-6 text-dracula-comment">{pillar.text}</p>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-3xl border border-dracula-card/70 bg-[radial-gradient(circle_at_top_right,rgba(80,250,123,0.13),transparent_30%),rgba(40,42,54,0.46)] p-6"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-green">
            <Repeat2 className="h-4 w-4" />
            {t.home.preview.productLoop}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-dracula-fg">{t.home.differenceTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-dracula-comment">{t.home.differenceText}</p>
          <div className="mt-6 grid gap-3">
            {t.home.timeline.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-dracula-card/70 bg-dracula-surface/35 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dracula-cyan/10 font-mono text-xs font-bold text-dracula-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-dracula-fg">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.06 }}
          className="rounded-3xl border border-dracula-card/70 bg-dracula-surface/55 p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {metricCards.map(({ label, value, icon: Icon, colorClass }) => (
              <div key={label} className="rounded-2xl border border-dracula-card bg-dracula-bg/45 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-dracula-comment">{label}</span>
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                </div>
                <p className="mt-3 font-mono text-3xl font-bold text-dracula-fg">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-dracula-card bg-dracula-bg/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-dracula-comment">{t.home.preview.regionComparison}</p>
            <div className="mt-4 space-y-3">
              {regionHealthPreview.map((region) => (
                <div key={region.label} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
                  <span className="font-mono text-xs text-dracula-comment">{region.label}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-dracula-card/70">
                    <span className={`block h-full rounded-full ${region.widthClass} ${region.colorClass}`} />
                  </span>
                  <span className="text-right font-mono text-xs text-dracula-fg">{region.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="rounded-3xl border border-dracula-card/70 bg-[linear-gradient(135deg,rgba(68,71,90,0.45),rgba(20,22,31,0.72))] p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-dracula-cyan">
              <Globe2 className="h-4 w-4" />
              {t.home.collectionsPreview.badge}
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-dracula-fg">{t.home.collectionsPreview.title}</h2>
            <p className="mt-3 text-sm leading-7 text-dracula-comment">{t.home.collectionsPreview.subtitle}</p>
          </div>
          <div className="rounded-3xl border border-dracula-card bg-dracula-bg/55 p-4 shadow-2xl shadow-black/25">
            <div className="rounded-2xl border border-dracula-green/25 bg-dracula-green/10 p-3 text-sm font-semibold text-dracula-green">
              {t.home.collectionsPreview.syncNote}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {t.home.collectionsPreview.items.map((component, index) => (
                <div key={component} className="rounded-2xl border border-dracula-card/80 bg-dracula-surface/45 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-dracula-fg">{component}</p>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index === 3 ? "bg-dracula-yellow shadow-[0_0_18px_rgba(241,250,140,0.48)]" : "bg-dracula-green"
                      }`}
                    />
                  </div>
                  <p className="mt-3 font-mono text-xs text-dracula-comment">
                    {index === 3 ? t.home.collectionsPreview.privateLabel : t.home.collectionsPreview.readyLabel}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-2xl border border-dracula-card/80 bg-dracula-card/20 p-3 text-sm text-dracula-comment">
              {t.home.collectionsPreview.footer}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
