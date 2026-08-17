import { getProfile, saveProfile } from '@/actions/profile'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCircle, BrainCircuit } from 'lucide-react'

export default async function ProfileSettingsPage() {
  const profile = await getProfile()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">내 정보 및 RAG 지식베이스</h2>
        <p className="text-muted-foreground mt-2">
          업체 기본 정보와 AI가 글을 쓸 때 참고할 전문 지식(RAG)을 관리합니다.
        </p>
      </div>

      <form action={async (formData) => {
        'use server'
        await saveProfile({
          store_name: formData.get('store_name') as string,
          industry: formData.get('industry') as string,
          address: formData.get('address') as string,
          phone: formData.get('phone') as string,
          reservation_link: formData.get('reservation_link') as string,
          about_us: formData.get('about_us') as string,
        })
      }} className="space-y-6">
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-500" />
              업체 기본 정보
            </CardTitle>
            <CardDescription>
              블로그 하단(푸터)에 자동으로 삽입될 업체의 최신 정보를 입력해 주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">업체명 (또는 전문직 사무소명)</label>
                <Input name="store_name" defaultValue={profile.store_name || ''} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">업종 (예: 법무법인, 세무사, 피부과)</label>
                <Input name="industry" defaultValue={profile.industry || ''} required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">주소</label>
              <Input name="address" defaultValue={profile.address || ''} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">대표 연락처</label>
                <Input name="phone" defaultValue={profile.phone || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">예약/상담 링크 (네이버 플레이스 등)</label>
                <Input name="reservation_link" defaultValue={profile.reservation_link || ''} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 shadow-md">
          <CardHeader className="bg-indigo-50/50">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              AI 맞춤형 지식베이스 (RAG)
            </CardTitle>
            <CardDescription className="text-indigo-700/80">
              이곳에 작성된 내용은 AI가 블로그 포스팅을 할 때 <strong>가장 최우선으로 학습하여 반영</strong>합니다. 
              회사 소개서, 주요 승소 사례, 차별화 포인트 등을 자유롭게 줄글로 입력해 두세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <textarea 
                name="about_us" 
                defaultValue={profile.about_us || ''}
                rows={12}
                placeholder="예: 우리 법무법인은 이혼 소송 전문으로, 10년 이상의 경력을 가진 대표 변호사가 직접 상담합니다. 주요 승소 사례로는 재산분할 90% 방어 성공 사례가 있으며..."
                className="w-full p-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold">
          정보 및 지식베이스 저장하기
        </Button>
      </form>
    </div>
  )
}
