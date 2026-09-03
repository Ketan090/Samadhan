import { AIProvider, ChallengeAnalysisInput, StructuredRequirements, MatchExplanation } from './AIProvider';
import { MockProvider } from './MockProvider';
export class LocalProvider extends AIProvider {
  name='local'; private mock=new MockProvider();
  constructor(private apiBase?: string){ super(); }
  private getBase(){ return (this.apiBase || process.env.OLLAMA_URL || process.env.LMSTUDIO_URL || 'http://localhost:11434').replace(/\/$/,''); }
  async analyzeChallenge(input:ChallengeAnalysisInput):Promise<StructuredRequirements>{
    try{
      const base=this.getBase();
      const url=base.includes('1234')?`${base}/chat/completions`:`${base}/api/chat`;
      const isLMStudio=base.includes('1234');
      const body=isLMStudio?{model:process.env.LOCAL_LLM_MODEL||'local',temperature:0.2,messages:[{role:'system',content:'Return JSON with domains,subDomain,requiredSkills,requiredTechnologies,academicFields,industrySectors,requiredRoles,difficulty,urgency,geographicRelevance,sdgs,solutionType,summary,classification,impactScore,urgencyScore'},{role:'user',content:`Title: ${input.title}\nDesc: ${input.description}\nCat: ${input.category}`}],response_format:{type:'json_object'}}:{model:process.env.LOCAL_LLM_MODEL||'llama3',format:'json',stream:false,messages:[{role:'system',content:'Return JSON'},{role:'user',content:`Title: ${input.title} Cat:${input.category} Desc:${input.description}`}]};
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(!res.ok) throw new Error();
      const data:any=await res.json();
      const content=isLMStudio?data.choices[0].message.content:data.message.content;
      const parsed=JSON.parse(content);
      const emb=await this.generateEmbedding(`${input.title} ${input.description}`);
      return {domains:parsed.domains||[input.category],subDomain:parsed.subDomain||input.category,requiredSkills:(parsed.requiredSkills||[]).slice(0,6),requiredTechnologies:(parsed.requiredTechnologies||[]).slice(0,6),academicFields:parsed.academicFields||[],industrySectors:parsed.industrySectors||[],requiredRoles:parsed.requiredRoles||[],difficulty:parsed.difficulty||'medium',urgency:parsed.urgency||input.urgency as any,geographicRelevance:parsed.geographicRelevance||[input.location.state],sdgs:parsed.sdgs||[],solutionType:parsed.solutionType||'',summary:parsed.summary||'',classification:parsed.classification||'',impactScore:parsed.impactScore||75,urgencyScore:parsed.urgencyScore||60,embedding:emb};
    }catch{ return this.mock.analyzeChallenge(input); }
  }
  async generateEmbedding(text:string):Promise<number[]>{
    try{
      const base=this.getBase();
      if(base.includes('1234')) throw new Error('no embed');
      const res=await fetch(`${base}/api/embeddings`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:process.env.LOCAL_LLM_MODEL||'llama3',prompt:text.slice(0,6000)})});
      if(!res.ok) throw new Error();
      const d:any=await res.json(); return d.embedding;
    }catch{ return this.mock.generateEmbedding(text); }
  }
  async explainMatch(ch:StructuredRequirements,c:any,s:Record<string,number>):Promise<MatchExplanation>{ return this.mock.explainMatch(ch,c,s); }
}
