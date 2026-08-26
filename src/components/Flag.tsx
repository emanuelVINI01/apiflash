import Image from "next/image";
import type { Language } from "@/i18n/dictionaries";

export type LocaleCode = Language;

export const FLAGS: Record<LocaleCode, { src: string; label: string }> = {
  pt: { src: "/flags/br.svg", label: "Português" },
  en: { src: "/flags/us.svg", label: "English" },
};

interface FlagProps {
  locale: LocaleCode;
  size?: number;
  className?: string;
}

export default function Flag({ locale, size = 18, className }: FlagProps) {
  const flag = FLAGS[locale];

  return (
    <Image
      src={flag.src}
      alt={flag.label}
      title={flag.label}
      width={size}
      height={size}
      unoptimized
      className={`inline-block rounded-[3px] object-cover ${className ?? ""}`}
    />
  );
}
