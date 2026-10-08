import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'

type IndustryType = 'LEGAL' | 'TAX' | 'MEDICAL' | 'GENERAL'

function detectIndustry(storeName: string, specialty: string): IndustryType {
  const text = `${storeName} ${specialty}`.toLowerCase()
  if (/세무|회계|세무사|회계사|기장|결산|세무법인|회계법인/.test(text)) {
    return 'TAX'
  }
  if (/치과|피부과|안과|성형외과|정형외과|이비인후과|내과|한의원|병원|의원|클리닉|재활|한방/.test(text)) {
    return 'MEDICAL'
  }
  if (/변호사|법무법인|법률사무소|변리사|노무사|행정사|로펌|소송|형사|이혼|민사/.test(text)) {
    return 'LEGAL'
  }
  return 'GENERAL'
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { 
      storeName = '', 
      locationName = '', 
      specialtyName = '', 
      tone = 'trust' 
    } = body

    const sName = String(storeName).trim() || '우리매장'
    const lName = String(locationName).trim() || '지역 중심가'
    const spec = String(specialtyName).trim() || '전문 서비스'

    const industry = detectIndustry(sName, spec)

    const toneDescriptions = {
      trust: '신뢰감과 안정감을 주는 차분하고 진정성 있는 어조 (정직한 소통, 1:1 맞춤 상담/서비스 강조)',
      authority: '풍부한 실무 경험과 객관적 전문성을 보여주는 당당하고 체계적인 어조',
      empathy: '고객의 고민과 불편을 깊이 공감하고 친절하게 다가서는 따뜻한 동반자적 어조'
    }

    const currentToneDesc = toneDescriptions[tone as keyof typeof toneDescriptions] || toneDescriptions.trust

    // 1. 최신 AI 모델 가동 (Gemini 3.1 Flash-Lite 우선 라우팅, OpenAI gpt-4o-mini 보조)
    const hasGoogleKey = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY)
    const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)

    if (hasGoogleKey || hasOpenAIKey) {
      try {
        const model = hasGoogleKey ? google('gemini-3.1-flash-lite') : openai('gpt-4o-mini')

        // 헌법 제4조 직역별 광고 규정 컴플라이언스 프롬프트 주입
        let complianceRule = ''
        if (industry === 'LEGAL') {
          complianceRule = `[변호사법 제23조 및 변호사 광고 규정 100% 준수]
- 절대 금지어: '최고', '유일', '100% 승소', '무조건 승소', '가장 빠른', '전관 출신', '부당 염가/최저가/무료 표방' 일체 배제.
- 권장 요소: 객관적 사실, 치밀한 사실관계 검토 및 판례 분석 기반 대응, 비밀유지의무(변호사법 제26조) 준수.`
        } else if (industry === 'TAX') {
          complianceRule = `[세무사법 제12조 및 세무사 광고 규정 100% 준수]
- 절대 금지어: '평균 환급금 명시', '환급율 1위', '절세율 최고', '타 세무사 수임료 비교', '무료/최저가 기장 표방' 일체 배제.
- 권장 요소: 세법 개정안에 부합하는 적법한 절세 체크리스트, 세무조사 대비, 1:1 맞춤 기장 및 신고 관리.`
        } else if (industry === 'MEDICAL') {
          complianceRule = `[의료법 제56조 의료 광고 규정 100% 준수]
- 절대 금지어: '치료 효과 보장/과장', '부작용 없는 시술', '전후 사진 비교', '환자 유인성 가격 파괴/할인' 일체 배제.
- 권장 요소: 객관적인 의학 정보, 과잉 진료 없는 환자 중심 소통, 전문의의 정밀 진단 및 사후 관리.`
        } else {
          complianceRule = `[소상공인 네이버 스마트플레이스 신뢰 브랜딩 규정]
- 절대 금지어: 과장된 최상급 표현('대한민국 1등', '무조건 보장') 지양.
- 권장 요소: 엄선된 품질/재료, 철저한 위생 관리, 친절한 고객 응대, 네이버 플레이스 간편 예약 혜택.`
        }

        const prompt = `당신은 네이버 스마트플레이스 전문 브랜딩 카피라이터이자 SEO 전문가입니다.
다음 업체의 '네이버 스마트플레이스 상세 소개글(800~1,100자 모바일 최적화)'을 작성해 주세요.

[업체 기본 정보]
- 상호명: ${sName}
- 관할/중심 위치: ${lName}
- 주력 전문 분야: ${spec}
- 업종 분류: ${industry}
- 희망 톤앤매너: ${currentToneDesc}

${complianceRule}

[작성 주의사항]
1. 허위 사실 단정 금지: 확인되지 않은 시설 정보('전용 무료 주차 완비', '지하철역 도보 3분' 등)를 임의로 지어내지 말고, "방문 전 유선 또는 네이버 지도를 통해 상세 안내를 확인해 주세요" 형태로 안전하게 작성하세요.
2. 첫 100자 안에 핵심 키워드(${lName}, ${sName}, ${spec})를 자연스럽게 전방 배치하세요.
3. 마크다운 샵(#) 헤더 없이 [소제목], ■ 기호, 불릿 기호를 사용하여 모바일에서 읽기 편하게 작성하세요.
4. 글자 수: 공백 포함 800자 ~ 1,100자 내외로 작성하세요.`

        const { text } = await generateText({
          model,
          prompt,
          temperature: 0.7,
          abortSignal: AbortSignal.timeout(8000)
        })

        if (text && text.trim().length >= 350) {
          return NextResponse.json({
            success: true,
            intro: text.trim(),
            source: 'ai',
            charCount: text.trim().length,
            industry
          })
        }
      } catch (aiErr) {
        console.warn('[Place Intro AI Fallback triggered]:', aiErr)
      }
    }

    // 2. 고품질 다이나믹 템플릿 폴백 (업종별 & 톤별 컴플라이언스 100% 준수)
    let generatedText = ''

    if (industry === 'TAX') {
      generatedText = `[${sName} - 대표님의 소중한 자산을 지키는 정직하고 명쾌한 세무 파트너]\n\n` +
        `안녕하십니까, ${lName}에 위치한 ${sName}입니다.\n\n` +
        `복잡하게 얽힌 세법 개정안과 매년 달라지는 세무 신고 기준, 사업에만 몰두하기에도 바쁜 대표님들께 세무는 늘 무겁고 불안한 숙제입니다.\n\n` +
        `${sName}은 과장된 환급 약속이나 무리한 처방 대신, 세법의 테두리 안에서 사업장의 실익을 극대화하는 '적법하고 합리적인 절세 솔루션'을 제공합니다.\n\n` +
        `■ ${sName}의 3대 업무 원칙\n` +
        `1. 세무사 1:1 맞춤 검토 및 정밀 상담\n` +
        `단순 전산 입력에 그치지 않고, 업종별 특성에 맞춘 비과세·감면 혜택과 정부 지원 제도를 꼼꼼히 챙깁니다.\n\n` +
        `2. 세무 리스크 사전 예방 (세무조사 방어선 구축)\n` +
        `사후 소명으로 인한 가산세 부담이 없도록 평소 장부 기장부터 선제적으로 리스크 요인을 점검합니다.\n\n` +
        `3. 투명하고 신속한 피드백\n` +
        `궁금하신 세무 이슈가 있을 때 답답하지 않도록 명확하고 알기 쉬운 언어로 소통합니다.\n\n` +
        `■ 주력 세무 서비스\n` +
        `· ${spec} 및 개인/법인 사업자 맞춤 장부 기장 대리\n` +
        `· 부가가치세, 종합소득세, 법인세 신고 및 세액공제 정밀 검토\n` +
        `· 상속·증여·양도소득세 사전 시뮬레이션 및 절세 로드맵\n` +
        `· 세무조사 입회 조력 및 과세전적부심사 청구\n\n` +
        `■ 상담 및 방문 안내\n` +
        `세금 고민으로 밤잠 설치지 마시고, ${sName}의 전문 상담을 받아보세요. 네이버 플레이스 간편 예약 또는 유선 문의를 통해 사전 일정을 조율해 주시면 대기 없이 깊이 있는 상담이 가능합니다.\n\n` +
        `위치: ${lName} 중심가 (상세 위치 및 방문 편의는 네이버 지도 상세 정보를 확인해 주세요)\n` +
        `※ 본 사무소는 세무사법 제12조 광고 규정을 엄격히 준수합니다.`
    } else if (industry === 'MEDICAL') {
      generatedText = `[${sName} - 과잉 진료 없이 기본에 충실한 환자 중심 진료]\n\n` +
        `안녕하십니까, ${lName} 지역 주민 여러분의 건강을 돌보는 ${sName}입니다.\n\n` +
        `몸이 불편하고 통증이 찾아왔을 때, 환자분께서 가장 안심할 수 있는 병원은 화려한 미사여구보다 '내 가족을 치료하듯 정직하게 진료하는 곳'입니다.\n\n` +
        `${sName}은 불필요한 과잉 진료를 철저히 배제하고, 환자 한 분 한 분의 증상과 생활 환경을 세심하게 살펴 꼭 필요한 치료만을 정직하게 제안합니다.\n\n` +
        `■ ${sName}의 진료 철학\n` +
        `1. 정밀한 진단과 알기 쉬운 설명\n` +
        `현재 건강 상태와 치료 계획을 환자분께서 충분히 이해하실 수 있도록 친절하고 눈높이에 맞게 설명해 드립니다.\n\n` +
        `2. 철저한 위생 및 멸균 감염 관리\n` +
        `원내 모든 의료 기구는 1인 1기구 원칙과 엄격한 소독 멸균 시스템을 거쳐 안전하게 관리됩니다.\n\n` +
        `3. 치료 후 사후 관리까지 책임지는 진료\n` +
        `일회성 치료로 끝내지 않고, 재발 방지와 평소 건강한 생활 습관 유지까지 함께 돕습니다.\n\n` +
        `■ 주요 진료 안내\n` +
        `· ${spec} 및 연령별 맞춤 집중 클리닉\n` +
        `· 초기 증상 완화 및 비수술적 보존 치료 우선\n` +
        `· 정기 건강 검진 및 생활 습관 예방 상담\n\n` +
        `■ 내원 및 예약 안내\n` +
        `대기 시간을 줄이고 편안하게 진료받으실 수 있도록 네이버 플레이스 간편 예약을 운영하고 있습니다. 통증이나 불편함이 있으시다면 참지 마시고 편안한 마음으로 내원해 주시기 바랍니다.\n\n` +
        `위치: ${lName} 중심가 (방문 전 진료 시간 및 위치 안내를 네이버 지도로 확인해 주세요)\n` +
        `※ 본 안내는 의료법 제56조를 준수하여 객관적인 정보 제공 목적으로 작성되었습니다.`
    } else if (industry === 'LEGAL') {
      generatedText = `[${sName} - 의뢰인의 곁을 끝까지 지키는 든든한 법률 조력자]\n\n` +
        `안녕하십니까, ${lName}에 위치한 ${sName}입니다.\n\n` +
        `예기치 못한 법적 분쟁으로 극심한 불안감에 시달리는 순간, 가장 필요한 것은 형식적인 위로가 아닌 '객관적 사실관계 정리'와 '실효성 있는 방어 전략'입니다.\n\n` +
        `${sName}은 의뢰인의 절박한 목소리에 깊이 귀 기울이며 치밀한 판례 분석을 바탕으로 최선의 결과를 이끌어냅니다.\n\n` +
        `■ ${sName}의 3대 조력 원칙\n` +
        `1. 대표 변호사 1:1 직접 상담 및 서면 총괄\n` +
        `사무장 대리 없이 변호사가 사실관계를 직접 청취하고 서면 작성과 재판 출석을 전담합니다.\n\n` +
        `2. 철저한 비밀 보장 (변호사법 제26조 준수)\n` +
        `의뢰인의 사생활과 민감한 개인정보는 법률상 비밀유지의무에 따라 철저히 비공개로 안전하게 보호됩니다.\n\n` +
        `3. 과장 없는 냉철한 법리 진단\n` +
        `지키지 못할 과장된 약속 대신, 의뢰인의 실익을 최우선으로 고려한 명확한 단계별 대응 로드맵을 제시합니다.\n\n` +
        `■ 주력 전문 분야\n` +
        `· ${spec} 및 초기 수사 단계 밀착 조력\n` +
        `· 가사 및 이혼, 재산분할, 위자료, 양육권 전담\n` +
        `· 계약 분쟁, 대여금, 손해배상, 부동산 명도 민사 소송\n\n` +
        `■ 상담 예약 및 위치 안내\n` +
        `답답하고 막막한 심경, 혼자 고민하지 마시고 네이버 플레이스 간편 예약 또는 직통 전화를 통해 상담 일정을 잡아주시기 바랍니다.\n\n` +
        `위치: ${lName} 중심가 (상세 위치 및 방문 편의는 네이버 지도 상세 정보를 확인해 주세요)\n` +
        `※ 본 사무소는 변호사법 제23조 광고 규정을 100% 준수합니다.`
    } else {
      generatedText = `[${sName} - 고객의 일상에 기분 좋은 만족을 선물합니다]\n\n` +
        `안녕하십니까, ${lName}에서 고객 여러분과 함께하고 있는 ${sName}입니다.\n\n` +
        `언제 찾아와도 편안하고 기분 좋은 공간, 한결같은 품질과 정성 어린 서비스로 보답하고자 매일 정성을 다하고 있습니다.\n\n` +
        `${sName}은 눈앞의 이익보다 고객 한 분 한 분이 보내주시는 믿음을 가장 소중하게 생각합니다.\n\n` +
        `■ ${sName}이 지키는 3가지 약속\n` +
        `1. 엄선된 품질과 철저한 기본 관리\n` +
        `작은 디테일 하나도 소홀히 하지 않고, 최고의 만족을 드릴 수 있도록 기본에 충실합니다.\n\n` +
        `2. 쾌적하고 청결한 공간\n` +
        `머무시는 시간 동안 편안한 휴식과 만족을 느끼실 수 있도록 항상 쾌적한 환경을 유지합니다.\n\n` +
        `3. 고객의 소리에 귀 기울이는 진심 어린 서비스\n` +
        `이용 중 불편함이 없으시도록 친절하고 세심하게 소통하며 늘 더 나은 서비스를 고민합니다.\n\n` +
        `■ 대표 서비스 & 안내\n` +
        `· ${spec} 전문 프로그램 및 시그니처 서비스\n` +
        `· 네이버 플레이스 간편 예약 고객 전용 혜택 제공\n` +
        `· 정기 소독 및 위생 관리 철저\n\n` +
        `■ 방문 및 문의 안내\n` +
        `소중한 분들과 함께 ${sName}에서 행복한 시간을 보내보세요. 네이버 예약을 이용하시면 더욱 편리하게 이용하실 수 있습니다.\n\n` +
        `위치: ${lName} 중심가 (상세 위치 및 편의 안내는 네이버 지도를 확인해 주세요)`
    }

    return NextResponse.json({
      success: true,
      intro: generatedText.trim(),
      source: 'template_engine',
      charCount: generatedText.trim().length,
      industry
    })

  } catch (error: any) {
    console.error('[Place Intro API Error]:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || '소개글 생성 중 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
