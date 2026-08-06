'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Store, MapPin, Phone, Link as LinkIcon, Loader2 } from 'lucide-react'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
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

  const handleSubmit = () => {
    if (!formData.store_name || !formData.industry || !formData.address) {
      toast({ title: '알림', description: '매장명, 업종, 주소는 필수입니다.', variant: 'destructive' })
      return
    }
    
    startTransition(async () => {
      try {
        const res = await saveProfile(formData)
        if (res.success) {
          toast({ title: '환영합니다!', description: '맞춤형 블로그 세팅이 완료되었습니다.' })
          router.push('/dashboard')
        } else {
          throw new Error(res.error)
        }
      } catch (error: any) {
        toast({ title: '에러', description: error.message, variant: 'destructive' })
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-slate-200 shadow-xl">
        <CardHeader className="bg-indigo-600 text-white rounded-t-xl text-center py-10">
          <CardTitle className="text-3xl font-bold mb-2">사장님, 환영합니다! 🎉</CardTitle>
          <CardDescription className="text-indigo-100 text-lg">
            딱 1분만 투자해서 매장 정보를 입력해 주세요.<br/>
            앞으로 작성될 모든 글에 똑똑한 AI가 매장 맞춤 홍보를 덧붙여 드립니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Store className="w-4 h-4 text-indigo-500" /> 매장 상호명 (필수)
              </label>
              <Input 
                name="store_name"
                placeholder="예: 역삼골 흑돼지"
                value={formData.store_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Store className="w-4 h-4 text-indigo-500" /> 업종 카테고리 (필수)
              </label>
              <Input 
                name="industry"
                placeholder="예: 강남 고기집, 미용실, 인테리어"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-500" /> 매장 상세 주소 (필수)
              </label>
              <Input 
                name="address"
                placeholder="예: 서울 강남구 테헤란로 123 1층"
                value={formData.address}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-1">지역 기반 롱테일 키워드 추천을 위해 정확한 동/구를 입력해주세요.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-4 h-4 text-indigo-500" /> 예약 문의 전화번호
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
                  <SelectItem value="친근하고 유머러스한 이웃 느낌">친근하고 유머러스한 이웃 느낌 (추천)</SelectItem>
                  <SelectItem value="신뢰감을 주는 객관적이고 전문적인 톤">신뢰감을 주는 전문적인 톤</SelectItem>
                  <SelectItem value="감성적이고 따뜻한 일상 에세이 톤">감성적이고 따뜻한 톤</SelectItem>
                  <SelectItem value="내돈내산처럼 솔직담백한 후기 톤">솔직담백한 후기 톤</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isPending}
            className="w-full h-14 text-lg mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            내 블로그 맞춤 설정 완료하기 🚀
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
