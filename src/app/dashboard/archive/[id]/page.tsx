import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'
import { CopyToNaverBtn } from '@/components/CopyToNaverBtn'
import { NaverAutoPublishBtn } from '@/components/NaverAutoPublishBtn'
import { MultiPublishBtn } from '@/components/MultiPublishBtn'
import { stripInternalMetadata } from '@/lib/utils/postSanitizer'

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  
  const article = await prisma.article.findUnique({
    where: { id, user_id: user.id }
  })

  if (!article) {
    redirect('/dashboard/archive')
  }

  const htmlContent = stripInternalMetadata(article.content_html || '')

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] h-[calc(100vh-6.5rem)] max-h-[calc(100vh-6.5rem)] overflow-hidden">
      
      {/* 렌더링 뷰어 (좌측/메인) */}
      <Card className="flex flex-col h-full border-slate-200 shadow-xs overflow-hidden bg-slate-50 min-w-0">
        <CardHeader className="bg-white border-b py-2.5 px-4 flex-row items-center justify-between shadow-2xs z-10 sticky top-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard/archive">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full shrink-0">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </Button>
            </Link>
            <div className="min-w-0">
              <CardTitle className="text-sm font-bold text-slate-800 truncate">
                {article.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(article.created_at).toLocaleString('ko-KR')}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 text-[11px] font-semibold">
                  {article.target_keyword}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* HTML 렌더링 영역 */}
        <CardContent className="p-0 flex-1 overflow-auto bg-slate-100/50">
          {!htmlContent ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              내용이 없습니다.
            </div>
          ) : (
            <div className="py-4 px-4 flex justify-center">
              <div 
                id="editor-preview"
                className="p-8 max-w-3xl w-full bg-white min-h-[600px] shadow-2xs rounded-lg border border-slate-200 prose prose-slate prose-headings:text-slate-800 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-slate-700 prose-p:text-slate-600 prose-p:leading-[1.85]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 액션 패널 (우측) */}
      <Card className="w-full lg:w-[340px] xl:w-[360px] shrink-0 flex flex-col h-full border-slate-200 shadow-xs bg-white">
        <CardHeader className="bg-slate-50/70 border-b py-2.5 px-4">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
            발행 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col gap-4 justify-between">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-950 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1">💡 네이버 블로그에 다시 발행하시겠습니까?</p>
            <p className="opacity-90">
              아래 <strong>원클릭 자동 발행</strong> 버튼을 누르면 AI 다이렉트 엔진이 네이버 스마트에디터에 고화질 사진과 서식을 100% 무손실로 자동 작성해 드립니다.
            </p>
          </div>

          <div className="space-y-2 mt-auto">
            <NaverAutoPublishBtn
              title={article.title}
              content={htmlContent}
              tags={[article.target_keyword]}
              className="w-full h-9.5 text-xs font-bold shadow-md"
            />
            {/* 수동 복사 버튼 (임시 비노출 보존)
            <CopyToNaverBtn content={htmlContent} className="w-full h-9 text-xs" />
            */}
            <MultiPublishBtn articleId={article.id} />
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
