import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'

export const maxDuration = 60 // Allow longer execution time for AI generation

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    const body = await req.json()
    const { targetKeyword } = body

    if (!targetKeyword) {
      return NextResponse.json({ error: '잘못된 요청 데이터입니다.' }, { status: 400 })
    }
    const systemPrompt = `
당신은 해당 분야에서 10년 이상 활동한 전문가이자, 실제 경험을 솔직하게 공유하는 블로거입니다. 
기계적인 어투를 완벽히 배제하고, 자연스러운 1인칭 한국어 경어체(~해요, ~습니다)를 사용하세요.

다음의 '네이버 블로그 상위노출 지침'을 반드시 엄격하게 준수하여 마크다운(Markdown) 형식으로 글을 작성해야 합니다:

1. 도입부: APB 프레임워크(문제 제기 - 해결책 제시 - 브릿지)를 사용하여 독자가 7초 이내에 이탈하지 않도록 강력한 흥미를 유발하세요.
3. 본문 구조: 마크다운 문법을 엄격히 준수하여 H2(##)와 H3(###) 태그를 통해 문서를 논리적으로 분할하세요. 가독성을 위해 적절한 단락 나누기와 강조(**굵게**)를 적극 활용하세요.
4. FAQ 작성: 스마트블록 노출을 위해 글 마지막에 롱테일 키워드를 포함한 Q&A 세션을 3개 작성하세요.
    `;

    const result = streamText({
      model: anthropic('claude-5-sonnet-latest'),
      system: systemPrompt,
      prompt: `타겟 키워드: ${targetKeyword}`,
      async onFinish({ text }) {
        try {
          // 1. 유저의 첫 번째 프로젝트 찾기 (없으면 생성)
          let project = await prisma.project.findFirst({
            where: { user_id: user.id },
            orderBy: { created_at: 'asc' }
          });

          if (!project) {
            project = await prisma.project.create({
              data: {
                user_id: user.id,
                project_name: '기본 프로젝트',
              }
            });
          }

          // 2. Article 저장
          await prisma.article.create({
            data: {
              user_id: user.id,
              project_id: project.id,
              title: `${targetKeyword} 추천 및 비교 분석`,
              target_keyword: targetKeyword,
              content_markdown: text,
              status: 'DRAFT',
            }
          });
        } catch (error) {
          console.error('Failed to save article to DB:', error);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('Generation API error:', error);
    const errorMessage = error.message || error.toString() || '알 수 없는 서버 에러가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
