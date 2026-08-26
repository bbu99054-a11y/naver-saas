'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProfile(data: {
  store_name: string;
  industry: string;
  address: string;
  phone: string;
  reservation_link: string;
  tone?: string;
  about_us?: string;
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const email = user.email || `${user.id}@oauth.user`
    const name = user.user_metadata?.name || user.user_metadata?.full_name || '신규 사용자'
    
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: email,
          name: name,
          credits: 3,
          plan_type: 'free',
        }
      })
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { user_id: user.id }
    })

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { user_id: user.id },
        data: {
          store_name: data.store_name,
          industry: data.industry,
          address: data.address,
          phone: data.phone,
          reservation_link: data.reservation_link,
          ...(data.tone !== undefined ? { tone: data.tone } : {}),
          about_us: data.about_us,
        }
      })
    } else {
      profile = await prisma.profile.create({
        data: {
          user_id: user.id,
          store_name: data.store_name,
          industry: data.industry,
          address: data.address,
          phone: data.phone,
          reservation_link: data.reservation_link,
          tone: data.tone || null,
          about_us: data.about_us,
        }
      })
    }

    // 기본 프로젝트 보관함이 없으면 사전 자동 생성 (신규 회원 원고 저장 보장)
    const existingProject = await prisma.project.findFirst({
      where: { user_id: user.id }
    })
    if (!existingProject) {
      await prisma.project.create({
        data: {
          user_id: user.id,
          project_name: '기본 프로젝트',
        }
      })
    }

    revalidatePath('/dashboard')
    return { success: true, profile }
  } catch (error: any) {
    console.error('Save profile error:', error)
    return { success: false, error: error.message }
  }
}

export async function getProfile() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const profile = await prisma.profile.findUnique({
      where: { user_id: user.id }
    })

    return profile
  } catch (error) {
    console.error('Get profile error:', error)
    return null
  }
}
