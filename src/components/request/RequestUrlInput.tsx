"use client";

interface RequestUrlInputProps {
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

export default function RequestUrlInput({ value, placeholder, disabled, onChange }: RequestUrlInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="h-12 min-w-0 flex-1 rounded-xl border border-dracula-card bg-dracula-card px-4 font-mono text-sm text-dracula-fg placeholder-dracula-comment transition-all duration-200 hover:border-dracula-comment focus:border-dracula-purple focus:outline-none focus:ring-1 focus:ring-dracula-purple/50 disabled:opacity-50"
    />
  );
}

