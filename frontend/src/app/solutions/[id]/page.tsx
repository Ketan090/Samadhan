'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { solutionsAPI, evaluationsAPI } from '@/lib/api';
import { getStatusColor, formatNumber, formatDate } from '@/lib/utils';
import { ArrowLeft, Users, Calendar, IndianRupee, Rocket, CheckCircle2, Lightbulb, Target, ChevronRight, Brain, Star, TrendingUp, Shield, ExternalLink } from 'lucide-react';

export default function SolutionDetailPage() {
  const params = useParams();
  const [solution, setSolution] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const load=async()=>{ try{ const s=await solutionsAPI.getById(params.id as string); setSolution(s.data.solution); const e=await evaluationsAPI.getBySolution(params.id as string); setEvaluations(e.data.evaluations);} catch{ setSolution({ _id:params.id, title:'SmartBin: IoT-Enabled Waste Collection Optimization System', challenge:{title:'Smart Waste Collection for Urban Wards', category:'Environment', location:{city:'Ranchi', state:'Jharkhand'}}, submittedBy:{name:'Prof. Amit Verma'}, team:{name:'EcoTech Solutions'}, problemAddressed:'Low waste collection efficiency of 40% in Ranchi urban wards affecting 25,000 residents', proposedApproach:'Deploy IoT sensors in waste bins across all wards. Use AI to optimize collection routes in real-time. Provide a mobile app for citizens to report issues and track collection. Dashboard for ward administrators to monitor operations.', technology:['IoT Sensors','Machine Learning','Mobile App','Cloud Platform','GPS Tracking'], architecture:'Three-tier architecture: IoT layer (sensors + gateways), Cloud layer (data processing + AI), Application layer (mobile + web dashboards)', expectedImpact:'Increase waste collection efficiency from 40% to 85%. Reduce fuel costs by 30%. Improve citizen satisfaction by 60%.', estimatedCost:2500000, implementationTimeline:'6 months pilot in 5 wards, 12 months full deployment', scalability:'Easily scalable to other cities. Modular design allows adding new sensor types and features.', status:'under-review', scorecard:{ impact:8, feasibility:8, scalability:9, innovation:7, costEffectiveness:7, totalScore:7.85 }, createdAt:'2024-03-15'}); setEvaluations([{ _id:'e1', evaluator:{name:'Meena Joshi', role:'expert'}, scores:{impact:8, feasibility:8, scalability:9, innovation:7, costEffectiveness:7}, weightedScore:7.85, recommendation:'approve', comments:'Strong solution with practical IoT implementation and clear ROI.', strengths:['Uses existing infrastructure','Modular design','Clear impact metrics'], weaknesses:['Requires maintenance training'], recommendations:['Start with pilot in 2 wards']}]) } setLoading(false); }; load(); }, [params.id]);

  if(loading) return <div className="min-h-screen bg-white dark:bg-[#070A12]"><div className="container py-8 animate-pulse space-y-4"><div className="h-6 bg-slate-100 dark:bg-white/10 rounded w-1/3" /><div className="h-64 bg-slate-100 dark:bg-white/10 rounded-2xl" /></div></div>;
  if(!solution) return null;
  const sc=solution.scorecard;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="container py-6">
          <Link href="/solutions" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 mb-3"><ArrowLeft className="h-3.5 w-3.5" /> Solutions</Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={`${getStatusColor(solution.status)} capitalize rounded-full`}>{solution.status}</Badge>
            <span className="text-xs text-slate-500">for <Link href={`/challenges/${solution.challenge?._id||''}`} className="font-medium text-slate-900 dark:text-white hover:underline">{solution.challenge?.title}</Link></span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight">{solution.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-7 w-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 grid place-items-center text-[11px] font-bold">{solution.team?.name?.[0]||'T'}</span>{solution.team?.name||'Team'} · {solution.submittedBy?.name}</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(solution.createdAt)}</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />{formatNumber(solution.estimatedCost)}</span>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 lg:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Problem Addressed</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{solution.problemAddressed}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 lg:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-2"><Rocket className="h-4 w-4 text-blue-500" /> Proposed Approach</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{solution.proposedApproach}</p>
            </div>
            {solution.architecture && <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 lg:p-6"><h2 className="font-semibold mb-2">Architecture</h2><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{solution.architecture}</p></div>}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 lg:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-emerald-500" /> Expected Impact</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{solution.expectedImpact}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">Expert Evaluations <span className="text-slate-400 font-normal">· {evaluations.length}</span></h2>
                <Badge variant="outline" className="rounded-full text-xs border-slate-200 dark:border-white/10 dark:text-slate-300">Weighted score</Badge>
              </div>
              <div className="p-4">
                {evaluations.length===0 ? <div className="text-center py-8"><div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 grid place-items-center mx-auto"><Star className="h-5 w-5 text-slate-400" /></div><p className="text-sm text-slate-500 mt-3">No evaluations yet.</p></div> : (
                  <div className="space-y-3">
                    {evaluations.map(ev=>(
                      <div key={ev._id} className="rounded-2xl border border-slate-200 dark:border-white/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 grid place-items-center text-xs font-bold">{ev.evaluator?.name?.[0]}</div><div><div className="text-sm font-semibold">{ev.evaluator?.name}</div><div className="text-xs text-slate-500 capitalize">{ev.evaluator?.role}</div></div><Badge variant="outline" className="ml-2 capitalize rounded-full text-[11px] hidden sm:inline-flex border-slate-200 dark:border-white/10 dark:text-slate-300">{ev.recommendation}</Badge></div>
                          <div className="text-right"><div className="text-lg font-bold text-blue-600">{ev.weightedScore?.toFixed(1)}</div><div className="text-[11px] text-slate-400">/10</div></div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{ev.comments}</p>
                        <div className="grid grid-cols-5 gap-2 mt-3">
                          {['impact','feasibility','scalability','innovation','costEffectiveness'].map(k=>(
                            <div key={k} className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 p-2 text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{k==='costEffectiveness'?'Cost':k}</div>
                              <div className="text-sm font-bold">{ev.scores[k]}</div>
                            </div>
                          ))}
                        </div>
                        {ev.strengths?.length>0 && <div className="mt-3 text-xs"><span className="font-semibold text-emerald-600">Strengths:</span> <span className="text-slate-600 dark:text-slate-400">{ev.strengths.join(' · ')}</span></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sc && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Scorecard</div>
                <div className="text-center py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 mb-4">
                  <div className="text-4xl font-bold tracking-tight">{sc.totalScore}</div><div className="text-xs text-slate-500">Total Score / 10</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 px-2.5 py-1 rounded-full"><CheckCircle2 className="h-3 w-3" /> {sc.totalScore>=8?'Strong':'Promising'}</div>
                </div>
                {[
                  {label:'Impact (30%)', value:sc.impact, color:'bg-blue-500'},
                  {label:'Feasibility (25%)', value:sc.feasibility, color:'bg-emerald-500'},
                  {label:'Scalability (20%)', value:sc.scalability, color:'bg-violet-500'},
                  {label:'Innovation (15%)', value:sc.innovation, color:'bg-amber-500'},
                  {label:'Cost (10%)', value:sc.costEffectiveness, color:'bg-cyan-500'},
                ].map(i=>(
                  <div key={i.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">{i.label}</span><span className="font-bold">{i.value}/10</span></div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full"><div className={`h-1.5 ${i.color} rounded-full`} style={{width:`${i.value*10}%`}} /></div>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Technology</div>
              <div className="flex flex-wrap gap-1.5">{(solution.technology||[]).map((t:string)=><Badge key={t} variant="secondary" className="rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-transparent">{t}</Badge>)}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 space-y-3">
              <div className="text-xs font-bold tracking-widest uppercase text-slate-500">Details</div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Cost</span><span className="font-bold flex items-center gap-1"><IndianRupee className="h-3 w-3" />{formatNumber(solution.estimatedCost)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Timeline</span><span className="font-medium text-xs text-right max-w-[160px]">{solution.implementationTimeline}</span></div>
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex gap-2">
                <Link href={`/challenges/${solution.challenge?._id||''}`} className="flex-1"><Button variant="outline" className="w-full rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">View Challenge</Button></Link>
                <Button className="flex-1 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900"><ExternalLink className="h-4 w-4 mr-1.5" /> Contact Team</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
