import { getProfile } from '@/actions/profile'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from './ProfileEditForm'

export const metadata = {
  title: '내 정보 수정 및 사무소 프로필 (RAG) | PostSync',
  description: '사업장 상세 정보, 네이버 플레이스 연동, AI 글쓰기 톤앤매너 및 RAG 지식베이스를 관리합니다.',
}

export default async function ProfileSettingsPage() {
  const profile = await getProfile()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">내 정보 및 RAG 지식베이스 관리</h2>
        <p className="text-sm text-slate-500 mt-1">
          초기 회원가입 시 입력했던 기본 정보 외에 <strong>상세 주소, 연락처, 네이버 지도 링크, AI 글쓰기 어조(톤앤매너), 전문 지식(RAG)</strong>을 언제든 자유롭게 수정하고 보강할 수 있습니다.
        </p>
      </div>

      <ProfileEditForm initialProfile={profile} />
    </div>
  )
}
