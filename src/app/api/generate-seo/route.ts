import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { generateObject } from 'ai'
import { z } from 'zod'
import { google } from '@ai-sdk/google'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'
import { Client } from '@upstash/qstash'
import { kv } from '@vercel/kv'
import crypto from 'crypto'

export const maxDuration = 60; // For Planner + Tavily

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { id: user.id, email: user.email || '', credits: 5000, plan_type: 'free' }
      });
    }

    if (dbUser.credits <= 0) {
      return NextResponse.json({ error: '크레딧이 부족합니다. 요금제를 업그레이드해주세요.' }, { status: 403 })
    }

    const body = await req.json()
    const { prompt, tone, experience } = body
    if (!prompt) return NextResponse.json({ error: '타겟 키워드가 필요합니다.' }, { status: 400 })

    const jobId = crypto.randomUUID()
    
    let project = await prisma.project.findFirst({ where: { user_id: user.id }, orderBy: { created_at: 'asc' } });
    if (!project) {
      project = await prisma.project.create({ data: { user_id: user.id, project_name: '기본 프로젝트' } });
    }

    await prisma.article.create({
      data: {
        user_id: user.id,
        project_id: project.id,
        title: `${prompt} (SEO 최적화)`,
        target_keyword: prompt,
        status: 'SEARCHING',
        job_id: jobId
      }
    });

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`job:${jobId}`, { status: 'SEARCHING' }, { ex: 3600 });
    }

    let aiModel = dbUser.plan_type === 'pro' || dbUser.plan_type === 'premium' 
      ? anthropic('claude-5-sonnet-latest') 
      : google('gemini-1.5-flash');

    let serpCompetitorContext = '';
    if (process.env.TAVILY_API_KEY) {
      try {
        const serpRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: prompt, search_depth: 'basic', include_domains: ['blog.naver.com'], max_results: 5 }),
        });
        const serpData = await serpRes.json();
        if (serpData?.results?.length > 0) {
          const serpResults = serpData.results.map((r: any, i: number) => `[경쟁사 ${i + 1}] 제목: ${r.title}\n내용 요약: ${r.content}`).join('\n\n');
          serpCompetitorContext = `\n[현재 네이버 상위 노출 5개 경쟁사 블로그 구조 및 내용]\n${serpResults}\n`;
        }
      } catch (e: any) { console.error('SERP Error:', e) }
    }

    let searchQueries = [prompt];
    let outline = '';
    try {
      const plannerResult = await generateObject({
        model: aiModel,
        schema: z.object({
          searchQueries: z.array(z.string()),
          outline: z.string()
        }),
        prompt: `너는 네이버 상위 1% 마케팅 기획자야. 타겟 키워드: "${prompt}"\n${serpCompetitorContext}\n위 상위 노출된 경쟁사 글 5개의 흐름을 분석해서 독창적인 [서론-본론-결론] 뼈대(Outline)를 새로 창조해. 외부 RAG 검색을 위한 파생 검색어 2개도 함께 뽑아줘.`
      });
      searchQueries = plannerResult.object.searchQueries;
      outline = plannerResult.object.outline;
    } catch (e: any) { console.error('Planner Error:', e) }

    let tavilyCitations = null;
    if (process.env.TAVILY_API_KEY) {
      try {
        const searchPromises = searchQueries.map(q => 
          fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: q, search_depth: 'basic', max_results: 3 })
          }).then(res => res.json())
        );
        const results = await Promise.all(searchPromises);
        let allCitations: any[] = [];
        results.forEach(res => { if (res?.results) allCitations.push(...res.results); });
        
        const uniqueUrls = new Set();
        tavilyCitations = allCitations.filter(c => {
          if (uniqueUrls.has(c.url)) return false;
          uniqueUrls.add(c.url);
          return true;
        }).slice(0, 5);
      } catch (e: any) { console.error('Tavily Error:', e) }
    }

    // Update DB
    await prisma.article.updateMany({
      where: { job_id: jobId },
      data: {
        status: 'GENERATING',
        citations: tavilyCitations || []
      }
    });

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`job:${jobId}`, { status: 'GENERATING' }, { ex: 3600 });
    }

    if (process.env.QSTASH_TOKEN) {
      const qstashClient = new Client({ token: process.env.QSTASH_TOKEN });
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      await qstashClient.publishJSON({
        url: `${baseUrl}/api/worker/generator`,
        body: { jobId, prompt, tone, experience, outline, citations: tavilyCitations, userId: user.id },
      });
    } else if (process.env.NODE_ENV === 'development') {
        // Fallback for local development without QStash token
        const baseUrl = 'http://localhost:3000';
        fetch(`${baseUrl}/api/worker/generator`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId, prompt, tone, experience, outline, citations: tavilyCitations, userId: user.id })
        }).catch(console.error);
    }

    return NextResponse.json({ jobId, citations: tavilyCitations });

  } catch (error: any) {
    console.error('Generate SEO API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
