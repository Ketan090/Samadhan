'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, CheckCircle2, AlertCircle, Eye, MapPin } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { challengesAPI } from '@/lib/api';

export default function TrackPage(){
  const [ref, setRef] = useState('');
  const [found, setFound] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(()=>{
    try{ const r = JSON.parse(localStorage.getItem('samadhanhub_submitted')||'[]'); setRecent(r.slice(0,6)); } catch{}
  },[]);

  const handleTrack = async()=>{
    setNotFound(false); setFound(null);
    const q = ref.trim();
    if(!q) return;
    try{
      const r = await challengesAPI.getById(q);
      setFound(r.data.challenge);
      return;
    } catch{}
    try{
      const r = await challengesAPI.getAll({ search: q, limit: 5 });
      const hit = r.data.challenges?.find((c:any)=> c._id===q || c.title.toLowerCase().includes(q.toLowerCase()));
      if(hit){ setFound(hit); return; }
    } catch{}
    try{
      const local = JSON.parse(localStorage.getItem('samadhanhub_submitted')||'[]');
      const hit = local.find((c:any)=> c._id===q || c._id===q.replace('#','') || c.title.toLowerCase().includes(q.toLowerCase()));
      if(hit){ setFound(hit); return; }
    } catch{}
    setNotFound(true);
  };

  const Timeline = ({ status, verificationStatus }:any)=>{
    const steps = [
      { key:'submitted', label:'Submitted', desc:'We received your complaint', icon: CheckCircle2 },
      { key:'checking', label:'Checking evidence', desc:'Looking at your photo', icon: Eye },
      { key:'review', label:'Under Review', desc:'Sent for human review', icon: Clock },
      { key:'verified', label:'Verified', desc:'Action will be taken', icon: CheckCircle2 },
    ];
    const idx = verificationStatus==='verified' ? 3 : verificationStatus==='pending' || status==='submitted' ? 2 : 1;
    return (
      <div className="relative">
        <div className="absolute left-[15px] top-[10px] bottom-[10px] w-px bg-slate-200 dark:bg-white/10" />
        <div className="absolute left-[15px] top-[10px] w-px bg-emerald-500 transition-all" style={{height:`${(idx/3)*100}%`}} />
        <div className="space-y-4">
          {steps.map((s,i)=>{
            const done=i<=idx; const Icon=s.icon;
            return (
              <div key={s.key} className="flex gap-3">
                <div className={`h-8 w-8 rounded-full grid place-items-center shrink-0 border-2 ${done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}><Icon className="h-4 w-4" /></div>
                <div><div className={`text-sm font-semibold ${done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s.label}</div><div className="text-xs text-slate-500">{s.desc}</div></div>
              </div>
            )
          })}
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight">Track your complaint</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter your reference number to see the current status.</p>

        <div className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={ref} onChange={e=>setRef(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleTrack()} placeholder="Reference e.g. #SAM-123456 or CHL-..." className="pl-10 h-12 rounded-xl" />
          </div>
          <Button onClick={handleTrack} className="h-12 rounded-xl px-6 bg-slate-900 dark:bg-white dark:text-slate-900">Track</Button>
        </div>

        <div className="mt-8">
          {found ? (
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="rounded-full font-mono text-xs">{found._id}</Badge>
                  <h2 className="text-lg font-bold mt-2">{found.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{found.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{found.location?.city}, {found.location?.state}</span><span>• {formatNumber(found.affectedPopulation||0)} affected</span></div>
                </div>
                <Badge className={`${found.verificationStatus==='verified' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'} rounded-full`}>{found.verificationStatus==='verified' ? 'Verified' : 'Under Review'}</Badge>
              </div>
              <div className="mt-6">
                <Timeline status={found.status} verificationStatus={found.verificationStatus} />
              </div>
              <div className="mt-6 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-500">
                We'll update the status when there is progress. You don't need to do anything else.
              </div>
            </div>
          ) : notFound ? (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-6 text-center">
              <AlertCircle className="h-6 w-6 text-amber-600 mx-auto" />
              <p className="text-sm font-semibold mt-2">We couldn't find that reference</p>
              <p className="text-xs text-slate-500 mt-1">Check the number or try browsing your recent submissions below.</p>
            </div>
          ) : null}
        </div>

        {!found && recent.length>0 && (
          <div className="mt-10">
            <h3 className="text-sm font-bold tracking-tight">Recent submissions on this device</h3>
            <p className="text-xs text-slate-500">These are stored locally so you can track them even offline.</p>
            <div className="mt-3 space-y-2">
              {recent.map((c:any)=>(
                <button key={c._id} onClick={()=>{ setRef(c._id); setFound(c); setNotFound(false); window.scrollTo({top:0, behavior:'smooth'}); }} className="w-full text-left rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 hover:border-slate-300 dark:hover:border-white/15 flex items-center justify-between">
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{c.title}</div><div className="text-xs text-slate-500">#{c._id} • {c.verificationStatus || 'Under Review'}</div></div>
                  <Badge variant="outline" className="rounded-full ml-3 shrink-0">View</Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Link href="/challenges" className="flex-1"><Button variant="outline" className="w-full rounded-full h-11">Browse complaints</Button></Link>
          <Link href="/challenges/submit" className="flex-1"><Button className="w-full rounded-full h-11 bg-slate-900 dark:bg-white dark:text-slate-900">Submit another</Button></Link>
        </div>
      </div>
    </div>
  )
}
