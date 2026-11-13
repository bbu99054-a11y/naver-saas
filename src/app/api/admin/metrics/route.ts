import { NextResponse } from "next/server";
import { z } from "zod";
import { getSearchConsolePerformance } from "@/lib/google/searchConsole";
import { getGA4Overview, getGA4RealtimeUsers } from "@/lib/google/analytics";
import { verifyTimingSafeSecret } from "@/lib/rateLimit";

const querySchema = z.object({
  days: z.coerce.number().min(1).max(90).default(7),
});

export async function GET(request: Request) {
  try {
    const expectedToken = process.env.ADMIN_METRICS_TOKEN;
    if (!expectedToken || !expectedToken.trim()) {
      return NextResponse.json(
        { error: "관리자 API 보안 토큰이 설정되지 않아 접근이 차단되었습니다." },
        { status: 503 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const customToken = request.headers.get("x-admin-token") || "";
    const providedToken = bearerToken || customToken;

    if (!verifyTimingSafeSecret(expectedToken, providedToken)) {
      return NextResponse.json(
        { error: "관리자 인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      days: searchParams.get("days") || 7,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "잘못된 요청 파라미터입니다.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { days } = parsed.data;

    // 병렬로 구글 서치콘솔 및 GA4 데이터 수집
    const [searchConsoleData, ga4Data, realtimeUsers] = await Promise.allSettled([
      getSearchConsolePerformance({ days }),
      getGA4Overview({ days }),
      getGA4RealtimeUsers(),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      periodDays: days,
      searchConsole:
        searchConsoleData.status === "fulfilled"
          ? searchConsoleData.value
          : { error: searchConsoleData.reason?.message || "서치콘솔 조회 실패" },
      analytics:
        ga4Data.status === "fulfilled"
          ? ga4Data.value
          : { error: ga4Data.reason?.message || "GA4 조회 실패" },
      realtimeActiveUsers:
        realtimeUsers.status === "fulfilled" ? realtimeUsers.value : 0,
      naverSearchAdvisorNotice:
        "네이버 서치어드바이저는 통계 조회 공식 REST API를 제공하지 않으며, 신디케이션(수집 핑) v2 API만 연동 지원됩니다.",
    });
  } catch (error) {
    console.error("Metrics API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "지표 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
