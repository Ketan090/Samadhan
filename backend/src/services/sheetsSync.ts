// Google-Sheets mirror of the core collections (challenges + solutions).
//
// Why: an Excel-friendly live copy of the website database, appended via a
// free Apps Script Web App — no paid add-ons, no new npm deps.
//
// Setup (one time, 3 min):
//   1. Create a Google Sheet (this becomes the database copy).
//   2. Extensions → Apps Script → paste sheet-sync.gs (repo root) → Deploy
//      → New deployment → Web app → Execute as: Me → Who has access: Anyone.
//   3. Copy the Web App URL into backend/.env as APPS_SCRIPT_URL and restart
//      the backend. New challenges/solutions then append as rows automatically.
//
// Notes:
//   - MongoDB stays the real database; the sheet is a mirror for viewing /
//     Excel download. When APPS_SCRIPT_URL is unset this is a silent no-op.
//   - Users are NEVER synced (passwords/PII stay in Mongo only).
//   - Fire-and-forget with a short timeout: a slow/dead script can never
//     break or slow the API response.
const scriptUrl = () => (process.env.APPS_SCRIPT_URL || '').trim();

export function challengeRow(c: any): Record<string, any> {
  return {
    id: String(c._id || ''),
    title: c.title || '',
    description: c.description || '',
    category: c.category || '',
    city: c.location?.city || '',
    state: c.location?.state || '',
    severity: c.severity || '',
    status: c.status || '',
    verificationStatus: c.verificationStatus || '',
    workflowStage: c.workflowStage || '',
    affectedPopulation: c.affectedPopulation ?? '',
    tags: Array.isArray(c.tags) ? c.tags.join('; ') : '',
    submittedBy: c.submittedBy?.toString?.() || String(c.submittedBy || ''),
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
  };
}

export function solutionRow(s: any): Record<string, any> {
  return {
    id: String(s._id || ''),
    challenge: s.challenge?.toString?.() || String(s.challenge || ''),
    title: s.title || s.problemAddressed || '',
    status: s.status || '',
    estimatedCost: s.estimatedCost ?? '',
    technology: Array.isArray(s.technology) ? s.technology.join('; ') : '',
    submittedBy: s.submittedBy?.toString?.() || String(s.submittedBy || ''),
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function sheetsAppend(sheet: 'challenges' | 'solutions', row: Record<string, any>): Promise<void> {
  const url = scriptUrl();
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet, row }),
      signal: AbortSignal.timeout(6000) as any,
    });
  } catch {
    // Mirror must never break the API — fail silently.
  }
}
