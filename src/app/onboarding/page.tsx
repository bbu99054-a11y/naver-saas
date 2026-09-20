'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Store,
  MapPin,
  Phone,
  Link as LinkIcon,
  Loader2,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  AtSign
} from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [naverBlogId, setNaverBlogId] = useState('')

  const [formData, setFormData] = useState({
    store_name: '',
    target_keyword: '',
    reservation_link: '',
    address: '',
  })
  const [isSearchingPlace, setIsSearchingPlace] = useState(false)
  const [placeStatusNotice, setPlaceStatusNotice] = useState<{ text: string; isSuccess: boolean } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 🔍 네이버 플레이스 링크 1초 자동 조회
  const handleAutoFindPlace = async () => {
    setPlaceStatusNotice(null)
    const cleanStore = formData.store_name.trim()
    const cleanKw = formData.target_keyword.trim()

    if (!cleanStore) {
      setErrorMessage('먼저 상호 / 사무소명을 입력해 주세요.')
      return
    }

    setIsSearchingPlace(true)
    setErrorMessage('')

    try {
      // 1차: 키워드 + 상호명 검색
      const query = cleanKw || cleanStore
      const res = await fetch(`/api/place/rank?query=${encodeURIComponent(query)}&target=${encodeURIComponent(cleanStore)}`)
      const data = await res.json()

      if (data.success && data.myPlace) {
        const placeUrl = data.myPlace.placeUrl || `https://m.place.naver.com/place/${data.myPlace.id}`
        setFormData(prev => ({ ...prev, reservation_link: placeUrl }))
        setPlaceStatusNotice({
          text: `✅ 네이버 플레이스 연동 완료! [${data.myPlace.name}] (현재 실시간 순위: ${data.myPlace.rank}위) 링크가 자동 입력되었습니다.`,
          isSuccess: true
        })
      } else {
        // 2차: 상호명만으로 단독 재검색
        const fallbackRes = await fetch(`/api/place/rank?query=${encodeURIComponent(cleanStore)}&target=${encodeURIComponent(cleanStore)}`)
        const fbData = await fallbackRes.json()

        if (fbData.success && (fbData.myPlace || fbData.rankingList?.length > 0)) {
          const matched = fbData.myPlace || fbData.rankingList[0]
          const placeUrl = matched.placeUrl || `https://m.place.naver.com/place/${matched.id}`
          setFormData(prev => ({ ...prev, reservation_link: placeUrl }))
          setPlaceStatusNotice({
            text: `✅ 네이버 플레이스 연동 완료! [${matched.name}] 링크가 자동 입력되었습니다.`,
            isSuccess: true
          })
        } else {
          setPlaceStatusNotice({
            text: '💡 네이버 20위 내에서 정확히 일치하는 매장을 찾지 못했습니다. 네이버 지도 앱에서 [공유 ➔ URL 복사]를 붙여넣으셔도 됩니다.',
            isSuccess: false
          })
        }
      }
    } catch {
      setPlaceStatusNotice({
        text: '💡 지도 링크 조회를 건너뛰고 진행하실 수 있습니다. 나중에 [내 정보 수정]에서 등록하셔도 됩니다.',
        isSuccess: false
      })
    } finally {
      setIsSearchingPlace(false)
    }
  }

  // 1단계 프로필 저장 처리 후 2단계 연동 화면으로 전환
  const handleStep1Submit = async () => {
    setErrorMessage('')

    if (!formData.store_name.trim() || !formData.target_keyword.trim()) {
      setErrorMessage('상호/사무소명과 주력 관할 키워드는 필수 입력 항목입니다.')
      return
    }

    setIsLoading(true)
    try {
      const res = await saveProfile({
        store_name: formData.store_name.trim(),
        industry: formData.target_keyword.trim(),
        reservation_link: formData.reservation_link.trim(),
        address: formData.address.trim() || `${formData.target_keyword.trim()} 관할 중심`,
      })
      if (res.success) {
        setStep(2)
      } else {
        throw new Error(res.error)
      }
    } catch (error: any) {
      setErrorMessage(error.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 엔진 다운로드 클릭
  const handleDownloadEngine = () => {
    setIsDownloaded(true)
    window.location.href = '/api/download/direct-engine'
  }

  // 2단계 완료 후 대시보드 이동
  const handleFinishOnboarding = () => {
    if (naverBlogId.trim()) {
      const cleanId = naverBlogId.trim().replace(/^@/, '')
      localStorage.setItem('postsynk_naver_blog_id', cleanId)
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center p-4">
      {/* 상단 스텝 프로그레스 인디케이터 */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {step === 2 ? '✓' : '1'}
          </div>
          <span className="text-xs font-bold text-slate-700">기본 사업장 정보</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-4" />
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-[#03C75A] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            2
          </div>
          <span className={`text-xs font-bold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>
            네이버 연동 & 엔진 세팅
          </span>
        </div>
      </div>

      <Card className="w-full max-w-xl shadow-xl border-slate-200/80 bg-white">
        {step === 1 ? (
          <>
            <CardHeader className="text-center pb-5 border-b border-slate-100">
              <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold mx-auto mb-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> 1초 맞춤형 관제 세팅
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                사업장 & 주력 키워드 설정
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs mt-1">
                상호명과 대표 키워드 단 2가지만 입력하시면 네이버 플레이스 실시간 순위와 AI 맞춤 분석이 가동됩니다.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {/* 1. 상호 / 사무소명 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-indigo-500" /> 상호 / 사무소명 *
                </label>
                <Input
                  name="store_name"
                  placeholder="예: 법무법인 엘케이에스 / 맑은피부과의원 / 세무회계 정"
                  value={formData.store_name}
                  onChange={handleChange}
                  className="text-xs h-9"
                />
              </div>

              {/* 2. 주력 관할 키워드 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    🎯 주력 관할 키워드 *
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">네이버 지도 순위 관제 기준</span>
                </label>
                <Input
                  name="target_keyword"
                  placeholder="예: 문정역 변호사 / 송파구 형사전문변호사 / 강남역 피부과"
                  value={formData.target_keyword}
                  onChange={handleChange}
                  className="text-xs h-9"
                />
                <p className="text-[11px] text-slate-400">
                  내 매장의 실시간 지도 순위를 추적하고 경쟁사를 타겟팅할 핵심 키워드입니다.
                </p>
              </div>

              {/* 3. 네이버 스마트플레이스/지도 링크 (1초 자동 찾기 지원) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-600" /> 네이버 스마트플레이스 링크
                    <span className="text-[10px] text-slate-400 font-normal">(선택)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFindPlace}
                    disabled={isSearchingPlace}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    {isSearchingPlace ? <Loader2 className="w-3 h-3 animate-spin" /> : '🔍'} 내 지도 링크 1초 자동 찾기
                  </button>
                </div>
                <Input
                  name="reservation_link"
                  placeholder="https://m.place.naver.com/place/..."
                  value={formData.reservation_link}
                  onChange={handleChange}
                  className="text-xs h-9"
                />
                {placeStatusNotice && (
                  <div className={`p-2.5 rounded-lg text-xs font-medium ${
                    placeStatusNotice.isSuccess 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                      : 'bg-amber-50 border border-amber-200 text-amber-800'
                  }`}>
                    {placeStatusNotice.text}
                  </div>
                )}
                <p className="text-[11px] text-slate-400">
                  💡 네이버 지도 앱에서 내 매장 검색 후 [공유 ➔ URL 복사]를 붙여넣으셔도 됩니다.
                </p>
              </div>

              {/* RAG 및 디테일 안내 박스 */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2 text-[11.5px] text-slate-600">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  💡 <strong>상세 주소, 대표 연락처, AI RAG 지식베이스</strong> 등 상세 정보는 가입 후 언제든 <strong>[사무소 프로필 (RAG)]</strong> 메뉴에서 자유롭게 수정하실 수 있습니다.
                </p>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs text-center font-bold">
                  {errorMessage}
                </div>
              )}

              <Button
                type="button"
                onClick={handleStep1Submit}
                disabled={isLoading}
                className="w-full h-11 text-sm mt-4 text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl shadow-md cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                다음 단계: 네이버 연동 설정하기 &rarr;
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            {/* 2단계: 네이버 연동 & 안심 다운로드 카드 */}
            <CardHeader className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mx-auto mb-1 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#03C75A]" /> 원클릭 자동 발행 연동
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                네이버 블로그 1초 연동 & 엔진 세팅 🚀
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs mt-1">
                작성된 글과 카드뉴스를 내 블로그에 10초 만에 자동 작성해 주는 초경량 보안 엔진입니다.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              {/* 네이버 아이디 입력 필드 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  내 네이버 블로그 아이디 (Blog ID)
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500">
                  <span className="text-xs text-slate-400 font-mono select-none">blog.naver.com/</span>
                  <input
                    type="text"
                    value={naverBlogId}
                    onChange={(e) => setNaverBlogId(e.target.value)}
                    placeholder="bbu99054"
                    className="w-full bg-transparent border-0 text-xs font-bold text-slate-900 focus:outline-none pl-1"
                  />
                </div>
              </div>

              {/* 🛡️ 3대 안심 보안 보장 뱃지 */}
              <div className="grid grid-cols-3 gap-2 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-center">
                <div className="space-y-1">
                  <Lock className="w-4 h-4 text-emerald-600 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-800">비밀번호 요구 0%</p>
                  <p className="text-[10px] text-slate-500">내 PC에서만 안전 보존</p>
                </div>
                <div className="space-y-1 border-x border-emerald-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-800">네이버 정책 100% 준수</p>
                  <p className="text-[10px] text-slate-500">저품질/계정 제재 방어</p>
                </div>
                <div className="space-y-1">
                  <Sparkles className="w-4 h-4 text-emerald-600 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-800">초경량 무설치</p>
                  <p className="text-[10px] text-slate-500">컴퓨터 느려짐 없음</p>
                </div>
              </div>

              {/* 다운로드 버튼 영역 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#03C75A]" />
                    PostSynk AI 다이렉트 엔진 (1초 다운로드)
                  </span>
                  {isDownloaded && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 다운로드 완료
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  압축을 푼 뒤 <code>register-startup.bat</code>을 1회 실행하시면, 컴퓨터 켤 때마다 창 없이 무음으로 자동 대기합니다.
                </p>
                <Button
                  type="button"
                  onClick={handleDownloadEngine}
                  className="w-full bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-9 rounded-lg gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PostSynk 다이렉트 엔진 1초 다운로드 (.zip)</span>
                </Button>
              </div>

              {/* 하단 완료 및 건너뛰기 액션 버튼 */}
              <div className="space-y-2 pt-2">
                <Button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full h-11 text-sm text-white bg-slate-900 hover:bg-slate-800 font-bold rounded-xl shadow-md cursor-pointer gap-1.5"
                >
                  <span>설정 완료하고 첫 글 쓰러 가기 🚀</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* 망설여지는 고객을 위한 안심 건너뛰기 버튼 */}
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-600 hover:underline py-1 cursor-pointer"
                >
                  👉 나중에 설정하고 먼저 글부터 써보기
                </button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
