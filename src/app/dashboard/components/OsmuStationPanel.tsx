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
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ChannelTab = 'BLOG' | 'PLACE' | 'INSTA' | 'THREADS' | 'SHORTS'

interface Topic {
  id: string
  title: string
  category: string
  caseQuote: string
}

const SAMPLE_TOPICS: Topic[] = [
  { id: '1', title: '음주운전 2진 아웃 경찰 조사 전 선처 양형 판례', category: '형사 사건', caseQuote: '대법원 2024도12891 판결' },
  { id: '2', title: '상간자 위자료 청구 소송 3,500만 원 승소 인용', category: '이혼·가사', caseQuote: '서울가정법원 2024드단5541 판결' },
  { id: '3', title: '전세보증금 미반환 명도 및 강제집행 신속 회수', category: '부동산', caseQuote: '대법원 2023다28419 판결' },
  { id: '4', title: '기업 횡령·배임 혐의 불송치 무혐의 종결', category: '기업법무', caseQuote: '검찰 불기소 결정례' }
]

export function OsmuStationPanel() {
  const [topics, setTopics] = useState<Topic[]>(SAMPLE_TOPICS)
  const [selectedTopic, setSelectedTopic] = useState<Topic>(SAMPLE_TOPICS[0])
  const [activeTab, setActiveTab] = useState<ChannelTab>('BLOG')
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null)

  // 💎 큐레이션 선별기에서 [5대 채널 동시 렌더링] 클릭 시 실시간 쟁점 연동
  useEffect(() => {
    const handleCustomTopic = (e: any) => {
      const { title, category, caseQuote } = e.detail || {}
      if (!title) return
      const newTopic: Topic = {
        id: `curation-${Date.now()}`,
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

  const handleCopy = (channelName: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedChannel(channelName)
    setTimeout(() => setCopiedChannel(null), 2000)
  }

  return (
    <div id="osmu-station" className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden">
      {/* 🌟 헤더 & 쟁점 선택 */}
      <div className="p-5 pb-3 bg-gradient-to-r from-sky-50/50 via-blue-50/30 to-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
                1-Click Multi-Channel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                · 변호사법 제23조 광고 규정 준수
              </span>
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 mt-0.5">
              1-클릭 5대 채널 동시 제작 스튜디오
            </CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              사건 쟁점 1회 선택으로 블로그 · 플레이스 · 인스타그램 · 스레드 · 숏츠 콘텐츠가 한 번에 완성됩니다.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link href="/dashboard/write">
              <Button size="sm" className="h-9 px-4 text-xs font-bold bg-[#FF6B00] hover:bg-[#E05D00] text-white rounded-xl shadow-sm cursor-pointer transition-all active:scale-[0.98]">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> 새 칼럼 작성
              </Button>
            </Link>
          </div>
        </div>

        {/* 쟁점 선택 칩 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[11px] text-slate-400 shrink-0 mr-1 font-mono">쟁점:</span>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`text-xs px-3.5 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                selectedTopic.id === topic.id
                  ? 'bg-[#0284C7] text-white font-bold shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 font-medium'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 무테두리 세그먼트 컨트롤 탭 */}
      <div className="p-3 bg-slate-50/50 flex items-center justify-between gap-2">
        <div className="inline-flex p-1 bg-slate-200/60 rounded-xl text-xs font-medium overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('BLOG')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'INSTA'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>인스타 벤토</span>
          </button>

          <button
            onClick={() => setActiveTab('THREADS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'THREADS'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>스레드</span>
          </button>

          <button
            onClick={() => setActiveTab('SHORTS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'SHORTS'
                ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>유튜브 숏츠</span>
          </button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleCopy('all', `${selectedTopic.title}\n\n${selectedTopic.caseQuote}`)}
          className="h-8 text-xs font-bold text-[#0284C7] hover:bg-sky-50 px-3 rounded-xl cursor-pointer shrink-0"
        >
          {copiedChannel === 'all' ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="w-3.5 h-3.5" /> 복사됨
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> 5채널 일괄 복사
            </span>
          )}
        </Button>
      </div>

      {/* 🌟 탭별 미리보기 콘텐츠 영역 */}
      <div className="p-5 flex-1 overflow-y-auto">
        {/* 1. 네이버 블로그 탭 */}
        {activeTab === 'BLOG' && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">2,500자 전문 칼럼</span>
                <span>{selectedTopic.caseQuote}</span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                {selectedTopic.title}: 경찰 1차 피의자 신문 출석 전 필수 선처 양형 3원칙
              </h3>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50/50 p-3.5 rounded-md border border-slate-100 font-mono">
                <p>
                  <strong>1. 서론:</strong> 수사기관의 출석 통보를 받은 직후 72시간은 향후 기소유예 또는 집행유예를 가르는 결정적 골든타임입니다. 단순 반성문 제출만으로는 재판부의 양형 참작을 이끌어내기 어렵습니다.
                </p>
                <p>
                  <strong>2. 대법원 판례 법리 분석 ({selectedTopic.caseQuote}):</strong> 대법원 판결례에 따르면 피의자가 범행 직후 자발적으로 알코올 치료 프로그램에 등록하고 차량 매각 등 재범 방지를 위한 물리적 조치를 완료한 경우...
                </p>
                <p>
                  <strong>3. 실무 대응 전략:</strong> 경찰 1차 신문 시 진술 번복 위험을 차단하고, 피의자 신문 조서 날인 전 변호인 조력을 통해 불리한 문구를 사전 정정해야 합니다.
                </p>
              </div>

              {/* 하단 1분 안심 진단 배너 자동 삽입 표시 */}
              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">🔒</span>
                  <span className="font-medium text-slate-700">본문 하단 [1분 안심 진단 배너] 연동</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">자동 포함됨 ✓</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">스마트에디터 ONE 서식 지원</span>
              <Button
                size="sm"
                onClick={() => handleCopy('blog', `${selectedTopic.title}\n\n${selectedTopic.caseQuote}`)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-md cursor-pointer"
              >
                {copiedChannel === 'blog' ? '복사 완료!' : '블로그 원고 복사'}
              </Button>
            </div>
          </div>
        )}

        {/* 2. 네이버 플레이스 소식 탭 */}
        {activeTab === 'PLACE' && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">400자 로컬 소식</span>
                <span>지도 예약 딥링크 결합</span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                [긴급 공지] 서초역 법무법인 — 음주운전 피의자 신문 출석 동석 긴급 접수
              </h3>

              <div className="text-xs text-slate-600 bg-slate-50/50 p-3.5 rounded-md border border-slate-100 leading-relaxed font-sans">
                안녕하세요, 서초역 3번 출구 인근 법무법인 대표 변호사입니다.<br /><br />
                최근 음주운전 단속 강화로 인해 경찰 1차 출석 요구서를 받고 당황하신 의뢰인분들의 문의가 급증하고 있습니다. 
                경찰 신문 전 쟁점 정리와 변호인 동석이 필요하신 분들을 위해 이번 주 평일 야간 및 주말 긴급 사전 검토를 운영합니다.<br /><br />
                📍 오시는 길: 서초역 3번 출구 도보 2분<br />
                ⚖️ 100% 비밀 보장 1차 사전 검토 신청 가능
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">플레이스 소식란 포맷</span>
              <Button
                size="sm"
                onClick={() => handleCopy('place', '플레이스 소식 복사')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-md cursor-pointer"
              >
                {copiedChannel === 'place' ? '복사 완료!' : '플레이스 소식 복사'}
              </Button>
            </div>
          </div>
        )}

        {/* 3. 인스타그램 벤토 4장 인포그래픽 탭 (Linear 다크/모노톤 미학) */}
        {activeTab === 'INSTA' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">1080x1080 4장 세트</span>
              <span>피드 최적화</span>
            </div>

            {/* 4장 벤토 카드 그리드 (Linear 다크/모노톤) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 카드 1 */}
              <div className="bg-[#0B1527] text-white p-3.5 rounded-lg aspect-square flex flex-col justify-between border border-slate-800 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">01 / PROBLEM</span>
                <div>
                  <p className="text-[11px] text-slate-300">음주운전 2진 아웃</p>
                  <p className="text-xs font-semibold text-white mt-1 leading-snug">
                    경찰 조사 통보,<br />
                    실형 위기인가요?
                  </p>
                </div>
                <p className="text-[9px] text-slate-500 font-mono">LEGAL BRIEF</p>
              </div>

              {/* 카드 2 */}
              <div className="bg-white p-3.5 rounded-lg aspect-square flex flex-col justify-between border border-slate-200 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">02 / ANALYSIS</span>
                <div>
                  <p className="text-[11px] text-slate-500">대법원 판례 기준</p>
                  <p className="text-xs font-semibold text-slate-900 mt-1 leading-snug">
                    집행유예 인용을 가르는<br />
                    3대 핵심 요건
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-mono">{selectedTopic.caseQuote}</p>
              </div>

              {/* 카드 3 */}
              <div className="bg-white p-3.5 rounded-lg aspect-square flex flex-col justify-between border border-slate-200 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">03 / ACTION</span>
                <div>
                  <p className="text-[11px] text-slate-500">출석 72시간 전</p>
                  <p className="text-xs font-semibold text-slate-900 mt-1 leading-snug">
                    차량 매각 및<br />
                    치료 증빙 제출 전략
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-mono">CHECKLIST</p>
              </div>

              {/* 카드 4 */}
              <div className="bg-slate-900 text-white p-3.5 rounded-lg aspect-square flex flex-col justify-between border border-slate-800 shadow-2xs">
                <span className="text-[9px] font-mono text-slate-400 uppercase">04 / INTAKE</span>
                <div>
                  <p className="text-[11px] text-slate-300">비밀 보장 검토</p>
                  <p className="text-xs font-semibold text-white mt-1 leading-snug">
                    프로필 링크에서<br />
                    1분 비밀 진단
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-mono">변호사법 제26조</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">1080px 정규격 이미지</span>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs h-8 px-3 rounded-md cursor-pointer gap-1"
              >
                <Download className="w-3 h-3 text-slate-500" /> ZIP 다운로드
              </Button>
            </div>
          </div>
        )}

        {/* 4. 스레드 (Threads) 탭 */}
        {activeTab === 'THREADS' && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">1인칭 구어체 5연속 글</span>
                <span>바이럴 최적화</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 font-sans divide-y divide-slate-100">
                <div className="pb-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">1/5</span>
                  어제 한 의뢰인분이 손을 파르르 떨면서 사무실 문을 열었습니다.<br />
                  "변호사님, 5년 전 음주운전 전과가 있는데 이번에 또 단속에 걸렸습니다. 저 구속되나요?"
                </div>
                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">2/5</span>
                  결론부터 말씀드리면, 첫 경찰 조사를 어떻게 받느냐에 따라 실형 여부가 80% 결정됩니다. 많은 분들이 '반성문만 많이 써가면 선처해 주겠지' 하고 안일하게 출석했다가 구속영장 청구로 이어집니다.
                </div>
                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">3/5</span>
                  판사님이 실제로 중요하게 보는 건 단순 반성이 아니라 '재범 가능성의 물리적 차단'입니다. (1) 차량 매각 증빙, (2) 알코올 치료 프로그램 등록서, (3) 부양가족 생계 탄원서가 조사 전 미리 세팅되어야 합니다.
                </div>
                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">4/5</span>
                  실제 저희 로펌에서 최근 집행유예로 방어한 사건의 양형 체크리스트 핵심 3가지를 정리해 두었습니다.
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-0.5">5/5 (댓글로 계속 👇)</span>
                  지금 비슷한 위기에 놓여 계시다면, 혼자 불안해하지 마시고 프로필 링크의 [사건 1분 안심 진단]에 상황을 남겨주세요. 대표 변호사가 1차 법리 쟁점을 비밀 보장으로 즉시 검토해 드립니다.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">복사 후 바로 붙여넣기</span>
              <Button
                size="sm"
                onClick={() => handleCopy('threads', '스레드 5단계 연속글 복사')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-md cursor-pointer"
              >
                {copiedChannel === 'threads' ? '복사 완료!' : '스레드 연속 글 복사'}
              </Button>
            </div>
          </div>
        )}

        {/* 5. 유튜브 숏츠 탭 */}
        {activeTab === 'SHORTS' && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">59초 촬영용 대본 (자막 모드)</span>
                <span>3초 훅 — 45초 해법 — 10초 행동 안내</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50/70 rounded-md border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">00:00 - 00:03 [시선 집중]</span>
                  <p className="font-semibold text-slate-900">
                    "음주운전 2진 아웃 걸리셨다고요? 지금 당장 반성문 쓰지 마세요!"
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50/70 rounded-md border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">00:04 - 00:48 [해결 방안]</span>
                  <p className="leading-relaxed">
                    경찰 출석 전 딱 72시간이 선처 여부를 가릅니다. 경찰관에게 '앞으로 술 안 마시겠다'는 말 백 번 해봤자 조서에는 안 적힙니다. 지금 당장 준비해야 할 세 가지는 첫째, 차량 매각 증명서. 둘째, 알코올 상담 클리닉 등록증. 셋째, 1차 피의자 신문 전 변호인 사전 리허설입니다.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50/70 rounded-md border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">00:49 - 00:59 [상담 안내]</span>
                  <p className="font-medium text-slate-900">
                    "상황별 구체적인 양형 체크리스트는 고정 댓글 링크의 1분 안심 진단 폼에서 확인하세요."
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">1분 낭독 촬영용 대본</span>
              <Button
                size="sm"
                onClick={() => handleCopy('shorts', '숏츠 대본 복사')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-md cursor-pointer"
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
