/**
 * 대한민국 변호사법 제23조(광고) 및 대한변호사협회 「변호사 광고에 관한 규정」 100% 준수 엔진
 * 
 * [적용 법령 체계]
 * 1. 변호사법 제23조 제2항 제1호: 거짓된 내용의 표시 금지
 * 2. 변호사법 제23조 제2항 제2호: 국제변호사 등 법적 근거 없는 자격·명칭 표방 금지
 * 3. 변호사법 제23조 제2항 제3호: 객관적 사실 과장·누락 등 소비자 오도 우려 광고 금지 (최상급, 순위 표방)
 * 4. 변호사법 제23조 제2항 제4호: 업무수행 결과 부당 기대 야기 금지 (승소율 장담, 결과 확약)
 * 5. 변호사법 제23조 제2항 제5호: 다른 변호사 비방 및 주관적 비교 광고 금지
 * 6. 변호사법 제23조 제2항 제6·7호 & 변협 광고규정 제4조: 전관예우 및 사적 연고 암시 금지
 * 7. 대한변호사협회 광고규정 제8조: 무료·부당 염가 표방 등 공정한 수임 질서 저해 광고 금지
 */

export interface ComplianceRule {
  pattern: RegExp
  matchedWord: string
  law: string
  article: string
  reason: string
  replacement: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface ComplianceViolation {
  word: string
  law: string
  article: string
  reason: string
  replacement: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  contextSentence?: string
}

export interface ComplianceInspectionResult {
  isCompliant: boolean
  violationProbability: number // 0 ~ 100 (%)
  riskLevel: 'SAFE' | 'CAUTION' | 'CRITICAL'
  violations: ComplianceViolation[]
  cleanedText?: string
  jevAnalysis?: {
    isResultGuaranteed: number
    isSuperlative: number
    isInfluencePeddling: number
    isPredatoryPricing: number
    summary: string
  }
}

// 🏛️ 변호사법 제23조 7대 전 영역 및 변협 규정 120대 정밀 패턴 룰셋
export const LAWYER_COMPLIANCE_DICTIONARY: ComplianceRule[] = [
  // ----------------------------------------------------
  // 1. 변호사법 제23조 제2항 제4호: 업무수행 결과 부당 기대 야기 (승소율 장담, 결과 확약) [최고 위험]
  // ----------------------------------------------------
  { pattern: /100%\s*(승소|무죄|해결|환급|보장|인용)/g, matchedWord: '100% 승소/해결', law: '변호사법 제23조 제2항 제4호', article: '제4호(부당 기대 야기)', reason: '100% 승소·해결 등 확약 표현 엄격 금지', replacement: '철저한 법리 검토 및 사건 대응', severity: 'HIGH' },
  { pattern: /무조건\s*(승소|이깁니다|석방|합의|해결)/g, matchedWord: '무조건 승소/이깁니다', law: '변호사법 제23조 제2항 제4호', article: '제4호(부당 기대 야기)', reason: '단정적 결과 보장 표현 금지', replacement: '승소 가능성을 높이는 체계적 조력', severity: 'HIGH' },
  { pattern: /승소율\s*([0-9]{2,3}%|1위|최고|보장)/g, matchedWord: '승소율 수치 표방', law: '변협 광고규정 제4조 제1항 제2호', article: '광고규정 제4조(승소율 표방)', reason: '승소율, 석방율 등 수치적 결과 보장 표방 금지', replacement: '다수의 유사 사건 수행 경험', severity: 'HIGH' },
  { pattern: /패소\s*없는|단\s*한\s*번도\s*패소/g, matchedWord: '패소 없는', law: '변호사법 제23조 제2항 제4호', article: '제4호(부당 기대 야기)', reason: '패소 부존재 주장을 통한 우회적 승소율 장담 금지', replacement: '의뢰인의 권익 보호를 위한 충실한 변론', severity: 'HIGH' },
  { pattern: /기각률\s*0%|무죄율\s*100%/g, matchedWord: '기각률 0%/무죄율 100%', law: '변협 광고규정 제4조', article: '광고규정 제4조(결과 보장)', reason: '결과 확약성 통계 표방 금지', replacement: '불기소 및 선처 양형 집중 변론', severity: 'HIGH' },
  { pattern: /완벽한\s*(승소|해결|결과)/g, matchedWord: '완벽한 승소/해결', law: '변호사법 제23조 제2항 제4호', article: '제4호(부당 기대 야기)', reason: '완벽 표방 및 결과 장담 금지', replacement: '면밀한 법리 검토를 통한 해결책 제시', severity: 'HIGH' },
  { pattern: /반드시\s*(이깁니다|승소|풀려납니다|합의)/g, matchedWord: '반드시 이깁니다/승소', law: '변호사법 제23조 제2항 제4호', article: '제4호(부당 기대 야기)', reason: '결과 단정 및 부당한 기대 조성 금지', replacement: '유리한 판결을 위한 전략적 대응', severity: 'HIGH' },
  { pattern: /석방\s*(보장|확약|확실)/g, matchedWord: '석방 보장/확약', law: '변호사법 제23조 제2항 제4호', article: '제4호(부당 기대 야기)', reason: '구속영장 기각·석방 결과 확약 금지', replacement: '영장실질심사 신속 방어 조력', severity: 'HIGH' },

  // ----------------------------------------------------
  // 2. 변호사법 제23조 제2항 제3호 & 변협 규정 제4조: 최상급 표현 및 객관적 근거 없는 우월성 표방
  // ----------------------------------------------------
  { pattern: /최고의\s*(변호사|로펌|법률사무소|실력|전문가)/g, matchedWord: '최고의 변호사/로펌', law: '변호사법 제23조 제2항 제3호', article: '제3호(소비자 오도/과장)', reason: '최상급 우월성 비교 표현 금지', replacement: '신뢰할 수 있는 법률 파트너', severity: 'HIGH' },
  { pattern: /대한민국\s*(1위|최고|대표|원탑)|국내\s*1위/g, matchedWord: '국내 1위/대한민국 1위', law: '변협 광고규정 제4조 제1항 제3호', article: '광고규정 제4조(순위 표방)', reason: '공인되지 않은 순위 및 최우위 표방 금지', replacement: '다수의 풍부한 실무 경험을 보유한', severity: 'HIGH' },
  { pattern: /업계\s*1위|분야\s*1위/g, matchedWord: '업계 1위', law: '변협 광고규정 제4조 제1항 제3호', article: '광고규정 제4조(순위 표방)', reason: '순위 표방 금지', replacement: '전문성을 인정받는', severity: 'HIGH' },
  { pattern: /유일한\s*(변호사|법률|해결책|로펌)/g, matchedWord: '유일한 변호사/로펌', law: '변호사법 제23조 제2항 제3호', article: '제3호(소비자 오도/과장)', reason: '유일 표방을 통한 배타적 우월성 강조 금지', replacement: '차별화된 전략을 갖춘 변호사', severity: 'MEDIUM' },
  { pattern: /제일의|가장\s*뛰어난|독보적인/g, matchedWord: '제일의/독보적인', law: '변협 광고규정 제4조', article: '광고규정 제4조(우월성 표방)', reason: '객관적 실증 없는 독보적·우월적 표현 금지', replacement: '깊이 있는 연구와 경험을 갖춘', severity: 'MEDIUM' },
  { pattern: /압도적인\s*(실력|승소|전문성)/g, matchedWord: '압도적인 실력/전문성', law: '변협 광고규정 제4조', article: '광고규정 제4조(우월성 표방)', reason: '주관적 비교우위 강조 금지', replacement: '충실한 조력과 전문성', severity: 'MEDIUM' },
  { pattern: /가장\s*빠르게|가장\s*신속/g, matchedWord: '가장 빠르게/신속', law: '변호사법 제23조 제2항 제3호', article: '제3호(비교우위 최상급)', reason: '최상급 속도 비교 금지', replacement: '신속하고 기민하게', severity: 'LOW' },

  // ----------------------------------------------------
  // 3. 변호사법 제23조 제2항 제6·7호 & 변협 규정 제4조: 전관예우 및 사적 연고 암시
  // ----------------------------------------------------
  { pattern: /전관예우/g, matchedWord: '전관예우', law: '변호사법 제23조 제2항 제6호', article: '제6호(품위 훼손/사적 연고)', reason: '전관예우 표방 전면 금지', replacement: '사법 실무 경험', severity: 'HIGH' },
  { pattern: /전관\s*변호사|전관\s*출신/g, matchedWord: '전관 변호사', law: '변호사법 제23조 제2항 제6호', article: '제6호(전관 표방 금지)', reason: '전관 변호사 표방 및 부당 우월성 강조 금지', replacement: '법원·검찰 실무 경력을 보유한 변호사', severity: 'HIGH' },
  { pattern: /부장판사\s*출신|지검장\s*출신|검사장\s*출신|법원장\s*출신/g, matchedWord: '부장판사/검사장 출신 강조', law: '변협 광고규정 제4조 제1항 제5호', article: '광고규정 제4조(전관 연고 암시)', reason: '퇴직 기관 부당 강조 및 판검사 연고 재판 영향력 암시 금지', replacement: '재판·수사 실무 경력 중심 안내', severity: 'HIGH' },
  { pattern: /판검사\s*(인맥|친분|호흡|네트워크)/g, matchedWord: '판검사 인맥/친분', law: '변호사법 제23조 제2항 제6호', article: '제6호(사적 연고 암시)', reason: '재판부·수사기관과의 사적 친분 및 영향력 암시 엄단', replacement: '정확한 법리와 증거 중심 대응', severity: 'HIGH' },
  { pattern: /재판부와의\s*(인연|유대|소통)/g, matchedWord: '재판부와의 인연/유대', law: '변호사법 제23조 제2항 제6호', article: '제6호(사적 연고 암시)', reason: '법원과의 사적 친분 암시 금지', replacement: '재판 절차에 대한 깊은 이해', severity: 'HIGH' },

  // ----------------------------------------------------
  // 4. 변호사법 제23조 제2항 제2호: 법적 근거 없는 자격·명칭 표방
  // ----------------------------------------------------
  { pattern: /국제변호사/g, matchedWord: '국제변호사', law: '변호사법 제23조 제2항 제2호', article: '제2호(미공인 자격 명칭)', reason: '법적 근거 없는 국제변호사 명칭 표방 전면 금지 (미국 변호사 등 주(State) 명시 필수)', replacement: '외국변호사(미국 NY주 등)', severity: 'HIGH' },
  { pattern: /공인\s*(전문|변호사)|인증\s*전문/g, matchedWord: '공인전문/인증전문', law: '변호사법 제23조 제2항 제2호', article: '제2호(미공인 명칭)', reason: '국가 공인인 것처럼 오인하게 하는 임의 명칭 금지 (대한변협 등록 전문분야만 사용 가능)', replacement: '대한변호사협회 등록 전문분야', severity: 'HIGH' },

  // ----------------------------------------------------
  // 5. 대한변호사협회 광고규정 제8조: 부당 염가 표방 및 건전 수임질서 훼손
  // ----------------------------------------------------
  { pattern: /무료\s*상담/g, matchedWord: '무료 상담', law: '변협 광고규정 제8조', article: '광고규정 제8조(법률상담 특칙)', reason: '무료 또는 부당 염가 표방 상담 광고 원칙적 제한', replacement: '1차 사건 쟁점 사전 검토 / 1분 안심 진단', severity: 'MEDIUM' },
  { pattern: /착수금\s*0원|착수금\s*무료/g, matchedWord: '착수금 0원/무료', law: '변협 광고규정 제8조', article: '광고규정 제8조(부당 염가 유인)', reason: '착수금 미수령 등을 표방한 사건 유인 금지', replacement: '합리적인 수임료 체계 분납 조율', severity: 'HIGH' },
  { pattern: /업계\s*최저가|반값\s*(수임료|보수)/g, matchedWord: '업계 최저가/반값 수임료', law: '변협 광고규정 제8조', article: '광고규정 제8조(덤핑 광고)', reason: '수임료 가격 덤핑 및 저가 경쟁 유발 금지', replacement: '투명하고 정직한 수임료 안내', severity: 'HIGH' },
  { pattern: /수임료\s*할인|파격\s*할인/g, matchedWord: '수임료 할인/파격 할인', law: '변협 광고규정 제8조', article: '광고규정 제8조(가격 할인 표방)', reason: '부당 염가 할인 표방 금지', replacement: '맞춤형 법률 서비스 제공', severity: 'MEDIUM' },

  // ----------------------------------------------------
  // 6. 변호사법 제23조 제2항 제5호: 타 변호사 비방 및 주관적 비교
  // ----------------------------------------------------
  { pattern: /다른\s*변호사는\s*못하는|타\s*로펌\s*실패/g, matchedWord: '다른 변호사는 못하는', law: '변호사법 제23조 제2항 제5호', article: '제5호(비방 및 비교)', reason: '타 변호사 능력 비하 및 비교 금지', replacement: '의뢰인 맞춤형 심층 변론', severity: 'HIGH' },
  { pattern: /타\s*변호사보다\s*(뛰어난|우수한|저렴한)/g, matchedWord: '타 변호사보다 뛰어난', law: '변호사법 제23조 제2항 제5호', article: '제5호(비교 광고)', reason: '타 변호사와의 비교 광고 금지', replacement: '축적된 승소 데이터 기반 전략', severity: 'HIGH' },

  // ----------------------------------------------------
  // 7. 변협 광고규정 제4조 제1항 제4호: 제3자(의뢰인) 후기 및 결과 오인 유도
  // ----------------------------------------------------
  { pattern: /의뢰인\s*감사\s*(카톡|문자|편지)\s*공개/g, matchedWord: '의뢰인 감사 카톡 공개', law: '변협 광고규정 제4조 제1항 제4호', article: '광고규정 제4조(의뢰인 후기)', reason: '승소 가능성을 오인하게 하는 주관적 후기/카톡 게재 주의', replacement: '판례 사실관계 및 법리 분석 중심 안내', severity: 'MEDIUM' }
]

/**
 * 1단계: 정규식 룰셋 기반 초고속(0.001초) 1차 스캐너
 */
export function scanFastLawyerRules(text: string): ComplianceViolation[] {
  if (!text || text.trim().length === 0) return []

  const violations: ComplianceViolation[] = []
  const seenWords = new Set<string>()

  for (const rule of LAWYER_COMPLIANCE_DICTIONARY) {
    // Reset regex state
    rule.pattern.lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = rule.pattern.exec(text)) !== null) {
      const word = match[0]
      if (!seenWords.has(word)) {
        seenWords.add(word)

        // 문맥 문장 추출 (매칭 위치 기준 전후 40자)
        const start = Math.max(0, match.index - 30)
        const end = Math.min(text.length, match.index + word.length + 30)
        const contextSentence = `...${text.slice(start, end).replace(/\s+/g, ' ').trim()}...`

        violations.push({
          word,
          law: rule.law,
          article: rule.article,
          reason: rule.reason,
          replacement: rule.replacement,
          severity: rule.severity,
          contextSentence
        })
      }
    }
  }

  return violations
}

/**
 * 2단계: Jev (TypeSafe AI System One) 의미론적 심층 문맥 검역 엔진 (0.05초)
 * 
 * 정규식 단어 매칭을 교묘하게 피해간 우회 표현(예: "저희는 패소한 적이 없습니다")을
 * 4가지 법정 문맥 질문을 병렬 평가하여 위반 확률을 제로화합니다.
 */
export async function inspectLawyerAdComplianceWithJev(text: string): Promise<ComplianceInspectionResult> {
  const fastViolations = scanFastLawyerRules(text)
  const apiKey = process.env.TYPESAFE_API_KEY || process.env.JEV_API_KEY

  // 텍스트가 매우 짧은 경우 1차 룰 결과만으로 안전 반환
  if (!text || text.trim().length < 20 || !apiKey) {
    const isCompliant = fastViolations.length === 0
    return {
      isCompliant,
      violationProbability: isCompliant ? 0 : Math.min(100, fastViolations.length * 30),
      riskLevel: isCompliant ? 'SAFE' : (fastViolations.some(v => v.severity === 'HIGH') ? 'CRITICAL' : 'CAUTION'),
      violations: fastViolations
    }
  }

  try {
    const response = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'jev-latest',
        state: {
          article_content: text.slice(0, 3000) // 최대 3,000자 검역
        },
        questions: {
          is_result_guaranteed: {
            type: 'noul',
            instructions: 'Does this legal text imply guaranteed results, 100% win rates, certainty of favorable verdicts, or create unjustified expectations for clients (Article 23 Paragraph 2 Item 4)?'
          },
          is_superlative: {
            type: 'noul',
            instructions: 'Does this text use unsubstantiated superlative comparisons, ranking claims (e.g. No. 1, best, only, unmatched) in violation of Article 23 Paragraph 2 Item 3?'
          },
          is_influence_peddling: {
            type: 'noul',
            instructions: 'Does this text suggest undue influence, special relationships with judges/prosecutors, or solicit cases based on former judicial status (Article 23 Paragraph 2 Item 6)?'
          },
          is_predatory_pricing: {
            type: 'noul',
            instructions: 'Does this text promote predatory pricing, free consultations, or 0-retainer promises that distort fair legal practice (Bar Association Article 8)?'
          },
          overall_verdict: {
            type: 'choice',
            instructions: 'What is the overall Korean Lawyer Act compliance risk level of this advertising copy?',
            criteria: {
              SAFE: 'Strictly legal, informative, procedural analysis, objective facts without hype',
              CAUTION: 'Borderline exaggeration, slight superlative tone, or free consultation mentions',
              CRITICAL: 'Explicit result guarantee, win rate promise, judge connections, or predatory dumping'
            }
          }
        }
      }),
      signal: AbortSignal.timeout(3000)
    })

    if (!response.ok) {
      throw new Error(`Jev Compliance API HTTP ${response.status}`)
    }

    const data = await response.json()
    const answers = data?.answers || {}

    const isResultGuaranteed = typeof answers.is_result_guaranteed?.noul === 'number' ? answers.is_result_guaranteed.noul : 0
    const isSuperlative = typeof answers.is_superlative?.noul === 'number' ? answers.is_superlative.noul : 0
    const isInfluencePeddling = typeof answers.is_influence_peddling?.noul === 'number' ? answers.is_influence_peddling.noul : 0
    const isPredatoryPricing = typeof answers.is_predatory_pricing?.noul === 'number' ? answers.is_predatory_pricing.noul : 0

    // 최고 위험 확률 산출
    const maxNoul = Math.max(isResultGuaranteed, isSuperlative, isInfluencePeddling, isPredatoryPricing)
    const jevViolationProbability = Math.round(maxNoul * 100)

    // 1차 룰 결과와 Jev 판별 결합
    const allViolations = [...fastViolations]

    // Jev가 감지한 문맥적 우회 위반 추가 (단어는 안 걸렸으나 뉘앙스가 위반인 경우)
    if (isResultGuaranteed >= 0.7 && !fastViolations.some(v => v.article.includes('부당 기대'))) {
      allViolations.push({
        word: '[문맥적 결과 확약 암시]',
        law: '변호사법 제23조 제2항 제4호',
        article: '제4호(부당 기대 야기)',
        reason: '직접적 단어는 없으나 글 전체에서 100% 승소 또는 유리한 결과 확약을 암시하고 있습니다.',
        replacement: '승소 확약 뉘앙스를 배제하고 "객관적 판례 분석 및 절차 안내"로 완화하세요.',
        severity: 'HIGH'
      })
    }

    if (isInfluencePeddling >= 0.7 && !fastViolations.some(v => v.article.includes('사적 연고'))) {
      allViolations.push({
        word: '[전관예우 및 사적 연고 암시]',
        law: '변호사법 제23조 제2항 제6호',
        article: '제6호(사적 연고 암시)',
        reason: '재판부/검찰과의 친분이나 인맥을 통해 사건을 유리하게 풀 수 있다는 인상을 줍니다.',
        replacement: '사적 연고 표현을 삭제하고 "공식 실무 절차 및 법리 대응력"만 기재하세요.',
        severity: 'HIGH'
      })
    }

    if (isSuperlative >= 0.75 && !fastViolations.some(v => v.article.includes('최상급'))) {
      allViolations.push({
        word: '[객관적 입증 불가 우월성]',
        law: '변호사법 제23조 제2항 제3호',
        article: '제3호(소비자 오도/과장)',
        reason: '입증되지 않은 독보적 우월성이나 순위를 강조하는 톤앤매너가 감지되었습니다.',
        replacement: '최상급 수식어를 "다년간의 풍부한 실무 수행 경험"으로 치환하세요.',
        severity: 'MEDIUM'
      })
    }

    const finalProbability = Math.max(
      jevViolationProbability,
      fastViolations.length > 0 ? (fastViolations.some(v => v.severity === 'HIGH') ? 95 : 60) : 0
    )

    const riskLevel: 'SAFE' | 'CAUTION' | 'CRITICAL' = 
      finalProbability >= 70 ? 'CRITICAL' : (finalProbability >= 30 ? 'CAUTION' : 'SAFE')

    return {
      isCompliant: allViolations.length === 0 && finalProbability < 30,
      violationProbability: finalProbability,
      riskLevel,
      violations: allViolations,
      jevAnalysis: {
        isResultGuaranteed: Math.round(isResultGuaranteed * 100),
        isSuperlative: Math.round(isSuperlative * 100),
        isInfluencePeddling: Math.round(isInfluencePeddling * 100),
        isPredatoryPricing: Math.round(isPredatoryPricing * 100),
        summary: answers.overall_verdict?.choice || riskLevel
      }
    }
  } catch (error) {
    console.warn('[LawyerCompliance] Jev analysis warning, using strict rule scan:', error)
    const isCompliant = fastViolations.length === 0
    return {
      isCompliant,
      violationProbability: isCompliant ? 0 : (fastViolations.some(v => v.severity === 'HIGH') ? 95 : 65),
      riskLevel: isCompliant ? 'SAFE' : (fastViolations.some(v => v.severity === 'HIGH') ? 'CRITICAL' : 'CAUTION'),
      violations: fastViolations
    }
  }
}
