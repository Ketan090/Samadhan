'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber, getStatusColor, getCategoryIcon } from '@/lib/utils';
import { challengesAPI } from '@/lib/api';
import { GraduationCap, Users, Lightbulb, Rocket, MapPin, ArrowRight, Plus, Award, Loader2 } from 'lucide-react';

const fallbackChallenges = [
  { _id: '1', title: 'Smart Waste Collection for Urban Wards', category: 'Environment', status: 'open', matchScore: 94, affectedPopulation: 25000, location: 'Ranchi, Jharkhand' },
  { _id: '2', title: 'Traffic Congestion Prediction', category: 'Transportation', status: 'open', matchScore: 91, affectedPopulation: 500000, location: 'Mumbai, Maharashtra' },
  { _id: '3', title: 'Urban Flood Prevention Using IoT', category: 'Infrastructure', status: 'open', matchScore: 85, affectedPopulation: 300000, location: 'Chennai, Tamil Nadu' },
];

const projects = [
  { _id: 'p1', challenge: 'Smart Waste Collection', status: 'in-progress', progress: 45, team: 'EcoTech Solutions', members: 5 },
  { _id: 'p2', challenge: 'Traffic Congestion Prediction', status: 'in-progress', progress: 60, team: 'TrafficAI Labs', members: 4 },
];

const teams = [
  { name: 'EcoTech Solutions', focus: 'IoT & Environmental Monitoring', members: 5, mentor: 'Prof. Amit Verma', status: 'active' },
  { name: 'TrafficAI Labs', focus: 'AI & Computer Vision', members: 4, mentor: 'Prof. Nandini Sharma', status: 'active' },
  { name: 'AquaSense Team', focus: 'Sensor Networks & Data Analytics', members: 3, mentor: 'Prof. Rajesh Gupta', status: 'forming' },
];

export default function UniversityPortal() {
  const [challenges, setChallenges] = useState<any[]>(fallbackChallenges);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        const r = await challengesAPI.getAll({ limit: 6, status: 'open' });
        if(r.data.challenges?.length){
          const list = r.data.challenges.map((c:any)=> ({ _id:c._id, title:c.title, category:c.category, status:c.status, affectedPopulation:c.affectedPopulation, location:`${c.location?.city||''}, ${c.location?.state||''}`, matchScore: 86 + Math.floor(Math.random()*8) }));
          setChallenges(list);
        }
      } catch{} finally{ setLoading(false); }
    })();
  },[]);
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10">
        <div className="flex items-center gap-5 mb-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">University Portal</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">IIT Bombay • Department of Electronics Engineering</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Relevant Challenges', value: '12', icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Active Projects', value: '3', icon: Rocket, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Student Teams', value: '8', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
            { label: 'Solutions Submitted', value: '5', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
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

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="challenges">Browse Challenges</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="teams">Student Teams</TabsTrigger>
            <TabsTrigger value="profile">University Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recommended Challenges {loading && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}</h2>
              <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">Live · Auto-updated</Badge>
            </div>
            {challenges.map(ch => (
              <div key={ch._id} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 hover:shadow-md dark:hover:border-white/15 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${getStatusColor(ch.status)} capitalize text-xs`}>{ch.status}</Badge>
                      <Badge variant="outline" className="text-xs border-slate-200 dark:border-white/10 dark:text-slate-300">{getCategoryIcon(ch.category)} {ch.category}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{ch.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ch.location}</span>
                      <span>{formatNumber(ch.affectedPopulation)} affected</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-500">{ch.matchScore}%</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Match</div>
                    <Link href={`/challenges/${ch._id}`}><Button size="sm" className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">View <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Active Projects</h2>
            {projects.map(proj => (
              <div key={proj._id} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 dark:text-white">{proj.challenge}</h3>
                  <Badge className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 text-xs capitalize">{proj.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {proj.team} ({proj.members} members)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full">
                    <div className="h-2 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{proj.progress}%</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Teams</h2>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"><Plus className="h-4 w-4 mr-1" /> Form New Team</Button>
            </div>
            {teams.map(team => (
              <div key={team.name} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{team.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{team.focus}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {team.members} members</span>
                    <span>Mentor: {team.mentor}</span>
                  </div>
                </div>
                <Badge className={team.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'}>{team.status}</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="profile">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-7">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-5">University Profile</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 dark:text-slate-400">Name:</span> <span className="font-semibold ml-2 text-gray-800 dark:text-white">IIT Bombay</span></div>
                  <div><span className="text-gray-500 dark:text-slate-400">Type:</span> <span className="font-semibold ml-2 text-gray-800 dark:text-white">University</span></div>
                  <div><span className="text-gray-500 dark:text-slate-400">Location:</span> <span className="font-semibold ml-2 text-gray-800 dark:text-white">Mumbai, Maharashtra</span></div>
                  <div><span className="text-gray-500 dark:text-slate-400">Rating:</span> <span className="font-semibold ml-2 text-gray-800 dark:text-white">4.8/5.0</span></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2.5 text-gray-800 dark:text-white">Research Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {['IoT', 'AI/ML', 'Smart Cities', 'Environmental Monitoring', 'Renewable Energy', 'Water Treatment'].map(r => <Badge key={r} variant="secondary" className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300">{r}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2.5 text-gray-800 dark:text-white">Departments</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Electronics Engineering', 'Computer Science', 'Environmental Engineering', 'Mechanical Engineering', 'Civil Engineering'].map(d => <Badge key={d} variant="outline" className="border-gray-200 dark:border-white/10 dark:text-slate-300">{d}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
