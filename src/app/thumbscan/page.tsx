'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ThumbScanResult } from '@/lib/thumbscan/types'
import { 
  Heart, 
  Sparkles, 
  Lock, 
  Unlock, 
  Share2, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  Check, 
  Flame, 
  Camera,
  X,
  CreditCard,
  Send,
  Zap
} from 'lucide-react'

export default function ThumbScanPage() {
  // 상태 관리
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [userGender, setUserGender] = useState<'male' | 'female'>('male')
  const [partnerGender, setPartnerGender] = useState<'male' | 'female'>('female')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingStep, setLoadingStep] = useState<number>(1)
  const [result, setResult] = useState<ThumbScanResult | null>(null)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
  const [copyToast, setCopyToast] = useState<string | null>(null)
  const [copiedReplyIndex, setCopiedReplyIndex] = useState<number | null>(null)
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false)
  const [isWaitingShareReturn, setIsWaitingShareReturn] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)

  // 실제 대표님 입금 계좌
  const KAKAO_BANK = '카카오뱅크 3333-01-8475325 (예금주: 유영무)'
  const TOSS_BANK = '토스뱅크 1000-0040-3565 (예금주: 유영무)'

  // 모바일 OS 및 브라우저 환경에 맞춘 앱 딥링크 런처
  const launchApp = (options: {
    androidIntent: string
    iosScheme: string
    desktopScheme?: string
  }) => {
    if (typeof window === 'undefined') return
    const ua = navigator.userAgent.toLowerCase()
    const isAndroid = /android/i.test(ua)
    const isIOS = /iphone|ipad|ipod/i.test(ua)

    if (isAndroid) {
      // 안드로이드 크롬/삼성인터넷 등은 인텐트 스킴으로 즉시 호출
      window.location.href = options.androidIntent
    } else if (isIOS) {
      // iOS 사파리/크롬 등은 커스텀 URL 스킴 즉시 호출
      window.location.href = options.iosScheme
    } else if (options.desktopScheme) {
      // 데스크톱 (PC)
      window.location.href = options.desktopScheme
    }
  }

  // 카카오톡 공유 후 사이트로 다시 돌아왔을 때 자동 잠금 해제 (Visibility / Focus 감지)
  useEffect(() => {
    if (!isWaitingShareReturn) return

    const handleReturn = () => {
      if (document.visibilityState === 'visible') {
        setIsUnlocked(true)
        setShowPaymentModal(false)
        setIsWaitingShareReturn(false)
        showToast('카카오톡 공유 확인 완료! 심층 리포트가 잠금 해제되었습니다 💖')
      }
    }

    document.addEventListener('visibilitychange', handleReturn)
    window.addEventListener('focus', handleReturn)

    return () => {
      document.removeEventListener('visibilitychange', handleReturn)
      window.removeEventListener('focus', handleReturn)
    }
  }, [isWaitingShareReturn])

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 데모 실행 (샘플 카톡으로 즉시 테스트)
  const handleRunDemo = async () => {
    setIsLoading(true)
    runLoadingSteps()

    try {
      const res = await fetch('/api/thumbscan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true })
      })
      const json = await res.json()
      if (json.success && json.data) {
        setTimeout(() => {
          setResult(json.data)
          setIsLoading(false)
        }, 2200)
      }
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  // 로딩 애니메이션 스텝 타이머
  const runLoadingSteps = () => {
    setLoadingStep(1)
    setTimeout(() => setLoadingStep(2), 800)
    setTimeout(() => setLoadingStep(3), 1600)
  }

  // 실제 이미지 분석 시작
  const handleAnalyze = async () => {
    if (!previewUrl) {
      alert('카톡 캡처 사진을 먼저 업로드해 주세요!')
      return
    }

    setIsLoading(true)
    runLoadingSteps()

    try {
      const res = await fetch('/api/thumbscan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          userGender,
          partnerGender,
          isDemo: false
        })
      })

      const json = await res.json()
      if (json.success && json.data) {
        setTimeout(() => {
          setResult(json.data)
          setIsLoading(false)
        }, 2200)
      } else {
        alert(json.error || '분석 중 오류가 발생했습니다.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.')
      setIsLoading(false)
    }
  }

  // 토스트 알림 헬퍼
  const showToast = (message: string) => {
    setCopyToast(message)
    setTimeout(() => setCopyToast(null), 3000)
  }

  // 1. 토스 송금 처리 (계좌번호만 복사해야 토스 앱이 자동 감지함)
  const handleTossPay = () => {
    try {
      navigator.clipboard.writeText('100000403565')
    } catch (e) {
      console.error(e)
    }
    showToast('토스뱅크 1000-0040-3565 (유영무) 복사 완료! 토스 앱으로 이동합니다 ⚡')
    launchApp({
      androidIntent: 'intent://#Intent;scheme=supertoss;package=viva.republica.toss;end;',
      iosScheme: 'supertoss://',
      desktopScheme: 'supertoss://'
    })
  }

  // 2. 카카오 송금 처리 (카카오뱅크 계좌 복사 후 카카오톡/카카오페이 앱 즉시 실행)
  const handleKakaoPay = () => {
    try {
      navigator.clipboard.writeText('3333018475325')
    } catch (e) {
      console.error(e)
    }
    showToast('카카오뱅크 3333-01-8475325 (유영무) 복사 완료! 카카오톡으로 이동합니다 🟡')
    launchApp({
      androidIntent: 'intent://#Intent;scheme=kakaotalk;package=com.kakao.talk;end;',
      iosScheme: 'kakaotalk://',
      desktopScheme: 'kakaotalk://'
    })
  }

  // 3. 계좌번호 1초 복사
  const handleCopyAccount = (bankType: 'kakao' | 'toss') => {
    const rawNumber = bankType === 'kakao' ? '3333018475325' : '100000403565'
    try {
      navigator.clipboard.writeText(rawNumber)
    } catch (e) {
      console.error(e)
    }
    setCopiedAccount(true)
    showToast(`${bankType === 'kakao' ? '카카오뱅크 (3333-01-8475325)' : '토스뱅크 (1000-0040-3565)'} 복사 완료! 은행 앱에서 송금해 주세요 📋`)
    setTimeout(() => setCopiedAccount(false), 2500)
  }

  // 4. 친구 공유로 무료 잠금 해제 (카카오톡 앱 직접 실행 + 복귀 시 해제)
  const handleShareToUnlock = () => {
    const shareText = `💘 [썸스캔] 카톡 대화 캡처 올리니까 호감도 분석 소름돋게 잘 맞춘다 ㅋㅋㅋ\n너도 썸남/썸녀 카톡 검사해봐!\n👉 ${window.location.href}`

    try {
      navigator.clipboard.writeText(shareText)
    } catch (e) {
      console.error(e)
    }

    showToast('공유 문구가 복사되었습니다! 카카오톡을 실행합니다 💬')
    setIsWaitingShareReturn(true)

    // 카카오톡 앱 즉시 실행 (안드로이드 intent / iOS scheme / 데스크톱 PC)
    launchApp({
      androidIntent: 'intent://#Intent;scheme=kakaotalk;package=com.kakao.talk;end;',
      iosScheme: 'kakaotalk://',
      desktopScheme: 'kakaotalk://'
    })
  }

  // 송금 완료 확인 후 즉시 잠금 해제
  const handleConfirmTransfer = () => {
    setIsUnlocked(true)
    setShowPaymentModal(false)
    showToast('1,900원 확인 완료! 심층 리포트가 잠금 해제되었습니다 💖')
  }

  // 추천 답장 복사
  const handleCopyReply = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedReplyIndex(index)
    setTimeout(() => setCopiedReplyIndex(null), 2000)
  }

  // 초기화 후 다시하기
  const handleReset = () => {
    setResult(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsUnlocked(false)
    setShowPaymentModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/80 via-white to-pink-50/60 text-slate-800 flex flex-col items-center px-4 py-8 relative overflow-hidden font-sans selection:bg-rose-500 selection:text-white">
      {/* 화사한 라이트 테마 앰비언트 글로우 배경 */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-gradient-to-tr from-rose-400/20 via-pink-300/20 to-purple-300/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-pink-300/20 blur-[130px] rounded-full pointer-events-none" />

      {/* 상단 플로팅 토스트 알림 */}
      {copyToast && (
        <div className="fixed top-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xl shadow-slate-900/30 animate-bounce flex items-center gap-2 border border-slate-700/50">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* 헤더 브랜딩 */}
      <header className="max-w-md w-full text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-rose-200/80 text-rose-600 text-xs font-bold tracking-wide mb-3 shadow-sm shadow-rose-500/5 backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>3초 카톡 캡처 판독기 • 썸스캔 (ThumbScan)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          그 사람, 나한테 <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">호감</span> 있을까?
        </h1>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          귀찮은 텍스트 내보내기 X • 카톡 캡처 1장으로 그린라이트 판독 🟢
        </p>
      </header>

      {/* 메인 컨테이너 (스마트폰 최적화 폭) */}
      <main className="max-w-md w-full z-10 flex flex-col items-center">
        {!result && !isLoading && (
          <div className="w-full bg-white/90 border border-rose-100 rounded-3xl p-6 backdrop-blur-xl shadow-xl shadow-rose-500/5">
            {/* 성별 선택 토글 */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100 text-center">
                <span className="text-xs text-slate-600 block mb-1.5 font-bold">내 성별</span>
                <div className="flex gap-1.5 justify-center">
                  <button
                    onClick={() => setUserGender('male')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      userGender === 'male' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    남성
                  </button>
                  <button
                    onClick={() => setUserGender('female')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      userGender === 'female' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    여성
                  </button>
                </div>
              </div>

              <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-100 text-center">
                <span className="text-xs text-slate-600 block mb-1.5 font-bold">상대방 성별</span>
                <div className="flex gap-1.5 justify-center">
                  <button
                    onClick={() => setPartnerGender('female')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerGender === 'female' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    여성
                  </button>
                  <button
                    onClick={() => setPartnerGender('male')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerGender === 'male' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    남성
                  </button>
                </div>
              </div>
            </div>

            {/* 업로드 박스 */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/60 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/10 to-pink-500/15 flex items-center justify-center text-rose-500 mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="text-base font-bold text-slate-800">
                  카톡 대화 캡처 사진 올리기
                </span>
                <span className="text-xs text-slate-500 mt-1 text-center">
                  스마트폰 앨범에서 캡처 스크린샷 1장 선택
                </span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-rose-200 mb-4 bg-slate-50 shadow-sm">
                <img
                  src={previewUrl}
                  alt="업로드된 카톡 캡처"
                  className="w-full max-h-[280px] object-cover"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl(null)
                  }}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-800 px-3 py-1 rounded-lg text-xs font-bold shadow-md border border-slate-200 transition-colors"
                >
                  사진 변경
                </button>
              </div>
            )}

            {/* 개인정보 안심 뱃지 */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-4 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>업로드된 사진은 분석 즉시 영구 파기되며 저장되지 않습니다.</span>
            </div>

            {/* 분석 버튼 */}
            <button
              onClick={handleAnalyze}
              disabled={!previewUrl}
              className={`w-full mt-5 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                previewUrl
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-95 text-white shadow-rose-500/25 active:scale-[0.99]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>호감도 3초 분석 시작하기</span>
            </button>

            {/* 샘플 데모 바로보기 버튼 */}
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={handleRunDemo}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1 hover:underline underline-offset-4"
              >
                <span>사진이 없다면? ⚡ 1초 데모 결과 바로보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3초 심장박동 분석 애니메이션 로더 */}
        {isLoading && (
          <div className="w-full bg-white/95 border border-rose-100 rounded-3xl p-10 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-xl shadow-rose-500/5">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center animate-ping absolute inset-0" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-xl shadow-rose-500/30 relative z-10 animate-bounce">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              카카오톡 대화 정밀 해독 중...
            </h3>

            {/* 실시간 3단계 상태 문구 */}
            <div className="text-xs font-bold text-rose-600 h-6 flex items-center justify-center">
              {loadingStep === 1 && '1단계: 말풍선 텍스트 및 이모티콘 뉘앙스 스캔 중...'}
              {loadingStep === 2 && '2단계: 질문 빈도와 답장 텀(밀당 지수) 계산 중...'}
              {loadingStep === 3 && '3단계: 상대방의 숨겨진 무의식 속마음 추출 완료!'}
            </div>
          </div>
        )}

        {/* 결과 리포트 티켓 카드 (라이트 테마 화이트 티켓) */}
        {result && !isLoading && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
            {/* 공식 리포트 카드 티켓 */}
            <div
              ref={ticketRef}
              className="w-full bg-white border border-rose-200/80 rounded-3xl p-6 shadow-xl shadow-rose-500/5 relative overflow-hidden"
            >
              {/* 상단 헤더 */}
              <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-rose-600 uppercase">
                  <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>THUMB SCAN OFFICIAL REPORT</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono font-medium">
                  {new Date().toISOString().split('T')[0]}
                </div>
              </div>

              {/* 종합 호감도 점수 원형 뱃지 */}
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  종합 호감도 지수
                </span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    {result.overallScore}
                  </span>
                  <span className="text-xl font-bold text-slate-400">/100점</span>
                </div>

                <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-sm shadow-sm">
                  {result.signalLabel} • {result.relationshipStage}
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800 bg-rose-50/60 p-4 rounded-2xl border border-rose-100 leading-relaxed shadow-inner">
                  "{result.summaryHeadline}"
                </p>
              </div>

              {/* 무료 지표 3종 게이지 카드 */}
              <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">질문 빈도</span>
                  <span className="text-xs font-extrabold text-rose-600">
                    {result.freeMetrics.questionFrequency.split(' ')[0]}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">답장 뉘앙스</span>
                  <span className="text-xs font-extrabold text-pink-600">
                    {result.freeMetrics.responseSpeedRating.split(' ')[0]}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">감정 온도</span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {result.freeMetrics.emotionalTemperature.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* 대화 주도권 바 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 shadow-sm">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-rose-600">내 주도권 {result.initiativeRatio.myRatio}%</span>
                  <span className="text-purple-600">상대방 {result.initiativeRatio.partnerRatio}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${result.initiativeRatio.myRatio}%` }}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-full"
                  />
                  <div
                    style={{ width: `${result.initiativeRatio.partnerRatio}%` }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center font-medium">
                  {result.initiativeRatio.description}
                </p>
              </div>

              {/* 심층 인사이트 영역 (잠금 vs 해제) */}
              <div className="relative mt-6 pt-5 border-t border-rose-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-500" />
                    )}
                    <h4 className="text-sm font-bold text-slate-900">
                      상대방 무의식 속마음 & 심쿵 문장 해독
                    </h4>
                  </div>
                  {isUnlocked && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                      잠금 해제 완료
                    </span>
                  )}
                </div>

                {/* 블러 처리 오버레이 (잠겨 있을 때) */}
                <div className={`space-y-4 ${!isUnlocked ? 'filter blur-[5px] select-none opacity-40' : ''}`}>
                  {/* 무의식 속마음 3가지 */}
                  <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 shadow-sm">
                    <span className="text-xs font-bold text-rose-600 block mb-2">
                      🧠 상대방의 무의식 심리 3가지
                    </span>
                    <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside font-medium">
                      {result.lockedInsights.unconsciousPsychology.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 결정적 심쿵 문장 */}
                  <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="text-xs font-bold text-pink-600 block mb-1">
                      💘 대화 중 가장 설렜던 결정적 순간
                    </span>
                    <p className="text-xs font-bold text-slate-900 bg-white p-3 rounded-xl border border-pink-200 my-2 shadow-sm">
                      {result.lockedInsights.heartflutterMoment.quote}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      💡 {result.lockedInsights.heartflutterMoment.reason}
                    </p>
                  </div>

                  {/* 추천 답장 3선 */}
                  <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100 shadow-sm">
                    <span className="text-xs font-bold text-purple-600 block mb-3">
                      💌 호감도 20점 올리는 맞춤 답장 3종
                    </span>
                    <div className="space-y-2.5">
                      {result.lockedInsights.recommendedReplies.map((reply, i) => (
                        <div key={i} className="bg-white p-3.5 rounded-xl border border-purple-100 flex flex-col gap-1.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                              {reply.style}
                            </span>
                            <button
                              onClick={() => handleCopyReply(reply.replyText, i)}
                              className="text-[10px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold"
                            >
                              {copiedReplyIndex === i ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-600">복사 완료</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>답장 복사</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-800 font-bold">"{reply.replyText}"</p>
                          <p className="text-[10px] text-slate-500 font-medium">💡 {reply.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 잠금 해제 액션 카드 (잠겨 있을 때만 위에 오버레이) */}
                {!isUnlocked && (
                  <div className="absolute inset-0 top-10 flex flex-col items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-200 z-20 shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white mb-2 shadow-lg shadow-rose-500/20">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mb-1">
                      상대방의 진짜 속마음이 궁금하다면?
                    </h5>
                    <p className="text-xs text-slate-600 mb-4 text-center font-medium">
                      무의식 심리 3가지 & 맞춤 답장 3종이 잠겨 있습니다.
                    </p>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/25 transition-all active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>심층 리포트 잠금 해제하기 (1,900원 / 무료)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 하단 버튼 바 */}
            <div className="flex gap-2.5 w-full">
              <button
                onClick={handleShareToUnlock}
                className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-rose-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4 text-rose-500" />
                <span>결과 공유하기</span>
              </button>

              <button
                onClick={handleReset}
                className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>다른 대화 분석하기</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4종 올인원 결제 팝업 모달 */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-rose-100 flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* 닫기 버튼 */}
            <button
              onClick={() => {
                setShowPaymentModal(false)
                setIsWaitingShareReturn(false)
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 모달 타이틀 */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                심층 리포트 잠금 해제
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                무의식 심리 3종 + 심쿵 문장 + 맞춤 답장 3종
              </p>
              <div className="mt-3 inline-block bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded-full text-xs font-black">
                1회 열람가: 1,900원
              </div>
            </div>

            {/* 4가지 결제/해제 옵션 리스트 */}
            <div className="space-y-2.5">
              {/* 1. 토스 1초 송금 */}
              <button
                onClick={handleTossPay}
                className="w-full py-3 px-4 rounded-2xl bg-[#0064FF] hover:bg-[#0052D4] text-white font-bold text-xs flex items-center justify-between shadow-md shadow-blue-500/20 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-white" />
                  <span>토스로 1초 송금 (1,900원)</span>
                </div>
                <span className="text-[11px] opacity-90">지문 인증 ➔</span>
              </button>

              {/* 2. 카카오페이 1초 송금 */}
              <button
                onClick={handleKakaoPay}
                className="w-full py-3 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs flex items-center justify-between shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>카카오페이로 보내기 (1,900원)</span>
                </div>
                <span className="text-[11px] text-slate-700">카톡 열기 ➔</span>
              </button>

              {/* 3. 계좌번호 선택 복사 */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopyAccount('kakao')}
                  className="py-2.5 px-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                  <span>카카오뱅크 복사</span>
                </button>
                <button
                  onClick={() => handleCopyAccount('toss')}
                  className="py-2.5 px-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-blue-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                  <span>토스뱅크 복사</span>
                </button>
              </div>

              {/* 4. 친구 공유로 무료 열기 (바이럴 치트키) */}
              <div className="pt-2">
                {!isWaitingShareReturn ? (
                  <button
                    onClick={handleShareToUnlock}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>🎁 친구 1명에게 링크 공유하고 무료 열기</span>
                  </button>
                ) : (
                  <div className="bg-purple-50/90 border border-purple-200 rounded-2xl p-3 text-center animate-in fade-in">
                    <p className="text-xs font-bold text-purple-900 mb-1 flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                      <span>카카오톡으로 이동했습니다!</span>
                    </p>
                    <p className="text-[11px] text-purple-700 font-medium mb-2.5">
                      친구에게 문구를 공유하고 돌아오시면 자동으로 잠금이 해제됩니다.
                    </p>
                    <button
                      onClick={() => {
                        setIsUnlocked(true)
                        setShowPaymentModal(false)
                        setIsWaitingShareReturn(false)
                        showToast('카카오톡 공유 확인 완료! 심층 리포트가 잠금 해제되었습니다 💖')
                      }}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                    >
                      ✅ 카톡 공유 완료! 잠금 해제하기
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 송금 완료 버튼 */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={handleConfirmTransfer}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium underline underline-offset-4"
              >
                이미 송금을 마치셨나요? 즉시 열람하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="mt-12 text-center text-xs text-slate-500 z-10">
        <p>© 2026 ThumbScan. AI 연애 심리 프로파일링 서비스.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          업로드된 대화는 분석 후 즉시 메모리에서 영구 삭제됩니다.
        </p>
      </footer>
    </div>
  )
}
