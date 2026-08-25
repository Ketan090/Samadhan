'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { solutionsAPI, evaluationsAPI } from '@/lib/api';
import { getStatusColor, formatNumber, formatDate } from '@/lib/utils';
import {
  ArrowLeft, Users, Calendar, IndianRupee, Rocket, CheckCircle2,
  TrendingUp, Lightbulb, Target, Shield, ChevronRight, Brain
} from 'lucide-react';

export default function SolutionDetailPage() {
  const params = useParams();
  const [solution, setSolution] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const solRes = await solutionsAPI.getById(params.id as string);
        setSolution(solRes.data.solution);
        const evalRes = await evaluationsAPI.getBySolution(params.id as string);
        setEvaluations(evalRes.data.evaluations);
      } catch {
        setSolution({
          _id: params.id, title: 'SmartBin: IoT-Enabled Waste Collection Optimization System',
          challenge: { title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand' } },
          submittedBy: { name: 'Prof. Amit Verma', role: 'university' },
          team: { name: 'EcoTech Solutions' },
          problemAddressed: 'Low waste collection efficiency of 40% in Ranchi urban wards affecting 25,000 residents',
          proposedApproach: 'Deploy IoT sensors in waste bins across all wards. Use AI to optimize collection routes in real-time. Provide a mobile app for citizens to report issues and track collection. Dashboard for ward administrators to monitor operations.',
          technology: ['IoT Sensors', 'Machine Learning', 'Mobile App', 'Cloud Platform', 'GPS Tracking'],
          architecture: 'Three-tier architecture: IoT layer (sensors + gateways), Cloud layer (data processing + AI), Application layer (mobile + web dashboards)',
          expectedImpact: 'Increase waste collection efficiency from 40% to 85%. Reduce fuel costs by 30%. Improve citizen satisfaction by 60%.',
          estimatedCost: 2500000,
          implementationTimeline: '6 months pilot in 5 wards, 12 months full deployment',
          scalability: 'Easily scalable to other cities. Modular design allows adding new sensor types and features.',
          status: 'under-review',
          scorecard: { impact: 8, feasibility: 8, scalability: 9, innovation: 7, costEffectiveness: 7, totalScore: 7.85 },
          createdAt: '2024-03-15'
        });
        setEvaluations([
          { _id: 'e1', evaluator: { name: 'Meena Joshi', role: 'expert' }, scores: { impact: 8, feasibility: 8, scalability: 9, innovation: 7, costEffectiveness: 7 }, weightedScore: 7.85, recommendation: 'approve', comments: 'Strong solution with practical IoT implementation.', strengths: ['Uses existing infrastructure', 'Modular design', 'Clear impact metrics'], weaknesses: ['Requires maintenance training'], recommendations: ['Start with pilot in 2 wards'] }
        ]);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) return <div className="container py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/3" /><div className="h-64 bg-muted rounded-lg" /></div></div>;
  if (!solution) return null;

  const sc = solution.scorecard;

  return (
    <div className="container py-8">
      <Link href="/solutions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Solutions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getStatusColor(solution.status)} capitalize`}>{solution.status}</Badge>
              <span className="text-sm text-muted-foreground">for {solution.challenge?.title}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">{solution.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {solution.team?.name || 'Team'}</span>
              <span>by {solution.submittedBy?.name || 'Unknown'}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(solution.createdAt)}</span>
            </div>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg">Problem Addressed</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{solution.problemAddressed}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Proposed Approach</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{solution.proposedApproach}</p></CardContent>
          </Card>

          {solution.architecture && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Architecture</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">{solution.architecture}</p></CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">Expected Impact</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{solution.expectedImpact}</p></CardContent>
          </Card>

          {/* Evaluations */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Expert Evaluations ({evaluations.length})</CardTitle></CardHeader>
            <CardContent>
              {evaluations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No evaluations yet.</p>
              ) : (
                <div className="space-y-4">
                  {evaluations.map((ev) => (
                    <div key={ev._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium">{ev.evaluator?.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs capitalize">{ev.evaluator?.role}</Badge>
                        </div>
                        <div className="text-lg font-bold text-primary">{ev.weightedScore?.toFixed(1)}/10</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{ev.comments}</p>
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {['impact', 'feasibility', 'scalability', 'innovation', 'costEffectiveness'].map((k) => (
                          <div key={k} className="text-center">
                            <div className="text-xs text-muted-foreground capitalize">{k === 'costEffectiveness' ? 'Cost' : k}</div>
                            <div className="font-bold text-sm">{ev.scores[k]}</div>
                          </div>
                        ))}
                      </div>
                      {ev.strengths?.length > 0 && (
                        <div className="text-xs"><span className="font-medium text-green-600">Strengths:</span> {ev.strengths.join(', ')}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scorecard */}
          {sc && (
            <Card className="border-primary/20">
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4" /> Solution Scorecard</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary">{sc.totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score / 10</div>
                </div>
                {[
                  { label: 'Impact (30%)', value: sc.impact, color: 'bg-blue-500' },
                  { label: 'Feasibility (25%)', value: sc.feasibility, color: 'bg-green-500' },
                  { label: 'Scalability (20%)', value: sc.scalability, color: 'bg-purple-500' },
                  { label: 'Innovation (15%)', value: sc.innovation, color: 'bg-orange-500' },
                  { label: 'Cost Effectiveness (10%)', value: sc.costEffectiveness, color: 'bg-cyan-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className={`h-2 ${item.color} rounded-full transition-all`} style={{ width: `${item.value * 10}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tech Stack */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Technology Stack</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(solution.technology || []).map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Estimated Cost</span><span className="font-medium flex items-center gap-1"><IndianRupee className="h-3 w-3" />{formatNumber(solution.estimatedCost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Timeline</span><span className="font-medium text-right text-xs">{solution.implementationTimeline}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
