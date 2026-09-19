import { NextRequest, NextResponse } from 'next/server';
import { analyzeDirect, directKeysPresent } from '@/lib/visionDirect';

// Same-origin photo analysis with two paths:
// 1) BRIDGE (local dev default): forwards to the Express backend :5000 —
//    full traversal, caching, CV merge. The Next.js dev rewrite proxy drops
//    large multipart uploads, so this route forwards with native fetch.
// 2) DIRECT (serverless/Vercel): when the bridge is unreachable AND provider
//    keys exist (XKIRO_API_KEY / NVIDIA_API_KEY / UNO_API_KEY), the route
//    calls the AI providers itself — no backend hosting needed.
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const langName = (raw: string) => {
  const m: Record<string, string> = { en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', bn: 'Bengali', gu: 'Gujarati', pa: 'Punjabi', ur: 'Urdu', or: 'Odia', as: 'Assamese', vi: 'Vietnamese' };
  const l = String(raw || 'en').slice(0, 5).toLowerCase();
  return m[l] || m[l.slice(0, 2)] || 'English';
};

export async function POST(req: NextRequest) {
  // Same local-first default as next.config.mjs (see comment there).
  const BACKEND = (process.env.BACKEND_URL || 'http://localhost:5000').trim();
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ success: false, demo: true, message: 'Could not read the uploaded photo. Please try again.' }, { status: 400 });
  }
  // Image bytes for the direct fallback (bridge forwards the FormData as-is).
  let b64 = '';
  let lang = 'en';
  try {
    const f = fd.get('image');
    if (f && typeof f !== 'string') {
      if (f.size > 15 * 1024 * 1024) {
        return NextResponse.json({ success: false, demo: true, message: 'Photo exceeds 15MB — please pick a smaller one.' }, { status: 413 });
      }
      b64 = Buffer.from(await f.arrayBuffer()).toString('base64');
    }
    lang = langName(String(fd.get('lang') || 'en'));
  } catch { /* bridge may still succeed; direct just won't be available */ }

  try {
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
    // Bridge failed — try the direct serverless path before giving up.
    if (b64 && directKeysPresent()) {
      try {
        const { engine, model, data } = await analyzeDirect(b64, lang);
        return NextResponse.json({ success: true, engine, demo: false, data, model });
      } catch (de: any) {
        return NextResponse.json(
          { success: false, demo: true, message: 'All AI providers are busy right now. Please retry in 30s — or continue manually.' },
          { status: 502 }
        );
      }
    }
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
