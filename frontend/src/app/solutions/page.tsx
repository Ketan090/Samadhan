'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { solutionsAPI } from '@/lib/api';
import { getStatusColor, formatDate } from '@/lib/utils';
import { Plus, ArrowRight, Lightbulb, Beaker, Rocket, CheckCircle2, Sparkles, Search, Layers, SlidersHorizontal } from 'lucide-react';

const demoSolutions = [
  { _id: 's1', title: 'SmartBin: IoT-Enabled Waste Collection', challenge: { title: 'Smart Waste Collection for Urban Wards', category: 'Environment' }, status: 'under-review', scorecard: { totalScore: 7.85 }, technology: ['IoT Sensors', 'Machine Learning', 'Mobile App'], estimatedCost: 2500000, submittedBy: { name: 'Prof. Amit Verma' }, createdAt: '2024-03-15' },
  { _id: 's2', title: 'AquaSense: Rural Water Quality Monitor', challenge: { title: 'Rural Water Quality Monitoring System', category: 'Healthcare' }, status: 'submitted', scorecard: null, technology: ['IoT Sensors', 'LoRaWAN', 'Solar Power'], estimatedCost: 1800000, submittedBy: { name: 'Dr. Sunita Reddy' }, createdAt: '2024-03-20' },
  { _id: 's3', title: 'TrafficPulse: AI Traffic Management', challenge: { title: 'Traffic Congestion Prediction', category: 'Transportation' }, status: 'pilot', scorecard: { totalScore: 8.05 }, technology: ['Computer Vision', 'Deep Learning', 'Edge Computing'], estimatedCost: 5000000, submittedBy: { name: 'TrafficAI Labs' }, createdAt: '2024-04-01' },
  { _id: 's4', title: 'GreenRoute: Fleet Optimization Platform', challenge: { title: 'Public Transport Optimization', category: 'Transportation' }, status: 'submitted', scorecard: null, technology: ['GPS', 'Predictive Analytics'], estimatedCost: 1200000, submittedBy: { name: 'Vikram Patel' }, createdAt: '2024-04-10' },
];

const statusIcons: Record<string, any> = { 'submitted': Lightbulb, 'under-review': Beaker, 'pilot': Rocket, 'implemented': CheckCircle2 };

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { const load = async () => { try { const res = await solutionsAPI.getAll(); setSolutions(res.data.solutions); } catch { setSolutions(demoSolutions); } setLoading(false); }; load(); }, []);

  const filtered = solutions.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search && !`${s.title} ${s.challenge?.title} ${s.technology?.join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const display = filtered.length ? filtered : search || statusFilter!=='all' ? [] : solutions;

  const stats = [
    { label: 'Total', value: solutions.length, icon: Lightbulb, tint: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' },
    { label: 'In Review', value: solutions.filter(s => s.status==='under-review'||s.status==='submitted').length, icon: Beaker, tint: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' },
    { label: 'Piloting', value: solutions.filter(s => s.status==='pilot').length, icon: Rocket, tint: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600' },
    { label: 'Implemented', value: solutions.filter(s => s.status==='implemented').length, icon: CheckCircle2, tint: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-500"><Sparkles className="h-3.5 w-3.5 text-violet-500" /> Innovate</div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Solutions</h1>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xl">Explore collaborative solutions — from lab to pilot to real-world impact.</p>
            </div>
            <Link href="/solutions/submit"><Button className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 h-10 px-6"><Plus className="h-4 w-4 mr-1.5" /> Submit Solution</Button></Link>
          </div>
          <div className="mt-6 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search solutions, challenge, tech..." className="pl-11 h-11 bg-white dark:bg-[#0F1420] rounded-full border-slate-200 dark:border-white/10 shadow-sm" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 shrink-0">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 rounded-full bg-white dark:bg-[#0F1420] w-[160px]"><SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All status</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="under-review">Under Review</SelectItem><SelectItem value="pilot">Pilot</SelectItem><SelectItem value="implemented">Implemented</SelectItem></SelectContent>
              </Select>
              <Link href="/challenges"><Button variant="outline" className="h-11 rounded-full bg-white dark:bg-[#0F1420] hidden sm:flex border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><Layers className="h-4 w-4 mr-1.5" /> Challenges</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map(s=>{ const Icon=s.icon; return <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 flex items-center gap-3"><div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${s.tint}`}><Icon className="h-4 w-4" /></div><div><div className="text-xl font-bold leading-none">{s.value}</div><div className="text-xs text-slate-500">{s.label}</div></div></div> })}
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-slate-500"><span><span className="font-semibold text-slate-900 dark:text-white">{display.length}</span> solutions {search||statusFilter!=='all' ? '· filtered' : ''}</span><span className="hidden sm:inline-flex items-center gap-1.5 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span></div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i=> <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-3 bg-white dark:bg-[#0F1420]"><div className="h-4 w-20 rounded-full bg-slate-100 dark:bg-white/10 animate-pulse" /><div className="h-5 w-3/4 rounded bg-slate-100 dark:bg-white/10 animate-pulse" /></div>)}</div>
        ) : display.length===0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-10 text-center"><div className="h-10 w-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 grid place-items-center mx-auto"><Search className="h-5 w-5 text-slate-400" /></div><div className="mt-3 font-semibold">No matches</div><p className="text-sm text-slate-500">Try adjusting search or status.</p><Button variant="outline" onClick={()=>{setSearch('');setStatusFilter('all')}} className="mt-4 rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">Clear filters</Button></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {display.map((sol, idx)=>{
              const StatusIcon=statusIcons[sol.status]||Lightbulb;
              return (
                <Link key={sol._id} href={`/solutions/${sol._id}`} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-100 dark:border-white/10 grid place-items-center"><StatusIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" /></div><Badge className={`${getStatusColor(sol.status)} capitalize text-[11px] rounded-full`}>{sol.status}</Badge></div>
                    {sol.scorecard && <div className="text-right leading-none"><div className="text-lg font-bold text-blue-600">{sol.scorecard.totalScore}</div><div className="text-[10px] text-slate-400">/10</div></div>}
                  </div>
                  <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{sol.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{sol.challenge?.title || 'Linked challenge'}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">{(sol.technology||[]).slice(0,3).map((t:string)=><span key={t} className="text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-transparent dark:border-white/5">{t}</span>)}{(sol.technology||[]).length>3 && <span className="text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-transparent dark:border-white/5">+{(sol.technology.length-3)}</span>}</div>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 text-xs text-slate-500"><span className="truncate">{sol.submittedBy?.name||'Team'}</span><span>₹{(sol.estimatedCost/100000).toFixed(1)}L · {formatDate(sol.createdAt)}</span></div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View solution <ArrowRight className="h-3 w-3" /></div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
