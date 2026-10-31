import { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: '스마트플레이스 상위노출 & 로컬 마케팅 실전 칼럼 | PostSync',
  description:
    '2026 네이버 스마트플레이스 노출 알고리즘(NPlaceRank), 영수증 리뷰·저장수 관리, 대표키워드 세팅, 블로그 C-Rank 및 업종별 광고 심의 대응 전략 칼럼 아카이브.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/blog',
  },
  openGraph: {
    title: '스마트플레이스 상위노출 & 로컬 마케팅 실전 칼럼 | PostSync',
    description:
      '네이버 플레이스 1페이지 진입 공식, 경쟁 매장 정량 격차 분석법, C-Rank 블로그 및 광고 컴플라이언스 실전 가이드를 확인하세요.',
    url: 'https://www.postsyncapp.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://www.postsyncapp.com/placesync_profile_A.jpg',
        width: 1200,
        height: 630,
        alt: '스마트플레이스 상위노출 & 로컬 마케팅 실전 칼럼 | PostSync',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '스마트플레이스 상위노출 & 로컬 마케팅 실전 칼럼 | PostSync',
    description: '네이버 플레이스 1페이지 진입 공식, 경쟁 매장 정량 격차 분석법, C-Rank 블로그 및 광고 컴플라이언스 실전 가이드.',
    images: ['https://www.postsyncapp.com/placesync_profile_A.jpg'],
  },
}

export default function BlogIndexPage() {
  return <BlogListClient />
}
