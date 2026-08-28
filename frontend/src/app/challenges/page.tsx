'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { challengesAPI } from '@/lib/api';
import { formatNumber, getStatusColor, getSeverityColor, getCategoryIcon } from '@/lib/utils';
import { Search, MapPin, Users, ChevronLeft, ChevronRight, SlidersHorizontal, X, Plus, Layers } from 'lucide-react';

const categories = ['Environment','Healthcare','Education','Transportation','Agriculture','Infrastructure','Social Welfare','Technology'];
const severities = ['critical','high','medium','low'];
const statuses = ['submitted','verified','open','in-progress','solved','implemented'];
const states = ['Jharkhand','Bihar','Maharashtra','Tamil Nadu','Karnataka','Telangana','Delhi','West Bengal'];

const demoChallenges = [
  { _id: '1', title: 'Smart Waste Collection for Urban Wards', description: 'Ranchi city generates 450 tonnes of waste daily with only 40% collection efficiency.', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand' }, severity: 'high', affectedPopulation: 25000, status: 'open', suggestedExpertise: ['IoT','AI','Data Science'], numberOfTeams: 3, numberOfSolutions: 2 },
  { _id: '2', title: 'Rural Water Quality Monitoring System', description: '200+ villages rely on groundwater contaminated with arsenic and fluoride.', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar' }, severity: 'critical', affectedPopulation: 150000, status: 'open', suggestedExpertise: ['IoT','Environmental Engineering','Data Analytics'], numberOfTeams: 2, numberOfSolutions: 1 },
  { _id: '3', title: 'Traffic Congestion Prediction in Smart Cities', description: 'Mumbai peak-hour commutes take 200% longer due to congestion.', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra' }, severity: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['AI/ML','Computer Vision','Data Science'], numberOfTeams: 4, numberOfSolutions: 3 },
  { _id: '4', title: 'Telemedicine for Remote Healthcare Access', description: 'Remote Telangana villages are 15-30km from the nearest health centre.', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana' }, severity: 'critical', affectedPopulation: 75000, status: 'open', suggestedExpertise: ['Healthcare','Mobile Development','AI/ML'], numberOfTeams: 2, numberOfSolutions: 1 },
  { _id: '5', title: 'Urban Flood Prevention Using IoT and AI', description: 'Chennai monsoon floods cause massive damage without early warning.', category: 'Infrastructure', location: { city: 'Chennai', state: 'Tamil Nadu' }, severity: 'critical', affectedPopulation: 300000, status: 'open', suggestedExpertise: ['IoT','AI/ML','GIS'], numberOfTeams: 3, numberOfSolutions: 2 },
  { _id: '6', title: 'Digital Education Access for Underprivileged Students', description: 'Millions lack access to quality digital education resources.', category: 'Education', location: { city: 'Patna', state: 'Bihar' }, severity: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['EdTech','Mobile Development','AI/ML'], numberOfTeams: 5, numberOfSolutions: 4 },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', state: '', severity: '', status: '' });

  useEffect(() => { loadChallenges(); }, [filters, pagination.page]);
  const loadChallenges = async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.page, limit: 9 };
      if (filters.category) params.category = filters.category;
      if (filters.state) params.state = filters.state;
      if (filters.severity) params.severity = filters.severity;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const res = await challengesAPI.getAll(params);
      setChallenges(res.data.challenges); setPagination(res.data.pagination);
    } catch { setChallenges(demoChallenges); setPagination({ page: 1, pages: 1, total: 6 }); }
    setLoading(false);
  };

  const activeFilters = Object.entries(filters).filter(([k,v])=> k!=='search' && v).length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-500"><Layers className="h-3.5 w-3.5" /> Discover</div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Challenges</h1>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xl">Explore verified societal problems — filter by domain, severity and location, and team up to ship a solution.</p>
            </div>
            <Link href="/challenges/submit"><Button className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 h-10 px-6 shadow-sm"><Plus className="h-4 w-4 mr-1.5" /> Submit Challenge</Button></Link>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search challenges, expertise, location..." className="pl-11 h-11 bg-white dark:bg-[#0F1420] rounded-full border-slate-200 dark:border-white/10 shadow-sm" value={filters.search} onChange={e=>setFilters({...filters, search:e.target.value})} />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={()=>setShowFilters(!showFilters)} className="h-11 rounded-full px-5 gap-2 bg-white dark:bg-[#0F1420] border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">
                <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilters>0 && <span className="h-5 min-w-5 px-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs grid place-items-center">{activeFilters}</span>}
              </Button>
              <Link href="/challenges/map"><Button variant="outline" className="h-11 rounded-full px-5 bg-white dark:bg-[#0F1420] border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><MapPin className="h-4 w-4 mr-1.5" /> Map</Button></Link>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4 shadow-sm animate-scale-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <Select value={filters.category} onValueChange={v=>setFilters({...filters, category:v})}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{categories.map(c=> <SelectItem key={c} value={c}>{getCategoryIcon(c)} {c}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={filters.state} onValueChange={v=>setFilters({...filters, state:v})}>
                  <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>{states.map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={filters.severity} onValueChange={v=>setFilters({...filters, severity:v})}>
                  <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                  <SelectContent>{severities.map(s=> <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={v=>setFilters({...filters, status:v})}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>{statuses.map(s=> <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
                {activeFilters>0 ? (
                  <Button variant="ghost" onClick={()=>setFilters({search: filters.search, category:'', state:'', severity:'', status:''})} className="rounded-full"><X className="h-4 w-4 mr-1" /> Clear filters</Button>
                ) : <div className="hidden lg:block" />}
              </div>
              {(filters.category || filters.state || filters.severity || filters.status) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {filters.category && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">{filters.category} <button onClick={()=>setFilters({...filters, category:''})} className="ml-1"><X className="h-3 w-3" /></button></Badge>}
                  {filters.state && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">{filters.state} <button onClick={()=>setFilters({...filters, state:''})} className="ml-1"><X className="h-3 w-3" /></button></Badge>}
                  {filters.severity && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 capitalize">{filters.severity}</Badge>}
                  {filters.status && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 capitalize">{filters.status}</Badge>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500"><span className="font-semibold text-slate-900 dark:text-white">{challenges.length}</span> challenges · Page {pagination.page} of {pagination.pages || 1}</p>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live · Updated just now</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i=> <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-3 bg-white dark:bg-[#0F1420]"><div className="h-4 w-20 rounded-full bg-slate-100 dark:bg-white/10 animate-pulse" /><div className="h-5 w-3/4 rounded bg-slate-100 dark:bg-white/10 animate-pulse" /><div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-white/10 animate-pulse" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge, idx)=> (
              <Link key={challenge._id} href={`/challenges/${challenge._id}`} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge className={`${getStatusColor(challenge.status)} capitalize text-[11px] rounded-full`}>{challenge.status}</Badge>
                  <Badge className={`${getSeverityColor(challenge.severity)} capitalize text-[11px] rounded-full border-0`}>{challenge.severity}</Badge>
                </div>
                <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{challenge.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 line-clamp-2">{challenge.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span>{getCategoryIcon(challenge.category)}</span><span className="font-medium">{challenge.category}</span><span className="opacity-30">·</span><MapPin className="h-3 w-3" />{challenge.location?.city}, {challenge.location?.state}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(challenge.suggestedExpertise||[]).slice(0,3).map((e:string)=> <span key={e} className="text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-transparent dark:border-white/5">{e}</span>)}
                  {(challenge.suggestedExpertise||[]).length>3 && <span className="text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-transparent dark:border-white/5">+{(challenge.suggestedExpertise.length-3)}</span>}
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {formatNumber(challenge.affectedPopulation)} affected</span>
                  <span className="font-medium">{challenge.numberOfTeams||0} teams · {challenge.numberOfSolutions||0} solutions</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pagination.pages>1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" disabled={pagination.page<=1} onClick={()=>setPagination({...pagination, page: pagination.page-1})} className="rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm text-slate-500">Page <span className="font-semibold text-slate-900 dark:text-white">{pagination.page}</span> of {pagination.pages}</span>
            <Button variant="outline" size="sm" disabled={pagination.page>=pagination.pages} onClick={()=>setPagination({...pagination, page: pagination.page+1})} className="rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
