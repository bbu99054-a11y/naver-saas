import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Clock, Search } from 'lucide-react'

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 최신 생성순으로 아티클 조회
  const articles = await prisma.article.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-indigo-500" />
          나의 원고 저장소
        </h2>
        <p className="text-slate-500 mt-2">
          지금까지 AI가 작성해준 모든 블로그 포스팅이 이곳에 영구 보관됩니다. 언제든 다시 열어보고 발행하세요.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">전체 원고 리스트</CardTitle>
              <CardDescription>총 {articles.length}개의 원고가 저장되어 있습니다.</CardDescription>
            </div>
            {/* 검색창(UI만 구현) */}
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="타겟 키워드 검색..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {articles.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p>아직 저장된 원고가 없습니다.</p>
              <Link href="/dashboard/write">
                <Button variant="link" className="text-indigo-600 mt-2">첫 글 작성하러 가기</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">타겟 키워드</th>
                    <th className="px-6 py-4 font-semibold">제목</th>
                    <th className="px-6 py-4 font-semibold">생성 일자</th>
                    <th className="px-6 py-4 font-semibold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((article) => (
                    <tr key={article.id} className="bg-white hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-indigo-700 whitespace-nowrap">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs border border-indigo-100">
                          {article.target_keyword}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium truncate max-w-xs">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(article.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link href={`/dashboard/archive/${article.id}`}>
                          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-indigo-600 hover:border-indigo-200">
                            <Eye className="w-4 h-4 mr-2" /> 보기 및 복사
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
