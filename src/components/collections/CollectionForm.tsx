"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CollectionFormProps {
  onCreate: (name: string, description: string) => void;
}

export default function CollectionForm({ onCreate }: CollectionFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    onCreate(name, description);
    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:p-5"
    >
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t.collectionsPage.namePlaceholder}
        className="h-11 rounded-xl border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
      />
      <input
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder={t.collectionsPage.descriptionPlaceholder}
        className="h-11 rounded-xl border border-dracula-card bg-dracula-bg px-3 text-sm text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-dracula-cyan px-4 text-sm font-semibold text-dracula-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
        {t.collectionsPage.newCollection}
      </button>
    </form>
  );
}
