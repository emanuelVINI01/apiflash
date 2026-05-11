import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apiflash.emanuelvini.dev"),
  title: "apiFlash — Cliente HTTP Minimalista",
  description: "Teste endpoints REST rapidamente, direto no navegador. Sem configuração.",
  openGraph: {
    title: "apiFlash — Cliente HTTP Minimalista",
    description: "Cliente HTTP dark para testar endpoints REST direto no navegador.",
    url: "https://apiflash.emanuelvini.dev",
    siteName: "apiFlash",
    type: "website",
    locale: "pt_BR",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
