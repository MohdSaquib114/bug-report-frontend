import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BugDrop — Embeddable bug reporting, triaged beautifully",
    template: "%s · BugDrop",
  },
  description:
    "BugDrop is an embeddable bug reporting widget with screenshot annotation, plus a fast workspace to triage and resolve every report.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    title: "BugDrop — Bug reporting that ships",
    description:
      "Drop a widget into any React app. Collect annotated screenshots. Triage them in a board that feels like Linear.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}