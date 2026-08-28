'use client';
import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, ArrowLeft, Rocket, Lightbulb, Target, ChevronRight, Plus, X } from 'lucide-react';

function SubmitSolutionForm() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challenge') || '';
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title:'', problemAddressed:'', proposedApproach:'', technology:[] as string[], architecture:'', expectedImpact:'', estimatedCost:0, implementationTimeline:'', scalability:'', challenge: challengeId });
  const [newTech, setNewTech] = useState('');
  const update=(u:any)=>setForm(p=>({...p,...u}));

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-white dark:bg-[#070A12]">
      <div className="w-full max-w-lg rounded-[24px] border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-[#0F1420] p-8 text-center shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><CheckCircle2 className="h-7 w-7" /></div>
        <h1 className="text-2xl font-bold mt-4">Solution Submitted!</h1>
        <p className="text-sm text-slate-500 mt-1">Under expert review — you’ll hear back soon.</p>
        <div className="flex gap-3 mt-6"><Button variant="outline" onClick={()=>setSubmitted(false)} className="flex-1 rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">Submit another</Button><Link href="/solutions" className="flex-1"><Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">View solutions</Button></Link></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] sticky top-0 z-20 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><Link href="/solutions" className="hover:text-slate-900">Solutions</Link><ChevronRight className="h-3 w-3" />Submit</div>
          <div className="flex items-end justify-between gap-4">
            <div><h1 className="text-2xl font-bold tracking-tight">Submit a Solution</h1><p className="text-sm text-slate-500">Propose your approach to a verified challenge — clear, measurable, and scalable.</p></div>
            <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hidden sm:flex"><Rocket className="h-3 w-3 mr-1" /> 2 steps</Badge>
          </div>
          <div className="mt-6 flex items-center gap-2">
            {[{id:1,label:'Solution Details',desc:'Title & approach',icon:Lightbulb},{id:2,label:'Impact & Plan',desc:'Cost & timeline',icon:Target}].map((s,i)=>{
              const Icon=s.icon; const active=step===s.id; const done=step> s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border ${done?'bg-emerald-500 text-white border-emerald-500': active?'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white':'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}>
                    <span className={`h-7 w-7 rounded-full grid place-items-center ${done?'bg-white/20': active?'bg-white/15':'bg-slate-100 dark:bg-white/10'}`}>{done? <CheckCircle2 className="h-4 w-4" />: <Icon className="h-4 w-4" />}</span>
                    <span><span className="text-xs font-bold block leading-none">{s.label}</span><span className="text-[11px] opacity-70">{s.desc}</span></span>
                  </div>
                  {i===0 && <div className={`flex-1 h-0.5 max-w-[80px] ${done?'bg-emerald-500':'bg-slate-200 dark:bg-white/10'}`} />}
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
              <div><label className="text-xs font-semibold">Solution Title *</label><Input placeholder="e.g., SmartBin: IoT-Enabled Waste Collection System" value={form.title} onChange={e=>update({title:e.target.value})} className="mt-1.5 h-11 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Problem Addressed *</label><Textarea placeholder="Which specific problem does your solution address?" value={form.problemAddressed} onChange={e=>update({problemAddressed:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Proposed Approach *</label><Textarea placeholder="Describe your solution approach in detail..." value={form.proposedApproach} onChange={e=>update({proposedApproach:e.target.value})} className="mt-1.5 min-h-[120px] rounded-xl" /></div>
              <div>
                <label className="text-xs font-semibold">Technology Stack</label>
                <div className="flex gap-2 mt-1.5"><Input placeholder="Add technology (press Enter)" value={newTech} onChange={e=>setNewTech(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&newTech){update({technology:[...form.technology,newTech]}); setNewTech('')}}} className="h-11 rounded-xl" /><Button type="button" variant="outline" onClick={()=>{ if(newTech){update({technology:[...form.technology,newTech]}); setNewTech('')}}} className="h-11 rounded-xl border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><Plus className="h-4 w-4" /></Button></div>
                <div className="flex flex-wrap gap-1.5 mt-2">{form.technology.map(t=><span key={t} className="inline-flex items-center gap-1 text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 rounded-full">{t}<button onClick={()=>update({technology: form.technology.filter(x=>x!==t)})}><X className="h-3 w-3" /></button></span>)}</div>
              </div>
            </div>
          )}
          {step===2 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-emerald-500" /> Impact & Implementation</h2>
              <div><label className="text-xs font-semibold">Architecture</label><Textarea placeholder="Describe your system architecture..." value={form.architecture} onChange={e=>update({architecture:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Expected Impact *</label><Textarea placeholder="What measurable impact will your solution create?" value={form.expectedImpact} onChange={e=>update({expectedImpact:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold">Estimated Cost (₹)</label><Input type="number" placeholder="2500000" value={form.estimatedCost||''} onChange={e=>update({estimatedCost: parseInt(e.target.value)||0})} className="mt-1.5 h-11 rounded-xl" /></div>
                <div><label className="text-xs font-semibold">Implementation Timeline</label><Input placeholder="6 months pilot, 12 months full deployment" value={form.implementationTimeline} onChange={e=>update({implementationTimeline:e.target.value})} className="mt-1.5 h-11 rounded-xl" /></div>
              </div>
              <div><label className="text-xs font-semibold">Scalability</label><Textarea placeholder="How can this solution scale to other areas?" value={form.scalability} onChange={e=>update({scalability:e.target.value})} className="mt-1.5 rounded-xl" /></div>
            </div>
          )}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
            <Button variant="outline" onClick={()=>setStep(1)} disabled={step===1} className="rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            {step<2 ? <Button onClick={()=>setStep(2)} disabled={!form.title||!form.problemAddressed||!form.proposedApproach} className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900">Next <ArrowRight className="h-4 w-4 ml-2" /></Button> : <Button onClick={()=>setSubmitted(true)} disabled={!form.title||!form.problemAddressed||!form.proposedApproach} className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900"><Rocket className="h-4 w-4 mr-2" /> Submit Solution</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubmitSolutionPage(){
  return <Suspense fallback={<div className="container py-12 max-w-3xl mx-auto animate-pulse"><div className="h-8 bg-slate-100 dark:bg-white/10 rounded w-1/3" /><div className="h-64 bg-slate-100 dark:bg-white/10 rounded-2xl mt-6" /></div>}><SubmitSolutionForm /></Suspense>;
}
