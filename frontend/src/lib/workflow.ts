// Offline workflow layer — lets a lone tester walk poster steps 5→10
// (Sent to University → Citizen Satisfied) without a database. Every advance
// first tries the real API; on failure it persists locally and the UI treats
// the local stage as truth until the backend confirms otherwise.

export const STAGE_ORDER = [
  'landing',
  'registration',
  'login',
  'ai-analyses',
  'sent-to-university',
  'university-proposed',
  'government-approved',
  'industry-collaborating',
  'progress-photos',
  'citizen-satisfied',
];

const stageKey = (id: string) => `samadhanhub_workflow_${String(id).replace('#', '')}`;
const solsKey = (challengeId: string) => `samadhanhub_solutions_${String(challengeId).replace('#', '')}`;

export function stageRank(stage?: string): number {
  const i = STAGE_ORDER.indexOf(stage || '');
  return i === -1 ? -1 : i;
}

/** Highest known stage: backend value unless a local advance moved further. */
export function getEffectiveStage(id: string, backendStage?: string): string {
  const base = backendStage || 'registration';
  try {
    const local = localStorage.getItem(stageKey(id));
    if (local && stageRank(local) > stageRank(base)) return local;
  } catch { /* ignore */ }
  return base;
}

export function setLocalStage(id: string, stage: string): void {
  try {
    const cur = localStorage.getItem(stageKey(id));
    if (stageRank(stage) > stageRank(cur || '')) localStorage.setItem(stageKey(id), stage);
  } catch { /* ignore */ }
}

export function getLocalSolutions(challengeId: string): any[] {
  try {
    return JSON.parse(localStorage.getItem(solsKey(challengeId)) || '[]');
  } catch { return []; }
}

export function saveLocalSolution(challengeId: string, sol: any): any {
  const full = { ...sol, _id: sol._id || `local-${Date.now()}`, offline: true, createdAt: new Date().toISOString() };
  try {
    const all = getLocalSolutions(challengeId);
    localStorage.setItem(solsKey(challengeId), JSON.stringify([full, ...all].slice(0, 20)));
  } catch { /* ignore */ }
  return full;
}

export function updateLocalSolution(challengeId: string, solId: string, patch: any): void {
  try {
    const all = getLocalSolutions(challengeId).map((s) =>
      s._id === solId ? { ...s, ...patch } : s
    );
    localStorage.setItem(solsKey(challengeId), JSON.stringify(all));
  } catch { /* ignore */ }
}

/** Find a locally-saved solution by id across all challenges (for detail pages). */
export function findLocalSolution(solId: string): any | null {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('samadhanhub_solutions_')) continue;
      const hit = (JSON.parse(localStorage.getItem(k) || '[]') as any[]).find((s) => s._id === solId);
      if (hit) return hit;
    }
  } catch { /* ignore */ }
  return null;
}

/** Challenges created on this device (offline submissions) — shown above dummies in portals. */
export function getCreatedChallenges(): any[] {
  try {
    const raw = JSON.parse(localStorage.getItem('samadhanhub_submitted') || '[]');
    return (Array.isArray(raw) ? raw : []).map((c: any) => ({ ...c, _mine: true }));
  } catch { return []; }
}

/** All locally-saved solutions across challenges, each tagged with its challenge id. */
export function getAllLocalSolutions(): any[] {
  const out: any[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('samadhanhub_solutions_')) continue;
      const cid = k.replace('samadhanhub_solutions_', '');
      (JSON.parse(localStorage.getItem(k) || '[]') as any[]).forEach((s) => out.push({ ...s, _challengeId: cid }));
    }
  } catch { /* ignore */ }
  return out;
}

const evalsKey = (solId: string) => `samadhanhub_evals_${solId}`;

/** Evaluations for on-device (local) solutions — the server can't store these. */
export function getLocalEvals(solId: string): any[] {
  try {
    return JSON.parse(localStorage.getItem(evalsKey(solId)) || '[]');
  } catch { return []; }
}

export function saveLocalEval(solId: string, ev: any): any {
  const full = { ...ev, _id: ev._id || `leval-${Date.now()}`, createdAt: new Date().toISOString() };
  try {
    const all = getLocalEvals(solId);
    localStorage.setItem(evalsKey(solId), JSON.stringify([full, ...all].slice(0, 20)));
  } catch { /* ignore */ }
  return full;
}
