'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiMatchingAPI } from '@/lib/api';
import {
  Shield, Users, Building2, Lightbulb, FileText, Settings,
  Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp, Brain, Key, Server, Save
} from 'lucide-react';

export default function AdminDashboard() {
  const [aiConfig, setAiConfig] = useState<any>(null);
  const [aiForm, setAiForm] = useState({ provider: 'mock', apiBase: '', openaiKey: '', geminiKey: '', minimumMatchScore: 60 });
  const [aiSaving, setAiSaving] = useState(false);
  const [aiMsg, setAiMsg] = useState('');
  useEffect(()=>{ (async()=>{ try{ const r=await aiMatchingAPI.getConfig(); setAiConfig(r.data.config); setAiForm({ provider: r.data.config.provider, apiBase: r.data.config.apiBase||'', openaiKey: '', geminiKey: '', minimumMatchScore: r.data.config.minimumMatchScore }); }catch{} })(); },[]);
  const saveAI = async()=>{
    setAiSaving(true); setAiMsg('');
    try{
      const payload:any={ provider: aiForm.provider, apiBase: aiForm.apiBase, minimumMatchScore: Number(aiForm.minimumMatchScore) };
      const keys:any={}; if(aiForm.openaiKey) keys.openai=aiForm.openaiKey; if(aiForm.geminiKey) keys.gemini=aiForm.geminiKey; if(Object.keys(keys).length) payload.apiKeys=keys;
      await aiMatchingAPI.updateConfig(payload);
      if(typeof window !== 'undefined'){
        if(aiForm.apiBase && (aiForm.provider==='lmstudio' || aiForm.provider==='local')) localStorage.setItem('lmstudio_url', aiForm.apiBase);
        if(aiForm.apiBase) localStorage.setItem('samadhanhub_api_base', aiForm.apiBase);
      }
      setAiMsg('Saved — provider now ' + aiForm.provider + (aiForm.apiBase ? ` via ${aiForm.apiBase}` : '') + ' ✓ Also stored locally for direct browser connection');
    } catch(e:any){
      if(e.response?.status===403){
        setAiMsg('Admin only (first config allowed) — trying local fallback...');
        try{ if(typeof window !== 'undefined' && aiForm.apiBase) { localStorage.setItem('lmstudio_url', aiForm.apiBase); setAiMsg('Saved locally (browser) — your device will use LM Studio directly. For all visitors, promote to admin or use ngrok URL.'); } } catch{}
      } else setAiMsg(e.response?.data?.message || 'Save failed');
    }
    finally{ setAiSaving(false); }
  };
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
          <TabsList className="flex-wrap">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="ai">AI Config</TabsTrigger>
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

          <TabsContent value="ai" className="space-y-4">
            <Card className="border border-violet-200 dark:border-violet-900/30 bg-white dark:bg-[#0F1420]">
              <CardHeader><CardTitle className="text-sm text-gray-900 dark:text-white flex items-center gap-2"><Brain className="h-4 w-4 text-violet-600" /> AI Matching & Vision — Provider & Keys</CardTitle><p className="text-xs text-slate-500 mt-1">Paste any provider key once — entire site forwards there. For LM Studio, paste ngrok URL in API Base and set provider to LM Studio.</p></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-semibold">Provider</label><Select value={aiForm.provider} onValueChange={v=>setAiForm({...aiForm, provider:v})}><SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="mock">Mock (demo, free unlimited)</SelectItem><SelectItem value="openai">OpenAI</SelectItem><SelectItem value="gemini">Gemini</SelectItem><SelectItem value="lmstudio">LM Studio (local/ngrok)</SelectItem><SelectItem value="local">Local Ollama</SelectItem></SelectContent></Select></div>
                  <div className="md:col-span-2"><label className="text-xs font-semibold flex items-center gap-1"><Server className="h-3 w-3" /> API Base / LM Studio URL (for ngrok or localhost:1234)</label><Input value={aiForm.apiBase} onChange={e=>setAiForm({...aiForm, apiBase:e.target.value})} placeholder="https://xxxx.ngrok.io or http://localhost:1234/v1 or https://api.openai.com/v1" className="mt-1.5 h-11 rounded-xl" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold flex items-center gap-1"><Key className="h-3 w-3" /> OpenAI API Key</label><Input type="password" value={aiForm.openaiKey} onChange={e=>setAiForm({...aiForm, openaiKey:e.target.value})} placeholder={aiConfig?.apiKeys?.openai ? aiConfig.apiKeys.openai : "sk-... (paste to enable OpenAI)"} className="mt-1.5 h-11 rounded-xl" /></div>
                  <div><label className="text-xs font-semibold flex items-center gap-1"><Key className="h-3 w-3" /> Gemini API Key</label><Input type="password" value={aiForm.geminiKey} onChange={e=>setAiForm({...aiForm, geminiKey:e.target.value})} placeholder={aiConfig?.apiKeys?.gemini ? aiConfig.apiKeys.gemini : "AI... (paste to enable Gemini)"} className="mt-1.5 h-11 rounded-xl" /></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1"><label className="text-xs font-semibold">Minimum Match Score</label><Input type="number" value={aiForm.minimumMatchScore} onChange={e=>setAiForm({...aiForm, minimumMatchScore: parseInt(e.target.value)||0})} className="mt-1.5 h-11 rounded-xl w-32" /></div>
                  <Button onClick={saveAI} disabled={aiSaving} className="mt-6 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 gap-2">{aiSaving ? 'Saving...' : <><Save className="h-4 w-4" /> Save AI Config</>}</Button>
                </div>
                {aiMsg && <div className="text-xs p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300">{aiMsg}</div>}
                <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-500 space-y-1">
                  <div><span className="font-semibold">Mock:</span> Free unlimited, no key, heuristic + embeddings — works offline (current).</div>
                  <div><span className="font-semibold">OpenAI/Gemini:</span> Paste key above, set provider, Save — entire site vision + matching forwards there (backend proxy, so Vercel → Render → your key). No key exposed to client.</div>
                  <div><span className="font-semibold">LM Studio (Option B):</span> Start LM Studio → `ngrok http 1234` → paste `https://xxxx.ngrok.io/v1` in API Base → provider LM Studio → Save — entire site forwards to your laptop. Or paste `http://localhost:1234/v1` for same-device only.</div>
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
