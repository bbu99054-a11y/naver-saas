'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Loader2, Link as LinkIcon, PenSquare } from 'lucide-react'
import Link from 'next/link'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

interface KeywordData {
  relKeyword: string;
  monthlyPcQcCnt: number | string;
  monthlyMobileQcCnt: number | string;
  monthlyAvePcClkCnt: number | string;
  monthlyAveMobileClkCnt: number | string;
  compIdx: string;
}

export default function ResearchPage() {
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<KeywordData[]>([])
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/naver-keyword?keyword=${encodeURIComponent(keyword)}`)
      const json = await res.json()

      if (!res.ok) {
        toast({
          title: '검색 실패',
          description: json.error || '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive'
        })
        return
      }

      setResults(json.data || [])
      toast({
        title: '검색 완료',
        description: `${json.data?.length || 0}개의 연관 키워드를 찾았습니다.`
      })
    } catch (error) {
      toast({
        title: '네트워크 오류',
        description: '서버와 통신하는 중 문제가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">키워드 리서치</h2>
          <p className="text-muted-foreground mt-2">
            네이버 검색광고 데이터를 기반으로 타겟 키워드의 월간 검색량과 경쟁도를 분석합니다.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>검색어 입력</CardTitle>
          <CardDescription>메인으로 잡고 싶은 핵심 키워드를 입력해 보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="예: 강남 세무사, 이혼 변호사, 상속세 절세" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={isLoading || !keyword} className="bg-indigo-600 hover:bg-indigo-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              데이터 조회
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>연관 키워드 분석 결과</CardTitle>
            <CardDescription>검색량이 많고 경쟁이 적은 '황금 키워드'를 발굴해 보세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>연관 키워드</TableHead>
                    <TableHead className="text-right">PC 검색수</TableHead>
                    <TableHead className="text-right">모바일 검색수</TableHead>
                    <TableHead className="text-right">총 클릭수</TableHead>
                    <TableHead className="text-center">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.slice(0, 50).map((item, i) => {
                    const parseCount = (val: number | string | undefined) => {
                      if (typeof val === 'number') return val;
                      if (typeof val === 'string' && val.includes('<')) return 0;
                      return Number(val) || 0;
                    };

                    const pcClick = parseCount(item.monthlyAvePcClkCnt);
                    const moClick = parseCount(item.monthlyAveMobileClkCnt);
                    const totalClicks = pcClick + moClick;

                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.relKeyword}</TableCell>
                        <TableCell className="text-right text-slate-600">{item.monthlyPcQcCnt}</TableCell>
                        <TableCell className="text-right text-slate-600">{item.monthlyMobileQcCnt}</TableCell>
                        <TableCell className="text-right text-slate-600">{totalClicks.toFixed(1)}</TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/write?keyword=${encodeURIComponent(item.relKeyword)}`}>
                            <Button variant="outline" size="sm" className="h-8">
                              <PenSquare className="w-3.5 h-3.5 mr-1" />
                              이 키워드로 글쓰기
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
