'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber, getStatusColor, getCategoryIcon } from '@/lib/utils';
import { challengesAPI, analyticsAPI } from '@/lib/api';
import {
  Shield, CheckCircle2, Clock, AlertTriangle, Rocket, BarChart3,
  Users, Lightbulb, Eye, Plus, Loader2
} from 'lucide-react';

export default function GovernmentDashboard() {
  const [pending, setPending] = useState<any[]>([
    { _id: 'demo-1', title: 'Public Transport Route Optimization', category: 'Transportation', city: 'Kolkata', state: 'West Bengal', submittedBy: 'Green Earth Foundation', affected: 1000000 },
    { _id: 'demo-2', title: 'Digital Literacy for Senior Citizens', category: 'Education', city: 'Pune', state: 'Maharashtra', submittedBy: 'Digital India Foundation', affected: 50000 },
  ]);
  const [actioning, setActioning] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const loadPending = async () => {
    try {
      const [res, analyticsRes] = await Promise.all([
        challengesAPI.getAll({ status: 'submitted', limit: 20 }),
        analyticsAPI.getOverview().catch(() => null)
      ]);
      if (analyticsRes) setAnalytics(analyticsRes.data.overview);
      const list = res.data.challenges?.length ? res.data.challenges.map((c:any)=>({ _id:c._id, title:c.title, category:c.category, city:c.location?.city, state:c.location?.state, submittedBy: c.submittedBy?.name || c.organization?.name || 'Citizen', affected: c.affectedPopulation })) : [];
      setPending(list);
    } catch {}
  };
  useEffect(()=>{ loadPending(); },[]);
  const handleVerify = async (id:string) => {
    setActioning(id);
    try { await challengesAPI.update(id, { verificationStatus: 'verified' }); setPending(p=>p.filter(x=>x._id!==id)); } 
    catch { setPending(p=>p.filter(x=>x._id!==id)); try{ const l=JSON.parse(localStorage.getItem('samadhanhub_verified')||'[]'); localStorage.setItem('samadhanhub_verified', JSON.stringify([...l,id])); }catch{} }
    finally { setActioning(null); }
  };
  const handleReject = async (id:string) => {
    setActioning(id);
    try { await challengesAPI.update(id, { verificationStatus: 'rejected' }); setPending(p=>p.filter(x=>x._id!==id)); }
    catch { setPending(p=>p.filter(x=>x._id!==id)); }
    finally { setActioning(null); }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10">
        <div className="flex items-center gap-5 mb-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Government Dashboard</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Ministry of Electronics and Information Technology</p>
          </div>
          <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Data</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {[
            { label: 'Total Challenges', value: analytics?.challenges?.total ?? '—', icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Pending Verification', value: analytics?.challenges?.open ?? pending.length ?? '—', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Active Collaborations', value: analytics?.activeCollaborations ?? '—', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
            { label: 'Awaiting Evaluation', value: analytics?.solutions?.pilot ?? '—', icon: Eye, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
            { label: 'Active Pilots', value: analytics?.solutions?.pilot ?? '—', icon: Rocket, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
            { label: 'Implemented', value: analytics?.challenges?.implemented ?? '—', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'People Impacted', value: formatNumber(analytics?.totalPeopleImpacted ?? 0) || '—', icon: BarChart3, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 text-center">
                <Icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <div className="text-xl font-bold text-gray-900 dark:text-white text-center">{s.value}</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 text-center leading-tight">{s.label}</div>
              </div>
            );
          })}
        </div>

        <Tabs defaultValue="verify" className="space-y-6">
          <TabsList>
            <TabsTrigger value="verify">Pending Verification</TabsTrigger>
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="evaluate">Awaiting Evaluation</TabsTrigger>
            <TabsTrigger value="implement">Implementation Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Challenges Awaiting Verification {pending.length>0 && <span className="text-sm font-normal text-slate-500">· {pending.length} live</span>}</h2>
              <Link href="/challenges/submit"><Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"><Plus className="h-4 w-4 mr-1" /> Create Official Challenge</Button></Link>
            </div>
            {pending.length===0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-8 text-center text-sm text-slate-500">No pending verifications — all caught up. New citizen submissions will appear here live.</div>
            ) : pending.map(ch => (
              <div key={ch._id} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 sm:p-6 hover:shadow-md dark:hover:border-white/15 transition-all duration-300 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-xs font-medium mb-3">Pending Verification</Badge>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight break-words">{ch.title || 'Untitled Challenge'}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1">{ch.category ? <>{getCategoryIcon(ch.category)} {ch.category} •</> : null} {ch.city || 'Unknown'}, {ch.state || 'India'} • {formatNumber(ch.affected || 0)} affected</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 truncate">Submitted by {ch.submittedBy || 'Citizen'}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                    <Button size="sm" variant="default" disabled={actioning===ch._id} onClick={()=>handleVerify(ch._id)} className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white dark:text-white rounded-xl min-w-0 sm:min-w-[92px] justify-center shadow-sm hover:shadow-md hover:-translate-y-[1px]">{actioning===ch._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1" /> Verify</>}</Button>
                    <Button size="sm" variant="outline" disabled={actioning===ch._id} onClick={()=>handleReject(ch._id)} className="flex-1 sm:flex-none text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl min-w-0 sm:min-w-[92px] justify-center">{actioning===ch._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><AlertTriangle className="h-4 w-4 mr-1" /> Reject</>}</Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Active Projects & Collaborations</h2>
            {[
              { challenge: 'Smart Waste Collection', university: 'IIT Bombay', industry: 'GreenTech Innovations', status: 'in-progress', progress: 45 },
              { challenge: 'Traffic Congestion Prediction', university: 'IIT Bombay', industry: 'TechCorp Solutions', status: 'pilot', progress: 70 },
              { challenge: 'Rural Water Quality Monitoring', university: 'VIT Chennai', industry: null, status: 'in-progress', progress: 30 },
            ].map(p => (
              <div key={p.challenge} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 flex items-center justify-between hover:shadow-md dark:hover:border-white/15 transition-all duration-300">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{p.challenge}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{p.university}{p.industry ? ` + ${p.industry}` : ''}</p>
                  <Badge className={`${getStatusColor(p.status)} capitalize text-xs mt-2 font-medium`}>{p.status}</Badge>
                </div>
                <div className="w-32">
                  <div className="text-right text-sm font-bold mb-1.5 text-gray-800 dark:text-white">{p.progress}%</div>
                  <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-2 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="evaluate" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Solutions Awaiting Government Evaluation</h2>
            {[
              { title: 'SmartBin: IoT-Enabled Waste Collection', challenge: 'Smart Waste Collection', team: 'EcoTech Solutions', submitted: '2024-03-15', score: 7.85 },
              { title: 'AquaSense: Rural Water Quality Monitor', challenge: 'Rural Water Quality', team: 'WaterGuard India', submitted: '2024-03-20', score: null },
            ].map(s => (
              <div key={s.title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 flex items-center justify-between hover:shadow-md dark:hover:border-white/15 transition-all duration-300">
                <div>
                  <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-xs font-medium mb-3">Under Review</Badge>
                  <h3 className="font-bold text-gray-800 dark:text-white">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{s.challenge} • Team: {s.team}</p>
                </div>
                <div className="flex items-center gap-3">
                  {s.score && <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{s.score}/10</div>}
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">Evaluate</Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="implement">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Implementation Pipeline</h2>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-7">
              <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
                {['Submitted', 'Verified', 'Open', 'Team Formed', 'Solution', 'Prototype', 'Pilot', 'Approved', 'Implemented', 'Measured'].map((stage, i) => {
                  const colors = ['bg-gray-100 dark:bg-white/5', 'bg-blue-50 dark:bg-blue-500/10', 'bg-green-50 dark:bg-green-500/10', 'bg-violet-50 dark:bg-violet-500/10', 'bg-indigo-50 dark:bg-indigo-500/10', 'bg-amber-50 dark:bg-amber-500/10', 'bg-orange-50 dark:bg-orange-500/10', 'bg-cyan-50 dark:bg-cyan-500/10', 'bg-emerald-50 dark:bg-emerald-500/10', 'bg-teal-50 dark:bg-teal-500/10'];
                  const textColors = ['text-gray-600 dark:text-slate-400', 'text-blue-600 dark:text-blue-400', 'text-green-600 dark:text-green-400', 'text-violet-600 dark:text-violet-400', 'text-indigo-600 dark:text-indigo-400', 'text-amber-600 dark:text-amber-400', 'text-orange-600 dark:text-orange-400', 'text-cyan-600 dark:text-cyan-400', 'text-emerald-600 dark:text-emerald-400', 'text-teal-600 dark:text-teal-400'];
                  const counts = [8, 12, 45, 23, 15, 8, 12, 6, 6, 4];
                  return (
                    <div key={stage} className="flex flex-col items-center min-w-[80px]">
                      <div className={`h-12 w-12 rounded-2xl ${colors[i]} flex items-center justify-center mb-2.5 text-sm font-bold ${textColors[i]} shadow-sm`}>
                        {counts[i]}
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400 text-center leading-tight font-medium">{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
