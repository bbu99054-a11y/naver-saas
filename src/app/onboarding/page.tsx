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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-xl shadow-xl border-slate-100">
        <CardHeader className="text-center pb-6 border-b border-slate-50">
          <CardTitle className="text-2xl font-bold text-slate-800">
            전문가 프로필 맞춤 설정
          </CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            블로그 하단에 노출될 사무소 정보와 전문 분야를 입력해 주세요. (추후 수정 가능)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Store className="w-4 h-4 text-indigo-500" /> 상호 / 사무소명 *
              </label>
              <Input 
                name="store_name"
                placeholder="예: 법무법인 혜안 / 세무회계 정" 
                value={formData.store_name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                🏢 전문 업종 *
              </label>
              <Input 
                name="industry"
                placeholder="예: 이혼전문변호사, 상속전문세무사" 
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-500" /> 사무소 상세 주소 *
              </label>
              <Input 
                name="address"
                placeholder="예: 서울 서초구 서초대로 123, 4층" 
                value={formData.address}
                onChange={handleChange}
              />
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
          </div>

          {errorMessage && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {errorMessage}
            </div>
          )}

          <button 
            type="button"
            onClick={handleSubmit} 
            disabled={isLoading}
            className={`w-full h-14 text-lg mt-8 text-white rounded-xl shadow-lg transition-all flex items-center justify-center font-bold ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            맞춤형 RAG 설정 완료하기 🚀
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
