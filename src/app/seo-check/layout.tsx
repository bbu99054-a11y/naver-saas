import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '네이버 블로그 1초 SEO & C-Rank 지수 무료 진단기 | PostSync',
  description: '포스팅 URL만 입력하면 제목 키워드 배치, 본문 형태소 빈도, 이미지 바이트, 전문직 광고법 위반 여부를 1초 만에 전수 스캔합니다.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/seo-check',
  },
  openGraph: {
    title: '네이버 블로그 1초 SEO & C-Rank 지수 무료 진단기 | PostSync',
    description: '전문직 블로그 상위 노출 9대 알고리즘 지수 및 광고법 위험도 무료 실시간 분석.',
    url: 'https://www.postsyncapp.com/seo-check',
    type: 'website',
  },
}

export default function SeoCheckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
