'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Leaf, Clock, MapPin, IndianRupee, ArrowUp, Minus } from 'lucide-react';

const impactMetrics = [
  { metric: 'People Benefited', value: '425,000', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { metric: 'Cost Saved', value: '₹2.3Cr', change: '+18%', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { metric: 'Time Saved', value: '15,000 hrs', change: '+25%', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
  { metric: 'Problems Resolved', value: '34', change: '+8', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { metric: 'Wards/Villages', value: '89', change: '+12', icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  { metric: 'CO₂ Reduction', value: '120 t', change: '+15%', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
];

const beforeAfter = [
  { title: 'Waste Collection Efficiency', subtitle: 'Ranchi Urban Wards', before: { value: '40%', label: 'Before SmartBin' }, after: { value: '82%', label: 'After SmartBin' }, improvement: '+42 pp', color: 'bg-emerald-500' },
  { title: 'Commute Time', subtitle: 'Mumbai Pilot Junctions', before: { value: '90 min', label: 'Before TrafficPulse' }, after: { value: '67 min', label: 'After TrafficPulse' }, improvement: '-25.6%', color: 'bg-blue-500' },
  { title: 'Traffic Flow Efficiency', subtitle: 'AI-Adaptive Signals', before: { value: '45%', label: 'Before AI Signals' }, after: { value: '80%', label: 'After AI Signals' }, improvement: '+77.8%', color: 'bg-violet-500' },
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
          <h1 className="text-3xl font-bold tracking-tight">Impact Dashboard</h1>
          <p className="text-muted-foreground mt-1">Measuring real-world outcomes of collaborative solutions</p>
        </div>
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">Demo Data</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {impactMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.metric} className={`border-0 shadow-card ${m.bg}`}>
              <CardContent className="p-4">
                <Icon className={`h-5 w-5 mb-2.5 ${m.color}`} />
                <div className="text-2xl font-bold tracking-tight">{m.value}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{m.metric}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">
                  <ArrowUp className="h-3 w-3" /> {m.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Before/After */}
      <h2 className="text-xl font-semibold tracking-tight mb-4">Before / After Comparisons</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {beforeAfter.map((ba) => (
          <Card key={ba.title} className="border-0 shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm">{ba.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{ba.subtitle}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-red-500 font-medium uppercase tracking-wider mb-1">Before</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{ba.before.value}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider mb-1">After</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{ba.after.value}</div>
                </div>
              </div>
              <div className="text-center">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold">
                  <TrendingUp className="h-3 w-3 mr-1" /> {ba.improvement}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Solutions Table */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Solutions Impact Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Solution</th>
                  <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Challenge</th>
                  <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 font-medium text-xs uppercase tracking-wider">People</th>
                  <th className="text-right py-3 font-medium text-xs uppercase tracking-wider">Cost</th>
                  <th className="text-right py-3 font-medium text-xs uppercase tracking-wider">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {solutionsImpact.map(s => (
                  <tr key={s.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 font-medium">{s.name}</td>
                    <td className="py-3.5 text-muted-foreground">{s.challenge}</td>
                    <td className="py-3.5">
                      <Badge className={`${s.status === 'pilot' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'} text-xs font-medium capitalize`}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right font-medium">{s.people > 0 ? s.people.toLocaleString() : '—'}</td>
                    <td className="py-3.5 text-right">{s.cost}</td>
                    <td className="py-3.5 text-right">
                      {s.efficiency > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${s.efficiency}%` }} />
                          </div>
                          <span className="font-semibold text-sm">{s.efficiency}%</span>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
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
