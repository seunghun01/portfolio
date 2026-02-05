import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"),
  title: {
    default: "개발자 포트폴리오",
    template: "%s | 개발자 포트폴리오",
  },
  description: "풀스택 개발자의 기술 블로그 및 포트폴리오",
  keywords: ["개발자", "포트폴리오", "블로그", "Next.js", "React", "TypeScript", "풀스택"],
  authors: [{ name: "Developer" }],
  creator: "Developer",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "개발자 포트폴리오",
    title: "개발자 포트폴리오",
    description: "풀스택 개발자의 기술 블로그 및 포트폴리오",
  },
  twitter: {
    card: "summary_large_image",
    title: "개발자 포트폴리오",
    description: "풀스택 개발자의 기술 블로그 및 포트폴리오",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
