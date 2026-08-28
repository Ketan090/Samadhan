'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, MessageSquare, Users, CheckSquare, BookOpen,
  FileText, Rocket, Target, BarChart3, Calendar, Send
} from 'lucide-react';

export default function WorkspacePage() {
  const params = useParams();
  const [message, setMessage] = useState('');

  const workspace = {
    challenge: 'Smart Waste Collection for Urban Wards',
    team: 'EcoTech Solutions',
    university: 'IIT Bombay',
    industry: 'GreenTech Innovations',
    status: 'active',
    progress: 45,
    members: [
      { name: 'Prof. Amit Verma', role: 'Faculty Mentor', avatar: 'AV' },
      { name: 'Aditya Mehta', role: 'Team Lead', avatar: 'AM' },
      { name: 'Priya Patel', role: 'IoT Developer', avatar: 'PP' },
      { name: 'Vikram Patel', role: 'Industry Mentor', avatar: 'VP' },
    ],
    tasks: [
      { title: 'IoT sensor prototype design', assignee: 'Priya Patel', status: 'done', priority: 'high' },
      { title: 'Cloud platform setup', assignee: 'Aditya Mehta', status: 'in-progress', priority: 'high' },
      { title: 'Route optimization algorithm', assignee: 'Prof. Verma', status: 'in-progress', priority: 'medium' },
      { title: 'Mobile app wireframes', assignee: 'Aditya Mehta', status: 'todo', priority: 'medium' },
      { title: 'Field testing plan', assignee: 'Vikram Patel', status: 'todo', priority: 'low' },
    ],
    messages: [
      { user: 'Prof. Amit Verma', text: 'Team meeting scheduled for Thursday 4 PM. Please bring your prototype updates.', time: '2 hours ago' },
      { user: 'Aditya Mehta', text: 'Cloud platform is 80% ready. Should be deployable by end of this week.', time: '5 hours ago' },
      { user: 'Vikram Patel', text: 'Great progress! I have connected with the municipal corporation for field testing access.', time: '1 day ago' },
    ],
    milestones: [
      { title: 'Prototype Complete', date: '2024-04-15', status: 'completed' },
      { title: 'Cloud Platform Deployed', date: '2024-05-01', status: 'in-progress' },
      { title: 'Pilot Launch (5 wards)', date: '2024-06-15', status: 'pending' },
      { title: 'Full Deployment', date: '2024-09-01', status: 'pending' },
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-8">
        <Link href="/challenges" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{workspace.team}</h1>
            <p className="text-gray-500 dark:text-slate-400">Working on: {workspace.challenge}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-slate-400">
              <span className="flex items-center gap-1">🏛️ {workspace.university}</span>
              <span>🤝 {workspace.industry}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 capitalize">{workspace.status}</Badge>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{workspace.progress}%</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">Progress</div>
            </div>
          </div>
        </div>

        <div className="h-3 bg-slate-100 dark:bg-white/10 rounded-full mb-6">
          <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${workspace.progress}%` }} />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="overview"><Target className="h-3 w-3 mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="discussion"><MessageSquare className="h-3 w-3 mr-1" /> Discussion</TabsTrigger>
            <TabsTrigger value="team"><Users className="h-3 w-3 mr-1" /> Team</TabsTrigger>
            <TabsTrigger value="tasks"><CheckSquare className="h-3 w-3 mr-1" /> Tasks</TabsTrigger>
            <TabsTrigger value="milestones"><Calendar className="h-3 w-3 mr-1" /> Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
                <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white">Challenge</CardTitle></CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{workspace.challenge}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">IoT-enabled waste collection optimization system using AI for route planning, real-time tracking, and citizen engagement.</p>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
                <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white">Quick Stats</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Team Members</span><span className="font-medium text-gray-900 dark:text-white">{workspace.members.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Tasks Completed</span><span className="font-medium text-gray-900 dark:text-white">1/5</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Milestones</span><span className="font-medium text-gray-900 dark:text-white">1/4</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Documents</span><span className="font-medium text-gray-900 dark:text-white">8</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discussion">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardContent className="p-0">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04]">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Team Discussion</h3>
                </div>
                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {workspace.messages.map((msg, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                        {msg.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{msg.user}</span>
                          <span className="text-xs text-gray-500 dark:text-slate-400">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-white/10 flex gap-2">
                  <Input placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)} className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 dark:text-white" />
                  <Button size="icon"><Send className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workspace.members.map(m => (
                <Card key={m.name} className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{m.avatar}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{m.name}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">{m.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardContent className="p-4 space-y-3">
                {workspace.tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-white/20'}`}>
                      {task.status === 'done' && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500 dark:text-slate-400' : 'text-gray-900 dark:text-white'}`}>{task.title}</span>
                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Assigned to {task.assignee}</div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${task.priority === 'high' ? 'border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400' : task.priority === 'medium' ? 'border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400' : 'border-slate-200 dark:border-white/10 dark:text-slate-300'}`}>{task.priority}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {workspace.milestones.map((ms, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${ms.status === 'completed' ? 'bg-green-500 text-white' : ms.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-gray-500 dark:text-slate-400'}`}>
                        {ms.status === 'completed' ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${ms.status === 'completed' ? 'text-gray-500 dark:text-slate-400 line-through' : 'text-gray-900 dark:text-white'}`}>{ms.title}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{ms.date}</div>
                      </div>
                      <Badge className={`${ms.status === 'completed' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : ms.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-white/10'} text-xs`}>
                        {ms.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
