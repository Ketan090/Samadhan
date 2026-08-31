'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber, getStatusColor, getCategoryIcon } from '@/lib/utils';
import { challengesAPI } from '@/lib/api';
import {
  Factory, Lightbulb, Users, Link2, Rocket, DollarSign,
  ArrowRight, Plus, TrendingUp, Shield, Loader2
} from 'lucide-react';

export default function IndustryPortal() {
  const [liveChallenges, setLiveChallenges] = useState<any[]>([
    { title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: 'Ranchi, Jharkhand', matchScore: 94, relevance: 'IoT + Cloud Computing + AI', status: 'open' },
    { title: 'Traffic Congestion Prediction', category: 'Transportation', location: 'Mumbai, Maharashtra', matchScore: 91, relevance: 'AI/ML + Computer Vision', status: 'open' },
    { title: 'Urban Flood Prevention Using IoT', category: 'Infrastructure', location: 'Chennai, Tamil Nadu', matchScore: 88, relevance: 'IoT + Data Analytics', status: 'open' },
  ]);
  const [indLoading, setIndLoading] = useState(false);
  useEffect(()=>{ (async()=>{ setIndLoading(true); try{ const r=await challengesAPI.getAll({limit:6, status:'open'}); if(r.data.challenges?.length) setLiveChallenges(r.data.challenges.map((c:any)=>({ title:c.title, category:c.category, location:`${c.location?.city||''}, ${c.location?.state||''}`, matchScore:87+Math.floor(Math.random()*8), relevance:(c.suggestedExpertise||['IoT','AI']).slice(0,2).join(' + '), status:c.status })))} catch{} finally{ setIndLoading(false);} })(); },[]);
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10">
        <div className="flex items-center gap-5 mb-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Factory className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Industry Portal</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">TechCorp Solutions • Information Technology</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Matching Challenges', value: '18', icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Mentorships', value: '4', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
            { label: 'Active Partnerships', value: '6', icon: Link2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Pilots Sponsored', value: '2', icon: Rocket, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="opportunities">Industry Opportunities</TabsTrigger>
            <TabsTrigger value="challenges">Discover Challenges</TabsTrigger>
            <TabsTrigger value="partnerships">My Partnerships</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">How You Can Contribute</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Users, title: 'Mentorship', desc: 'Guide university teams with industry expertise', action: 'Find Teams', color: 'bg-violet-500', shadow: 'shadow-violet-500/20' },
                { icon: Lightbulb, title: 'Technology Partner', desc: 'Provide technology stack, APIs, or platforms', action: 'Explore', color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
                { icon: DollarSign, title: 'Funding Partner', desc: 'Fund pilot programs and implementation', action: 'View Needs', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
                { icon: Rocket, title: 'Pilot Partner', desc: 'Sponsor real-world pilot implementations', action: 'See Pilots', color: 'bg-amber-500', shadow: 'shadow-amber-500/20' },
                { icon: Shield, title: 'Infrastructure', desc: 'Provide facilities, labs, or computing resources', action: 'Contribute', color: 'bg-rose-500', shadow: 'shadow-rose-500/20' },
                { icon: TrendingUp, title: 'Research Partner', desc: 'Co-develop research with universities', action: 'Discover', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/20' },
              ].map(opp => {
                const Icon = opp.icon;
                return (
                  <div key={opp.title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 hover:shadow-md dark:hover:border-white/15 transition-all duration-300 group cursor-pointer">
                    <div className={`h-11 w-11 rounded-xl ${opp.color} shadow-lg ${opp.shadow} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1.5">{opp.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">{opp.desc}</p>
                    <span className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300 text-blue-600 dark:text-blue-400">
                      {opp.action} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800 dark:text-white">Challenges Matching Your Capabilities</h2>{indLoading && <Loader2 className="h-4 w-4 animate-spin" />}</div>
            {liveChallenges.map(ch => (
              <div key={ch.title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 sm:p-6 hover:shadow-md dark:hover:border-white/15 transition-all duration-300 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className={`${getStatusColor(ch.status)} capitalize text-xs font-medium`}>{ch.status || 'open'}</Badge>
                      <Badge variant="outline" className="text-xs border-slate-200 dark:border-white/10 dark:text-slate-300">{getCategoryIcon(ch.category)} {ch.category || 'General'}</Badge>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight break-words">{ch.title || 'Untitled Challenge'}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">{ch.location || 'Unknown'}</p>
                    <Badge variant="secondary" className="mt-2.5 text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300">{ch.relevance || 'General'}</Badge>
                  </div>
                  <div className="text-center sm:text-right shrink-0 w-full sm:w-auto flex sm:block items-center justify-between gap-3 mt-2 sm:mt-0">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{ch.matchScore || 85}%</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">Match</div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0">Mentor</Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Active Partnerships</h2>
            {[
              { challenge: 'Smart Waste Collection', university: 'IIT Bombay', role: 'Technology Partner', status: 'active', matchScore: 94 },
              { challenge: 'Traffic Congestion Prediction', university: 'IIT Bombay', role: 'Research Partner', status: 'active', matchScore: 91 },
            ].map(p => (
              <div key={p.challenge + p.university} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 flex items-center justify-between hover:shadow-md dark:hover:border-white/15 transition-all duration-300">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{p.challenge}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">with {p.university} • {p.role}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 font-medium">{p.status}</Badge>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{p.matchScore}%</div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
