'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  UserCircle, 
  BrainCircuit, 
  MapPin, 
  Phone, 
  Link2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  HelpCircle,
  Building2,
  SlidersHorizontal
} from 'lucide-react'
import { saveProfile } from '@/actions/profile'

interface ProfileData {
  store_name?: string | null
  industry?: string | null
  address?: string | null
  phone?: string | null
  reservation_link?: string | null
  tone?: string | null
  about_us?: string | null
}

export function ProfileEditForm({ initialProfile }: { initialProfile: ProfileData }) {
  const [storeName, setStoreName] = useState(initialProfile.store_name || '')
  const [industry, setIndustry] = useState(initialProfile.industry || '')
  const [address, setAddress] = useState(initialProfile.address || '')
  const [phone, setPhone] = useState(initialProfile.phone || '')
  const [reservationLink, setReservationLink] = useState(initialProfile.reservation_link || '')
  const [tone, setTone] = useState(initialProfile.tone || 'trust')
  const [aboutUs, setAboutUs] = useState(initialProfile.about_us || '')

  const [isSearchingPlace, setIsSearchingPlace] = useState(false)
  const [placeFoundMsg, setPlaceFoundMsg] = useState<string | null>(null)
  const [showPlaceGuide, setShowPlaceGuide] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1초 자동 플레이스 찾기
  const handleAutoFindPlace = async () => {
    if (!storeName.trim()) {
      alert('먼저 상호명/사무소명을 입력해 주세요.')
      return
    }
    setIsSearchingPlace(true)
    setPlaceFoundMsg(null)
    try {
      const searchKeyword = industry.trim() ? `${storeName} ${industry}` : storeName
      const res = await fetch(`/api/place/rank?keyword=${encodeURIComponent(searchKeyword)}&targetStore=${encodeURIComponent(storeName)}`)
      const data = await res.json()

      if (data.rankingList && data.rankingList.length > 0) {
        const found = data.rankingList.find((item: any) =>
          item.name.includes(storeName) || storeName.includes(item.name)
        ) || data.rankingList[0]

        if (found && found.placeUrl) {
          setReservationLink(found.placeUrl)
          if (!address && found.address) {
            setAddress(found.address)
          }
          if (!phone && found.phone) {
            setPhone(found.phone)
          }
          setPlaceFoundMsg(`네이버 플레이스 연동 완료: "${found.name}"`)
        } else {
          setPlaceFoundMsg('검색은 완료되었으나 정확히 일치하는 매장을 찾지 못했습니다. 아래 링크 안내를 참고하여 직접 입력해 주세요.')
        }
      } else {
        setPlaceFoundMsg('네이버 플레이스 검색 결과가 없습니다. 직접 링크를 입력해 주세요.')
      }
    } catch {
      setPlaceFoundMsg('조회 중 일시적 오류가 발생했습니다. 직접 링크를 붙여넣어 주세요.')
    } finally {
      setIsSearchingPlace(false)
    }
  }

  // 저장 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setErrorMessage(null)

    try {
      const result = await saveProfile({
        store_name: storeName,
        industry: industry,
        address: address,
        phone: phone,
        reservation_link: reservationLink,
        tone: tone,
        about_us: aboutUs,
      })

      if (result.success) {
        setSaveSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => setSaveSuccess(false), 5000)
      } else {
        setErrorMessage(result.error || '저장 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || '저장 중 예기치 않은 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 성공 알림 배너 */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 shadow-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">상세 정보 및 RAG 지식베이스가 안전하게 저장되었습니다!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              업데이트된 정보는 수임 대시보드 실시간 순위 관제와 AI 전문 칼럼 생성에 즉시 반영됩니다.
            </p>
          </div>
        </div>
      )}

      {/* 에러 알림 배너 */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">저장에 실패했습니다</h4>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 1. 기본 사업장 정보 */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
            <Building2 className="w-5 h-5 text-indigo-600" />
            사업장 및 전문직 사무소 기본 정보
          </CardTitle>
          <CardDescription>
            네이버 플레이스 순위 관제 및 AI 블로그 글 하단(CTA 푸터)에 자동 삽입되는 정보입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                상호명 / 사무소명 <span className="text-rose-500">*</span>
              </label>
              <Input 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                placeholder="예: 법무법인 엘케이에스" 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                주력 관할 키워드 <span className="text-rose-500">*</span>
              </label>
              <Input 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)} 
                placeholder="예: 문정역 변호사 / 송파구 형사전문변호사" 
                required 
              />
              <p className="text-[11px] text-slate-500">
                수임 대시보드 실시간 순위 관제와 AI 글쓰기의 메인 공략 키워드입니다.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              사업장 상세 주소 (오시는 길)
            </label>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="예: 서울 송파구 법원로 114 엠스테이트 B동 301호" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                대표 직통 연락처
              </label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="예: 02-1234-5678 또는 010-1234-5678" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-slate-500" />
                  네이버 플레이스 / 상담 예약 링크
                </label>
                <button
                  type="button"
                  onClick={handleAutoFindPlace}
                  disabled={isSearchingPlace}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                >
                  <Search className="w-3 h-3" />
                  {isSearchingPlace ? '조회 중...' : '1초 자동 찾기'}
                </button>
              </div>
              <Input 
                value={reservationLink} 
                onChange={(e) => setReservationLink(e.target.value)} 
                placeholder="예: https://naver.me/xxxxxx 또는 https://m.place.naver.com/place/..." 
              />
              {placeFoundMsg && (
                <p className="text-[11px] text-indigo-700 font-medium bg-indigo-50/70 p-1.5 rounded">
                  {placeFoundMsg}
                </p>
              )}
            </div>
          </div>

          {/* 네이버 플레이스 링크 넣는 법 안내 */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowPlaceGuide(!showPlaceGuide)}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              네이버 지도/예약 링크는 어디서 확인하나요? {showPlaceGuide ? '▲ 닫기' : '▼ 보기'}
            </button>
            {showPlaceGuide && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-slate-800">📌 스마트폰 네이버 지도 앱 또는 모바일 웹에서 복사하는 법:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>스마트폰 <strong>네이버 지도 앱</strong>에서 내 매장/사무소를 검색합니다.</li>
                  <li>상세 화면 우측 상단의 <strong>[공유(↗)] 버튼</strong>을 누릅니다.</li>
                  <li><strong>[URL 복사]</strong>를 누른 후 위 링크 칸에 그대로 붙여넣기(Ctrl+V)하시면 됩니다.</li>
                </ol>
                <p className="text-[11px] text-slate-500 mt-1">
                  ※ 링크를 비워두셔도 [1초 자동 찾기] 버튼을 누르면 네이버 지도에서 내 매장 링크를 자동 연동합니다.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. 글쓰기 톤앤매너 설정 */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            AI 글쓰기 톤앤매너 (문체 스타일)
          </CardTitle>
          <CardDescription>
            AI 전문 칼럼 스튜디오에서 글을 생성할 때 기본 적용될 어조를 선택합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'trust',
                title: '신뢰감 있는 법률가/전문가형',
                desc: '논리적 판례 분석과 법적 절차를 차분하고 신뢰성 있게 전달',
                badge: '전문직 최다 선택'
              },
              {
                id: 'empathy',
                title: '따뜻하고 친근한 의뢰인 공감형',
                desc: '의뢰인의 답답한 심정을 공감하고 안심시키는 친절한 어조',
                badge: '상담 전환율 우수'
              },
              {
                id: 'authority',
                title: '명쾌하고 직설적인 해결사형',
                desc: '핵심 쟁점과 실질적 대응 방안을 명확하고 단호하게 제시',
                badge: '긴급 사건 권장'
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setTone(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  tone === item.id
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  {tone === item.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{item.desc}</p>
                <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. AI 맞춤형 지식베이스 (RAG) */}
      <Card className="border-indigo-100 shadow-md bg-white">
        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/70 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-indigo-950 text-lg">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              AI 맞춤형 지식베이스 (RAG 지식 저장소)
            </CardTitle>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-100/70 px-2.5 py-0.5 rounded-full">
              글자 수: {aboutUs.length}자
            </span>
          </div>
          <CardDescription className="text-indigo-900/80">
            이곳에 작성된 내용은 AI가 원고를 작성할 때 <strong>최우선으로 학습하여 본문에 자연스럽게 녹여냅니다.</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            💡 <strong>추천 작성 내용:</strong> 대표 변호사/전문가 약력, 주요 승소 및 해결 사례, 특화 상담 분야(음주운전, 상속재산분할, 스타트업 자문 등), 당사만의 차별점(야간 긴급 접수, 1:1 전담 등)을 자유롭게 메모하듯 적어두시면 됩니다.
          </p>
          <textarea
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            rows={10}
            placeholder="예시)&#10;- 대한변호사협회 등록 형사법 전문 변호사 직접 1:1 상담&#10;- 주요 해결 사례: 음주운전 2진 아웃 집행유예 방어, 특정범죄가중처벌 무혐의 불송치 결정 다수&#10;- 24시간 긴급 체포 및 영장실질심사 전담팀 운영&#10;- 서울 송파구 문정역 3번 출구 도보 2분, 무료 주차 지원"
            className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed text-slate-800 bg-white"
          />
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur p-3 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
        <div className="text-xs text-slate-600 pl-2">
          저장 즉시 <strong>수임 대시보드</strong>와 <strong>전문 칼럼 스튜디오</strong>에 적용됩니다.
        </div>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md rounded-xl flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              상세 정보 및 지식베이스 저장하기
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
