'use client'

import { PhoneCall, MapPin, DollarSign, ShieldCheck, ArrowUpRight } from 'lucide-react'

interface CockpitKpiHeaderProps {
  storeName?: string | null
  credits?: number
  monthlyCount?: number
}

export function CockpitKpiHeader({ storeName, credits = 0, monthlyCount = 0 }: CockpitKpiHeaderProps) {
  return (
    <div className="space-y-3">
      {/* 🌟 '반갑습니다' 박스와 100% 동일한 순수 무테두리 소프트 플로팅 4대 KPI 지표 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 이달 신규 의뢰인 상담 접수 */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">이달 신규 상담 접수</span>
            <span className="w-8 h-8 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
              <PhoneCall className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">18건</span>
            <span className="text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 38%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            추정 수임 가치 5,400만 원 상당
          </p>

          {/* 브랜드 블루 미니 바 차트 */}
          <div className="mt-3 pt-2.5 flex items-end gap-1.5 h-6">
            {[40, 65, 30, 85, 60, 95, 100].map((val, idx) => (
              <div
                key={idx}
                style={{ height: `${val}%` }}
                className={`flex-1 rounded-xs transition-all ${
                  idx === 6 ? 'bg-[#0284C7]' : 'bg-[#BAE6FD]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2. 네이버 플레이스 1~5위 상위 랭킹 */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">플레이스 상위 랭킹 (1~5위)</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">7개 키워드</span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              방어율 88%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            관제 키워드 15개 중 로컬 상위 점유
          </p>

          {/* 미니 블루 바 차트 */}
          <div className="mt-3 pt-2.5 flex items-end gap-1.5 h-6">
            {[70, 75, 80, 85, 80, 88, 88].map((val, idx) => (
              <div
                key={idx}
                style={{ height: `${val}%` }}
                className={`flex-1 rounded-xs transition-all ${
                  idx >= 5 ? 'bg-blue-600' : 'bg-blue-200'
                }`}
              />
            ))}
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
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">₩3,250,000</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              외주 93%↓
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            대행사 월 300만 원 패키지 완벽 대체
          </p>

          {/* 절감 누적 진행 바 */}
          <div className="mt-3 pt-2.5 flex flex-col justify-end h-6">
            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[93%]" />
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
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">0.00%</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF6B00]">
              무결점 통과
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            과태료 리스크 5,000만 원 사전 차단
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
