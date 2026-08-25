'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Leaf, Clock, MapPin, IndianRupee, ArrowUp, ArrowDown } from 'lucide-react';

const impactMetrics = [
  { metric: 'People Benefited', value: '425,000', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { metric: 'Cost Saved', value: '₹2.3Cr', change: '+18%', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
  { metric: 'Time Saved', value: '15,000 hrs', change: '+25%', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  { metric: 'Problems Resolved', value: '34', change: '+8', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
  { metric: 'Wards/Villages Covered', value: '89', change: '+12', icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { metric: 'CO₂ Reduction', value: '120 tonnes', change: '+15%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const beforeAfter = [
  { title: 'Waste Collection Efficiency (Ranchi)', before: { value: '40%', label: 'Before SmartBin' }, after: { value: '82%', label: 'After SmartBin' }, improvement: '+42 percentage points', color: 'bg-green-500' },
  { title: 'Commute Time (Mumbai Pilot Junctions)', before: { value: '90 min', label: 'Before TrafficPulse' }, after: { value: '67 min', label: 'After TrafficPulse' }, improvement: '-25.6% reduction', color: 'bg-blue-500' },
  { title: 'Traffic Flow Efficiency', before: { value: '45%', label: 'Before AI Signals' }, after: { value: '80%', label: 'After AI Signals' }, improvement: '+77.8% improvement', color: 'bg-purple-500' },
];

const solutionsImpact = [
  { name: 'SmartBin', challenge: 'Smart Waste Collection', status: 'pilot', people: 25000, cost: '₹25L', efficiency: 82, timeline: '6 months' },
  { name: 'TrafficPulse', challenge: 'Traffic Congestion', status: 'pilot', people: 500000, cost: '₹50L', efficiency: 80, timeline: '4 months' },
  { name: 'AquaSense', challenge: 'Water Quality Monitoring', status: 'in-progress', people: 0, cost: '₹18L', efficiency: 0, timeline: '3 months' },
];

export default function ImpactDashboard() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Impact Dashboard</h1>
          <p className="text-muted-foreground mt-1">Measuring real-world outcomes of collaborative solutions</p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">Demo Data</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {impactMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.metric} className={m.bg}>
              <CardContent className="p-4">
                <Icon className={`h-5 w-5 mb-2 ${m.color}`} />
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-muted-foreground mb-1">{m.metric}</div>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <ArrowUp className="h-3 w-3" /> {m.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Before/After Comparisons */}
      <h2 className="text-xl font-semibold mb-4">Before / After Comparisons</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {beforeAfter.map((ba) => (
          <Card key={ba.title}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">{ba.title}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-red-600 mb-1">Before</div>
                  <div className="text-2xl font-bold text-red-700">{ba.before.value}</div>
                  <div className="text-[10px] text-red-500">{ba.before.label}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-600 mb-1">After</div>
                  <div className="text-2xl font-bold text-green-700">{ba.after.value}</div>
                  <div className="text-[10px] text-green-500">{ba.after.label}</div>
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 text-sm font-semibold text-green-600`}>
                  <TrendingUp className="h-4 w-4" /> {ba.improvement}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Solutions Impact Table */}
      <Card>
        <CardHeader><CardTitle>Solutions Impact Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-3 font-medium">Solution</th>
                  <th className="text-left py-3 font-medium">Challenge</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">People</th>
                  <th className="text-right py-3 font-medium">Cost</th>
                  <th className="text-right py-3 font-medium">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {solutionsImpact.map(s => (
                  <tr key={s.name} className="border-b last:border-0">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-muted-foreground">{s.challenge}</td>
                    <td className="py-3"><Badge className={`${s.status === 'pilot' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs capitalize`}>{s.status}</Badge></td>
                    <td className="py-3 text-right">{s.people > 0 ? s.people.toLocaleString() : '—'}</td>
                    <td className="py-3 text-right">{s.cost}</td>
                    <td className="py-3 text-right">
                      {s.efficiency > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${s.efficiency}%` }} />
                          </div>
                          <span className="font-medium">{s.efficiency}%</span>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
