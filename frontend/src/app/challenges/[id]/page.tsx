'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { challengesAPI, solutionsAPI } from '@/lib/api';
import { formatNumber, formatDate, getStatusColor, getSeverityColor, getCategoryIcon } from '@/lib/utils';
import { MapPin, Users, Calendar, AlertTriangle, Lightbulb, Brain, Target, ArrowRight, Building2, CheckCircle2, Clock, Shield, Rocket, FileText, TrendingUp, Zap, ChevronRight, ExternalLink, Layers, GraduationCap, Factory } from 'lucide-react';

export default function ChallengeDetailPage() {
  const params = useParams();
  const [challenge, setChallenge] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [params.id]);

  const loadData = async () => {
    try {
      const [challengeRes, solutionsRes] = await Promise.all([challengesAPI.getById(params.id as string), solutionsAPI.getAll({ challenge: params.id as string })]);
      setChallenge(challengeRes.data.challenge); setSolutions(solutionsRes.data.solutions);
    } catch {
      setChallenge({
        _id: params.id, title: 'Smart Waste Collection for Urban Wards', description: 'Ranchi city generates approximately 450 tonnes of municipal solid waste daily, but the current collection efficiency is only about 40%. Many wards, especially in peripheral areas, have irregular waste pickup leading to unhygienic conditions, disease outbreaks, and environmental degradation. We need an intelligent waste management system that can optimize collection routes, predict waste generation patterns, and enable real-time tracking of waste collection vehicles.\n\nThis challenge requires a multi-faceted approach combining IoT sensors, AI-powered route optimization, mobile applications for citizens and workers, and a dashboard for administrators. The solution should be scalable, affordable, and adaptable to Indian urban conditions.',
        category: 'Environment', subcategory: 'Waste Management', location: { city: 'Ranchi', state: 'Jharkhand', pincode: '834001' },
        affectedPopulation: 25000, urgency: 'high', severity: 'high', status: 'open', verificationStatus: 'verified',
        currentConsequences: 'Open dumping, water contamination, air pollution from burning waste, spread of vector-borne diseases, unpleasant living conditions for residents in multiple wards. The waste accumulation has led to a 15% increase in dengue and malaria cases in affected wards.',
        existingAttempts: 'Basic door-to-door collection exists but is irregular. Waste segregation at source is minimal. No real-time tracking of collection vehicles. Previous attempts at setting up community composting centers failed due to lack of monitoring.',
        desiredOutcome: 'An integrated smart waste management system with IoT-enabled bins, optimized collection routes, real-time tracking, and a mobile app for citizen reporting.',
        constraints: 'Budget constraints in municipal corporation. Limited technical expertise among waste workers. Diverse waste types from different areas. Power supply issues in some peripheral wards.',
        availableResources: 'Existing waste collection fleet of 25 vehicles. Municipal land for waste processing. Some budget allocation under Swachh Bharat Mission.',
        suggestedExpertise: ['IoT', 'AI', 'Data Science', 'Operations Research', 'Environmental Engineering'],
        submittedBy: { name: 'Rahul Singh', role: 'citizen' }, verifiedBy: { name: 'Rajesh Kumar', role: 'government' }, verifiedAt: '2024-01-15',
        aiAnalysis: { summary: 'A critical urban waste management challenge affecting 25,000+ residents in Ranchi. Current collection efficiency is only 40% with no route optimization or real-time monitoring.', classification: 'Environment → Waste Management → Urban Waste Collection', impactScore: 78, urgencyScore: 82, requiredExpertise: ['IoT', 'Data Science', 'Environmental Engineering', 'Operations Research'] },
        numberOfTeams: 3, numberOfSolutions: 2, participatingOrganizations: [{ name: 'IIT Bombay', type: 'university' }, { name: 'GreenTech Innovations', type: 'industry' }],
        evidence: { links: ['https://swachhbharat.gov.in'] }, createdAt: '2024-01-10'
      });
      setSolutions([
        { _id: 's1', title: 'SmartBin: IoT-Enabled Waste Collection Optimization System', status: 'under-review', scorecard: { totalScore: 7.85 }, proposedApproach: 'IoT sensors + AI route optimization', technology: ['IoT Sensors', 'Machine Learning', 'Mobile App', 'Cloud Platform'] },
        { _id: 's2', title: 'GreenRoute: AI-Powered Collection Fleet Management', status: 'submitted', scorecard: null, proposedApproach: 'Fleet management with predictive analytics', technology: ['GPS Tracking', 'Predictive Analytics', 'Mobile App'] }
      ]);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#070A12]"><div className="container py-8 animate-pulse space-y-4"><div className="h-6 bg-slate-100 dark:bg-white/10 rounded w-1/3" /><div className="h-4 bg-slate-100 dark:bg-white/10 rounded w-1/4" /><div className="grid lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-64 bg-slate-100 dark:bg-white/10 rounded-2xl" /><div className="h-64 bg-slate-100 dark:bg-white/10 rounded-2xl" /></div></div></div>;
  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="container py-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Link href="/challenges" className="hover:text-slate-900 dark:hover:text-white font-medium">Challenges</Link><ChevronRight className="h-3 w-3" /><span className="text-slate-900 dark:text-white font-medium truncate">{challenge.title}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={`${getStatusColor(challenge.status)} capitalize rounded-full`}>{challenge.status}</Badge>
            <Badge className={`${getSeverityColor(challenge.severity)} capitalize rounded-full border-0`}>{challenge.severity}</Badge>
            {challenge.verificationStatus === 'verified' && <Badge className="bg-emerald-500 text-white rounded-full gap-1 border-0"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>}
            <Badge variant="outline" className="rounded-full border-slate-200 dark:border-white/10 dark:text-slate-300">{getCategoryIcon(challenge.category)} {challenge.category}{challenge.subcategory ? ` · ${challenge.subcategory}` : ''}</Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight">{challenge.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{challenge.location?.city}, {challenge.location?.state}{challenge.location?.pincode ? ` · ${challenge.location.pincode}` : ''}</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(challenge.createdAt)}</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{formatNumber(challenge.affectedPopulation)} affected</span>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-3"><div className="h-8 w-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 grid place-items-center"><Lightbulb className="h-4 w-4" /></div><h2 className="font-semibold">Problem Description</h2></div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">{challenge.description}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 lg:p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-emerald-500" /> Impact & Path Forward</h2>
              <div className="space-y-4">
                {challenge.currentConsequences && <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4"><div className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mb-1"><AlertTriangle className="h-3.5 w-3.5" /> Current Consequences</div><p className="text-sm text-slate-600 dark:text-slate-400">{challenge.currentConsequences}</p></div>}
                {challenge.existingAttempts && <div><div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1"><FileText className="h-3.5 w-3.5 text-blue-500" /> Existing Attempts</div><p className="text-sm text-slate-600 dark:text-slate-400">{challenge.existingAttempts}</p></div>}
                <div><div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1"><Rocket className="h-3.5 w-3.5 text-emerald-500" /> Desired Outcome</div><p className="text-sm text-slate-600 dark:text-slate-400">{challenge.desiredOutcome}</p></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {challenge.constraints && <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5"><div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Shield className="h-4 w-4 text-slate-400" /> Constraints</div><p className="text-sm text-slate-600 dark:text-slate-400">{challenge.constraints}</p></div>}
              {challenge.availableResources && <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5"><div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Available Resources</div><p className="text-sm text-slate-600 dark:text-slate-400">{challenge.availableResources}</p></div>}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
                <h2 className="font-semibold flex items-center gap-2"><Rocket className="h-4 w-4" /> Solutions <span className="text-slate-400 font-normal">· {solutions.length}</span></h2>
                <Link href={`/solutions/submit?challenge=${challenge._id}`}><Button size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">Submit Solution</Button></Link>
              </div>
              <div className="p-4">
                {solutions.length === 0 ? <div className="text-center py-8"><div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 grid place-items-center mx-auto"><Lightbulb className="h-5 w-5 text-slate-400" /></div><p className="text-sm text-slate-500 mt-3">No solutions yet. Be the first!</p></div> : (
                  <div className="space-y-3">
                    {solutions.map(sol => (
                      <Link key={sol._id} href={`/solutions/${sol._id}`} className="block rounded-2xl border border-slate-200 dark:border-white/10 p-4 hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-50/50 dark:hover:bg-white/[0.03] transition-colors group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1"><div className="font-semibold text-sm leading-snug group-hover:text-blue-600 transition-colors">{sol.title}</div><div className="text-xs text-slate-500 mt-1">{sol.proposedApproach}</div><div className="flex flex-wrap gap-1.5 mt-2">{(sol.technology||[]).slice(0,3).map((t:string)=><Badge key={t} variant="secondary" className="text-[11px] rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-transparent">{t}</Badge>)}</div></div>
                          <div className="text-right shrink-0"><Badge className={`${getStatusColor(sol.status)} capitalize text-[11px] rounded-full`}>{sol.status}</Badge>{sol.scorecard && <div className="mt-1 text-sm font-bold text-blue-600">{sol.scorecard.totalScore}/10</div>}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Key Metrics</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-2"><Users className="h-4 w-4" /> Affected</span><span className="font-bold">{formatNumber(challenge.affectedPopulation)}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1.5"><Zap className="h-4 w-4" /> Urgency</span><Badge variant="outline" className="capitalize rounded-full border-slate-200 dark:border-white/10 dark:text-slate-300">{challenge.urgency}</Badge></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-2"><Rocket className="h-4 w-4" /> Teams</span><span className="font-bold">{challenge.numberOfTeams||0}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Solutions</span><span className="font-bold">{challenge.numberOfSolutions||0}</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Required Expertise</div>
              <div className="flex flex-wrap gap-1.5">{(challenge.suggestedExpertise||[]).map((e:string)=><Badge key={e} variant="secondary" className="rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-transparent">{e}</Badge>)}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Participating</div>
              {(challenge.participatingOrganizations||[]).length===0 ? <p className="text-sm text-slate-500">No organizations yet</p> : <div className="space-y-2">{challenge.participatingOrganizations.map((org:any,i:number)=><div key={i} className="flex items-center gap-2 text-sm"><div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-white/10 grid place-items-center"><Building2 className="h-3.5 w-3.5" /></div>{typeof org==='object'?org.name:org}</div>)}</div>}
            </div>

            {challenge.aiAnalysis && (
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-5">
                <div className="text-sm font-bold flex items-center gap-2 mb-1"><Brain className="h-4 w-4 text-blue-600" /> AI Analysis <Badge className="bg-blue-600 text-white text-[10px] rounded-full border-0">AI</Badge></div>
                <p className="text-xs text-blue-700/70 dark:text-blue-300/70 italic mb-3">AI-assisted — requires human verification</p>
                <div className="space-y-3">
                  <div><div className="text-xs font-medium text-slate-600 dark:text-slate-400">Classification</div><div className="text-sm font-medium">{challenge.aiAnalysis.classification}</div></div>
                  <div><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Impact Score</span><span className="font-bold">{challenge.aiAnalysis.impactScore}/100</span></div><div className="h-1.5 bg-blue-100 dark:bg-white/10 rounded-full"><div className="h-1.5 bg-blue-600 rounded-full" style={{width:`${challenge.aiAnalysis.impactScore}%`}} /></div></div>
                  <div><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Urgency Score</span><span className="font-bold">{challenge.aiAnalysis.urgencyScore}/100</span></div><div className="h-1.5 bg-orange-100 dark:bg-white/10 rounded-full"><div className="h-1.5 bg-orange-500 rounded-full" style={{width:`${challenge.aiAnalysis.urgencyScore}%`}} /></div></div>
                  <div className="flex flex-wrap gap-1">{(challenge.aiAnalysis.requiredExpertise||[]).map((e:string)=><Badge key={e} variant="outline" className="text-xs rounded-full bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 dark:text-slate-300">{e}</Badge>)}</div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 space-y-2">
              <Link href={`/solutions/submit?challenge=${challenge._id}`} className="block"><Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900"><Lightbulb className="h-4 w-4 mr-2" /> Submit Solution</Button></Link>
              <Link href="/collaborate" className="block"><Button variant="outline" className="w-full rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><Users className="h-4 w-4 mr-2" /> Collaborate</Button></Link>
              {challenge.evidence?.links?.length>0 && <a href={challenge.evidence.links[0]} target="_blank" className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 py-2"><ExternalLink className="h-3 w-3" /> View evidence</a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
