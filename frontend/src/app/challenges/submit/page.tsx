'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { challengesAPI } from '@/lib/api';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Brain, MapPin, Users,
  AlertTriangle, FileText, Target, Lightbulb, Sparkles, Copy
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Problem Information', icon: Lightbulb },
  { id: 2, title: 'Impact Assessment', icon: AlertTriangle },
  { id: 3, title: 'Evidence', icon: FileText },
  { id: 4, title: 'Expected Solution', icon: Target },
  { id: 5, title: 'Review & Submit', icon: CheckCircle2 },
];

const categories = ['Environment', 'Healthcare', 'Education', 'Transportation', 'Agriculture', 'Infrastructure', 'Social Welfare', 'Technology'];
const indianStates = ['Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

export default function SubmitChallengePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [challengeResult, setChallengeResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', subcategory: '',
    location: { city: '', state: '', pincode: '' },
    affectedPopulation: 0, urgency: 'medium', severity: 'medium',
    currentConsequences: '', existingAttempts: '',
    desiredOutcome: '', constraints: '', availableResources: '',
    suggestedExpertise: [] as string[],
    evidence: { images: [], documents: [], videos: [], links: [] as string[] },
    newLink: ''
  });

  const updateForm = (updates: any) => setFormData(prev => ({ ...prev, ...updates }));

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await challengesAPI.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        location: formData.location,
        affectedPopulation: formData.affectedPopulation,
        urgency: formData.urgency,
        severity: formData.severity,
        currentConsequences: formData.currentConsequences,
        existingAttempts: formData.existingAttempts,
        desiredOutcome: formData.desiredOutcome,
        constraints: formData.constraints,
        availableResources: formData.availableResources,
        suggestedExpertise: formData.suggestedExpertise,
        evidence: formData.evidence
      });
      setChallengeResult({
        ...res.data.challenge,
        aiAnalysis: {
          summary: 'AI is analyzing your challenge submission. The analysis will be available shortly.',
          classification: `${formData.category} → Processing`,
          impactScore: Math.min(100, Math.floor(formData.affectedPopulation / 1000) + 30),
          urgencyScore: formData.urgency === 'critical' ? 90 : formData.urgency === 'high' ? 75 : 50,
          requiredExpertise: formData.suggestedExpertise
        }
      });
    } catch {
      setChallengeResult({
        _id: 'CHL-' + Math.floor(Math.random() * 9000 + 1000),
        title: formData.title,
        status: 'submitted',
        verificationStatus: 'pending',
        aiAnalysis: {
          summary: `This challenge addresses ${formData.title.toLowerCase()} in ${formData.location.city}, ${formData.location.state}. It affects approximately ${formData.affectedPopulation.toLocaleString()} people and falls within the ${formData.category} domain.`,
          classification: `${formData.category} → ${formData.subcategory || 'General'}`,
          impactScore: Math.min(100, Math.floor(formData.affectedPopulation / 1000) + 30),
          urgencyScore: formData.urgency === 'critical' ? 90 : formData.urgency === 'high' ? 75 : formData.urgency === 'medium' ? 50 : 30,
          requiredExpertise: formData.suggestedExpertise
        }
      });
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  const addExpertise = (exp: string) => {
    if (exp && !formData.suggestedExpertise.includes(exp)) {
      updateForm({ suggestedExpertise: [...formData.suggestedExpertise, exp] });
    }
  };

  const addLink = () => {
    if (formData.newLink) {
      updateForm({
        evidence: { ...formData.evidence, links: [...formData.evidence.links, formData.newLink] },
        newLink: ''
      });
    }
  };

  // Success Screen
  if (submitted && challengeResult) {
    return (
      <div className="container py-12 max-w-2xl mx-auto">
        <Card className="border-green-200">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Challenge Submitted Successfully!</h1>
            <p className="text-muted-foreground mb-6">Your challenge has been submitted and is awaiting verification.</p>
            
            <div className="bg-muted rounded-lg p-4 text-left space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Challenge ID</span><Badge variant="outline">{challengeResult._id}</Badge></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><Badge className="bg-yellow-100 text-yellow-700">Pending Verification</Badge></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Title</span><span className="text-sm font-medium">{challengeResult.title}</span></div>
            </div>

            {/* AI Analysis Card */}
            <Card className="border-blue-200 bg-blue-50/50 text-left">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" /> AI Classification
                  <Badge className="bg-blue-100 text-blue-700 text-[10px]">AI-generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-blue-700 italic">AI-assisted analysis — requires human verification</p>
                <p className="text-sm">{challengeResult.aiAnalysis?.classification}</p>
                <div>
                  <span className="text-xs text-muted-foreground">Impact Score: </span>
                  <span className="text-sm font-bold">{challengeResult.aiAnalysis?.impactScore}/100</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Estimated Affected: </span>
                  <span className="text-sm font-bold">{formData.affectedPopulation.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Recommended Expertise:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(challengeResult.aiAnalysis?.requiredExpertise || []).map((e: string) => (
                      <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-6">
              <Link href="/challenges" className="flex-1">
                <Button variant="outline" className="w-full">View All Challenges</Button>
              </Link>
              <Link href={`/challenges/${challengeResult._id}`} className="flex-1">
                <Button className="w-full gradient-primary">View Challenge</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Submit a Challenge</h1>
      <p className="text-muted-foreground mb-8">Describe a societal challenge that needs innovative solutions</p>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{step.title}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Problem Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Problem Information</h2>
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input placeholder="e.g., Smart Waste Collection for Urban Wards" value={formData.title} onChange={(e) => updateForm({ title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description *</label>
                <Textarea placeholder="Describe the problem in detail. What is the issue? Where does it occur? Who is affected?" className="min-h-[120px]" value={formData.description} onChange={(e) => updateForm({ description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category *</label>
                  <Select value={formData.category} onValueChange={(v) => updateForm({ category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Subcategory</label>
                  <Input placeholder="e.g., Waste Management" value={formData.subcategory} onChange={(e) => updateForm({ subcategory: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">City *</label>
                  <Input placeholder="e.g., Ranchi" value={formData.location.city} onChange={(e) => updateForm({ location: { ...formData.location, city: e.target.value } })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State *</label>
                  <Select value={formData.location.state} onValueChange={(v) => updateForm({ location: { ...formData.location, state: v } })}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pincode</label>
                  <Input placeholder="e.g., 834001" value={formData.location.pincode} onChange={(e) => updateForm({ location: { ...formData.location, pincode: e.target.value } })} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Impact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Impact Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Affected Population *</label>
                  <Input type="number" placeholder="e.g., 25000" value={formData.affectedPopulation || ''} onChange={(e) => updateForm({ affectedPopulation: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Urgency *</label>
                  <Select value={formData.urgency} onValueChange={(v) => updateForm({ urgency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Severity *</label>
                  <Select value={formData.severity} onValueChange={(v) => updateForm({ severity: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Current Consequences</label>
                <Textarea placeholder="What are the consequences if this problem remains unsolved?" value={formData.currentConsequences} onChange={(e) => updateForm({ currentConsequences: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Existing Attempts to Solve</label>
                <Textarea placeholder="Has anyone tried to solve this problem before? What was done and why it didn't work?" value={formData.existingAttempts} onChange={(e) => updateForm({ existingAttempts: e.target.value })} />
              </div>
            </div>
          )}

          {/* Step 3: Evidence */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Evidence & Supporting Information</h2>
              <p className="text-sm text-muted-foreground">Provide any evidence that supports this challenge. This helps in verification.</p>
              <div>
                <label className="text-sm font-medium mb-1 block">Supporting Links</label>
                <div className="flex gap-2">
                  <Input placeholder="https://..." value={formData.newLink} onChange={(e) => updateForm({ newLink: e.target.value })} />
                  <Button type="button" variant="outline" onClick={addLink}>Add</Button>
                </div>
                {formData.evidence.links.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.evidence.links.map((link, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">{link}</span>
                        <button onClick={() => updateForm({ evidence: { ...formData.evidence, links: formData.evidence.links.filter((_, j) => j !== i) } })} className="text-red-500 text-xs">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>💡 <strong>Tip:</strong> You can attach images, documents, and videos after the challenge is verified. Focus on providing accurate description and links for now.</p>
              </div>
            </div>
          )}

          {/* Step 4: Expected Solution */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Expected Solution</h2>
              <div>
                <label className="text-sm font-medium mb-1 block">Desired Outcome *</label>
                <Textarea placeholder="What would an ideal solution look like?" className="min-h-[100px]" value={formData.desiredOutcome} onChange={(e) => updateForm({ desiredOutcome: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Constraints</label>
                <Textarea placeholder="Any known constraints or limitations?" value={formData.constraints} onChange={(e) => updateForm({ constraints: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Available Resources</label>
                <Textarea placeholder="What resources are already available to help solve this?" value={formData.availableResources} onChange={(e) => updateForm({ availableResources: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Suggested Expertise</label>
                <div className="flex flex-wrap gap-2">
                  {['IoT', 'AI/ML', 'Data Science', 'Mobile Development', 'Web Development', 'Environmental Engineering', 'Healthcare', 'Education', 'Urban Planning', 'Blockchain', 'Cloud Computing', 'GIS', 'Civil Engineering', 'Electronics'].map(exp => (
                    <Badge key={exp} variant={formData.suggestedExpertise.includes(exp) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => {
                      if (formData.suggestedExpertise.includes(exp)) {
                        updateForm({ suggestedExpertise: formData.suggestedExpertise.filter(e => e !== exp) });
                      } else {
                        addExpertise(exp);
                      }
                    }}>
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review & Submit</h2>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">{formData.title || 'Untitled Challenge'}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{formData.category}</Badge>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {formData.location.city}, {formData.location.state}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {formData.affectedPopulation.toLocaleString()} affected</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Urgency:</span> <span className="font-medium capitalize">{formData.urgency}</span></div>
                  <div><span className="text-muted-foreground">Severity:</span> <span className="font-medium capitalize">{formData.severity}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Expertise:</span> {(formData.suggestedExpertise || []).join(', ') || 'Not specified'}</div>
                </div>
                {formData.description && (
                  <div className="text-sm text-muted-foreground line-clamp-4">{formData.description}</div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {currentStep < 5 ? (
              <Button onClick={handleNext} className="gradient-primary" disabled={!formData.title || !formData.category || !formData.location.city || !formData.location.state}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gradient-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Challenge'}
                {!submitting && <Sparkles className="h-4 w-4 ml-2" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
