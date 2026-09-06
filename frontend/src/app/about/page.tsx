'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Lightbulb, Target, Github, Linkedin, Mail, Globe, ArrowRight, Sparkles, Code2, Rocket, Award, MapPin, Check } from 'lucide-react';

const team = [
  { name: 'Ketan Mahajan', role: 'Lead Developer & Founder', focus: 'Full Stack • Product Vision', initial: 'KM', color: '#7c3aed' },
  { name: 'BharatBytes Team', role: 'Core Engineering Team', focus: 'Design • Engineering • Impact', initial: 'BB', color: '#2563eb' },
];

const values = [
  { icon: Lightbulb, title: 'Real Problems First', desc: 'Every challenge is geo-tagged, verified and rooted in community needs across India.' },
  { icon: Users, title: 'Collective Intelligence', desc: 'Universities + Industry + Government + Citizens co-create fundable solutions.' },
  { icon: Target, title: 'Measurable Impact', desc: 'From prototype to pilot — tracked live on dashboards with lives impacted.' },
  { icon: Code2, title: 'Open & Modern', desc: 'Next.js 14, TypeScript, Tailwind — built for speed, scale and accessibility.' },
];

const colors = ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="relative overflow-x-hidden border-b border-slate-200/60 dark:border-white/5 bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#0F1420] dark:via-[#070A12] dark:to-[#070A12]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="container relative py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 gap-1.5 px-3 py-1 text-xs"><Sparkles className="h-3 w-3" /> About SamadhanHub</Badge>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] text-slate-900 dark:text-white overflow-visible">
                Built by <span className="inline-block whitespace-nowrap pr-2 pb-2 -mb-1 bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 dark:from-violet-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent overflow-visible">Ketan Mahajan</span><br />& Team BharatBytes
              </h1>
              <p className="mt-4 text-[15px] sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl">
                SamadhanHub is a national platform to crowdsource societal challenges and turn them into shipped, fundable solutions through university + industry collaboration. Made with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> for India.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <Link href="/challenges"><Button className="rounded-full h-10 sm:h-11 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">Explore Challenges <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                <Link href="/challenges/submit"><Button variant="outline" className="rounded-full h-10 sm:h-11 px-6 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10">Submit a Complaint</Button></Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 px-3 py-1.5 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Open & community-driven</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1.5 font-medium"><MapPin className="h-3 w-3" /> Ramtek, Nagpur</span>
              </div>
            </div>
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 sm:p-6 shadow-xl shadow-slate-200/40 dark:shadow-black/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{background: '#7c3aed'}}>BB</div>
                  <div><div className="text-sm font-bold leading-none">BharatBytes</div><div className="text-xs text-slate-500">Crafting for Bharat</div></div>
                  <Badge className="ml-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px]">TEAM</Badge>
                </div>
                <div className="space-y-3">
                  {team.map((m, i) => (
                    <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0" style={{background: m.color}}>{m.initial}</div>
                      <div className="min-w-0 flex-1"><div className="text-sm font-bold leading-none truncate">{m.name}</div><div className="text-xs text-slate-500 truncate">{m.role}</div><div className="text-[11px] text-slate-400 truncate">{m.focus}</div></div>
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[{v:'156',l:'Challenges'},{v:'67',l:'Collabs'},{v:'425K+',l:'Impact'}].map(s=>(
                    <div key={s.l} className="rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-3"><div className="text-lg font-bold leading-none">{s.v}</div><div className="text-[10px] opacity-70">{s.l}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {values.map((v,i)=>{
            const Icon=v.icon;
            return (
              <div key={v.title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                <div className="h-10 w-10 rounded-xl text-white grid place-items-center shadow-md shrink-0" style={{background: colors[i]}}><Icon className="h-5 w-5 text-white" /></div>
                <div className="mt-3 font-bold text-sm text-slate-900 dark:text-white">{v.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{v.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="container pb-8 sm:pb-10">
        <div className="rounded-[24px] sm:rounded-[28px] border border-slate-200 dark:border-white/10 overflow-hidden grid lg:grid-cols-2">
          <div className="bg-slate-900 dark:bg-[#0F1420] text-white p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-blue-500/20 blur-3xl rounded-full" />
            <Badge className="bg-white/10 text-white border-white/15 text-xs">Our Mission</Badge>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">Real problems.<br/>Collective intelligence.<br/><span className="text-white/60">Measurable impact.</span></h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 max-w-md">We connect communities who face problems with universities who research them and industry who scales them — with government verifying and funding pilots.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-3 py-1.5 text-xs font-semibold"><Rocket className="h-3.5 w-3.5" /> Ship faster</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-medium"><Award className="h-3.5 w-3.5" /> Build for Bharat</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-white/[0.03] p-6 sm:p-8 lg:p-10">
            <h3 className="font-bold text-slate-900 dark:text-white">Meet the maker</h3>
            <div className="mt-4 rounded-2xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-5 flex gap-4">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0" style={{background: '#7c3aed'}}>KM</div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Ketan Mahajan</div>
                <div className="text-xs text-slate-500">Founder • Team BharatBytes</div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Building SamadhanHub to bridge India&apos;s grassroots challenges with academic rigour and industrial scale. Passionate about open platforms that create real-world impact.</p>
                <div className="mt-3 flex gap-2">
                  <a href="mailto:hello@samadhanhub.in" className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"><Mail className="h-4 w-4" /></a>
                  <a href="https://github.com/Ketan090/Samadhan" target="_blank" className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"><Github className="h-4 w-4" /></a>
                  <a href="#" className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"><Linkedin className="h-4 w-4" /></a>
                  <a href="/" className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"><Globe className="h-4 w-4" /></a>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-4 text-center">
              <p className="text-xs font-medium text-slate-500">Want to collaborate or contribute?</p>
              <Link href="/collaborate" className="mt-2 inline-flex"><Button size="sm" className="rounded-full h-8 text-xs bg-slate-900 dark:bg-white dark:text-slate-900">Join Collaboration Hub <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-10">
        <div className="rounded-[24px] bg-slate-900 dark:bg-[#0F1420] dark:border dark:border-white/10 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div><h3 className="text-lg sm:text-xl font-bold tracking-tight">Made with passion for India 🇮🇳</h3><p className="text-xs sm:text-sm text-white/60 dark:text-slate-400 mt-1">© 2026 SamadhanHub • Made by <span className="text-white font-semibold">Ketan Mahajan and his Team BharatBytes</span></p></div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-none"><Button className="w-full sm:w-auto rounded-full bg-white text-slate-900 hover:bg-white/90">Back to Home</Button></Link>
            <Link href="/challenges" className="flex-1 sm:flex-none"><Button variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent">Explore</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
