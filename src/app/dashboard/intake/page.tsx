'use client'

import { useState } from 'react'
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  FileCode, 
  Smartphone,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function IntakeManagementPage() {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)

  const intakeUrl = typeof window !== 'undefined' ? `${window.location.origin}/consult` : 'https://postsyncapp.com/consult'

  // 네이버 스마트에디터 ONE 호환 배너 HTML
  const embedBannerHtml = `
<!-- [PostSync 사건 1분 안심 진단 배너] 네이버 블로그 스마트에디터 ONE 서식 -->
<div style="margin: 35px auto; max-width: 580px; background: #FFFFFF; border: 2px solid #0284C7; border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.08); font-family: 'Apple SD Gothic Neo', sans-serif;">
  <div style="display: inline-block; background: #E0F2FE; color: #0284C7; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px;">
    ⚖️ 100% 비밀 보장 1차 사전 검토
  </div>
  <h3 style="margin: 0 0 8px; font-size: 20px; font-weight: 900; color: #0F172A; letter-spacing: -0.5px;">
    지금 내 상황, 처벌 수위와 해결 절차가 궁금하신가요?
  </h3>
  <p style="margin: 0 0 18px; font-size: 13px; color: #64748B; line-height: 1.5;">
    사무실 방문 전, 전문 변호사·세무사가 1차 쟁점을 신속하게 사전 분석해 드립니다.
  </p>
  <a href="${intakeUrl}" target="_blank" style="display: inline-block; background: #FF6B00; color: #FFFFFF; font-size: 14px; font-weight: 900; padding: 12px 28px; border-radius: 50px; text-decoration: none; box-shadow: 0 3px 8px rgba(255, 107, 0, 0.3);">
    내 사건 1분 비밀 진단 신청하기 ➔
  </a>
  <div style="margin-top: 12px; font-size: 11px; color: #94A3B8;">
    🔒 변호사법 및 세무사법에 의해 의뢰인의 모든 상담 내용은 철저히 보호됩니다.
  </div>
</div>
`.trim()

  const copyToClipboard = (text: string, type: 'link' | 'html') => {
    navigator.clipboard.writeText(text)
    if (type === 'link') {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } else {
      setCopiedHtml(true)
      setTimeout(() => setCopiedHtml(false), 2000)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 상단 타이틀 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span>
            <span className="text-xs font-black text-[#FF6B00] tracking-wider uppercase">
              PostSync Intake Widget System
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            사건 1분 안심 진단 폼 관리
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            블로그 하단이나 네이버 플레이스 소개란에 붙여 의뢰인의 문의를 자동으로 접수합니다.
          </p>
        </div>

        <Link href="/consult" target="_blank">
          <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs h-9 gap-1.5 rounded-xl cursor-pointer">
            <Eye className="w-3.5 h-3.5" />
            진단 폼 실물 미리보기
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 좌측: 진단 링크 및 HTML 복사기 */}
        <div className="space-y-5">
          {/* 1. 전용 진단 링크 카드 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                <Smartphone className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black text-slate-900">내 사무소 전용 진단 폼 URL</h3>
                <p className="text-[11px] text-slate-400">카카오톡 프로필, 네이버 플레이스 예약 링크에 연결하세요.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
              <input 
                type="text" 
                readOnly 
                value={intakeUrl} 
                className="w-full bg-transparent text-xs text-slate-700 font-mono focus:outline-none px-2"
              />
              <Button
                size="sm"
                onClick={() => copyToClipboard(intakeUrl, 'link')}
                className="h-8 px-3 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white shrink-0 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? '복사됨' : 'URL 복사'}
              </Button>
            </div>
          </div>

          {/* 2. 네이버 블로그 복사용 HTML 배너 카드 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-50 text-[#FF6B00]">
                  <FileCode className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-black text-slate-900">네이버 블로그 본문 삽입용 배너 코드</h3>
                  <p className="text-[11px] text-slate-400">스마트에디터에 그대로 붙여넣으면 고전환 배너가 표시됩니다.</p>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => copyToClipboard(embedBannerHtml, 'html')}
                className="h-8 px-3 text-xs font-black bg-[#FF6B00] hover:bg-[#E05D00] text-white cursor-pointer"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedHtml ? '복사 완료!' : 'HTML 배너 복사'}
              </Button>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono overflow-x-auto max-h-36">
              <pre>{embedBannerHtml}</pre>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>모바일과 PC 화면에서 모두 최적화되어 자동 반응형으로 동작합니다.</span>
            </div>
          </div>
        </div>

        {/* 우측: 실제 네이버 블로그에 들어갔을 때의 실물 프리뷰 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#0284C7]" />
              <span>블로그 본문 하단 실제 노출 프리뷰</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">실시간 미리보기</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            {/* 실물 배너 박스 */}
            <div className="bg-white border-2 border-[#0284C7] rounded-2xl p-5 text-center shadow-sm space-y-3">
              <div className="inline-block bg-[#E0F2FE] text-[#0284C7] text-[11px] font-extrabold px-3 py-1 rounded-full">
                ⚖️ 100% 비밀 보장 1차 사전 검토
              </div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">
                지금 내 상황, 처벌 수위와 해결 절차가 궁금하신가요?
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                사무실 방문 전, 전문 변호사·세무사가 1차 쟁점을 신속하게 사전 분석해 드립니다.
              </p>
              <div className="pt-1">
                <Link href="/consult" target="_blank">
                  <Button className="bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs h-10 px-6 rounded-full shadow-md cursor-pointer">
                    내 사건 1분 비밀 진단 신청하기 ➔
                  </Button>
                </Link>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-[#0284C7]" />
                변호사법 및 세무사법에 의해 모든 상담 내용은 철저히 보호됩니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#E0F2FE]/40 rounded-xl border border-[#0284C7]/20 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-[#0284C7]">💡 효과적인 활용 팁</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              작성하신 전문 칼럼 맨 마지막 요약 문단 바로 밑에 이 배너를 넣으시면, 단순 방문자의 상담 신청 전환율이 300% 이상 높아집니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
