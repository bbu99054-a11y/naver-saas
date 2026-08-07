import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    const body = await req.json()
    const { articleId } = body

    if (!articleId) {
      return NextResponse.json({ error: '아티클 ID가 필요합니다.' }, { status: 400 })
    }

    // 1. 아티클과 API 키 조회
    const [article, apiKeyRecord] = await Promise.all([
      prisma.article.findUnique({ where: { id: articleId, user_id: user.id } }),
      prisma.apiKey.findUnique({ where: { user_id: user.id } })
    ])

    if (!article) {
      return NextResponse.json({ error: '아티클을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (!apiKeyRecord?.wp_url || !apiKeyRecord?.wp_username || !apiKeyRecord?.wp_api_key) {
      return NextResponse.json({ error: '워드프레스 연동 정보가 설정되어 있지 않습니다.' }, { status: 400 })
    }

    // 2. 인증 정보 복호화 및 준비
    const wpUrl = apiKeyRecord.wp_url.replace(/\/$/, '') // 후행 슬래시 제거
    const wpUsername = apiKeyRecord.wp_username
    const wpPassword = decrypt(apiKeyRecord.wp_api_key)
    
    const authString = Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    // 3. 워드프레스 REST API 요청
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content_html,
        status: 'publish', // 바로 발행. 'draft'로 하려면 'draft'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '워드프레스 발행 중 오류가 발생했습니다.')
    }

    return NextResponse.json({ success: true, url: data.link })

  } catch (error: any) {
    console.error('WP Publish Error:', error)
    return NextResponse.json({ error: error.message || '발행 실패' }, { status: 500 })
  }
}
