import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 전문직 블로그 마케팅 & 광고법 과태료 제로(Zero) 공식 지침서 | PostSync',
  description:
    '변호사·의사·세무사·노무사 2026년 개정 광고 규정 20대 핵심 금지어 사전 & 네이버 AI 검색(AI 브리핑) 상위 노출 바이블. 1초 위반 실시간 진단기 및 5단계 고수익 칼럼 작성 공식 무료 제공.',
  openGraph: {
    title: '2026 전문직 블로그 마케팅 & 광고법 과태료 제로(Zero) 공식 지침서',
    description:
      '과태료 0건, 수임 전환 4배! 변호사·의사·세무사·노무사 2026년 개정 광고 규제 20대 금지어 사전 및 네이버 AI 브리핑 상위노출 지침서 (A4 소장용 전자책 PDF 제공)',
    url: 'https://postsyncapp.com/guide/ad-law-2026',
    siteName: 'PostSync Legal & Medical Compliance Lab',
    locale: 'ko_KR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 전문직 블로그 마케팅 & 광고법 과태료 제로(Zero) 공식 지침서',
    description: '2026년 개정 광고 규제 20대 금지어 및 네이버 AI 브리핑 대응 가이드북 (무료 배포)',
  },
}

export default function AdLawLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
