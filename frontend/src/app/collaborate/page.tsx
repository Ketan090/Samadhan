'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber, getCategoryIcon } from '@/lib/utils';
import {
  Users, Building2, GraduationCap, Factory, Link2, Target,
  Brain, ArrowRight, MapPin, Zap, Star, CheckCircle2
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Collaboration Match</h1>
          <p className="text-muted-foreground mt-1">AI-powered matching of challenges with universities and industry partners</p>
        </div>
      </div>

      {/* How Matching Works */}
      <Card className="mb-8 border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">How Collaboration Matching Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {[
              { step: '1', label: 'Analyze', desc: 'AI analyzes challenge requirements and expertise needs' },
              { step: '2', label: 'Match', desc: 'Compares with university research areas and industry capabilities' },
              { step: '3', label: 'Score', desc: 'Calculates compatibility score based on expertise, location, and resources' },
              { step: '4', label: 'Recommend', desc: 'Suggests optimal team composition with role assignments' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{s.step}</div>
                <div><div className="font-medium">{s.label}</div><div className="text-xs text-muted-foreground">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="mb-6">
        <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
          <SelectTrigger className="w-full md:w-96">
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
      <div className="space-y-6">
        {matchResults.filter(m => selectedChallenge === 'all' || m.challenge.title === selectedChallenge).map((match, i) => (
          <Card key={i} className="hover:shadow-lg transition-all overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />
            <CardContent className="p-6">
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">{getCategoryIcon(match.challenge.category)} {match.challenge.category}</Badge>
                  <h3 className="text-xl font-bold">{match.challenge.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {match.challenge.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.challenge.expertise.map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                  </div>
                </div>
                <div className="text-center bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl px-4 py-3">
                  <div className="text-3xl font-bold">{match.overallScore}%</div>
                  <div className="text-xs opacity-80">Match</div>
                </div>
              </div>

              {/* Matching Partners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* University Match */}
                <div className="border rounded-lg p-4 bg-green-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">University Partner</h4>
                    <Badge className="bg-green-100 text-green-700 text-xs ml-auto">{match.university.matchScore}%</Badge>
                  </div>
                  <h5 className="font-medium text-lg">{match.university.name}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{match.university.reason}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.university.expertise.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                  </div>
                </div>

                {/* Industry Match */}
                <div className="border rounded-lg p-4 bg-indigo-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-semibold">Industry Partner</h4>
                    <Badge className="bg-indigo-100 text-indigo-700 text-xs ml-auto">{match.industry.matchScore}%</Badge>
                  </div>
                  <h5 className="font-medium text-lg">{match.industry.name}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{match.industry.reason}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.industry.expertise.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <Button className="gradient-primary">                   <Link2 className="h-4 w-4 mr-2" /> Initiate Collaboration
                </Button>
                <Link href="/challenges">
                  <Button variant="outline">View Challenge Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
