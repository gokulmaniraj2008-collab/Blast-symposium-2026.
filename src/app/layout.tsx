import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BLAST Symposium 2026 | RVS ITECH CSE Department",
  description:
    "BLAST Symposium 2026 — Empowering Tomorrow: Technology, AI, Sustainability, Humanity. 13–14 March 2026, RVS ITECH College of Engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0518] text-[#fbeef8]">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
