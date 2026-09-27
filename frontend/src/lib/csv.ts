// Excel-friendly CSV export (opens directly in Excel/Sheets).
// Used by the list pages to download exactly what is on screen
// (demo or real data — whatever the page currently shows).

const esc = (v: any): string => {
  const s =
    v == null ? '' : Array.isArray(v) ? v.join('; ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Downloads rows as filename.csv (with BOM so Excel shows UTF-8). Returns false when empty. */
export function downloadCsv(filename: string, rows: Record<string, any>[]): boolean {
  if (!rows.length) return false;
  const heads: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    const ks = Object.keys(rows[i]);
    for (let k = 0; k < ks.length; k++) {
      if (heads.indexOf(ks[k]) === -1) heads.push(ks[k]);
    }
  }
  const csv = '﻿' + [heads.join(','), ...rows.map((r) => heads.map((h) => esc(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export const challengeCsvRow = (c: any): Record<string, any> => ({
  ID: c._id || '',
  Title: c.title || '',
  Description: c.description || '',
  Category: c.category || '',
  City: c.location?.city || c.city || '',
  State: c.location?.state || c.state || '',
  Severity: c.severity || '',
  Status: c.status || '',
  Affected: c.affectedPopulation ?? '',
  Solutions: c.numberOfSolutions ?? '',
});

export const solutionCsvRow = (s: any): Record<string, any> => ({
  ID: s._id || '',
  Challenge: typeof s.challenge === 'object' ? s.challenge?.title || '' : s.challenge || '',
  Title: s.title || '',
  Status: s.status || '',
  Score: s.scorecard?.totalScore ?? '',
  Cost: s.estimatedCost ?? '',
  Technology: s.technology || '',
  By: s.submittedBy?.name || s.submittedBy || '',
});
