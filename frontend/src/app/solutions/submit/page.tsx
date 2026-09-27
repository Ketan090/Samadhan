'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { solutionsAPI, challengesAPI } from '@/lib/api';
import { saveLocalSolution, setLocalStage, getCreatedChallenges } from '@/lib/workflow';
import { CheckCircle2, ArrowRight, ArrowLeft, Rocket, Lightbulb, Target, ChevronRight, Plus, X, ListChecks, Sparkles, Loader2 } from 'lucide-react';

function SubmitSolutionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const challengeId = searchParams.get('challenge') || '';
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [savedId, setSavedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title:'', problemAddressed:'', proposedApproach:'', technology:[] as string[], architecture:'', expectedImpact:'', estimatedCost:0, implementationTimeline:'', scalability:'', challenge: challengeId });
  const [steps, setSteps] = useState<{title:string;description:string}[]>([{ title:'', description:'' }]);
  const [newTech, setNewTech] = useState('');
  const update=(u:any)=>setForm(p=>({...p,...u}));
  // Linked challenge context (for AI generation) + recent picker
  const [chall, setChall] = useState<any>(null);
  const [picks, setPicks] = useState<any[]>([]);
  const [genLoading, setGenLoading] = useState<Record<string, boolean>>({});
  const [genNote, setGenNote] = useState<string | null>(null);

  const loadChallengeCtx = async (cid: string) => {
    if (!cid) { setChall(null); return; }
    // Local created challenges first (works offline), then API
    try {
      const local = getCreatedChallenges().find((c: any) => c._id === cid || c._id === cid.replace('#', '') || `#${c._id}` === cid);
      if (local) { setChall(local); return; }
    } catch {}
    try {
      const r = await challengesAPI.getById(cid.replace('#', ''));
      setChall(r.data.challenge);
    } catch { setChall(null); }
  };

  useEffect(() => {
    // Challenge ID autofill: ?challenge= → latest created → latest from API
    const pick = async () => {
      let mine: any[] = [];
      try { mine = getCreatedChallenges().slice(0, 4); } catch {}
      let apiRecent: any[] = [];
      try {
        const r = await challengesAPI.getAll({ limit: 4 });
        apiRecent = (r.data.challenges || []).filter((c: any) => !mine.some((m: any) => m._id === c._id));
      } catch {}
      setPicks([...mine, ...apiRecent].slice(0, 4));
      const startId = challengeId || form.challenge;
      if (startId) { loadChallengeCtx(startId); return; }
      const first = mine[0] || apiRecent[0];
      if (first) { update({ challenge: first._id }); loadChallengeCtx(first._id); }
    };
    pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickChallenge = (cid: string) => { update({ challenge: cid }); loadChallengeCtx(cid); };

  // AI writer for every field — grounded in the linked challenge
  const genField = async (field: string) => {
    const cid = challengeId || form.challenge;
    if (!cid) { setGenNote('Pick or enter a Challenge ID first — AI writes from its context.'); return; }
    let ctx = chall;
    if (!ctx) {
      await loadChallengeCtx(cid);
      ctx = null; // loadChallengeCtx sets state async; refetch inline below
      try {
        const local = getCreatedChallenges().find((c: any) => c._id === cid);
        ctx = local || (await challengesAPI.getById(cid.replace('#', ''))).data.challenge;
        setChall(ctx);
      } catch {}
    }
    if (!ctx) { setGenNote('Could not load that challenge — check the ID or pick from recent.'); return; }
    setGenLoading((g) => ({ ...g, [field]: true }));
    setGenNote(null);
    try {
      const r = await fetch('/api/vision/draft-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, challenge: ctx }),
        signal: AbortSignal.timeout(60000) as any,
      });
      if (r.status === 429) {
        const wait = r.headers.get('retry-after') || '60';
        throw new Error(`AI rate limit — too many requests from your connection. Wait ~${wait}s and retry; your form is safe.`);
      }
      const j = await r.json();
      if (!j.success) throw new Error(j.message || 'AI busy');
      if (field === 'technology' && Array.isArray(j.items)) {
        update({ technology: Array.from(new Set([...form.technology, ...j.items.map((t: any) => String(t)).filter(Boolean)])).slice(0, 10) });
      } else if (field === 'steps' && Array.isArray(j.steps) && j.steps.length) {
        setSteps(j.steps.slice(0, 8).map((s: any) => ({ title: String(s.title || '').slice(0, 90), description: String(s.description || '').slice(0, 400) })));
        setStep(2);
      } else if (field === 'estimatedCost' && j.text) {
        const n = parseInt(String(j.text).replace(/[^0-9]/g, ''), 10);
        if (n > 0) update({ estimatedCost: n });
        else throw new Error('AI did not return a number — type it manually.');
      } else if (j.text) {
        update({ [field]: j.text } as any);
      } else throw new Error('AI returned nothing usable.');
    } catch (e: any) {
      setGenNote(String(e?.name === 'AbortError' || e?.name === 'TimeoutError' ? 'AI timed out — retry.' : e?.message || 'AI generation failed.'));
    } finally {
      setGenLoading((g) => ({ ...g, [field]: false }));
    }
  };

  const GenBtn = ({ field, label = 'Generate' }: { field: string; label?: string }) => (
    <button
      type="button"
      onClick={() => genField(field)}
      disabled={!!genLoading[field]}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50 ml-2"
    >
      {genLoading[field] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
      {genLoading[field] ? 'Writing…' : `${label} with AI`}
    </button>
  );

  const addStep = () => setSteps((s) => [...s, { title:'', description:'' }].slice(0, 8));
  const updateStep = (i:number, u:Partial<{title:string;description:string}>) => setSteps((s)=> s.map((x,xi)=> xi===i ? {...x,...u} : x));
  const removeStep = (i:number) => setSteps((s)=> s.filter((_,xi)=>xi!==i));

  const validSteps = steps.filter((s)=>s.title.trim().length>=3);
  const canSubmit = form.title && form.problemAddressed && form.proposedApproach && validSteps.length>0;

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    setSaving(true); setError(null);
    const payload = {
      ...form,
      challenge: challengeId || form.challenge,
      steps: validSteps,
    };
    try {
      const res = await solutionsAPI.create(payload);
      setSavedId(res.data.solution?._id || '');
      setSavedOffline(false);
      setSubmitted(true);
    } catch (e:any) {
      // Offline (no DB): save locally so the workflow still reaches step 6+
      const cid = challengeId || form.challenge;
      if (cid) {
        const local = saveLocalSolution(cid, { ...payload, status: 'submitted' });
        setSavedId(local._id);
        setLocalStage(cid, 'university-proposed');
        setSavedOffline(true);
        setSubmitted(true);
      } else {
        setError(e?.response?.data?.message || 'Submission failed — please login as University and retry.');
      }
    } finally { setSaving(false); }
  };

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-white dark:bg-[#070A12]">
      <div className="w-full max-w-lg rounded-[24px] border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-[#0F1420] p-8 text-center shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><CheckCircle2 className="h-7 w-7" /></div>
        <h1 className="text-2xl font-bold mt-4">University Proposes a Solution!</h1>
        <p className="text-sm text-slate-500 mt-1">Per workflow — sent for Government approval & validation next.</p>
        {savedOffline && <p className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">Saved on this device (no database connected) — it still counts for the workflow demo.</p>}
        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-3 text-xs text-left">
          <span className="font-bold">{validSteps.length} implementation steps</span> saved — progress photos will be uploaded per step regularly.
        </div>
        <div className="flex gap-3 mt-6">
          <Link href="/government" className="flex-1"><Button variant="outline" className="w-full rounded-full">Government Portal</Button></Link>
          <Link href={challengeId ? `/challenges/${challengeId}` : '/solutions'} className="flex-1"><Button className="w-full rounded-full bg-slate-900 dark:bg-white dark:text-slate-900">View Challenge</Button></Link>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">Next: Government approves → Industry joins → Progress photos → Citizen satisfied.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] sticky top-0 z-20 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><Link href="/solutions" className="hover:text-slate-900">Solutions</Link><ChevronRight className="h-3 w-3" />Submit · University proposes {challengeId && <><ChevronRight className="h-3 w-3" /><span className="font-mono">{challengeId.slice(-6)}</span></>}</div>
          <div className="flex items-end justify-between gap-4">
            <div><h1 className="text-2xl font-bold tracking-tight">University Proposes a Solution</h1><p className="text-sm text-slate-500">Step 6 of workflow — break your proposal into steps so progress photos can be tracked per step.</p></div>
            <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hidden sm:flex"><Rocket className="h-3 w-3 mr-1" /> 3 steps</Badge>
          </div>
          <div className="mt-6 flex items-center gap-2 overflow-x-auto">
            {[{id:1,label:'Solution Details',desc:'Title & approach',icon:Lightbulb},{id:2,label:'Steps Breakdown',desc:'Per-step plan',icon:ListChecks},{id:3,label:'Impact & Plan',desc:'Cost & timeline',icon:Target}].map((s,i)=>{
              const Icon=s.icon; const active=step===s.id; const done=step> s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border shrink-0 ${done?'bg-emerald-500 text-white border-emerald-500': active?'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white':'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}>
                    <span className={`h-7 w-7 rounded-full grid place-items-center ${done?'bg-white/20': active?'bg-white/15':'bg-slate-100 dark:bg-white/10'}`}>{done? <CheckCircle2 className="h-4 w-4" />: <Icon className="h-4 w-4" />}</span>
                    <span><span className="text-xs font-bold block leading-none">{s.label}</span><span className="text-[11px] opacity-70">{s.desc}</span></span>
                  </div>
                  {i<2 && <div className={`flex-1 h-0.5 min-w-[40px] max-w-[80px] ${done?'bg-emerald-500':'bg-slate-200 dark:bg-white/10'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-3xl">
        <div className="rounded-[20px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 lg:p-7 shadow-sm">
          {step===1 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Solution Details</h2>
              <div>
                <label className="text-xs font-semibold">Challenge ID * <span className="font-normal text-slate-400">— autofilled</span></label>
                <Input placeholder="Linked challenge" value={form.challenge} onChange={e=>{ update({challenge:e.target.value}); }} onBlur={e=>{ if(e.target.value.trim()) loadChallengeCtx(e.target.value.trim()); }} className="mt-1.5 h-11 rounded-xl font-mono" />
                {picks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-400 self-center">Recent:</span>
                    {picks.map((p:any)=>(
                      <button key={p._id} type="button" onClick={()=>pickChallenge(p._id)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${(challengeId || form.challenge)===p._id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-400'}`}>
                        {(p.title||p._id).slice(0,28)}
                      </button>
                    ))}
                  </div>
                )}
                {chall && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5">Linked: {chall.title} — AI writes every field from this.</p>}
              </div>
              {genNote && <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-2.5 text-xs text-amber-700 dark:text-amber-300">{genNote}</div>}
              <div><label className="text-xs font-semibold">Solution Title *<GenBtn field="title" /></label><Input placeholder="e.g., SmartBin: IoT-Enabled Waste Collection System" value={form.title} onChange={e=>update({title:e.target.value})} className="mt-1.5 h-11 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Problem Addressed *<GenBtn field="problemAddressed" /></label><Textarea placeholder="Which specific problem does your solution address?" value={form.problemAddressed} onChange={e=>update({problemAddressed:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Proposed Approach *<GenBtn field="proposedApproach" /></label><Textarea placeholder="Describe your solution approach in detail..." value={form.proposedApproach} onChange={e=>update({proposedApproach:e.target.value})} className="mt-1.5 min-h-[120px] rounded-xl" /></div>
              <div>
                <label className="text-xs font-semibold">Technology Stack<GenBtn field="technology" /></label>
                <div className="flex gap-2 mt-1.5"><Input placeholder="Add technology (press Enter)" value={newTech} onChange={e=>setNewTech(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&newTech){update({technology:[...form.technology,newTech]}); setNewTech('')}}} className="h-11 rounded-xl" /><Button type="button" variant="outline" onClick={()=>{ if(newTech){update({technology:[...form.technology,newTech]}); setNewTech('')}}} className="h-11 rounded-xl"><Plus className="h-4 w-4" /></Button></div>
                <div className="flex flex-wrap gap-1.5 mt-2">{form.technology.map(t=><span key={t} className="inline-flex items-center gap-1 text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 rounded-full">{t}<button onClick={()=>update({technology: form.technology.filter(x=>x!==t)})}><X className="h-3 w-3" /></button></span>)}</div>
              </div>
            </div>
          )}
          {step===2 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><ListChecks className="h-4 w-4 text-violet-600" /> Implementation Steps <span className="text-xs font-normal text-slate-500">— progress photos will be uploaded for each step regularly</span></h2>
              <Button type="button" variant="outline" onClick={()=>genField('steps')} disabled={!!genLoading['steps']} className="rounded-full h-9 text-xs">
                {genLoading['steps'] ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 mr-2" />}
                {genLoading['steps'] ? 'Writing steps…' : 'Generate all steps with AI'}
              </Button>
              {steps.map((s,i)=>(
                <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">STEP {i+1}</span>
                    {steps.length>1 && <button onClick={()=>removeStep(i)} className="text-xs text-red-500 hover:underline">Remove</button>}
                  </div>
                  <Input placeholder={`Step ${i+1} title e.g. Install IoT bins in Ward 4`} value={s.title} onChange={e=>updateStep(i,{title:e.target.value})} className="h-11 rounded-xl" />
                  <Textarea placeholder="What will be done in this step? (photo evidence will be attached later)" value={s.description} onChange={e=>updateStep(i,{description:e.target.value})} className="rounded-xl" />
                </div>
              ))}
              <Button variant="outline" onClick={addStep} className="w-full rounded-full h-11"><Plus className="h-4 w-4 mr-2" /> Add Step ({steps.length}/8)</Button>
              <p className="text-[11px] text-slate-400">Poster requires: “For each proposed step in the solution by the university” — upload progress photos regularly.</p>
            </div>
          )}
          {step===3 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-emerald-500" /> Impact & Implementation</h2>
              <div><label className="text-xs font-semibold">Architecture<GenBtn field="architecture" /></label><Textarea placeholder="Describe your system architecture..." value={form.architecture} onChange={e=>update({architecture:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Expected Impact *<GenBtn field="expectedImpact" /></label><Textarea placeholder="What measurable impact will your solution create?" value={form.expectedImpact} onChange={e=>update({expectedImpact:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold">Estimated Cost (₹)<GenBtn field="estimatedCost" /></label><Input type="number" placeholder="2500000" value={form.estimatedCost||''} onChange={e=>update({estimatedCost: parseInt(e.target.value)||0})} className="mt-1.5 h-11 rounded-xl" /></div>
                <div><label className="text-xs font-semibold">Implementation Timeline<GenBtn field="implementationTimeline" /></label><Input placeholder="6 months pilot, 12 months full deployment" value={form.implementationTimeline} onChange={e=>update({implementationTimeline:e.target.value})} className="mt-1.5 h-11 rounded-xl" /></div>
              </div>
              <div><label className="text-xs font-semibold">Scalability<GenBtn field="scalability" /></label><Textarea placeholder="How can this solution scale to other areas?" value={form.scalability} onChange={e=>update({scalability:e.target.value})} className="mt-1.5 rounded-xl" /></div>
            </div>
          )}
          {error && <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
            <Button variant="outline" onClick={()=>setStep(Math.max(1,step-1))} disabled={step===1} className="rounded-full disabled:opacity-50"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            {step<3 ? <Button onClick={()=>setStep(step+1)} disabled={step===1 && (!form.title||!form.problemAddressed||!form.proposedApproach)} className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900">Next <ArrowRight className="h-4 w-4 ml-2" /></Button> : <Button onClick={handleSubmit} disabled={!canSubmit || saving} className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 disabled:opacity-50"><Rocket className="h-4 w-4 mr-2" /> {saving ? 'Submitting…' : 'Submit Solution → Government'} </Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubmitSolutionPage(){
  return <Suspense fallback={<div className="container py-12 max-w-3xl mx-auto animate-pulse"><div className="h-8 bg-slate-100 dark:bg-white/10 rounded w-1/3" /><div className="h-64 bg-slate-100 dark:bg-white/10 rounded-2xl mt-6" /></div>}><SubmitSolutionForm /></Suspense>;
}
