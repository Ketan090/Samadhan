'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber, getStatusColor, getCategoryIcon } from '@/lib/utils';
import {
  Shield, CheckCircle2, Clock, AlertTriangle, Rocket, BarChart3,
  ArrowRight, Users, Building2, Lightbulb, Eye, Settings
} from 'lucide-react';

export default function GovernmentDashboard() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Government Dashboard</h1>
          <p className="text-muted-foreground">Ministry of Electronics and Information Technology</p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800 text-xs">Demo Data</Badge>
      </div>

      {/* Command Center Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {[
          { label: 'Total Challenges', value: '156', icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Verification', value: '12', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Active Collaborations', value: '67', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Awaiting Evaluation', value: '8', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Active Pilots', value: '12', icon: Rocket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Implemented', value: '6', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'People Impacted', value: '425K', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={`${s.bg} border-0`}>
              <CardContent className="p-3 text-center">
                <Icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{s.label}</div>
              </CardContent>
            </Card>
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
            <h2 className="text-xl font-semibold">Challenges Awaiting Verification</h2>
            <Button size="sm" className="gradient-primary"><Plus className="h-4 w-4 mr-1" /> Create Official Challenge</Button>
          </div>
          {[
            { title: 'Public Transport Route Optimization', category: 'Transportation', city: 'Kolkata', state: 'West Bengal', submittedBy: 'Green Earth Foundation', date: '2024-03-05', affected: 1000000 },
            { title: 'Digital Literacy for Senior Citizens', category: 'Education', city: 'Pune', state: 'Maharashtra', submittedBy: 'Digital India Foundation', date: '2024-03-10', affected: 50000 },
          ].map(ch => (
            <Card key={ch.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs mb-2">Pending Verification</Badge>
                    <h3 className="font-semibold">{ch.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{getCategoryIcon(ch.category)} {ch.category} • {ch.city}, {ch.state} • {formatNumber(ch.affected)} affected</p>
                    <p className="text-xs text-muted-foreground mt-1">Submitted by {ch.submittedBy}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-4 w-4 mr-1" /> Verify</Button>
                    <Button size="sm" variant="outline" className="text-red-600"><AlertTriangle className="h-4 w-4 mr-1" /> Reject</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <h2 className="text-xl font-semibold">Active Projects & Collaborations</h2>
          {[
            { challenge: 'Smart Waste Collection', university: 'IIT Bombay', industry: 'GreenTech Innovations', status: 'in-progress', progress: 45 },
            { challenge: 'Traffic Congestion Prediction', university: 'IIT Bombay', industry: 'TechCorp Solutions', status: 'pilot', progress: 70 },
            { challenge: 'Rural Water Quality Monitoring', university: 'VIT Chennai', industry: null, status: 'in-progress', progress: 30 },
          ].map(p => (
            <Card key={p.challenge}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.challenge}</h3>
                  <p className="text-sm text-muted-foreground">{p.university}{p.industry ? ` + ${p.industry}` : ''}</p>
                  <Badge className={`${getStatusColor(p.status)} capitalize text-xs mt-2`}>{p.status}</Badge>
                </div>
                <div className="w-32">
                  <div className="text-right text-sm font-medium mb-1">{p.progress}%</div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="evaluate" className="space-y-4">
          <h2 className="text-xl font-semibold">Solutions Awaiting Government Evaluation</h2>
          {[
            { title: 'SmartBin: IoT-Enabled Waste Collection', challenge: 'Smart Waste Collection', team: 'EcoTech Solutions', submitted: '2024-03-15', score: 7.85 },
            { title: 'AquaSense: Rural Water Quality Monitor', challenge: 'Rural Water Quality', team: 'WaterGuard India', submitted: '2024-03-20', score: null },
          ].map(s => (
            <Card key={s.title}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs mb-2">Under Review</Badge>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.challenge} • Team: {s.team}</p>
                </div>
                <div className="flex items-center gap-3">
                  {s.score && <div className="text-xl font-bold text-primary">{s.score}/10</div>}
                  <Button size="sm" className="gradient-primary">Evaluate</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="implement">
          <h2 className="text-xl font-semibold mb-4">Implementation Pipeline</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {['Submitted', 'Verified', 'Open', 'Team Formed', 'Solution', 'Prototype', 'Pilot', 'Approved', 'Implemented', 'Measured'].map((stage, i) => {
                  const colors = ['bg-gray-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-indigo-100', 'bg-yellow-100', 'bg-orange-100', 'bg-cyan-100', 'bg-emerald-100', 'bg-teal-100'];
                  const counts = [8, 12, 45, 23, 15, 8, 12, 6, 6, 4];
                  return (
                    <div key={stage} className="flex flex-col items-center min-w-[80px]">
                      <div className={`h-10 w-10 rounded-full ${colors[i]} flex items-center justify-center mb-2 text-xs font-bold`}>{counts[i]}</div>
                      <span className="text-[10px] text-muted-foreground text-center">{stage}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Plus(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}
