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
  MessageSquare,
  Receipt, 
  RefreshCw, 
  Loader2, 
  Check, 
  Copy,
  Coins,
  RotateCcw,
  ArrowLeft,
  CircleDollarSign
} from 'lucide-react'
import { approveDeposit, cancelDeposit, getPendingDeposits, getRecentDeposits } from '@/actions/deposit'
import Link from 'next/link'

interface DepositItem {
  id: string
  order_id: string
  amount: number
  plan_type: string
  depositor_name: string | null
  depositor_phone: string | null
  tax_deduction_type: string | null
  tax_deduction_num: string | null
  created_at: string | Date
  completed_at?: string | Date | null
  status: string
  receipt_url?: string | null
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
  initialDeposits: DepositItem[]
}

export default function DepositsAdminClient({
  adminEmail,
  initialDeposits,
}: DepositsAdminClientProps) {
  const [deposits, setDeposits] = useState<DepositItem[]>(initialDeposits)
  const [tabFilter, setTabFilter] = useState<'PENDING' | 'ALL'>('PENDING')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)

  // 최신 목록 새로고침
  const handleRefresh = async (filter = tabFilter) => {
    setIsRefreshing(true)
    setActionSuccessMessage(null)
    try {
      if (filter === 'PENDING') {
        const res = await getPendingDeposits()
        if (res.success && res.data) {
          setDeposits(res.data as any)
        }
      } else {
        const res = await getRecentDeposits('ALL')
        if (res.success && res.data) {
          setDeposits(res.data as any)
        }
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleTabChange = (tab: 'PENDING' | 'ALL') => {
    setTabFilter(tab)
    handleRefresh(tab)
  }

  // 1초 승인 및 크레딧 즉시 지급 (Native window.confirm 적용)
  const handleApprove = async (deposit: DepositItem) => {
    const confirmText = `[입금 승인 확인]\n\n• 입금자명: ${deposit.depositor_name || '(미입력)'}\n• 입금액: ₩${deposit.amount.toLocaleString()}원\n• 충전 계정: ${deposit.user.email}\n\n위 내용으로 입금을 승인하고 크레딧을 즉시 충전하시겠습니까?`
    if (!window.confirm(confirmText)) {
      return
    }

    setProcessingId(deposit.order_id)
    setActionSuccessMessage(null)

    try {
      const res = await approveDeposit(deposit.order_id)
      if (res.success) {
        setActionSuccessMessage(res.message || '승인 및 크레딧 지급이 완료되었습니다.')
        if (tabFilter === 'PENDING') {
          setDeposits((prev) => prev.filter((d) => d.order_id !== deposit.order_id))
        } else {
          setDeposits((prev) =>
            prev.map((d) => (d.order_id === deposit.order_id ? { ...d, status: 'DONE' } : d))
          )
        }
      } else {
        alert(res.error || '승인 처리 실패')
      }
    } catch (err: any) {
      alert('오류가 발생했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  // 취소 / 반려 / 환수 (Native window.confirm 적용)
  const handleCancelOrRevert = async (deposit: DepositItem) => {
    const isAlreadyDone = deposit.status === 'DONE'
    const confirmMsg = isAlreadyDone
      ? `[승인 취소 및 크레딧 환수 경고]\n\n• 대상 계정: ${deposit.user.email}\n• 입금액: ₩${deposit.amount.toLocaleString()}원\n\n이미 승인된 주문입니다. 승인을 취소하고 지급된 크레딧을 즉시 회수(환수)하시겠습니까?`
      : `[입금 신청 취소/반려]\n\n• 입금자명: ${deposit.depositor_name || '(미입력)'}\n\n해당 입금 신청을 취소/반려 처리하시겠습니까?`

    if (!window.confirm(confirmMsg)) {
      return
    }

    setProcessingId(deposit.order_id)
    setActionSuccessMessage(null)

    try {
      const res = await cancelDeposit(deposit.order_id, isAlreadyDone ? '관리자 승인 취소 및 환수' : '관리자 신청 취소')
      if (res.success) {
        setActionSuccessMessage(res.message || '취소/환수 처리가 완료되었습니다.')
        if (tabFilter === 'PENDING') {
          setDeposits((prev) => prev.filter((d) => d.order_id !== deposit.order_id))
        } else {
          setDeposits((prev) =>
            prev.map((d) => (d.order_id === deposit.order_id ? { ...d, status: 'CANCELED' } : d))
          )
        }
      } else {
        alert(res.error || '처리 실패')
      }
    } catch (err: any) {
      alert('오류가 발생했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const pendingDeposits = deposits.filter((d) => d.status === 'PENDING')
  const totalPendingAmount = pendingDeposits.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-5 md:p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin" className="text-slate-400 hover:text-white inline-flex items-center text-xs font-semibold">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              CEO 관제 홈
            </Link>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              👑 CEO 승인 센터
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black mt-2 tracking-tight">무통장 입금 승인 & 크레딧 즉시 지급</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            은행 입금 확인 후 1터치로 즉시 승인 및 크레딧 충전을 완료합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* 탭 필터: 대기건 vs 전체내역 */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-white/10 text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => handleTabChange('PENDING')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                tabFilter === 'PENDING'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              대기 중 ({pendingDeposits.length})
            </button>
            <button
              onClick={() => handleTabChange('ALL')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                tabFilter === 'ALL'
                  ? 'bg-indigo-600 text-white font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              전체 내역
            </button>
          </div>

          <Button
            onClick={() => handleRefresh(tabFilter)}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 font-bold text-xs h-9 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="border-amber-200/80 bg-amber-50/60 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-800">대기 중인 입금 신청</p>
              <p className="text-2xl font-black text-amber-950 mt-1">{pendingDeposits.length}건</p>
            </div>
            <Clock className="w-7 h-7 text-amber-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border-indigo-200/80 bg-indigo-50/60 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-indigo-800">대기 총 입금액</p>
              <p className="text-2xl font-black text-indigo-950 mt-1">₩{totalPendingAmount.toLocaleString()}</p>
            </div>
            <CircleDollarSign className="w-7 h-7 text-indigo-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border-emerald-200/80 bg-emerald-50/60 shadow-2xs col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-800">처리 안전장치</p>
              <p className="text-xs font-black text-emerald-950 mt-1">원자적 DB 트랜잭션</p>
              <p className="text-[10px] text-emerald-700">Native Confirm & 1초 환수</p>
            </div>
            <Sparkles className="w-7 h-7 text-emerald-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {actionSuccessMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📱 모바일 & 데스크톱 반응형 입금 목록 */}
      {/* ========================================================================= */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/80 px-4 md:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                {tabFilter === 'PENDING' ? '실시간 입금 대기 목록' : '전체 입금 내역 (최근 50건)'}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {tabFilter === 'PENDING'
                  ? '입금자명과 금액이 통장 내역과 일치하는지 확인 후 [승인]해 주세요.'
                  : '승인 완료 및 취소된 전체 입금 내역을 관리하고 필요 시 환수합니다.'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {deposits.length}건
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {deposits.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-800">
                {tabFilter === 'PENDING' ? '현재 대기 중인 입금 신청이 없습니다.' : '입금 내역이 없습니다.'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                새로운 입금 신청이 접수되면 실시간으로 여기에 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {deposits.map((deposit) => {
                const isProcessing = processingId === deposit.order_id
                const isPending = deposit.status === 'PENDING'
                const isDone = deposit.status === 'DONE'
                const isCanceled = deposit.status === 'CANCELED'
                const dateStr = new Date(deposit.created_at).toLocaleString('ko-KR', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <div
                    key={deposit.id}
                    className={`p-4 md:p-6 transition-colors ${
                      isPending ? 'bg-amber-50/20 hover:bg-amber-50/40' : isDone ? 'bg-white hover:bg-slate-50/60' : 'bg-slate-50/50 opacity-75'
                    }`}
                  >
                    {/* 상단 뱃지 및 주문번호 */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`font-black text-[11px] ${
                            deposit.plan_type === 'pro'
                              ? 'bg-purple-600 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {deposit.plan_type.toUpperCase()} ({deposit.plan_type === 'pro' ? '30회' : '10회'})
                        </Badge>
                        {isPending && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white animate-pulse">
                            승인 대기
                          </span>
                        )}
                        {isDone && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            승인 완료
                          </span>
                        )}
                        {isCanceled && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            취소/환수됨
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {dateStr} • {deposit.order_id}
                      </span>
                    </div>

                    {/* 핵심 정보: 모바일 최적화 대형 입금자명 & 금액 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs mb-4">
                      {/* 1. 입금자명 & 금액 (대문짝만하게 강조) */}
                      <div className="border-b md:border-b-0 md:border-r border-slate-100 pb-2 md:pb-0 md:pr-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">실제 통장 입금자명</p>
                        <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                          {deposit.depositor_name || '(미입력)'}
                        </p>
                        <p className="text-base md:text-lg font-black text-emerald-600 mt-0.5">
                          ₩{deposit.amount.toLocaleString()}원
                        </p>
                      </div>

                      {/* 2. 신청 고객 계정 & 연락처 */}
                      <div className="border-b md:border-b-0 md:border-r border-slate-100 pb-2 md:pb-0 md:pr-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">충전 대상 회원</p>
                        <p className="text-xs font-bold text-slate-800 truncate mt-1" title={deposit.user.email}>
                          {deposit.user.email}
                        </p>
                        {deposit.depositor_phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-600 font-mono">{deposit.depositor_phone}</span>
                            <a
                              href={`tel:${deposit.depositor_phone}`}
                              className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100 inline-flex items-center"
                            >
                              <Phone className="w-2.5 h-2.5 mr-0.5" /> 통화
                            </a>
                            <a
                              href={`sms:${deposit.depositor_phone}`}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold hover:bg-slate-200 inline-flex items-center"
                            >
                              <MessageSquare className="w-2.5 h-2.5 mr-0.5" /> 문자
                            </a>
                          </div>
                        )}
                      </div>

                      {/* 3. 영수증/세금계산서 정보 */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">증빙 발행 정보</p>
                        {deposit.tax_deduction_type === 'PERSONAL' && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 font-bold">소득공제</Badge>
                            <span className="text-xs font-mono font-bold text-slate-800">{deposit.tax_deduction_num}</span>
                            <button
                              onClick={() => handleCopyText(deposit.tax_deduction_num || '', deposit.id)}
                              className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
                              title="번호 복사"
                            >
                              {copiedId === deposit.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                        {deposit.tax_deduction_type === 'BUSINESS' && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 font-bold">지출증빙(사업자)</Badge>
                            <span className="text-xs font-mono font-bold text-slate-800">{deposit.tax_deduction_num}</span>
                            <button
                              onClick={() => handleCopyText(deposit.tax_deduction_num || '', deposit.id)}
                              className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
                              title="사업자번호 복사"
                            >
                              {copiedId === deposit.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                        {(!deposit.tax_deduction_type || deposit.tax_deduction_type === 'NONE') && (
                          <p className="text-xs text-slate-400 mt-1">미발행 요청</p>
                        )}
                      </div>
                    </div>

                    {/* 액션 버튼 영역 (모바일에서 한 손 터치 편의) */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      {isPending && (
                        <>
                          <Button
                            onClick={() => handleApprove(deposit)}
                            disabled={isProcessing}
                            className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm h-11 px-6 rounded-xl shadow-md shadow-emerald-200 cursor-pointer"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                승인 처리 중...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                입금 확인 & 크레딧 즉시 지급
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={() => handleCancelOrRevert(deposit)}
                            disabled={isProcessing}
                            variant="outline"
                            className="w-full sm:w-auto border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs h-11 px-4 font-bold rounded-xl cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            신청 취소
                          </Button>
                        </>
                      )}

                      {isDone && (
                        <div className="w-full flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            크레딧 지급 완료
                          </span>
                          <Button
                            onClick={() => handleCancelOrRevert(deposit)}
                            disabled={isProcessing}
                            variant="outline"
                            size="sm"
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-8 font-bold cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            승인 취소 (크레딧 환수)
                          </Button>
                        </div>
                      )}

                      {isCanceled && (
                        <div className="w-full text-xs text-slate-400 italic">
                          취소 처리 완료 {deposit.receipt_url && `(${deposit.receipt_url})`}
                        </div>
                      )}
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

