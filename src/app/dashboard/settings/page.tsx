import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveApiKeys } from '@/actions/settings'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Globe, FileText, Sparkles, BookOpen, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { user_id: user.id }
  })

  // DB에 암호화되어 저장된 키가 존재하는지 여부만 확인
  const hasWpKey = !!apiKeyRecord?.wp_api_key
  const hasTistoryKey = !!apiKeyRecord?.tistory_access_token

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* 상단 메인 헤더 & 가이드 바로가기 배너 */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-indigo-600" /> 멀티 플랫폼 자동 발행
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">외부 블로그 연동 (API 설정)</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            워드프레스, 티스토리 등 외부 블로그에 클릭 한 번으로 글을 즉시 전송할 수 있도록 연동합니다. <br className="hidden sm:inline" />
            (키와 토큰은 AES-256 군사등급으로 암호화되어 안전하게 보관됩니다.)
          </p>
        </div>
        <Link href="/dashboard/guide" className="shrink-0">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs gap-1.5 cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" />
            <span>전체 사용 가이드 보기</span>
          </Button>
        </Link>
      </div>

      {/* 🟢 네이버 블로그 AI 다이렉트 엔진 연동 카드 */}
      <Card className="border-emerald-200/80 bg-emerald-50/40 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#03C75A]" />
        <CardHeader className="pb-2.5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="w-3 h-3 rounded-full bg-[#03C75A]" />
              네이버 블로그 (PostSynk AI 다이렉트 엔진)
            </CardTitle>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✓ 원클릭 자동 발행 (API 키 불필요)
            </span>
          </div>
          <CardDescription className="text-xs text-slate-600">
            네이버 계정 저품질과 비정상 로그인을 100% 방지하기 위해, 내 컴퓨터에서 안전하게 가동되는 <strong>초경량 공식 보안 다이렉트 엔진</strong>을 제공합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          <div className="bg-white/80 border border-emerald-200/60 rounded-xl p-3 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#03C75A]" />
              1초 엔진 세팅 방법:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
              <li>아래 <strong>[다이렉트 엔진 다운로드]</strong> 버튼을 클릭하여 ZIP 파일을 받습니다.</li>
              <li>압축 해제 후 <code>register-startup.bat</code>을 1회 실행하면 화면에 창 없이 백그라운드 무음 대기합니다.</li>
              <li>글 작성 화면에서 <strong>[🚀 네이버 원클릭 자동 발행]</strong>을 누르시면 10초 만에 내 블로그에 글과 사진이 쏙 들어갑니다!</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <a
              href="/api/download/direct-engine"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-9 px-4 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>📥 PostSynk 다이렉트 엔진 1초 다운로드 (.zip)</span>
            </a>
            <Link href="/dashboard/guide" className="text-xs text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1 hover:underline">
              원클릭 자동 발행 전체 가이드 보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 🔵 워드프레스 (WordPress) 연동 카드 */}
      <Card className="border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Globe className="w-5 h-5 text-blue-600" />
              워드프레스 (WordPress) 연동
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasWpKey ? (
                <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" /> 연동 완료
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                  미연동
                </span>
              )}
              <Link href="/dashboard/guide" className="text-xs text-blue-600 hover:underline font-bold hidden sm:inline">
                📖 발급 가이드 &rarr;
              </Link>
            </div>
          </div>
          <CardDescription className="text-xs text-slate-600">
            워드프레스 관리자(wp-admin) ➔ 사용자 ➔ 프로필 하단의 'Application Passwords'를 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasWpKey && (
            <div className="p-3 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-between text-xs font-medium border border-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>워드프레스 연동 정보가 등록되어 있습니다. (글 작성 화면에서 [워드프레스] 버튼으로 즉시 발행 가능)</span>
              </div>
            </div>
          )}
          <form action={async (formData) => { 'use server'; await saveApiKeys(formData); }} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">워드프레스 사이트 주소 (URL)</label>
              <Input name="wpUrl" placeholder="예: https://myblog.com" defaultValue={apiKeyRecord?.wp_url || ''} className="h-9 text-xs focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">워드프레스 사용자명 (Username)</label>
              <Input name="wpUsername" placeholder="예: admin (워드프레스 로그인 아이디)" defaultValue={apiKeyRecord?.wp_username || ''} className="h-9 text-xs focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Application Password (24자리 앱 비밀번호)</label>
                <Link href="/dashboard/guide" className="text-[11px] text-blue-600 hover:underline">비밀번호 발급법 보기</Link>
              </div>
              <Input name="wpApiKey" type="password" placeholder="4자리씩 띄어진 24자리 비밀번호 (예: xxxx xxxx xxxx xxxx)" className="h-9 text-xs focus-visible:ring-blue-500 font-mono" />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 cursor-pointer shadow-xs">
              {hasWpKey ? '워드프레스 연동 정보 업데이트' : '워드프레스 연동 저장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 🟠 티스토리 (Tistory) 연동 카드 */}
      <Card className="border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FileText className="w-5 h-5 text-orange-500" />
              티스토리 (Tistory) 연동
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasTistoryKey ? (
                <span className="bg-orange-100 text-orange-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-orange-600" /> 연동 완료
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                  미연동
                </span>
              )}
              <Link href="/dashboard/guide" className="text-xs text-orange-600 hover:underline font-bold hidden sm:inline">
                📖 발급 가이드 &rarr;
              </Link>
            </div>
          </div>
          <CardDescription className="text-xs text-slate-600">
            티스토리 OpenAPI 가이드에 따라 발급받은 Access Token과 블로그 이름을 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasTistoryKey && (
            <div className="p-3 bg-orange-50 text-orange-900 rounded-lg flex items-center justify-between text-xs font-medium border border-orange-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>티스토리 토큰이 등록되어 있습니다. (글 작성 화면에서 [티스토리] 버튼으로 즉시 발행 가능)</span>
              </div>
            </div>
          )}
          <form action={async (formData) => { 'use server'; await saveApiKeys(formData); }} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">티스토리 블로그 이름 (Blog Name)</label>
              <Input name="tistoryBlogName" placeholder="예: myblog (myblog.tistory.com 의 경우 'myblog'만 입력)" defaultValue={apiKeyRecord?.tistory_blog_name || ''} className="h-9 text-xs focus-visible:ring-orange-500" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Access Token (액세스 토큰)</label>
                <Link href="/dashboard/guide" className="text-[11px] text-orange-600 hover:underline">토큰 발급법 보기</Link>
              </div>
              <Input name="tistoryAccessToken" type="password" placeholder="티스토리 OpenAPI에서 발급받은 Access Token 문자열" className="h-9 text-xs focus-visible:ring-orange-500 font-mono" />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-9 cursor-pointer shadow-xs">
              {hasTistoryKey ? '티스토리 연동 정보 업데이트' : '티스토리 연동 저장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
    </div>
  )
}
