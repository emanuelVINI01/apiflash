"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { shouldShowLineNumbers } from "@/utils/response-format";

interface ResponseBodyPanelProps {
  body: string;
  language: string;
  emptyLabel: string;
}

export default function ResponseBodyPanel({ body, language, emptyLabel }: ResponseBodyPanelProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={dracula}
      customStyle={{
        margin: 0,
        padding: "16px",
        background: "rgba(68,71,90,0.3)",
        fontSize: "13px",
        lineHeight: "1.6",
        maxHeight: "480px",
        overflowY: "auto",
      }}
      wrapLongLines
      showLineNumbers={shouldShowLineNumbers(body)}
      lineNumberStyle={{ color: "#6272a4", fontSize: "11px" }}
    >
      {body || emptyLabel}
    </SyntaxHighlighter>
  );
}

