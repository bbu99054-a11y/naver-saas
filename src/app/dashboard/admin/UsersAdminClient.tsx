'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  PenTool, 
  Coins, 
  Clock, 
  Gift, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  FileText, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { getAdminOverviewStats, getAdminUsersList, adjustUserCredits } from '@/actions/admin'
import Link from 'next/link'

interface UserItem {
  id: string
  email: string
  name: string | null
  plan_type: string
  credits: number
  created_at: string | Date
  profile: {
    store_name: string | null
    industry: string | null
    phone: string | null
  } | null
  _count: {
    articles: number
  }
}

interface StatsData {
  totalUsers: number
  todayNewUsers: number
  freeUsersCount: number
  basicUsersCount: number
  proUsersCount: number
  totalArticles: number
  freeArticles: number
  paidArticles: number
  totalRevenue: number
  pendingDepositsCount: number
  topKeywords: { keyword: string; count: number }[]
}

interface UsersAdminClientProps {
  adminEmail: string
  initialStats: StatsData
  initialUsers: UserItem[]
  initialTotalCount: number
  initialTotalPages: number
}

export default function UsersAdminClient({
  adminEmail,
  initialStats,
  initialUsers,
  initialTotalCount,
  initialTotalPages,
}: UsersAdminClientProps) {
  const [stats, setStats] = useState<StatsData>(initialStats)
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [currentPage, setCurrentPage] = useState(1)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('ALL')
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Credit Gift Modal State
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [giftAmount, setGiftAmount] = useState<number>(3)
  const [selectedPlanChange, setSelectedPlanChange] = useState<string>('')
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  // Fetch Users with Search/Filter/Page
  const fetchUsers = async (page = 1, search = searchQuery, plan = planFilter) => {
    setIsLoadingList(true)
    try {
      const res = await getAdminUsersList({
        page,
        pageSize: 15,
        search,
        planFilter: plan,
      })
      if (res.success) {
        setUsers(res.users as any)
        setTotalCount(res.totalCount ?? 0)
        setTotalPages(res.totalPages ?? 1)
        setCurrentPage(res.currentPage ?? 1)
      }
    } finally {
      setIsLoadingList(false)
    }
  }

  // Refresh all stats and users
  const handleRefreshAll = async () => {
    setIsRefreshing(true)
    try {
      const [statsRes, usersRes] = await Promise.all([
        getAdminOverviewStats(),
        getAdminUsersList({ page: 1, pageSize: 15, search: searchQuery, planFilter }),
      ])
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats)
      }
      if (usersRes.success) {
        setUsers(usersRes.users as any)
        setTotalCount(usersRes.totalCount ?? 0)
        setTotalPages(usersRes.totalPages ?? 1)
        setCurrentPage(1)
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, searchQuery, planFilter)
  }

  const handlePlanFilterChange = (plan: string) => {
    setPlanFilter(plan)
    fetchUsers(1, searchQuery, plan)
  }

  // Handle Credit Adjustment Submit
  const handleCreditSubmit = async () => {
    if (!selectedUser) return
    setIsAdjusting(true)
    setActionNotice(null)

    try {
      const res = await adjustUserCredits({
        userId: selectedUser.id,
        addedCredits: giftAmount,
        newPlanType: selectedPlanChange || undefined,
      })

      if (res.success) {
        setActionNotice(res.message || '크레딧 지급이 완료되었습니다.')
        // Update local user in table
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  credits: (res as any).currentCredits ?? u.credits + giftAmount,
                  plan_type: selectedPlanChange || u.plan_type,
                }
              : u
          )
        )
        setTimeout(() => setSelectedUser(null), 1200)
      } else {
        alert(res.error || '처리 중 오류가 발생했습니다.')
      }
    } catch (err) {
      alert('오류가 발생했습니다.')
    } finally {
      setIsAdjusting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              👑 CEO Control Tower
            </span>
            <span className="text-xs text-slate-400">최고 관리자: {adminEmail}</span>
          </div>
          <h1 className="text-2xl font-black mt-2 tracking-tight">PostSync 비즈니스 통합 관제 대시보드</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            가입 회원 현황, 무료/유료 원고 생성 통계 및 크레딧 조정을 실시간으로 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/deposits">
            <Button
              variant="outline"
              size="sm"
              className="bg-indigo-600/30 border-indigo-500/40 text-indigo-200 hover:bg-indigo-600 hover:text-white font-bold text-xs h-10 cursor-pointer"
            >
              <Coins className="w-4 h-4 mr-1.5 text-amber-400" />
              입금 승인 관리
              {stats.pendingDepositsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black animate-pulse">
                  {stats.pendingDepositsCount}
                </span>
              )}
            </Button>
          </Link>
          <Button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 font-bold text-xs h-10 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📊 4대 핵심 비즈니스 KPI 요약 카드 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 총 회원 수 */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">총 가입 회원 수</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{stats.totalUsers.toLocaleString()}명</span>
              {stats.todayNewUsers > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  오늘 +{stats.todayNewUsers}명
                </span>
              )}
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex gap-2">
              <span>무료 {stats.freeUsersCount}</span>•
              <span className="text-indigo-600 font-semibold">유료 {stats.basicUsersCount + stats.proUsersCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. AI 원고 생성 횟수 (무료 vs 유료) */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">총 AI 원고 생성</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <PenTool className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900">{stats.totalArticles.toLocaleString()}편</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>무료 유저: <strong>{stats.freeArticles}편</strong></span>
              <span className="text-indigo-600 font-bold">유료 유저: {stats.paidArticles}편</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. 누적 입금 매출액 */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">누적 입금 매출</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-600">₩{stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              유료 플랜 가입자: <strong className="text-slate-700">{stats.basicUsersCount + stats.proUsersCount}명</strong>
            </div>
          </CardContent>
        </Card>

        {/* 4. 입금 대기 알림 */}
        <Card className={`border-slate-200 shadow-xs ${stats.pendingDepositsCount > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white'}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">대기 중인 입금 신청</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{stats.pendingDepositsCount}건</span>
              {stats.pendingDepositsCount > 0 && (
                <Link href="/dashboard/admin/deposits">
                  <span className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center">
                    바로 승인하기 <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </Link>
              )}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {stats.pendingDepositsCount > 0 ? '대표님 승인 대기 중인 주문이 있습니다.' : '모든 입금 처리가 완료되었습니다.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 🔥 실시간 인기 생성 키워드 TOP 6 */}
      {/* ========================================================================= */}
      {stats.topKeywords && stats.topKeywords.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900/5 via-indigo-900/10 to-violet-900/5 p-4 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-500" />
            고객들이 최근 가장 많이 생성한 키워드:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {stats.topKeywords.map((item, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-white border border-indigo-200 text-indigo-900 text-xs font-semibold py-1 px-2.5 shadow-2xs"
              >
                #{item.keyword} <span className="ml-1.5 text-[10px] text-indigo-500 font-bold">{item.count}회</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👥 회원 관리 CRM & 원고 생성 상세 테이블 */}
      {/* ========================================================================= */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                전체 가입 회원 목록 & 이용 현황 ({totalCount.toLocaleString()}명)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                각 회원의 무료/유료 원고 생성 횟수를 확인하고 보너스 크레딧을 즉석 충전할 수 있습니다.
              </CardDescription>
            </div>

            {/* 플랜 필터 탭 */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              {['ALL', 'FREE', 'BASIC', 'PRO'].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handlePlanFilterChange(plan)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    planFilter === plan
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {plan === 'ALL' ? '전체' : plan}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 바 */}
          <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="회원 이메일 또는 이름으로 검색..."
                className="pl-9 h-9 text-xs bg-white focus-visible:ring-indigo-500"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
              검색
            </Button>
          </form>
        </CardHeader>

        <CardContent className="p-0">
          {isLoadingList ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              회원 데이터를 불러오는 중...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              조건에 맞는 회원이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-6">가입 계정 (이메일 / 이름)</th>
                    <th className="p-3.5">직종 / 상호</th>
                    <th className="p-3.5">요금제</th>
                    <th className="p-3.5 text-center">잔여 크레딧</th>
                    <th className="p-3.5 text-center">총 작성 원고 수</th>
                    <th className="p-3.5">가입일시</th>
                    <th className="p-3.5 pr-6 text-right">크레딧 관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const joinedDate = new Date(u.created_at).toLocaleDateString('ko-KR')
                    const planBadgeColor =
                      u.plan_type === 'pro'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : u.plan_type === 'basic'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 pl-6">
                          <p className="font-bold text-slate-900 text-xs">{u.email}</p>
                          {u.name && <p className="text-[11px] text-slate-400">{u.name}</p>}
                        </td>

                        <td className="p-3.5 text-slate-600">
                          {u.profile?.industry ? (
                            <span className="font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                              {u.profile.industry}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                          {u.profile?.store_name && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{u.profile.store_name}</p>
                          )}
                        </td>

                        <td className="p-3.5">
                          <Badge variant="outline" className={`text-[10px] font-extrabold uppercase ${planBadgeColor}`}>
                            {u.plan_type}
                          </Badge>
                        </td>

                        <td className="p-3.5 text-center">
                          <span className="font-black text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {u.credits}회
                          </span>
                        </td>

                        <td className="p-3.5 text-center font-bold text-slate-800">
                          {u._count.articles}편
                        </td>

                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {joinedDate}
                        </td>

                        <td className="p-3.5 pr-6 text-right">
                          <Button
                            onClick={() => {
                              setSelectedUser(u)
                              setGiftAmount(3)
                              setSelectedPlanChange('')
                              setActionNotice(null)
                            }}
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] font-bold text-indigo-700 border-indigo-200 hover:bg-indigo-50 cursor-pointer"
                          >
                            <Gift className="w-3 h-3 mr-1 text-amber-500" />
                            크레딧 조정
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                총 {totalCount}명 중 {(currentPage - 1) * 15 + 1}~{Math.min(currentPage * 15, totalCount)}명 표시
              </span>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoadingList}
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 font-bold text-slate-800">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoadingList}
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 🎁 크레딧 선물 / 조정 모달 (Popup Modal) */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <CardTitle className="text-base font-extrabold">보너스 크레딧 선물 & 플랜 조정</CardTitle>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <CardDescription className="text-xs text-slate-300 mt-1">
                대상: <strong className="text-white">{selectedUser.email}</strong> (현재: {selectedUser.credits}회)
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {actionNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {actionNotice}
                </div>
              )}

              {/* 크레딧 증감 선택 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  지급/차감할 크레딧 수
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGiftAmount(num)}
                      className={`py-2 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                        giftAmount === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      +{num}회
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">직접 입력:</span>
                  <Input
                    type="number"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(Number(e.target.value))}
                    className="h-9 text-xs w-28 text-center font-bold"
                  />
                  <span className="text-xs text-slate-600">회 (음수 입력 시 차감)</span>
                </div>
              </div>

              {/* 요금제 변경 옵션 */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  플랜 등급 변경 (선택사항)
                </label>
                <select
                  value={selectedPlanChange}
                  onChange={(e) => setSelectedPlanChange(e.target.value)}
                  className="w-full h-9 text-xs border border-slate-200 rounded-lg px-3 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">현재 플랜 유지 ({selectedUser.plan_type.toUpperCase()})</option>
                  <option value="free">Free 플랜으로 변경</option>
                  <option value="basic">Basic 플랜으로 업그레이드</option>
                  <option value="pro">Pro 플랜으로 업그레이드</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <Button
                  onClick={handleCreditSubmit}
                  disabled={isAdjusting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 rounded-lg shadow-sm cursor-pointer"
                >
                  {isAdjusting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    `선택 회원에게 ${giftAmount >= 0 ? `+${giftAmount}` : giftAmount} 크레딧 적용하기`
                  )}
                </Button>
                <Button
                  onClick={() => setSelectedUser(null)}
                  variant="outline"
                  className="text-xs text-slate-600 h-10 px-4 cursor-pointer"
                >
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
