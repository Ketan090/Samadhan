'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, ArrowLeft, Lightbulb, Rocket } from 'lucide-react';

export default function SubmitSolutionPage() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challenge') || '';
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '', problemAddressed: '', proposedApproach: '', technology: [] as string[],
    architecture: '', expectedImpact: '', estimatedCost: 0, implementationTimeline: '',
    scalability: '', challenge: challengeId
  });
  const [newTech, setNewTech] = useState('');

  const update = (u: any) => setForm(p => ({ ...p, ...u }));

  if (submitted) {
    return (
      <div className="container py-12 max-w-xl mx-auto text-center">
        <Card>
          <CardContent className="p-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Solution Submitted!</h1>
            <p className="text-muted-foreground mb-6">Your solution is now under review by experts.</p>
            <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Submit a Solution</h1>
      <p className="text-muted-foreground mb-8">Propose your innovative solution to a societal challenge</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{s}</div>
            {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Solution Details</h2>
              <div>
                <label className="text-sm font-medium mb-1 block">Solution Title *</label>
                <Input placeholder="e.g., SmartBin: IoT-Enabled Waste Collection System" value={form.title} onChange={e => update({ title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Problem Addressed *</label>
                <Textarea placeholder="Which specific problem does your solution address?" value={form.problemAddressed} onChange={e => update({ problemAddressed: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Proposed Approach *</label>
                <Textarea className="min-h-[120px]" placeholder="Describe your solution approach in detail..." value={form.proposedApproach} onChange={e => update({ proposedApproach: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Technology Stack</label>
                <div className="flex gap-2">
                  <Input placeholder="Add technology" value={newTech} onChange={e => setNewTech(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newTech) { update({ technology: [...form.technology, newTech] }); setNewTech(''); } }} />
                  <Button type="button" variant="outline" onClick={() => { if (newTech) { update({ technology: [...form.technology, newTech] }); setNewTech(''); } }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.technology.map(t => <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => update({ technology: form.technology.filter(x => x !== t) })}>{t} ×</Badge>)}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Impact & Implementation</h2>
              <div>
                <label className="text-sm font-medium mb-1 block">Architecture</label>
                <Textarea placeholder="Describe your system architecture..." value={form.architecture} onChange={e => update({ architecture: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Expected Impact *</label>
                <Textarea placeholder="What measurable impact will your solution create?" value={form.expectedImpact} onChange={e => update({ expectedImpact: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Estimated Cost (₹)</label>
                  <Input type="number" placeholder="e.g., 2500000" value={form.estimatedCost || ''} onChange={e => update({ estimatedCost: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Implementation Timeline</label>
                  <Input placeholder="e.g., 6 months pilot, 12 months full deployment" value={form.implementationTimeline} onChange={e => update({ implementationTimeline: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Scalability</label>
                <Textarea placeholder="How can this solution scale to other areas?" value={form.scalability} onChange={e => update({ scalability: e.target.value })} />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={() => setStep(1)} disabled={step === 1}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            {step < 2 ? (
              <Button onClick={() => setStep(2)} className="gradient-primary">Next <ArrowRight className="h-4 w-4 ml-2" /></Button>
            ) : (
              <Button onClick={() => setSubmitted(true)} className="gradient-primary" disabled={!form.title || !form.problemAddressed || !form.proposedApproach}>
                <Rocket className="h-4 w-4 mr-2" /> Submit Solution
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
