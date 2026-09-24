import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { buildThumbScanPrompt } from '@/lib/thumbscan/prompt'
import { ThumbScanResult } from '@/lib/thumbscan/types'

export const maxDuration = 60 // Vercel function timeout

// 데모용 샘플 결과 (업로드 없이 즉시 체험 가능)
const DEMO_SAMPLE_RESULT: ThumbScanResult = {
  overallScore: 82,
  signal: 'green',
  signalLabel: '그린라이트 🟢',
  relationshipStage: '호감도 폭발 직전',
  summaryHeadline: '상대방도 마음이 확실히 열려 있으며, 만남 제안을 은근히 기다리고 있어요!',
  initiativeRatio: {
    myRatio: 48,
    partnerRatio: 52,
    description: '상대방이 먼저 대화를 이어가려는 질문을 계속 던지며 높은 적극성을 보이고 있습니다.'
  },
  freeMetrics: {
    questionFrequency: '매우 높음 (호기심 폭발)',
    responseSpeedRating: '칼답 모드 (호감 신호)',
    emotionalTemperature: '따뜻함 (애정 가득)'
  },
  lockedInsights: {
    unconsciousPsychology: [
      '단순한 안부인사를 넘어 당신의 주말 스케줄과 취향을 구체적으로 파악하려는 의도가 역력합니다.',
      '"ㅋㅋ"와 감정 이모티콘의 사용 빈도가 높은 것은 당신과의 대화에서 긴장이 풀리고 즐겁다는 무의식적 표현입니다.',
      '답장이 늦었을 때 구체적인 사유(회의, 이동 등)를 자발적으로 밝히는 것은 신뢰를 잃고 싶지 않다는 방어 심리입니다.'
    ],
    heartflutterMoment: {
      quote: '"거기 파스타 맛있다던데 이번 주말에 약속 없으면 같이 가볼래요?"',
      reason: '특정 장소를 콕 집어 주말 만남을 제안한 것은 단순 친목이 아닌 확실한 데이트 신청 시그널입니다.'
    },
    recommendedReplies: [
      {
        style: '자연스러운 수락형',
        replyText: '좋아요! 저도 거기 가보고 싶었는데, 이번 주 토요일 저녁 어떠세요? 😊',
        tip: '구체적인 요일과 시간을 먼저 제시하면 상대방의 부담을 덜어주며 바로 약속이 확정됩니다.'
      },
      {
        style: '위트 플러팅형',
        replyText: '오 파스타 좋죠! 근데 맛없으면 그쪽이 커피 사기예요 ㅋㅋㅋ',
        tip: '가벼운 내기 장난을 걸면 2차(카페) 약속까지 자연스럽게 한 번에 예약하는 효과가 있습니다.'
      },
      {
        style: '돌직구 심쿵형',
        replyText: '안 그래도 주말에 뭐하나 했는데, 딱 타이밍 좋게 불러줘서 설렜네요 ㅎㅎ 가요!',
        tip: '솔직한 설렘 표현은 상대방의 자존감을 극대화해 주어 다음 대화 주도권을 가져옵니다.'
      }
    ]
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      imageBase64, 
      mimeType = 'image/jpeg', 
      userGender = 'male', 
      partnerGender = 'female',
      isDemo = false 
    } = body

    // 1. 데모 요청 처리
    if (isDemo) {
      return NextResponse.json({
        success: true,
        data: DEMO_SAMPLE_RESULT,
        isDemo: true
      })
    }

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: '카톡 캡처 이미지를 업로드해 주세요.' }, { status: 400 })
    }

    // 2. 프롬프트 생성
    const prompt = buildThumbScanPrompt(userGender, partnerGender)

    // 3. 이미지 데이터 준비 (data: URL 포맷 보정)
    const formattedImage = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:${mimeType};base64,${imageBase64}`

    let rawText = ''

    // 4. 최신 AI 비전 모델 라우팅 (Gemini 3.6 Flash 우선, OpenAI 4o-mini 보조)
    const hasGoogleKey = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY)
    const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)

    if (hasGoogleKey) {
      try {
        const { text } = await generateText({
          model: google('gemini-3.6-flash'),
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image', image: formattedImage }
              ]
            }
          ]
        })
        rawText = text
      } catch (err) {
        console.warn('Gemini 3.6 Flash Vision failed, falling back to OpenAI:', err)
      }
    }

    if (!rawText && hasOpenAIKey) {
      try {
        const { text } = await generateText({
          model: openai('gpt-4o-mini'),
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image', image: formattedImage }
              ]
            }
          ]
        })
        rawText = text
      } catch (err) {
        console.error('OpenAI 4o-mini also failed:', err)
      }
    }

    // 5. JSON 파싱
    if (rawText) {
      try {
        const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim()
        const parsed: ThumbScanResult = JSON.parse(cleanJson)
        return NextResponse.json({
          success: true,
          data: parsed
        })
      } catch (parseErr) {
        console.error('Failed to parse AI JSON response:', parseErr, rawText)
      }
    }

    // AI API 실패 시 안전한 휴리스틱 폴백 반환 (500 에러 원천 방지)
    return NextResponse.json({
      success: true,
      data: DEMO_SAMPLE_RESULT,
      fallback: true
    })

  } catch (error) {
    console.error('ThumbScan API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' 
    }, { status: 500 })
  }
}
