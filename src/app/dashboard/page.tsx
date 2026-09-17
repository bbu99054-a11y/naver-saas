import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Store, PenTool, TrendingUp, Zap, Briefcase, CheckCircle2, PhoneCall, Sparkles, ArrowRight } from 'lucide-react'
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

      {/* 🌟 Lawmatics 스타일 상단 헤더 & 빠른 액션 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0284C7] text-[11px] font-black">
              PostSync Professional Practice OS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1 flex items-center gap-2">
            반갑습니다, {profile.store_name || '대표'} 대표님! 👋
          </h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-xs sm:text-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> {profile.address || '사무소 주소 미등록'} · 
            <Store className="w-3.5 h-3.5 text-[#FF6B00]" /> {profile.industry || '전문직 법률·세무'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/pipeline">
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs h-10 gap-1.5 cursor-pointer">
              <Briefcase className="w-3.5 h-3.5 text-[#0284C7]" />
              수임 파이프라인 열기
            </Button>
          </Link>
          <Link href="/dashboard/write">
            <Button className="bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs h-10 px-4 rounded-xl gap-1.5 cursor-pointer shadow-xs">
              <PenTool className="w-3.5 h-3.5" /> 새 칼럼 작성하기
            </Button>
          </Link>
        </div>
      </div>

      {/* 🌟 Lawmatics 스타일 수임 파이프라인 퀵 알림 배너 */}
      <div className="bg-[#E0F2FE]/40 border border-[#0284C7]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            💼
          </div>
          <div>
            <p className="text-xs font-black text-slate-900">
              현재 <span className="text-[#0284C7]">2건의 신규 의뢰인 상담 접수</span>가 대기 중입니다.
            </p>
            <p className="text-[11px] text-slate-500">골든타임 10분 내 유선 연결 시 수임 성공률이 4배 증가합니다.</p>
          </div>
        </div>
        <Link href="/dashboard/pipeline">
          <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs h-8 px-3 rounded-lg cursor-pointer">
            수임 칸반보드 확인 ➔
          </Button>
        </Link>
      </div>

      {/* 🌟 4대 핵심 수임 성과 지표 (Lawmatics 밝은 카드 그리드) */}
      <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4">
        <Card className="border-slate-200/90 shadow-2xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
            <CardTitle className="text-xs font-bold text-slate-600">이달 신규 상담</CardTitle>
            <div className="p-1.5 rounded-lg bg-[#E0F2FE] text-[#0284C7]">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-slate-900">12 건</div>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">▲ 전월 대비 25% 증가</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
            <CardTitle className="text-xs font-bold text-slate-600">방문 상담 진행</CardTitle>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-indigo-600">4 건</div>
            <p className="text-[10px] text-slate-400 mt-0.5">대면 일정 조율 완료</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
            <CardTitle className="text-xs font-bold text-slate-600">수임 계약 완료</CardTitle>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-emerald-600">3 건</div>
            <p className="text-[10px] text-slate-400 mt-0.5">착수금 입금 완료</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
            <CardTitle className="text-xs font-bold text-slate-600">잔여 AI 크레딧</CardTitle>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-[#0284C7]">{credits.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">전문 칼럼 생성 잔여 횟수</p>
          </CardContent>
        </Card>
      </div>

      {/* 로컬 키워드 수동 큐레이션 */}
      <DashboardCuration profile={profile} />
    </div>
  )
}
