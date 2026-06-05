"use client";

import { ShieldCheck } from "lucide-react";

interface CollectionsSeedNoteProps {
  text: string;
}

export default function CollectionsSeedNote({ text }: CollectionsSeedNoteProps) {
  return (
    <section className="grid gap-4 rounded-2xl border border-dracula-green/20 bg-dracula-green/5 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <ShieldCheck className="h-7 w-7 text-dracula-green" />
      <p className="text-sm leading-6 text-dracula-comment">{text}</p>
    </section>
  );
}

