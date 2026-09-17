import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용 요금 및 플랜 안내 | PostSync AI 전문직 전용 마케팅 OS',
  description: '변호사·세무사 사무소를 위한 합리적인 3단계 무인 마케팅 플랜. 월 9만 원대로 대행사 외주비 300만 원을 100% 대체하고 고단가 인바운드 수임을 자동화하세요.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/pricing',
  },
  openGraph: {
    title: 'PostSync AI 요금제 안내 | 전문직 올인원 마케팅 OS',
    description: '월 9만 원대로 대행사 외주비 90% 이상 절감. 네이버 플레이스 1~5위 방어부터 대법원 판례 기반 1-클릭 원고 생성까지.',
    url: 'https://www.postsyncapp.com/pricing',
    type: 'website',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
