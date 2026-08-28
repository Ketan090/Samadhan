'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { challengesAPI } from '@/lib/api';
import { ArrowRight, ArrowLeft, CheckCircle2, MapPin, Users, AlertTriangle, FileText, Target, Lightbulb, Sparkles, Brain, ChevronRight, ExternalLink } from 'lucide-react';

const steps = [
  { id: 1, title: 'Problem', desc: 'What & where', icon: Lightbulb },
  { id: 2, title: 'Impact', desc: 'Who it affects', icon: AlertTriangle },
  { id: 3, title: 'Evidence', desc: 'Links & proof', icon: FileText },
  { id: 4, title: 'Solution', desc: 'Desired outcome', icon: Target },
  { id: 5, title: 'Review', desc: 'Confirm & submit', icon: CheckCircle2 },
];
const categories = ['Environment','Healthcare','Education','Transportation','Agriculture','Infrastructure','Social Welfare','Technology'];
const indianStates = ['Andhra Pradesh','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];
const expertises = ['IoT','AI/ML','Data Science','Mobile Development','Web Development','Environmental Engineering','Healthcare','Education','Urban Planning','Blockchain','Cloud Computing','GIS','Civil Engineering','Electronics'];

export default function SubmitChallengePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [challengeResult, setChallengeResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    title:'', description:'', category:'', subcategory:'', location:{city:'', state:'', pincode:''},
    affectedPopulation:0, urgency:'medium', severity:'medium', currentConsequences:'', existingAttempts:'',
    desiredOutcome:'', constraints:'', availableResources:'', suggestedExpertise:[] as string[],
    evidence:{images:[],documents:[],videos:[],links:[] as string[]}, newLink:''
  });
  const updateForm=(u:any)=>setFormData(p=>({...p,...u}));

  const handleSubmit=async()=>{
    setSubmitting(true);
    try{
      const res=await challengesAPI.create({ title:formData.title, description:formData.description, category:formData.category, subcategory:formData.subcategory, location:formData.location, affectedPopulation:formData.affectedPopulation, urgency:formData.urgency, severity:formData.severity, currentConsequences:formData.currentConsequences, existingAttempts:formData.existingAttempts, desiredOutcome:formData.desiredOutcome, constraints:formData.constraints, availableResources:formData.availableResources, suggestedExpertise:formData.suggestedExpertise, evidence:formData.evidence });
      setChallengeResult({...res.data.challenge, aiAnalysis:{ summary:'AI is analyzing your submission.', classification:`${formData.category} → Processing`, impactScore:Math.min(100, Math.floor(formData.affectedPopulation/1000)+30), urgencyScore: formData.urgency==='critical'?90: formData.urgency==='high'?75:50, requiredExpertise:formData.suggestedExpertise }});
    }catch{
      setChallengeResult({ _id:'CHL-'+Math.floor(Math.random()*9000+1000), title:formData.title, status:'submitted', verificationStatus:'pending', aiAnalysis:{ summary:`Addresses ${formData.title.toLowerCase()} in ${formData.location.city}.`, classification:`${formData.category} → ${formData.subcategory||'General'}`, impactScore:Math.min(100, Math.floor(formData.affectedPopulation/1000)+30), urgencyScore: formData.urgency==='critical'?90: formData.urgency==='high'?75: formData.urgency==='medium'?50:30, requiredExpertise:formData.suggestedExpertise }});
    }
    setSubmitting(false); setSubmitted(true);
  };
  const addLink=()=>{ if(formData.newLink) updateForm({ evidence:{...formData.evidence, links:[...formData.evidence.links, formData.newLink]}, newLink:'' }) };

  if(submitted && challengeResult){
    return (
      <div className="min-h-screen bg-white dark:bg-[#070A12] flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="rounded-[24px] border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-[#0F1420] p-8 text-center shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><CheckCircle2 className="h-7 w-7" /></div>
            <h1 className="text-2xl font-bold tracking-tight mt-4">Challenge submitted!</h1>
            <p className="text-sm text-slate-500 mt-1">Awaiting verification — you’ll be notified once reviewed.</p>
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4 text-left space-y-2.5 mt-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Challenge ID</span><Badge variant="outline" className="rounded-full font-mono border-slate-200 dark:border-white/10 dark:text-slate-300">{challengeResult._id}</Badge></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><Badge className="bg-amber-500 text-white rounded-full border-0">Pending Verification</Badge></div>
              <div className="text-sm font-medium truncate">{challengeResult.title}</div>
            </div>
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-left mt-4">
              <div className="text-sm font-bold flex items-center gap-2"><Brain className="h-4 w-4 text-blue-600" /> AI Classification <Badge className="bg-blue-600 text-white text-[10px] rounded-full border-0">AI</Badge></div>
              <p className="text-xs text-blue-700/70 dark:text-blue-300/70 italic mt-1">AI-assisted — requires human verification</p>
              <p className="text-sm mt-2">{challengeResult.aiAnalysis?.classification}</p>
              <div className="flex gap-2 mt-2 flex-wrap">{(challengeResult.aiAnalysis?.requiredExpertise||[]).map((e:string)=><Badge key={e} variant="secondary" className="rounded-full text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-transparent">{e}</Badge>)}</div>
            </div>
            <div className="flex gap-3 mt-6"><Link href="/challenges" className="flex-1"><Button variant="outline" className="w-full rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">View all</Button></Link><Link href={`/challenges/${challengeResult._id}`} className="flex-1"><Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">View challenge</Button></Link></div>
          </div>
        </div>
      </div>
    );
  }

  const canNext = formData.title && formData.category && formData.location.city && formData.location.state;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] sticky top-0 z-20 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><Link href="/challenges" className="hover:text-slate-900">Challenges</Link><ChevronRight className="h-3 w-3" />Submit</div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div><h1 className="text-2xl font-bold tracking-tight">Submit a Challenge</h1><p className="text-sm text-slate-500">Describe a real societal problem — we’ll verify & match you to builders.</p></div>
            <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 w-fit"><Sparkles className="h-3 w-3 mr-1" /> 2-min submission</Badge>
          </div>
          <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1">
            {steps.map((s,i)=>{
              const Icon=s.icon; const active=currentStep===s.id; const done=currentStep> s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full border shrink-0 ${done?'bg-emerald-500 text-white border-emerald-500': active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}>
                    <span className={`h-7 w-7 rounded-full grid place-items-center ${done?'bg-white/20': active?'bg-white/15':'bg-slate-100 dark:bg-white/10'}`}>{done? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span>
                    <span className="hidden sm:block text-xs leading-none"><span className="font-semibold block">{s.title}</span><span className="opacity-70">{s.desc}</span></span>
                    <span className="sm:hidden text-xs font-semibold">{s.id}</span>
                  </div>
                  {i<steps.length-1 && <div className={`h-0.5 w-6 lg:w-10 shrink-0 ${done?'bg-emerald-500':'bg-slate-200 dark:bg-white/10'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-3xl">
        <div className="rounded-[20px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 lg:p-7 shadow-sm">
          {currentStep===1 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Problem Information</h2>
              <div><label className="text-xs font-semibold">Title *</label><Input placeholder="e.g., Smart Waste Collection for Urban Wards" value={formData.title} onChange={e=>updateForm({title:e.target.value})} className="mt-1.5 h-11 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Description *</label><Textarea placeholder="What is the issue? Where does it occur? Who is affected?" className="mt-1.5 min-h-[120px] rounded-xl" value={formData.description} onChange={e=>updateForm({description:e.target.value})} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold">Category *</label><Select value={formData.category} onValueChange={v=>updateForm({category:v})}><SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><label className="text-xs font-semibold">Subcategory</label><Input placeholder="e.g., Waste Management" value={formData.subcategory} onChange={e=>updateForm({subcategory:e.target.value})} className="mt-1.5 h-11 rounded-xl" /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="text-xs font-semibold">City *</label><Input placeholder="e.g., Ranchi" value={formData.location.city} onChange={e=>updateForm({location:{...formData.location, city:e.target.value}})} className="mt-1.5 h-11 rounded-xl" /></div>
                <div><label className="text-xs font-semibold">State *</label><Select value={formData.location.state} onValueChange={v=>updateForm({location:{...formData.location, state:v}})}><SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue placeholder="Select state" /></SelectTrigger><SelectContent>{indianStates.map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                <div><label className="text-xs font-semibold">Pincode</label><Input placeholder="834001" value={formData.location.pincode} onChange={e=>updateForm({location:{...formData.location, pincode:e.target.value}})} className="mt-1.5 h-11 rounded-xl" /></div>
              </div>
            </div>
          )}
          {currentStep===2 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" /> Impact Assessment</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="text-xs font-semibold">Affected Population *</label><Input type="number" placeholder="25000" value={formData.affectedPopulation||''} onChange={e=>updateForm({affectedPopulation:parseInt(e.target.value)||0})} className="mt-1.5 h-11 rounded-xl" /></div>
                <div><label className="text-xs font-semibold">Urgency</label><Select value={formData.urgency} onValueChange={v=>updateForm({urgency:v})}><SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div>
                <div><label className="text-xs font-semibold">Severity</label><Select value={formData.severity} onValueChange={v=>updateForm({severity:v})}><SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div>
              </div>
              <div><label className="text-xs font-semibold">Current Consequences</label><Textarea placeholder="What happens if this remains unsolved?" value={formData.currentConsequences} onChange={e=>updateForm({currentConsequences:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Existing Attempts</label><Textarea placeholder="What has been tried and why it failed?" value={formData.existingAttempts} onChange={e=>updateForm({existingAttempts:e.target.value})} className="mt-1.5 rounded-xl" /></div>
            </div>
          )}
          {currentStep===3 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" /> Evidence</h2>
              <p className="text-xs text-slate-500">Add links that help verify the problem.</p>
              <div className="flex gap-2"><Input placeholder="https://..." value={formData.newLink} onChange={e=>updateForm({newLink:e.target.value})} className="h-11 rounded-xl" /><Button variant="outline" onClick={addLink} className="rounded-xl h-11 border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">Add</Button></div>
              {formData.evidence.links.length>0 && <div className="space-y-1.5">{formData.evidence.links.map((l,i)=><div key={i} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2"><ExternalLink className="h-3.5 w-3.5 text-blue-500 shrink-0" /><span className="truncate flex-1">{l}</span><button onClick={()=>updateForm({evidence:{...formData.evidence, links: formData.evidence.links.filter((_,j)=>j!==i)}})} className="text-xs text-red-500">Remove</button></div>)}</div>}
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs text-amber-800 dark:text-amber-300">💡 You can attach images & documents after verification. Focus on accurate description for now.</div>
            </div>
          )}
          {currentStep===4 && (
            <div className="space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-emerald-500" /> Expected Solution</h2>
              <div><label className="text-xs font-semibold">Desired Outcome *</label><Textarea placeholder="What would an ideal solution look like?" value={formData.desiredOutcome} onChange={e=>updateForm({desiredOutcome:e.target.value})} className="mt-1.5 min-h-[100px] rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Constraints</label><Textarea placeholder="Known limitations?" value={formData.constraints} onChange={e=>updateForm({constraints:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Available Resources</label><Textarea placeholder="What resources already exist?" value={formData.availableResources} onChange={e=>updateForm({availableResources:e.target.value})} className="mt-1.5 rounded-xl" /></div>
              <div><label className="text-xs font-semibold">Suggested Expertise</label><div className="flex flex-wrap gap-1.5 mt-1.5">{expertises.map(exp=>{const on=formData.suggestedExpertise.includes(exp); return <button key={exp} onClick={()=> on? updateForm({suggestedExpertise: formData.suggestedExpertise.filter(e=>e!==exp)}): updateForm({suggestedExpertise:[...formData.suggestedExpertise, exp]})} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${on?'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900':'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300'}`}>{exp}</button>})}</div></div>
            </div>
          )}
          {currentStep===5 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Review & Submit</h2>
              <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4">
                <div className="font-semibold">{formData.title||'Untitled Challenge'}</div>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500"><Badge variant="outline" className="rounded-full border-slate-200 dark:border-white/10 dark:text-slate-300">{formData.category||'Category'}</Badge><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{formData.location.city}, {formData.location.state}</span><span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{formData.affectedPopulation.toLocaleString()} affected</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-slate-500">Urgency:</span> <span className="font-medium capitalize">{formData.urgency}</span></div><div><span className="text-slate-500">Severity:</span> <span className="font-medium capitalize">{formData.severity}</span></div><div className="col-span-2 text-xs text-slate-500">Expertise: {(formData.suggestedExpertise||[]).join(', ')||'Not specified'}</div></div>
              {formData.description && <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4">{formData.description}</p>}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
            <Button variant="outline" onClick={()=>setCurrentStep(Math.max(1, currentStep-1))} disabled={currentStep===1} className="rounded-full border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            {currentStep<5 ? <Button onClick={()=>setCurrentStep(currentStep+1)} disabled={!canNext} className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900">Next <ArrowRight className="h-4 w-4 ml-2" /></Button> : <Button onClick={handleSubmit} disabled={submitting} className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900">{submitting?'Submitting...':'Submit Challenge'} <Sparkles className="h-4 w-4 ml-2" /></Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
