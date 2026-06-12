import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "张弦 · UX Designer × AI Builder",
  description: "张弦的个人作品集：UX 产品设计、AI 产品与独立开发。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
