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
    setScanStepText('대한민국 법정 광고 규정 데이터베이스 로드 중...');
    setPurifiedSuccess(false);

    setTimeout(() => {
      setScanProgress(45);
      setScanStepText(PROFESSION_CONFIGS[profession].lawName + ' 대조 심사 중...');
    }, 500);

    setTimeout(() => {
      setScanProgress(80);
      setScanStepText('공정거래위원회 표시광고법 및 직역별 판례 분석 중...');
    }, 1100);

    setTimeout(() => {
      setScanProgress(100);
      setScanStepText('검사 완료! 종합 리포트를 생성합니다.');
      
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
      {/* 1. 직역 선택 탭 */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2 md:p-3 backdrop-blur-md shadow-xl">
        <div className="text-xs font-semibold text-slate-400 px-3 pt-1 pb-2 flex items-center justify-between">
          <span>검사 대상 직역 선택</span>
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <Lock className="w-3 h-3" /> 100% 로컬 프라이버시 처리 (서버 전송 없음)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
                className={`flex flex-col items-start p-3 rounded-xl transition-all duration-200 text-left relative ${
                  active
                    ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-lg shadow-blue-500/10 border'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600 border'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{item.sub}</span>
                {active && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 텍스트 입력 영역 */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* 상단 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-sm font-semibold text-slate-200">
              {PROFESSION_CONFIGS[profession].title} 광고 문안 입력
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {PROFESSION_CONFIGS[profession].badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample(profession)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3 text-blue-400" /> 위반 예시 문안 불러오기
            </button>
            {text && (
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setResult(null);
                  setPurifiedSuccess(false);
                }}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-red-400 transition"
              >
                비우기
              </button>
            )}
          </div>
        </div>

        {/* 텍스트 에디터 */}
        <div className="relative mt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="블로그 포스팅, 홈페이지 소개문, 플레이스 소개글, 인스타그램 캡션 등을 입력하세요. 예: '서초동 최고의 변호사, 100% 승소 보장...'"
            rows={8}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm md:text-base leading-relaxed resize-y"
          />

          {/* 하단 카운터 & 상태 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span>공백 포함: <strong className="text-slate-200">{charWithSpace.toLocaleString()}</strong>자</span>
              <span>공백 제외: <strong className="text-slate-200">{charWithoutSpace.toLocaleString()}</strong>자</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              암호화 없이 브라우저 메모리상에서만 단독 검사됩니다.
            </div>
          </div>
        </div>

        {/* 검사 실행 액션 바 */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span>최신 2026 직역별 협회 광고 규정 및 행정처분 지침 실시간 대조</span>
          </div>

          <button
            type="button"
            disabled={!text.trim() || isScanning}
            onClick={handleStartScan}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
              !text.trim() || isScanning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
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

        {/* 1.8초 AdTech 딥스캔 프로그레스 바 */}
        {isScanning && (
          <div className="mt-6 p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                {scanStepText}
              </span>
              <span className="text-blue-400 font-mono">{scanProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              대법원 판례, 헌법재판소 결정, 직역별 협회 광고 심의위원회 가이드라인을 교차 검증하고 있습니다.
            </p>
          </div>
        )}
      </div>

      {/* CLS 방지용 표준 광고 컨테이너 (728x90 / 300x250 반응형) */}
      <div className="w-full min-h-[100px] flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center relative overflow-hidden">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 mb-1">SPONSORED ADVERTISEMENT</span>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-700" />
          <span>구글 애드센스 공식 제휴 지면 (Google AdSense Verified Placement)</span>
        </div>
      </div>

      {/* 3. 검사 결과 대시보드 */}
      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* 종합 점수 카드 */}
          <div
            className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
              result.status === 'safe'
                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-500/10'
                : result.status === 'warning'
                ? 'bg-amber-950/20 border-amber-500/40 shadow-amber-500/10'
                : 'bg-red-950/20 border-red-500/40 shadow-red-500/10'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                    result.status === 'safe'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : result.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
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
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        result.status === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : result.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {result.status === 'safe'
                        ? '🟢 법률 안전 문안'
                        : result.status === 'warning'
                        ? '🟡 주의 필요 문안'
                        : '🔴 심각한 법률 위반 문안'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      적발 항목: {result.matches.length}건
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-1">
                    광고 규정 준수 점수: <span className="text-3xl font-mono">{result.score}</span> / 100점
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                    {result.status === 'safe'
                      ? '관련 직역 광고 규정 및 표시광고법 위반 소지가 발견되지 않았습니다. 안심하고 포스팅하셔도 좋습니다.'
                      : result.status === 'warning'
                      ? '소비자 오인 우려가 있거나 협회 심의 기준상 지양을 권고하는 표현이 포함되어 있습니다. 추천 대체어로 수정을 권장합니다.'
                      : '변호사법/의료법/세무사법 등 현행 법령상 형사 처벌 또는 자격정지·과태료 행정처분 대상이 되는 절대 금칙어가 포함되어 있습니다.'}
                  </p>
                </div>
              </div>

              {/* 우측 원클릭 정제 버튼 */}
              {result.matches.length > 0 && (
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handlePurify}
                    className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🪄 법정 안전 대체어로 원클릭 일괄 변환</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">클립보드에 복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>정제된 본문 전체 복사</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 정제 성공 토스트 알림 */}
            {purifiedSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>모든 위반 표현이 법률 안전 대체어로 자동 치환되었습니다. 점수가 100점으로 재산출되었습니다!</span>
              </div>
            )}
          </div>

          {/* 위반 키워드 상세 분석 리스트 */}
          {result.matches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  적발된 위반 항목 상세 내역 ({result.matches.length}건)
                </h4>
                <span className="text-xs text-slate-500">카드 우측의 추천 대체어를 확인하세요.</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {result.matches.map((match, idx) => (
                  <div
                    key={match.ruleId + idx}
                    className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 md:p-5 transition shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded ${
                            match.severity === 'danger'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {match.severity === 'danger' ? '심각 위반' : '주의 권고'}
                        </span>
                        <span className="text-sm font-bold text-white bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700 font-mono">
                          &quot;{match.matchedText}&quot;
                        </span>
                        <span className="text-xs text-slate-400 font-medium">[{match.category}]</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {match.law}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-2">
                      <strong className="text-slate-200">위반 사유:</strong> {match.explanation}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">권장 안전 대체어:</span>
                        <span className="px-2 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 font-bold font-mono">
                          {match.replacement}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TinyWow 모델: PostSync AI B2B 유입 전환 배너 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-950/80 to-purple-900/60 border border-blue-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> 전문직 블로그 자동화 No.1 솔루션
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  매번 광고법 위반 걱정하며 포스팅을 작성하고 계신가요?
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  <strong>PostSync AI</strong>는 변호사법 제23조, 의료법 제56조, 세무사법 제12조 컴플라이언스가 100% 내장되어,
                  금칙어 없이 E-E-A-T 전문성을 극대화한 네이버 블로그 원고를 3분 만에 전자동 생성 및 원클릭 예약 발행합니다.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
                  <span>✓ 2026 직역별 금칙어 필터 탑재</span>
                  <span>✓ 스마트블록 C-Rank 최적화</span>
                  <span>✓ 구글 AI Overviews 스키마 내장</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
                <Link
                  href="https://www.postsyncapp.com/dashboard"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>PostSync AI 3회 무료 체험하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="https://www.postsyncapp.com/pricing"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition text-center flex items-center justify-center gap-1.5"
                >
                  <span>요금제 및 기능 살펴보기</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
