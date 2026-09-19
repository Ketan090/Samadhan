import { NextRequest, NextResponse } from 'next/server';

// Same-origin forwarder for photo analysis. The Next.js dev rewrite proxy
// drops large multipart uploads (ECONNRESET → "AI server unreachable"), so
// this route forwards with native fetch instead. Takes precedence over the
// /api/* rewrite in next.config.mjs.
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  // Same local-first default as next.config.mjs (see comment there).
  const BACKEND = (process.env.BACKEND_URL || 'http://localhost:5000').trim();
  try {
    const fd = await req.formData();
    const upstream = await fetch(`${BACKEND}/api/vision/analyze`, {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(110000) as any,
    });
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch (e: any) {
    // Distinguish our own 110s timeout (backend slow, not dead) from a
    // connection failure, so the UI doesn't claim the backend is down
    // when it is simply still working through slow AI providers.
    const timedOut = e?.name === 'AbortError' || e?.name === 'TimeoutError';
    return NextResponse.json(
      timedOut
        ? { success: false, demo: true, message: 'AI is taking too long (slow providers). Press Retry AI scan — the backend caches results, so the retry is usually instant.' }
        : { success: false, demo: true, message: 'AI bridge failed — backend unreachable. Is it running on :5000?' },
      { status: 502 }
    );
  }
}
