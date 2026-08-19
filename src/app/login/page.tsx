'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Loader2, Lock, Mail, UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'
import { validateSignUpInput, isDisposableEmail } from '@/lib/disposableEmailBlocker'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // 이메일 로그인 처리
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.')
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('이메일 인증이 완료되지 않았습니다.')
        } else {
          setErrorMessage(error.message || '로그인 중 오류가 발생했습니다.')
        }
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setErrorMessage('네트워크 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 이메일 신규 회원가입 처리 (어뷰징 방어 탑재)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    // 1. 유효성 및 일회용 이메일 블랙리스트 검사
    const validation = validateSignUpInput(email, password, passwordConfirm)
    if (!validation.isValid) {
      setErrorMessage(validation.error || '입력 정보를 확인해 주세요.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrorMessage('이미 가입된 이메일 주소입니다. [로그인] 탭에서 로그인해 주세요.')
        } else {
          setErrorMessage(error.message || '회원가입 중 오류가 발생했습니다.')
        }
        setLoading(false)
        return
      }

      // 세션이 바로 발급된 경우 (즉시 로그인)
      if (data.session) {
        setSuccessMessage('회원가입이 완료되었습니다! 3회 무료 크레딧이 지급되었습니다.')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      } else {
        // 자동 로그인 시도
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        })

        if (!signInErr) {
          router.push('/dashboard')
          router.refresh()
        } else {
          setSuccessMessage('회원가입이 완료되었습니다! 아래에서 로그인해 주세요.')
          setMode('login')
        }
      }
    } catch (err: any) {
      setErrorMessage('회원가입 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
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
        
        <Link href="/" className="relative z-10 flex items-center gap-2 text-2xl font-black tracking-tighter hover:opacity-90 transition-opacity">
          <span className="bg-indigo-600 text-white p-1.5 rounded-lg"><Sparkles size={22} /></span>
          PostSync
        </Link>

        <div className="relative z-10 space-y-6 max-w-lg mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            신규 가입 시 3회 무료 체험 크레딧 즉시 지급
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            가장 스마트하게<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
              상위 노출을 점령하세요.
            </span>
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            2026년형 네이버 C-Rank 완벽 대응. 전문직 특화 AI가 법률/세무/의료 광고법을 준수하며 1위 상위노출 원고와 인포그래픽을 3초 만에 완성합니다.
          </p>
        </div>

        <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 와이엠랩스 (YM Labs). Empowering Professionals with Advanced AI SEO.
          </p>
        </div>
      </div>

      {/* 우측: 로그인 / 회원가입 폼 영역 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-6 py-8">
          
          {/* Header Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {mode === 'login' ? '로그인' : '무료 회원가입'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {mode === 'login'
                ? '계정에 로그인하여 AI 포스팅을 시작하세요.'
                : '가입 즉시 3회 무료 포스팅 크레딧이 충전됩니다.'}
            </p>
          </div>

          {/* 모드 전환 탭 (로그인 vs 회원가입) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setErrorMessage(null)
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setErrorMessage(null)
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              무료 회원가입 (3회 무료)
            </button>
          </div>

          {/* 에러 / 성공 알림 */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1클릭 소셜 로그인 */}
          <div className="grid gap-2.5">
            <Button 
              type="button"
              variant="outline" 
              className="h-11 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer shadow-2xs"
              onClick={handleGoogleLogin}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google 계정으로 계속하기
            </Button>

            <Button 
              type="button"
              className="h-11 bg-[#FEE500] hover:bg-[#FADA0A] text-[#000000] font-bold text-xs border-none shadow-none cursor-pointer"
              onClick={handleKakaoLogin}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.85 1.83 5.36 4.62 6.8-.2.74-.75 2.76-.78 2.89-.04.16.05.24.16.24.13 0 3.1-2.02 3.63-2.39.75.1 1.54.16 2.37.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
              </svg>
              카카오 계정으로 계속하기
            </Button>
            
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">
                  또는 이메일로 {mode === 'login' ? '로그인' : '가입'}
                </span>
              </div>
            </div>

            {/* 이메일 로그인 / 회원가입 폼 */}
            <form onSubmit={mode === 'login' ? handleEmailLogin : handleEmailSignUp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">이메일 주소</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@naver.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-9 bg-slate-50/70 border-slate-200 focus:bg-white text-xs focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">비밀번호</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === 'signup' ? '최소 6자리 이상 입력' : '비밀번호 입력'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-9 bg-slate-50/70 border-slate-200 focus:bg-white text-xs focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* 회원가입 모드일 때: 비밀번호 확인 */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="passwordConfirm"
                      type="password"
                      placeholder="비밀번호를 한 번 더 입력해 주세요"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="h-11 pl-9 bg-slate-50/70 border-slate-200 focus:bg-white text-xs focus-visible:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className={`w-full h-11 text-white font-extrabold text-xs shadow-md cursor-pointer transition-transform hover:scale-[1.01] ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : mode === 'signup' ? (
                  '🎁 3회 무료 크레딧 받고 시작하기'
                ) : (
                  '이메일로 로그인'
                )}
              </Button>
            </form>
          </div>

          {/* 하단 모드 토글 안내 */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup')
                    setErrorMessage(null)
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer ml-1"
                >
                  무료 회원가입 (3회 무료)
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setErrorMessage(null)
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer ml-1"
                >
                  로그인하기
                </button>
              </p>
            )}
          </div>

          <p className="text-center text-[11px] text-slate-400 pt-2">
            계속 진행함으로써 귀하는 당사의{' '}
            <Link href="/terms" className="underline hover:text-slate-600">
              서비스 약관
            </Link>{' '}
            및{' '}
            <Link href="/privacy" className="underline hover:text-slate-600">
              개인정보 처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
