import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile'
import { MapPin, Store, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

import { checkIsAdmin } from '@/actions/deposit'

import { CockpitKpiHeader } from './components/CockpitKpiHeader'
import { LocalRadarPanel } from './components/LocalRadarPanel'
import { OsmuStationPanel } from './components/OsmuStationPanel'
import { IntakeCrmPanel } from './components/IntakeCrmPanel'
import { PublishedArticleResults } from './components/PublishedArticleResults'
import { DashboardCuration } from './DashboardCuration'

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
    <div className="space-y-6 pb-12 min-h-screen bg-[#F8FAFC] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-2">
      {/* 👑 관리자 전용 관제 배너 (무테두리 딥 네이비) */}
      {isAdmin && (
        <div className="bg-[#0F172A] p-4 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xs text-slate-200">CEO 통합 관제 & 1초 입금 승인</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-[#0284C7] font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">매출 통계 및 무통장 입금 승인을 관리합니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/admin">
              <Button size="sm" className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs h-8 px-3.5 rounded-xl cursor-pointer">
                관제 센터 ➔
              </Button>
            </Link>
            <Link href="/dashboard/admin/deposits">
              <Button size="sm" variant="ghost" className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold text-xs h-8 px-3 rounded-xl cursor-pointer">
                입금 승인
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 🌟 대표님 요청: 수임 파이프라인/새 칼럼 버튼 싹 제거한 클린 환영 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="text-[11px] font-extrabold text-[#0284C7] uppercase tracking-wider">
              Legal Practice OS
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">
              Pro-Pilot 가동 중
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1.5">
            반갑습니다, {profile.store_name || '대표'} 대표님
          </h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> {profile.address || '서초·교대 법조타운'} · 
            <Store className="w-3.5 h-3.5 text-slate-400" /> {profile.industry || '형사·이혼 전문 로펌'}
          </p>
        </div>

        {/* 잔여 크레딧 및 상태 게이지 칩 */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="text-slate-500 font-medium">잔여 크레딧:</span>
            <span className="font-extrabold text-slate-900 tabular-nums">{credits}회</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-1.5 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>광고 규정 안심 가동</span>
          </div>
        </div>
      </div>

      {/* 🌟 1. 4대 핵심 KPI 현황 헤더 (무테두리 + 미니 바 차트) */}
      <CockpitKpiHeader 
        storeName={profile.store_name} 
        credits={credits} 
        monthlyCount={monthlyArticleCount} 
      />

      {/* 🌟 4대 KPI 하단 3열 나란히 균형 배치: [좌: 플레이스&경쟁사 ｜ 중앙: 최근 발행 글 노출 성과 ｜ 우: 실시간 의뢰인 상담 접수] */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="flex flex-col">
          <LocalRadarPanel 
            storeName={profile.store_name}
            targetKeyword={profile.industry || '전문 변호사'}
            address={profile.address} 
          />
        </div>
        <div className="flex flex-col">
          <PublishedArticleResults />
        </div>
        <div className="flex flex-col">
          <IntakeCrmPanel />
        </div>
      </div>

      {/* 🌟 하단 전폭 1: 💎 네이버 & Jev 고단가 수임 키워드 자동 선별기 */}
      <div className="w-full">
        <DashboardCuration profile={profile} />
      </div>

      {/* 🌟 하단 전폭 2: 1-클릭 5대 채널 전문 콘텐츠 제작 스튜디오 (선별기에서 1-클릭 즉시 연동) */}
      <div className="w-full">
        <OsmuStationPanel />
      </div>
    </div>
  )
}
