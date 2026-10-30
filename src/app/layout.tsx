import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.postsyncapp.com"),
  manifest: "/manifest.json",
  title: "PostSync - 비즈니스 마케팅 데이터 연구소 & 무료 웹 유틸리티 포털",
  description: "2026 네이버 스마트플레이스 상위노출 알고리즘 실전 칼럼, 전문직 법정 광고 컴플라이언스 가이드, 무설치 무료 비즈니스 웹툴 7종을 제공하는 디지털 마케팅 연구 포털입니다.",
  keywords: ["스마트플레이스 순위 조회", "네이버 플레이스 상위노출", "전문직 광고 규정", "마케팅 칼럼", "무료 웹툴", "PostSync"],
  alternates: {
    canonical: "https://www.postsyncapp.com",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PostSync",
  },
  verification: {
    google: "ugoQGlNSdScisq23rSDCxHIZad-HlZLatf1TUZ5006A",
    other: {
      "naver-site-verification": "ba49c1186879f716b9e200013952414d6d5ce723",
    },
  },
  openGraph: {
    title: "PostSync - 비즈니스 마케팅 데이터 연구소 & 무료 웹 유틸리티 포털",
    description: "스마트플레이스 순위 알고리즘 심층 칼럼 35편과 100% 무료 비즈니스 웹 유틸리티 7종 허브.",
    url: "https://www.postsyncapp.com",
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
      <head>
        {/* Google Analytics 4 (GA4) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7WTMC1GBC8"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7WTMC1GBC8');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ChannelTalk />
      </body>
    </html>
  );
}
