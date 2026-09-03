import { StructuredRequirements } from './aiProviders/AIProvider';
import { getAIProvider } from './aiProviders/ProviderFactory';
export interface MatchingWeights { skill:number; domain:number; technology:number; expertise:number; experience:number; availability:number; location:number; impact:number; }
export const DEFAULT_WEIGHTS: MatchingWeights = { skill:25, domain:20, technology:15, expertise:15, experience:10, availability:5, location:5, impact:5 };
function normalize(s:string){ return s.toLowerCase().trim(); }
function tokenSet(s:string){ return new Set(s.toLowerCase().split(/\W+/).filter(w=>w.length>2)); }
function jaccard(a:Set<string>,b:Set<string>){ if(!a.size||!b.size) return 0; let inter=0; for(const x of a) if(b.has(x)) inter++; return inter/(a.size+b.size-inter); }
function arrayOverlapScore(need:string[],has:string[]){ if(!need.length) return 50; const n=new Set(need.map(normalize)); const h=new Set(has.map(normalize)); let hit=0; for(const x of n) if([...h].some(v=>v.includes(x)||x.includes(v))) hit++; return Math.round((hit/n.size)*100); }
export async function scoreCandidate(ch:StructuredRequirements,candidate:any,weights:MatchingWeights,providerName='mock',providerOpts?:any){
  const provider=getAIProvider(providerName,providerOpts);
  const candSkills=[...(candidate.expertise||[]),...(candidate.skills||[]),...(candidate.technologies||[]),...(candidate.capabilities||[]),...(candidate.researchAreas||[])];
  const candTech=candidate.technologies||candidate.capabilities||[];
  const candDomain=[...(candidate.researchAreas||[]),...(candidate.departments||[]),candidate.industryType||''].join(' ');
  const chalText=[...ch.requiredSkills,...ch.requiredTechnologies,...ch.academicFields,ch.domains[0]].join(' ');
  const candText=[...candSkills,candTech.join(' '),candDomain].join(' ');
  const embChal=ch.embedding?.length?ch.embedding:await provider.generateEmbedding(chalText);
  const embCand=await provider.generateEmbedding(candText);
  const semantic=Math.round((provider.cosineSimilarity(embChal,embCand)*0.5+0.5)*100);
  const skillScore=Math.round(arrayOverlapScore(ch.requiredSkills,candSkills)*0.7+semantic*0.3);
  const domainScore=Math.round(jaccard(tokenSet(ch.domains.join(' ')+' '+ch.academicFields.join(' ')),tokenSet(candDomain))*100*0.8+semantic*0.2);
  const technologyScore=Math.round(arrayOverlapScore(ch.requiredTechnologies,candTech)*0.8+semantic*0.2);
  const expertiseScore=Math.round(jaccard(tokenSet(ch.academicFields.join(' ')),tokenSet(candDomain))*100*0.6+semantic*0.4);
  const experienceScore=candidate.previousProjects?.length?Math.min(95,60+candidate.previousProjects.length*12):Math.min(75,semantic*0.7+20);
  const availabilityScore=candidate.isActive===false?30:80+Math.round(Math.random()*15);
  const locationScore=candidate.address?.state===ch.geographicRelevance[0]?90:45;
  const impactScore=70+Math.round((ch.sdgs.length*5+semantic*0.2)/2);
  const overall=Math.round(skillScore*weights.skill/100+domainScore*weights.domain/100+technologyScore*weights.technology/100+expertiseScore*weights.expertise/100+experienceScore*weights.experience/100+availabilityScore*weights.availability/100+locationScore*weights.location/100+impactScore*weights.impact/100);
  return {overall:Math.min(100,Math.max(0,overall)),scores:{skill:skillScore,domain:domainScore,technology:technologyScore,expertise:expertiseScore,experience:experienceScore,availability:availabilityScore,location:locationScore,impact:impactScore,semantic}};
}
export async function explainCandidate(ch:StructuredRequirements,candidate:any,scores:Record<string,number>,providerName='mock',providerOpts?:any){
  const provider=getAIProvider(providerName,providerOpts);
  return provider.explainMatch(ch,candidate,scores);
}
