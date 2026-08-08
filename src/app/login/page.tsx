'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        scopes: 'profile_nickname profile_image',
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen w-full flex bg-white selection:bg-indigo-200">
      {/* 좌측: 브랜딩 및 마케팅 영역 (데스크탑에서만 표시) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2 text-2xl font-black tracking-tighter">
          <span className="bg-indigo-600 text-white p-1 rounded-md"><Sparkles size={24} /></span>
          PostSync
        </div>

        <div className="relative z-10 space-y-6 max-w-lg mt-20">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            가장 스마트하게<br />상위 노출을 점령하세요.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            2026년형 C-Rank 완벽 대응. AI가 실시간 뉴스를 검색하고, 이미지를 그려 단 3초 만에 완벽한 포스팅을 완성합니다.
          </p>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="flex -space-x-4">
            {/* 가상의 유저 프로필 아이콘들 */}
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-200" />
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-pink-200" />
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-200" />
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center bg-slate-800 text-xs font-bold">+2k</div>
          </div>
          <p className="mt-4 text-sm text-slate-400 font-medium">수많은 전문가들이 이미 AI를 통해 매출을 올리고 있습니다.</p>
        </div>
      </div>

      {/* 우측: 로그인 폼 영역 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">환영합니다</h2>
            <p className="text-slate-500">계정에 로그인하여 AI 포스팅을 시작하세요.</p>
          </div>

          <div className="grid gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google 계정으로 계속하기
            </Button>

            <Button 
              className="h-12 bg-[#FEE500] hover:bg-[#FADA0A] text-[#000000] font-semibold border-none shadow-none"
              onClick={handleKakaoLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.85 1.83 5.36 4.62 6.8-.2.74-.75 2.76-.78 2.89-.04.16.05.24.16.24.13 0 3.1-2.02 3.63-2.39.75.1 1.54.16 2.37.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
              </svg>
              카카오 계정으로 계속하기
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">또는 이메일로 로그인</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200">
                {loading ? '로그인 중...' : '이메일로 로그인'}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            계속 진행함으로써 귀하는 당사의 <Link href="#" className="underline underline-offset-4 hover:text-slate-900">서비스 약관</Link> 및 <Link href="#" className="underline underline-offset-4 hover:text-slate-900">개인정보 처리방침</Link>에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
