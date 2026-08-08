import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'business';
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    // Fallback: If no API key is provided, fallback to Pollinations AI
    if (!accessKey) {
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=800&height=600&nologo=true`;
      return NextResponse.redirect(fallbackUrl);
    }

    // Call Unsplash API
    const res = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${accessKey}`, {
      // Don't cache to get a random image every time
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('Unsplash API error:', await res.text());
      // Fallback on error
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=800&height=600&nologo=true`;
      return NextResponse.redirect(fallbackUrl);
    }

    const data = await res.json();
    
    // Redirect to the actual image URL
    if (data && data.urls && data.urls.regular) {
      return NextResponse.redirect(data.urls.regular);
    }

    // Fallback if structure is weird
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=800&height=600&nologo=true`;
    return NextResponse.redirect(fallbackUrl);

  } catch (error) {
    console.error('Proxy Unsplash Error:', error);
    // Generic fallback on fatal error
    return NextResponse.redirect('https://image.pollinations.ai/prompt/professional%20office?width=800&height=600&nologo=true');
  }
}
