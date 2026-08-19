'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 관리자 이메일 목록 (대표님 공식 계정)
const ADMIN_EMAILS = [
  'bbu99054@gmail.com',
  'bu99054@naver.com',
  process.env.ADMIN_EMAIL || '',
].filter(Boolean)

/**
 * 관리자 권한 검증 헬퍼
 */
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { isAdmin: false, user: null }
  }

  const isAdmin = ADMIN_EMAILS.some((email) => email.toLowerCase() === user.email?.toLowerCase())
  return { isAdmin, user }
}

export async function checkIsAdmin() {
  const { isAdmin } = await verifyAdmin()
  return isAdmin
}

/**
 * 1. CEO 관리자 전체 비즈니스 통계 요약 (KPI)
 */
export async function getAdminOverviewStats() {
  try {
    const { isAdmin } = await verifyAdmin()
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 없습니다.' }
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // 1) 총 회원 수 및 오늘 신규 가입자
    const [totalUsers, todayNewUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          created_at: { gte: todayStart },
        },
      }),
    ])

    // 2) 요금제별 회원 수
    const [freeUsersCount, basicUsersCount, proUsersCount] = await Promise.all([
      prisma.user.count({ where: { plan_type: 'free' } }),
      prisma.user.count({ where: { plan_type: 'basic' } }),
      prisma.user.count({ where: { plan_type: 'pro' } }),
    ])

    // 3) 총 생성된 원고 수 & 무료 vs 유료 회원 생성 비율
    const totalArticles = await prisma.article.count()

    const freeArticles = await prisma.article.count({
      where: {
        user: { plan_type: 'free' },
      },
    })

    const paidArticles = await prisma.article.count({
      where: {
        user: { plan_type: { in: ['basic', 'pro'] } },
      },
    })

    // 4) 누적 입금 매출액
    const paidPayments = await prisma.paymentHistory.findMany({
      where: { status: 'DONE' },
      select: { amount: true },
    })
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)

    // 5) 대기 중인 입금 신청 건수
    const pendingDepositsCount = await prisma.paymentHistory.count({
      where: { status: 'PENDING' },
    })

    // 6) 최근 인기 키워드 상위 5개
    const recentArticles = await prisma.article.findMany({
      take: 50,
      orderBy: { created_at: 'desc' },
      select: { target_keyword: true },
    })

    const keywordMap: Record<string, number> = {}
    recentArticles.forEach((a) => {
      if (a.target_keyword) {
        keywordMap[a.target_keyword] = (keywordMap[a.target_keyword] || 0) + 1
      }
    })

    const topKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([keyword, count]) => ({ keyword, count }))

    return {
      success: true,
      stats: {
        totalUsers,
        todayNewUsers,
        freeUsersCount,
        basicUsersCount,
        proUsersCount,
        totalArticles,
        freeArticles,
        paidArticles,
        totalRevenue,
        pendingDepositsCount,
        topKeywords,
      },
    }
  } catch (error: any) {
    console.error('getAdminOverviewStats error:', error)
    return { success: false, error: '통계를 불러오는 중 오류가 발생했습니다.' }
  }
}

/**
 * 2. 전체 회원 목록 조회 (페이지네이션 & 검색)
 */
export async function getAdminUsersList(params?: {
  page?: number
  pageSize?: number
  search?: string
  planFilter?: string
}) {
  try {
    const { isAdmin } = await verifyAdmin()
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 없습니다.', users: [], totalCount: 0, totalPages: 0 }
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const search = params?.search?.trim() || ''
    const planFilter = params?.planFilter || 'ALL'

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (planFilter && planFilter !== 'ALL') {
      whereClause.plan_type = planFilter.toLowerCase()
    }

    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include: {
          profile: {
            select: {
              store_name: true,
              industry: true,
              phone: true,
            },
          },
          _count: {
            select: {
              articles: true,
            },
          },
        },
      }),
    ])

    return {
      success: true,
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    }
  } catch (error: any) {
    console.error('getAdminUsersList error:', error)
    return { success: false, error: '회원 목록을 불러오는 중 오류가 발생했습니다.', users: [], totalCount: 0, totalPages: 0 }
  }
}

/**
 * 3. 관리자 전용: 특정 회원 크레딧 및 플랜 수동 조정 (선물)
 */
export async function adjustUserCredits(data: {
  userId: string
  addedCredits: number
  newPlanType?: string
  reason?: string
}) {
  try {
    const { isAdmin, user: adminUser } = await verifyAdmin()
    if (!isAdmin || !adminUser) {
      return { success: false, error: '관리자 권한이 없습니다.' }
    }

    const { userId, addedCredits, newPlanType, reason } = data

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return { success: false, error: '해당 회원을 찾을 수 없습니다.' }
    }

    const updateData: any = {
      credits: { increment: addedCredits },
    }

    if (newPlanType) {
      updateData.plan_type = newPlanType.toLowerCase()
      updateData.subscription_tier = newPlanType.toUpperCase()
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/deposits')

    return {
      success: true,
      message: `${targetUser.email} 회원님께 ${addedCredits >= 0 ? `+${addedCredits}` : addedCredits} 크레딧이 조정되었습니다. (현재 잔여: ${updatedUser.credits}회)`,
      currentCredits: updatedUser.credits,
    }
  } catch (error: any) {
    console.error('adjustUserCredits error:', error)
    return { success: false, error: '크레딧 조정 중 오류가 발생했습니다.' }
  }
}
