import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용 요금 및 플랜 안내 | PostSync Pro 변호사 사건 수임 OS',
  description: '변호사 및 법률사무소를 위한 합리적인 3단계 무인 수임 플랜. 월 9만 원대로 대행사 외주비 300만 원을 100% 대체하고 고단가 알짜 사건 수임을 자동화하세요.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/pricing',
  },
  openGraph: {
    title: 'PostSync Pro 요금제 안내 | 대한민국 1등 변호사 수임 OS',
    description: '월 9만 원대로 대행사 외주비 93% 이상 절감. 네이버 스마트플레이스 1위 선점부터 C-Rank 4단 칼럼 및 수임 파이프라인 CRM 연동.',
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
