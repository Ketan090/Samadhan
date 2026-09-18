import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Ensure .env is loaded before reading keys — this module reads them at
// import time, which otherwise runs before server.ts calls dotenv.config().
dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
// Multer failures (e.g. oversize photo) must return JSON, never an HTML
// error page — the client parses every response as JSON.
const uploadImageJson = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'Photo exceeds 15MB — please pick a smaller one.'
        : `Upload failed: ${String(err.message || err).slice(0, 120)}`;
      res.status(413).json({ success: false, demo: true, message: msg });
      return;
    }
    next();
  });
};

// Faithful port of C:\Users\Asus\Desktop\project files\AI\civic\app\api\analyze\route.ts
// Provider config uses env only — never hard-code keys.
const PROVIDER_CFG: Record<string, { url: string; key: string }> = {
  unorouter: { url: 'https://api.unorouter.com/v1/chat/completions', key: process.env.UNO_API_KEY || '' },
  xkiro: { url: 'https://api.xkiro.com/v1/chat/completions', key: process.env.XKIRO_API_KEY || '' },
  // Alternate when xkiro quota is done — free NIM tier, OpenAI-compatible.
  // Get a free key at build.nvidia.com/settings (no credit card) and set NVIDIA_API_KEY.
  nvidia: { url: 'https://integrate.api.nvidia.com/v1/chat/completions', key: process.env.NVIDIA_API_KEY || '' },
};

type Step = { provider: string; model: string; tier: 'light' | 'medium' | 'heavy' };
const TRAVERSAL: Step[] = [
  // Live-verified Sep 2026 (HTTP 200 with images) — tried first.
  { provider: 'xkiro', model: 'qwen/qwen3-vl-plus:free', tier: 'light' },
  { provider: 'xkiro', model: 'qwen/qwen3.5-omni-flash:free', tier: 'light' },
  { provider: 'xkiro', model: 'qwen/qwen3-omni-flash:free', tier: 'light' },
  { provider: 'xkiro', model: 'qwen/qwen3.5-flash:free', tier: 'light' },
  { provider: 'xkiro', model: 'qwen/qwen3.5-omni-plus:free', tier: 'medium' },
  // Fallbacks — skipped automatically when they 503/404 or lack keys.
  { provider: 'xkiro', model: 'sensenova/sensenova-6.7-flash-lite', tier: 'light' },
  { provider: 'xkiro', model: 'sensenova/sensenova-6.8-flash-lite', tier: 'light' },
  { provider: 'unorouter', model: 'qwen2.5-vl-7b-instruct-awq:free', tier: 'light' },
  // NVIDIA fallback — tried when xkiro quota is exhausted (429s fail fast,
  // so traversal reaches here in seconds). Skipped when NVIDIA_API_KEY unset.
  // (90B removed: free-tier queue never answers within timeout; the 11B does.)
  { provider: 'nvidia', model: 'meta/llama-3.2-11b-vision-instruct', tier: 'light' },
  { provider: 'xkiro', model: 'minimax/minimax-m3:free', tier: 'light' },
  { provider: 'xkiro', model: 'qwen/qwen3-vl-plus:free', tier: 'medium' },
  { provider: 'xkiro', model: 'mistralai/mistral-small-2603', tier: 'medium' },
  { provider: 'xkiro', model: 'qwen/qwen3.5-plus:free', tier: 'medium' },
  { provider: 'xkiro', model: 'qwen/qwen3.6-plus:free', tier: 'medium' },
  { provider: 'xkiro', model: 'qwen/qwen3.7-plus:free', tier: 'medium' },
  { provider: 'xkiro', model: 'mistralai/mistral-medium-3.5', tier: 'heavy' },
  { provider: 'xkiro', model: 'qwen/qwen3.8-max:free', tier: 'heavy' },
  { provider: 'xkiro', model: 'qwen/qwen3-max:free', tier: 'heavy' },
  { provider: 'xkiro', model: 'mistralai/mistral-large-2512', tier: 'heavy' },
];

async function callTextModel(step: Step, prompt: string, maxTokens = 400) {
  const cfg = PROVIDER_CFG[step.provider];
  if (!cfg || !cfg.key) throw new Error(`${step.provider} API key not set — set UNO_API_KEY / XKIRO_API_KEY / NVIDIA_API_KEY`);
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` };
  const body = JSON.stringify({
    model: step.model,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    temperature: 0.7,
    max_tokens: maxTokens,
  });
  const r = await fetch(cfg.url, { method: 'POST', headers, body, signal: AbortSignal.timeout(25000) as any });
  if (!r.ok) { const txt = await r.text().catch(() => ''); throw new Error(`${r.status} ${txt.slice(0, 200)}`); }
  const j = (await r.json()) as any;
  const content = j.choices?.[0]?.message?.content || j.text || j.choices?.[0]?.text || '';
  if (!content || content.trim().length < 5) throw new Error('blank response');
  const m = content.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no JSON in response');
  let parsed: any;
  try { parsed = JSON.parse(m[0]); } catch { throw new Error('JSON parse fail'); }
  if (!parsed || typeof parsed !== 'object') throw new Error('empty parse');
  return { parsed, raw: content };
}

// POST /api/vision/draft-solution — AI field writer for the University solution form.
// Open like /analyze (only needs challenge context; small token cap; global rate-limit applies).
// Body: { field, challenge: {title, description, category, city, state, tags, severity, affected} }
// Reply: { success, field, text?, items?, steps?, model }
const DRAFT_FIELDS: Record<string, { tokens: number; prompt: (c: string) => string }> = {
  title: { tokens: 120, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<short project-style solution title, max 12 words>"}.` },
  problemAddressed: { tokens: 300, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<2-3 formal sentences: which specific problem the university solution addresses>"}.` },
  proposedApproach: { tokens: 500, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<detailed university solution approach, 120-180 words, formal tone, concrete methods>"}.` },
  architecture: { tokens: 400, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<system architecture: layers, components, data flow, 80-120 words>"}.` },
  expectedImpact: { tokens: 300, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<measurable expected impact with numbers where sensible, 2-3 sentences>"}.` },
  implementationTimeline: { tokens: 150, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<realistic pilot + full deployment timeline, one line>"}.` },
  scalability: { tokens: 300, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<how this solution scales to other areas, 2-3 sentences>"}.` },
  technology: { tokens: 200, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"items":["<4-6 concrete technologies/tools, each 1-4 words>"]}.` },
  estimatedCost: { tokens: 60, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"text":"<realistic pilot cost in INR as digits only, e.g. 2500000>"}.` },
  steps: { tokens: 600, prompt: (c) => `Civic challenge: ${c}\nReply ONLY JSON {"steps":[{"title":"<step, max 10 words>","description":"<what is done, 1-2 sentences>"}, ... 4 steps total]}.` },
};

router.post('/draft-solution', async (req: Request, res: Response) => {
  try {
    const { field, challenge } = (req.body || {}) as any;
    const spec = DRAFT_FIELDS[String(field || '')];
    if (!spec || !challenge) {
      res.status(400).json({ success: false, message: 'field and challenge required' });
      return;
    }
    const c = typeof challenge === 'string' ? challenge : JSON.stringify({
      title: challenge.title, description: String(challenge.description || '').slice(0, 800),
      category: challenge.category, location: challenge.location || `${challenge.city || ''} ${challenge.state || ''}`,
      tags: challenge.tags, severity: challenge.severity, affected: challenge.affectedPopulation,
    }).slice(0, 1200);
    let lastError = '';
    const draftKey = crypto.createHash('sha256').update(`${field}::${c}`).digest('hex');
    const draftHit = getAnalyzeCache(draftKey);
    if (draftHit) {
      res.json({ ...draftHit.body, cached: true });
      return;
    }
    // First 9 steps cover xkiro + unorouter + the NVIDIA fallback, so text
    // drafting auto-shifts providers exactly like image analysis.
    const draftDead = new Set<string>();
    for (const step of TRAVERSAL.slice(0, 9)) {
      if (draftDead.has(step.provider)) continue;
      try {
        const { parsed } = await callTextModel(step, spec.prompt(c), spec.tokens);
        const body = { success: true, field, text: parsed.text, items: parsed.items, steps: parsed.steps, model: step.model };
        setAnalyzeCache(draftKey, body);
        res.json(body);
        return;
      } catch (e: any) { const msg = String(e.message || e); if (/429|quota/i.test(msg)) draftDead.add(step.provider); lastError = `${step.model}: ${msg.slice(0, 100)}`; continue; }
    }
    res.status(200).json({ success: false, message: `AI busy. Last: ${lastError}. Try again in 30s.` });
  } catch (e: any) {
    res.status(500).json({ success: false, message: String(e.message || e).slice(0, 200) });
  }
});

async function callModel(step: Step, prompt: string, b64: string) {
  const cfg = PROVIDER_CFG[step.provider];
  if (!cfg || !cfg.key) throw new Error(`${step.provider} API key not set — set UNO_API_KEY / XKIRO_API_KEY / NVIDIA_API_KEY`);
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` };
  // All three providers take OpenAI-style data URLs. (NVIDIA's validator
  // rejects raw base64 without the data: prefix — "must be HTTP, data or
  // file URL" — so the prefix stays for everyone.)
  const imageUrl = `data:image/jpeg;base64,${b64}`;
  const body = JSON.stringify({
    model: step.model,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageUrl } }] }],
    temperature: 0.2,
    max_tokens: 500,
    // NVIDIA NIM honors OpenAI response_format — forces the small Llama
    // vision model to emit parseable JSON instead of prose. (xkiro/unorouter
    // behavior left untouched.)
    ...(step.provider === 'nvidia' ? { response_format: { type: 'json_object' } } : {}),
  });
  // NVIDIA free tier cold-starts/queues: 9s is too short (the 11B answers
  // on retry once warm, the 90B needs longer). Other providers fail fast
  // on their own, so only NVIDIA gets the longer leash.
  const ms = step.provider === 'nvidia' ? 30000 : 9000;
  const r = await fetch(cfg.url, { method: 'POST', headers, body, signal: AbortSignal.timeout(ms) as any });
  if (!r.ok) { const txt = await r.text().catch(() => ''); throw new Error(`${r.status} ${txt.slice(0, 200)}`); }
  const j = (await r.json()) as any;
  const content = j.choices?.[0]?.message?.content || j.text || j.choices?.[0]?.text || '';
  if (!content || content.trim().length < 5) throw new Error('blank response');
  const m = content.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no JSON in response');
  let parsed: any;
  try { parsed = JSON.parse(m[0]); } catch { throw new Error('JSON parse fail'); }
  if (!parsed || typeof parsed !== 'object') throw new Error('empty parse');
  return { parsed, raw: content };
}

function toDetections(parsed: any): any[] {
  // Models vary: detections | objects | boxes | issues | findings,
  // items as objects or plain strings, boxes as {x,y,w,h}, [x1,y1,x2,y2],
  // or 0-1000 scale. Normalize everything to drawable 0-100 boxes.
  const src = parsed.detections || parsed.objects || parsed.boxes || parsed.issues || parsed.findings || [];
  const arr = Array.isArray(src) ? src : [src];
  return arr.map((d: any, i: number) => {
    if (typeof d === 'string') return { label: d.toUpperCase().slice(0, 24), confidence: 85, box: null };
    if (!d || typeof d !== 'object') return null;
    const label = String(d.label || d.name || d.class || d.type || `ISSUE-${i + 1}`).toUpperCase().slice(0, 24);
    const raw = d.box || d.bbox || d.coords || d.region || null;
    let box: any = null;
    if (Array.isArray(raw) && raw.length >= 4) {
      const [x1, y1, x2, y2] = raw.map(Number);
      box = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
    } else if (raw && typeof raw === 'object') {
      box = { x: Number(raw.x ?? raw.left ?? 0), y: Number(raw.y ?? raw.top ?? 0), w: Number(raw.w ?? raw.width ?? 0), h: Number(raw.h ?? raw.height ?? 0) };
    }
    if (box) {
      if (Math.max(box.x, box.y, box.w, box.h) > 100) { box.x /= 10; box.y /= 10; box.w /= 10; box.h /= 10; }
      if (!(box.w > 1 && box.h > 1)) box = null;
    }
    return { label, category: d.category || parsed.category || 'Civic', confidence: Number(d.confidence) || 85, box };
  }).filter(Boolean);
}

function normalizeParsed(parsed: any) {
  // Small fallback models (e.g. NVIDIA 11B in JSON mode) sometimes return a
  // valid object with missing keys — default them instead of leaking
  // "undefined" strings into the UI.
  const undef = (v: any) => v == null || String(v).trim() === '' || String(v).trim().toLowerCase() === 'undefined';
  if (undef(parsed.problem)) parsed.problem = 'Civic issue';
  if (undef(parsed.category)) parsed.category = 'Civic';
  if (parsed.confidence == null || isNaN(Number(parsed.confidence))) parsed.confidence = 80;
  if (undef(parsed.severity)) parsed.severity = 'Medium';
  if (!parsed.whatSeen || String(parsed.whatSeen).trim().length < 10)
    parsed.whatSeen = parsed.isCivic === false ? 'No civic issue — image shows general scene.' : `Civic issue visible: ${parsed.problem}`;
  let dets = toDetections(parsed);
  // Tile fallback boxes so box-less detections don't stack on one spot.
  dets.forEach((d, i) => {
    if (!d.box) d.box = { x: 6 + ((i * 23) % 64), y: 30 + ((i * 17) % 40), w: 26, h: 18 };
  });
  parsed.detections = dets;
  if (!parsed.evidences || !Array.isArray(parsed.evidences) || parsed.evidences.length === 0)
    parsed.evidences = dets.length ? dets.map((d: any) => `${d.label} ${d.confidence || 88}%`) : ['Visible scene analyzed'];
  if (parsed.isCivic !== false && dets.length === 0 && parsed.problem && !/no civic/i.test(parsed.problem))
    parsed.detections = [{ label: String(parsed.problem).toUpperCase().slice(0, 18), category: parsed.category || 'Civic', confidence: parsed.confidence || 88, box: { x: 28, y: 38, w: 42, h: 28 } }];
  if (parsed.isCivic === false) parsed.detections = [];
  return parsed;
}

// Optional local YOLO pre-check — port of AI/civic_cv.py (FastAPI YOLO11n, POST /predict).
// Opt-in via CV_SERVICE_URL (e.g. http://localhost:8000). When unset, this is a
// silent no-op and the cloud LLM result stands unchanged.
async function mergeCvDetections(data: any, b64: string) {
  const base = (process.env.CV_SERVICE_URL || '').replace(/\/$/, '');
  if (!base) return data;
  try {
    const buf = Buffer.from(b64, 'base64');
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'image/jpeg' }), 'frame.jpg');
    const r = await fetch(`${base}/predict`, { method: 'POST', body: fd, signal: AbortSignal.timeout(2500) as any });
    if (!r.ok) return data;
    const j = (await r.json()) as any;
    const cv = Array.isArray(j?.detections) ? j.detections : [];
    if (!cv.length) return data;
    const seen = new Set((data.detections || []).map((d: any) => String(d.label || '').toUpperCase()));
    const fresh = cv.filter((d: any) => !seen.has(String(d.label || '').toUpperCase())).slice(0, 4);
    data.detections = [...fresh, ...(data.detections || [])].slice(0, 8);
    data.cvVerified = true;
  } catch { /* CV service offline — LLM result stands */ }
  return data;
}

function buildPrompt(targetLang: string) {
  return `You are CivicLens PREMIUM YOLO — municipal civic intelligence with accurate detection. Analyze the image precisely. RequestId:${Date.now()}
Language: Respond ENTIRELY in ${targetLang}. All JSON string values (problem, category, whatSeen, evidences, complaintLetter, suggestedAction, detections[].label) MUST be in ${targetLang}. If ${targetLang} is Hindi/Marathi/etc use Devanagari/native script correctly.
Style: ALL text must be CLEAR, PRECISE, FORMAL tone. No slang, no emojis, no filler. Be concise and official. YOLO boxes must be PREMIUM, TIGHT, ACCURATE — normalized 0-100, x/y top-left, w/h size, tightly enclosing each problem with no extra margin.
Respond ONLY valid JSON:
{"isCivic":true,"problem":"Pothole + Garbage or No civic issue (in ${targetLang})","category":"Road Infrastructure|Waste Management|Water & Drainage|Infrastructure|Air Quality|No Issue (translate to ${targetLang})","confidence":0-100,"severity":"Low|Medium|High (translate to ${targetLang})","whatSeen":"2-3 FORMAL, PRECISE sentences in ${targetLang} describing exactly what is visible — clear objective observation","evidences":["precise formal bullet 1 in ${targetLang}","precise formal bullet 2 in ${targetLang}"],"complaintLetter":"FORMAL TONE paragraph in ${targetLang} — clear and precise official petition if civic else empty.","suggestedAction":"formal precise recommended action in ${targetLang}","detections":[{"label":"POTHOLE (in ${targetLang} caps)","category":"Road Infrastructure (in ${targetLang})","confidence":92,"box":{"x":28,"y":38,"w":34,"h":26}}]}
Rules:
- isCivic=true if any civic problem else false. If false, detections=[] and problem="No civic issue" translated to ${targetLang} and complaintLetter="".
- complaintLetter MUST be formal, clear, precise, 3-4 sentences, respectful petition tone, NO casual language, IN ${targetLang}.
- whatSeen, evidences, suggestedAction also formal and precise IN ${targetLang}.
- Never leave whatSeen empty. Always ${targetLang}.
`;
}

const langMap: Record<string, string> = { en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', bn: 'Bengali', gu: 'Gujarati', pa: 'Punjabi', ur: 'Urdu', or: 'Odia', as: 'Assamese', vi: 'Vietnamese' };

// Compact prompt for the small NVIDIA fallback model. The full PREMIUM
// prompt above makes 11B-class models echo the examples and ramble past
// the JSON — this short variant with placeholder (not example) values
// returns clean parseable JSON. Same keys, so downstream code is unchanged.
function buildPromptShort(targetLang: string) {
  return `You are a civic-issue photo analyst. Look at the photo and reply with ONLY the JSON below — no other text, all text values in ${targetLang}:
{"isCivic":true,"problem":"<short issue name, or No civic issue>","category":"<one of: Road Infrastructure, Waste Management, Water & Drainage, Infrastructure, Air Quality, No Issue>","confidence":<0-100 number>,"severity":"<Low, Medium or High>","whatSeen":"<2 plain sentences describing the photo>","evidences":["<visible fact 1>","<visible fact 2>"],"complaintLetter":"<one formal sentence, or empty string>","suggestedAction":"<one sentence>","detections":[{"label":"<SHORT CAPS LABEL>","category":"<same as category>","confidence":<0-100 number>,"box":{"x":28,"y":38,"w":34,"h":26}}]}
Rules: no civic issue → isCivic=false, problem="No civic issue", category="No Issue", detections=[], complaintLetter="". Boxes are 0-100-normalized x/y top-left plus w/h size, tightly around each problem.`;
}

// Token diet: identical photo bytes reuse the last result (30-min TTL, 100 entries).
// Retry taps and re-uploads of the same photo cost zero tokens, same response.
const analyzeCache = new Map<string, { ts: number; body: any }>();
function getAnalyzeCache(key: string): { ts: number; body: any } | null {
  const hit = analyzeCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > 30 * 60 * 1000) { analyzeCache.delete(key); return null; }
  return hit;
}
function setAnalyzeCache(key: string, body: any) {
  analyzeCache.set(key, { ts: Date.now(), body });
  if (analyzeCache.size > 100) {
    const oldest = analyzeCache.keys().next().value;
    if (oldest) analyzeCache.delete(oldest);
  }
}

router.post('/analyze', uploadImageJson, async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    let b64: string | null = null;
    if (file?.buffer) b64 = file.buffer.toString('base64');
    else if (req.body?.imageBase64) b64 = String(req.body.imageBase64).replace(/^data:image\/\w+;base64,/, '');
    else if (req.body?.image) b64 = String(req.body.image).replace(/^data:image\/\w+;base64,/, '');
    if (!b64) {
      res.status(400).json({ success: false, demo: true, message: 'No image' });
      return;
    }
    const langRaw = String(req.body?.lang || req.query.lang || 'en').slice(0, 5).toLowerCase();
    const targetLang = langMap[langRaw] || langMap[langRaw.slice(0, 2)] || 'English';
    const prompt = buildPrompt(targetLang);
    const promptShort = buildPromptShort(targetLang);
    const isStream = req.query.stream === '1';

    if (!isStream) {
      // Token diet: identical bytes → cached result (retries cost zero).
      const cacheKey = crypto.createHash('sha256').update(b64).digest('hex');
      const hit = getAnalyzeCache(cacheKey);
      if (hit) {
        res.json({ ...hit.body, cached: true });
        return;
      }
      let lastError = '';
      let retryable = false;
      // Circuit-breaker: a 429 means that provider's quota is exhausted for
      // today — it won't recover mid-request, so skip its remaining steps
      // and shift to the next provider (NVIDIA) immediately.
      const quotaDead = new Set<string>();
      for (let retry = 0; retry < 2; retry++) {
        for (const step of TRAVERSAL) {
          if (quotaDead.has(step.provider)) continue;
          try {
            const { parsed, raw } = await callModel(step, step.provider === 'nvidia' ? promptShort : prompt, b64);
            const data = normalizeParsed(parsed);
            await mergeCvDetections(data, b64);
            const body = { success: true, engine: step.provider, demo: false, data, raw, model: step.model, tier: step.tier };
            setAnalyzeCache(cacheKey, body);
            res.json(body);
            return;
          } catch (e: any) { const msg = String(e.message || e); if (/429|quota/i.test(msg)) quotaDead.add(step.provider); lastError = `${step.model}: ${msg.slice(0, 120)}`; continue; }
        }
        // Second pass only when the failure looks transient — a 4xx/parse
        // failure would just burn tokens repeating the same calls.
        retryable = /5\d\d|timeout|timed out|socket|econn|fetch failed|429|busy|capacity|overloaded/i.test(lastError);
        if (!retryable) break;
        await new Promise((r) => setTimeout(r, 800));
      }
      // User-facing message stays clean — raw provider errors go to `detail`
      // (logs), never into the UI banner.
      const failBody = { success: false, demo: true, message: 'All AI providers are busy right now, including the NVIDIA fallback. Please retry in 30s — or continue manually.', detail: lastError.slice(0, 300) };
      setAnalyzeCache(cacheKey, failBody);
      res.status(200).json(failBody);
      return;
    }

    // NDJSON stream, same event shape as AI folder
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    const send = (obj: any) => res.write(JSON.stringify(obj) + '\n');
    let lastError = '';
    // Same 429 circuit-breaker as the non-stream path (see above).
    const quotaDead = new Set<string>();
    for (let retry = 0; retry < 2; retry++) {
      for (const step of TRAVERSAL) {
        if (quotaDead.has(step.provider)) continue;
        send({ type: 'try', provider: step.provider, model: step.model, tier: step.tier, retry });
        try {
          const { parsed, raw } = await callModel(step, step.provider === 'nvidia' ? promptShort : prompt, b64);
          const data = normalizeParsed(parsed);
          await mergeCvDetections(data, b64);
          send({ type: 'success', provider: step.provider, model: step.model, tier: step.tier, engine: step.provider, data, raw });
          send({ type: 'done', success: true, engine: step.provider, model: step.model });
          res.end();
          return;
        } catch (e: any) {
          lastError = `${step.model}: ${String(e.message || e).slice(0, 160)}`;
          const msg = String(e.message || e);
          if (/429|quota/i.test(msg)) quotaDead.add(step.provider);
          const retryable = /429|403|404|500|502|503|timeout|blank|no JSON/i.test(msg);
          send({ type: 'error', provider: step.provider, model: step.model, tier: step.tier, error: lastError, retryable });
          await new Promise((r) => setTimeout(r, 40));
        }
      }
      if (retry < 1) { send({ type: 'retry_wait', wait: 800 }); await new Promise((r) => setTimeout(r, 800)); }
    }
    send({ type: 'done', success: false, message: 'All AI providers are busy right now, including the NVIDIA fallback. Please retry in 30s — or continue manually.', detail: lastError.slice(0, 300) });
    res.end();
  } catch (e: any) {
    res.status(500).json({ success: false, demo: true, message: e.message });
  }
});

router.get('/status', async (_req, res) => {
  const checks = await Promise.all(
    Object.entries({
      unorouter: 'https://api.unorouter.com/v1/chat/completions',
      xkiro: 'https://api.xkiro.com/v1/chat/completions',
      nvidia: 'https://integrate.api.nvidia.com/v1/chat/completions',
    }).map(async ([name, url]) => {
      try {
        const KEYS: Record<string, string | undefined> = { unorouter: process.env.UNO_API_KEY, xkiro: process.env.XKIRO_API_KEY, nvidia: process.env.NVIDIA_API_KEY };
        const key = KEYS[name];
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (key) headers.Authorization = `Bearer ${key}`;
        const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ model: 'ping', messages: [{ role: 'user', content: [{ type: 'text', text: 'ping' }] }], max_tokens: 5 }), signal: AbortSignal.timeout(2000) as any });
        return { name, reachable: r.ok || r.status === 400, model: TRAVERSAL.find((s) => s.provider === name)?.model || null };
      } catch {
        return { name, reachable: false, model: TRAVERSAL.find((s) => s.provider === name)?.model || null };
      }
    })
  );
  const reachable = checks.some((c) => c.reachable);
  res.json({ providers: checks, reachable, engine: checks.find((c) => c.reachable)?.name || 'offline', models: TRAVERSAL });
});

// POST /api/vision/tts — faithful port of AI/civic/app/api/tts/route.ts
// Google-translate TTS proxy (14 langs per AI i18n). Returns audio/mpeg, or
// { fallback: true, useWebSpeech: true } so clients can use browser speech.
const TTS_LANG: Record<string, string> = { en: 'en', hi: 'hi', mr: 'mr', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml', bn: 'bn', gu: 'gu', pa: 'pa', ur: 'ur', or: 'or', as: 'as', vi: 'vi' };
async function googleTTS(text: string, lang: string): Promise<Buffer | null> {
  try {
    const tl = TTS_LANG[lang.slice(0, 2).toLowerCase()] || 'en';
    const chunks = text.match(/.{1,180}(?=\s|$)/g) || [text];
    let out = Buffer.alloc(0);
    for (const ch of chunks.slice(0, 4)) {
      const q = encodeURIComponent(ch.trim());
      if (!q) continue;
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${q}&tl=${tl}&client=gtx`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(6000) as any });
      if (!r.ok) continue;
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length > 500) out = Buffer.concat([out, b]);
    }
    return out.length > 1000 ? out : null;
  } catch { return null; }
}

router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, lang = 'en' } = (req.body || {}) as any;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'text required' });
      return;
    }
    const clean = String(text).slice(0, 600);
    const buf = await googleTTS(clean, String(lang));
    if (buf) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.send(buf);
      return;
    }
    res.json({ fallback: true, useWebSpeech: true });
  } catch (e: any) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// GET /api/vision/proxy?url= — faithful port of AI/civic/app/api/proxy/route.ts
// Fetches image links (incl. extracting direct images from webpages via
// og:image / twitter:image / img src) and streams the bytes back.
function unwrapProxyUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const q = u.searchParams.get('url') || u.searchParams.get('q') || u.searchParams.get('imgurl') || u.searchParams.get('image_url') || u.searchParams.get('src');
    if (q && /^https?:\/\//i.test(q)) {
      try { return decodeURIComponent(q); } catch { return q; }
    }
    if (u.hostname.includes('google.') && u.pathname.includes('/url')) {
      const inner = u.searchParams.get('url') || u.searchParams.get('q');
      if (inner) return decodeURIComponent(inner);
    }
  } catch { /* fall through */ }
  return raw;
}

function extractImageFromHtml(html: string, baseUrl: string): string | null {
  const tryUrl = (s: string) => {
    try {
      const abs = new URL(s, baseUrl).href;
      if (abs.includes('icon') || abs.includes('logo') || abs.includes('sprite') || abs.includes('avatar')) return null;
      return abs;
    } catch { return null; }
  };
  for (const re of [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']twitter:image[^"']*["'][^>]*content=["']([^"']+)["']/i,
    /<link[^>]+rel=["']image_src["'][^>]*href=["']([^"']+)["']/i,
  ]) {
    const m = html.match(re);
    if (m?.[1]) { const u = tryUrl(m[1]); if (u) return u; }
  }
  const jsonLd = html.match(/"contentUrl"\s*:\s*"([^"]+)"/i);
  if (jsonLd?.[1]) { const u = tryUrl(jsonLd[1]); if (u) return u; }
  const candidates: string[] = [];
  const attrRe = /<(?:img|source)[^>]+(?:src|data-src|data-original|data-lazy-src|data-srcset|srcset)=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(html)) !== null) {
    let v = m[1].trim();
    if (v.includes(',')) v = v.split(',')[0].trim().split(' ')[0].trim();
    if (v) candidates.push(v);
  }
  for (const src of candidates) {
    const u = tryUrl(src);
    if (!u) continue;
    if (/\.(jpe?g|png|webp|gif|bmp|avif)(\?|#|$)/i.test(u)) return u;
  }
  for (const src of candidates) {
    const u = tryUrl(src);
    if (u && /^https?:\/\//i.test(u) && u.length > 20) return u;
  }
  const found = html.match(/https?:\/\/[^\s"'<>]+\.(?:jpe?g|png|webp|gif|avif|bmp)(\?[^\s"'<>]*)?/i);
  if (found?.[0]) return found[0];
  return null;
}

router.get('/proxy', async (req: Request, res: Response) => {
  let url = String(req.query.url || '').trim();
  url = unwrapProxyUrl(url);
  if (!url) {
    res.status(400).json({ error: 'url required' });
    return;
  }
  try {
    const u = new URL(url);
    if ((u.protocol !== 'http:' && u.protocol !== 'https:') || !u.hostname.includes('.')) throw new Error('invalid url');
  } catch {
    res.status(400).json({ error: 'Invalid image URL. Right-click the image → Copy image address (must be https://...jpg/.png) or download and upload.' });
    return;
  }
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: new URL(url).origin,
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000) as any,
    });
    if (!r.ok) {
      res.status(502).json({ error: `Image host returned ${r.status}. Try Copy image address or download and upload.` });
      return;
    }
    const ct = r.headers.get('content-type') || '';
    if (ct.startsWith('image/')) {
      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 'no-store');
      res.send(buf);
      return;
    }
    if (ct.includes('text/html') || ct.includes('text/')) {
      const html = await r.text();
      const imgUrl = extractImageFromHtml(html, url);
      if (imgUrl) {
        try {
          const clean = unwrapProxyUrl(imgUrl);
          const r2 = await fetch(clean, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*', Referer: new URL(url).origin }, redirect: 'follow', signal: AbortSignal.timeout(12000) as any });
          if (r2.ok && (r2.headers.get('content-type') || '').startsWith('image/')) {
            const buf2 = Buffer.from(await r2.arrayBuffer());
            res.setHeader('Content-Type', r2.headers.get('content-type') || 'image/jpeg');
            res.setHeader('Cache-Control', 'no-store');
            res.send(buf2);
            return;
          }
        } catch { /* fall through to 400 */ }
      }
      res.status(400).json({ error: 'This link is a webpage, not a direct image. Right-click the image → Copy image address (should end with .jpg/.png) or download the image and upload it.' });
      return;
    }
    const buf = Buffer.from(await r.arrayBuffer());
    const isImg = (buf[0] === 0xff && buf[1] === 0xd8) || (buf[0] === 0x89 && buf[1] === 0x50) || ct.startsWith('image/') || buf.byteLength > 5000;
    if (isImg) {
      res.setHeader('Content-Type', ct || 'image/jpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.send(buf);
      return;
    }
    res.status(400).json({ error: 'This URL did not return an image. Right-click → Copy image address or download and upload.' });
  } catch (e: any) {
    const msg = String(e.message || e);
    if (msg.includes('timeout')) {
      res.status(504).json({ error: 'Image host timed out. Try Copy image address or download and upload.' });
      return;
    }
    res.status(500).json({ error: msg.slice(0, 200) });
  }
});

export default router;
