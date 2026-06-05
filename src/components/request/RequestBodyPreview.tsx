"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface RequestBodyPreviewProps {
  body: string;
  language: string;
  emptyLabel: string;
}

export default function RequestBodyPreview({ body, language, emptyLabel }: RequestBodyPreviewProps) {
  return (
    <div className="min-h-[180px] max-w-full overflow-auto">
      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          margin: 0,
          padding: "16px",
          background: "transparent",
          fontSize: "13px",
          lineHeight: "1.6",
          minHeight: "180px",
        }}
        wrapLongLines
      >
        {body.trim() ? body : emptyLabel}
      </SyntaxHighlighter>
    </div>
  );
}

