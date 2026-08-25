'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber, getCategoryIcon } from '@/lib/utils';
import {
  Users, Building2, GraduationCap, Factory, Handshake, Target,
  Brain, ArrowRight, MapPin, Zap, Star, CheckCircle2, Link2
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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Collaboration Match</h1>
        <p className="text-muted-foreground mt-1">AI-powered matching of challenges with universities and industry partners</p>
      </div>

      {/* How Matching Works */}
      <Card className="mb-8 border-0 shadow-card bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold">How Collaboration Matching Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {[
              { step: '1', label: 'Analyze', desc: 'AI analyzes challenge requirements and expertise needs' },
              { step: '2', label: 'Match', desc: 'Compares with university research areas and industry capabilities' },
              { step: '3', label: 'Score', desc: 'Calculates compatibility based on expertise, location, and resources' },
              { step: '4', label: 'Recommend', desc: 'Suggests optimal team composition with role assignments' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{s.step}</div>
                <div><div className="font-semibold text-sm">{s.label}</div><div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="mb-6">
        <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
          <SelectTrigger className="w-full md:w-96 h-11">
            <SelectValue placeholder="Filter by challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Challenges</SelectItem>
            {matchResults.map((m, i) => (
              <SelectItem key={i} value={m.challenge.title}>{m.challenge.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Match Results */}
      <div className="space-y-5">
        {matchResults.filter(m => selectedChallenge === 'all' || m.challenge.title === selectedChallenge).map((match, i) => (
          <Card key={i} className="hover:shadow-card-hover transition-all duration-200 overflow-hidden border-0 shadow-card">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
            <CardContent className="p-6">
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <Badge variant="outline" className="text-[11px] mb-2 font-medium">{getCategoryIcon(match.challenge.category)} {match.challenge.category}</Badge>
                  <h3 className="text-xl font-bold tracking-tight">{match.challenge.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {match.challenge.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.challenge.expertise.map(e => <Badge key={e} variant="secondary" className="text-[10px] font-medium">{e}</Badge>)}
                  </div>
                </div>
                <div className="text-center bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl px-5 py-3 shadow-lg">
                  <div className="text-3xl font-bold">{match.overallScore}%</div>
                  <div className="text-[10px] opacity-80 font-medium uppercase tracking-wider">Match</div>
                </div>
              </div>

              {/* Partners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4 bg-emerald-50/50 dark:bg-emerald-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-semibold text-sm">University Partner</h4>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold ml-auto">{match.university.matchScore}%</Badge>
                  </div>
                  <h5 className="font-semibold">{match.university.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{match.university.reason}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.university.expertise.map(e => <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>)}
                  </div>
                </div>

                <div className="border border-indigo-200 dark:border-indigo-800/30 rounded-xl p-4 bg-indigo-50/50 dark:bg-indigo-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-semibold text-sm">Industry Partner</h4>
                    <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] font-bold ml-auto">{match.industry.matchScore}%</Badge>
                  </div>
                  <h5 className="font-semibold">{match.industry.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{match.industry.reason}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.industry.expertise.map(e => <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5 pt-4 border-t border-border/50">
                <Button className="gradient-primary font-semibold shadow-sm">
                  <Link2 className="h-4 w-4 mr-2" /> Initiate Collaboration
                </Button>
                <Link href="/challenges">
                  <Button variant="outline" className="font-medium">View Challenge Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
