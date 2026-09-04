import { Router, Response } from 'express';
import { protect, AuthRequest, authorize } from '../middleware/auth';
import Challenge from '../models/Challenge';
import Organization from '../models/Organization';
import User from '../models/User';
import Team from '../models/Team';
import ChallengeAnalysis from '../models/ChallengeAnalysis';
import Match from '../models/Match';
import MatchingConfig from '../models/MatchingConfig';
import { getAIProvider } from '../services/aiProviders/ProviderFactory';
import { scoreCandidate, explainCandidate, DEFAULT_WEIGHTS } from '../services/matchingEngine';

const router = Router();
function sanitize(t:string){ return t.replace(/[<>]/g,'').slice(0,6000); }
async function getConfig(){
  let cfg = await MatchingConfig.findOne();
  if(!cfg) cfg = await MatchingConfig.create({ weights: DEFAULT_WEIGHTS, provider: 'mock', apiKeys: {}, apiBase: '', similarityThreshold: 0.72, minimumMatchScore: 60 });
  return cfg;
}
function providerOpts(cfg:any){
  return { apiKey: cfg.apiKeys?.openai || process.env.OPENAI_API_KEY, apiBase: cfg.apiBase || process.env.OPENAI_API_BASE, geminiKey: cfg.apiKeys?.gemini || process.env.GEMINI_API_KEY };
}

// Vision analyze image for auto-fill description
router.post('/analyze-image', protect, async (req: AuthRequest, res: Response)=>{
  try{
    const { image, hint } = req.body;
    if(!image){ res.status(400).json({success:false, message:'image base64 required'}); return; }
    const cfg = await getConfig();
    const opts = providerOpts(cfg);
    // Use vision via OpenAI/Gemini if available, else heuristic
    if(cfg.provider==='openai' && opts.apiKey){
      try{
        const base = (opts.apiBase || 'https://api.openai.com/v1').replace(/\/$/,'');
        const r = await fetch(`${base}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${opts.apiKey}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'user',content:[{type:'text',text:`Describe this civic issue in 1 sentence, suggest title (6 words), category among Environment/Healthcare/Education/Transportation/Agriculture/Infrastructure/Social Welfare/Technology, and urgency low/medium/high/critical. Hint: ${hint||''}`},{type:'image_url',image_url:{url:image}}]}],max_tokens:300})});
        if(r.ok){ const d:any=await r.json(); const txt=d.choices[0].message.content; const parsed=JSON.parse(txt.match(/\{[\s\S]*\}/)?.[0]||'{}'); res.json({success:true, detected: parsed.detected||txt.slice(0,120), suggestedTitle: parsed.title||'Civic Issue Detected', suggestedDescription: parsed.description||txt.slice(0,200), suggestedCategory: parsed.category||'Environment', confidence: 88, provider:'openai'}); return; }
      }catch{}
    }
    // Mock heuristic fallback
    const mockTitles: Record<string,string> = { garbage:'Garbage accumulation on roadside', pothole:'Pothole causing traffic hazard', water:'Water logging in street', flood:'Flooding in urban area' };
    const lower = (hint||'garbage').toLowerCase();
    let k='garbage'; if(lower.includes('water')||lower.includes('flood')) k='water'; else if(lower.includes('pothole')||lower.includes('road')) k='pothole';
    res.json({success:true, detected: `Photo shows ${k} issue`, suggestedTitle: mockTitles[k], suggestedDescription: `Photo shows ${k} issue that affects daily life. Location visible in image requires attention.`, suggestedCategory: k==='garbage'?'Environment':k==='pothole'?'Infrastructure':'Environment', confidence: 82, provider:'mock'});
  }catch(e:any){ res.status(500).json({success:false, message:e.message}); }
});

// POST /analyze
router.post('/analyze', protect, async (req: AuthRequest, res: Response)=>{
  try{
    const { challengeId, title, description, category, location, affectedPopulation, urgency, skills, technologies } = req.body;
    let input:any; let cid:string|null=null;
    if(challengeId){
      const ch=await Challenge.findById(challengeId); if(!ch){ res.status(404).json({success:false, message:'Challenge not found'}); return; }
      input={title:ch.title, description:ch.description, category:ch.category, location:ch.location, affectedPopulation:ch.affectedPopulation, urgency:ch.urgency, skills:ch.suggestedExpertise};
      cid=ch._id.toString();
      const cached=await ChallengeAnalysis.findOne({challengeId:ch._id});
      if(cached && (Date.now()-new Date(cached.updatedAt).getTime()<24*3600*1000)){ res.json({success:true, analysis:cached, cached:true}); return; }
    } else {
      if(!title||!description||!category){ res.status(400).json({success:false, message:'title, description, category required'}); return; }
      input={title:sanitize(title), description:sanitize(description), category, location:location||{city:'',state:''}, affectedPopulation:affectedPopulation||0, urgency:urgency||'medium', skills, technologies};
    }
    const cfg=await getConfig(); const provider=getAIProvider(cfg.provider, providerOpts(cfg));
    const result=await provider.analyzeChallenge(input);
    if(cid){
      const doc=await ChallengeAnalysis.findOneAndUpdate({challengeId:cid},{...result,challengeId:cid,provider:cfg.provider,analyzedAt:new Date()},{upsert:true,new:true});
      res.json({success:true, analysis:doc, cached:false});
    } else res.json({success:true, analysis:result, cached:false});
  }catch(e:any){ res.status(500).json({success:false, message:e.message}); }
});

// POST /match
router.post('/match', protect, async (req: AuthRequest, res: Response)=>{
  try{
    const { challengeId, candidateType, topK=5, challengeInput } = req.body;
    let analysis:any; let challengeDoc:any=null;
    if(challengeId){
      challengeDoc=await Challenge.findById(challengeId); if(!challengeDoc){ res.status(404).json({success:false, message:'Challenge not found'}); return; }
      analysis=await ChallengeAnalysis.findOne({challengeId});
      if(!analysis){
        const cfg0=await getConfig(); const p0=getAIProvider(cfg0.provider, providerOpts(cfg0));
        const r=await p0.analyzeChallenge({title:challengeDoc.title, description:challengeDoc.description, category:challengeDoc.category, location:challengeDoc.location, affectedPopulation:challengeDoc.affectedPopulation, urgency:challengeDoc.urgency});
        analysis=await ChallengeAnalysis.create({...r,challengeId,provider:cfg0.provider});
      }
    } else if(challengeInput){
      const cfgI=await getConfig(); const pI=getAIProvider(cfgI.provider, providerOpts(cfgI));
      analysis=await pI.analyzeChallenge({title:challengeInput.title, description:challengeInput.description, category:challengeInput.category, location:challengeInput.location||{city:'',state:''}, affectedPopulation:challengeInput.affectedPopulation||0, urgency:challengeInput.urgency||'medium'});
    } else{ res.status(400).json({success:false, message:'challengeId or challengeInput required'}); return; }
    const cfg=await getConfig(); const weights=cfg.weights as any; const minScore=cfg.minimumMatchScore; const opts=providerOpts(cfg);
    const orgs=await Organization.find({}).limit(60); const users=await User.find({role:{$in:['university','industry','expert']}}).limit(40); const teams=await Team.find({}).populate('leader').limit(30);
    const pools:any[]=[];
    if(!candidateType||candidateType==='university') pools.push(...orgs.filter(o=>o.type==='university').map(o=>({_id:o._id,name:o.name,type:'university',address:o.address,researchAreas:o.researchAreas,technologies:o.technologies,departments:o.departments,faculty:o.faculty,previousProjects:o.previousProjects,isActive:true})));
    if(!candidateType||candidateType==='industry') pools.push(...orgs.filter(o=>o.type==='industry').map(o=>({_id:o._id,name:o.name,type:'industry',address:o.address,capabilities:o.capabilities,technologies:o.technologies,isActive:true})));
    if(!candidateType||candidateType==='faculty') pools.push(...users.filter((u:any)=>['university','expert'].includes(u.role)).map(u=>({_id:u._id,name:u.name,type:'faculty',expertise:u.expertise,isActive:true})));
    if(!candidateType||candidateType==='student_team') pools.push(...teams.map((t:any)=>({_id:t._id,name:t.name,type:'student_team',isActive:true})));
    if(pools.length===0) pools.push({_id:'demo-team-1',name:'Computer Technology Team',type:'student_team',expertise:['Python','ML'],isActive:true},{_id:'demo-univ-1',name:'Agricultural Research Dept',type:'university',researchAreas:['Plant Pathology'],isActive:true},{_id:'demo-ind-1',name:'AgriTech Partner',type:'industry',capabilities:['IoT'],isActive:true});
    const scored:any[]=[];
    for(const c of pools){
      const {overall,scores}=await scoreCandidate(analysis,c,weights,cfg.provider,opts);
      if(overall<minScore) continue;
      const exp=await explainCandidate(analysis,c,scores,cfg.provider,opts);
      scored.push({candidateId:c._id,candidateType:c.type,candidateName:c.name,overallScore:overall,...scores,classification:overall>=90?'exceptional':overall>=80?'strong':overall>=70?'good':overall>=60?'potential':'low',strengths:exp.strengths,missingCapabilities:exp.missingCapabilities,recommendedCollaborator:exp.recommendedCollaborator,explanation:exp.explanation});
    }
    scored.sort((a,b)=>b.overallScore-a.overallScore);
    const top=scored.slice(0,topK);
    if(challengeId){ for(const m of top) await Match.findOneAndUpdate({challengeId,candidateId:m.candidateId},{challengeId,candidateId:m.candidateId,candidateType:m.candidateType,candidateName:m.candidateName,overallScore:m.overallScore,skillScore:m.skill,domainScore:m.domain,technologyScore:m.technology,expertiseScore:m.expertise,experienceScore:m.experience,availabilityScore:m.availability,locationScore:m.location,impactScore:m.impact,classification:m.classification,strengths:m.strengths,missingCapabilities:m.missingCapabilities,recommendedCollaborator:m.recommendedCollaborator,explanation:m.explanation},{upsert:true}); }
    const teamRecommendation=top.length>=3?{members:top.slice(0,4).map((t,i)=>({rank:i+1,...t,role:['AI/ML Student','Agriculture Researcher','UI/UX Student','Industry Mentor'][i]||'Member'})),compatibility:Math.round(top.slice(0,4).reduce((s,x)=>s+x.overallScore,0)/4)}:null;
    res.json({success:true, analysis, matches:top, teamRecommendation, isDemo:!challengeDoc});
  }catch(e:any){ res.status(500).json({success:false, message:e.message}); }
});

router.get('/overview', protect, async (_req:AuthRequest,res:Response)=>{ try{ const challengesAnalyzed=await ChallengeAnalysis.countDocuments(); const totalMatches=await Match.countDocuments(); const strong=await Match.countDocuments({overallScore:{$gte:80}}); const teamsFormed=await Team.countDocuments({status:{$in:['active','completed']}}); res.json({success:true, overview:{challengesAnalyzed,activeMatches:totalMatches,strongMatches:strong,teamsFormed,successfulCollaborations:await Match.countDocuments({status:'completed'})}}); }catch(e:any){ res.status(500).json({success:false, message:e.message}); } });
router.get('/recommendations', protect, async (req:AuthRequest,res:Response)=>{ try{ const recent=await Match.find({}).sort({overallScore:-1}).limit(12).lean(); const chIds=[...new Set(recent.map(r=>r.challengeId.toString()))]; const chs:any=await Challenge.find({_id:{$in:chIds}}).lean(); const chMap=new Map(chs.map((c:any)=>[c._id.toString(),c])); res.json({success:true, recommendations: recent.slice(0,6).map(r=>({match:r,challenge:chMap.get(r.challengeId.toString())}))}); }catch(e:any){ res.status(500).json({success:false, message:e.message}); } });
router.post('/invite', protect, async (req:AuthRequest,res:Response)=>{ try{ const {matchId,challengeId,candidateId}=req.body; let m:any; if(matchId) m=await Match.findById(matchId); else if(challengeId&&candidateId) m=await Match.findOne({challengeId,candidateId}); if(!m){ res.status(404).json({success:false, message:'Match not found'}); return; } m.status='invited'; m.invitedAt=new Date(); await m.save(); res.json({success:true, match:m}); }catch(e:any){ res.status(500).json({success:false, message:e.message}); } });
router.post('/feedback', protect, async (req:AuthRequest,res:Response)=>{ try{ const {matchId,feedback}=req.body; if(!['relevant','not_relevant'].includes(feedback)){ res.status(400).json({success:false, message:'feedback must be relevant|not_relevant'}); return; } const m=await Match.findById(matchId); if(!m){ res.status(404).json({success:false, message:'Match not found'}); return; } m.feedback=feedback; await m.save(); res.json({success:true, match:m}); }catch(e:any){ res.status(500).json({success:false, message:e.message}); } });
router.post('/natural-query', protect, async (req:AuthRequest,res:Response)=>{ try{ const {query}=req.body; if(!query){ res.status(400).json({success:false, message:'query required'}); return; } const sanitized=sanitize(query.toLowerCase()); let candidateType:string|undefined; if(sanitized.includes('team')) candidateType='student_team'; else if(sanitized.includes('industry')) candidateType='industry'; else if(sanitized.includes('university')) candidateType='university'; res.json({success:true, parsed:{candidateType, query:sanitize(query)}}); }catch(e:any){ res.status(500).json({success:false, message:e.message}); } });
router.get('/config', protect, async (req:AuthRequest,res:Response)=>{
  const cfg=await getConfig();
  const isAdmin=(req as any).user?.role==='admin';
  const safeKeys = isAdmin ? (cfg.apiKeys ? { openai: cfg.apiKeys.openai ? '••••'+cfg.apiKeys.openai.slice(-4):'', gemini: cfg.apiKeys.gemini ? '••••'+cfg.apiKeys.gemini.slice(-4):'' } : {}) : { openai: cfg.apiKeys?.openai ? '•••• (admin only)':'', gemini: cfg.apiKeys?.gemini ? '•••• (admin only)':'' };
  res.json({success:true, config:{...cfg.toObject(), apiKeys: safeKeys}, isAdmin});
});
router.put('/config', protect, async (req:AuthRequest,res:Response)=>{
  const {weights,provider,similarityThreshold,minimumMatchScore,apiKeys,apiBase}=req.body;
  if(weights){ const sum=(Object.values(weights as any) as number[]).reduce((a:number,b:number)=>a+b,0); if(Math.abs(sum-100)>0.5){ res.status(400).json({success:false, message:'weights must sum to 100'}); return; } }
  const cfg=await getConfig();
  if(weights) cfg.weights={...cfg.weights,...weights};
  if(provider) cfg.provider=provider;
  if(similarityThreshold!==undefined) cfg.similarityThreshold=similarityThreshold;
  if(minimumMatchScore!==undefined) cfg.minimumMatchScore=minimumMatchScore;
  if(apiKeys){ if(apiKeys.openai) cfg.apiKeys.openai=apiKeys.openai; if(apiKeys.gemini) cfg.apiKeys.gemini=apiKeys.gemini; if(apiKeys.openai==='') cfg.apiKeys.openai=undefined; if(apiKeys.gemini==='') cfg.apiKeys.gemini=undefined; }
  if(apiBase!==undefined) cfg.apiBase=apiBase;
  await cfg.save();
  res.json({success:true, config:cfg});
});
export default router;
