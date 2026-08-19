'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Receipt, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { createDepositRequest } from '@/actions/deposit'

interface CheckoutFormProps {
  userEmail: string
  userName: string
  plan: 'basic' | 'pro'
  amount: number
  bankInfo: {
    bankName: string
    accountNumber: string
    holder: string
  }
}

export default function CheckoutForm({
  userEmail,
  userName,
  plan,
  amount,
  bankInfo,
}: CheckoutFormProps) {
  const router = useRouter()

  // Form States
  const [depositorName, setDepositorName] = useState(userName || '')
  const [depositorPhone, setDepositorPhone] = useState('')
  const [taxType, setTaxType] = useState<'NONE' | 'PERSONAL' | 'BUSINESS'>('PERSONAL')
  const [taxNum, setTaxNum] = useState('')

  // UI States
  const [isCopied, setIsCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submittedData, setSubmittedData] = useState<{
    orderId: string
    amount: number
    depositorName: string
  } | null>(null)

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`${bankInfo.bankName} ${bankInfo.accountNumber}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!depositorName.trim()) {
      setErrorMessage('입금자명을 입력해 주세요.')
      return
    }

    if (!depositorPhone.trim()) {
      setErrorMessage('입금 확인 및 알림을 위해 연락처(휴대폰 번호)를 입력해 주세요.')
      return
    }

    if (taxType !== 'NONE' && !taxNum.trim()) {
      setErrorMessage(
        taxType === 'PERSONAL'
          ? '현금영수증 발행을 위한 휴대폰 번호를 입력해 주세요.'
          : '세금계산서 발행을 위한 사업자등록번호를 입력해 주세요.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createDepositRequest({
        plan,
        amount,
        depositorName,
        depositorPhone,
        taxDeductionType: taxType,
        taxDeductionNum: taxNum,
      })

      if (res.success && res.orderId) {
        setSubmittedData({
          orderId: res.orderId,
          amount: res.amount || amount,
          depositorName: res.depositorName || depositorName,
        })
      } else {
        setErrorMessage(res.error || '입금 신청 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      setErrorMessage('네트워크 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // =========================================================================
  // 🎉 신청 완료 화면 (Success View)
  // =========================================================================
  if (submittedData) {
    return (
      <div className="space-y-6">
        <Card className="border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-xl">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-extrabold">무통장 입금 신청이 접수되었습니다!</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              주문번호: <span className="font-mono text-indigo-400 font-bold">{submittedData.orderId}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6">
            {/* 입금 안내 박스 */}
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">입금하실 계좌 정보</h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-lg border border-white/5">
                <div>
                  <p className="text-xs text-indigo-300 font-semibold">{bankInfo.bankName}</p>
                  <p className="text-lg font-extrabold text-white font-mono">{bankInfo.accountNumber}</p>
                  <p className="text-xs text-slate-400">예금주: {bankInfo.holder}</p>
                </div>
                <Button
                  onClick={handleCopyAccount}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 mr-1 text-emerald-300" /> : <Copy className="w-4 h-4 mr-1" />}
                  {isCopied ? '계좌 복사완료' : '계좌번호 복사'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-slate-300">
                <div>• <strong>입금자명:</strong> <span className="text-white font-bold">{submittedData.depositorName}</span></div>
                <div>• <strong>입금하실 금액:</strong> <span className="text-emerald-400 font-bold">{submittedData.amount.toLocaleString()}원</span></div>
              </div>
            </div>

            {/* 승인 안내 알림 */}
            <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200 leading-relaxed">
                <strong>실시간 자동 승인 대기 중:</strong> 대표님 계좌로 입금해 주시면 확인 즉시 계정으로 <strong className="text-white font-bold">{plan === 'pro' ? '30 크레딧' : '10 크레딧'}</strong>이 자동 충전됩니다. (보통 5~10분 이내 완료)
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl cursor-pointer"
            >
              대시보드로 이동하기
            </Button>
            <Button
              onClick={() => router.push('/dashboard/billing')}
              variant="outline"
              className="w-full border-white/20 text-slate-300 hover:bg-white/5 h-12 rounded-xl cursor-pointer"
            >
              결제 내역 확인
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // =========================================================================
  // 📝 입금 신청 폼 화면 (Checkout Form View)
  // =========================================================================
  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-slate-600 hover:text-slate-900 -ml-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> 요금제 선택으로 돌아가기
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">무통장 입금 신청</h1>
          <p className="text-sm text-slate-500">실시간 계좌이체로 안전하게 크레딧을 충전하세요.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          세금계산서 100% 발행
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* 좌측: 입금 계좌 안내 및 요금제 요약 (2칸) */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-indigo-300">
                  선택한 플랜
                </span>
                <span className="text-xs text-indigo-200">
                  {plan === 'pro' ? '월 30회 포스팅' : '월 10회 포스팅'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  PostSync {plan.toUpperCase()} 플랜
                </h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-emerald-400">
                    ₩{amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-300">/ 원</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1.5">
                <p className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <strong>{plan === 'pro' ? '30 크레딧' : '10 크레딧'}</strong> 즉시 지급
                </p>
                <p>• 네이버 C-Rank / DIA+ 최적화 원고 생성</p>
                <p>• 1080px 실사 인포그래픽 카드 자동 생성</p>
                {plan === 'pro' && <p>• 워드프레스/티스토리 동시 발행 지원</p>}
              </div>
            </div>
          </Card>

          {/* 계좌 안내 카드 */}
          <Card className="border-indigo-100 bg-indigo-50/50 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                와이엠랩스 공식 입금 계좌
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                <p className="text-xs font-semibold text-slate-500">{bankInfo.bankName}</p>
                <p className="text-base font-black text-slate-900 font-mono tracking-tight">{bankInfo.accountNumber}</p>
                <p className="text-xs text-slate-600">예금주: {bankInfo.holder}</p>
              </div>
              <Button
                type="button"
                onClick={handleCopyAccount}
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {isCopied ? '계좌 복사되었습니다!' : '계좌번호 복사하기'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 입금자 정보 입력 폼 (3칸) */}
        <div className="md:col-span-3">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">입금자 정보 입력</CardTitle>
              <CardDescription className="text-xs">
                정확한 입금 확인 및 크레딧 자동 충전을 위해 정보를 입력해 주세요.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-lg font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* 입금자명 */}
                <div className="space-y-1.5">
                  <Label htmlFor="depositorName" className="text-xs font-bold text-slate-700">
                    실제 입금자명 <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="depositorName"
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="예: 홍길동 또는 와이엠랩스"
                    className="h-10 text-sm focus-visible:ring-indigo-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    * 은행 이체 시 통장에 찍히는 이름을 정확히 입력해 주세요.
                  </p>
                </div>

                {/* 연락처 */}
                <div className="space-y-1.5">
                  <Label htmlFor="depositorPhone" className="text-xs font-bold text-slate-700">
                    연락처 (휴대폰 번호) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="depositorPhone"
                    type="tel"
                    value={depositorPhone}
                    onChange={(e) => setDepositorPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="h-10 text-sm focus-visible:ring-indigo-500"
                    required
                  />
                </div>

                {/* 세금계산서 / 현금영수증 선택 */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                    현금영수증 / 세금계산서 발행 신청
                  </Label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaxType('PERSONAL')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                        taxType === 'PERSONAL'
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      소득공제 (개인)
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxType('BUSINESS')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                        taxType === 'BUSINESS'
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      지출증빙 (사업자)
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxType('NONE')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                        taxType === 'NONE'
                          ? 'border-slate-800 bg-slate-100 text-slate-900 font-bold ring-1 ring-slate-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      미발행
                    </button>
                  </div>

                  {taxType !== 'NONE' && (
                    <div className="pt-1">
                      <Input
                        value={taxNum}
                        onChange={(e) => setTaxNum(e.target.value)}
                        placeholder={
                          taxType === 'PERSONAL'
                            ? '현금영수증용 휴대폰번호 (010-XXXX-XXXX)'
                            : '세금계산서용 사업자등록번호 (10자리)'
                        }
                        className="h-9 text-xs focus-visible:ring-indigo-500 bg-slate-50/50"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        입금 신청 접수 중...
                      </>
                    ) : (
                      `₩${amount.toLocaleString()}원 무통장 입금 신청 완료하기`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
