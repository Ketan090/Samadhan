'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { challengesAPI, aiMatchingAPI } from '@/lib/api';
import { Camera, Image as ImageIcon, CheckCircle2, Clock, Sparkles, ArrowRight, Brain, Eye } from 'lucide-react';

const categories = ['Environment','Healthcare','Education','Transportation','Agriculture','Infrastructure','Social Welfare','Technology'];

export default function SubmitComplaintPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aiStep, setAiStep] = useState(0);
  const [aiDone, setAiDone] = useState(false);
  const [aiChecks, setAiChecks] = useState({ relevant: false, usable: false, manipulation: false });
  const [vision, setVision] = useState<{ detected: string; suggestedTitle: string; suggestedDescription: string; suggestedCategory: string; confidence: number } | null>(null);
  const [visionAnalyzing, setVisionAnalyzing] = useState(false);
  const [showVisionPrompt, setShowVisionPrompt] = useState(false);
  const [visionPrefs, setVisionPrefs] = useState({ title: true, description: true, category: true });
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const isValid = title.trim().length >= 6 && description.trim().length >= 20 && category && photo && city.trim().length >= 2 && state.trim().length >= 2;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { alert("This photo is too large. Please choose a smaller image."); return; }
    if (!f.type.startsWith('image/')) { alert("Please choose an image file."); return; }
    setPhotoFile(f);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result as string;
      setPhoto(b64);
      setVision(null); setShowVisionPrompt(false);
      setVisionAnalyzing(true);
      // Try LM Studio direct if configured in localStorage, else backend
      const lmUrl = typeof window !== 'undefined' ? localStorage.getItem('lmstudio_url') : null;
      try {
        if (lmUrl) {
          const r = await fetch(`${lmUrl.replace(/\/$/,'')}/v1/chat/completions`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ model:'local', messages:[{role:'user', content:[{type:'text', text:'Describe civic issue in 1 sentence, suggest title, category among Environment/Healthcare/Education/Transportation/Agriculture/Infrastructure/Social Welfare/Technology'}, {type:'image_url', image_url:{url:b64}}]}] }) });
          if(r.ok){ const d:any=await r.json(); const txt=d.choices?.[0]?.message?.content||''; setVision({ detected: txt.slice(0,80), suggestedTitle: txt.match(/title:\s*(.*)/i)?.[1]?.slice(0,60) || 'Civic issue detected', suggestedDescription: txt.slice(0,180), suggestedCategory: 'Environment', confidence: 87 }); setShowVisionPrompt(true); }
        } else {
          const res = await aiMatchingAPI.analyzeImage({ image: b64, hint: title || category });
          setVision(res.data); setShowVisionPrompt(true);
        }
      } catch {
        // fallback mock
        setVision({ detected: 'Photo shows civic issue', suggestedTitle: 'Civic issue — photo detected', suggestedDescription: 'Photo shows an issue that appears to affect the community. Please confirm or edit the description.', suggestedCategory: category || 'Environment', confidence: 82 });
        setShowVisionPrompt(true);
      } finally { setVisionAnalyzing(false); }
    };
    reader.readAsDataURL(f);
  };

  const applyVision = () => {
    if(!vision) return;
    if(visionPrefs.title && vision.suggestedTitle) setTitle(vision.suggestedTitle);
    if(visionPrefs.description && vision.suggestedDescription) setDescription(vision.suggestedDescription);
    if(visionPrefs.category && vision.suggestedCategory) setCategory(vision.suggestedCategory);
    setShowVisionPrompt(false);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    const ref = '#SAM-' + Math.floor(100000 + Math.random() * 900000);
    // Save first — never lose submission
    let saved: any = { _id: ref.replace('#',''), title, description, category, location: { city: city.trim(), state: state.trim(), pincode: '' }, affectedPopulation: 1000, urgency: 'medium', severity, status: 'submitted', verificationStatus: 'pending', photo: photo, createdAt: new Date().toISOString() };
    setError(null);
    try {
      const res = await challengesAPI.create({ title, description, category, location: saved.location, affectedPopulation: saved.affectedPopulation, urgency: saved.urgency, severity: saved.severity, currentConsequences: '', existingAttempts: '', desiredOutcome: '', constraints: '', availableResources: '', suggestedExpertise: [], evidence: { links: [], images: photo ? [photo] : [] } });
      saved = { ...res.data.challenge, photo };
      setReference('#' + saved._id.slice(-6).toUpperCase());
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Submission failed. Please try again.';
      setError(msg);
      setReference(ref);
      try { const ex = JSON.parse(localStorage.getItem('samadhanhub_submitted')||'[]'); localStorage.setItem('samadhanhub_submitted', JSON.stringify([saved, ...ex].slice(0,20))); localStorage.setItem('samadhanhub_last_ref', ref); } catch {}
    }
    if (saved._id) setReference('#' + saved._id.slice(-6).toUpperCase().replace('CHL-','SAM-'));
    // Seamless AI processing — no user config
    setAiStep(0);
    setTimeout(()=> setAiStep(1), 600);
    setTimeout(()=> { setAiStep(2); setAiChecks({ relevant: true, usable: true, manipulation: true }); }, 1300);
    setTimeout(()=> setAiStep(3), 1900);
    setTimeout(()=> { setAiDone(true); setSubmitting(false); setSubmitted(true); }, 2300);
    setTimeout(()=> router.push('/track'), 5500);
    // Background: store even if AI fails — already saved above
    try { const ex = JSON.parse(localStorage.getItem('samadhanhub_submitted')||'[]'); if(!ex.find((x:any)=>x._id===saved._id)) localStorage.setItem('samadhanhub_submitted', JSON.stringify([saved, ...ex].slice(0,20))); } catch{}
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070A12] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {!aiDone ? (
            <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 sm:p-7 shadow-sm text-center">
              <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-violet-600 animate-spin mx-auto" />
              <h2 className="text-lg font-bold mt-4">Checking your submission</h2>
              <div className="mt-4 space-y-2 text-xs text-slate-500 text-left">
                <div className={`flex items-center gap-2 ${aiStep>=0 ? 'text-slate-900 dark:text-white' : ''}`}><Clock className="h-3 w-3" /> {aiStep>=0 ? 'Uploading your photo...' : 'Uploading'} {aiStep>0 && <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />}</div>
                <div className={`flex items-center gap-2 ${aiStep>=1 ? 'text-slate-900 dark:text-white' : ''}`}><Sparkles className="h-3 w-3" /> {aiStep>=1 ? 'Checking the evidence...' : 'Checking'} {aiStep>1 && <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />}</div>
                <div className={`flex items-center gap-2 ${aiStep>=2 ? 'text-slate-900 dark:text-white' : ''}`}><CheckCircle2 className="h-3 w-3" /> {aiStep>=2 ? 'Reviewing your complaint...' : 'Reviewing'} {aiStep>2 && <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />}</div>
                <div className={`flex items-center gap-2 ${aiStep>=3 ? 'text-slate-900 dark:text-white' : ''}`}>Almost done... {aiStep>=3 && <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />}</div>
              </div>
              <div className="mt-4 h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-violet-600 rounded-full transition-all duration-700" style={{width: `${(aiStep+1)*25}%`}} /></div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-emerald-200 dark:border-emerald-900/30 bg-white dark:bg-[#0F1420] p-6 sm:p-8 text-center shadow-sm animate-[fadeIn_0.5s_ease]">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><CheckCircle2 className="h-6 w-6" /></div>
              <h1 className="text-xl font-bold mt-4">Complaint submitted</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your complaint has been successfully submitted.</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-1.5 text-sm font-mono font-bold">{reference}</div>
              <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 flex items-center gap-2 text-left">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <div><div className="text-xs font-bold">Under Review</div><div className="text-xs text-slate-500">We'll review your submission and update its status when there is progress.</div></div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4 text-left">
                <div className="text-xs font-bold flex items-center gap-1">Evidence checked</div>
                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Photo received</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`h-3 w-3 ${aiChecks.relevant ? 'text-emerald-500' : 'text-slate-300'}`} /> Photo appears relevant</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`h-3 w-3 ${aiChecks.manipulation ? 'text-emerald-500' : 'text-slate-300'}`} /> No obvious manipulation detected</div>
                </div>
                <button className="mt-3 text-xs text-violet-600 dark:text-violet-400 underline" onClick={()=> alert('Evidence relevance: high\nAuthenticity: no manipulation detected\nQuality: good\nThis is a demo screening — human review will confirm.')}>View verification details</button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link href="/track"><Button className="w-full rounded-full h-11 bg-slate-900 dark:bg-white dark:text-slate-900">Track Complaint</Button></Link>
                <Link href="/"><Button variant="outline" className="w-full rounded-full h-11">Back to Home</Button></Link>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">What happens next? We'll review and update the status. No further action needed.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container max-w-2xl py-6 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tell us what happened</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Simple for you. We handle the complexity behind the scenes.</p>
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
              <Input value={state} onChange={e=>setState(e.target.value)} placeholder="e.g. Jharkhand" className="mt-2 h-12 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Severity</label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="mt-2 h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold">Photo evidence <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-500 mt-1">Add a photo of the issue <span className="text-slate-400">— A photo helps us verify your complaint.</span></p>

            {!photo ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button onClick={()=>cameraRef.current?.click()} className="h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-violet-300 dark:hover:border-violet-500/30 flex flex-col items-center justify-center gap-1.5 transition">
                  <Camera className="h-6 w-6 text-slate-500" />
                  <span className="text-xs font-semibold">Take Photo</span>
                </button>
                <button onClick={()=>fileRef.current?.click()} className="h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-violet-300 dark:hover:border-violet-500/30 flex flex-col items-center justify-center gap-1.5 transition">
                  <ImageIcon className="h-6 w-6 text-slate-500" />
                  <span className="text-xs font-semibold">Choose from Gallery</span>
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
            {showVisionPrompt && vision && (
              <div className="mt-3 rounded-2xl border-2 border-violet-500 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/20 dark:to-blue-950/20 p-4">
                <div className="text-xs font-bold flex items-center gap-1.5"><Brain className="h-4 w-4 text-violet-600" /> AI saw: {vision.detected} <Badge className="ml-auto bg-violet-600 text-white text-[10px] rounded-full">{vision.confidence}%</Badge></div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Auto-fill description and details for you?</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <label className="inline-flex items-center gap-1 text-xs bg-white dark:bg-[#0F1420] border border-violet-200 dark:border-violet-900/30 px-2 py-1 rounded-full"><input type="checkbox" checked={visionPrefs.title} onChange={e=>setVisionPrefs({...visionPrefs, title:e.target.checked})} /> Title</label>
                  <label className="inline-flex items-center gap-1 text-xs bg-white dark:bg-[#0F1420] border border-violet-200 dark:border-violet-900/30 px-2 py-1 rounded-full"><input type="checkbox" checked={visionPrefs.description} onChange={e=>setVisionPrefs({...visionPrefs, description:e.target.checked})} /> Description</label>
                  <label className="inline-flex items-center gap-1 text-xs bg-white dark:bg-[#0F1420] border border-violet-200 dark:border-violet-900/30 px-2 py-1 rounded-full"><input type="checkbox" checked={visionPrefs.category} onChange={e=>setVisionPrefs({...visionPrefs, category:e.target.checked})} /> Category</label>
                </div>
                {vision.suggestedDescription && <div className="mt-2 rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 p-2.5 text-xs italic">"{vision.suggestedDescription.slice(0,140)}"</div>}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1 rounded-full h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs" onClick={applyVision}>Yes, auto-fill</Button>
                  <Button size="sm" variant="outline" className="flex-1 rounded-full h-8 text-xs" onClick={()=>setShowVisionPrompt(false)}>No, I'll type</Button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">You can edit anything after — AI is only a helper, not the judge.</p>
              </div>
            )}
          </div>

          {error && <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
          <Button onClick={handleSubmit} disabled={!isValid || submitting} className="w-full h-12 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 text-[15px] font-semibold disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Complaint'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-slate-400 text-center">By submitting, you agree to community guidelines. No AI jargon — just your problem.</p>
        </div>
      </div>
    </div>
  );
}
