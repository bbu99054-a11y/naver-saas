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

// 플랜별 공인 가격 및 크레딧
const PLAN_CREDITS: Record<string, { credits: number; name: string }> = {
  basic: { credits: 10, name: 'Basic (10회)' },
  pro: { credits: 30, name: 'Pro (30회)' },
}

/**
 * 1. 일반 고객: 무통장 입금 신청 생성
 */
export async function createDepositRequest(formData: {
  plan: 'basic' | 'pro'
  amount: number
  depositorName: string
  depositorPhone: string
  taxDeductionType: 'NONE' | 'PERSONAL' | 'BUSINESS'
  taxDeductionNum?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요한 서비스입니다.' }
    }

    const { plan, amount, depositorName, depositorPhone, taxDeductionType, taxDeductionNum } = formData

    if (!depositorName || !depositorPhone) {
      return { success: false, error: '입금자명과 연락처를 정확히 입력해 주세요.' }
    }

    // 주문번호 생성 (예: DEP-20260819-A1B2)
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const orderId = `DEP-${timestamp}-${randomSuffix}`

    const depositRecord = await prisma.paymentHistory.create({
      data: {
        user_id: user.id,
        order_id: orderId,
        amount: amount,
        status: 'PENDING',
        plan_type: plan,
        depositor_name: depositorName.trim(),
        depositor_phone: depositorPhone.trim(),
        tax_deduction_type: taxDeductionType,
        tax_deduction_num: taxDeductionNum?.trim() || null,
        created_at: new Date(),
      },
    })

    revalidatePath('/dashboard/billing')
    revalidatePath('/dashboard/admin/deposits')

    return {
      success: true,
      orderId: depositRecord.order_id,
      amount: depositRecord.amount,
      depositorName: depositRecord.depositor_name,
    }
  } catch (error: any) {
    console.error('Create deposit request error:', error)
    return { success: false, error: '입금 신청 처리 중 오류가 발생했습니다.' }
  }
}

/**
 * 2. 관리자 권한 확인 헬퍼
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

/**
 * 3. 관리자: 대기 중인 입금 신청 목록 조회
 */
export async function getPendingDeposits() {
  try {
    const { isAdmin } = await verifyAdmin()
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 없습니다.', data: [] }
    }

    const deposits = await prisma.paymentHistory.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            credits: true,
            plan_type: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return { success: true, data: deposits }
  } catch (error: any) {
    console.error('Get pending deposits error:', error)
    return { success: false, error: '목록을 불러오는 중 오류가 발생했습니다.', data: [] }
  }
}

/**
 * 4. 관리자: 1클릭 입금 확인 및 크레딧 즉시 지급 (트랜잭션)
 */
export async function approveDeposit(orderId: string) {
  try {
    const { isAdmin } = await verifyAdmin()
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 없습니다.' }
    }

    const deposit = await prisma.paymentHistory.findUnique({
      where: { order_id: orderId },
      include: { user: true },
    })

    if (!deposit) {
      return { success: false, error: '해당 입금 내역을 찾을 수 없습니다.' }
    }

    if (deposit.status !== 'PENDING') {
      return { success: false, error: '이미 처리되었거나 취소된 내역입니다.' }
    }

    const planConfig = PLAN_CREDITS[deposit.plan_type] || { credits: 10, name: 'Basic' }
    const addedCredits = planConfig.credits

    // DB 원자적 트랜잭션: 상태 완료 변경 + 크레딧 즉시 증가 + 플랜 업데이트
    await prisma.$transaction([
      prisma.paymentHistory.update({
        where: { order_id: orderId },
        data: {
          status: 'DONE',
          completed_at: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: deposit.user_id },
        data: {
          credits: { increment: addedCredits },
          plan_type: deposit.plan_type,
          subscription_tier: deposit.plan_type.toUpperCase(),
        },
      }),
    ])

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/billing')
    revalidatePath('/dashboard/admin/deposits')

    return {
      success: true,
      message: `${deposit.user.email} 고객님께 ${addedCredits} 크레딧 지급이 완료되었습니다.`,
    }
  } catch (error: any) {
    console.error('Approve deposit error:', error)
    return { success: false, error: '입금 승인 처리 중 오류가 발생했습니다.' }
  }
}

/**
 * 5. 관리자: 입금 신청 취소/반려 및 기지급 크레딧 환수 (원자적 트랜잭션)
 */
export async function cancelDeposit(orderId: string, reason?: string) {
  try {
    const { isAdmin } = await verifyAdmin()
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 없습니다.' }
    }

    const deposit = await prisma.paymentHistory.findUnique({
      where: { order_id: orderId },
      include: { user: true },
    })

    if (!deposit) {
      return { success: false, error: '해당 입금 내역을 찾을 수 없습니다.' }
    }

    // 이미 취소된 상태인 경우
    if (deposit.status === 'CANCELED') {
      return { success: false, error: '이미 취소 처리된 내역입니다.' }
    }

    // 이미 승인(DONE)되었던 건을 환수/취소하는 경우: 크레딧 차감 + 상태 CANCELED 원자적 트랜잭션
    if (deposit.status === 'DONE') {
      const planConfig = PLAN_CREDITS[deposit.plan_type] || { credits: 10, name: 'Basic' }
      const revertedCredits = planConfig.credits

      await prisma.$transaction([
        prisma.paymentHistory.update({
          where: { order_id: orderId },
          data: {
            status: 'CANCELED',
            receipt_url: reason ? `[환수] ${reason}` : '[환수] 관리자 승인 취소 및 크레딧 회수',
          },
        }),
        prisma.user.update({
          where: { id: deposit.user_id },
          data: {
            credits: { decrement: revertedCredits },
          },
        }),
      ])

      revalidatePath('/dashboard')
      revalidatePath('/dashboard/billing')
      revalidatePath('/dashboard/admin/deposits')

      return {
        success: true,
        message: `${deposit.user.email} 고객님의 승인이 취소되고 ${revertedCredits} 크레딧이 정상 회수(환수)되었습니다.`,
      }
    }

    // 대기(PENDING) 상태인 경우: 단순 상태 CANCELED 변경
    await prisma.paymentHistory.update({
      where: { order_id: orderId },
      data: {
        status: 'CANCELED',
        receipt_url: reason ? `사유: ${reason}` : null,
      },
    })

    revalidatePath('/dashboard/admin/deposits')
    return { success: true, message: '신청이 정상적으로 취소/반려 처리되었습니다.' }
  } catch (error: any) {
    console.error('Cancel deposit error:', error)
    return { success: false, error: '취소/환수 처리 중 오류가 발생했습니다.' }
  }
}

/**
 * 6. 관리자: 최근 전체 입금 내역 조회 (대기 + 완료 + 취소)
 */
export async function getRecentDeposits(statusFilter?: string) {
  try {
    const { isAdmin } = await verifyAdmin()
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 없습니다.', data: [] }
    }

    const whereClause: any = {}
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter
    }

    const deposits = await prisma.paymentHistory.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            credits: true,
            plan_type: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 50,
    })

    return { success: true, data: deposits }
  } catch (error: any) {
    console.error('Get recent deposits error:', error)
    return { success: false, error: '입금 목록을 불러오는 중 오류가 발생했습니다.', data: [] }
  }
}

/**
 * 7. 현재 로그인한 사용자가 관리자인지 확인
 */
export async function checkIsAdmin() {
  const { isAdmin } = await verifyAdmin()
  return isAdmin
}
