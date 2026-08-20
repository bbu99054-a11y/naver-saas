import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Store, PenTool, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { DashboardCuration } from './DashboardCuration'

import { checkIsAdmin } from '@/actions/deposit'

export default async function DashboardPage() {
  const profile = await getProfile()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!profile || !user) {
    redirect('/onboarding')
  }

  const isAdmin = await checkIsAdmin()

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
    <div className="space-y-6 pb-12">
      {/* 👑 관리자 전용 관제 센터 퀵 배너 */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/40 p-4 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-xl shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-sm text-white tracking-tight">CEO 비즈니스 통합 관제 & 1초 입금 승인</p>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  대표님 전용
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">오늘 매출 통계, AI 원고 발행 현황, 무통장 입금 승인을 관리합니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/admin">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs h-9 px-3.5 rounded-xl shadow-xs cursor-pointer">
                👑 관제 센터 바로가기 ➔
              </Button>
            </Link>
            <Link href="/dashboard/admin/deposits">
              <Button size="sm" variant="outline" className="border-indigo-400/40 bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600 hover:text-white font-bold text-xs h-9 px-3 rounded-xl cursor-pointer">
                💳 입금 승인
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
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
