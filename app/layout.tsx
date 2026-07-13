import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavMenu } from "./nav-menu";
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
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <NavMenu />
        <main className="min-w-0 flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
