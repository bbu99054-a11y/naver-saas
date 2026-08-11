export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const kvState = await kv.get(`job:${jobId}`);
      if (kvState) {
        if ((kvState as any).status === 'COMPLETED' || (kvState as any).status === 'ERROR') {
          const article = await prisma.article.findFirst({ where: { job_id: jobId } });
          return NextResponse.json({ status: article?.status, content_html: article?.content_html, error_message: article?.error_message });
        }
        return NextResponse.json(kvState);
      }
    }

    const article = await prisma.article.findFirst({
      where: { job_id: jobId },
      select: { status: true, content_html: true, error_message: true }
    });

    if (!article) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Status API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
