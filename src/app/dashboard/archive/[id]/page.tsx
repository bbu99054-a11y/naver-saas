import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'
import { CopyToNaverBtn } from '@/components/CopyToNaverBtn'

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

  const htmlContent = article.content_html || ''

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px] h-[calc(100vh-8rem)]">
      
      {/* 렌더링 뷰어 (좌측/메인) */}
      <Card className="flex flex-col h-full border-slate-200 shadow-sm overflow-hidden bg-[#f9f9f9]">
        <CardHeader className="bg-white border-b py-4 px-6 flex-row items-center justify-between shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/archive">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                {article.title}
              </CardTitle>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(article.created_at).toLocaleString('ko-KR')}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                  {article.target_keyword}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* HTML 렌더링 영역 */}
        <CardContent className="p-0 flex-1 overflow-auto">
          {!htmlContent ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              내용이 없습니다.
            </div>
          ) : (
            <div 
              className="p-8 max-w-3xl mx-auto bg-white min-h-full prose prose-slate prose-headings:text-slate-800 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-slate-700 prose-p:text-slate-600"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </CardContent>
      </Card>

      {/* 액션 패널 (우측) */}
      <Card className="flex flex-col h-full border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            발행 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col gap-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <p className="font-bold mb-2">💡 네이버 블로그에 다시 발행하시겠습니까?</p>
            <p className="opacity-90 leading-relaxed">
              아래 <strong>복사 버튼</strong>을 누르면 원고 내용이 클립보드에 복사되며 네이버 블로그 글쓰기 창이 열립니다. (이미지와 서식이 100% 유지됩니다)
            </p>
          </div>

          <div className="mt-auto">
            <CopyToNaverBtn content={htmlContent} />
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
