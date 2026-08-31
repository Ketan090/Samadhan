'use client';
import React from 'react';
import Link from 'next/link';
import { Globe, Twitter, Linkedin, Mail, MapPin, ArrowUpRight, Github, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#070A12]">
      <div className="container py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">S</span>
              <span className="text-xl font-bold tracking-tight">SamadhanHub</span>
              <span className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold px-2 py-0.5">BETA</span>
            </Link>
            <p className="text-[14px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-md">
              The modern platform where communities, universities and industry co-create solutions to India&apos;s most pressing challenges. Open, transparent, and built for real-world impact.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 px-3 py-1 text-xs font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems operational</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1 text-xs font-medium"><Sparkles className="h-3 w-3 text-amber-500" /> 425K+ impacted</span>
            </div>
            <div className="flex gap-2 pt-2">
              {[
                {Icon: Globe, href:'/', label:'Website'}, {Icon: Twitter, href:'https://x.com', label:'Twitter'},{Icon: Linkedin, href:'https://linkedin.com', label:'LinkedIn'},{Icon: Github, href:'https://github.com/Ketan090/Samadhan', label:'GitHub'},{Icon: Mail, href:'mailto:hello@samadhanhub.in', label:'Email'}
              ].map(({Icon,href,label},i)=>(
                <a key={i} href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title:'Platform', links:[{label:'Explore Challenges',href:'/challenges'},{label:'Submit Challenge',href:'/challenges/submit'},{label:'Collaboration Hub',href:'/collaborate'},{label:'Interactive Map',href:'/challenges/map'},{label:'Impact Dashboard',href:'/impact'}]},
              { title:'Ecosystem', links:[{label:'University Portal',href:'/university'},{label:'Industry Portal',href:'/industry'},{label:'Government Portal',href:'/government'},{label:'Solutions',href:'/solutions'},{label:'Search',href:'/search'}]},
              { title:'Resources', links:[{label:'About',href:'/about'},{label:'All Challenges',href:'/challenges'},{label:'Support',href:'mailto:hello@samadhanhub.in'},{label:'Privacy',href:'/about'},{label:'Terms',href:'/about'}]},
            ].map(col=>(
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l=>(
                    <li key={l.label}><Link href={l.href} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors inline-flex items-center gap-1 group">{l.label}<ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 transition-all" /></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 px-5 py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2026 SamadhanHub · Built for India, with communities.</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2.5 py-1 font-medium">Demo data — not affiliated</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400"><MapPin className="h-3 w-3" /> Ramtek, Nagpur, Maharashtra</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
