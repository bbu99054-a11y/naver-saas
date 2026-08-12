import GeneratorClient from './GeneratorClient'

export const metadata = {
  title: 'AI 콘텐츠 생성기 | Naver SaaS',
  description: 'AI로 네이버 블로그 콘텐츠를 자동 생성합니다.',
}

export default function GeneratorPage() {
  return <GeneratorClient />
}
