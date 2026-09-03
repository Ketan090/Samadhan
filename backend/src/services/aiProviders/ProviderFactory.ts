import { AIProvider } from './AIProvider';
import { MockProvider } from './MockProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { GeminiProvider } from './GeminiProvider';
import { LocalProvider } from './LocalProvider';
export function getAIProvider(name='mock', opts?:{apiKey?:string; apiBase?:string; geminiKey?:string}): AIProvider{
  switch(name){
    case 'openai': return new OpenAIProvider(opts?.apiKey, opts?.apiBase);
    case 'gemini': return new GeminiProvider(opts?.geminiKey || opts?.apiKey);
    case 'local': return new LocalProvider(opts?.apiBase);
    case 'lmstudio': return new LocalProvider(opts?.apiBase);
    default: return new MockProvider();
  }
}
