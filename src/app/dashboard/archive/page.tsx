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

      <Card className="border-slate-200 shadow-xs overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/70 border-b py-3 px-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">전체 원고 리스트</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">총 {articles.length}개의 원고가 저장되어 있습니다.</CardDescription>
            </div>
            {/* 검색창 */}
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="키워드 또는 제목 검색..." 
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {articles.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium">아직 저장된 원고가 없습니다.</p>
              <Link href="/dashboard/write">
                <Button variant="link" className="text-indigo-600 font-bold text-xs mt-1">첫 글 작성하러 가기 →</Button>
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full table-fixed text-xs text-left">
                <thead className="text-[11px] font-bold text-slate-600 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="w-[22%] px-4 py-3">타겟 키워드</th>
                    <th className="w-[44%] px-4 py-3">원고 제목</th>
                    <th className="w-[18%] px-4 py-3">생성 일자</th>
                    <th className="w-[16%] px-4 py-3 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((article) => (
                    <tr key={article.id} className="bg-white hover:bg-slate-50/80 transition-colors">
                      {/* 타겟 키워드 */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="truncate">
                          <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-100/80 truncate max-w-full">
                            {article.target_keyword}
                          </span>
                        </div>
                      </td>

                      {/* 제목 */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-bold text-slate-800 line-clamp-1 hover:text-indigo-600 transition-colors">
                          <Link href={`/dashboard/archive/${article.id}`} title={article.title}>
                            {article.title}
                          </Link>
                        </div>
                      </td>

                      {/* 생성 일자 */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium truncate">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {new Date(article.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* 관리 버튼 */}
                      <td className="px-4 py-3.5 text-right align-middle">
                        <div className="flex justify-end">
                          <Link href={`/dashboard/archive/${article.id}`}>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-7.5 px-2.5 shadow-2xs">
                              <Eye className="w-3.5 h-3.5 mr-1" /> 보기 및 복사
                            </Button>
                          </Link>
                        </div>
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
