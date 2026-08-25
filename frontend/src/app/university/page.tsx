'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber, getStatusColor, getCategoryIcon } from '@/lib/utils';
import {
  GraduationCap, Users, Lightbulb, Rocket, MapPin, BookOpen,
  FlaskConical, ArrowRight, Plus, TrendingUp, Award
} from 'lucide-react';

const challenges = [
  { _id: '1', title: 'Smart Waste Collection for Urban Wards', category: 'Environment', status: 'open', matchScore: 94, affectedPopulation: 25000, location: 'Ranchi, Jharkhand' },
  { _id: '2', title: 'Traffic Congestion Prediction', category: 'Transportation', status: 'open', matchScore: 91, affectedPopulation: 500000, location: 'Mumbai, Maharashtra' },
  { _id: '3', title: 'Urban Flood Prevention Using IoT', category: 'Infrastructure', status: 'open', matchScore: 85, affectedPopulation: 300000, location: 'Chennai, Tamil Nadu' },
];

const projects = [
  { _id: 'p1', challenge: 'Smart Waste Collection', status: 'in-progress', progress: 45, team: 'EcoTech Solutions', members: 5 },
  { _id: 'p2', challenge: 'Traffic Congestion Prediction', status: 'in-progress', progress: 60, team: 'TrafficAI Labs', members: 4 },
];

export default function UniversityPortal() {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">University Portal</h1>
          <p className="text-muted-foreground">IIT Bombay • Department of Electronics Engineering</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Relevant Challenges', value: '12', icon: Lightbulb, color: 'text-blue-600' },
          { label: 'Active Projects', value: '3', icon: Rocket, color: 'text-green-600' },
          { label: 'Student Teams', value: '8', icon: Users, color: 'text-purple-600' },
          { label: 'Solutions Submitted', value: '5', icon: Award, color: 'text-orange-600' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}><Icon className="h-5 w-5" /></div>
                <div><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
              </CardContent>
            </Card>
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
            <h2 className="text-xl font-semibold">Recommended Challenges</h2>
            <Badge className="bg-green-100 text-green-700">AI-Matched for Your Expertise</Badge>
          </div>
          {challenges.map(ch => (
            <Card key={ch._id} className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(ch.status)} capitalize text-xs`}>{ch.status}</Badge>
                      <Badge variant="outline" className="text-xs">{getCategoryIcon(ch.category)} {ch.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{ch.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ch.location}</span>
                      <span>{formatNumber(ch.affectedPopulation)} affected</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{ch.matchScore}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                    <Link href={`/challenges/${ch._id}`}><Button size="sm" className="mt-2">View <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          {projects.map(proj => (
            <Card key={proj._id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{proj.challenge}</h3>
                  <Badge className="bg-blue-100 text-blue-700 text-xs capitalize">{proj.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {proj.team} ({proj.members} members)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                  <span className="text-sm font-medium">{proj.progress}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Student Teams</h2>
            <Button size="sm" className="gradient-primary"><Plus className="h-4 w-4 mr-1" /> Form New Team</Button>
          </div>
          {[
            { name: 'EcoTech Solutions', focus: 'IoT & Environmental Monitoring', members: 5, mentor: 'Prof. Amit Verma', status: 'active' },
            { name: 'TrafficAI Labs', focus: 'AI & Computer Vision', members: 4, mentor: 'Prof. Nandini Sharma', status: 'active' },
            { name: 'AquaSense Team', focus: 'Sensor Networks & Data Analytics', members: 3, mentor: 'Prof. Rajesh Gupta', status: 'forming' },
          ].map(team => (
            <Card key={team.name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.focus}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {team.members} members</span>
                    <span>Mentor: {team.mentor}</span>
                  </div>
                </div>
                <Badge className={team.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{team.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>University Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium ml-2">IIT Bombay</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="font-medium ml-2">University</span></div>
                <div><span className="text-muted-foreground">Location:</span> <span className="font-medium ml-2">Mumbai, Maharashtra</span></div>
                <div><span className="text-muted-foreground">Rating:</span> <span className="font-medium ml-2">4.8/5.0</span></div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Research Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {['IoT', 'AI/ML', 'Smart Cities', 'Environmental Monitoring', 'Renewable Energy', 'Water Treatment'].map(r => <Badge key={r} variant="secondary">{r}</Badge>)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Departments</h4>
                <div className="flex flex-wrap gap-2">
                  {['Electronics Engineering', 'Computer Science', 'Environmental Engineering', 'Mechanical Engineering', 'Civil Engineering'].map(d => <Badge key={d} variant="outline">{d}</Badge>)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {['IoT', 'Python', 'TensorFlow', 'Cloud Computing', 'Edge Computing', 'Raspberry Pi'].map(t => <Badge key={t}>{t}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
