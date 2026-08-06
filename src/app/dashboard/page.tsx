import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, MapPin, Store, PenTool } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { DashboardCuration } from './DashboardCuration'
import { Loader2 } from 'lucide-react'

function CurationSkeleton() {
  return (
    <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
      <CardContent className="p-8 flex flex-col items-center justify-center text-indigo-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-medium">사장님 맞춤형 오늘의 로컬 키워드를 발굴하고 있습니다...</p>
        <p className="text-xs text-indigo-400 mt-2">상권 데이터와 네이버 검색량을 분석 중입니다.</p>
      </CardContent>
    </Card>
  )
}
export default async function DashboardPage() {
  const profile = await getProfile()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          반갑습니다, {profile.store_name} 사장님! 👋
        </h2>
        <p className="text-muted-foreground mt-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {profile.address} | <Store className="w-4 h-4" /> {profile.industry}
        </p>
      </div>

      {/* 로컬 키워드 자동 큐레이션 (Phase 2 핵심 기능) */}
      <Suspense fallback={<CurationSkeleton />}>
        <DashboardCuration profile={profile} />
      </Suspense>

      {/* 기존 대시보드 요약 (간소화) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">잔여 AI 크레딧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">4,982</div>
            <p className="text-xs text-muted-foreground mt-1">이번 달 충분히 사용 가능합니다.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 발행한 글</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 건</div>
            <p className="text-xs text-muted-foreground mt-1">꾸준한 포스팅이 지수 상승의 핵심입니다.</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white flex flex-col justify-center items-center text-center p-6">
          <h3 className="font-bold mb-2">원하는 글이 있으신가요?</h3>
          <Link href="/dashboard/write">
            <Button variant="secondary" className="w-full">
              <PenTool className="w-4 h-4 mr-2" /> 직접 키워드 입력해서 쓰기
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
