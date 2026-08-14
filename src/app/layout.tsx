import Providers from "@/providers/providers";
import type { Metadata } from "next";
import { Amiri, Noto_Naskh_Arabic, Scheherazade_New } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-scheherazade",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  weight: ["400", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-noto-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Almunji",
  description: "Almunji Web App v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${amiri.variable} ${scheherazade.variable} ${notoNaskh.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
