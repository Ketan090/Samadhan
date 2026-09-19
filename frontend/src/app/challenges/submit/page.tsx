'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { challengesAPI, aiMatchingAPI } from '@/lib/api';
import { getEffectiveStage, setLocalStage } from '@/lib/workflow';
import { Camera, ImageIcon, CheckCircle2, Clock, Sparkles, ArrowRight, ArrowLeft, Brain, Eye, Home as HomeIcon, FileText, User, Shield, Building2, Flag } from 'lucide-react';

const categories = ['Environment','Healthcare','Education','Transportation','Agriculture','Infrastructure','Social Welfare','Technology'];

export default function SubmitWithWorkflowPage(){
  const router = useRouter();
  const { user, loading: authLoading, demoMode } = useAuth();
  const [journeyId, setJourneyId] = useState('');
  const [liveStage, setLiveStage] = useState('sent-to-university');
  const [step, setStep] = useState(1);
  const [draftRestored, setDraftRestored] = useState(false);
  const [photoNeeded, setPhotoNeeded] = useState(false);
  // Restore draft saved before login — per poster: form filled before login, then continue after login by fetching copied part
  React.useEffect(()=>{
    try{
      const raw = localStorage.getItem('samadhanhub_draft_challenge');
      if(raw && user){
        const d = JSON.parse(raw);
        if(d.title) setTitle(d.title);
        if(d.description) setDescription(d.description);
        if(d.category) setCategory(d.category);
        if(d.city) setCity(d.city);
        if(d.stateName) setStateName(d.stateName);
        if(d.severity) setSeverity(d.severity);
        if(Array.isArray(d.tags)) setTags(d.tags.filter((t:any)=>typeof t==='string').map((t:string)=>slugTag(t)).filter(Boolean).slice(0,10));
        if(d.photoMissing && !d.photo) setPhotoNeeded(true);
        if(d.photo) {
          setPhoto(d.photo); if(d.photoFileName) setPhotoFile(null);
          // Re-run AI scan on the restored photo (draft only keeps base64, not the File)
          if (!autoAnalyzedRef.current && !d.title) {
            autoAnalyzedRef.current = true;
            (async () => {
              try {
                const blob = await (await fetch(d.photo)).blob();
                const f = new File([blob], 'restored.jpg', { type: blob.type || 'image/jpeg' });
                setPhotoFile(f);
                analyzePhotoFile(f);
              } catch { /* photo still submittable without AI */ }
            })();
          }
        }
        setDraftRestored(true);
        setTimeout(()=>setDraftRestored(false), 4000);
      }
    } catch{}
  },[user]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navTimer = useRef<any>(null);
  React.useEffect(() => () => { if (navTimer.current) clearTimeout(navTimer.current); }, []);

  // Quota-safe draft save: full photo first, then downscaled, then text-only.
  // Large photos can exceed the ~5MB localStorage quota and previously threw here.
  const storeDraft = async (): Promise<void> => {
    const base = { title, description, category, city, stateName, severity, tags, draftAt: new Date().toISOString() };
    const trySet = (d: any) => { try { localStorage.setItem('samadhanhub_draft_challenge', JSON.stringify(d)); return true; } catch { return false; } };
    if (trySet({ ...base, photo })) return;
    try {
      const src: Blob = photoFile || await (await fetch(photo as string)).blob();
      const bmp = await createImageBitmap(src);
      const scale = Math.min(1, 960 / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bmp.width * scale));
      canvas.height = Math.max(1, Math.round(bmp.height * scale));
      canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      const small: string = await new Promise((res) => canvas.toBlob((b) => {
        const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(b as Blob);
      }, 'image/jpeg', 0.7));
      if (small && trySet({ ...base, photo: small })) return;
    } catch { /* fall through to text-only */ }
    trySet({ ...base, photoMissing: true });
  };
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [aiStep, setAiStep] = useState(0);
  const [aiDone, setAiDone] = useState(false);
  // Live journey: after submit, follow THIS challenge's workflowStage till
  // Complete — the flow continues here instead of redirecting to portals.
  React.useEffect(() => {
    if (!submitted || !aiDone || !journeyId) return;
    let stop = false;
    const tick = async () => {
      try {
        const r = await challengesAPI.getById(String(journeyId).replace('#', ''));
        if (!stop) setLiveStage(getEffectiveStage(journeyId, r.data?.challenge?.workflowStage));
      } catch {
        try { if (!stop) setLiveStage(getEffectiveStage(journeyId)); } catch {}
      }
    };
    tick();
    const t = setInterval(tick, 20000);
    return () => { stop = true; clearInterval(t); };
  }, [submitted, aiDone, journeyId]);
  const [vision, setVision] = useState<any>(null);
  const [visionAnalyzing, setVisionAnalyzing] = useState(false);
  const [showVision, setShowVision] = useState(false);
  // Definitive "no civic issue" verdict — blocks submission until a real issue photo is attached
  const [noIssueFound, setNoIssueFound] = useState(false);
  // AI-generated description: shown below the field with Add / Dismiss — never forced in
  const [descSuggestion, setDescSuggestion] = useState<string | null>(null);
  const [showDescSuggest, setShowDescSuggest] = useState(false);
  // AI tags for the identified civic problem — saved with the challenge, searchable later
  const [tags, setTags] = useState<string[]>([]);
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const slugTag = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
  const deriveTags = (d: any): string[] => {
    const out: string[] = [];
    const stop = new Set(['with', 'from', 'area', 'city', 'large', 'small', 'near', 'around', 'civic', 'issue', 'visible', 'shows', 'seen', 'plus', 'this', 'that', 'have', 'general', 'scene']);
    (d.detections || []).forEach((x: any) => { const t = slugTag(String(x.label || '')); if (t && t.length >= 3) out.push(t); });
    if (d.category) { const t = slugTag(String(d.category).split('|')[0]); if (t && t.length >= 3) out.push(t); }
    String(d.problem || '').toLowerCase().split(/[^a-z]+/).forEach((w) => {
      if (w.length > 4 && !stop.has(w) && out.length < 8) { const t = slugTag(w); if (t) out.push(t); }
    });
    return Array.from(new Set(out)).slice(0, 8);
  };
  const mapAiCategory = (aiCat: string, problem: string): string | null => {
    const t = `${aiCat} ${problem}`.toLowerCase();
    if (/waste|garbage|pollution|recycl|sewage|sanitation/.test(t)) return 'Environment';
    if (/traffic|pothole|road|transport|bus|metro|parking/.test(t)) return 'Transportation';
    if (/water|drain|flood|sewer/.test(t)) return 'Infrastructure';
    if (/health|hospital|clinic|disease|medical/.test(t)) return 'Healthcare';
    if (/school|educat|student|teacher|literacy/.test(t)) return 'Education';
    if (/farm|crop|irrigat|agri/.test(t)) return 'Agriculture';
    if (/women|safety|child|elderly|harass/.test(t)) return 'Social Welfare';
    if (/digital|internet|app|software/.test(t)) return 'Technology';
    return null;
  };
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const isStep1Valid = title.trim().length>=6 && description.trim().length>=20 && category && city.trim().length>=2 && stateName.trim().length>=2;
  const isPhotoValid = !!photo;

  const workflow = [
    { key:'welcome', label:'Welcome', icon: HomeIcon, desc:'Landing' },
    { key:'report', label:'Report', icon: FileText, desc:'Register' },
    { key:'login', label:'Login', icon: User, desc:'Account' },
    { key:'ai', label:'AI Scan', icon: Brain, desc:'4 checks' },
    { key:'university', label:'University', icon: Building2, desc:'Sent' },
    { key:'review', label:'Review', icon: Shield, desc:'Gov + Industry' },
    { key:'complete', label:'Complete', icon: Flag, desc:'Satisfied' },
  ];
  const activeWorkflow = !submitted ? 1 : !aiDone ? 3 : 4;

  const [visionRaw, setVisionRaw] = useState<any>(null);
  const [visionError, setVisionError] = useState<string | null>(null);
  const autoAnalyzedRef = useRef(false);
  const analyzePhotoFile = async (f: File) => {
    setVision(null); setVisionRaw(null); setVisionError(null); setShowVision(false); setVisionAnalyzing(true);
    setDescSuggestion(null); setShowDescSuggest(false); setNoIssueFound(false);
    // AI-folder only: POST multipart to /api/vision/analyze (backend port of AI/civic)
    try {
      const fd = new FormData(); fd.append('image', f); fd.append('lang', 'en');
      const r = await fetch('/api/vision/analyze', { method: 'POST', body: fd, signal: AbortSignal.timeout(100000) as any });
      if (r.status === 429) {
        const wait = r.headers.get('retry-after') || '60';
        throw new Error(`AI rate limit — too many requests from your connection. Wait ~${wait}s and retry.`);
      }
      let j: any = null;
      try { j = await r.json(); } catch { throw new Error('AI server unreachable — it may be waking up. Retry in 30s.'); }
      if (j.success && j.data) {
        const d = j.data;
        setVisionRaw(d);
        const firstDet = d.detections?.[0];
        const conf = d.confidence || firstDet?.confidence || 88;
        setVision({ detected: d.isCivic === false ? 'No obvious civic issue detected.' : `Potential ${d.problem} detected — ${conf}% confidence.`, suggestedTitle: firstDet?.label || d.problem, suggestedDescription: d.complaintLetter || d.whatSeen, suggestedCategory: firstDet?.category || d.category, confidence: conf, severity: d.severity, whatSeen: d.whatSeen, evidences: d.evidences, engine: j.engine, model: j.model });
        // No civic issue → submission stays blocked until a real issue photo is attached
        setNoIssueFound(d.isCivic === false);
        // Description is offered ONLY for real civic issues. With no issue,
        // nothing appears in the description box — the "What I see" panel
        // still tells the user what the AI sees.
        const civic = d.isCivic !== false && !/no civic issue/i.test(String(d.problem || ''));
        const gen = civic ? (d.complaintLetter || d.whatSeen || '') : '';
        if (gen && gen.trim().length >= 20) { setDescSuggestion(gen.trim()); setShowDescSuggest(true); }
        // AI tags for the identified civic problem → pre-selected, searchable later
        const sug = deriveTags(d);
        if (sug.length) {
          setAiSuggestedTags(sug);
          setTags((prev) => Array.from(new Set(prev.concat(sug))).slice(0, 10));
        }
        setShowVision(true); setVisionAnalyzing(false); return;
      }
      throw new Error(j.message || 'AI busy — retry in 30s.');
    } catch (err: any) {
      const msg = String(err?.name === 'TimeoutError' || err?.name === 'AbortError' ? 'AI timed out (server may be waking up).' : err?.message || 'AI analysis failed.');
      setVisionError(`${msg} You can still continue — type the title & description manually and submit.`);
      setVisionAnalyzing(false);
    }
  };
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  // Normalize any phone photo to an AI-ready JPEG (downscaled). Throws on
  // undecodable formats (e.g. iPhone HEIC) so we can say so plainly.
  const processImageFile = async (f: File): Promise<File> => {
    const bmp = await createImageBitmap(f).catch(() => { throw new Error('format'); });
    // Token diet: 768px is plenty for detection boxes (~1/2 the image tokens
    // of 1024px) and keeps uploads small so slow networks don't time out.
    const scale = Math.min(1, 768 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', 0.70));
    return new File([blob], f.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  };
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if(!f) return;
    setPhotoNote(null);
    if(!f.type.startsWith('image/') && !/\.(jpe?g|png|webp|heic|heif)$/i.test(f.name)){
      setPhotoNote('Please choose an image file (JPG or PNG).');
      return;
    }
    try {
      const ready = await processImageFile(f);
      if (ready.size > 8 * 1024 * 1024) { setPhotoNote('Photo still too large after compression — try a smaller one.'); return; }
      setPhotoFile(ready);
      const b64 = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error('read'));
        reader.readAsDataURL(ready);
      });
      setPhoto(b64);
      analyzePhotoFile(ready);
    } catch {
      setPhotoNote('This photo format can’t be read here (e.g. iPhone HEIC). Please pick a JPG/PNG from gallery or retake as JPG.');
    }
  };
  const useSuggestedTitle = () => {
    if (!vision?.suggestedTitle) return;
    const t = String(vision.suggestedTitle).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 80);
    if (!title.trim()) setTitle(t);
    else setTitle(`${title.trim()} — ${t}`.slice(0, 120));
  };
  const useSuggestedCategory = () => {
    const m = mapAiCategory(vision?.suggestedCategory || '', visionRaw?.problem || '');
    if (m) setCategory(m);
  };
  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].slice(0, 10)));
  };
  const addCustomTag = () => {
    const t = slugTag(tagInput);
    if (!t || t.length < 2) return;
    setTags((prev) => (prev.includes(t) ? prev : [...prev, t].slice(0, 10)));
    setTagInput('');
  };

  const handleSubmit=async()=>{
    if(!isStep1Valid || !isPhotoValid || noIssueFound) return;
    if(!user){
      // Logged-out: save draft, then MUST reach login — never leave the user staring at a dead button
      setRedirecting(true);
      try { await storeDraft(); } catch { /* navigation still proceeds */ }
      const target = '/auth/login?redirect=/challenges/submit';
      try { await router.push(target); }
      catch { window.location.assign(target); }
      navTimer.current = setTimeout(() => {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/login')) window.location.assign(target);
      }, 1500);
      return;
    }
    setSubmitting(true); setError(null);
    let saved:any={ _id:'#SAM-'+Math.floor(100000+Math.random()*900000).toString().replace('#',''), title, description, category, location:{city:city.trim(), state:stateName.trim()}, severity, photo, tags };
    try{
      const fd=new FormData();
      fd.append('title',title); fd.append('description',description); fd.append('category',category);
      fd.append('city',city.trim()); fd.append('state',stateName.trim());
      fd.append('location',JSON.stringify({city:city.trim(), state:stateName.trim()}));
      fd.append('severity',severity);
      fd.append('affectedPopulation','1000');
      if (tags.length) fd.append('tags', JSON.stringify(tags));
      if(photoFile) fd.append('image',photoFile);
      else if(photo) fd.append('imageBase64',photo);
      const res=await challengesAPI.create(fd);
      saved={...res.data.challenge, photo};
      setReference('#'+saved._id.slice(-6).toUpperCase().replace('CHL-','SAM-'));
      setJourneyId(saved._id || '');
      try { setLocalStage(String(saved._id || ''), 'sent-to-university'); } catch {}
    }catch(err:any){
      const msg=err?.response?.data?.message||'Submission saved locally — will sync when online';
      setError(msg);
      const ref='#SAM-'+Math.floor(100000+Math.random()*900000);
      setReference(ref);
      setJourneyId(saved._id || '');
      try { setLocalStage(String(saved._id || ''), 'sent-to-university'); } catch {}
      try{ const ex=JSON.parse(localStorage.getItem('samadhanhub_submitted')||'[]'); localStorage.setItem('samadhanhub_submitted',JSON.stringify([saved,...ex].slice(0,20))); }catch{}
    }
    setAiStep(0); setSubmitted(true);
    try{ localStorage.removeItem('samadhanhub_draft_challenge'); } catch{}
    for(let i=1;i<=3;i++) setTimeout(()=>setAiStep(i), i*600);
    setTimeout(()=>{ setAiDone(true); setSubmitting(false);
      try{ challengesAPI.update(saved._id.replace('#',''),{workflowStage:'ai-analyses'}).catch(()=>{}); setTimeout(async()=>{ try{ await challengesAPI.update(saved._id.replace('#',''),{workflowStage:'sent-to-university'});}catch{} },800);
      }catch{}
    }, 2400);
  };

  // Persistent top stepper — stays visible above till Complete, states live.
  const trailSteps = [
    { label: 'Welcome', icon: 'H' },
    { label: 'Report', icon: '≡' },
    { label: 'Login', icon: '◐' },
    { label: 'AI Scan', icon: '◎' },
    { label: 'University', icon: '▭' },
    { label: 'Review', icon: '⧉' },
    { label: 'Complete', icon: '⊕' },
  ];
  const trailCur = !aiDone ? 3 : Math.max(4, (() => {
    const s = liveStage;
    return s === 'citizen-satisfied' ? 6 : ['government-approved', 'industry-collaborating', 'progress-photos'].includes(s) ? 5 : ['sent-to-university', 'university-proposed'].includes(s) ? 4 : 3;
  })());
  const trailDone = aiDone && liveStage === 'citizen-satisfied';
  const trailBar = (
    <div className="mb-6">
      <div className="flex items-center gap-1">
        {trailSteps.map((s, i) => {
          const st = (trailDone || i < trailCur) ? 'done' : i === trailCur ? 'active' : 'todo';
          return (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                <div className={`h-1.5 w-full rounded-full ${i <= trailCur ? 'bg-teal-700 dark:bg-teal-600' : 'bg-slate-200 dark:bg-white/10'}`} />
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`h-5 w-5 rounded-full grid place-items-center text-[10px] border shrink-0 ${st === 'active' ? 'bg-teal-700 text-white border-teal-700' : st === 'done' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-400'}`}>{st === 'done' ? '✓' : s.icon}</span>
                  <span className={`text-[11px] hidden sm:inline truncate ${st === 'active' ? 'text-teal-700 dark:text-teal-400 font-bold' : st === 'done' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-400'}`}>{s.label}</span>
                </div>
              </div>
              {i < 6 && <div className="hidden sm:block h-px flex-1 bg-transparent" />}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-3 text-center">Landing → Registration → Login → AI Analyses → University → Government → Industry → Citizen Satisfied</p>
    </div>
  );
  if(submitted){
    return (
      <div className="min-h-screen bg-white dark:bg-[#070A12] p-4 sm:p-6">
        <div className="container max-w-3xl">
          {trailBar}
          <div className="w-full max-w-xl mx-auto">
          {!aiDone ? (
            <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 sm:p-7 shadow-sm text-center">
              <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-teal-600 animate-spin mx-auto" />
              <h2 className="text-lg font-bold mt-4">AI Analyses — 4 checks running</h2>
              <p className="text-xs text-slate-500">Per poster: De-duplication, Validation, Auto-description, AI-matching</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-left">
                {[
                  { label:'1. Photo De-duplication', done: aiStep>=0, icon:'FILTER' },
                  { label:'2. Photo Validation', done: aiStep>=1, icon:'CHECK' },
                  { label:'3. Auto-description', done: aiStep>=2, icon:'AI' },
                  { label:'4. AI-matching', done: aiStep>=3, icon:'MATCH' },
                ].map(s=>(
                  <div key={s.label} className={`rounded-xl border p-2.5 flex items-center gap-2 ${s.done ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30' : 'bg-slate-50 dark:bg-white/[0.03] border-slate-100 dark:border-white/5'}`}>
                    <div className={`h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold ${s.done ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>{s.done ? '✓' : s.icon[0]}</div>
                    <span className={`text-xs font-semibold ${s.done ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-teal-600 rounded-full transition-all duration-700" style={{width:`${(aiStep+1)*25}%`}} /></div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-emerald-200 dark:border-emerald-900/30 bg-white dark:bg-[#0F1420] p-6 sm:p-8 text-center shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><CheckCircle2 className="h-6 w-6" /></div>
              <h1 className="text-xl font-bold mt-4">Complaint submitted — sent to University</h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-1.5 text-sm font-mono font-bold">{reference}</div>
              <div className="mt-4 rounded-2xl border border-violet-200 dark:border-violet-900/30 bg-violet-50/50 dark:bg-violet-950/10 p-3 flex items-center gap-2 text-left">
                <div className="h-8 w-8 rounded-xl bg-violet-600 text-white grid place-items-center shrink-0">✓</div>
                <div className="min-w-0 flex-1"><div className="text-xs font-bold">Challenge Sent to University Portal</div><div className="text-[11px] text-slate-500">Per workflow — university will propose a solution next.</div></div>
              </div>
              {/* Live journey — continues here till Complete instead of redirecting */}
              {(() => {
                const labels = ['Welcome', 'Report', 'Login', 'AI Scan', 'University', 'Review', 'Complete'];
                const stepFor = (s: string) => s === 'citizen-satisfied' ? 6 : ['government-approved', 'industry-collaborating', 'progress-photos'].includes(s) ? 5 : ['sent-to-university', 'university-proposed'].includes(s) ? 4 : 3;
                const cur = Math.max(4, stepFor(liveStage));
                const done = liveStage === 'citizen-satisfied';
                let cap = ['', '', '', '', 'Waiting for a university team to propose a solution.', 'Under government review and pilot.', 'Citizen satisfied — journey complete.'][cur];
                if (cur === 4) {
                  const canPropose = !!user && ['university', 'admin'].includes(user.role);
                  cap += (canPropose || demoMode) ? ' Open the University Portal below to propose.' : ' You will get an alert when a team picks this up.';
                }
                return (
                  <div className="mt-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-4 text-left">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Your challenge journey{done ? ' — complete' : ' — live'}</div>
                    <div className="flex items-start gap-1">
                      {labels.map((l, i) => (
                        <React.Fragment key={l}>
                          <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                            <span className={`h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold shrink-0 ${i < cur || done ? 'bg-teal-700 text-white' : i === cur ? 'bg-teal-700 text-white animate-pulse' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>{i < cur || done ? '✓' : (i + 1)}</span>
                            <span className={`text-[10px] truncate max-w-full ${i <= cur ? 'text-slate-700 dark:text-slate-200 font-semibold' : 'text-slate-400'}`}>{l}</span>
                          </div>
                          {i < 6 && <div className={`h-0.5 flex-1 rounded-full mt-2 ${i < cur ? 'bg-teal-600' : 'bg-slate-200 dark:bg-white/10'}`} />}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">{cap}</p>
                  </div>
                );
              })()}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(demoMode || (user && ['university', 'admin'].includes(user.role))) ? (
                  <Link href="/university"><Button className="w-full rounded-full h-10 bg-teal-700 hover:bg-teal-800 text-white text-xs">University Portal</Button></Link>
                ) : (
                  <div className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-3 h-10 grid place-items-center text-[11px] font-medium text-slate-500">University portal is role-restricted in real mode</div>
                )}
                <Link href="/track"><Button variant="outline" className="w-full rounded-full h-10 text-xs">Track Status</Button></Link>
                <Link href="/"><Button variant="outline" className="w-full rounded-full h-10 text-xs">Home</Button></Link>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">Next: University proposes → Government approves → Industry joins → Progress photos → Citizen satisfied.</p>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container max-w-3xl py-4 sm:py-6">
        <div className="mb-6">
          <div className="flex items-center gap-1">
            {[
              { label:'Welcome', icon:'H', state:'done' },
              { label:'Report', icon:'≡', state:'active' },
              { label:'Login', icon:'◐', state: user ? 'done' : 'todo' },
              { label:'AI Scan', icon:'◎', state:'todo' },
              { label:'University', icon:'▭', state:'todo' },
              { label:'Review', icon:'⧉', state:'todo' },
              { label:'Complete', icon:'⊕', state:'todo' },
            ].map((s,i)=>(
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                  <div className={`h-1.5 w-full rounded-full ${i<=1 ? 'bg-teal-700 dark:bg-teal-600' : 'bg-slate-200 dark:bg-white/10'}`} />
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-5 w-5 rounded-full grid place-items-center text-[10px] border shrink-0 ${s.state==='active' ? 'bg-teal-700 text-white border-teal-700' : s.state==='done' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-400'}`}>{s.icon}</span>
                    <span className={`text-[11px] hidden sm:inline truncate ${s.state==='active' ? 'text-teal-700 dark:text-teal-400 font-bold' : s.state==='done' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                </div>
                {i<6 && <div className="hidden sm:block h-px flex-1 bg-transparent" />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">Landing → Registration → Login → AI Analyses (De-duplication, Validation, Auto-description, AI-matching) → University → Government → Industry → Citizen Satisfied</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {draftRestored && (
            <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-3 flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Draft restored — continuing same form</span>
              <span className="text-slate-500">Your photo & details from before login were pasted back exactly.</span>
              <button onClick={()=>{ localStorage.removeItem('samadhanhub_draft_challenge'); setDraftRestored(false); }} className="ml-auto text-xs underline">Clear</button>
            </div>
          )}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tell us what happened</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Step 2 of 7 — Report. Simple for you, sophisticated behind.</p>
            {!user && <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs">You’ll be asked to <Link href="/auth/login" className="font-bold text-amber-700 dark:text-amber-400 underline">Login / Create account</Link> after this — per workflow, your form is saved and will be restored after login.</div>}
          </div>

          <div className="rounded-[20px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <label className="text-sm font-semibold">Title <span className="font-normal text-slate-400">— a short title</span></label>
              <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter a short title" className="mt-2 h-12 rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-semibold">What's the issue? <span className="font-normal text-slate-400">— describe the problem</span></label>
              <Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the problem in your own words..." className="mt-2 min-h-[120px] rounded-xl" />
              {showDescSuggest && descSuggestion && (
                <div className="mt-2 rounded-xl border-2 border-teal-600/60 bg-teal-50 dark:bg-teal-950/10 p-3">
                  <div className="text-[11px] font-bold text-teal-800 dark:text-teal-300">AI-generated description — add it?</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 italic">"{descSuggestion.slice(0, 280)}{descSuggestion.length > 280 ? '…' : ''}"</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" className="rounded-full h-8 text-xs bg-teal-700 hover:bg-teal-800 text-white" onClick={() => { setDescription((prev) => (prev.trim() ? `${prev.trim()}\n\n${descSuggestion}` : descSuggestion)); setShowDescSuggest(false); }}>Add to description</Button>
                    <Button size="sm" variant="outline" className="rounded-full h-8 text-xs" onClick={() => setShowDescSuggest(false)}>No, I'll type</Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2 h-12 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">City <span className="text-red-500">*</span></label>
                <Input value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Ranchi" className="mt-2 h-12 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-semibold">State <span className="text-red-500">*</span></label>
                <Input value={stateName} onChange={e=>setStateName(e.target.value)} placeholder="e.g. Jharkhand" className="mt-2 h-12 rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Severity</label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="mt-2 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold">Photo evidence <span className="text-red-500">*</span></label>
              <p className="text-xs text-slate-500 mt-1">Add a photo of the issue <span className="text-slate-400">— A photo helps us verify your complaint.</span></p>
              {!photo ? (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button onClick={()=>cameraRef.current?.click()} className="h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-teal-300 flex flex-col items-center justify-center gap-1.5">
                    <Camera className="h-6 w-6 text-slate-500" /><span className="text-xs font-semibold">Take Photo</span>
                  </button>
                  <button onClick={()=>fileRef.current?.click()} className="h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-teal-300 flex flex-col items-center justify-center gap-1.5">
                    <ImageIcon className="h-6 w-6 text-slate-500" /><span className="text-xs font-semibold">Choose from Gallery</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative">
                  <img src={photo} alt="Evidence preview" className="w-full h-56 object-cover" />
                  {showVision && (visionRaw?.detections || []).length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {(visionRaw.detections || []).slice(0, 6).map((det: any, i: number) => {
                        const b = det.box || {};
                        const x = Math.min(96, Math.max(0, Number(b.x) || 0));
                        const y = Math.min(96, Math.max(0, Number(b.y) || 0));
                        const w = Math.min(100 - x, Math.max(4, Number(b.w) || 20));
                        const h = Math.min(100 - y, Math.max(4, Number(b.h) || 20));
                        const colors = ['border-red-500', 'border-amber-400', 'border-emerald-400', 'border-sky-400', 'border-violet-400', 'border-pink-400'];
                        return (
                          <div key={i} className={`absolute border-2 ${colors[i % colors.length]} rounded-md`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
                            <span className="absolute -top-5 left-0 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">{det.label}{det.confidence ? ` ${det.confidence}%` : ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/90 text-slate-900 hover:bg-white flex-1 h-8 text-xs" onClick={()=>fileRef.current?.click()}>Replace</Button>
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/90 text-red-600 hover:bg-white flex-1 h-8 text-xs" onClick={()=>{ setPhoto(null); setPhotoFile(null); setNoIssueFound(false); setShowVision(false); setDescSuggestion(null); setShowDescSuggest(false); setTags([]); }}>Remove</Button>
                  </div>
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-emerald-500 text-white grid place-items-center"><CheckCircle2 className="h-4 w-4" /></div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
              {!photo && <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">A photo is required to submit. It helps us verify.</p>}
              {photoNote && (
                <div className="mt-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs text-amber-700 dark:text-amber-300">{photoNote}</div>
              )}
              {noIssueFound && photo && (
                <div className="mt-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-xs">
                  <span className="font-bold text-red-700 dark:text-red-300">No civic issue found — submission blocked.</span>
                  <span className="text-slate-600 dark:text-slate-400"> This photo shows no civic problem, so it can’t be reported. Please attach a photo showing a real issue (pothole, garbage, flooding, broken footpath…).</span>
                </div>
              )}
              {photoNeeded && !photo && (
                <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">Please re-attach your photo</span>
                  <span className="text-slate-600 dark:text-slate-400"> — it was too large to carry through login. Your text was restored.</span>
                </div>
              )}
              {visionAnalyzing && <div className="mt-3 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/30 p-3 flex items-center gap-2 text-xs"><Eye className="h-4 w-4 text-violet-600 animate-pulse" /> AI is looking at your photo…</div>}
              {visionError && !visionAnalyzing && !showVision && (
                <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs">
                  <div className="font-semibold text-amber-700 dark:text-amber-300">AI scan unavailable</div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{visionError}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full h-8 text-xs" onClick={() => { if (photoFile) analyzePhotoFile(photoFile); }}>Retry AI scan</Button>
                    <Button size="sm" variant="ghost" className="rounded-full h-8 text-xs" onClick={() => setVisionError(null)}>Continue manually</Button>
                  </div>
                </div>
              )}
              {showVision && vision && (
                <div className="mt-3 rounded-2xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-950/10 p-4 space-y-3">
                  <div className="text-xs font-bold flex items-center gap-1.5"><Brain className="h-4 w-4 text-teal-700" /> AI saw: {vision.detected} <Badge className="ml-auto bg-teal-700 text-white text-[10px] rounded-full shrink-0">{vision.confidence}%</Badge></div>
                  {vision.whatSeen && (
                    <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-2.5">
                      <div className="text-[11px] font-bold text-slate-500 mb-0.5">What I see:</div>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{vision.whatSeen}</p>
                      {(vision.evidences || []).length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                          {(vision.evidences || []).slice(0, 3).map((e: string, i: number) => (
                            <li key={i} className="text-[11px] text-slate-500 flex gap-1"><span className="text-teal-600 font-bold">•</span><span>{e}</span></li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {(vision.suggestedTitle || (vision.suggestedCategory && mapAiCategory(vision.suggestedCategory, visionRaw?.problem || ''))) && (
                    <div className="flex flex-wrap gap-1.5">
                      {vision.suggestedTitle && <button onClick={useSuggestedTitle} className="text-[11px] font-semibold bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full hover:border-teal-500">Use title: {String(vision.suggestedTitle).slice(0, 32)}</button>}
                      {vision.suggestedCategory && mapAiCategory(vision.suggestedCategory, visionRaw?.problem || '') && (
                        <button onClick={useSuggestedCategory} className="text-[11px] font-semibold bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full hover:border-teal-500">Use category: {mapAiCategory(vision.suggestedCategory, visionRaw?.problem || '')}</button>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="text-[11px] font-bold text-teal-800 dark:text-teal-300 mb-1.5">AI tags for this problem — saved, searchable later</div>
                    {aiSuggestedTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {aiSuggestedTags.map((t) => (
                          <button key={t} onClick={() => toggleTag(t)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${tags.includes(t) ? 'bg-teal-700 text-white border-teal-700' : 'bg-white dark:bg-[#0F1420] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-teal-500'}`}>
                            #{t} {tags.includes(t) ? '✓' : '+'}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">No tags suggested — add your own below.</p>
                    )}
                    {tags.filter((t) => !aiSuggestedTags.includes(t)).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {tags.filter((t) => !aiSuggestedTags.includes(t)).map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2.5 py-1 rounded-full">#{t}<button onClick={() => toggleTag(t)} className="opacity-70 hover:opacity-100">✕</button></span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-1.5 mt-2">
                      <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }} placeholder="Add your own tag…" className="h-8 rounded-full text-xs" />
                      <Button size="sm" variant="outline" onClick={addCustomTag} className="rounded-full h-8 text-xs shrink-0">Add</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {error && <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
            <div className="flex gap-3">
              <Link href="/" className="flex-1"><Button variant="outline" className="w-full rounded-full h-12">Cancel</Button></Link>
              <Button onClick={handleSubmit} disabled={!isStep1Valid || !isPhotoValid || submitting || redirecting || authLoading || noIssueFound} className="flex-[2] h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-[15px] font-semibold disabled:opacity-50">
                {submitting ? 'Submitting...' : redirecting ? 'Saving… → Login' : authLoading ? 'Checking login…' : 'Next: Login → AI Scan'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {(!isStep1Valid || !isPhotoValid) && !submitting && (
              <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                To continue: {[title.trim().length < 6 && 'title (min 6 chars)', description.trim().length < 20 && 'description (min 20 chars)', !category && 'category', city.trim().length < 2 && 'city', stateName.trim().length < 2 && 'state', !photo && 'photo'].filter(Boolean).join(' · ')} still needed.
              </p>
            )}
            <p className="text-xs text-slate-400 text-center">By continuing, you go to Login → AI Analyses (4 checks) → University portal per workflow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
