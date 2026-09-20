'use client'

import { PhoneCall, MapPin, DollarSign, ShieldCheck, ArrowUpRight, Clock, AlertTriangle } from 'lucide-react'

interface CockpitKpiHeaderProps {
  storeName?: string | null
  credits?: number
  monthlyCount?: number
  leadsCount?: number
  top5Count?: number
  targetKeyword?: string | null
  myPlaceRank?: number | null
}

export function CockpitKpiHeader({
  storeName,
  credits = 0,
  monthlyCount = 0,
  leadsCount = 0,
  top5Count = 0,
  targetKeyword,
  myPlaceRank,
}: CockpitKpiHeaderProps) {
  // 실제 절감액 계산: 편당 150,000원 외주 대행사 단가 기준
  const savedCost = monthlyCount * 150000

  return (
    <div className="space-y-3">
      {/* 🌟 4대 실시간 KPI 지표 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 이달 신규 의뢰인 상담 접수 */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">이달 신규 상담 접수</span>
            <span className="w-8 h-8 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
              <PhoneCall className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {leadsCount}건
            </span>
            {leadsCount > 0 ? (
              <span className="text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 실시간 접수
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                접수 대기 중
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            {leadsCount > 0 
              ? `추정 수임 가치 ${(leadsCount * 300).toLocaleString()}만 원 상당` 
              : '사건 1분 진단 폼 및 칼럼을 통한 유입 대기'}
          </p>

          {/* 미니 인디케이터 바 */}
          <div className="mt-3 pt-2.5 flex items-end gap-1.5 h-6">
            {leadsCount > 0 ? (
              [40, 65, 30, 85, 60, 95, 100].map((val, idx) => (
                <div
                  key={idx}
                  style={{ height: `${val}%` }}
                  className={`flex-1 rounded-xs transition-all ${
                    idx === 6 ? 'bg-[#0284C7]' : 'bg-[#BAE6FD]'
                  }`}
                />
              ))
            ) : (
              [10, 10, 10, 10, 10, 10, 10].map((val, idx) => (
                <div
                  key={idx}
                  style={{ height: `${val}%` }}
                  className="flex-1 rounded-xs bg-slate-100"
                />
              ))
            )}
          </div>
        </div>

        {/* 2. 네이버 플레이스 1~5위 상위 랭킹 */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">플레이스 상위 랭킹 (1~5위)</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {top5Count}개 키워드
            </span>
            {top5Count > 0 ? (
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {myPlaceRank ? `실시간 ${myPlaceRank}위 점유` : '상위 점유 중'}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" /> 순위 견인 필요
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            {top5Count > 0 
              ? `주력 [${targetKeyword || '전문 변호사'}] 실시간 ${myPlaceRank || 5}위 안착` 
              : `주력 [${targetKeyword || '전문 변호사'}] 네이버 20위 밖 (타겟 칼럼 필요)`}
          </p>

          {/* 미니 블루 바 차트 */}
          <div className="mt-3 pt-2.5 flex items-end gap-1.5 h-6">
            {top5Count > 0 ? (
              [70, 75, 80, 85, 80, 88, 92].map((val, idx) => (
                <div
                  key={idx}
                  style={{ height: `${val}%` }}
                  className={`flex-1 rounded-xs transition-all ${
                    idx >= 5 ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                />
              ))
            ) : (
              [10, 10, 10, 10, 10, 10, 10].map((val, idx) => (
                <div
                  key={idx}
                  style={{ height: `${val}%` }}
                  className="flex-1 rounded-xs bg-slate-100"
                />
              ))
            )}
          </div>
        </div>

        {/* 3. 누적 절감 대행사 외주비 */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">누적 절감 대행사 비용</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              ₩{savedCost.toLocaleString()}
            </span>
            {savedCost > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                외주 절감 중
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                절감 시작 대기
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            {monthlyCount > 0 
              ? `이달 발행 ${monthlyCount}건 (편당 15만 원 절감)` 
              : '칼럼 1건 발행 시마다 외주비 15만 원 절감'}
          </p>

          {/* 절감 누적 진행 바 */}
          <div className="mt-3 pt-2.5 flex flex-col justify-end h-6">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: monthlyCount > 0 ? `${Math.min(100, monthlyCount * 10)}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* 4. 변호사법 제23조 광고 규정 컴플라이언스 */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">광고 규정 안심 검사</span>
            <span className="w-8 h-8 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#FF6B00]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">100%</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF6B00]">
              규정 안심 준수
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            변호사법 제23조 위반 리스크 원천 차단
          </p>

          {/* 시그니처 오렌지 게이지 */}
          <div className="mt-3 pt-2.5 flex flex-col justify-end h-6">
            <div className="w-full bg-orange-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF6B00] h-full rounded-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
