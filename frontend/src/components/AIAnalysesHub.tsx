'use client';
import { Filter, Eye, Camera, Lightbulb } from 'lucide-react';

export default function AIAnalysesHub({ active = false }: { active?: boolean }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto py-8">
      <div className="grid grid-cols-3 gap-4 items-start">
        <div className="space-y-4">
          <div className={`rounded-xl border-2 bg-white dark:bg-[#0F1420] p-4 text-center shadow-sm transition-all ${active ? 'border-violet-500 shadow-violet-200 scale-[1.02]' : 'border-slate-200 dark:border-white/10'}`}>
            <div className="text-[11px] font-bold tracking-widest text-violet-600 dark:text-violet-400">1. PHOTO</div>
            <div className="text-xs font-bold mt-1">DE-DUPLICATION</div>
            <div className="flex justify-center gap-1 mt-2"><div className="h-8 w-6 rounded border border-slate-200 bg-slate-100" /><div className="h-8 w-6 rounded border border-slate-200 bg-slate-100" /><Filter className="h-4 w-4 text-slate-400 self-center" /></div>
          </div>
          <div className={`rounded-xl border-2 bg-white dark:bg-[#0F1420] p-4 text-center shadow-sm transition-all ${active ? 'border-blue-500 shadow-blue-200 scale-[1.02]' : 'border-slate-200 dark:border-white/10'}`}>
            <div className="text-[11px] font-bold tracking-widest text-blue-600 dark:text-blue-400">4. AI-MATCHING</div>
            <div className="text-xs font-bold mt-1">WITH UNIVERSITIES</div>
            <div className="flex justify-center items-center gap-1 mt-2"><div className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">🏛️</div><Lightbulb className="h-4 w-4 text-amber-500" /></div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-full rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white p-5 text-center shadow-xl transition-all ${active ? 'scale-105 shadow-2xl animate-pulse' : ''}`}>
            <div className="flex justify-center mb-2"><div className="h-12 w-12 rounded-xl bg-white/15 grid place-items-center"><div className="h-8 w-8 rounded-lg bg-white text-violet-600 grid place-items-center">🧠</div></div></div>
            <div className="text-xs font-bold tracking-widest">AI ANALYSES</div>
            <div className="h-1 w-full bg-white/20 rounded-full mt-3 overflow-hidden"><div className={`h-1 bg-white rounded-full transition-all duration-1000 ${active ? 'w-full' : 'w-1/3'}`} /></div>
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-300 dark:bg-white/10 my-1" />
          <div className="hidden sm:block text-[10px] font-bold tracking-widest text-slate-400">FILTER</div>
        </div>

        <div className="space-y-4">
          <div className={`rounded-xl border-2 bg-white dark:bg-[#0F1420] p-4 text-center shadow-sm transition-all ${active ? 'border-emerald-500 shadow-emerald-200 scale-[1.02]' : 'border-slate-200 dark:border-white/10'}`}>
            <div className="text-[11px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400">2. PHOTO</div>
            <div className="text-xs font-bold mt-1">VALIDATION</div>
            <Eye className="h-6 w-6 text-emerald-500 mx-auto mt-2" />
          </div>
          <div className={`rounded-xl border-2 bg-white dark:bg-[#0F1420] p-4 text-center shadow-sm transition-all ${active ? 'border-amber-500 shadow-amber-200 scale-[1.02]' : 'border-slate-200 dark:border-white/10'}`}>
            <div className="text-[11px] font-bold tracking-widest text-amber-600 dark:text-amber-400">3. AUTO-DESCRIPTION</div>
            <div className="text-xs font-bold mt-1">GENERATION</div>
            <div className="flex justify-center items-center gap-1 mt-2"><Camera className="h-5 w-5 text-slate-500" /><div className="h-6 w-10 rounded bg-amber-100 border border-amber-200 grid place-items-center text-[10px]">AI ⭐⭐⭐</div></div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2 text-[11px]">
        <span className={`px-2 py-1 rounded-full font-bold ${active ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>Porter AI</span>
        <span className={`px-2 py-1 rounded-full font-bold ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>LM Studio</span>
        <span className={`px-2 py-1 rounded-full font-bold ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>Gemini</span>
      </div>
    </div>
  );
}
