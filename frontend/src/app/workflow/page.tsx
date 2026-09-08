'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIAnalysesHub from '@/components/AIAnalysesHub';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  { title: 'LANDING PAGE', desc: 'Citizen lands on Samadhan' },
  { title: 'CHALLENGE REGISTRATION FORM', desc: 'Fills title, desc, photo, location' },
  { title: 'LOGIN PAGE', desc: 'Auth or new account' },
  { title: 'AI ANALYSES', desc: '4 parallel AI tasks', highlight: true },
  { title: 'CHALLENGE SENT TO UNIVERSITY PORTAL', desc: 'Matched university receives' },
  { title: 'UNIVERSITY PROPOSES A SOLUTION', desc: 'Students & faculty propose' },
  { title: 'GOVERNMENT APPROVES AND VALIDATES', desc: 'Gov verifies & funds' },
  { title: 'INDUSTRY JOINS AND COLLABORATES', desc: 'Industry mentors & scales' },
  { title: 'UPLOAD PROGRESS PHOTOS REGULARLY', desc: 'Per step evidence' },
  { title: 'CITIZEN GETS SATISFIED', desc: 'Impact measured' },
];

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10 max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">AI-Powered Challenge Innovation Platform Workflow</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">How Samadhan Works — Poster Flow</h1>
          <p className="text-sm text-slate-500 mt-2">Landing → Registration → Login → AI (4) → University → Government → Industry → Progress → Satisfaction</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-6 sm:p-8">
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="text-center rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-4"><div className="text-xs font-bold">LANDING PAGE</div><div className="h-16 mt-2 rounded bg-slate-100 dark:bg-white/5 grid place-items-center text-[10px]">Hero</div></div>
            <div className="text-center rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-4"><div className="text-xs font-bold">CHALLENGE REGISTRATION FORM</div><div className="h-16 mt-2 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 grid place-items-center"><span className="text-xs">📝 Form</span></div></div>
            <div className="text-center rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-4"><div className="text-xs font-bold">LOGIN PAGE</div><div className="text-xs text-slate-500">New Account & Credentials</div></div>
          </div>

          <div className="mt-6">
            <AIAnalysesHub active />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-[11px]">
              <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-violet-200 dark:border-violet-900/30 p-3 text-center"><div className="font-bold text-violet-600">1. PHOTO DE-DUPLICATION</div><div className="text-slate-500 text-[10px]">FILTER</div></div>
              <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-emerald-200 dark:border-emerald-900/30 p-3 text-center"><div className="font-bold text-emerald-600">2. PHOTO VALIDATION</div><div className="text-slate-500 text-[10px]">Check evidence</div></div>
              <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-amber-200 dark:border-amber-900/30 p-3 text-center"><div className="font-bold text-amber-600">3. AUTO-DESCRIPTION</div><div className="text-slate-500 text-[10px]">AI generation</div></div>
              <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-violet-200 dark:border-violet-900/30 p-3 text-center"><div className="font-bold text-violet-600">4. AI-MATCHING</div><div className="text-slate-500 text-[10px]">Universities</div></div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-3">
            {[
              { t: 'CHALLENGE SENT TO UNIVERSITY PORTAL', d: 'Matched challenge appears in University dashboard' },
              { t: 'UNIVERSITY PROPOSES A SOLUTION', d: 'Students & faculty submit proposal' },
              { t: 'GOVERNMENT APPROVES AND VALIDATES', d: 'Gov verifies & funds pilot' },
              { t: 'INDUSTRY JOINS AND COLLABORATES', d: 'Industry mentors & scales' },
              { t: 'UPLOAD PROGRESS PHOTOS REGULARLY', d: 'For each step, upload evidence' },
              { t: 'CITIZEN GETS SATISFIED', d: 'Impact tracked, citizen happy', highlight: true },
            ].map(s => (
              <div key={s.t} className={`rounded-xl border p-4 text-center ${s.highlight ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30' : 'bg-white dark:bg-[#0F1420] border-slate-200 dark:border-white/10'}`}>
                <div className={`text-xs font-bold ${s.highlight ? 'text-emerald-600' : ''}`}>{s.t}</div>
                <div className="text-[11px] text-slate-500 mt-1">{s.d}</div>
                {s.highlight && <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mt-2" />}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/challenges/submit"><Button className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 gap-2">Start at Landing → Report <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/challenges"><Button variant="outline" className="rounded-full">Explore Challenges</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
