'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  User, 
  Phone, 
  Receipt, 
  RefreshCw, 
  Loader2, 
  Check, 
  Copy,
  Coins
} from 'lucide-react'
import { approveDeposit, cancelDeposit, getPendingDeposits } from '@/actions/deposit'

interface PendingDeposit {
  id: string
  order_id: string
  amount: number
  plan_type: string
  depositor_name: string | null
  depositor_phone: string | null
  tax_deduction_type: string | null
  tax_deduction_num: string | null
  created_at: string | Date
  status: string
  user: {
    id: string
    email: string
    name: string | null
    credits: number
    plan_type: string
  }
}

interface DepositsAdminClientProps {
  adminEmail: string
  initialDeposits: PendingDeposit[]
}

export default function DepositsAdminClient({
  adminEmail,
  initialDeposits,
}: DepositsAdminClientProps) {
  const [deposits, setDeposits] = useState<PendingDeposit[]>(initialDeposits)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)

  // 최신 목록 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await getPendingDeposits()
      if (res.success && res.data) {
        setDeposits(res.data as any)
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  // 1초 승인 및 크레딧 즉시 지급
  const handleApprove = async (orderId: string, userEmail: string, plan: string) => {
    if (!confirm(`[${userEmail}] 고객님의 입금을 확인하셨습니까?\n확인 즉시 ${plan.toUpperCase()} 플랜 크레딧이 계정으로 충전됩니다.`)) {
      return
    }

    setProcessingId(orderId)
    setActionSuccessMessage(null)

    try {
      const res = await approveDeposit(orderId)
      if (res.success) {
        setActionSuccessMessage(res.message || '승인이 완료되었습니다.')
        // 목록에서 제거
        setDeposits((prev) => prev.filter((d) => d.order_id !== orderId))
      } else {
        alert(res.error || '승인 처리 실패')
      }
    } catch (err: any) {
      alert('오류가 발생했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  // 취소 / 반려
  const handleCancel = async (orderId: string) => {
    const reason = prompt('취소/반려 사유를 입력해 주세요 (예: 미입금, 입금자 불일치):')
    if (reason === null) return

    setProcessingId(orderId)
    try {
      const res = await cancelDeposit(orderId, reason)
      if (res.success) {
        setDeposits((prev) => prev.filter((d) => d.order_id !== orderId))
      } else {
        alert(res.error || '취소 실패')
      }
    } finally {
      setProcessingId(null)
    }
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const totalPendingAmount = deposits.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              👑 CEO 전용 관리자
            </span>
            <span className="text-xs text-slate-400">접속 계정: {adminEmail}</span>
          </div>
          <h1 className="text-2xl font-black mt-2 tracking-tight">무통장 입금 승인 & 크레딧 즉시 지급 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            고객의 입금을 확인한 후 [승인] 버튼을 누르면 즉시 크레딧이 충전되고 결제 완료 처리됩니다.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 font-bold text-xs h-10 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-800">대기 중인 입금 신청</p>
              <p className="text-3xl font-black text-amber-900 mt-1">{deposits.length}건</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500 opacity-70" />
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-800">대기 총 입금액</p>
              <p className="text-3xl font-black text-indigo-900 mt-1">₩{totalPendingAmount.toLocaleString()}</p>
            </div>
            <Coins className="w-8 h-8 text-indigo-500 opacity-70" />
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800">처리 방식</p>
              <p className="text-sm font-extrabold text-emerald-900 mt-1">1클릭 즉시 충전 (0초)</p>
              <p className="text-[11px] text-emerald-700">트랜잭션 안전 보장</p>
            </div>
            <Sparkles className="w-8 h-8 text-emerald-500 opacity-70" />
          </CardContent>
        </Card>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {actionSuccessMessage}
        </div>
      )}

      {/* 대기 목록 테이블 / 카드 */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">실시간 입금 대기 목록</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                입금자명이 통장 내역과 일치하는지 확인 후 [승인]해 주세요.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {deposits.length}건 대기
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {deposits.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">현재 대기 중인 입금 신청이 없습니다.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                새로운 입금 신청이 들어오면 실시간으로 여기에 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {deposits.map((deposit) => {
                const isProcessing = processingId === deposit.order_id
                const planName = deposit.plan_type === 'pro' ? 'Pro (30 크레딧)' : 'Basic (10 크레딧)'
                const dateStr = new Date(deposit.created_at).toLocaleString('ko-KR')

                return (
                  <div
                    key={deposit.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* 좌측: 주문 정보 & 고객 정보 */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-indigo-600 text-white font-bold text-xs">
                          {deposit.plan_type.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-xs text-slate-400">주문번호: {deposit.order_id}</span>
                        <span className="text-[11px] text-slate-400">• {dateStr}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        {/* 1. 입금 금액 & 입금자명 */}
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium">실제 입금자명 (통장표기)</p>
                          <p className="text-base font-black text-slate-900">
                            {deposit.depositor_name || '(미입력)'}
                          </p>
                          <p className="text-xs font-bold text-emerald-600 mt-0.5">
                            ₩{deposit.amount.toLocaleString()}원
                          </p>
                        </div>

                        {/* 2. 신청 고객 계정 */}
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium">신청 계정 (충전 대상)</p>
                          <p className="text-xs font-bold text-slate-800 truncate" title={deposit.user.email}>
                            {deposit.user.email}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {deposit.depositor_phone || '-'}
                          </p>
                        </div>

                        {/* 3. 현금영수증 / 세금계산서 */}
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium">영수증/세금계산서</p>
                          {deposit.tax_deduction_type === 'PERSONAL' && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700">소득공제용</Badge>
                              <span className="text-xs font-mono font-semibold text-slate-700">{deposit.tax_deduction_num}</span>
                              <button
                                onClick={() => handleCopyText(deposit.tax_deduction_num || '', deposit.id)}
                                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                title="번호 복사"
                              >
                                {copiedId === deposit.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          )}
                          {deposit.tax_deduction_type === 'BUSINESS' && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700">지출증빙(사업자)</Badge>
                              <span className="text-xs font-mono font-semibold text-slate-700">{deposit.tax_deduction_num}</span>
                              <button
                                onClick={() => handleCopyText(deposit.tax_deduction_num || '', deposit.id)}
                                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                title="사업자번호 복사"
                              >
                                {copiedId === deposit.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          )}
                          {(!deposit.tax_deduction_type || deposit.tax_deduction_type === 'NONE') && (
                            <p className="text-xs text-slate-400 mt-0.5">미발행 요청</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 우측: 액션 버튼 */}
                    <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                      <Button
                        onClick={() => handleApprove(deposit.order_id, deposit.user.email, deposit.plan_type)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-11 px-5 rounded-xl shadow-md shadow-emerald-200 cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            처리 중...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            입금 확인 & 크레딧 즉시 지급
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleCancel(deposit.order_id)}
                        disabled={isProcessing}
                        variant="outline"
                        className="border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs h-9 font-medium cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        신청 취소
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
