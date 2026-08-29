'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Globe, FileText, CheckCircle2, AlertTriangle, Sparkles, 
  HelpCircle, ArrowRight, Copy, ExternalLink, ShieldCheck, 
  Layers, Key, RefreshCw, Send, 
  Check, Image as ImageIcon, MapPin, Phone, Award, Flame
} from 'lucide-react'

type TabType = 'naver' | 'wordpress' | 'tistory' | 'ai' | 'seo'

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<TabType>('naver')
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopySample = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* 상단 메인 헤더 */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" /> 2026 최신 알고리즘 대응 매뉴얼
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          📖 PostSynk 완벽 사용 가이드
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          네이버 블로그 복사 발행부터 워드프레스·티스토리 원클릭 자동 연동, C-Rank 상위 노출 비법까지 모두 확인하세요.
        </p>
      </div>

      {/* 5대 네비게이션 탭 바 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('naver')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'naver'
              ? 'bg-white text-[#03C75A] shadow-sm border border-emerald-100 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
            <span className="text-sm">네이버 블로그</span>
          </div>
          <span className="text-[11px] font-normal opacity-80">원클릭 자동 발행</span>
        </button>

        <button
          onClick={() => setActiveTab('wordpress')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'wordpress'
              ? 'bg-white text-blue-600 shadow-sm border border-blue-100 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm">워드프레스</span>
          </div>
          <span className="text-[11px] font-normal opacity-80">원클릭 자동 연동</span>
        </button>

        <button
          onClick={() => setActiveTab('tistory')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tistory'
              ? 'bg-white text-orange-600 shadow-sm border border-orange-100 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <FileText className="w-4 h-4 text-orange-500" />
            <span className="text-sm">티스토리</span>
          </div>
          <span className="text-[11px] font-normal opacity-80">OpenAPI 자동 연동</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-white text-purple-600 shadow-sm border border-purple-100 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span className="text-sm">AI 맞춤 설정</span>
          </div>
          <span className="text-[11px] font-normal opacity-80">전문직 톤 & RAG</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-indigo-600" />
            <span className="text-sm">상위 노출 비법</span>
          </div>
          <span className="text-[11px] font-normal opacity-80">C-Rank / DIA+ FAQ</span>
        </button>
      </div>

      {/* 탭 1: 네이버 블로그 AI 다이렉트 엔진 원클릭 자동 발행 가이드 */}
      {activeTab === 'naver' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-[#03C75A] text-white p-2 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-base">네이버 블로그 AI 다이렉트 엔진 원클릭 자동 발행 가이드 🚀</h3>
              <p className="text-emerald-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                번거로운 수동 복사 붙여넣기 없이, <strong>[🚀 네이버 원클릭 자동 발행]</strong> 버튼 클릭 한 번으로 고화질 인포그래픽 카드뉴스 4장과 C-Rank 구조화 본문이 내 네이버 블로그에 10초 만에 자동으로 쏙 작성됩니다.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {/* Step 1: 다이렉트 엔진 1초 다운로드 및 무음 등록 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#03C75A]" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    <CardTitle className="text-base font-bold text-slate-800">다이렉트 엔진 1초 다운로드 및 무음 등록 (최초 1회만)</CardTitle>
                  </div>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    최초 1회 30초 완료
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-700">
                <p>
                  네이버의 엄격한 보안 규정을 100% 안전하게 통과하기 위해, 내 컴퓨터에서 실행되는 초경량 무음 엔진을 다운로드합니다.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">실행 순서:</p>
                    <ol className="list-decimal list-inside space-y-0.5 pl-1">
                      <li>우측 <strong>[다이렉트 엔진 다운로드]</strong> 클릭 후 압축 해제</li>
                      <li><code>register-startup.bat</code> 1회 실행 (윈도우 부팅 시 무음 자동 대기)</li>
                    </ol>
                  </div>
                  <a
                    href="/api/download/direct-engine"
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-9 px-3.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <span>📥 다이렉트 엔진 다운로드 (.zip)</span>
                  </a>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-950 leading-relaxed flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>안심 보안 보장:</strong> 비밀번호는 절대 저장되지 않으며, 고객 PC 내에서만 안전하게 동작합니다.</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: 원클릭 자동 발행 클릭 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#03C75A]" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                  <CardTitle className="text-base font-bold text-slate-800">글 생성 후 [🚀 네이버 원클릭 자동 발행] 클릭</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-700">
                <p>
                  원고와 인포그래픽 카드뉴스가 생성되면, 에디터 하단의 <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">[🚀 네이버 원클릭 자동 발행]</strong> 버튼을 누릅니다.
                </p>
                <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>✨ PostSynk AI 다이렉트 엔진 관제창 (5단계 자동 수행)</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">10초 완성</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300 pl-1 font-mono">
                    <li>✓ [1/5] 고화질 인포그래픽 이미지 무손실 패키징</li>
                    <li>✓ [2/5] 네이버 보안 브라우저 세션 안전 연결</li>
                    <li>✓ [3/5] 스마트에디터 ONE 제목 및 본문 구조화 타이핑</li>
                    <li>✓ [4/5] 인포그래픽 카드뉴스 & CTA 배너 정밀 배치</li>
                    <li>✓ [5/5] 네이버 블로그 안전 임시저장 완료 🎉</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: 네이버 블로그 글 확인 & 최종 발행 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#03C75A]" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                  <CardTitle className="text-base font-bold text-slate-800">네이버 블로그 임시저장 확인 및 최종 발행</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-700">
                <p>
                  관제창 완료 화면에서 <strong>[🎉 내 네이버 블로그 글 확인하러 가기]</strong>를 누르시면 스마트에디터 글쓰기 창으로 즉시 이동합니다.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
                  <p className="font-bold text-slate-800">최종 확인 체크리스트:</p>
                  <p>• 제목, 본문, 사진 4장, 하단 배너가 완벽히 들어가 있는지 확인 후 우측 상단 <strong>[발행]</strong>을 누르시면 포스팅이 끝납니다.</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link href="/dashboard/write">
                    <Button className="bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs gap-1.5 cursor-pointer">
                      지금 바로 네이버 블로그 글 작성하기 <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 탭 2: 워드프레스 자동 연동 & 원클릭 발행 */}
      {activeTab === 'wordpress' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0 mt-0.5">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-950 text-base">워드프레스 (WordPress) REST API 원클릭 자동 발행 연동</h3>
              <p className="text-blue-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                워드프레스 5.6 이상 버전에 기본 탑재된 <strong>응용 프로그램 비밀번호(Application Passwords)</strong>를 등록하면, 
                글 작성 후 하단 [워드프레스] 버튼 클릭 한 번으로 3초 만에 내 사이트에 즉시 포스팅됩니다.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* WP Step 1 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">1</span>
                  <CardTitle className="text-lg text-slate-800">워드프레스 관리자에서 '응용 프로그램 비밀번호' 발급받기</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
                  <li>워드프레스 관리자 화면(<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">https://내도메인.com/wp-admin</code>)에 로그인합니다.</li>
                  <li>좌측 메뉴에서 <strong>[사용자] ➔ [프로필]</strong>(또는 [나의 프로필]) 메뉴로 이동합니다.</li>
                  <li>페이지를 맨 아래로 스크롤하여 <strong>'응용 프로그램 비밀번호(Application Passwords)'</strong> 항목을 찾습니다.</li>
                  <li>
                    <strong>'새 응용 프로그램 비밀번호 이름'</strong> 입력란에 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">PostSynk</code> 입력 후 
                    <strong className="text-blue-600"> [새 응용 프로그램 비밀번호 추가]</strong> 버튼을 누릅니다.
                  </li>
                  <li>
                    화면에 발급된 <strong>4자리씩 띄어진 24자리 비밀번호</strong>(예: <code className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">abcd efgh ijkl mnop qrst uvwx</code>)를 복사합니다.
                  </li>
                </ol>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  ⚠️ <strong>주의:</strong> 이 비밀번호는 기존 워드프레스 로그인 암호가 아니며, REST API 전용 보안 키입니다. 화면을 벗어나면 다시 확인할 수 없으니 복사해 두세요.
                </div>
              </CardContent>
            </Card>

            {/* WP Step 2 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">2</span>
                  <CardTitle className="text-lg text-slate-800">PostSynk [API 설정] 메뉴에 등록하기</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>PostSynk 대시보드의 <strong>[API 설정]</strong> 메뉴로 이동하여 3개 정보를 입력하고 저장합니다:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-1">1. 사이트 주소 (URL)</div>
                    <div className="text-slate-600 font-mono">https://myblog.com</div>
                    <div className="text-[10px] text-slate-400 mt-1">(끝의 슬래시 자동 정제)</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-1">2. 사용자명 (Username)</div>
                    <div className="text-slate-600 font-mono">admin (워드프레스 ID)</div>
                    <div className="text-[10px] text-slate-400 mt-1">로그인 시 사용하는 아이디</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-1">3. Application Password</div>
                    <div className="text-slate-600 font-mono">xxxx xxxx xxxx xxxx</div>
                    <div className="text-[10px] text-slate-400 mt-1">AES-256 군사등급 암호화 보관</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold cursor-pointer">
                      <Key className="w-3.5 h-3.5 mr-1.5" /> 워드프레스 API 키 설정하러 가기 &rarr;
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* WP Step 3 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">3</span>
                  <CardTitle className="text-lg text-slate-800">글 작성 화면에서 [워드프레스] 버튼 1클릭 발행</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  글 생성이 완료된 후 하단 액션바의 파란색 <strong className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">[워드프레스]</strong> 버튼을 클릭합니다.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">발행 결과:</span>
                    <span className="text-slate-600">발행 성공 알림과 함께 즉시 새 탭으로 내 워드프레스 글 주소가 열립니다.</span>
                  </div>
                  <span className="text-blue-600 font-bold hidden sm:inline">✓ 즉시 공개(Publish) 상태로 포스팅 완료</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 탭 3: 티스토리 자동 연동 & 원클릭 발행 */}
      {activeTab === 'tistory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-orange-500 text-white p-2 rounded-lg shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-orange-950 text-base">티스토리 (Tistory) OpenAPI 원클릭 자동 발행 연동</h3>
              <p className="text-orange-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                카카오/티스토리 공식 OpenAPI를 통해 티스토리 블로그에 원격으로 글을 자동 발행합니다. 
                토큰을 한 번만 등록해 두시면 [티스토리] 버튼 클릭 한 번으로 포스팅이 끝납니다.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Tistory Step 1 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black">1</span>
                  <CardTitle className="text-lg text-slate-800">티스토리 Open API 앱 등록 및 Access Token 발급</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
                  <li>
                    <a href="https://www.tistory.com/guide/api/manage/register" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline font-bold inline-flex items-center gap-1">
                      티스토리 Open API 관리 페이지 <ExternalLink className="w-3.5 h-3.5" />
                    </a>에 접속하여 카카오 계정으로 로그인합니다.
                  </li>
                  <li>
                    <strong>[앱 등록]</strong> 버튼을 누르고 아래 항목을 기입합니다:
                    <div className="mt-1.5 bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1 text-xs">
                      <div>• <strong>서비스 명:</strong> <span className="font-mono">PostSync</span></div>
                      <div>• <strong>서비스 형태:</strong> 웹서비스 (Web)</div>
                      <div>• <strong>서비스 URL:</strong> <span className="font-mono">https://postsyncapp.com</span></div>
                      <div>• <strong>Callback URL:</strong> <span className="font-mono">https://postsyncapp.com/auth/callback</span></div>
                    </div>
                  </li>
                  <li>
                    앱 등록 후 발급된 <strong className="text-orange-600">Access Token</strong>과 본인의 <strong>블로그 이름</strong>(예: <code className="bg-orange-50 text-orange-800 px-1.5 py-0.5 rounded font-mono">myblog</code>)을 확인합니다.
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Tistory Step 2 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black">2</span>
                  <CardTitle className="text-lg text-slate-800">PostSynk [API 설정] 메뉴에 등록하기</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>PostSynk 대시보드의 <strong>[API 설정]</strong> 메뉴 하단 티스토리 연동 폼에 입력합니다:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-1">1. 티스토리 블로그 이름 (Blog Name)</div>
                    <div className="text-slate-600 font-mono">myblog</div>
                    <div className="text-[10px] text-slate-400 mt-1">myblog.tistory.com 의 경우 'myblog'만 입력</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-1">2. Access Token</div>
                    <div className="text-slate-600 font-mono">티스토리에서 발급받은 액세스 토큰 문자열</div>
                    <div className="text-[10px] text-slate-400 mt-1">AES-256 군사등급 암호화 보관</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 text-xs font-bold cursor-pointer">
                      <Key className="w-3.5 h-3.5 mr-1.5" /> 티스토리 API 키 설정하러 가기 &rarr;
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tistory Step 3 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black">3</span>
                  <CardTitle className="text-lg text-slate-800">글 작성 화면에서 [티스토리] 버튼 1클릭 발행</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  글 생성이 완료된 후 하단 액션바의 주황색 <strong className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">[티스토리]</strong> 버튼을 클릭합니다.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">발행 결과:</span>
                    <span className="text-slate-600">발행 성공 알림과 함께 즉시 새 탭으로 내 티스토리 포스팅 주소가 열립니다.</span>
                  </div>
                  <span className="text-orange-600 font-bold hidden sm:inline">✓ 즉시 공개(visibility: 3) 상태로 포스팅 완료</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 탭 4: 전문직 AI 맞춤 설정 & 4대 톤앤매너 */}
      {activeTab === 'ai' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-purple-600 text-white p-2 rounded-lg shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-purple-950 text-base">전문직 특화 AI 맞춤 설정 (RAG 지식베이스 & 4대 톤앤매너)</h3>
              <p className="text-purple-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                단순한 기계식 템플릿 글이 아닌, <strong>대표님의 실제 경험과 승소/상담 철학(1인칭 스토리텔링)</strong>이 녹아든 원고를 작성합니다.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* RAG 지식베이스 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  1. 내 정보 & RAG 지식베이스 (승소/상담 노하우)
                </CardTitle>
                <CardDescription>
                  내 정보 설정 페이지에서 입력한 정보는 AI가 글을 쓸 때 지능적으로 반영됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-600" /> 하단 상담 유도(CTA) & 네이버 지도 자동 연동
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      상호명, 대표 전화번호, 네이버 지도 예약 링크를 등록하면, 모든 글의 최하단에 <strong>[직통 전화 배너]</strong>와 <strong>[📍 네이버 지도 바로가기 버튼]</strong>이 자동 생성됩니다.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> 전문가 철학 & 승소 사례 (RAG 주입)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      '소개 및 전문 지식'란에 대표님의 경력, 주요 승소 사례, 의뢰인을 대하는 철학을 적어두시면 AI가 본문 전개 과정에 자연스럽게 1인칭으로 인용합니다.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <Link href="/dashboard/settings/profile">
                    <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold cursor-pointer">
                      내 정보 & RAG 지식베이스 설정하러 가기 &rarr;
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 4대 톤앤매너 가이드 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800">2. 4대 전문직 톤앤매너(문체) 선택 가이드</CardTitle>
                <CardDescription>주제와 독자의 심리 상태에 맞춰 최적의 문체를 선택하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span>⚖️</span> 신뢰형 전문가 칼럼 (기본 권장)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      법령, 판례, 조세특례 등 객관적 법리 분석 위주의 차분하고 명쾌한 문체. 전문직의 신뢰도와 권위를 극대화할 때 최적입니다.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span>🤝</span> 친절한 1:1 상담사 (초보 의뢰인 맞춤)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      어려운 전문 용어를 쉬운 일상 비유로 풀어주는 따뜻하고 다정한 상담 화법. 처음 문제를 겪는 일반 의뢰인의 불안을 해소할 때 최적입니다.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span>🚨</span> 긴급 리스크 경고형 (골든타임 대응)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      기한 경과 시 불이익, 가산세 폭탄, 절차상 실책을 단호하게 경고하며 즉각적인 행동을 촉구하는 문체. 긴급 구제 사안에 강력합니다.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span>🏆</span> 성공 사례 스토리텔링 (실제 사건 해결)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      절망적인 초기 상황부터 전문가의 묘수로 극적 승소/해결에 이르는 흥미진진한 1인칭 서사. 실제 상담 및 수임 전환율이 가장 높습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 탭 5: 상위 노출 비법 & FAQ */}
      {activeTab === 'seo' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0 mt-0.5">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-950 text-base">네이버 C-Rank & DIA+ 상위 노출 핵심 메커니즘</h3>
              <p className="text-indigo-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                PostSynk의 AI는 네이버 실시간 SERP 역설계와 9종 인포그래픽 시각 카드, 중복 방어 시스템으로 상위 노출 점수를 극대화합니다.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* SERP 역설계 & 9종 카드 */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800">1. 실시간 SERP 역설계 & 9종 인포그래픽 카드 시스템</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-indigo-600" /> 실시간 상위 5개 블로그 분석
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      키워드를 입력하면 네이버 1~5위 상위 블로그의 평균 글자수, 공통 H2 목차 구조, 표/인용구 사용 패턴을 실시간 역설계하여 경쟁사보다 300자 더 풍부한 완성형 원고를 작성합니다.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" /> 1080px 고화질 시각 카드 (DIA+ 만점)
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      저작권 없는 1080px 고화질 시각 카드(체크리스트, Before/After 비교표, 3단계 로드맵, 핵심 수치 요약 등)가 글마다 3~6장 자동 첨부되어 체류시간과 DIA+ 점수를 대폭 향상시킵니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 중복 방지 시스템 & FAQ */}
            <Card className="border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800">2. 자주 묻는 질문 (FAQ)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <HelpCircle className="w-4 h-4 text-indigo-600" /> Q. 동일한 키워드로 여러 번 글을 써도 되나요?
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5">
                      PostSynk에는 <strong>[최근 30일 중복 키워드 방지 시스템]</strong>이 탑재되어 있어, 동일 키워드 작성 시 사전에 경고 알림창을 띄워줍니다. 
                      네이버는 최근 작성한 글과 동일 키워드의 글이 올라오면 유사문서(저품질)로 판정할 수 있으므로, 롱테일 키워드(예: '상속세 감정평가' ➔ '송파 아파트 상속세 감정평가 절세 요건')로 세분화하여 작성하시는 것을 권장합니다.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <HelpCircle className="w-4 h-4 text-indigo-600" /> Q. 모바일 뷰어는 어떻게 활용하나요?
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5">
                      글 생성 후 우측 상단의 <strong>[모바일 뷰]</strong> 버튼을 누르면 스마트폰 실제 화면(380px)으로 전환됩니다. 
                      스마트폰에서 줄바꿈이 어색하지 않은지 확인하고, 에디터 영역을 마우스로 클릭하여 원하는 문장을 직접 가다듬을 수 있습니다.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <HelpCircle className="w-4 h-4 text-indigo-600" /> Q. 글 발행 후 바로 검색에 반영되나요?
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5">
                      네이버 블로그의 경우 보통 발행 후 15분~1시간 이내에 네이버 VIEW/스마트블록 검색 결과에 노출됩니다. 
                      워드프레스나 티스토리는 구글 서치콘솔 및 네이버 서치어드바이저 사이트맵 색인 주기에 따라 반영됩니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 하단 공통 푸터 액션 배너 */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">지금 바로 1위 노출 전문 블로그를 시작해보세요</h3>
          <p className="text-indigo-200 text-xs sm:text-sm">
            타겟 키워드 1개만 입력하면 30초 만에 완벽한 고품질 HTML 원고와 고화질 이미지가 준비됩니다.
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <Link href="/dashboard/settings">
            <Button variant="outline" className="border-indigo-400/40 text-white bg-white/10 hover:bg-white/20 font-bold text-xs cursor-pointer">
              API 설정
            </Button>
          </Link>
          <Link href="/dashboard/write">
            <Button className="bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs shadow-sm cursor-pointer">
              글 작성하러 가기 &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
