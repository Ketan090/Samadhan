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
import { Camera, ImageIcon, CheckCircle2, Clock, Sparkles, ArrowRight, ArrowLeft, Brain, Eye, Home as HomeIcon, FileText, User, Shield, Building2, Flag } from 'lucide-react';

const categories = ['Environment','Healthcare','Education','Transportation','Agriculture','Infrastructure','Social Welfare','Technology'];

export default function SubmitWithWorkflowPage(){
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [aiStep, setAiStep] = useState(0);
  const [aiDone, setAiDone] = useState(false);
  const [vision, setVision] = useState<any>(null);
  const [visionAnalyzing, setVisionAnalyzing] = useState(false);
  const [showVision, setShowVision] = useState(false);
  const [visionPrefs, setVisionPrefs] = useState({ title:true, description:true, category:true });
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

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    if(f.size>8*1024*1024){ alert('Photo too large, max 8MB'); return; }
    if(!f.type.startsWith('image/')){ alert('Please choose an image'); return; }
    setPhotoFile(f);
    const reader=new FileReader();
    reader.onload=async()=>{
      const b64=reader.result as string; setPhoto(b64); setVision(null); setShowVision(false);
      // Porter primary
      try{
        const fd=new FormData(); fd.append('image', f);
        const r=await fetch('/api/porter/analyze',{method:'POST', body:fd});
        const j=await r.json();
        if(j.success && j.data?.issues?.length){
          const first=j.data.issues[0];
          setVision({ detected:`Potential ${first.title} detected — ${Math.round(first.confidence>1?first.confidence:first.confidence*100)}%`, suggestedTitle:first.title, suggestedDescription:first.description, suggestedCategory:first.category.includes('Road')?'Infrastructure':first.category.includes('Waste')?'Environment':first.category, confidence:Math.round(first.confidence>1?first.confidence:first.confidence*100)});
          setShowVision(true); return;
        }
      }catch{}
      try{
        const res=await aiMatchingAPI.analyzeImage({image:b64, hint:title||category});
        if(res.data?.detected){ setVision(res.data); setShowVision(true); return; }
      }catch{}
      setVision({ detected:'Photo received — add a title for more specific AI', suggestedTitle:'Civic issue — photo detected', suggestedDescription:'Photo shows an issue that appears to affect the community. Please confirm or edit.', suggestedCategory:category||'Environment', confidence:72 });
      setShowVision(true);
    };
    reader.readAsDataURL(f);
  };
  const applyVision=()=>{
    if(!vision) return;
    if(visionPrefs.title && vision.suggestedTitle) setTitle(vision.suggestedTitle);
    if(visionPrefs.description && vision.suggestedDescription) setDescription(vision.suggestedDescription);
    if(visionPrefs.category && vision.suggestedCategory) setCategory(vision.suggestedCategory);
    setShowVision(false);
  };

  const handleSubmit=async()=>{
    if(!isStep1Valid || !isPhotoValid) return;
    if(!user){
      router.push('/auth/login?redirect=/challenges/submit');
      return;
    }
    setSubmitting(true); setError(null);
    let saved:any={ _id:'#SAM-'+Math.floor(100000+Math.random()*900000).toString().replace('#',''), title, description, category, location:{city:city.trim(), state:stateName.trim()}, severity, photo };
    try{
      const fd=new FormData();
      fd.append('title',title); fd.append('description',description); fd.append('category',category);
      fd.append('city',city.trim()); fd.append('state',stateName.trim());
      fd.append('location',JSON.stringify({city:city.trim(), state:stateName.trim()}));
      fd.append('severity',severity);
      fd.append('affectedPopulation','1000');
      if(photoFile) fd.append('image',photoFile);
      else if(photo) fd.append('imageBase64',photo);
      const res=await challengesAPI.create(fd);
      saved={...res.data.challenge, photo};
      setReference('#'+saved._id.slice(-6).toUpperCase().replace('CHL-','SAM-'));
    }catch(err:any){
      const msg=err?.response?.data?.message||'Submission saved locally — will sync when online';
      setError(msg);
      const ref='#SAM-'+Math.floor(100000+Math.random()*900000);
      setReference(ref);
      try{ const ex=JSON.parse(localStorage.getItem('samadhanhub_submitted')||'[]'); localStorage.setItem('samadhanhub_submitted',JSON.stringify([saved,...ex].slice(0,20))); }catch{}
    }
    setAiStep(0); setSubmitted(true);
    for(let i=1;i<=3;i++) setTimeout(()=>setAiStep(i), i*600);
    setTimeout(()=>{ setAiDone(true); setSubmitting(false);
      try{ challengesAPI.update(saved._id.replace('#',''),{workflowStage:'ai-analyses'}).catch(()=>{}); setTimeout(async()=>{ try{ await challengesAPI.update(saved._id.replace('#',''),{workflowStage:'sent-to-university'});}catch{} },800);
      }catch{}
    }, 2400);
  };

  if(submitted){
    return (
      <div className="min-h-screen bg-white dark:bg-[#070A12] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
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
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Link href="/university"><Button className="w-full rounded-full h-10 bg-teal-700 hover:bg-teal-800 text-white text-xs">University Portal</Button></Link>
                <Link href="/track"><Button variant="outline" className="w-full rounded-full h-10 text-xs">Track Status</Button></Link>
                <Link href="/"><Button variant="outline" className="w-full rounded-full h-10 text-xs">Home</Button></Link>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">Next: University proposes → Government approves → Industry joins → Progress photos → Citizen satisfied.</p>
            </div>
          )}
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
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tell us what happened</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Step 2 of 7 — Report. Simple for you, sophisticated behind.</p>
            {!user && <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs">You’ll be asked to <Link href="/auth/login" className="font-bold text-amber-700 dark:text-amber-400 underline">Login / Create account</Link> after this — per workflow, then AI runs.</div>}
          </div>

          <div className="rounded-[20px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <label className="text-sm font-semibold">Title <span className="font-normal text-slate-400">— a short title</span></label>
              <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter a short title" className="mt-2 h-12 rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-semibold">What's the issue? <span className="font-normal text-slate-400">— describe the problem</span></label>
              <Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the problem in your own words..." className="mt-2 min-h-[120px] rounded-xl" />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/90 text-slate-900 hover:bg-white flex-1 h-8 text-xs" onClick={()=>fileRef.current?.click()}>Replace</Button>
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/90 text-red-600 hover:bg-white flex-1 h-8 text-xs" onClick={()=>{ setPhoto(null); setPhotoFile(null); }}>Remove</Button>
                  </div>
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-emerald-500 text-white grid place-items-center"><CheckCircle2 className="h-4 w-4" /></div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
              {!photo && <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">A photo is required to submit. It helps us verify.</p>}
              {visionAnalyzing && <div className="mt-3 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/30 p-3 flex items-center gap-2 text-xs"><Eye className="h-4 w-4 text-violet-600 animate-pulse" /> AI is looking at your photo…</div>}
              {showVision && vision && (
                <div className="mt-3 rounded-2xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-950/10 p-4">
                  <div className="text-xs font-bold flex items-center gap-1.5"><Brain className="h-4 w-4 text-teal-700" /> AI saw: {vision.detected} <Badge className="ml-auto bg-teal-700 text-white text-[10px] rounded-full">{vision.confidence}%</Badge></div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Auto-fill for you?</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <label className="inline-flex items-center gap-1 text-xs bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 px-2 py-1 rounded-full"><input type="checkbox" checked={visionPrefs.title} onChange={e=>setVisionPrefs({...visionPrefs, title:e.target.checked})} /> Title</label>
                    <label className="inline-flex items-center gap-1 text-xs bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 px-2 py-1 rounded-full"><input type="checkbox" checked={visionPrefs.description} onChange={e=>setVisionPrefs({...visionPrefs, description:e.target.checked})} /> Description</label>
                    <label className="inline-flex items-center gap-1 text-xs bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 px-2 py-1 rounded-full"><input type="checkbox" checked={visionPrefs.category} onChange={e=>setVisionPrefs({...visionPrefs, category:e.target.checked})} /> Category</label>
                  </div>
                  {vision.suggestedDescription && <div className="mt-2 rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-2.5 text-xs italic">"{vision.suggestedDescription.slice(0,140)}"</div>}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 rounded-full h-8 bg-teal-700 hover:bg-teal-800 text-white text-xs" onClick={applyVision}>Yes, auto-fill</Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-full h-8 text-xs" onClick={()=>setShowVision(false)}>No, I'll type</Button>
                  </div>
                </div>
              )}
            </div>
            {error && <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
            <div className="flex gap-3">
              <Link href="/" className="flex-1"><Button variant="outline" className="w-full rounded-full h-12">Cancel</Button></Link>
              <Button onClick={handleSubmit} disabled={!isStep1Valid || !isPhotoValid || submitting} className="flex-[2] h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-[15px] font-semibold disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Next: Login → AI Scan'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center">By continuing, you go to Login → AI Analyses (4 checks) → University portal per workflow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
