import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from '@/context';

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

// ✅ متادیتا مخصوص پروژه‌ی Ewave Airdrop
export const metadata: Metadata = {
  title: "Ewave Airdrop | Claim Free BDOGE",
  description: "Claim your free BDOGE tokens powered by Reown AppKit."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // فقط در سرور قابل دسترسی است
  const cookies = headers().get('cookie');

  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
