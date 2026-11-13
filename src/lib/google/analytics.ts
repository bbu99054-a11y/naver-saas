import { google } from "googleapis";
import { getGoogleAuthClient } from "./auth";

const DEFAULT_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "546100897";

export interface GA4OverviewOptions {
  propertyId?: string;
  days?: number;
}

export interface GA4OverviewSummary {
  propertyId: string;
  startDate: string;
  endDate: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  dailyTrends: {
    date: string;
    activeUsers: number;
    sessions: number;
    screenPageViews: number;
  }[];
}

/**
 * 구글 애널리틱스 4 (GA4) 종합 개요 지표를 조회합니다.
 */
export async function getGA4Overview(
  options: GA4OverviewOptions = {}
): Promise<GA4OverviewSummary> {
  const { propertyId = DEFAULT_PROPERTY_ID, days = 7 } = options;

  const authClient = await getGoogleAuthClient();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth: authClient as any });

  const dateRange = {
    startDate: `${days}daysAgo`,
    endDate: "yesterday",
  };

  // 1. 전체 합산 지표
  const totalReport = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [dateRange],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
    },
  });

  const totalRow = totalReport.data.rows?.[0]?.metricValues || [];
  const activeUsers = parseInt(totalRow[0]?.value || "0", 10);
  const newUsers = parseInt(totalRow[1]?.value || "0", 10);
  const sessions = parseInt(totalRow[2]?.value || "0", 10);
  const screenPageViews = parseInt(totalRow[3]?.value || "0", 10);
  const averageSessionDuration = Math.round(parseFloat(totalRow[4]?.value || "0"));
  const bounceRate = Math.round(parseFloat(totalRow[5]?.value || "0") * 1000) / 10;

  // 2. 일별 추이 지표
  const dailyReport = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [dateRange],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
        },
      ],
    },
  });

  const dailyTrends = (dailyReport.data.rows || []).map((row) => {
    const rawDate = row.dimensionValues?.[0]?.value || "";
    const formattedDate =
      rawDate.length === 8
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : rawDate;

    return {
      date: formattedDate,
      activeUsers: parseInt(row.metricValues?.[0]?.value || "0", 10),
      sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
      screenPageViews: parseInt(row.metricValues?.[2]?.value || "0", 10),
    };
  });

  return {
    propertyId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    activeUsers,
    newUsers,
    sessions,
    screenPageViews,
    averageSessionDuration,
    bounceRate,
    dailyTrends,
  };
}

/**
 * 최근 30분 실시간 활성 사용자 수를 조회합니다.
 */
export async function getGA4RealtimeUsers(propertyId = DEFAULT_PROPERTY_ID): Promise<number> {
  const authClient = await getGoogleAuthClient();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth: authClient as any });

  const realtimeReport = await analyticsdata.properties.runRealtimeReport({
    property: `properties/${propertyId}`,
    requestBody: {
      metrics: [{ name: "activeUsers" }],
    },
  });

  const value = realtimeReport.data.rows?.[0]?.metricValues?.[0]?.value || "0";
  return parseInt(value, 10);
}
