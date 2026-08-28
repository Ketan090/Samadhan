'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, Users, Building2, Lightbulb, FileText, Settings,
  Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <Settings className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-slate-400">System Administration & Management</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Organizations', value: '120', icon: Building2, color: 'text-green-600 dark:text-green-400' },
            { label: 'Challenges', value: '156', icon: Lightbulb, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Audit Events', value: '12.4K', icon: Activity, color: 'text-orange-600 dark:text-orange-400' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center ${s.color}`}><Icon className="h-5 w-5" /></div>
                  <div><div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div><div className="text-xs text-gray-500 dark:text-slate-400">{s.label}</div></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white">User Management</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-200 dark:border-white/10 text-gray-500 dark:text-slate-400">
                      <th className="text-left py-3 font-medium">Name</th>
                      <th className="text-left py-3 font-medium">Email</th>
                      <th className="text-left py-3 font-medium">Role</th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-right py-3 font-medium">Actions</th>
                    </tr></thead>
                    <tbody>
                      {[
                        { name: 'Priya Sharma', email: 'priya.sharma@gov.in', role: 'government', active: true },
                        { name: 'Prof. Amit Verma', email: 'amit.verma@iitb.ac.in', role: 'university', active: true },
                        { name: 'Vikram Patel', email: 'vikram.patel@techcorp.in', role: 'industry', active: true },
                        { name: 'Meena Joshi', email: 'meena.joshi@earthwatch.org', role: 'expert', active: true },
                        { name: 'Rahul Singh', email: 'citizen1@gmail.com', role: 'citizen', active: true },
                      ].map(u => (
                        <tr key={u.email} className="border-b border-slate-100 dark:border-white/5 last:border-0">
                          <td className="py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                          <td className="py-3 text-gray-500 dark:text-slate-400">{u.email}</td>
                          <td className="py-3"><Badge variant="outline" className="capitalize text-xs border-slate-200 dark:border-white/10 dark:text-slate-300">{u.role}</Badge></td>
                          <td className="py-3"><Badge className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-xs">Active</Badge></td>
                          <td className="py-3 text-right"><Button variant="ghost" size="sm" className="dark:text-slate-300 dark:hover:bg-white/5">Edit</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white">Organization Management</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'IIT Bombay', type: 'university', verified: true, challenges: 12 },
                    { name: 'TechCorp Solutions', type: 'industry', verified: true, challenges: 15 },
                    { name: 'VIT Chennai', type: 'university', verified: true, challenges: 8 },
                    { name: 'EarthWatch Foundation', type: 'ngo', verified: true, challenges: 10 },
                    { name: 'Ministry of Electronics', type: 'government', verified: true, challenges: 50 },
                  ].map(org => (
                    <div key={org.name} className="border border-slate-200 dark:border-white/10 rounded-xl p-3 flex items-center justify-between bg-white dark:bg-white/[0.04]">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">{org.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize border-slate-200 dark:border-white/10 dark:text-slate-300">{org.type}</Badge>
                          {org.verified && <Badge className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-xs">Verified</Badge>}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500 dark:text-slate-400">{org.challenges} challenges</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white">Challenge Management</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total', value: '156', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20' },
                    { label: 'Open', value: '45', color: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20' },
                    { label: 'In Progress', value: '23', color: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20' },
                    { label: 'Implemented', value: '6', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' },
                  ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white">Recent Audit Log</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'Challenge Verified', user: 'Priya Sharma', entity: 'Smart Waste Collection', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-600 dark:text-green-400' },
                    { action: 'Solution Submitted', user: 'Prof. Amit Verma', entity: 'SmartBin System', time: '5 hours ago', icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
                    { action: 'User Registered', user: 'Anita Devi', entity: 'citizen2@gmail.com', time: '1 day ago', icon: Users, color: 'text-purple-600 dark:text-purple-400' },
                    { action: 'Collaboration Accepted', user: 'Vikram Patel', entity: 'TechCorp + IIT Bombay', time: '2 days ago', icon: Building2, color: 'text-orange-600 dark:text-orange-400' },
                  ].map((log, i) => {
                    const Icon = log.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04]">
                        <Icon className={`h-4 w-4 ${log.color}`} />
                        <div className="flex-1">
                          <span className="font-medium text-sm text-gray-900 dark:text-white">{log.action}</span>
                          <span className="text-gray-500 dark:text-slate-400 text-sm"> by {log.user}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-slate-400">{log.time}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
