'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function checkKeywordDuplicate(keyword: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // 30일 이내에 동일한 타겟 키워드로 생성된 Article이 있는지 확인
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const existingArticle = await prisma.article.findFirst({
    where: {
      user_id: user.id,
      target_keyword: keyword,
      created_at: {
        gte: thirtyDaysAgo
      }
    }
  })

  return !!existingArticle
}

export interface RankResult {
  isRanked: boolean;
  rank: number | null;
  snippet?: string;
  searchUrl: string;
  estimatedMonthlyViews: number;
  savedAdCost: number;
  message: string;
}

export async function getNaverSearchUrl(keyword: string): Promise<string> {
  const cleanKeyword = (keyword || '').trim()
  return `https://search.naver.com/search.naver?query=${encodeURIComponent(cleanKeyword)}`
}
