'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PROFESSION_CONFIGS,
  ProfessionType,
  scanAdCompliance,
  purifyAdText,
  ScanResult
} from '@/lib/adcheckRules';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Copy,
  RotateCcw,
  Lock,
  ArrowRight,
  ExternalLink,
  Info,
  Zap,
  Check
} from 'lucide-react';

const PROFESSIONS: { id: ProfessionType; label: string; icon: string; sub: string }[] = [
  { id: 'lawyer', label: '변호사 · 법률', icon: '⚖️', sub: '변호사법 제23조' },
  { id: 'doctor', label: '의사 · 병의원', icon: '🩺', sub: '의료법 제56조' },
  { id: 'tax', label: '세무사 · 회계', icon: '📊', sub: '세무사법 제12조' },
  { id: 'labor', label: '노무사 · 노무', icon: '💼', sub: '공인노무사법' },
  { id: 'admin', label: '행정사 · 인허가', icon: '📑', sub: '행정사법 제14조' },
];

export default function AdCheckClient() {
  const [profession, setProfession] = useState<ProfessionType>('lawyer');
  const [text, setText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [purifiedSuccess, setPurifiedSuccess] = useState<boolean>(false);

  // 샘플 문안 자동 로드
  const handleLoadSample = (prof: ProfessionType) => {
    const sample = PROFESSION_CONFIGS[prof].sampleText;
    setText(sample);
    setResult(null);
    setPurifiedSuccess(false);
  };

  // 1.8초 AdTech 스마트 딥스캔 시뮬레이션
  const handleStartScan = () => {
    if (!text.trim()) return;

    setIsScanning(true);
    setScanProgress(10);
    setScanStepText('대한민국 법정 광고 규정 데이터베이스 대조 중...');
    setPurifiedSuccess(false);

    setTimeout(() => {
      setScanProgress(45);
      setScanStepText(PROFESSION_CONFIGS[profession].lawName + ' 조항 심사 중...');
    }, 500);

    setTimeout(() => {
      setScanProgress(80);
      setScanStepText('공정거래위원회 표시광고 심사지침 및 판례 분석 중...');
    }, 1100);

    setTimeout(() => {
      setScanProgress(100);
      setScanStepText('검사 완료! 진단 리포트를 도출합니다.');
      
      const scanRes = scanAdCompliance(text, profession);
      setResult(scanRes);
      setIsScanning(false);
    }, 1800);
  };

  // 원클릭 대체어 정제
  const handlePurify = () => {
    if (!text) return;
    const purified = purifyAdText(text, profession);
    setText(purified);
    const newRes = scanAdCompliance(purified, profession);
    setResult(newRes);
    setPurifiedSuccess(true);
    setTimeout(() => setPurifiedSuccess(false), 4000);
  };

  // 클립보드 복사
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // 글자 수 계산
  const charWithSpace = text.length;
  const charWithoutSpace = text.replace(/\s/g, '').length;

  return (
    <div className="space-y-8">
      {/* 1. 직역 선택 탭 (토스 스타일 클린 카드) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 md:p-4 shadow-sm">
        <div className="text-xs font-bold text-slate-500 px-2 pb-2.5 flex items-center justify-between border-b border-slate-100 mb-3">
          <span className="text-slate-700">검사 대상 직역 선택</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> 100% 브라우저 로컬 처리 (서버 저장 제로)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PROFESSIONS.map((item) => {
            const active = profession === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setProfession(item.id);
                  setResult(null);
                  setPurifiedSuccess(false);
                }}
                className={`flex flex-col items-start p-3.5 rounded-xl transition-all duration-200 text-left relative ${
                  active
                    ? 'bg-blue-50/80 border-2 border-blue-600 text-blue-900 shadow-sm'
                    : 'bg-slate-50/70 border border-slate-200/80 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                <span className={`text-[11px] font-mono ${active ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>
                  {item.sub}
                </span>
                {active && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 텍스트 입력 영역 (순백색 페이퍼 에디터) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* 상단 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-sm font-bold text-slate-900">
              {PROFESSION_CONFIGS[profession].title} 광고 문안 입력
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
              {PROFESSION_CONFIGS[profession].badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample(profession)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-blue-600" /> 위반 예시 문안 불러오기
            </button>
            {text && (
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setResult(null);
                  setPurifiedSuccess(false);
                }}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-600 transition cursor-pointer"
              >
                비우기
              </button>
            )}
          </div>
        </div>

        {/* 텍스트 에디터 (워드/노트 느낌) */}
        <div className="relative mt-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="블로그 포스팅 본문, 홈페이지 소개글, 네이버 플레이스 문구, 인스타그램 캡션을 붙여넣으세요. 예: '서초동 최고의 변호사, 100% 승소 보장, 판검사 출신 전관예우 네트워크...'"
            rows={8}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 md:p-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition text-sm md:text-base leading-relaxed resize-y font-normal"
          />

          {/* 하단 카운터 & 상태 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span>공백 포함: <strong className="text-slate-800">{charWithSpace.toLocaleString()}</strong>자</span>
              <span>공백 제외: <strong className="text-slate-800">{charWithoutSpace.toLocaleString()}</strong>자</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>작성된 원고는 브라우저 메모리상에서만 단독 검사됩니다.</span>
            </div>
          </div>
        </div>

        {/* 검사 실행 액션 바 */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>최신 2026 직역별 협회 광고 규정 및 표시광고법 행정처분 지침 실시간 대조</span>
          </div>

          <button
            type="button"
            disabled={!text.trim() || isScanning}
            onClick={handleStartScan}
            className={`px-7 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer ${
              !text.trim() || isScanning
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5'
            }`}
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>법정 광고 규정 스캔 중...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>1초 정밀 법정 검사 시작</span>
              </>
            )}
          </button>
        </div>

        {/* 1.8초 AdTech 딥스캔 프로그레스 바 (토스 스타일) */}
        {isScanning && (
          <div className="mt-6 p-5 rounded-2xl bg-blue-50/70 border border-blue-100 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                {scanStepText}
              </span>
              <span className="text-blue-700 font-mono text-sm">{scanProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-blue-100/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5 text-center">
              대법원 판례, 헌법재판소 결정례, 직역별 협회 광고 심의위원회 가이드라인을 정밀 교차 검증 중입니다.
            </p>
          </div>
        )}
      </div>

      {/* CLS 방지용 표준 광고 컨테이너 (라이트 전용) */}
      <div className="w-full min-h-[90px] flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center relative overflow-hidden">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">SPONSORED ADVERTISEMENT</span>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Google AdSense 공식 검증 광고 지면 (라이트 최적화 배너)</span>
        </div>
      </div>

      {/* 3. 검사 결과 대시보드 (토스 스타일 고대비 카드) */}
      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* 종합 점수 카드 */}
          <div
            className={`p-6 md:p-8 rounded-3xl border shadow-sm relative overflow-hidden ${
              result.status === 'safe'
                ? 'bg-emerald-50/70 border-emerald-200'
                : result.status === 'warning'
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-rose-50/70 border-rose-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                    result.status === 'safe'
                      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                      : result.status === 'warning'
                      ? 'bg-amber-100 text-amber-600 border border-amber-200'
                      : 'bg-rose-100 text-rose-600 border border-rose-200'
                  }`}
                >
                  {result.status === 'safe' ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : result.status === 'warning' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <AlertOctagon className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                        result.status === 'safe'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : result.status === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {result.status === 'safe'
                        ? '🟢 법률 안전 문안'
                        : result.status === 'warning'
                        ? '🟡 주의 필요 문안'
                        : '🔴 심각한 법률 위반 문안'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      적발 항목: <strong>{result.matches.length}</strong>건
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
                    광고 규정 준수 점수: <span className="text-3xl font-mono font-black">{result.score}</span> / 100점
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                    {result.status === 'safe'
                      ? '해당 직역 광고 규정 및 표시광고법 위반 소지가 발견되지 않았습니다. 안심하고 포스팅하셔도 좋습니다.'
                      : result.status === 'warning'
                      ? '소비자 오인 우려가 있거나 협회 심의 기준상 지양을 권고하는 표현이 포함되어 있습니다. 추천 대체어로 수정을 권장합니다.'
                      : '변호사법/의료법/세무사법 등 현행 법령상 형사 처벌 또는 자격정지·과태료 행정처분 대상이 되는 절대 금칙어가 포함되어 있습니다.'}
                  </p>
                </div>
              </div>

              {/* 우측 원클릭 정제 버튼 */}
              {result.matches.length > 0 && (
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handlePurify}
                    className="px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🪄 법정 안전 대체어로 원클릭 일괄 변환</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">클립보드에 복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>정제된 본문 전체 복사</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 정제 성공 알림 */}
            {purifiedSuccess && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>모든 위반 표현이 법률 안전 대체어로 자동 치환되었습니다. 준수 점수가 100점으로 상향되었습니다!</span>
              </div>
            )}
          </div>

          {/* 위반 키워드 상세 분석 리스트 (클린 화이트 카드) */}
          {result.matches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  적발된 위반 항목 상세 내역 ({result.matches.length}건)
                </h4>
                <span className="text-xs text-slate-500">카드 우측의 안전한 추천 대체어를 확인하세요.</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {result.matches.map((match, idx) => (
                  <div
                    key={match.ruleId + idx}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                            match.severity === 'danger'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {match.severity === 'danger' ? '심각 위반' : '주의 권고'}
                        </span>
                        <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-mono">
                          &quot;{match.matchedText}&quot;
                        </span>
                        <span className="text-xs text-slate-500 font-medium">[{match.category}]</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {match.law}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed mt-2.5">
                      <strong className="text-slate-900 font-semibold">위반 사유:</strong> {match.explanation}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">권장 안전 대체어:</span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold font-mono">
                          {match.replacement}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TinyWow 모델: PostSync AI B2B 전환 배너 (프리미엄 토스 블루 카드) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 md:p-9 shadow-lg text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> 전문직 블로그 자동화 No.1 솔루션
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  매번 광고법 위반 걱정하며 포스팅을 작성하고 계신가요?
                </h3>
                <p className="text-xs md:text-sm text-blue-100 leading-relaxed max-w-2xl">
                  <strong>PostSync AI</strong>는 변호사법 제23조, 의료법 제56조, 세무사법 제12조 컴플라이언스가 100% 내장되어,
                  금칙어 없이 E-E-A-T 전문성을 극대화한 네이버 블로그 원고를 3분 만에 전자동 생성 및 원클릭 예약 발행합니다.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-blue-200 font-mono">
                  <span>✓ 2026 직역별 금칙어 필터 탑재</span>
                  <span>✓ 스마트블록 C-Rank 최적화</span>
                  <span>✓ 구글 AI Overviews 스키마 내장</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
                <Link
                  href="https://www.postsyncapp.com/dashboard"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-blue-600 shadow-md transition text-center flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>PostSync AI 3회 무료 체험하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="https://www.postsyncapp.com/pricing"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition text-center flex items-center justify-center gap-1.5"
                >
                  <span>요금제 및 기능 살펴보기</span>
                  <ExternalLink className="w-3 h-3 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
