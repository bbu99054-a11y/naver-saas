import type { Metadata } from 'next'
import GlobalHeader from '@/components/common/GlobalHeader'

export const metadata: Metadata = {
  title: '2026 전문직 AI 마케팅 & 온라인 광고 규정 단속 대응 공식 지침서 | PostSync',
  description:
    '변호사·의사·세무사·노무사 2026년 개정 광고 규정 20대 핵심 금지어 사전 & 네이버 AI 검색(AI 브리핑) 상위 노출 바이블. 1초 위반 실시간 진단기 및 5단계 고수익 칼럼 작성 공식 무료 제공.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/guide/ad-law-2026',
  },
  openGraph: {
    title: '2026 전문직 AI 마케팅 & 온라인 광고 규정 단속 대응 공식 지침서',
    description:
      '과태료 0건, 수임 전환 4배! 변호사·의사·세무사·노무사 2026년 개정 광고 규제 20대 금지어 사전 및 네이버 AI 브리핑 상위노출 지침서 (A4 소장용 실전 가이드 PDF 제공)',
    url: 'https://www.postsyncapp.com/guide/ad-law-2026',
    siteName: 'PostSync 플레이스 연구소',
    locale: 'ko_KR',
    type: 'article',
    images: [
      {
        url: 'https://www.postsyncapp.com/placesync_profile_A.jpg',
        width: 1200,
        height: 630,
        alt: '2026 전문직 AI 마케팅 & 온라인 광고 규정 단속 대응 공식 지침서',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 전문직 AI 마케팅 & 온라인 광고 규정 단속 대응 공식 지침서',
    description: '2026년 개정 광고 규제 20대 금지어 및 네이버 AI 브리핑 대응 가이드북 (무료 배포)',
    images: ['https://www.postsyncapp.com/placesync_profile_A.jpg'],
  },
}

export default function AdLawLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '2026 전문직 AI 마케팅 & 온라인 광고 규정 단속 대응 공식 지침서',
    description:
      '변호사·의사·세무사·노무사 2026년 개정 광고 규정 20대 핵심 금지어 사전 & 네이버 AI 검색 상위 노출 바이블.',
    datePublished: '2026-08-01',
    dateModified: '2026-11-06',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.postsyncapp.com/guide/ad-law-2026',
    },
    author: {
      '@type': 'Person',
      name: '유영무',
      jobTitle: 'PostSync 스마트플레이스 수석 연구원',
      url: 'https://www.postsyncapp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PostSync 플레이스 연구소 (와이엠랩스)',
      url: 'https://www.postsyncapp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.postsyncapp.com/favicon.ico',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlobalHeader />
      {children}
    </>
  )
}
