'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber, getStatusColor, getCategoryIcon } from '@/lib/utils';
import {
  Factory, Lightbulb, Users, Link2, Rocket, DollarSign,
  ArrowRight, Plus, TrendingUp, Shield
} from 'lucide-react';

export default function IndustryPortal() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
          <Factory className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Industry Portal</h1>
          <p className="text-muted-foreground">TechCorp Solutions • Information Technology</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Matching Challenges', value: '18', icon: Lightbulb, color: 'text-blue-600' },
          { label: 'Mentorships', value: '4', icon: Users, color: 'text-purple-600' },
          { label: 'Active Partnerships', value: '6', icon: Link2, color: 'text-green-600' },
          { label: 'Pilots Sponsored', value: '2', icon: Rocket, color: 'text-orange-600' },
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

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="opportunities">Industry Opportunities</TabsTrigger>
          <TabsTrigger value="challenges">Discover Challenges</TabsTrigger>
          <TabsTrigger value="partnerships">My Partnerships</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <h2 className="text-xl font-semibold">How You Can Contribute</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Users, title: 'Mentorship', desc: 'Guide university teams with industry expertise', action: 'Find Teams', color: 'bg-purple-500' },
              { icon: Lightbulb, title: 'Technology Partner', desc: 'Provide technology stack, APIs, or platforms', action: 'Explore', color: 'bg-blue-500' },
              { icon: DollarSign, title: 'Funding Partner', desc: 'Fund pilot programs and implementation', action: 'View Needs', color: 'bg-green-500' },
              { icon: Rocket, title: 'Pilot Partner', desc: 'Sponsor real-world pilot implementations', action: 'See Pilots', color: 'bg-orange-500' },
              { icon: Shield, title: 'Infrastructure', desc: 'Provide facilities, labs, or computing resources', action: 'Contribute', color: 'bg-red-500' },
              { icon: TrendingUp, title: 'Research Partner', desc: 'Co-develop research with universities', action: 'Discover', color: 'bg-cyan-500' },
            ].map(opp => {
              const Icon = opp.icon;
              return (
                <Card key={opp.title} className="hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className={`h-10 w-10 rounded-lg ${opp.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{opp.desc}</p>
                    <span className="text-sm text-primary font-medium flex items-center gap-1">
                      {opp.action} <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <h2 className="text-xl font-semibold">Challenges Matching Your Capabilities</h2>
          {[
            { title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: 'Ranchi, Jharkhand', matchScore: 94, relevance: 'IoT + Cloud Computing + AI', status: 'open' },
            { title: 'Traffic Congestion Prediction', category: 'Transportation', location: 'Mumbai, Maharashtra', matchScore: 91, relevance: 'AI/ML + Computer Vision', status: 'open' },
            { title: 'Urban Flood Prevention Using IoT', category: 'Infrastructure', location: 'Chennai, Tamil Nadu', matchScore: 88, relevance: 'IoT + Data Analytics', status: 'open' },
          ].map(ch => (
            <Card key={ch.title} className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(ch.status)} capitalize text-xs`}>{ch.status}</Badge>
                      <Badge variant="outline" className="text-xs">{getCategoryIcon(ch.category)} {ch.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{ch.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{ch.location}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{ch.relevance}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{ch.matchScore}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                    <Button size="sm" className="mt-2" variant="outline">Mentor</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          <h2 className="text-xl font-semibold">Active Partnerships</h2>
          {[
            { challenge: 'Smart Waste Collection', university: 'IIT Bombay', role: 'Technology Partner', status: 'active', matchScore: 94 },
            { challenge: 'Traffic Congestion Prediction', university: 'IIT Bombay', role: 'Research Partner', status: 'active', matchScore: 91 },
          ].map(p => (
            <Card key={p.challenge + p.university}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.challenge}</h3>
                  <p className="text-sm text-muted-foreground">with {p.university} • {p.role}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-700">{p.status}</Badge>
                  <div className="text-lg font-bold text-primary mt-1">{p.matchScore}%</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
