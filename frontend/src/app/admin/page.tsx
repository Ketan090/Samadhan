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
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <Settings className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System Administration & Management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-600' },
          { label: 'Organizations', value: '120', icon: Building2, color: 'text-green-600' },
          { label: 'Challenges', value: '156', icon: Lightbulb, color: 'text-purple-600' },
          { label: 'Audit Events', value: '12.4K', icon: Activity, color: 'text-orange-600' },
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

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">User Management</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-muted-foreground">
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
                      <tr key={u.email} className="border-b last:border-0">
                        <td className="py-3 font-medium">{u.name}</td>
                        <td className="py-3 text-muted-foreground">{u.email}</td>
                        <td className="py-3"><Badge variant="outline" className="capitalize text-xs">{u.role}</Badge></td>
                        <td className="py-3"><Badge className="bg-green-100 text-green-700 text-xs">Active</Badge></td>
                        <td className="py-3 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Organization Management</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'IIT Bombay', type: 'university', verified: true, challenges: 12 },
                  { name: 'TechCorp Solutions', type: 'industry', verified: true, challenges: 15 },
                  { name: 'VIT Chennai', type: 'university', verified: true, challenges: 8 },
                  { name: 'EarthWatch Foundation', type: 'ngo', verified: true, challenges: 10 },
                  { name: 'Ministry of Electronics', type: 'government', verified: true, challenges: 50 },
                ].map(org => (
                  <div key={org.name} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{org.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">{org.type}</Badge>
                        {org.verified && <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">{org.challenges} challenges</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader><CardTitle className="text-sm">Challenge Management</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: '156', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Open', value: '45', color: 'bg-green-50 text-green-700' },
                  { label: 'In Progress', value: '23', color: 'bg-yellow-50 text-yellow-700' },
                  { label: 'Implemented', value: '6', color: 'bg-emerald-50 text-emerald-700' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-lg p-4 text-center`}>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader><CardTitle className="text-sm">Recent Audit Log</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Challenge Verified', user: 'Priya Sharma', entity: 'Smart Waste Collection', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-600' },
                  { action: 'Solution Submitted', user: 'Prof. Amit Verma', entity: 'SmartBin System', time: '5 hours ago', icon: FileText, color: 'text-blue-600' },
                  { action: 'User Registered', user: 'Anita Devi', entity: 'citizen2@gmail.com', time: '1 day ago', icon: Users, color: 'text-purple-600' },
                  { action: 'Collaboration Accepted', user: 'Vikram Patel', entity: 'TechCorp + IIT Bombay', time: '2 days ago', icon: Building2, color: 'text-orange-600' },
                ].map((log, i) => {
                  const Icon = log.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Icon className={`h-4 w-4 ${log.color}`} />
                      <div className="flex-1">
                        <span className="font-medium text-sm">{log.action}</span>
                        <span className="text-muted-foreground text-sm"> by {log.user}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
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
