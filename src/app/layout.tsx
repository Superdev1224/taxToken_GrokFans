import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { Header } from "@/components/layout/Header";
import { Background } from "@/components/layout/Background";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GrokFANS — Referral Dashboard",
  description:
    "Track Builder & Leader rewards, generate referral links, and grow your GrokFANS network on BNB Smart Chain.",
  keywords: ["GrokFANS", "BSC", "referral", "crypto", "Web3"],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} min-h-screen antialiased`}>
        <Web3Provider>
          <Background />
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:py-8">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
