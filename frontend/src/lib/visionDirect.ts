// Direct AI fallback for serverless deploys (Vercel). Same OpenAI-compatible
// providers as backend/src/routes/vision.ts, trimmed for function limits:
// short model list, compact prompt, 10s per-model timeout. Used ONLY when
// the Express bridge is unreachable AND provider keys are configured
// (XKIRO_API_KEY / NVIDIA_API_KEY / UNO_API_KEY). Locally the bridge always
// wins, so this path never runs in dev.
type Provider = 'xkiro' | 'unorouter' | 'nvidia';
type DStep = { provider: Provider; model: string };

const DSTEPS: DStep[] = [
  { provider: 'nvidia', model: 'meta/llama-3.2-11b-vision-instruct' },
  { provider: 'xkiro', model: 'qwen/qwen3.5-flash:free' },
  { provider: 'xkiro', model: 'qwen/qwen3-vl-plus:free' },
  { provider: 'unorouter', model: 'qwen2.5-vl-7b-instruct-awq:free' },
  { provider: 'xkiro', model: 'sensenova/sensenova-6.7-flash-lite' },
];

function cfgs(): Record<Provider, { url: string; key: string }> {
  return {
    unorouter: { url: 'https://api.unorouter.com/v1/chat/completions', key: process.env.UNO_API_KEY || '' },
    xkiro: { url: 'https://api.xkiro.com/v1/chat/completions', key: process.env.XKIRO_API_KEY || '' },
    nvidia: { url: 'https://integrate.api.nvidia.com/v1/chat/completions', key: process.env.NVIDIA_API_KEY || '' },
  };
}

export function directKeysPresent(): boolean {
  const c = cfgs();
  return !!(c.xkiro.key || c.nvidia.key || c.unorouter.key);
}

const dprompt = (lang: string) => `You are a civic-issue photo analyst. Look at the photo and reply with ONLY the JSON below — no other text, all text values in ${lang}:
{"isCivic":true,"problem":"<short issue name, or No civic issue>","category":"<one of: Road Infrastructure, Waste Management, Water & Drainage, Infrastructure, Air Quality, No Issue>","confidence":<0-100 number>,"severity":"<Low, Medium or High>","whatSeen":"<2 plain sentences describing the photo>","evidences":["<visible fact 1>","<visible fact 2>"],"complaintLetter":"<one formal sentence, or empty string>","suggestedAction":"<one sentence>","detections":[{"label":"<SHORT CAPS LABEL>","category":"<same as category>","confidence":<0-100 number>,"box":{"x":28,"y":38,"w":34,"h":26}}]}
Rules: no civic issue → isCivic=false, problem="No civic issue", category="No Issue", detections=[], complaintLetter="". Boxes are 0-100-normalized x/y top-left plus w/h size, tightly around each problem.`;

// Minimal port of backend normalizeParsed: defaults + detection tidy-up so
// small-model output never leaks "undefined" into the UI.
function norm(p: any) {
  const bad = (v: any) => v == null || String(v).trim() === '' || String(v).trim().toLowerCase() === 'undefined';
  if (bad(p.problem)) p.problem = 'Civic issue';
  if (bad(p.category)) p.category = 'Civic';
  p.confidence = p.confidence == null || isNaN(Number(p.confidence)) ? 80 : Number(p.confidence);
  if (bad(p.severity)) p.severity = 'Medium';
  const src = Array.isArray(p.detections) ? p.detections : [];
  const dets = src.map((d: any, i: number) => {
    if (typeof d === 'string') return { label: d.toUpperCase().slice(0, 24), confidence: 85, box: null };
    if (!d || typeof d !== 'object') return null;
    return {
      label: String(d.label || d.name || `ISSUE-${i + 1}`).toUpperCase().slice(0, 24),
      category: d.category || p.category,
      confidence: Number(d.confidence) || 85,
      box: d.box || d.bbox || null,
    };
  }).filter(Boolean);
  dets.forEach((d: any, i: number) => {
    if (!d.box) d.box = { x: 6 + ((i * 23) % 64), y: 30 + ((i * 17) % 40), w: 26, h: 18 };
  });
  p.detections = dets;
  if (!p.whatSeen || String(p.whatSeen).trim().length < 10)
    p.whatSeen = p.isCivic === false ? 'No civic issue — image shows general scene.' : `Civic issue visible: ${p.problem}`;
  if (!Array.isArray(p.evidences) || !p.evidences.length)
    p.evidences = dets.length ? dets.map((d: any) => `${d.label} ${d.confidence || 88}%`) : ['Visible scene analyzed'];
  if (!p.complaintLetter) p.complaintLetter = '';
  if (!p.suggestedAction) p.suggestedAction = '';
  return p;
}

export async function analyzeDirect(b64: string, lang: string): Promise<{ engine: string; model: string; data: any }> {
  const c = cfgs();
  const dead = new Set<Provider>();
  let last = '';
  for (const s of DSTEPS) {
    const cfg = c[s.provider];
    if (!cfg.key || dead.has(s.provider)) continue;
    try {
      const body = JSON.stringify({
        model: s.model,
        messages: [{ role: 'user', content: [{ type: 'text', text: dprompt(lang) }, { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } }] }],
        temperature: 0.2,
        max_tokens: 500,
        ...(s.provider === 'nvidia' ? { response_format: { type: 'json_object' } } : {}),
      });
      const r = await fetch(cfg.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
        body,
        signal: AbortSignal.timeout(10000) as any,
      });
      if (!r.ok) {
        const t = await r.text().catch(() => '');
        throw new Error(`${r.status} ${t.slice(0, 160)}`);
      }
      const j = (await r.json()) as any;
      const content = j.choices?.[0]?.message?.content || '';
      if (!content || content.trim().length < 5) throw new Error('blank response');
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('no JSON in response');
      const parsed = JSON.parse(m[0]);
      if (!parsed || typeof parsed !== 'object') throw new Error('empty parse');
      return { engine: s.provider, model: s.model, data: norm(parsed) };
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (/429|quota/i.test(msg)) dead.add(s.provider);
      last = `${s.model}: ${msg.slice(0, 120)}`;
    }
  }
  throw new Error(last || 'no AI provider keys configured');
}
