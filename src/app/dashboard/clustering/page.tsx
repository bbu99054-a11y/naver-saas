import ClusteringClient from './ClusteringClient'

export const metadata = {
  title: '블로그 연재 기획기 | Naver SaaS',
  description: 'AI가 세부 연재 주제(Cluster)를 발굴합니다.',
}

export default function ClusteringPage() {
  return <ClusteringClient />
}
