import { NextRequest, NextResponse } from 'next/server';
import { generateDirectText, directKeysPresent } from '@/lib/visionDirect';

// AI field writer for the solution form. Bridge-first (Express backend),
// direct serverless fallback (Vercel) when the bridge is unreachable and
// provider keys exist. Response shape matches the backend in both paths:
// { success, field, text?, items?, steps?, model }.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const BACKEND = (process.env.BACKEND_URL || 'http://localhost:5000').trim();
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }
  const { field, challenge } = body || {};
  if (!field || !challenge) {
    return NextResponse.json({ success: false, message: 'field and challenge required.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${BACKEND}/api/vision/draft-solution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, challenge }),
      signal: AbortSignal.timeout(55000) as any,
    });
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch {
    if (!directKeysPresent()) {
      return NextResponse.json(
        { success: false, message: 'AI writer unreachable — backend down and no provider keys configured.' },
        { status: 502 }
      );
    }
    try {
      const c = typeof challenge === 'string' ? challenge : JSON.stringify({
        title: challenge.title,
        description: String(challenge.description || '').slice(0, 800),
        category: challenge.category,
        location: challenge.location || `${challenge.city || ''} ${challenge.state || ''}`.trim(),
      }).slice(0, 1200);
      const out = await generateDirectText(String(field), c);
      return NextResponse.json({ success: true, field, ...out });
    } catch (de: any) {
      return NextResponse.json(
        { success: false, message: 'All AI writers are busy right now. Please retry in 30s — or type it manually.' },
        { status: 502 }
      );
    }
  }
}
