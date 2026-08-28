'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsAPI, challengesAPI } from '@/lib/api';
import { formatNumber, getCategoryIcon, getStatusColor } from '@/lib/utils';
import { ArrowRight, Lightbulb, Users, Target, MapPin, CheckCircle2, Globe, Brain, Rocket, Sparkles, GraduationCap, Factory, Landmark, Heart, Zap, TrendingUp, Layers, Cpu, Leaf } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [recentChallenges, setRecentChallenges] = useState<any[]>([]);
  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [overviewRes, challengesRes] = await Promise.all([analyticsAPI.getOverview(), challengesAPI.getAll({ limit: 4, status: 'open' })]);
      setStats(overviewRes.data.overview); setRecentChallenges(challengesRes.data.challenges);
    } catch {
      setStats({ challenges: { total: 156, verified: 89, open: 45 }, solutions: { total: 87, pilot: 12 }, organizations: { total: 120 }, users: 2847, activeCollaborations: 67, totalPeopleImpacted: 425000 });
      setRecentChallenges([
        { _id: '1', title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand' }, severity: 'high', affectedPopulation: 25000, status: 'open', suggestedExpertise: ['IoT', 'AI', 'Data Science'], numberOfTeams: 3 },
        { _id: '2', title: 'Rural Water Quality Monitoring System', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar' }, severity: 'critical', affectedPopulation: 150000, status: 'open', suggestedExpertise: ['IoT', 'Environmental Engineering'], numberOfTeams: 2 },
        { _id: '3', title: 'Traffic Congestion Prediction in Smart Cities', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra' }, severity: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['AI/ML', 'Computer Vision', 'Data Science'], numberOfTeams: 4 },
        { _id: '4', title: 'Telemedicine for Remote Healthcare Access', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana' }, severity: 'critical', affectedPopulation: 75000, status: 'open', suggestedExpertise: ['Healthcare', 'Mobile Development', 'AI/ML'], numberOfTeams: 2 },
      ]);
    }
  };

  const liveStats = stats ? [
    { label: 'Challenges', value: stats.challenges?.total ?? 156, icon: Lightbulb, tint: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' },
    { label: 'Verified', value: stats.challenges?.verified ?? 89, icon: CheckCircle2, tint: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' },
    { label: 'Collaborations', value: stats.activeCollaborations ?? 67, icon: Users, tint: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600' },
    { label: 'Solutions', value: stats.solutions?.total ?? 87, icon: Target, tint: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' },
    { label: 'Pilots Live', value: stats.solutions?.pilot ?? 12, icon: Rocket, tint: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600' },
    { label: 'Lives Impacted', value: stats.totalPeopleImpacted ?? 425000, icon: Heart, tint: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600' },
  ] : [];

  const categories = [
    { icon: Leaf, label: 'Environment', count: 34, desc: 'Climate, waste, air' },
    { icon: Heart, label: 'Healthcare', count: 28, desc: 'Access & diagnostics' },
    { icon: GraduationCap, label: 'Education', count: 22, desc: 'Digital learning' },
    { icon: Globe, label: 'Transportation', count: 19, desc: 'Mobility & traffic' },
    { icon: Layers, label: 'Agriculture', count: 16, desc: 'Farm to market' },
    { icon: Landmark, label: 'Infrastructure', count: 14, desc: 'Urban resilience' },
    { icon: Users, label: 'Social Welfare', count: 12, desc: 'Inclusion' },
    { icon: Cpu, label: 'Technology', count: 11, desc: 'AI & IoT' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-white dark:bg-[#070A12]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#070A12]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-amber-500/10 blur-3xl rounded-full" />
        <div className="container relative py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1 text-xs font-medium shadow-sm mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Collaborative Innovation Platform
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 text-[10px] font-bold">NEW</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[0.95] text-slate-900 dark:text-white">
                Real Problems.<br />
                <span className="bg-gradient-to-r from-slate-900 via-blue-600 to-violet-600 dark:from-white dark:via-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Collective Intelligence.</span><br />
                Measurable Impact.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl">
                SamadhanHub connects communities, universities and industry to turn India&apos;s toughest societal challenges into shipped, fundable solutions.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/challenges/submit"><Button size="lg" className="rounded-full px-7 h-11 text-[15px] bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">Submit a Challenge <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                <Link href="/challenges"><Button size="lg" variant="outline" className="rounded-full px-7 h-11 text-[15px] bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">Explore Challenges</Button></Link>
                <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> 2-min submission · AI matched in hours</span>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i=> <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-[#070A12] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-[10px] font-bold">{String.fromCharCode(64+i)}</div>)}
                  <div className="h-7 w-7 rounded-full border-2 border-white dark:border-[#070A12] bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">+2k</div>
                </div>
                <span className="text-slate-500">Trusted by 45 universities · 38 industry partners</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto w-[420px]">
                <div className="rounded-[28px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] shadow-2xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
                    <span className="text-xs font-medium text-slate-500">samadhanhub.in · Live</span>
                    <span className="h-6 w-6 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 grid place-items-center"><Globe className="h-3 w-3" /></span>
                  </div>
                  <div className="p-5 space-y-4">
                    {recentChallenges.slice(0,3).map((c,i)=> (
                      <div key={c._id} className="rounded-2xl border border-slate-100 dark:border-white/10 p-3 flex gap-3 hover:border-slate-200 dark:hover:border-white/15 transition-colors" style={{opacity: 1 - i*0.12}}>
                        <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 grid place-items-center text-sm shrink-0">{getCategoryIcon(c.category)}</div>
                        <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold leading-tight truncate">{c.title}</div><div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{c.location.city} · {formatNumber(c.affectedPopulation)} affected</div><div className="flex gap-1 mt-1.5">{c.suggestedExpertise.slice(0,2).map((e:string)=><span key={e} className="text-[10px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full border border-transparent dark:border-white/5">{e}</span>)}</div></div>
                        <Badge className={`${getStatusColor(c.status)} text-[10px] h-6`}>{c.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-white/10 pt-3"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> 3 matches found · AI ranked</span><span className="font-medium text-slate-900 dark:text-white flex items-center gap-1">Open map <ArrowRight className="h-3 w-3" /></span></div>
                </div>
                <div className="absolute -top-4 -right-2 rounded-2xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-xl p-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 grid place-items-center"><TrendingUp className="h-4 w-4 text-emerald-600" /></div><div><div className="text-sm font-bold leading-none">+42%</div><div className="text-[11px] text-slate-500">Efficiency gain</div></div>
                </div>
                <div className="absolute -bottom-3 -left-2 rounded-2xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-xl p-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 grid place-items-center"><MapPin className="h-4 w-4 text-blue-600" /></div><div><div className="text-sm font-bold leading-none">18 States</div><div className="text-[11px] text-slate-500">Pan-India coverage</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-6 relative z-10">
        <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] shadow-lg shadow-slate-200/20 p-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {liveStats.map(s=> {
              const Icon=s.icon;
              return <div key={s.label} className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 p-4 text-center hover:bg-white dark:hover:bg-white/[0.06] transition-colors">
                <div className={`h-8 w-8 rounded-xl mx-auto mb-2 grid place-items-center ${s.tint}`}><Icon className="h-4 w-4" /></div>
                <div className="text-xl font-bold tracking-tight">{formatNumber(s.value)}</div>
                <div className="text-[11px] font-medium text-slate-500">{s.label}</div>
              </div>
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div><div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 text-xs font-bold">Categories</div><h2 className="mt-3 text-2xl font-bold tracking-tight">Explore by domain</h2><p className="text-sm text-slate-500">Jump into challenges that match your expertise</p></div>
            <Link href="/challenges" className="hidden sm:inline-flex text-sm font-medium hover:gap-1.5 gap-1 items-center">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(c=>{
              const Icon=c.icon;
              return <Link key={c.label} href={`/challenges?category=${c.label}`} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/10 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 flex items-center justify-center transition-colors"><Icon className="h-5 w-5" /></div>
                <div className="mt-3 text-sm font-semibold leading-tight">{c.label}</div>
                <div className="text-xs text-slate-500">{c.desc}</div>
                <div className="mt-2 text-xs font-medium text-slate-900 dark:text-white">{c.count} challenges</div>
              </Link>
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50 dark:bg-white/[0.02] border-y border-slate-200/60 dark:border-white/5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10"><Badge variant="outline" className="rounded-full border-slate-200 dark:border-white/10 dark:text-slate-300">How it works</Badge><h2 className="mt-3 text-3xl font-bold tracking-tight">From problem to shipped pilot</h2><p className="mt-2 text-slate-500">A tight pipeline that turns field reports into fundable, measurable solutions.</p></div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="hidden lg:block absolute top-[34px] left-[14%] right-[14%] h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            {[
              { n:'01', icon: Lightbulb, title:'Discover', desc:'Anyone can submit a verified, geo-tagged challenge with evidence.', bg:'#2563eb' },
              { n:'02', icon: Brain, title:'Match', desc:'AI scores impact & pairs with best-fit labs and companies.', bg:'#7c3aed' },
              { n:'03', icon: Users, title:'Build together', desc:'Teams form, mentors join, milestones and sprints run in workspace.', bg:'linear-gradient(135deg,#10b981 0%,#16a34a 100%)' },
              { n:'04', icon: Target, title:'Pilot & measure', desc:'Government funds pilots; impact is tracked on dashboards.', bg:'#d97706' },
            ].map(s=>{
              const Icon=s.icon;
              return <div key={s.n} className="relative rounded-2xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="h-10 w-10 rounded-xl text-white grid place-items-center shadow-md" style={{background: s.bg}}><Icon className="h-5 w-5" /></div>
                <div className="mt-4 text-xs font-bold tracking-widest text-slate-400">{s.n}</div>
                <div className="text-lg font-bold tracking-tight">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="rounded-[28px] overflow-hidden border border-slate-200 dark:border-white/10 grid md:grid-cols-2">
            <div className="bg-slate-900 dark:bg-[#0F1420] text-white p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 bg-blue-500/20 blur-3xl rounded-full" />
              <Badge className="bg-white/10 text-white border-white/15">Interactive Map</Badge>
              <h3 className="mt-4 text-3xl font-bold tracking-tight">See India&apos;s challenges, live on a map</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60 max-w-md">Filter by category, severity and status. Spot clusters, discover nearby problems, and jump in.</p>
              <Link href="/challenges/map"><Button className="mt-6 rounded-full bg-white text-slate-900 hover:bg-white/90">Open Interactive Map <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <div className="mt-8 flex gap-6 text-xs text-white/60"><span><strong className="text-white text-lg">156</strong><br/>Active challenges</span><span><strong className="text-white text-lg">18</strong><br/>States covered</span><span><strong className="text-white text-lg">45</strong><br/>Solutions piloted</span></div>
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.04] p-8 lg:p-10 grid place-items-center">
              <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] overflow-hidden shadow-sm">
                <div className="h-48 bg-gradient-to-br from-blue-50 via-violet-50 to-amber-50 dark:from-blue-950/20 dark:via-violet-950/20 dark:to-amber-950/20 grid place-items-center relative">
                  <MapPin className="h-8 w-8 text-slate-400" />
                  <div className="absolute top-6 left-8 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow" />
                  <div className="absolute top-12 right-12 h-2.5 w-2.5 rounded-full bg-red-500 shadow" />
                  <div className="absolute bottom-8 left-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 shadow" />
                  <span className="absolute bottom-3 right-3 text-[10px] font-medium bg-white dark:bg-white/10 px-2 py-1 rounded-full border">India · Live data</span>
                </div>
                <div className="p-4 flex items-center justify-between"><span className="text-sm font-semibold">Challenge density</span><span className="text-xs text-slate-500">Tap to explore</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-8"><Badge variant="outline" className="rounded-full border-slate-200 dark:border-white/10 dark:text-slate-300">Portals</Badge><h2 className="mt-3 text-3xl font-bold tracking-tight">Built for every stakeholder</h2><p className="mt-2 text-slate-500">One platform, three powerful workspaces tailored to how you contribute.</p></div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { href:'/university', icon: GraduationCap, title:'University Portal', desc:'Find challenges, form teams, get mentored and ship research to pilots.', bg:'linear-gradient(135deg,#10b981 0%,#16a34a 100%)' },
              { href:'/industry', icon: Factory, title:'Industry Portal', desc:'Mentor teams, provide infra, fund pilots and scale what works.', bg:'linear-gradient(135deg,#2563eb 0%,#4f46e5 100%)' },
              { href:'/government', icon: Landmark, title:'Government Portal', desc:'Verify, approve, fund and track every solution to impact.', bg:'linear-gradient(135deg,#f97316 0%,#dc2626 100%)' },
            ].map(p=>{
              const Icon=p.icon;
              return <Link key={p.href} href={p.href} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="h-1" style={{background: p.bg}} />
                <div className="p-6">
                  <div className="h-11 w-11 rounded-xl text-white grid place-items-center shadow-md group-hover:scale-105 transition-transform" style={{background: p.bg}}><Icon className="h-5 w-5" /></div>
                  <div className="mt-4 text-lg font-bold">{p.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 line-clamp-2">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></span>
                </div>
              </Link>
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div><Badge variant="outline" className="rounded-full border-slate-200 dark:border-white/10 dark:text-slate-300">Latest</Badge><h2 className="mt-3 text-2xl font-bold tracking-tight">Active challenges</h2><p className="text-sm text-slate-500">Problems waiting for builders like you</p></div>
            <Link href="/challenges" className="hidden sm:inline-flex"><Button variant="outline" className="rounded-full border-slate-200 dark:border-white/10 dark:text-white bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10">View all <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recentChallenges.map(c=> (
              <Link key={c._id} href={`/challenges/${c._id}`} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 hover:border-slate-300 dark:hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between gap-2"><Badge className={getStatusColor(c.status) + ' capitalize text-[11px] border-transparent'}>{c.status}</Badge><Badge variant="outline" className="capitalize text-[11px] border-slate-200 dark:border-white/10 dark:text-slate-300">{c.severity}</Badge></div>
                <div className="mt-3 text-[16px] font-bold leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{c.title}</div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500"><span>{getCategoryIcon(c.category)} {c.category}</span><span className="opacity-30">·</span><MapPin className="h-3 w-3" />{c.location.city}, {c.location.state}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">{c.suggestedExpertise.slice(0,3).map((e:string)=><span key={e} className="text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-transparent dark:border-white/5">{e}</span>)}</div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(c.affectedPopulation)} affected</span><span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">View <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="rounded-[28px] bg-slate-900 dark:bg-[#0F1420] text-white dark:text-white p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 border border-transparent dark:border-white/10 shadow-lg dark:shadow-black/20">
            <div><h3 className="text-2xl font-bold tracking-tight">Ready to make a difference?</h3><p className="mt-1 text-sm text-white/60 dark:text-slate-400 max-w-xl">Submit a challenge in 2 minutes or join as a collaborator. Every submission is AI-matched and human-verified.</p></div>
            <div className="flex gap-3 shrink-0"><Link href="/challenges/submit"><Button className="rounded-full bg-white text-slate-900 hover:bg-white/90 dark:bg-white dark:text-slate-900 border border-transparent shadow-sm">Submit a Challenge <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/challenges"><Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white/10 bg-transparent">Browse</Button></Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
