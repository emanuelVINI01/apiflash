import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://apiflash.emanuelvini.dev"),
  title: "apiFlash - Mobile HTTP Workbench",
  description: "Mobile-first Dracula HTTP client for endpoint testing, reusable collections, local history and response inspection.",
  openGraph: {
    title: "apiFlash - Mobile HTTP Workbench",
    description: "Dark HTTP workbench for testing REST endpoints directly in the browser.",
    url: "https://apiflash.emanuelvini.dev",
    siteName: "apiFlash",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
