import { AIProvider, ChallengeAnalysisInput, StructuredRequirements, MatchExplanation } from './AIProvider';
import { MockProvider } from './MockProvider';
export class OpenAIProvider extends AIProvider {
  name='openai'; private mock=new MockProvider();
  constructor(private apiKey?: string, private apiBase?: string){ super(); }
  private getKey(){ return this.apiKey || process.env.OPENAI_API_KEY || ''; }
  private getBase(){ return (this.apiBase || process.env.OPENAI_API_BASE || 'https://api.openai.com/v1').replace(/\/$/,''); }
  async analyzeChallenge(input:ChallengeAnalysisInput):Promise<StructuredRequirements>{
    const key=this.getKey(); if(!key) return this.mock.analyzeChallenge(input);
    try{
      const prompt=`Analyze challenge Title="${input.title}" Desc="${input.description}" Category="${input.category}" Location="${input.location.city},${input.location.state}" Pop=${input.affectedPopulation} Urgency=${input.urgency}. Return JSON with domains,subDomain,requiredSkills(6),requiredTechnologies(6),academicFields(3),industrySectors(2),requiredRoles(3),difficulty,urgency,geographicRelevance,sdgs,solutionType,summary,classification,impactScore,urgencyScore.`;
      const res=await fetch(`${this.getBase()}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.2,response_format:{type:'json_object'},messages:[{role:'system',content:'Return only JSON.'},{role:'user',content:prompt}]})});
      if(!res.ok) throw new Error(`${res.status}`);
      const data:any=await res.json(); const parsed=JSON.parse(data.choices[0].message.content);
      const emb=await this.generateEmbedding(`${input.title} ${input.description}`);
      return {domains:parsed.domains||[input.category],subDomain:parsed.subDomain||input.category,requiredSkills:(parsed.requiredSkills||[]).slice(0,6),requiredTechnologies:(parsed.requiredTechnologies||[]).slice(0,6),academicFields:parsed.academicFields||[],industrySectors:parsed.industrySectors||[],requiredRoles:parsed.requiredRoles||[],difficulty:parsed.difficulty||'medium',urgency:parsed.urgency||input.urgency as any,geographicRelevance:parsed.geographicRelevance||[input.location.state],sdgs:parsed.sdgs||[],solutionType:parsed.solutionType||'',summary:parsed.summary||'',classification:parsed.classification||'',impactScore:parsed.impactScore||75,urgencyScore:parsed.urgencyScore||60,embedding:emb};
    }catch{ return this.mock.analyzeChallenge(input); }
  }
  async generateEmbedding(text:string):Promise<number[]>{
    const key=this.getKey(); if(!key) return this.mock.generateEmbedding(text);
    try{
      const res=await fetch(`${this.getBase()}/embeddings`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_EMBED_MODEL||'text-embedding-3-small',input:text.slice(0,8000)})});
      if(!res.ok) throw new Error(`${res.status}`);
      const data:any=await res.json(); return data.data[0].embedding;
    }catch{ return this.mock.generateEmbedding(text); }
  }
  async explainMatch(ch:StructuredRequirements,candidate:any,scores:Record<string,number>):Promise<MatchExplanation>{ const key=this.getKey(); if(!key) return this.mock.explainMatch(ch,candidate,scores); return this.mock.explainMatch(ch,candidate,scores); }
}
