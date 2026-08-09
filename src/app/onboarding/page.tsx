'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Store, MapPin, Phone, Link as LinkIcon, Loader2 } from 'lucide-react'

const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
      alert(`${props.title}\n${props.description}`);
    }
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    store_name: '',
    industry: '',
    address: '',
    phone: '',
    reservation_link: '',
    tone: '친근하고 유머러스한 이웃 느낌'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setErrorMessage('') // Reset error message

    if (!formData.store_name || !formData.industry || !formData.address) {
      setErrorMessage('매장명, 업종, 사무소 상세 주소는 필수 입력 항목입니다.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await saveProfile(formData)
      if (res.success) {
        alert('맞춤형 블로그 세팅이 완료되었습니다!')
        router.push('/dashboard')
      } else {
        throw new Error(res.error)
      }
    } catch (error: any) {
      setErrorMessage(error.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-slate-200 shadow-xl">
        <CardHeader className="bg-indigo-900 text-white rounded-t-xl text-center py-10">
          <CardTitle className="text-3xl font-bold mb-2">전문가님, 환영합니다! 🎉</CardTitle>
          <CardDescription className="text-indigo-200 text-lg mt-2">
            딱 1분만 투자해서 사무소 정보를 입력해 주세요.<br/>
            이후 AI가 이 정보를 바탕으로 완벽한 맞춤형 칼럼을 작성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Store className="w-4 h-4 text-indigo-500" /> 사무소/법인명 (필수)
              </label>
              <Input 
                name="store_name"
                placeholder="예: 법무법인 태평양, 세무회계 서브"
                value={formData.store_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Store className="w-4 h-4 text-indigo-500" /> 전문 직종 (필수)
              </label>
              <Input 
                name="industry"
                placeholder="예: 변호사, 세무사, 노무사, 행정사"
                value={formData.industry}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-1">입력하신 직종에 따라 강제 RAG 도메인이 세팅됩니다.</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-500" /> 사무소 상세 주소 (필수)
              </label>
              <Input 
                name="address"
                placeholder="예: 서울 서초구 서초대로 123 1층"
                value={formData.address}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-1">지역 기반 롱테일 키워드(예: 서초동 이혼 변호사) 추천을 위해 정확히 입력해주세요.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-4 h-4 text-indigo-500" /> 상담 예약 전화번호
              </label>
              <Input 
                name="phone"
                placeholder="예: 02-123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <LinkIcon className="w-4 h-4 text-indigo-500" /> 네이버 예약/지도 링크
              </label>
              <Input 
                name="reservation_link"
                placeholder="https://map.naver.com/..."
                value={formData.reservation_link}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">블로그 기본 톤앤매너 (문체)</label>
              <Select value={formData.tone} onValueChange={(val) => setFormData({...formData, tone: val || ''})}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="문체 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="신뢰감을 주는 객관적이고 전문적인 톤">신뢰감을 주는 전문적인 톤 (추천)</SelectItem>
                  <SelectItem value="친근하고 유머러스한 이웃 느낌">친근하고 다가기 쉬운 톤</SelectItem>
                  <SelectItem value="단호하고 명확하게 사건을 분석하는 톤">단호하고 논리적인 톤</SelectItem>
                  <SelectItem value="의뢰인을 위로하는 감성적이고 따뜻한 톤">따뜻하고 공감하는 톤</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {errorMessage}
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-full h-14 text-lg mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            맞춤형 RAG 설정 완료하기 🚀
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
