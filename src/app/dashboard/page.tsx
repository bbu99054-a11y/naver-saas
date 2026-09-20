import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile'
import { MapPin, Store, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

import { checkIsAdmin } from '@/actions/deposit'
import { getIntakeLeads } from '@/actions/leads'
import { fetchLiveNaverPlaceRanking } from '@/app/api/place/rank/route'

import { CockpitKpiHeader } from './components/CockpitKpiHeader'
import { LocalRadarPanel } from './components/LocalRadarPanel'
import { OsmuStationPanel } from './components/OsmuStationPanel'
import { IntakeCrmPanel } from './components/IntakeCrmPanel'

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

  // DB에서 유저 정보와 이번 달 발행한 아티클, 최근 원고, 실제 리드 목록 조회
  const [dbUser, monthlyArticleCount, recentArticles, intakeLeads] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.article.count({
      where: {
        user_id: user.id,
        created_at: {
          gte: firstDayOfMonth
        }
      }
    }),
    prisma.article.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 4,
      select: {
        id: true,
        title: true,
        target_keyword: true,
        status: true,
        created_at: true,
      }
    }),
    getIntakeLeads()
  ])

  const credits = dbUser?.credits || 0

  // 실시간 네이버 플레이스 순위 확인 (주력 업종 키워드 기준)
  const cleanStore = (profile.store_name || '').trim()
  const targetKeyword = (profile.industry || '전문 변호사').trim()
  let top5Count = 0
  let myPlaceRank: number | null = null

  try {
    const { items } = await fetchLiveNaverPlaceRanking(targetKeyword)
    const myPlace = items.find(it => 
      cleanStore && (it.name.includes(cleanStore) || cleanStore.includes(it.name))
    )
    if (myPlace) {
      myPlaceRank = myPlace.rank
      if (myPlace.rank <= 5) {
        top5Count = 1
      }
    }
  } catch (e) {
    console.warn('Place ranking check in page.tsx:', e)
  }

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

      {/* 🌟 대표님 환영 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="text-[11px] font-extrabold text-[#0284C7] tracking-wider">
              변호사 전용 인바운드 수임 관제탑
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">
              실시간 관제 가동 중
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1.5">
            반갑습니다, {profile.store_name || '대표'} 대표님
          </h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 
            {profile.address?.includes('관할 중심') 
              ? profile.address.replace('관할 중심', '').trim() + ' 법조타운 중심 관제'
              : (profile.address || '서초·교대 법조타운')} · 
            <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
            {profile.industry?.includes('변호사') ? '법률사무소 · 전문 변호사' : (profile.industry || '형사·이혼 전문 로펌')}
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

      {/* 🌟 1. 4대 핵심 KPI 현황 헤더 (실제 0건 / ₩0 연동) */}
      <CockpitKpiHeader 
        storeName={profile.store_name} 
        credits={credits} 
        monthlyCount={monthlyArticleCount}
        leadsCount={intakeLeads.length}
        top5Count={top5Count}
        targetKeyword={targetKeyword}
        myPlaceRank={myPlaceRank}
      />

      {/* 🌟 3단 관제탑 (Cockpit Layout): 2 : 5 : 3 황금 비율 [좌 23%: 플레이스 순위 & 성과 ｜ 중앙 52%: OSMU 스튜디오 ｜ 우 25%: 상담 접수 CRM] */}
      <div className="grid grid-cols-1 xl:grid-cols-[23%_1fr_25%] gap-5 items-stretch">
        {/* 좌측 23%: 네이버 플레이스 실시간 순위 & 발행 글 성과 통합 */}
        <div className="flex flex-col min-w-0">
          <LocalRadarPanel 
            storeName={profile.store_name}
            targetKeyword={profile.industry || '전문 변호사'}
            address={profile.address} 
            articles={recentArticles}
          />
        </div>

        {/* 중앙 52%: OSMU 멀티 콘텐츠 생성 스튜디오 (넓고 시원한 작업 공간) */}
        <div className="flex flex-col min-w-0">
          <OsmuStationPanel profile={profile} />
        </div>

        {/* 우측 25%: 실시간 의뢰인 상담 접수 관제탑 */}
        <div className="flex flex-col min-w-0">
          <IntakeCrmPanel />
        </div>
      </div>
    </div>
  )
}
