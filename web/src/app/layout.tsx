import type { Metadata } from "next";
import { Anybody, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const anybody = Anybody({
  subsets: ["latin"],
  variable: "--font-anybody",
  axes: ["wdth"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OMAMA Social Hotel · Aosta",
  description:
    "Boutique 4 stelle nel cuore di Aosta. Design, arte, tecnologia e spirito urbano tra le Alpi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${anybody.variable} ${outfit.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
