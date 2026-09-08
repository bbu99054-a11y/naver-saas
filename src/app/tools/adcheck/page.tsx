import type { Metadata } from 'next';
import Link from 'next/link';
import AdCheckClient from './AdCheckClient';
import {
  ShieldCheck,
  Scale,
  Stethoscope,
  Calculator,
  Briefcase,
  FileSpreadsheet,
  AlertOctagon,
  HelpCircle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: '전문직 법정 광고 금칙어 1초 스캐너 (변호사·의사·세무사·노무사·행정사) | PostSync Tools',
  description:
    '변호사법 제23조, 의료법 제56조, 세무사법 제12조 등 2026년 전문직 법정 광고 규정 및 금칙어를 1초 만에 무료 스캔하세요. 100% 브라우저 로컬 연산, 원클릭 법률 안전 대체어 자동 치환 제공.',
  alternates: {
    canonical: '/tools/adcheck',
  },
  openGraph: {
    title: '전문직 법정 광고 금칙어 1초 스캐너 | PostSync Tools',
    description:
      '포스팅 1건당 과태료 최대 5,000만원 및 자격정지 처분 방지. 변호사, 의사, 세무사, 노무사, 행정사 블로그 광고 문안을 무료로 즉시 진단하세요.',
    url: 'https://www.postsyncapp.com/tools/adcheck',
    siteName: 'PostSync Tools',
    locale: 'ko_KR',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      'name': '전문직 법정 광고 금칙어 1초 스캐너 (AdCheck)',
      'operatingSystem': 'Web Browser',
      'applicationCategory': 'BusinessApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'KRW',
      },
      'description':
        '변호사, 의사, 세무사, 노무사, 행정사 등 전문직 블로그 및 홈페이지 문안의 법정 광고 규정 위반 여부를 100% 브라우저 메모리상에서 1초 만에 무료 스캔하고 정제해 주는 웹 유틸리티.',
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': '변호사 블로그에서 100% 승소나 최고 승소율 같은 표현이 왜 금지되나요?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '변호사법 제23조 제2항 및 대한변호사협회 변호사 광고 규정에 따라 승소율이나 승소를 보장하는 등 소비자를 오도하거나 공정한 수임 질서를 해치는 일체의 과장·단정적 표현은 엄격히 금지됩니다. 위반 시 변협 징계 처분(정직, 과태료, 견책) 및 형사 고발의 대상이 될 수 있습니다.',
          },
        },
        {
          '@type': 'Question',
          'name': '의료법상 병의원 블로그에 환자의 치료 전후 사진을 게시할 수 있나요?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '의료법 제56조 제2항 제2호에 따라 치료 효과를 오인하게 할 우려가 있는 치료 전후 사진 게시는 원칙적으로 금지됩니다. 동일한 조건(촬영 시기, 조명, 각도 명시)과 부작용 안내 문구를 엄격히 명시하지 않거나 로그인 없는 공개형 게시물에 전후 사진을 노출하는 것은 의료법 위반으로 업무정지 처분 대상입니다.',
          },
        },
        {
          '@type': 'Question',
          'name': '세무사 광고에서 환급률 1위나 최저가 기장료 표기가 처벌 대상인가요?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '세무사법 제12조의3 및 한국세무사회 광고 규정 제4조에 의거, 객관적 산출 근거 없는 최고, 1위, 최저가 수임료 표방은 부당유인 행위로 간주되어 세무사 징계위원회에 회부될 수 있으며 자격정지 등 중징계를 받을 수 있습니다.',
          },
        },
        {
          '@type': 'Question',
          'name': '본 광고 금칙어 검사기에 입력한 텍스트가 외부 서버나 데이터베이스에 저장되나요?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '저장되지 않습니다. PostSync AdCheck 스캐너는 100% 사용자 브라우저 메모리(Client-side JavaScript)에서만 연산되므로, 입력된 원고는 외부 서버로 일체 전송되지 않으며 페이지를 벗어나면 완전히 파기됩니다.',
          },
        },
      ],
    },
  ],
};

export default function AdCheckPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* 구조화 데이터 JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 배경 글로우 효과 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        {/* 상단 브레드크럼 & 허브 링크 */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-slate-200 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/tools" className="hover:text-slate-200 transition flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-400" />
              <span>Tools Hub</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 font-medium">AdCheck Scanner</span>
          </nav>

          <Link
            href="/tools"
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <span>다른 무료 웹툴 보기</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>

        {/* 메인 히어로 섹션 */}
        <div className="text-center space-y-4 mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2026 직역별 전문직 법정 광고 규정 컴플라이언스 엔진</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            전문직 법정 광고 금칙어 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">1초 스캐너</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            포스팅 1건당 <strong>과태료 최대 5,000만원</strong> 및 <strong>자격정지 처분</strong> 방지 —
            변호사, 의사, 세무사, 노무사, 행정사 블로그 원고를 100% 무료로 즉시 진단하고 안전한 법률 대체어로 정제하세요.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400 pt-2 font-mono">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-400" /> 변호사법 제23조
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> 의료법 제56조
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-amber-400" /> 세무사법 제12조
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" /> 공인노무사법
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" /> 행정사법 제14조
            </span>
          </div>
        </div>

        {/* 인터랙티브 클라이언트 스캐너 */}
        <AdCheckClient />

        {/* 5. pSEO 롱테일 정보성 콘텐츠 (1,500자 이상 전문 가이드) */}
        <div className="mt-16 md:mt-24 space-y-12 border-t border-slate-800/80 pt-12">
          {/* 가이드 소개 */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" /> 2026 PROFESSIONAL COMPLIANCE GUIDE
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              왜 전문직 마케팅에서 광고 규정 준수가 필수적인가요?
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              2026년 현재 보건복지부, 대한변호사협회, 국세청 및 공정거래위원회는 온라인 블로그, SNS, 플레이스에 대한
              <strong>AI 기반 상시 모니터링 시스템</strong>을 가동하고 있습니다. 특히 경쟁 사무소나 타 병의원 간의
              악의적 신고가 빈번해지면서, 사소한 단어 선택 하나로 <strong>형사 처벌(1년 이하의 징역 또는 1천만원 이하의 벌금)</strong>,
              <strong>최대 1년의 자격 정지</strong>, <strong>업무정지 및 수천만원의 과징금</strong>이 부과되는 사례가 급증하고 있습니다.
            </p>
          </div>

          {/* 직역별 위반 및 처벌 기준표 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              전문직 직역별 대표 금칙어 및 위반 시 법정 처벌 수위
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-slate-200 uppercase font-mono text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">직역 구분</th>
                    <th className="p-3">근거 법령</th>
                    <th className="p-3">대표 적발 금칙어 사례</th>
                    <th className="p-3">법정 처벌 및 행정처분 수위</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-400" /> 변호사
                    </td>
                    <td className="p-3 font-mono text-slate-400">변호사법 제23조</td>
                    <td className="p-3 text-red-300 font-mono">100% 승소, 최고, 전관예우 암시, 수임료 파괴/할인</td>
                    <td className="p-3 text-slate-300">대한변협 징계처분(영구제명, 제명, 3년 이하 정직, 3천만원 이하 과태료)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-emerald-400" /> 의사 · 병원
                    </td>
                    <td className="p-3 font-mono text-slate-400">의료법 제56조</td>
                    <td className="p-3 text-red-300 font-mono">치료효과 보장, 부작용 없음, 전후사진 무단게시, 환자체험담</td>
                    <td className="p-3 text-slate-300">1년 이하 징역 또는 1천만원 이하 벌금, 의료기관 업무정지 1~3개월</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-amber-400" /> 세무사
                    </td>
                    <td className="p-3 font-mono text-slate-400">세무사법 제12조</td>
                    <td className="p-3 text-red-300 font-mono">환급률 1위, 최저가 기장료, 평균 환급액 단정, 전직 국세청 강조</td>
                    <td className="p-3 text-slate-300">기획재정부 징계(등록취소, 2년 이하 정직, 1천만원 이하 과태료)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-purple-400" /> 노무사
                    </td>
                    <td className="p-3 font-mono text-slate-400">공인노무사법 제20조</td>
                    <td className="p-3 text-red-300 font-mono">100% 부당해고 구제, 무조건 합의, 착수금 0원 미끼 수임</td>
                    <td className="p-3 text-slate-300">고용노동부 징계(등록취소, 업무정지, 과태료), 표시광고법 과징금</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-cyan-400" /> 행정사
                    </td>
                    <td className="p-3 font-mono text-slate-400">행정사법 제14조</td>
                    <td className="p-3 text-red-300 font-mono">음주운전 100% 구제, 담당 공무원 인맥, 비자 발급 보장</td>
                    <td className="p-3 text-slate-300">행정안전부 자격정지 처분, 경찰 고발 및 손해배상 청구</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 자주 묻는 질문 FAQ (구글 AI Overviews 최적화) */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              전문직 광고 규정 자주 묻는 질문 (FAQ)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-200 flex items-start gap-2">
                  <span className="text-blue-400 font-mono font-bold">Q.</span>
                  블로그에 실제 성공한 판결문이나 성공 사례를 올려도 되나요?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  의뢰인의 개인식별정보(이름, 주민번호, 거주지 등)를 완전히 마스킹하고 사실에 부합하는 사건 개요 및 법리 분석 중심이라면 가능합니다. 단, &lsquo;어떤 사건이든 이길 수 있다&rsquo;거나 성공 결과를 일반화하여 단정하는 문구는 허위·과장 광고에 해당합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-200 flex items-start gap-2">
                  <span className="text-blue-400 font-mono font-bold">Q.</span>
                  &lsquo;전문의&rsquo; 또는 &lsquo;전문 변호사&rsquo; 호칭은 아무나 쓸 수 없나요?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  네, 그렇습니다. 변호사는 대한변호사협회에 공식 등록된 전문분야(예: 형사전문, 이혼전문)에 한하여 공식 명칭을 쓸 수 있으며, 의사 역시 보건복지부가 인정한 전문과목 자격증을 보유한 경우에만 표기할 수 있습니다. 임의로 &lsquo;교통사고 1위 전문&rsquo; 등으로 표기하면 무자격 전문표기 위반입니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-200 flex items-start gap-2">
                  <span className="text-blue-400 font-mono font-bold">Q.</span>
                  치료 후기나 환자/의뢰인의 감사 카톡 캡처를 올려도 되나요?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  의료법의 경우 환자 치료 경험담 및 대가성 후기 게재는 전면 금지됩니다(의료법 제56조 제2항 제2호). 변호사나 세무사 역시 의뢰인의 자필 감사편지라 하더라도 타인의 승소 가능성을 오인하게 할 수 있는 표현이 포함되어 있다면 심의 위반 소지가 높으므로 배제해야 합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-200 flex items-start gap-2">
                  <span className="text-blue-400 font-mono font-bold">Q.</span>
                  광고 문안 검사기는 무료이며 횟수 제한이 없나요?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  네, PostSync AdCheck 스캐너는 전문직 종사자와 마케팅 담당자들을 위해 100% 무료로 무제한 제공됩니다. 사용자 브라우저상에서 즉각 연산되므로 개인정보 유출 걱정 없이 안심하고 활용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 푸터 네비게이션 */}
        <div className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 space-y-2">
          <p>© 2026 PostSync AI. All rights reserved. 본 서비스의 검사 결과는 정보 제공용이며 법적 효력을 갖는 공식 법률 자문이 아닙니다.</p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
            <Link href="/privacy" className="hover:text-white transition">개인정보처리방침</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition">이용약관</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">고객지원</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
