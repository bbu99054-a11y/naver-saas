/**
 * 네이버 신디케이션 v2 (Naver Syndication API)
 *
 * 네이버 서치어드바이저는 검색 통계 조회 REST API를 제공하지 않으며,
 * 새 글 발행/수정 시 네이버 검색 봇에게 즉시 수집을 요청하는 '신디케이션 v2' API를 유일하게 지원합니다.
 *
 * 네이버 서치어드바이저 웹 콘솔에서 신디케이션 토큰을 발급받아 NAVER_SYNDICATION_TOKEN에 등록하면 동작합니다.
 */

export interface SyndicationEntry {
  id: string; // 고유 URL (예: https://www.postsyncapp.com/blog/example-post)
  title: string;
  author: string;
  updated: string; // ISO 8601 형식
  published?: string;
  summary?: string;
  content?: string;
}

export async function pingNaverSyndication(entry: SyndicationEntry): Promise<{ success: boolean; message: string }> {
  const token = process.env.NAVER_SYNDICATION_TOKEN;

  if (!token) {
    return {
      success: false,
      message: "NAVER_SYNDICATION_TOKEN 환경변수가 설정되지 않아 신디케이션 핑 전송을 건너뜁니다.",
    };
  }

  // Atom 1.0 규격 신디케이션 XML 생성
  const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PostSync</title>
  <updated>${entry.updated}</updated>
  <entry>
    <id>${entry.id}</id>
    <title><![CDATA[${entry.title}]]></title>
    <author>
      <name>${entry.author}</name>
    </author>
    <updated>${entry.updated}</updated>
    ${entry.published ? `<published>${entry.published}</published>` : ""}
    <link rel="alternate" type="text/html" href="${entry.id}" />
    ${entry.summary ? `<summary type="text"><![CDATA[${entry.summary}]]></summary>` : ""}
  </entry>
</feed>`;

  try {
    const response = await fetch("https://apis.naver.com/crawl/nsyndi/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/xml",
      },
      body: xmlPayload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `네이버 신디케이션 핑 전송 실패 (상태 코드: ${response.status}): ${errorText}`,
      };
    }

    return {
      success: true,
      message: "네이버 신디케이션 핑 전송 완료 (검색 수집 봇 호출 성공)",
    };
  } catch (error) {
    return {
      success: false,
      message: `네이버 신디케이션 전송 중 네트워크 오류: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
