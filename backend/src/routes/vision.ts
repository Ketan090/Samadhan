import { Router, Request, Response } from 'express';
import { PorterProvider } from '../services/aiProviders/PorterProvider';
import { protect } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const porter = new PorterProvider();

router.post('/analyze', upload.single('image'), async (req: Request, res: Response) => {
  try {
    let imageB64: string | null = null;
    let lat = (req.body?.lat as string) || req.query.lat as string || null;
    let lon = (req.body?.lon as string) || req.query.lon as string || null;
    const clientGeminiKey = (req.headers['x-gemini-key'] as string) || (req.headers['x-google-api-key'] as string) || req.body?.googleApiKey;
    const clientLmUrl = (req.headers['x-lmstudio-url'] as string) || req.body?.lmStudioUrl;

    if ((req as any).file?.buffer) {
      imageB64 = (req as any).file.buffer.toString('base64');
    } else if (req.body?.imageBase64) {
      imageB64 = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
    } else if (req.body?.image) {
      imageB64 = (req.body.image as string).replace(/^data:image\/\w+;base64,/, '');
    }

    if (!imageB64) {
      res.status(400).json({ success: false, message: 'image required' });
      return;
    }

    // Try Porter first if configured
    const hasPorter = !!(process.env.PORTER_API_KEY && process.env.PORTER_ENDPOINT);
    const hasGemini = !!(clientGeminiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const lmUrl = clientLmUrl || process.env.LMSTUDIO_URL || 'http://localhost:1234/v1/chat/completions';

    // Delegate to PorterProvider which already handles LM Studio -> Gemini -> Porter -> mock
    // For vision, we use PorterProvider's analyzeVision
    // We need to pass image as data URI
    const dataUri = `data:image/jpeg;base64,${imageB64}`;
    let result: any = null;
    let engine = 'porter';
    let demo = false;

    // Try LM Studio via PorterProvider's internal logic is for text, not vision with image_url.
    // So we directly try the civic-style LM Studio vision here
    try {
      const b64 = imageB64;
      let modelToUse = process.env.LMSTUDIO_MODEL || '';
      if (!modelToUse) {
        try {
          const base = lmUrl.replace(/\/chat\/completions\/?$/, '');
          const r = await fetch(`${base}/models`, { signal: AbortSignal.timeout(2000) as any });
          if (r.ok) {
            const j: any = await r.json();
            if (j.data?.[0]?.id) modelToUse = j.data[0].id;
          }
        } catch {}
      }
      if (!modelToUse) modelToUse = 'local-model';
      const prompt = `You are CivicLens Premium — AI Public Safety Analyzer. User Location: Latitude ${lat || 'unknown'} Longitude ${lon || 'unknown'} Detect EVERY visible civic issue (pothole, garbage, flood, drain, crack, sidewalk, streetlight, debris, etc). Respond ONLY in VALID JSON with keys: problems, problem, category, riskLevel, riskExplanation, responsibleAuthority, locationGuess, suggestedAction, safetyScore, confidence, severity, whatSeen, evidences, complaintLetter, detections. Rules: distinguish visible vs assumed, never invent measurements. If no issue set problem="No obvious issue" and detections=[]`;
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 25000);
      const r = await fetch(lmUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelToUse,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: dataUri } }] }],
          temperature: 0.2,
          max_tokens: 900,
        }),
        signal: controller.signal as any,
      });
      clearTimeout(t);
      if (r.ok) {
        const j: any = await r.json();
        const content = j.choices?.[0]?.message?.content || '';
        const m = content.match(/\{[\s\S]*\}/);
        if (m) {
          result = JSON.parse(m[0]);
          engine = 'lmstudio';
        }
      }
    } catch {}

    if (!result && hasGemini) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(clientGeminiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash', generationConfig: { temperature: 0.1 } as any });
        const prompt = `You are CivicLens Accurate Analyzer — be conservative. Analyze image. Respond ONLY valid JSON with keys: problem,category,riskLevel,confidence,severity,whatSeen,evidences,complaintLetter,detections. If no issue, problem="No obvious issue"`;
        const genRes = await model.generateContent([{ text: prompt }, { inlineData: { data: imageB64, mimeType: 'image/jpeg' } }]);
        const text = genRes.response.text();
        const m = text.match(/\{[\s\S]*\}/);
        if (m) { result = JSON.parse(m[0]); engine = 'gemini'; }
      } catch {}
    }

    if (!result && hasPorter) {
      try {
        const r = await fetch(process.env.PORTER_ENDPOINT as string, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.PORTER_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageB64, lat, lon }),
        });
        result = await r.json();
        engine = 'porter';
      } catch {}
    }

    if (!result) {
      // Fallback to PorterProvider mock vision
      const mock = await porter.analyzeVision(dataUri, '');
      result = {
        problem: mock.issues[0]?.title || 'Possible civic issue',
        category: mock.issues[0]?.category || 'General',
        confidence: Math.round((mock.issues[0]?.confidence || 0.62) * 100),
        severity: mock.issues[0]?.severity || 'Low',
        whatSeen: mock.issues[0]?.description || 'Possible issue detected — manual verification recommended.',
        evidences: mock.issues.map(i => i.evidence),
        complaintLetter: mock.issues[0]?.description || '',
        detections: mock.issues.map(i => ({ label: i.title.toUpperCase(), category: i.category, confidence: Math.round(i.confidence * 100), severity: i.severity, evidence: i.evidence, box: i.bbox || { x: 28, y: 38, w: 34, h: 26 } })),
        issues: mock.issues,
        overall_status: mock.overall_status,
      };
      engine = 'mock';
      demo = true;
    }

    // Normalize to Porter expected structure for frontend
    const issues = result.issues || result.detections?.map((d: any) => ({
      title: d.label || d.title || result.problem,
      category: d.category || result.category,
      confidence: (d.confidence || result.confidence || 80) / 100,
      severity: d.severity || result.severity || 'Medium',
      evidence: d.evidence || result.whatSeen,
      description: result.complaintLetter || d.evidence || result.whatSeen,
      recommended_action: result.suggestedAction || 'Request verification.',
      verification_required: true,
      bbox: d.box,
    })) || [];

    const overall_status = result.overall_status || (issues.length ? 'potential_issue_detected' : 'no_issue_detected');

    res.json({
      success: true,
      engine,
      demo,
      data: {
        issues: issues.map((iss: any) => ({
          title: iss.title,
          category: iss.category,
          confidence: typeof iss.confidence === 'number' ? iss.confidence : iss.confidence / 100,
          severity: iss.severity,
          evidence: iss.evidence,
          description: iss.description,
          recommended_action: iss.recommended_action,
          verification_required: true,
          bbox: iss.bbox || iss.box,
        })),
        overall_status,
        whatSeen: result.whatSeen,
        evidences: result.evidences,
        complaintLetter: result.complaintLetter,
        safetyScore: result.safetyScore,
        confidence: result.confidence,
        severity: result.severity,
        problem: result.problem,
        category: result.category,
      },
      raw: result,
    });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/status', async (_req, res) => {
  const lmUrl = process.env.LMSTUDIO_URL || 'http://localhost:1234/v1/chat/completions';
  let lmReachable = false;
  let lmModels: string[] = [];
  try {
    const base = lmUrl.replace(/\/chat\/completions\/?$/, '');
    const r = await fetch(`${base}/models`, { signal: AbortSignal.timeout(2000) as any });
    if (r.ok) {
      const j: any = await r.json();
      lmModels = j.data?.map((d: any) => d.id) || [];
      lmReachable = true;
    }
  } catch {}
  res.json({
    porter: { hasKey: !!process.env.PORTER_API_KEY, endpoint: process.env.PORTER_ENDPOINT || null },
    lmstudio: { url: lmUrl, reachable: lmReachable, models: lmModels },
    gemini: { hasKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) },
  });
});

export default router;
