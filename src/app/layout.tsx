import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    default: "Blog CMS",
    template: "%s | Blog CMS",
  },
  description: "一个简洁高效的博客内容管理系统，支持 Markdown 编辑、分类管理和全文搜索",
  keywords: ["博客", "CMS", "内容管理", "Markdown", "Next.js"],
  authors: [{ name: "Blog CMS" }],
  creator: "Blog CMS",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Blog CMS",
    title: "Blog CMS",
    description: "一个简洁高效的博客内容管理系统",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog CMS",
    description: "一个简洁高效的博客内容管理系统",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
