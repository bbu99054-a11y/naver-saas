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
    const { articleId, title, content } = body

    let pubTitle = title;
    let pubContent = content;

    // 1. API 키 및 아티클 조회
    const [apiKeyRecord, article] = await Promise.all([
      prisma.apiKey.findUnique({ where: { user_id: user.id } }),
      articleId ? prisma.article.findUnique({ where: { id: articleId, user_id: user.id } }) : null
    ])

    if (article) {
      pubTitle = article.title;
      pubContent = article.content_html;
    }

    if (!pubTitle || !pubContent) {
      return NextResponse.json({ error: '제목과 내용이 필요합니다.' }, { status: 400 })
    }

    if (!apiKeyRecord?.tistory_access_token || !apiKeyRecord?.tistory_blog_name) {
      return NextResponse.json({ error: '티스토리 연동 정보가 설정되어 있지 않습니다.' }, { status: 400 })
    }

    // 2. 인증 정보 복호화 및 준비
    const accessToken = decrypt(apiKeyRecord.tistory_access_token)
    const blogName = apiKeyRecord.tistory_blog_name
    
    // 3. 티스토리 OpenAPI 요청 (form-data 형태가 아닌 json 가능, 그러나 티스토리는 보통 FormData나 query parameters 권장)
    // 티스토리는 application/x-www-form-urlencoded 나 formdata를 받으므로 URLSearchParams 사용
    const formData = new URLSearchParams()
    formData.append('access_token', accessToken)
    formData.append('output', 'json')
    formData.append('blogName', blogName)
    formData.append('title', pubTitle)
    formData.append('content', pubContent || '')
    formData.append('visibility', '3') // 0: 비공개, 1: 보호, 3: 발행

    const response = await fetch('https://www.tistory.com/apis/post/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    })

    const data = await response.json()

    if (data.tistory?.status !== '200') {
      throw new Error(data.tistory?.error_message || '티스토리 발행 중 오류가 발생했습니다.')
    }

    return NextResponse.json({ success: true, url: data.tistory?.url })

  } catch (error: any) {
    console.error('Tistory Publish Error:', error)
    return NextResponse.json({ error: error.message || '발행 실패' }, { status: 500 })
  }
}
