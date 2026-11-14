import { NextResponse, type NextRequest } from 'next/server'

/**
 * 로그인·대시보드 비활성화 상태에 맞춰 원격 Supabase 인증 조회를 생략하고,
 * 기존 방문자 브라우저에 남아 있는 sb- 인증 쿠키만 만료 처리한 뒤 즉시 통과시킵니다.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.delete(cookie.name)
    }
  }

  return response
}
