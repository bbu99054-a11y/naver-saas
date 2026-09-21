'use client'

import { useState, useEffect } from 'react'
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
  Lock, 
  PhoneCall, 
  RefreshCw, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Phone,
  QrCode,
  MessageSquare,
  Building2,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { IntakeLeadItem } from '@/actions/leads'
import { getIntakeLeads } from '@/actions/leads'
import { getProfile } from '@/actions/profile'
import { IntakeDetailModal } from '@/components/IntakeDetailModal'

export default function IntakeManagementPage() {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // 사용자 정보 및 고유 링크
  const [userId, setUserId] = useState('')
  const [storeName, setStoreName] = useState('')

  // 배포 도구함 탭 ('blog' | 'place_kakao' | 'qr')
  const [activeTab, setActiveTab] = useState<'blog' | 'place_kakao' | 'qr'>('blog')

  // 파이프라인 상태
  const [leads, setLeads] = useState<IntakeLeadItem[]>([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'WON'>('ALL')
  const [selectedLead, setSelectedLead] = useState<IntakeLeadItem | null>(null)

  // 프로필 및 리드 로드
  useEffect(() => {
    async function init() {
      setIsLoadingLeads(true)
      try {
        const [profile, leadsData] = await Promise.all([
          getProfile(),
          getIntakeLeads()
        ])
        if (profile) {
          setUserId(profile.user_id || '')
          setStoreName(profile.store_name || '법률사무소')
        }
        setLeads(leadsData)
      } catch (e) {
        console.warn('Init intake page error:', e)
      } finally {
        setIsLoadingLeads(false)
      }
    }
    init()
  }, [])

  const reloadLeads = async () => {
    setIsLoadingLeads(true)
    try {
      const data = await getIntakeLeads()
      setLeads(data)
    } catch (e) {
      console.warn('Reload intake leads error:', e)
    } finally {
      setIsLoadingLeads(false)
    }
  }

  const handleStatusChange = (leadId: string, newStatus: IntakeLeadItem['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  // 필터링
  const filteredLeads = leads.filter(l => {
    if (filterStatus === 'ALL') return true
    return l.status === filterStatus
  })

  // 고유 진단 폼 URL 생성
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://postsyncapp.com'
  const intakeUrl = userId
    ? `${baseUrl}/consult?ref=${userId}${storeName ? `&firm=${encodeURIComponent(storeName)}` : ''}`
    : `${baseUrl}/consult`

  // QR 코드 이미지 URL (300x300 고해상도)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(intakeUrl)}`

  // 채널별 추천 복사 문구
  const smartCallSmsText = `[${storeName}] 상담 전 사건 경위를 1분 진단 폼에 남겨주시면 담당 대표 변호사가 우선 검토하여 연락드립니다. 👉 ${intakeUrl}`
  const kakaoWelcomeText = `안녕하세요, ${storeName}입니다. 정확하고 신속한 1차 쟁점 검토를 위해 아래 1분 비밀 진단 폼에 상황을 먼저 남겨주시면 담당 변호사가 우선 연락드립니다. 👉 ${intakeUrl}`
  const placeIntroText = `사무소 방문 전, 담당 변호사가 1차 법적 쟁점과 해결 절차를 사전 검토해 드립니다.\n👉 1분 사건 안심 사전 진단: ${intakeUrl}`

  // 네이버 스마트에디터 ONE 호환 배너 HTML
  const embedBannerHtml = `
<!-- [PostSync 사건 1분 안심 진단 배너] 네이버 블로그 스마트에디터 ONE 서식 -->
<div style="margin: 35px auto; max-width: 580px; background: #FFFFFF; border: 2px solid #0284C7; border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.08); font-family: 'Apple SD Gothic Neo', sans-serif;">
  <div style="display: inline-block; background: #E0F2FE; color: #0284C7; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px;">
    ⚖️ ${storeName} 100% 비밀 보장 1차 사전 검토
  </div>
  <h3 style="margin: 0 0 8px; font-size: 20px; font-weight: 900; color: #0F172A; letter-spacing: -0.5px;">
    지금 내 상황, 처벌 수위와 해결 절차가 궁금하신가요?
  </h3>
  <p style="margin: 0 0 18px; font-size: 13px; color: #64748B; line-height: 1.5;">
    사무실 방문 전, 담당 대표 변호사가 1차 쟁점을 신속하게 사전 검토해 드립니다.
  </p>
  <a href="${intakeUrl}" target="_blank" style="display: inline-block; background: #FF6B00; color: #FFFFFF; font-size: 14px; font-weight: 900; padding: 12px 28px; border-radius: 50px; text-decoration: none; box-shadow: 0 3px 8px rgba(255, 107, 0, 0.3);">
    내 사건 1분 비밀 진단 신청하기 ➔
  </a>
  <div style="margin-top: 12px; font-size: 11px; color: #94A3B8;">
    🔒 변호사법 제26조(비밀유지의무)에 의해 의뢰인의 모든 상담 내용은 철저히 보호됩니다.
  </div>
</div>
`.trim()

  const copyToClipboard = (text: string, type: 'link' | 'html' | string) => {
    navigator.clipboard.writeText(text)
    if (type === 'link') {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } else if (type === 'html') {
      setCopiedHtml(true)
      setTimeout(() => setCopiedHtml(false), 2000)
    } else {
      setCopiedText(type)
      setTimeout(() => setCopiedText(null), 2000)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 헤더 안내 바 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E0F2FE] text-[#0284C7]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              사건 1분 안심 진단 폼 및 수임 파이프라인
            </h1>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              고유 식별 격리 가동
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            내 블로그, 스마트플레이스, 카카오톡 채널에서 유입된 잠재 의뢰인을 10분 골든타임 내에 상담으로 연결합니다.
          </p>
        </div>

        {/* 내 전용 진단 폼 바로가기 */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href={intakeUrl} target="_blank">
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[#0284C7]" />
              진단 폼 실물 확인
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={reloadLeads}
            disabled={isLoadingLeads}
            variant="ghost"
            className="h-9 px-3 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 🌟 상단 고유 URL 안내 바 (PostSync 브랜드 블루 그라데이션) */}
      <div className="bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0EA5E9] p-4 sm:p-5 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_-4px_rgba(2,132,199,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-tight">
                [{storeName || '법무법인'}] 전용 사건 진단 폼 URL
              </span>
              <span className="text-[10px] font-mono bg-white/25 text-white px-2 py-0.5 rounded-full font-bold border border-white/30">
                100% 데이터 격리
              </span>
            </div>
            <p className="text-[11px] text-sky-100 font-mono mt-0.5 truncate max-w-md sm:max-w-xl">
              {intakeUrl}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => copyToClipboard(intakeUrl, 'link')}
          className="h-9 px-4 text-xs font-black bg-white hover:bg-sky-50 text-[#0284C7] shrink-0 cursor-pointer rounded-xl shadow-xs transition-transform active:scale-95"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 mr-1 text-[#0284C7]" /> : <Copy className="w-3.5 h-3.5 mr-1 text-[#0284C7]" />}
          {copiedLink ? '고유 URL 복사됨!' : '전용 URL 복사'}
        </Button>
      </div>

      {/* 🌟 1단계: 실시간 인테이크 CRM 파이프라인 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900">
              내 진단 폼 접수 의뢰인 파이프라인
            </h2>
            <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
              총 {leads.length}건
            </span>
          </div>

          {/* 필터 탭 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'NEW', 'CONTACTED', 'WON'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterStatus === st 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {st === 'ALL' && '전체'}
                {st === 'NEW' && '신규 접수'}
                {st === 'CONTACTED' && '1차 통화'}
                {st === 'WON' && '수임 완료'}
              </button>
            ))}
          </div>
        </div>

        {isLoadingLeads ? (
          <div className="py-12 text-center text-xs text-slate-400">
            의뢰인 인테이크 현황을 불러오는 중입니다...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              📭
            </div>
            <p className="text-xs font-bold text-slate-700">접수된 상담 내역이 없습니다.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              아래 도구함에서 네이버 블로그 배너나 플레이스/카톡 링크를 복사하여 배포하시면, 의뢰인의 신청 건이 실시간으로 이곳에 등록됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedLead(item)}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-[#0284C7] hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black shrink-0 ${
                    item.isUrgent ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.isUrgent ? '🚨 골든타임' : '⚖️ 일반 상담'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-slate-900">{item.name}</h3>
                      <span className="text-[11px] font-mono text-slate-500">{item.phoneMasked}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({item.minutesAgo}분 전)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                      <span className="font-bold text-slate-800">[{item.category}]</span> {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">추정 수임료</span>
                    <span className="text-xs font-black text-slate-900">{item.contractAmount}</span>
                  </div>
                  <Button size="sm" className="h-8 px-3 text-xs bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-lg cursor-pointer">
                    상담 진단 보기 ➔
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 2단계: 3대 핵심 수임 채널 원클릭 배포 도구함 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <span>3대 핵심 길목 원클릭 배포 도구함</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              의뢰인의 눈길이 머무는 길목에 고유 진단 폼을 1초 만에 깔아두세요.
            </p>
          </div>

          {/* 3대 채널 선택 탭 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'blog' 
                  ? 'bg-white text-[#FF6B00] shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>① 네이버 블로그 배너</span>
            </button>
            <button
              onClick={() => setActiveTab('place_kakao')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'place_kakao' 
                  ? 'bg-white text-[#0284C7] shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>② 플레이스 & 카톡 문자</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'qr' 
                  ? 'bg-white text-emerald-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>③ 명함·리플렛 QR</span>
            </button>
          </div>
        </div>

        {/* 탭 1: 네이버 블로그 배너 */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900">네이버 블로그 본문 삽입용 HTML 배너</h3>
                  <p className="text-[11px] text-slate-400">스마트에디터에 그대로 붙여넣으면 고전환 배너가 완성됩니다.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(embedBannerHtml, 'html')}
                  className="h-8 px-3.5 text-xs font-black bg-[#FF6B00] hover:bg-[#E05D00] text-white cursor-pointer rounded-xl"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5 mr-1 text-white" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedHtml ? '복사 완료!' : 'HTML 배너 복사'}
                </Button>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono overflow-x-auto max-h-48">
                <pre>{embedBannerHtml}</pre>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>대표님의 고유 ref 식별자(`?ref=${userId ? `${userId.substring(0, 8)}...` : ''}`)가 배너 안에 자동으로 심겨 있습니다.</span>
              </div>
            </div>

            {/* 실물 미리보기 */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block">블로그 본문 실제 노출 프리뷰</span>
              <div className="bg-white border-2 border-[#0284C7] rounded-2xl p-5 text-center shadow-xs space-y-3">
                <div className="inline-block bg-[#E0F2FE] text-[#0284C7] text-[11px] font-extrabold px-3 py-1 rounded-full">
                  ⚖️ {storeName} 100% 비밀 보장 1차 사전 검토
                </div>
                <h4 className="text-base font-black text-slate-900 tracking-tight">
                  지금 내 상황, 처벌 수위와 해결 절차가 궁금하신가요?
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  사무실 방문 전, 담당 대표 변호사가 1차 쟁점을 신속하게 사전 검토해 드립니다.
                </p>
                <div className="pt-1">
                  <Button className="bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs h-10 px-6 rounded-full shadow-md pointer-events-none">
                    내 사건 1분 비밀 진단 신청하기 ➔
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#0284C7]" />
                  변호사법 제26조(비밀유지의무)에 의해 철저히 보호됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 탭 2: 플레이스 & 스마트콜 & 카카오톡 */}
        {activeTab === 'place_kakao' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 플레이스 스마트콜 자동 문자 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="text-xs font-black text-slate-900">네이버 스마트콜 통화 후 자동 문자 (SMS)</h3>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(smartCallSmsText, 'smartcall')}
                  className="h-7 px-2.5 text-[11px] font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer rounded-lg"
                >
                  {copiedText === 'smartcall' ? '복사됨!' : '문구 복사'}
                </Button>
              </div>
              <p className="text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-slate-200 font-sans leading-relaxed">
                {smartCallSmsText}
              </p>
              <p className="text-[10px] text-slate-400">
                💡 네이버 스마트플레이스 관리자 ➔ 스마트콜 ➔ 통화 후 자동 문자 설정에 붙여넣으세요.
              </p>
            </div>

            {/* 카카오톡 채널 웰컴 메시지 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-black text-slate-900">카카오톡 채널 친구 추가 웰컴 메시지</h3>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(kakaoWelcomeText, 'kakao')}
                  className="h-7 px-2.5 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer rounded-lg"
                >
                  {copiedText === 'kakao' ? '복사됨!' : '문구 복사'}
                </Button>
              </div>
              <p className="text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-slate-200 font-sans leading-relaxed">
                {kakaoWelcomeText}
              </p>
              <p className="text-[10px] text-slate-400">
                💡 카카오톡 비즈니스 채널 관리자 ➔ 메시지 ➔ 웰컴 메시지에 붙여넣으세요.
              </p>
            </div>

            {/* 네이버 플레이스 소개글 하단 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  <h3 className="text-xs font-black text-slate-900">네이버 스마트플레이스 상세 소개글 하단 삽입 문구</h3>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(placeIntroText, 'place')}
                  className="h-7 px-2.5 text-[11px] font-bold bg-slate-800 hover:bg-slate-900 text-white cursor-pointer rounded-lg"
                >
                  {copiedText === 'place' ? '복사됨!' : '문구 복사'}
                </Button>
              </div>
              <p className="text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-slate-200 font-sans leading-relaxed whitespace-pre-line">
                {placeIntroText}
              </p>
            </div>
          </div>
        )}

        {/* 탭 3: 명함 & 리플렛용 모바일 QR 코드 */}
        {activeTab === 'qr' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              {/* QR 코드 실물 렌더링 */}
              <div className="w-48 h-48 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeUrl} 
                  alt="내 전용 진단 폼 QR코드" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                스마트폰 카메라로 비추면 즉시 이동
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  [{storeName}] 전용 모바일 QR 코드
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  의뢰인이 스마트폰 카메라로 QR코드를 비추면 1초 만에 대표님의 모바일 안심 진단 폼으로 직결됩니다.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>명함 뒷면:</strong> "사건 1분 비밀 진단 QR" 인쇄</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>상담실 대기석:</strong> 아크릴 안내판에 부착하여 대기 중 사전 경위 작성 유도</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>소송 서류 봉투:</strong> 봉투 겉면에 안내 QR 삽입</span>
                </p>
              </div>

              <div className="pt-2">
                <Link href={qrCodeUrl} target="_blank" download={`${storeName}_진단폼_QR코드.png`}>
                  <Button className="h-9 px-4 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>고화질 QR코드 이미지 다운로드</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Jev 의뢰인 심층 분석 & 원클릭 전화 모달 */}
      <IntakeDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
