"use client";

import { motion } from "framer-motion";
import { Code2, LockKeyhole, Route, ShieldCheck, type LucideIcon } from "lucide-react";

interface DocsCardItem {
  title: string;
  text: string;
}

interface DocsCardsProps {
  cards: readonly DocsCardItem[];
}

const DOC_ICONS: LucideIcon[] = [Route, Code2, LockKeyhole, ShieldCheck];

export default function DocsCards({ cards }: DocsCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {cards.map((item, index) => {
        const Icon = DOC_ICONS[index] ?? Route;

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
  );
}
