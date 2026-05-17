"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, History, Library } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const resourceMeta = [
  { href: "/collections", icon: Library },
  { href: "/history", icon: History },
  { href: "/docs", icon: BookOpenText },
];

export default function ResourceLinksSection() {
  const { t } = useLanguage();

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {resourceMeta.map((resource, index) => {
        const Icon = resource.icon;
        const content = t.home.resources[index];

        return (
          <motion.div
            key={resource.href}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-dracula-card/75 bg-dracula-surface/55 p-5"
          >
            <Icon className="h-6 w-6 text-dracula-cyan" />
            <h2 className="mt-5 text-lg font-semibold text-dracula-fg">{content.title}</h2>
            <p className="mt-2 text-sm leading-6 text-dracula-comment">{content.text}</p>
            <Link href={resource.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dracula-purple">
              {t.common.open}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        );
      })}
    </section>
  );
}
