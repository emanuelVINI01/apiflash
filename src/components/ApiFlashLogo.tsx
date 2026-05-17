import { Zap } from "lucide-react";

interface ApiFlashLogoProps {
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
}

export default function ApiFlashLogo({
  showWordmark = true,
  className = "",
  markClassName = "",
}: ApiFlashLogoProps) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <span
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dracula-cyan/45 bg-dracula-bg shadow-[0_0_24px_rgba(139,233,253,0.2)] ${markClassName}`}
        aria-hidden="true"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(139,233,253,0.34),transparent_32%),linear-gradient(135deg,rgba(189,147,249,0.42),rgba(80,250,123,0.12))]" />
        <svg className="relative h-7 w-7" viewBox="0 0 40 40" fill="none" role="img">
          <path
            d="M9 13.5 15.5 7M9 26.5 15.5 33M31 13.5 24.5 7M31 26.5 24.5 33"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-dracula-cyan"
          />
          <path
            d="M19.5 7.5 14.2 20H20L16.7 32.5 26 17.3H20.8L24.4 7.5H19.5Z"
            className="fill-dracula-yellow"
          />
        </svg>
        <Zap className="absolute bottom-1 right-1 h-3 w-3 fill-dracula-cyan text-dracula-cyan" />
      </span>
      {showWordmark && (
        <span className="min-w-0 truncate font-semibold tracking-tight text-dracula-fg">
          api<span className="text-dracula-cyan">Flash</span>
        </span>
      )}
    </span>
  );
}
