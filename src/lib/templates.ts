export const colorPalettes = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Amber/Orange
  '#f43f5e', // Rose
  '#0ea5e9', // Sky Blue
  '#10b981', // Emerald
];

export function getRandomColor(): string {
  return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
}

export function getInfoBoxTemplate(color: string): string {
  const styles = [
    `
[정보 박스 템플릿 A]
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${color}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
  <strong style="color: ${color}; display: block; margin-bottom: 8px;">💡 주목해 주세요!</strong>
  <p style="margin: 0; color: #334155;">(여기에 핵심 요약 내용 작성)</p>
</div>
    `,
    `
[정보 박스 템플릿 B]
<div style="background-color: ${color}15; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
  <strong style="color: ${color}; font-size: 1.1em; display: block; margin-bottom: 12px;">📌 알아두면 좋은 꿀팁</strong>
  <p style="margin: 0; color: #475569;">(여기에 팁 내용 작성)</p>
</div>
    `
  ];
  return styles[Math.floor(Math.random() * styles.length)].trim();
}

export function getQuoteTemplate(color: string): string {
  const styles = [
    `
[인용구 템플릿 A]
<blockquote style="border-left: 4px solid ${color}; background-color: #f8fafc; padding: 16px 20px; margin: 0 0 24px 0; color: #475569; font-style: normal;">
  <strong>" (여기에 전문가 멘트나 강조하고 싶은 문구 작성) "</strong>
</blockquote>
    `,
    `
[인용구 템플릿 B]
<div style="text-align: center; margin: 32px 0;">
  <span style="font-size: 24px; color: ${color}; opacity: 0.5;">❝</span>
  <p style="font-size: 1.1em; font-weight: bold; color: #1e293b; margin: 8px 0;">(여기에 감성적이거나 핵심적인 멘트 작성)</p>
  <span style="font-size: 24px; color: ${color}; opacity: 0.5;">❞</span>
</div>
    `
  ];
  return styles[Math.floor(Math.random() * styles.length)].trim();
}

export function getTableTemplate(color: string): string {
  return `
[비교 분석 표 템플릿]
<table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
  <thead>
    <tr>
      <th style="background-color: ${color}; color: white; padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">(비교 항목 1)</th>
      <th style="background-color: ${color}; color: white; padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">(비교 항목 2)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: white;">(내용 1)</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: white;">(내용 2)</td>
    </tr>
  </tbody>
</table>
  `.trim();
}

export function getDividerTemplate(color: string): string {
  const styles = [
    `
[구분선 템플릿 A]
<div style="width: 50px; height: 3px; background-color: ${color}; margin: 32px auto;"></div>
    `,
    `
[구분선 템플릿 B]
<hr style="border: none; border-top: 1px dashed #cbd5e1; margin: 32px 0;" />
    `
  ];
  return styles[Math.floor(Math.random() * styles.length)].trim();
}

export function getStepByStepTemplate(color: string): string {
  return `
[단계별 가이드 템플릿]
<div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
  <div style="background-color: white; border-radius: 8px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
    <span style="background-color: ${color}; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold; margin-right: 8px; font-size: 0.9em;">1단계</span>
    <strong style="color: #1e293b;">(단계 제목)</strong>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 0.95em;">(단계 상세 설명)</p>
  </div>
  <div style="background-color: white; border-radius: 8px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
    <span style="background-color: ${color}; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold; margin-right: 8px; font-size: 0.9em;">2단계</span>
    <strong style="color: #1e293b;">(단계 제목)</strong>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 0.95em;">(단계 상세 설명)</p>
  </div>
</div>
  `.trim();
}
