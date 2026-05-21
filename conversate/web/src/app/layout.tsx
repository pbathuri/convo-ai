import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnalyticsBridge } from "@/components/AnalyticsBridge";
import { PetalBackdrop } from "@/components/ui/sakura";
import { SiteNav } from "@/components/site-nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Conversate",
  description: "Company-specific interview practice with D-ID Agents and Sakura-calm coaching",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} sakura-theme min-h-screen font-sans`}
      >
        <AnalyticsBridge />
        <PetalBackdrop />
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
