'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    store_name: '',
    target_keyword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.store_name.trim() || !formData.target_keyword.trim()) {
      setErrorMessage('상호/사무소명과 주력 관할 키워드는 필수 입력 항목입니다.')
      return
    }

    setIsLoading(true)
    try {
      const res = await saveProfile({
        store_name: formData.store_name.trim(),
        industry: formData.target_keyword.trim(),
        address: `${formData.target_keyword.trim()} 관할 중심`,
      })
      if (res.success) {
        // 즉시 대시보드로 직행
        router.push('/dashboard')
      } else {
        throw new Error(res.error)
      }
    } catch (error: any) {
      setErrorMessage(error.message || '저장 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-slate-200/80 bg-white">
        <CardHeader className="text-center pb-5 border-b border-slate-100">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mx-auto mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> 1초 맞춤형 관제 세팅
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
            전문직 사무소 정보 설정
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            대표님의 사무소명과 주력 키워드 단 2가지만 입력하시면, 네이버 실시간 순위 관제와 AI 글쓰기 엔진이 즉시 자동 세팅됩니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-lg border border-rose-200">
                {errorMessage}
              </div>
            )}

            {/* 1. 상호/사무소명 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>상호 / 사무소명 <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">법률사무소 및 로펌명</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <Input
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  placeholder="예: 법무법인 엘케이에스 (또는 법률사무소 정직)"
                  className="pl-10 h-11 text-sm bg-slate-50/50 focus:bg-white"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* 2. 주력 관할 키워드 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>주력 관할 키워드 <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">지역 + 주력 전문 분야</span>
              </label>
              <Input
                name="target_keyword"
                value={formData.target_keyword}
                onChange={handleChange}
                placeholder="예: 문정역 변호사 (또는 서초동 형사전문변호사)"
                className="h-11 text-sm bg-slate-50/50 focus:bg-white"
                required
              />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                💡 네이버 플레이스 실시간 순위 관제 및 AI 수임 칼럼 생성의 메인 타겟 키워드로 활용됩니다.
              </p>
            </div>

            {/* 안내 팁 박스 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                안심 입력 안내
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ※ 상세 주소, 대표 전화번호, 네이버 지도 예약 링크, RAG 지식베이스(승소 사례)는 가입 후 언제든지 <strong>[내 정보 수정]</strong> 메뉴에서 자유롭게 등록/수정하실 수 있습니다.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  실시간 관제 세팅 중...
                </>
              ) : (
                <>
                  수임 대시보드 바로 시작하기
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
