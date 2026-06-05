import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://apiflash.emanuelvini.dev"),
  title: "apiFlash - HTTP Workbench",
  description:
    "HTTP workbench for testing APIs, inspecting responses and saving authenticated request collections.",
  openGraph: {
    title: "apiFlash - HTTP Workbench",
    description:
      "Test APIs, inspect responses and persist reusable request collections after GitHub login.",
    url: "https://apiflash.emanuelvini.dev",
    siteName: "apiFlash",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/apiflash-logo.svg",
        width: 256,
        height: 256,
        alt: "apiFlash logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
