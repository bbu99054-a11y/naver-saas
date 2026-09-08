// D:\PostSync\src\lib\adcheckRules.ts
// 2026 전문직(변호사, 의사, 세무사, 노무사, 행정사) 법정 광고 규정 및 금칙어/대체어 사전

export type ProfessionType = 'lawyer' | 'doctor' | 'tax' | 'labor' | 'admin';

export interface BannedRule {
  id: string;
  pattern: RegExp;
  keyword: string;
  category: string;
  law: string;
  severity: 'danger' | 'warning';
  explanation: string;
  replacement: string;
}

export interface ProfessionConfig {
  id: ProfessionType;
  title: string;
  badge: string;
  lawName: string;
  rules: BannedRule[];
  sampleText: string;
}

export const PROFESSION_CONFIGS: Record<ProfessionType, ProfessionConfig> = {
  lawyer: {
    id: 'lawyer',
    title: '변호사 · 법률',
    badge: '⚖️ 변호사법 제23조',
    lawName: '변호사법 제23조 및 변호사 광고에 관한 규정',
    sampleText: `안녕하십니까. 서초동 최고의 전문 변호사입니다. 저희 로펌은 100% 승소를 보장하며, 판검사 출신 전관예우 네트워크를 통해 가장 빠르게 의뢰인의 사건을 무죄로 이끕니다. 타 사무소 대비 50% 수임료 파괴 할인 이벤트를 진행 중이니 유일한 승소 전문 로펌과 지금 바로 상담하세요.`,
    rules: [
      {
        id: 'law-1',
        pattern: /100%\s*승소|무조건\s*승소|반드시\s*이깁니다|승소\s*보장/g,
        keyword: '100% 승소 / 무조건 승소 / 승소 보장',
        category: '승소율 보장 및 결과 과장',
        law: '변호사법 제23조 제2항 제1호',
        severity: 'danger',
        explanation: '재판의 결과는 법원의 독립적 판단에 따르므로, 승소를 약속하거나 과장된 보장을 표방하는 광고는 엄격히 금지됩니다.',
        replacement: '유사 판례 심층 분석 및 최선의 법률 조력'
      },
      {
        id: 'law-2',
        pattern: /최고의?\s*변호사|국내\s*1위|업계\s*1등|유일한?\s*전문/g,
        keyword: '최고 / 국내 1위 / 유일한',
        category: '배타적·최상급 표현',
        law: '변호사 광고규정 제4조 제1호',
        severity: 'danger',
        explanation: '객관적 근거 없는 최상급(최고, 유일, 1등) 표현은 소비자 오인을 유발하여 협회 징계 대상이 됩니다.',
        replacement: '체계적인 사건 수행 경험과 전문성'
      },
      {
        id: 'law-3',
        pattern: /전관예우|부장판사\s*출신\s*인맥|검찰\s*라인|판검사\s*사적\s*관계/g,
        keyword: '전관예우 / 판검사 인맥 / 사적 연고',
        category: '전관예우 및 사적 연고 암시',
        law: '변호사법 제23조 제2항 제3호',
        severity: 'danger',
        explanation: '법원, 검찰과의 연고나 전관예우를 통해 수사나 재판에 영향을 미칠 수 있는 것처럼 암시하는 행위는 형사 처벌 및 최고 3천만 원 과태료 사유입니다.',
        replacement: '재판부 설득을 위한 객관적 증거 수집과 치밀한 법리 검토'
      },
      {
        id: 'law-4',
        pattern: /수임료\s*(?:할인|파괴|반값|최저가|무료\s*소송|덤핑)/g,
        keyword: '수임료 할인 / 최저가 / 가격 파괴',
        category: '부당 염가 표방 및 품위 손상',
        law: '변호사법 제24조 및 품위유지의무',
        severity: 'warning',
        explanation: '수임료 덤핑, 가격 파괴 등 법조 시장의 공정한 경쟁을 해치고 품위를 손상하는 광고는 금지됩니다.',
        replacement: '사건 난이도에 따른 합리적이고 투명한 보수 체계'
      },
      {
        id: 'law-5',
        pattern: /가장\s*빠른\s*(?:해결|합의|판결)|단\s*3일\s*만에\s*끝/g,
        keyword: '가장 빠른 해결 / 단 3일 만에',
        category: '소송 기간 단정적 단축 보장',
        law: '변호사 광고규정 제5조',
        severity: 'warning',
        explanation: '사법 절차의 특성상 일방적으로 신속한 종결을 단언하는 광고는 허위·과장 광고에 해당합니다.',
        replacement: '사안별 쟁점 신속 대응 및 능동적 절차 진행'
      }
    ]
  },
  doctor: {
    id: 'doctor',
    title: '의사 · 병의원',
    badge: '🩺 의료법 제56조',
    lawName: '의료법 제56조 (의료광고의 금지 등)',
    sampleText: `강남 1위 의료진이 집도하는 부작용 0% 완전 무통 라식! 단 한 번의 시술로 시력 1.5 완치를 보장합니다. 수술 전후 사진만 봐도 100% 만족도를 확인하실 수 있습니다. 오늘 예약 시 50% 가격 파괴 무료 혜택을 드립니다.`,
    rules: [
      {
        id: 'med-1',
        pattern: /완치\s*보장|100%\s*완치|치료\s*효과\s*보장|재발\s*0%/g,
        keyword: '완치 보장 / 100% 완치 / 재발 0%',
        category: '치료 효과 보장 및 오인 유발',
        law: '의료법 제56조 제2항 제2호',
        severity: 'danger',
        explanation: '의료 행위는 환자 개인의 체질과 환경에 따라 결과가 상이하므로 치료 효과를 보장하는 표현은 즉시 영업정지 처분 대상입니다.',
        replacement: '증상 완화 및 재발 방지를 위한 개인 맞춤형 치료 계획'
      },
      {
        id: 'med-2',
        pattern: /부작용\s*(?:전혀\s*없|0%|없음|완전\s*무통|통증\s*제로)/g,
        keyword: '부작용 없음 / 부작용 0% / 통증 제로',
        category: '부작용 부존재 표방',
        law: '의료법 제56조 제2항 제7호',
        severity: 'danger',
        explanation: '모든 의료 시술은 출혈, 감염 등의 부작용 가능성이 수반되므로 부작용이 전혀 없다고 단언하는 것은 위법입니다.',
        replacement: '충분한 사전 검사 및 통증 경감을 위한 체계적 관리'
      },
      {
        id: 'med-3',
        pattern: /전후\s*사진|비포\s*애프터|시술\s*전후\s*비교/g,
        keyword: '전후 사진 / 비포 애프터',
        category: '환자 유인성 전후 비교 광고',
        law: '의료법 시행령 및 보건복지부 심의기준',
        severity: 'warning',
        explanation: '동일 조건(조명, 각도, 기간 명시)과 부작용 고지가 없는 무분별한 전후 비교 사진은 의료법 위반으로 과징금이 부과됩니다.',
        replacement: '임상적 치료 경과에 대한 전문의 학술 소견 제공'
      },
      {
        id: 'med-4',
        pattern: /(?:가격\s*파괴|무료\s*시술|50%\s*할인|파격\s*특가|이벤트\s*할인)/g,
        keyword: '가격 파괴 / 무료 시술 / 할인 이벤트',
        category: '환자 유인·알선성 금품 및 할인 제공',
        law: '의료법 제27조 제3항 (환자 유인 행위)',
        severity: 'danger',
        explanation: '영리 목적으로 환자에게 비급여 진료비 할인이나 금품을 제공하여 유인하는 행위는 3년 이하의 징역형에 처해질 수 있습니다.',
        replacement: '국민건강보험 기준에 부합하는 정직한 비급여 항목 안내'
      }
    ]
  },
  tax: {
    id: 'tax',
    title: '세무사 · 회계사',
    badge: '📊 세무사법 제12조',
    lawName: '세무사법 제12조의6 (광고의 제한)',
    sampleText: `국세청 환급율 1위 세무법인입니다. 고객님께 최대 3,000만 원 환급을 보장하며, 타 세무사보다 무조건 세금을 2배 더 많이 깎아드립니다. 이번 달 기장료 무료 최저가 수임 이벤트를 놓치지 마세요.`,
    rules: [
      {
        id: 'tax-1',
        pattern: /환급(?:율|액)\s*1위|최대\s*환급\s*보장|환급금\s*100%\s*보장/g,
        keyword: '환급율 1위 / 최대 환급 보장',
        category: '환급 실적 과장 및 결과 보장',
        law: '세무사법 제12조의6 제2항',
        severity: 'danger',
        explanation: '세법 규정과 과세관청의 심사에 따라 결정되는 환급액을 사전에 1위라거나 확정 보장하는 표현은 금지됩니다.',
        replacement: '적법한 공제 요건 분석 및 세제 혜택 누락 검토'
      },
      {
        id: 'tax-2',
        pattern: /타\s*세무사보다|다른\s*(?:세무사|사무소)\s*비교|수임료\s*비교/g,
        keyword: '타 세무사 비교 / 비방',
        category: '동종 전문직 비방 및 비교 광고',
        law: '세무사 광고에 관한 규정 제5조',
        severity: 'warning',
        explanation: '타 세무사의 역량이나 수임료를 폄하하거나 불공정한 비교를 유도하는 광고는 징계 대상입니다.',
        replacement: '당 사무소의 축적된 업종별 세무 조사 대응 노하우'
      },
      {
        id: 'tax-3',
        pattern: /기장료\s*무료|수임료\s*최저가|기장대리\s*공짜|수임료\s*덤핑/g,
        keyword: '기장료 무료 / 최저가 / 공짜',
        category: '부당 염가 제공 및 시장 교란',
        law: '세무사 윤리규정 제3조',
        severity: 'danger',
        explanation: '공짜 기장, 최저가 등 직무의 전문성과 독립성을 해치는 부당 염가 광고는 직무정지 등 중징계 사유입니다.',
        replacement: '업종 규모에 맞춘 투명하고 합리적인 월 기장 자문 보수'
      }
    ]
  },
  labor: {
    id: 'labor',
    title: '공인노무사',
    badge: '🤝 공인노무사법',
    lawName: '공인노무사법 제13조 및 윤리규정',
    sampleText: `노동청 산재 승인 100% 구제를 보장합니다. 근로복지공단 사적 인맥을 동원하여 타 사무소와 비교 불가한 최대 보상금을 받아드립니다.`,
    rules: [
      {
        id: 'lab-1',
        pattern: /100%\s*구제|산재\s*100%\s*승인|무조건\s*인가/g,
        keyword: '100% 구제 / 산재 100% 승인',
        category: '행정 처분 결과 확정보장',
        law: '공인노무사법 제13조 (품위유지)',
        severity: 'danger',
        explanation: '노동위원회나 공단의 판단을 예단하여 100% 구제를 장담하는 것은 의뢰인을 기망하는 행위입니다.',
        replacement: '인과관계 입증을 위한 철저한 근로 실태 및 의무기록 분석'
      },
      {
        id: 'lab-2',
        pattern: /노동부\s*인맥|공단\s*라인|조사관\s*사적\s*친분/g,
        keyword: '노동부 인맥 / 공단 사적 친분',
        category: '공무원 사적 연고 선전',
        law: '공인노무사 윤리규정 제7조',
        severity: 'danger',
        explanation: '감독관이나 심판관과의 사적 친분을 과시하여 사건 처리를 유도하는 표현은 법률 위반입니다.',
        replacement: '노동관계 법령과 판례에 기초한 논리적인 이유서 작성'
      }
    ]
  },
  admin: {
    id: 'admin',
    title: '공인행정사',
    badge: '📜 행정사법',
    lawName: '행정사법 제11조 및 광고 규정',
    sampleText: `음주운전 면허취소 100% 구제 보장. 구청 인허가 무조건 통과 약속. 불법 비자 전문 대행합니다.`,
    rules: [
      {
        id: 'adm-1',
        pattern: /면허취소\s*100%\s*구제|무조건\s*인가|허가\s*보장/g,
        keyword: '100% 구제 / 무조건 인가 보장',
        category: '인허가 결과 단정적 보장',
        law: '행정사법 제11조',
        severity: 'danger',
        explanation: '행정청의 재량 행위를 자의적으로 100% 허가 보장한다고 허위 광고하는 것은 불법입니다.',
        replacement: '행정심판 구제 요건 검토 및 양형 자료 정밀 소명'
      },
      {
        id: 'adm-2',
        pattern: /비자\s*불법\s*체류\s*합법화|위장\s*(?:결혼|취업)/g,
        keyword: '불법 합법화 / 위장 행위 대행',
        category: '불법 행위 조장 및 알선',
        law: '출입국관리법 및 행정사법',
        severity: 'danger',
        explanation: '출입국 관리법령에 위배되는 편법이나 불법 대행을 표방하는 광고는 엄벌 대상입니다.',
        replacement: '적법한 출입국 자격 요건 분석 및 정당한 체류 자격 신청'
      }
    ]
  }
};

export interface ScanMatch {
  ruleId: string;
  keyword: string;
  matchedText: string;
  index: number;
  category: string;
  law: string;
  severity: 'danger' | 'warning';
  explanation: string;
  replacement: string;
}

export interface ScanResult {
  profession: ProfessionType;
  totalChars: number;
  score: number;
  status: 'safe' | 'warning' | 'danger';
  matches: ScanMatch[];
}

export function scanAdCompliance(text: string, profession: ProfessionType): ScanResult {
  const config = PROFESSION_CONFIGS[profession];
  const matches: ScanMatch[] = [];

  if (!text || text.trim().length === 0) {
    return {
      profession,
      totalChars: 0,
      score: 100,
      status: 'safe',
      matches: []
    };
  }

  for (const rule of config.rules) {
    const rx = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = rx.exec(text)) !== null) {
      matches.push({
        ruleId: rule.id,
        keyword: rule.keyword,
        matchedText: match[0],
        index: match.index,
        category: rule.category,
        law: rule.law,
        severity: rule.severity,
        explanation: rule.explanation,
        replacement: rule.replacement
      });
    }
  }

  let penalty = 0;
  for (const m of matches) {
    penalty += m.severity === 'danger' ? 25 : 12;
  }
  const score = Math.max(0, 100 - penalty);

  let status: 'safe' | 'warning' | 'danger' = 'safe';
  if (score < 60) {
    status = 'danger';
  } else if (score < 90) {
    status = 'warning';
  }

  return {
    profession,
    totalChars: text.length,
    score,
    status,
    matches
  };
}

export function purifyAdText(text: string, profession: ProfessionType): string {
  const config = PROFESSION_CONFIGS[profession];
  let purified = text;

  for (const rule of config.rules) {
    const rx = new RegExp(rule.pattern.source, rule.pattern.flags);
    purified = purified.replace(rx, rule.replacement);
  }

  return purified;
}
