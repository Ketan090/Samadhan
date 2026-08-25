'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Lightbulb, Building2, Users, FileText, MapPin } from 'lucide-react';
import { getCategoryIcon, getStatusColor, formatNumber } from '@/lib/utils';

const allData = [
  { type: 'challenge', title: 'Smart Waste Collection for Urban Wards', detail: 'Environment • Ranchi, Jharkhand', href: '/challenges/1', icon: Lightbulb },
  { type: 'challenge', title: 'Rural Water Quality Monitoring System', detail: 'Healthcare • Patna, Bihar', href: '/challenges/2', icon: Lightbulb },
  { type: 'challenge', title: 'Traffic Congestion Prediction in Smart Cities', detail: 'Transportation • Mumbai, Maharashtra', href: '/challenges/3', icon: Lightbulb },
  { type: 'challenge', title: 'Telemedicine for Remote Healthcare Access', detail: 'Healthcare • Hyderabad, Telangana', href: '/challenges/4', icon: Lightbulb },
  { type: 'challenge', title: 'Urban Flood Prevention Using IoT and AI', detail: 'Infrastructure • Chennai, Tamil Nadu', href: '/challenges/5', icon: Lightbulb },
  { type: 'organization', title: 'IIT Bombay', detail: 'University • Mumbai, Maharashtra', href: '/university', icon: Building2 },
  { type: 'organization', title: 'VIT Chennai', detail: 'University • Chennai, Tamil Nadu', href: '/university', icon: Building2 },
  { type: 'organization', title: 'TechCorp Solutions', detail: 'Industry • Bangalore, Karnataka', href: '/industry', icon: Building2 },
  { type: 'organization', title: 'GreenTech Innovations', detail: 'Industry • Pune, Maharashtra', href: '/industry', icon: Building2 },
  { type: 'organization', title: 'EarthWatch Foundation', detail: 'NGO • Kolkata, West Bengal', href: '/collaborate', icon: Building2 },
  { type: 'solution', title: 'SmartBin: IoT-Enabled Waste Collection', detail: 'Status: Under Review • Score: 7.85/10', href: '/solutions/s1', icon: FileText },
  { type: 'solution', title: 'TrafficPulse: AI Traffic Management', detail: 'Status: Pilot • Score: 8.05/10', href: '/solutions/s3', icon: FileText },
];

const tabs = ['All', 'Challenges', 'Organizations', 'Solutions'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filtered = allData.filter(item => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.detail.toLowerCase().includes(query.toLowerCase());
    const matchesTab = activeTab === 'All' || item.type === activeTab.toLowerCase().slice(0, -1);
    return matchesQuery && matchesTab;
  });

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-12 h-12 text-lg"
          placeholder="Search challenges, organizations, solutions..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No results found for "{query}"</p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={i} href={item.href}>
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize flex-shrink-0">{item.type}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
