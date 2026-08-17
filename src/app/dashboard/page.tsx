import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Store, PenTool, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { DashboardCuration } from './DashboardCuration'

export default async function DashboardPage() {
  const profile = await getProfile()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!profile || !user) {
    redirect('/onboarding')
  }

  // 이번 달 1일 계산
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // DB에서 유저 정보와 이번 달 발행한 아티클 개수 조회
  const [dbUser, monthlyArticleCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.article.count({
      where: {
        user_id: user.id,
        created_at: {
          gte: firstDayOfMonth
        }
      }
    })
  ])

  const credits = dbUser?.credits || 0

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            반갑습니다, {profile.store_name} 대표님! 👋
          </h2>
          <p className="text-slate-500 mt-1.5 flex items-center gap-2 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-indigo-500" /> {profile.address || '사무소 주소 미등록'} | <Store className="w-4 h-4 text-purple-500" /> {profile.industry || '전문직'}
          </p>
        </div>
        <Link href="/dashboard/write">
          <Button className="bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs">
            <PenTool className="w-3.5 h-3.5" /> 새 원고 작성하기
          </Button>
        </Link>
      </div>

      {/* 로컬 키워드 수동 큐레이션 */}
      <DashboardCuration profile={profile} />

      {/* 대시보드 요약 (동적 데이터 연동) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-indigo-100 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-700">잔여 AI 크레딧</CardTitle>
            <Zap className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-indigo-600">{credits.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1">포스팅 생성 가능 횟수입니다.</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-700">이번 달 작성한 글</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900">{monthlyArticleCount} 건</div>
            <p className="text-[11px] text-slate-500 mt-1">꾸준한 포스팅이 상위 노출의 핵심입니다.</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-900 text-white flex flex-col justify-center items-center text-center p-5 shadow-2xs relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/30 blur-2xl rounded-full"></div>
          <h3 className="font-bold mb-2 z-10 text-sm">원하는 주제가 있으신가요?</h3>
          <Link href="/dashboard/write" className="w-full z-10">
            <Button className="w-full bg-white text-indigo-900 hover:bg-slate-100 font-bold text-xs h-8 cursor-pointer">
              <PenTool className="w-3.5 h-3.5 mr-1.5" /> 직접 키워드 입력해서 쓰기
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
