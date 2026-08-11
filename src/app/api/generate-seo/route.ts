import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Client } from '@upstash/qstash'
import { kv } from '@vercel/kv'
import crypto from 'crypto'

export const maxDuration = 60; // For Tavily only

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

    let tavilyCitations: any = null;
    if (process.env.TAVILY_API_KEY) {
      try {
        const searchRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: prompt, search_depth: 'basic', max_results: 5 })
        });
        const searchData = await searchRes.json();
        if (searchData?.results) {
          tavilyCitations = searchData.results;
        }
      } catch (e: any) { console.error('Tavily Error:', e) }
    }

    // Update DB to PLANNING state
    await prisma.article.updateMany({
      where: { job_id: jobId },
      data: {
        status: 'PLANNING',
        citations: tavilyCitations || []
      }
    });

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`job:${jobId}`, { status: 'PLANNING' }, { ex: 3600 });
    }

    if (process.env.QSTASH_TOKEN) {
      const qstashClient = new Client({ token: process.env.QSTASH_TOKEN, ...(process.env.QSTASH_URL && { baseUrl: process.env.QSTASH_URL }) });
      const host = req.headers.get('host');
      const fallbackHost = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'localhost:3000';
      const finalHost = host || fallbackHost;
      const protocol = finalHost.includes('localhost') ? 'http' : 'https';
      const baseUrl = finalHost.startsWith('http') ? finalHost : `${protocol}://${finalHost}`;
            try {
        await qstashClient.publishJSON({
          url: `${baseUrl}/api/worker/planner`,
          body: { jobId, prompt, tone, experience, citations: tavilyCitations, userId: user.id },
        });
      } catch (pubErr: any) {
        console.error('QStash Publish Failed:', pubErr);
        await prisma.article.updateMany({ where: { job_id: jobId }, data: { status: 'ERROR', error_message: 'QStash 큐 등록 실패' } });
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
          await kv.set(`job:${jobId}`, { status: 'ERROR', error_message: 'QStash 큐 등록 실패' }, { ex: 3600 });
        }
        throw pubErr;
      }
    }

    return NextResponse.json({ jobId, citations: tavilyCitations });

  } catch (error: any) {
    console.error('Generate SEO API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
