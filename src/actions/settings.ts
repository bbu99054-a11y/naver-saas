'use server'

import prisma from '@/lib/prisma'
import { encrypt } from '@/lib/crypto'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveApiKeys(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '인증되지 않은 사용자입니다.' }
  }

  const wpUrl = formData.get('wpUrl') as string
  const wpUsername = formData.get('wpUsername') as string
  const wpApiKey = formData.get('wpApiKey') as string

  const tistoryAccessToken = formData.get('tistoryAccessToken') as string
  const tistoryBlogName = formData.get('tistoryBlogName') as string

  try {
    const dataToSave: any = { user_id: user.id }
    
    // 빈 값이 아니면 암호화하여 저장할 준비
    // 빈 값이 아니면 저장할 준비
    
    if (wpUrl?.trim()) dataToSave.wp_url = wpUrl.trim()
    if (wpUsername?.trim()) dataToSave.wp_username = wpUsername.trim()
    if (wpApiKey?.trim()) dataToSave.wp_api_key = encrypt(wpApiKey.trim())

    if (tistoryAccessToken?.trim()) dataToSave.tistory_access_token = encrypt(tistoryAccessToken.trim())
    if (tistoryBlogName?.trim()) dataToSave.tistory_blog_name = tistoryBlogName.trim()

    // 아무것도 입력하지 않았으면 리턴
    if (Object.keys(dataToSave).length === 1) {
      return { success: false, error: '저장할 키를 입력해 주세요.' }
    }

    let existingKey = await prisma.apiKey.findUnique({ where: { user_id: user.id } });
    
    if (existingKey) {
      await prisma.apiKey.update({
        where: { user_id: user.id },
        data: dataToSave
      });
    } else {
      await prisma.apiKey.create({
        data: dataToSave
      });
    }

    // 설정 페이지의 서버 컴포넌트를 강제 새로고침하여 바뀐 상태(저장됨 뱃지)를 보여주도록 함
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to save API keys:', error)
    return { success: false, error: '키 저장에 실패했습니다.' }
  }
}
