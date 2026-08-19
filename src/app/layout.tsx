import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ChannelTalk from "@/components/ChannelTalk";

export const metadata: Metadata = {
  metadataBase: new URL("https://postsyncapp.com"),
  title: "PostSync - 전문직 전용 AI 블로그 자동화",
  description: "변호사, 세무사, 노무사 등 YMYL 전문직을 위한 광고법 준수 및 네이버 C-Rank 최적화 AI 포스팅 솔루션입니다.",
  keywords: ["AI 블로그", "전문직 마케팅", "변호사 마케팅", "세무사 블로그", "자동 포스팅"],
  alternates: {
    canonical: "https://postsyncapp.com",
  },
  verification: {
    google: "ugoQGlNSdScisq23rSDCxHIZad-HlZLatf1TUZ5006A",
    other: {
      "naver-site-verification": "ba49c1186879f716b9e200013952414d6d5ce723",
    },
  },
  openGraph: {
    title: "PostSync - 전문직 전용 AI 블로그 자동화",
    description: "전문직을 위한 완벽한 AI 블로그 엔진. 광고법 위반 제로, 환각 제로.",
    url: "https://postsyncapp.com",
    siteName: "PostSync",
    type: "website",
    locale: "ko_KR",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ChannelTalk />
      </body>
    </html>
  );
}
