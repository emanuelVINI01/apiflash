"use client";

interface RequestBodyTextareaProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
}

export default function RequestBodyTextarea({
  value,
  placeholder,
  onChange,
  onFocusChange,
}: RequestBodyTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      placeholder={placeholder}
      spellCheck={false}
      className="min-h-[180px] w-full min-w-0 resize-y bg-dracula-card/50 p-4 font-mono text-sm leading-relaxed text-dracula-fg placeholder-dracula-comment/50 transition-colors duration-200 focus:outline-none"
    />
  );
}

