import { AIProvider, ChallengeAnalysisInput, StructuredRequirements, MatchExplanation } from './AIProvider';
import { MockProvider } from './MockProvider';
export class GeminiProvider extends AIProvider {
  name='gemini'; private mock=new MockProvider();
  constructor(private apiKey?: string){ super(); }
  private getKey(){ return this.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''; }
  async analyzeChallenge(input:ChallengeAnalysisInput):Promise<StructuredRequirements>{
    const key=this.getKey(); if(!key) return this.mock.analyzeChallenge(input);
    try{
      const prompt=`Analyze Title="${input.title}" Desc="${input.description}" Cat="${input.category}" Pop=${input.affectedPopulation}. Return JSON domains,subDomain,requiredSkills(6),requiredTechnologies(6),academicFields,industrySectors,requiredRoles,difficulty,urgency,geographicRelevance,sdgs,solutionType,summary,classification,impactScore,urgencyScore.`;
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL||'gemini-1.5-flash'}:generateContent?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.2}})});
      if(!res.ok) throw new Error(`${res.status}`);
      const data:any=await res.json(); const parsed=JSON.parse(data.candidates[0].content.parts[0].text);
      const emb=await this.generateEmbedding(`${input.title} ${input.description}`);
      return {domains:parsed.domains||[input.category],subDomain:parsed.subDomain||input.category,requiredSkills:(parsed.requiredSkills||[]).slice(0,6),requiredTechnologies:(parsed.requiredTechnologies||[]).slice(0,6),academicFields:parsed.academicFields||[],industrySectors:parsed.industrySectors||[],requiredRoles:parsed.requiredRoles||[],difficulty:parsed.difficulty||'medium',urgency:parsed.urgency||input.urgency as any,geographicRelevance:parsed.geographicRelevance||[input.location.state],sdgs:parsed.sdgs||[],solutionType:parsed.solutionType||'',summary:parsed.summary||'',classification:parsed.classification||'',impactScore:parsed.impactScore||75,urgencyScore:parsed.urgencyScore||60,embedding:emb};
    }catch{ return this.mock.analyzeChallenge(input); }
  }
  async generateEmbedding(text:string):Promise<number[]>{ const key=this.getKey(); if(!key) return this.mock.generateEmbedding(text); try{ const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_EMBED_MODEL||'text-embedding-004'}:embedContent?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:`models/${process.env.GEMINI_EMBED_MODEL||'text-embedding-004'}`,content:{parts:[{text:text.slice(0,6000)}]}})}); if(!r.ok) throw new Error(); const d:any=await r.json(); return d.embedding.values; }catch{ return this.mock.generateEmbedding(text); } }
  async explainMatch(ch:StructuredRequirements,c:any,s:Record<string,number>):Promise<MatchExplanation>{ return this.mock.explainMatch(ch,c,s); }
}
