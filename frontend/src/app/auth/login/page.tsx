'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ArrowRight, Shield, Building2, GraduationCap, Users, Landmark, Quote, CheckCircle2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('samadhanhub_user') || '{}');
      const roleRoutes: Record<string,string> = { admin:'/admin', government:'/government', university:'/university', industry:'/industry', citizen:'/challenges', expert:'/challenges' };
      router.push(roleRoutes[user.role] || '/');
    } catch { setError('Invalid credentials. Try a demo account on the right.'); }
    setLoading(false);
  };

  const demoAccounts = [
    { label:'Admin', email:'admin@samadhanhub.gov.in', password:'admin123', icon:Shield, tint:'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300', name:'Dr. Rajesh Kumar' },
    { label:'Government', email:'government@samadhanhub.gov.in', password:'government123', icon:Landmark, tint:'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300', name:'Shri Amit Singh, IAS' },
    { label:'University', email:'university@samadhanhub.gov.in', password:'university123', icon:GraduationCap, tint:'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300', name:'Prof. Anita Desai' },
    { label:'Industry', email:'industry@samadhanhub.gov.in', password:'industry123', icon:Building2, tint:'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300', name:'Vikram Mehta' },
    { label:'Citizen', email:'citizen@samadhanhub.gov.in', password:'citizen123', icon:Users, tint:'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300', name:'Priya Sharma' },
  ];

  return (
    <div className="min-h-[85vh] bg-white dark:bg-[#070A12] flex">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <span className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 grid place-items-center font-bold">S</span>
            <span className="font-bold tracking-tight">SamadhanHub</span>
            <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px]">BETA</Badge>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1.5">Sign in to continue to your workspace</p>

          <Card className="mt-6 rounded-[20px] border-slate-200 dark:border-white/10 shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm p-3 border border-red-200 dark:border-red-900/50">{error}</div>}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required className="h-11 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input type={showPassword?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required className="h-11 pr-11 rounded-full" />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center text-slate-500 hover:text-slate-900">{showPassword? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-semibold">
                  {loading?'Signing in...':'Sign in'} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-500">No account? <Link href="/challenges/submit" className="font-medium text-slate-900 dark:text-white hover:underline">Submit a Challenge</Link></p>
            </CardContent>
          </Card>

          <Card className="mt-6 rounded-[20px] border-amber-200/60 dark:border-amber-900/30 bg-amber-50/60 dark:bg-amber-950/10">
            <CardHeader className="pb-2 pt-4 px-5"><CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-300"><Sparkles className="h-3.5 w-3.5" /> Demo accounts — click to autofill</CardTitle></CardHeader>
            <CardContent className="pt-0 px-3 pb-3">
              <div className="grid grid-cols-1 gap-1.5">
                {demoAccounts.map(acc=>{
                  const Icon=acc.icon;
                  return <button key={acc.email} onClick={()=>{setEmail(acc.email);setPassword(acc.password)}} className="flex items-center gap-3 p-2.5 rounded-2xl border border-transparent hover:border-amber-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5 text-left transition-colors">
                    <span className={`h-8 w-8 rounded-xl grid place-items-center ${acc.tint}`}><Icon className="h-4 w-4" /></span>
                    <span className="flex-1 min-w-0"><span className="text-xs font-semibold block leading-none">{acc.name}</span><span className="text-[11px] text-slate-500 truncate block">{acc.email}</span></span>
                    <Badge variant="outline" className="rounded-full text-[10px] shrink-0">{acc.label}</Badge>
                  </button>
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 dark:bg-[#0F1420] text-white p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/15 to-amber-500/10" />
        <div className="absolute -top-20 -right-20 h-96 w-96 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="relative flex flex-col justify-between w-full max-w-md mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Live — 156 challenges · 425K impacted</div>
            <blockquote className="mt-8 text-2xl font-semibold leading-tight tracking-tight">
              <Quote className="h-6 w-6 text-white/20 mb-3" />
              &ldquo;SamadhanHub helped our lab ship a pilot in 8 weeks that we&apos;d been discussing for 2 years.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center font-bold">A</div>
              <div><div className="text-sm font-semibold">Prof. Anita Desai</div><div className="text-xs text-white/60">IIT Bombay · Water Quality Pilot</div></div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4">
            <div className="text-xs font-semibold tracking-widest uppercase text-white/60">Why teams love it</div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/80">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> AI matches you to the right challenge in hours, not months.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> Built-in workspace — milestones, mentors, and funding in one place.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> Government-verified pipeline to real pilots and measured impact.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
