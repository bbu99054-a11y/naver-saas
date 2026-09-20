'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  MapPin, 
  Camera, 
  MessageSquare, 
  Video, 
  Copy, 
  Check, 
  Download, 
  Sparkles
} from 'lucide-react'
import { CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ChannelTab = 'BLOG' | 'PLACE' | 'INSTA' | 'THREADS' | 'SHORTS'

interface Topic {
  id: string
  shortLabel: string
  title: string
  category: string
  caseQuote: string
}

interface OsmuStationPanelProps {
  profile?: any
}

export function OsmuStationPanel({ profile }: OsmuStationPanelProps) {
  const cleanStore = (profile?.store_name || '우리 로펌').trim()
  const cleanKeyword = (profile?.industry || '전문 변호사').trim()
  const address = profile?.address || ''
  const regionMatch = cleanKeyword.match(/^([가-힣]+(?:역|구|동|시|군|읍|면)?)/)
  const regionName = regionMatch ? regionMatch[1] : (address ? address.split(' ')[1] || '관할' : '문정동')

  const initialTopics: Topic[] = [
    { id: '1', shortLabel: '🚨 음주운전 2진', title: `${regionName} 음주운전 2진 아웃 경찰 조사 전 선처 양형 판례`, category: '형사 긴급', caseQuote: '대법원 2024도12891 판결' },
    { id: '2', shortLabel: '⚖️ 이혼 재산분할', title: `${regionName} 이혼 특유재산 45% 기여도 인정 및 재산분할 판례`, category: '이혼·가사', caseQuote: '서울가정법원 2024드단5541 판결' },
    { id: '3', shortLabel: '🏠 전세금 명도', title: `${regionName} 전세보증금 미반환 명도 단행가처분 및 강제집행`, category: '부동산', caseQuote: '대법원 2023다28419 판결' },
    { id: '4', shortLabel: '🏢 기업 횡령·배임', title: `${regionName} 기업 횡령·배임 혐의 불송치 무혐의 종결 전략`, category: '기업법무', caseQuote: '검찰 불기소 결정례' },
    { id: '5', shortLabel: '🛡️ 보이스피싱', title: `${regionName} 보이스피싱 수거책 단순가담 무죄·집행유예 방어`, category: '고단가 수임', caseQuote: '서울동부지법 2024고단1829 판결' }
  ]

  const [topics, setTopics] = useState<Topic[]>(initialTopics)
  const [selectedTopic, setSelectedTopic] = useState<Topic>(initialTopics[0])
  const [activeTab, setActiveTab] = useState<ChannelTab>('BLOG')
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null)

  // 💎 큐레이션 선별기에서 [5대 채널 동시 렌더링] 클릭 시 실시간 쟁점 연동
  useEffect(() => {
    const handleCustomTopic = (e: any) => {
      const { title, category, caseQuote } = e.detail || {}
      if (!title) return
      const newTopic: Topic = {
        id: `curation-${Date.now()}`,
        shortLabel: title.slice(0, 10),
        title,
        category: category === 'HIGH_VALUE' ? '고단가 수임' : (category === 'SEASON' ? '시즌·이슈' : '지역 롱테일'),
        caseQuote: caseQuote || '대법원 실무 판례 요지 연동'
      }
      setTopics(prev => [newTopic, ...prev.filter(t => t.title !== title)])
      setSelectedTopic(newTopic)
    }

    window.addEventListener('postsynk:select-topic', handleCustomTopic)
    return () => window.removeEventListener('postsynk:select-topic', handleCustomTopic)
  }, [])

  // 채널별 완성 텍스트 생성
  const getChannelContent = (channel: ChannelTab) => {
    switch (channel) {
      case 'BLOG':
        return `[네이버 블로그 전문 칼럼]\n제목: ${selectedTopic.title}: 초기 출석 전 필수 법리 쟁점 3원칙\n\n1. 서론: 수사기관 통보 또는 소장 수령 직후 72시간은 향후 결과를 가르는 결정적 골든타임입니다. 단순 감정적 호소만으로는 재판부의 참작을 이끌어내기 어렵습니다.\n\n2. 판례 법리 분석 (${selectedTopic.caseQuote}): 판결례에 따르면 사건 초기 피의자/의뢰인이 자발적으로 피해 회복을 위한 물리적 조치를 완료하고 객관적 입증 자료를 선제 제출한 경우 유리한 양형 및 인용 결정이 내려집니다.\n\n3. 실무 대응 전략: 1차 조사 전 진술 번복 위험을 차단하고, 조서 날인 전 변호인 조력을 통해 불리한 문구를 사전 정정해야 합니다.\n\n[1분 안심 진단 배너 자동 포함됨]`
      
      case 'PLACE':
        return `[네이버 플레이스 소식]\n제목: [긴급 안내] ${cleanStore} — ${selectedTopic.title} 1차 사전 검토 접수\n\n안녕하세요, ${regionName} 법조타운 ${cleanStore} 대표 변호사입니다.\n\n최근 '${selectedTopic.title}' 관련 법적 분쟁으로 인해 긴급 상담 문의가 급증하고 있습니다. 경찰 조사 전 쟁점 정리와 변호인 동석이 필요하신 분들을 위해 야간 및 주말 긴급 사전 검토를 운영합니다.\n\n📍 오시는 길: ${regionName} 법조타운 중심\n⚖️ 100% 비밀 보장 1차 사전 검토 신청 가능`
      
      case 'INSTA':
        return `[인스타그램 4컷 벤토 인포그래픽 기획안]\n1컷 (문제 제기): ${selectedTopic.category} | ${selectedTopic.title} - 긴급 위기, 어떻게 대응해야 할까요?\n2컷 (법리 분석): 대법원 판례 기준 | ${selectedTopic.caseQuote} 핵심 요건\n3컷 (대응 전략): 골든타임 72시간 | 필수 증거 확보 및 탄원서 준비 체크리스트\n4컷 (상담 연결): 비밀 보장 검토 | 프로필 링크에서 1분 비밀 사건 진단 (변호사법 제26조)`
      
      case 'THREADS':
        return `[스레드 5연속 글]\n1/5\n어제 한 의뢰인분이 손을 파르르 떨며 저희 사무실 문을 열었습니다. "${selectedTopic.title} 문제로 소장/출석통보를 받았는데 어떻게 해야 하나요?"\n\n2/5\n결론부터 말씀드리면, 초기 골든타임 72시간 대응에 따라 결과가 80% 결정됩니다. 많은 분들이 '알아서 잘 되겠지' 하고 안일하게 대처했다가 돌이킬 수 없는 불이익을 받습니다.\n\n3/5\n재판부와 수사기관이 실제로 집중하는 핵심 요건은 (${selectedTopic.caseQuote}) 법리에 명시된 객관적 입증 자료입니다.\n\n4/5\n실제 저희 ${cleanStore}에서 최근 성공적으로 인용·방어한 실무 대응 핵심 3원칙을 정리해 두었습니다.\n\n5/5 (댓글로 계속 👇)\n지금 비슷한 사안으로 고민 중이시라면 혼자 끙끙 앓지 마시고 프로필 링크의 [1분 안심 진단]에 남겨주세요. 대표 변호사가 직접 1차 법리 쟁점을 비밀 보장으로 검토해 드립니다.`
      
      case 'SHORTS':
        return `[유튜브 숏츠 59초 대본]\n[00:00 - 00:03 시선 집중]\n"${selectedTopic.title} 때문에 밤잠 설치고 계신가요? 지금 당장 이것부터 확인하세요!"\n\n[00:04 - 00:48 해결 방안]\n${selectedTopic.caseQuote}에 따르면 법정에서 판사를 설득하는 건 감정적 호소가 아니라 구체적이고 객관적인 입증 자료입니다. 초기 72시간 내에 첫째, 사실관계 타임라인 정리, 둘째, 불리한 진술 차단, 셋째, 전문가의 사전 모의 검토가 필수입니다.\n\n[00:49 - 00:59 상담 안내]\n"내 사건에 적용되는 구체적 법리 검토는 고정 댓글의 1분 안심 진단 링크에서 바로 확인해 보세요."`
    }
  }

  const handleCopy = (channelName: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedChannel(channelName)
    setTimeout(() => setCopiedChannel(null), 2000)
  }

  const handleCopyAll = () => {
    const fullBundle = [
      getChannelContent('BLOG'),
      '\n' + '='.repeat(40) + '\n',
      getChannelContent('PLACE'),
      '\n' + '='.repeat(40) + '\n',
      getChannelContent('INSTA'),
      '\n' + '='.repeat(40) + '\n',
      getChannelContent('THREADS'),
      '\n' + '='.repeat(40) + '\n',
      getChannelContent('SHORTS')
    ].join('\n')

    handleCopy('all', fullBundle)
  }

  return (
    <div id="osmu-station" className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden border border-slate-200">
      {/* 🌟 헤더 & 쟁점 선택 */}
      <div className="p-4 sm:p-5 pb-3 bg-white border-b border-slate-100 space-y-3">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              OSMU 멀티 콘텐츠 생성
            </h3>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/70">
              변호사법 제23조 준수
            </span>
          </div>

          <Link href={`/dashboard/write?keyword=${encodeURIComponent(selectedTopic.title)}`}>
            <Button size="sm" className="h-8 px-3.5 text-xs font-bold bg-[#FF6B00] hover:bg-[#E05D00] text-white rounded-xl shadow-2xs cursor-pointer transition-all active:scale-[0.98]">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> 새 칼럼 작성
            </Button>
          </Link>
        </div>

        {/* 쟁점 선택 칩 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-slate-400 shrink-0 mr-1 font-mono">추천 쟁점:</span>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`text-[11px] sm:text-xs px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTopic.id === topic.id
                  ? 'bg-[#0284C7] text-white font-bold shadow-2xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 font-medium'
              }`}
            >
              <span className="font-semibold">{topic.shortLabel || topic.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 무테두리 세그먼트 컨트롤 탭 */}
      <div className="p-3 bg-slate-50/50 flex items-center justify-between gap-2 border-b border-slate-100">
        <div className="inline-flex p-1 bg-slate-200/60 rounded-xl text-xs font-medium overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('BLOG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'BLOG'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>블로그</span>
          </button>

          <button
            onClick={() => setActiveTab('PLACE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'PLACE'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>플레이스 소식</span>
          </button>

          <button
            onClick={() => setActiveTab('INSTA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'INSTA'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>인스타그램</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">준비중</span>
          </button>

          <button
            onClick={() => setActiveTab('THREADS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'THREADS'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>스레드</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">준비중</span>
          </button>

          <button
            onClick={() => setActiveTab('SHORTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'SHORTS'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>숏츠</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">준비중</span>
          </button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopyAll}
          className="h-8 text-xs font-bold text-[#0284C7] hover:bg-sky-50 px-3 rounded-xl cursor-pointer shrink-0"
        >
          {copiedChannel === 'all' ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="w-3.5 h-3.5" /> 5채널 복사됨
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> 5채널 일괄 복사
            </span>
          )}
        </Button>
      </div>

      {/* 🌟 탭별 미리보기 콘텐츠 영역 */}
      <div className="p-5 flex-1 overflow-y-auto space-y-3">
        {/* 1. 네이버 블로그 탭 */}
        {activeTab === 'BLOG' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-[#0284C7] font-semibold">블로그 핵심 쟁점 골격 (요약)</span>
                <span>{selectedTopic.caseQuote}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {selectedTopic.title}: 초기 출석 전 필수 법리 쟁점 3원칙
              </h3>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-100 font-mono">
                <p>
                  <strong>1. 서론:</strong> 수사기관 통보 또는 소장 수령 직후 72시간은 향후 결과를 가르는 결정적 골든타임입니다. 단순 감정적 호소만으로는 재판부의 참작을 이끌어내기 어렵습니다.
                </p>
                <p>
                  <strong>2. 대법원 판례 법리 분석 ({selectedTopic.caseQuote}):</strong> 판결례에 따르면 사건 초기 피의자/의뢰인이 자발적으로 피해 회복을 위한 물리적 조치를 완료하고 객관적 입증 자료를 선제 제출한 경우 유리한 양형 및 인용 결정이 내려집니다.
                </p>
                <p>
                  <strong>3. 실무 대응 전략:</strong> 1차 조사 전 진술 번복 위험을 차단하고, 조서 날인 전 변호인 조력을 통해 불리한 문구를 사전 정정해야 합니다.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#0284C7]">🔒</span>
                  <span className="font-medium text-slate-700">본문 하단 [1분 안심 진단 배너] 연동</span>
                </div>
                <span className="text-[11px] font-mono text-[#0284C7] font-bold">자동 포함됨 ✓</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">스마트에디터 ONE 서식 호환</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/write?keyword=${encodeURIComponent(selectedTopic.title)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#E05D00] h-8 px-3 rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>2,500자 본문 완성하기 ➔</span>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy('blog', getChannelContent('BLOG'))}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs h-8 px-3 rounded-lg cursor-pointer"
                >
                  {copiedChannel === 'blog' ? '복사 완료!' : '요약본 복사'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. 네이버 플레이스 소식 탭 */}
        {activeTab === 'PLACE' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-[#0284C7] font-semibold">400자 로컬 소식</span>
                <span>지도 예약 딥링크 결합</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                [긴급 안내] {cleanStore} — {selectedTopic.title} 1차 사전 검토 접수
              </h3>

              <div className="text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100 leading-relaxed font-sans">
                안녕하세요, {regionName} 법조타운 {cleanStore} 대표 변호사입니다.<br /><br />
                최근 &lsquo;{selectedTopic.title}&rsquo; 관련 법적 분쟁으로 인해 긴급 상담 문의가 급증하고 있습니다. 
                경찰 신문 전 쟁점 정리와 변호인 동석이 필요하신 분들을 위해 야간 및 주말 긴급 사전 검토를 운영합니다.<br /><br />
                📍 오시는 길: {regionName} 법조타운 중심<br />
                ⚖️ 100% 비밀 보장 1차 사전 검토 신청 가능
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">플레이스 소식란 포맷</span>
              <Button
                size="sm"
                onClick={() => handleCopy('place', getChannelContent('PLACE'))}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3.5 rounded-lg cursor-pointer"
              >
                {copiedChannel === 'place' ? '복사 완료!' : '플레이스 소식 복사'}
              </Button>
            </div>
          </div>
        )}

        {/* 3. 인스타그램 탭 (준비 중 모드) */}
        {activeTab === 'INSTA' && (
          <div className="space-y-3">
            <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>인스타그램 카드뉴스 템플릿 미리보기 (자동 연동 기능 준비 중)</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                출시 예정
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-[#0284C7] font-semibold">1080x1080 4장 정규격</span>
              <span>피드 최적화</span>
            </div>

            {/* 4장 벤토 카드 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 카드 1 */}
              <div className="bg-[#0B1527] text-white p-3.5 rounded-xl aspect-square flex flex-col justify-between border border-slate-800 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">01 / ISSUE</span>
                <div>
                  <p className="text-[11px] text-sky-400 font-semibold">{selectedTopic.category}</p>
                  <p className="text-xs font-bold text-white mt-1 leading-snug line-clamp-3">
                    {selectedTopic.title}
                  </p>
                </div>
                <p className="text-[9px] text-slate-500 font-mono">LEGAL BRIEF</p>
              </div>

              {/* 카드 2 */}
              <div className="bg-white p-3.5 rounded-xl aspect-square flex flex-col justify-between border border-slate-200 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">02 / ANALYSIS</span>
                <div>
                  <p className="text-[11px] text-slate-500">법원 판례 기준</p>
                  <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    인용·감경을 가르는<br />
                    3대 핵심 요건
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-mono truncate">{selectedTopic.caseQuote}</p>
              </div>

              {/* 카드 3 */}
              <div className="bg-white p-3.5 rounded-xl aspect-square flex flex-col justify-between border border-slate-200 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">03 / ACTION</span>
                <div>
                  <p className="text-[11px] text-slate-500">골든타임 72시간</p>
                  <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    불리한 진술 방어 및<br />
                    필수 입증 자료 준비
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-mono">CHECKLIST</p>
              </div>

              {/* 카드 4 */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl aspect-square flex flex-col justify-between border border-slate-800 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">04 / INTAKE</span>
                <div>
                  <p className="text-[11px] text-slate-300">비밀 보장 검토</p>
                  <p className="text-xs font-bold text-white mt-1 leading-snug">
                    프로필 링크에서<br />
                    1분 안심 진단
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-mono">변호사법 제26조</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">1080px 정규격 이미지 기획안</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy('insta', getChannelContent('INSTA'))}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs h-8 px-3 rounded-lg cursor-pointer gap-1"
              >
                {copiedChannel === 'insta' ? '복사 완료!' : '인스타 기획 복사'}
              </Button>
            </div>
          </div>
        )}

        {/* 4. 스레드 (Threads) 탭 (준비 중 모드) */}
        {activeTab === 'THREADS' && (
          <div className="space-y-3">
            <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>스레드 5단계 연속 글 템플릿 미리보기 (자동 연동 기능 준비 중)</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                출시 예정
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-[#0284C7] font-semibold">1인칭 구어체 5연속 글</span>
                <span>스레드 최적화</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 font-sans divide-y divide-slate-100">
                <div className="pb-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">1/5</span>
                  어제 한 의뢰인분이 손을 파르르 떨며 저희 사무실 문을 열었습니다.<br />
                  &ldquo;변호사님, {selectedTopic.title} 문제로 소장/출석통보를 받았는데 어떻게 해야 하나요?&rdquo;
                </div>
                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">2/5</span>
                  결론부터 말씀드리면, 초기 골든타임 72시간 대응에 따라 결과가 80% 결정됩니다. 많은 분들이 &lsquo;알아서 잘 되겠지&rsquo; 하고 안일하게 대처했다가 돌이킬 수 없는 불이익을 받습니다.
                </div>
                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">3/5</span>
                  재판부와 수사기관이 실제로 집중하는 핵심 요건은 ({selectedTopic.caseQuote}) 법리에 명시된 객관적 입증 자료입니다.
                </div>
                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">4/5</span>
                  실제 저희 {cleanStore}에서 최근 성공적으로 인용·방어한 실무 대응 핵심 3원칙을 정리해 두었습니다.
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">5/5 (댓글로 계속 👇)</span>
                  지금 비슷한 사안으로 고민 중이시라면 혼자 끙끙 앓지 마시고 프로필 링크의 [1분 안심 진단]에 남겨주세요. 대표 변호사가 직접 1차 법리 쟁점을 비밀 보장으로 검토해 드립니다.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">복사 후 바로 붙여넣기</span>
              <Button
                size="sm"
                onClick={() => handleCopy('threads', getChannelContent('THREADS'))}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3.5 rounded-lg cursor-pointer"
              >
                {copiedChannel === 'threads' ? '복사 완료!' : '스레드 연속 글 복사'}
              </Button>
            </div>
          </div>
        )}

        {/* 5. 유튜브 숏츠 탭 (준비 중 모드) */}
        {activeTab === 'SHORTS' && (
          <div className="space-y-3">
            <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>숏츠 59초 영상 대본 템플릿 미리보기 (자동 연동 기능 준비 중)</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                출시 예정
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-[#0284C7] font-semibold">59초 촬영용 대본 (자막 모드)</span>
                <span>3초 훅 — 45초 해법 — 10초 행동 안내</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">00:00 - 00:03 [시선 집중]</span>
                  <p className="font-semibold text-slate-900">
                    &ldquo;{selectedTopic.title} 때문에 밤잠 설치고 계신가요? 지금 당장 이것부터 확인하세요!&rdquo;
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">00:04 - 00:48 [해결 방안]</span>
                  <p className="leading-relaxed">
                    {selectedTopic.caseQuote}에 따르면 법정에서 판사를 설득하는 건 감정적 호소가 아니라 구체적이고 객관적인 입증 자료입니다. 초기 72시간 내에 첫째, 사실관계 타임라인 정리, 둘째, 불리한 진술 차단, 셋째, 전문가의 사전 모의 검토가 필수입니다.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">00:49 - 00:59 [상담 안내]</span>
                  <p className="font-medium text-slate-900">
                    &ldquo;내 사건에 적용되는 구체적 법리 검토는 고정 댓글의 1분 안심 진단 링크에서 바로 확인해 보세요.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">1분 낭독 촬영용 대본</span>
              <Button
                size="sm"
                onClick={() => handleCopy('shorts', getChannelContent('SHORTS'))}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3.5 rounded-lg cursor-pointer"
              >
                {copiedChannel === 'shorts' ? '복사 완료!' : '숏츠 대본 복사'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
