import { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: '전문직 인바운드 마케팅 칼럼 & 전략 블로그 | PostSync',
  description: '변호사, 세무사, 노무사, 의사, 행정사를 위한 2026 네이버 C-Rank 알고리즘 및 광고 컴플라이언스 상위노출 전략 칼럼 모음.',
  openGraph: {
    title: '전문직 인바운드 마케팅 칼럼 | PostSync',
    description: '대행사 횡포에서 벗어나 네이버 C-Rank와 구글 GEO를 장악하는 전문직 실전 마케팅 칼럼.',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  return <BlogListClient />
}
