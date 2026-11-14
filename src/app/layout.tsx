import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
import { ADSENSE_CLIENT_ID } from "@/lib/monetizationConfig";

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.postsyncapp.com"),
  manifest: "/manifest.json",
  title: "[무료] 네이버 플레이스 순위 조회 · 리뷰 QR 생성 · 소개글 진단 (가입 없음) | PostSync",
  description: "회원가입·설치 없이 3초 만에 내 매장 스마트플레이스 실시간 순위와 1위 매장 리뷰·예약·소개글 차이를 비교 진단하세요. 테이블용 영수증 리뷰 QR 안내판 인쇄부터 AI 소개글 생성·금칙어 검사까지 100% 무료.",
  keywords: ["네이버 플레이스 순위 조회", "스마트플레이스 순위", "플레이스 상위노출", "영수증 리뷰 QR코드", "스마트플레이스 소개글", "플레이스 금칙어", "PostSync"],
  alternates: {
    canonical: "https://www.postsyncapp.com",
    types: {
      "application/rss+xml": "https://www.postsyncapp.com/rss.xml",
    },
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
    title: "[무료] 네이버 플레이스 순위 조회 · 리뷰 QR 생성 · 소개글 진단 (가입 없음) | PostSync",
    description: "회원가입·설치 없이 3초 만에 내 매장 스마트플레이스 실시간 순위와 1위 매장 리뷰·예약·소개글 차이를 비교 진단하세요. 테이블용 영수증 리뷰 QR 안내판 인쇄부터 AI 소개글 생성·금칙어 검사까지 100% 무료.",
    url: "https://www.postsyncapp.com",
    siteName: "PostSync",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "https://www.postsyncapp.com/placesync_profile_A.jpg",
        width: 1200,
        height: 630,
        alt: "PostSync 스마트플레이스 순위 분석 및 마케팅 툴킷",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "[무료] 네이버 플레이스 순위 조회 · 리뷰 QR 생성 · 소개글 진단 (가입 없음) | PostSync",
    description: "회원가입·설치 없이 3초 만에 내 매장 스마트플레이스 실시간 순위와 1위 매장 리뷰·예약·소개글 차이를 비교 진단하세요. 테이블용 영수증 리뷰 QR 안내판 인쇄부터 AI 소개글 생성·금칙어 검사까지 100% 무료.",
    images: ["https://www.postsyncapp.com/placesync_profile_A.jpg"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Pretendard Variable Dynamic Subset (WOFF2) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Google AdSense Site Ownership Meta */}
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          본문 바로가기
        </a>
        {children}
        <ChannelTalk />
        {/* Google Analytics 4 (GA4) */}
        <Script
          id="ga4-gtag"
          src="https://www.googletagmanager.com/gtag/js?id=G-7WTMC1GBC8"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7WTMC1GBC8');
          `}
        </Script>
        {/* Google AdSense (Approval-Safe Deferred After Hydration) */}
        <Script
          id="adsense-init"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
