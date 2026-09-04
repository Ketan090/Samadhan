'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Leaf, Clock, MapPin, IndianRupee, ArrowUp, Zap, Target } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { analyticsAPI } from '@/lib/api';

const impactMetrics = [
  { metric: 'People Benefited', value: '425,000', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { metric: 'Cost Saved', value: '₹2.3Cr', change: '+18%', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { metric: 'Time Saved', value: '15,000 hrs', change: '+25%', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  { metric: 'Problems Resolved', value: '34', change: '+8', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { metric: 'Wards/Villages', value: '89', change: '+12', icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { metric: 'CO₂ Reduction', value: '120 t', change: '+15%', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
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

const sustainabilityCards = [
  { label: 'Sustainability Impact', value: '94%', sublabel: 'Overall Score', icon: Target, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', barColors: ['#00b894', '#fdcb6e', '#e17055', '#6c5ce7'] },
  { label: 'Electricity Savings', value: '12,400 kWh', sublabel: 'This Quarter', icon: Zap, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', barColors: ['#fdcb6e', '#e17055'] },
  { label: 'CO₂ Offset', value: '120 tons', sublabel: 'Year to Date', icon: Leaf, color: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400', barColors: ['#00b894', '#55efc4', '#6c5ce7'] },
];

const recentActivity = [
  { title: 'SmartBin pilot expanded to 3 new wards', time: '2 hours ago', type: 'milestone' },
  { title: 'TrafficPulse AI model v2.1 deployed', time: '5 hours ago', type: 'deployment' },
  { title: 'AquaSense sensor calibration completed', time: '1 day ago', type: 'task' },
  { title: 'Monthly impact report generated', time: '2 days ago', type: 'report' },
];

export default function ImpactDashboard() {
  const [live, setLive] = useState<any>(null);
  useEffect(()=>{ (async()=>{ try{ const r=await analyticsAPI.getOverview(); setLive(r.data.overview); } catch{} })(); },[]);
  const peopleVal = live?.totalPeopleImpacted ?? 425000;
  const metricsLive = [
    { metric: 'People Benefited', value: formatNumber(peopleVal), change: live ? `+${live.challenges?.open||12}%` : '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { metric: 'Cost Saved', value: live ? `₹${(live.totalCostSaved||2300000).toString().slice(0,2)}L` : '₹2.3Cr', change: '+18%', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { metric: 'Time Saved', value: '15,000 hrs', change: '+25%', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { metric: 'Problems Resolved', value: live ? String(live.solutions?.implemented||34) : '34', change: live ? `+${live.solutions?.pilot||8}` : '+8', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { metric: 'Wards/Villages', value: live ? String(live.organizations||89) : '89', change: '+12', icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { metric: 'CO₂ Reduction', value: '120 t', change: '+15%', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  ];
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Impact Dashboard</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1.5">Measuring real-world outcomes of collaborative solutions</p>
          </div>
          <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Data</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {(live ? metricsLive : impactMetrics).map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.metric} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-4">
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${m.bg}`}>
                    <Icon className={`h-5 w-5 ${m.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ArrowUp className="h-3 w-3" /> {m.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-3">{m.value}</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">{m.metric}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {sustainabilityCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{card.label}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">{card.sublabel}</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{card.value}</div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                  {card.barColors.map((color, i) => (
                    <div key={i} style={{ backgroundColor: color, width: `${100 / card.barColors.length}%` }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Before / After Comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {beforeAfter.map((ba) => (
                <div key={ba.title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-white">{ba.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">{ba.subtitle}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-3 text-center border border-red-100 dark:border-red-500/20">
                      <div className="text-[10px] text-red-400 dark:text-red-400 font-medium uppercase tracking-wider mb-1">Before</div>
                      <div className="text-2xl font-bold text-red-500">{ba.before.value}</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-500/20">
                      <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider mb-1">After</div>
                      <div className="text-2xl font-bold text-emerald-500">{ba.after.value}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-100 dark:border-emerald-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" /> {ba.improvement}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <div className="p-6 pb-0">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Solutions Impact Overview</h2>
              </div>
              <div className="p-6 pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/10 text-gray-500 dark:text-slate-400">
                        <th className="text-left py-3 font-medium text-[11px] uppercase tracking-wider">Solution</th>
                        <th className="text-left py-3 font-medium text-[11px] uppercase tracking-wider">Challenge</th>
                        <th className="text-left py-3 font-medium text-[11px] uppercase tracking-wider">Status</th>
                        <th className="text-right py-3 font-medium text-[11px] uppercase tracking-wider">People</th>
                        <th className="text-right py-3 font-medium text-[11px] uppercase tracking-wider">Cost</th>
                        <th className="text-right py-3 font-medium text-[11px] uppercase tracking-wider">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solutionsImpact.map(s => (
                        <tr key={s.name} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.04] transition-colors">
                          <td className="py-4 font-semibold text-gray-800 dark:text-white">{s.name}</td>
                          <td className="py-4 text-gray-500 dark:text-slate-400">{s.challenge}</td>
                          <td className="py-4">
                            <Badge className={`${s.status === 'pilot' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'} text-xs font-medium capitalize`}>
                              {s.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right font-semibold text-gray-800 dark:text-white">{s.people > 0 ? formatNumber(s.people) : '—'}</td>
                          <td className="py-4 text-right text-gray-500 dark:text-slate-400">{s.cost}</td>
                          <td className="py-4 text-right">
                            {s.efficiency > 0 ? (
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${s.efficiency}%` }} />
                                </div>
                                <span className="font-semibold text-sm text-gray-800 dark:text-white">{s.efficiency}%</span>
                              </div>
                            ) : <span className="text-gray-300 dark:text-slate-500">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6">
              <div className="space-y-5">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white leading-snug">{item.title}</p>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
