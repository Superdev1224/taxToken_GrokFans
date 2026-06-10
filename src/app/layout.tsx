import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
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
          <div className="mx-auto flex w-full max-w-7xl">
            <Sidebar />
            <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:py-8">
              {children}
            </main>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
