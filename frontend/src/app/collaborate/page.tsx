'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategoryIcon } from '@/lib/utils';
import {
  GraduationCap, Factory, Brain, ArrowRight, MapPin, Link2, Sparkles, Zap
} from 'lucide-react';

const matchResults = [
  {
    challenge: { title: 'Rural Water Quality Monitoring', category: 'Healthcare', location: 'Patna, Bihar', expertise: ['IoT', 'Sensors', 'Data Analytics'] },
    university: { name: 'VIT Chennai', matchScore: 94, reason: 'Strong environmental engineering expertise, research in water treatment, IoT sensor lab available', expertise: ['Environmental Engineering', 'Water Treatment', 'IoT Sensors'] },
    industry: { name: 'GreenTech Innovations', matchScore: 88, reason: 'Water treatment technology provider, IoT sensor manufacturing, field deployment experience', expertise: ['Water Treatment', 'IoT', 'Solar Power'] },
    overallScore: 91
  },
  {
    challenge: { title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: 'Ranchi, Jharkhand', expertise: ['IoT', 'AI', 'Data Science'] },
    university: { name: 'IIT Bombay', matchScore: 94, reason: 'Leading IoT research, smart city lab, environmental monitoring expertise', expertise: ['IoT', 'AI/ML', 'Environmental Monitoring'] },
    industry: { name: 'TechCorp Solutions', matchScore: 89, reason: 'Cloud infrastructure, AI/ML capabilities, previous smart city projects', expertise: ['Cloud Computing', 'AI/ML', 'Mobile Development'] },
    overallScore: 92
  },
  {
    challenge: { title: 'Traffic Congestion Prediction', category: 'Transportation', location: 'Mumbai, Maharashtra', expertise: ['AI/ML', 'Computer Vision', 'IoT'] },
    university: { name: 'IIT Delhi', matchScore: 91, reason: 'Transportation research lab, computer vision expertise, traffic modeling experience', expertise: ['Computer Vision', 'Urban Planning', 'AI/ML'] },
    industry: { name: 'TechCorp Solutions', matchScore: 87, reason: 'AI/ML platform, real-time processing capabilities, cloud infrastructure', expertise: ['AI/ML', 'Cloud Computing', 'Real-time Systems'] },
    overallScore: 89
  },
];

export default function CollaboratePage() {
  const [selectedChallenge, setSelectedChallenge] = useState('all');

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Connect</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Collaboration Match</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1.5">AI-powered matching of challenges with universities and industry partners</p>
        </div>

        <div className="mb-10 p-7 rounded-2xl bg-gradient-to-r from-blue-50/80 via-violet-50/60 to-emerald-50/80 dark:from-blue-500/10 dark:via-violet-500/10 dark:to-emerald-500/10 border border-blue-100/60 dark:border-white/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">How Collaboration Matching Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-sm">
            {[
              { step: '1', label: 'Analyze', desc: 'AI analyzes challenge requirements and expertise needs' },
              { step: '2', label: 'Match', desc: 'Compares with university research areas and industry capabilities' },
              { step: '3', label: 'Score', desc: 'Calculates compatibility based on expertise, location, and resources' },
              { step: '4', label: 'Recommend', desc: 'Suggests optimal team composition with role assignments' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-blue-500/20">{s.step}</div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-white">{s.label}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
            <SelectTrigger className="w-full md:w-96 h-12 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] dark:text-white shadow-sm">
              <SelectValue placeholder="Filter by challenge" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#0F1420] dark:border-white/10">
              <SelectItem value="all">All Challenges</SelectItem>
              {matchResults.map((m, i) => (
                <SelectItem key={i} value={m.challenge.title}>{m.challenge.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {matchResults.filter(m => selectedChallenge === 'all' || m.challenge.title === selectedChallenge).map((match, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 0.1}s` } as any}>
              <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
              <div className="p-7">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Badge variant="outline" className="text-[11px] mb-3 font-medium border-slate-200 dark:border-white/10 dark:text-slate-300">{getCategoryIcon(match.challenge.category)} {match.challenge.category}</Badge>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{match.challenge.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mt-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {match.challenge.location}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {match.challenge.expertise.map(e => <Badge key={e} variant="secondary" className="text-[10px] font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300">{e}</Badge>)}
                    </div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl px-6 py-4 shadow-xl shadow-blue-500/20">
                    <div className="text-3xl font-bold">{match.overallScore}%</div>
                    <div className="text-[10px] opacity-80 font-medium uppercase tracking-wider">Match</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 bg-gradient-to-br from-emerald-50/80 to-emerald-50/40 dark:from-emerald-500/10 dark:to-emerald-500/5 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-800 dark:text-white">University Partner</h4>
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-bold ml-auto">{match.university.matchScore}%</Badge>
                    </div>
                    <h5 className="font-bold text-gray-900 dark:text-white">{match.university.name}</h5>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 leading-relaxed">{match.university.reason}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {match.university.expertise.map(e => <Badge key={e} variant="outline" className="text-[10px] border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">{e}</Badge>)}
                    </div>
                  </div>

                  <div className="border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-5 bg-gradient-to-br from-indigo-50/80 to-indigo-50/40 dark:from-indigo-500/10 dark:to-indigo-500/5 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500 shadow-md shadow-indigo-500/20 flex items-center justify-center">
                        <Factory className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-800 dark:text-white">Industry Partner</h4>
                      <Badge className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-[10px] font-bold ml-auto">{match.industry.matchScore}%</Badge>
                    </div>
                    <h5 className="font-bold text-gray-900 dark:text-white">{match.industry.name}</h5>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 leading-relaxed">{match.industry.reason}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {match.industry.expertise.map(e => <Badge key={e} variant="outline" className="text-[10px] border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400">{e}</Badge>)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-white/10">
                  <Button className="font-semibold shadow-sm rounded-xl px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white">
                    <Link2 className="h-4 w-4 mr-2" /> Initiate Collaboration
                  </Button>
                  <Link href="/challenges">
                    <Button variant="outline" className="font-medium rounded-xl border-slate-200 dark:border-white/10 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">View Challenge Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
