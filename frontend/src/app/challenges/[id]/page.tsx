'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { challengesAPI, solutionsAPI, aiAPI } from '@/lib/api';
import { formatNumber, formatDate, getStatusColor, getSeverityColor, getCategoryIcon } from '@/lib/utils';
import {
  MapPin, Users, Calendar, AlertTriangle, Lightbulb, Brain, Target,
  ArrowRight, Building2, CheckCircle2, Clock, Shield, Rocket,
  FileText, Link as LinkIcon, TrendingUp, Zap, ChevronRight
} from 'lucide-react';

export default function ChallengeDetailPage() {
  const params = useParams();
  const [challenge, setChallenge] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const [challengeRes, solutionsRes] = await Promise.all([
        challengesAPI.getById(params.id as string),
        solutionsAPI.getAll({ challenge: params.id as string })
      ]);
      setChallenge(challengeRes.data.challenge);
      setSolutions(solutionsRes.data.solutions);
    } catch {
      // Demo data
      setChallenge({
        _id: params.id,
        title: 'Smart Waste Collection for Urban Wards',
        description: 'Ranchi city generates approximately 450 tonnes of municipal solid waste daily, but the current collection efficiency is only about 40%. Many wards, especially in peripheral areas, have irregular waste pickup leading to unhygienic conditions, disease outbreaks, and environmental degradation. We need an intelligent waste management system that can optimize collection routes, predict waste generation patterns, and enable real-time tracking of waste collection vehicles.\n\nThis challenge requires a multi-faceted approach combining IoT sensors, AI-powered route optimization, mobile applications for citizens and workers, and a dashboard for administrators. The solution should be scalable, affordable, and adaptable to Indian urban conditions.',
        category: 'Environment',
        subcategory: 'Waste Management',
        location: { city: 'Ranchi', state: 'Jharkhand', pincode: '834001' },
        affectedPopulation: 25000,
        urgency: 'high',
        severity: 'high',
        status: 'open',
        verificationStatus: 'verified',
        currentConsequences: 'Open dumping, water contamination, air pollution from burning waste, spread of vector-borne diseases, unpleasant living conditions for residents in multiple wards. The waste accumulation has led to a 15% increase in dengue and malaria cases in affected wards.',
        existingAttempts: 'Basic door-to-door collection exists but is irregular. Waste segregation at source is minimal. No real-time tracking of collection vehicles. Previous attempts at setting up community composting centers failed due to lack of monitoring.',
        desiredOutcome: 'An integrated smart waste management system with IoT-enabled bins, optimized collection routes, real-time tracking, and a mobile app for citizen reporting.',
        constraints: 'Budget constraints in municipal corporation. Limited technical expertise among waste workers. Diverse waste types from different areas. Power supply issues in some peripheral wards.',
        availableResources: 'Existing waste collection fleet of 25 vehicles. Municipal land for waste processing. Some budget allocation under Swachh Bharat Mission.',
        suggestedExpertise: ['IoT', 'AI', 'Data Science', 'Operations Research', 'Environmental Engineering'],
        submittedBy: { name: 'Rahul Singh', role: 'citizen', _id: '1' },
        organization: { name: 'District Administration Ranchi', type: 'government' },
        verifiedBy: { name: 'Rajesh Kumar', role: 'government' },
        verifiedAt: '2024-01-15',
        aiAnalysis: {
          summary: 'A critical urban waste management challenge affecting 25,000+ residents in Ranchi. Current collection efficiency is only 40% with no route optimization or real-time monitoring. The solution requires IoT deployment, AI-based route planning, and citizen engagement.',
          classification: 'Environment → Waste Management → Urban Waste Collection',
          impactScore: 78,
          urgencyScore: 82,
          requiredExpertise: ['IoT', 'Data Science', 'Environmental Engineering', 'Operations Research']
        },
        numberOfTeams: 3,
        numberOfSolutions: 2,
        participatingOrganizations: [{ name: 'IIT Bombay', type: 'university' }, { name: 'GreenTech Innovations', type: 'industry' }],
        tags: ['waste-management', 'smart-city', 'iot', 'urban'],
        createdAt: '2024-01-10',
        evidence: { images: [], documents: [], videos: [], links: ['https://swachhbharat.gov.in'] }
      });
      setSolutions([
        { _id: 's1', title: 'SmartBin: IoT-Enabled Waste Collection Optimization System', status: 'under-review', scorecard: { totalScore: 7.85 }, proposedApproach: 'IoT sensors + AI route optimization', technology: ['IoT Sensors', 'Machine Learning', 'Mobile App', 'Cloud Platform'] },
        { _id: 's2', title: 'GreenRoute: AI-Powered Collection Fleet Management', status: 'submitted', scorecard: null, proposedApproach: 'Fleet management with predictive analytics', technology: ['GPS Tracking', 'Predictive Analytics', 'Mobile App'] }
      ]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted rounded-lg" />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/challenges" className="hover:text-foreground">Challenges</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{challenge.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${getStatusColor(challenge.status)} capitalize`}>{challenge.status}</Badge>
              <Badge variant="outline" className={`${getSeverityColor(challenge.severity)} capitalize`}>
                {challenge.severity} severity
              </Badge>
              {challenge.verificationStatus === 'verified' && (
                <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">{challenge.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><span className="text-base">{getCategoryIcon(challenge.category)}</span> {challenge.category}{challenge.subcategory ? ` → ${challenge.subcategory}` : ''}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {challenge.location?.city}, {challenge.location?.state}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(challenge.createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Problem Description</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">{challenge.description}</p>
            </CardContent>
          </Card>

          {/* Impact & Consequences */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Impact & Consequences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {challenge.currentConsequences && (
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" /> Current Consequences
                  </h4>
                  <p className="text-sm text-muted-foreground">{challenge.currentConsequences}</p>
                </div>
              )}
              {challenge.existingAttempts && (
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" /> Existing Attempts
                  </h4>
                  <p className="text-sm text-muted-foreground">{challenge.existingAttempts}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" /> Desired Outcome
                </h4>
                <p className="text-sm text-muted-foreground">{challenge.desiredOutcome}</p>
              </div>
            </CardContent>
          </Card>

          {/* Constraints & Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenge.constraints && (
              <Card>
                <CardHeader><CardTitle className="text-sm">Constraints</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{challenge.constraints}</p>
                </CardContent>
              </Card>
            )}
            {challenge.availableResources && (
              <Card>
                <CardHeader><CardTitle className="text-sm">Available Resources</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{challenge.availableResources}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Solutions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Solutions ({solutions.length})</CardTitle>
              <Link href={`/solutions/submit?challenge=${challenge._id}`}>
                <Button size="sm" className="gradient-primary">Submit Solution</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {solutions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No solutions submitted yet. Be the first to propose a solution!
                </p>
              ) : (
                <div className="space-y-3">
                  {solutions.map((sol) => (
                    <Link key={sol._id} href={`/solutions/${sol._id}`}>
                      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{sol.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{sol.proposedApproach}</p>
                            <div className="flex gap-1 mt-2">
                              {(sol.technology || []).slice(0, 3).map((t: string) => (
                                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(sol.status)} capitalize text-xs`}>{sol.status}</Badge>
                            {sol.scorecard && (
                              <div className="mt-2 text-lg font-bold text-primary">{sol.scorecard.totalScore}/10</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Key Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Affected Population</span>
                <span className="font-bold">{formatNumber(challenge.affectedPopulation)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Zap className="h-4 w-4" /> Urgency</span>
                <Badge variant="outline" className={`capitalize ${getSeverityColor(challenge.urgency)}`}>{challenge.urgency}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Rocket className="h-4 w-4" /> Teams</span>
                <span className="font-bold">{challenge.numberOfTeams || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Solutions</span>
                <span className="font-bold">{challenge.numberOfSolutions || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Required Expertise */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Required Expertise</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(challenge.suggestedExpertise || []).map((exp: string) => (
                  <Badge key={exp} variant="secondary">{exp}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Participating Organizations */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Participating Organizations</CardTitle></CardHeader>
            <CardContent>
              {(challenge.participatingOrganizations || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No organizations participating yet</p>
              ) : (
                <div className="space-y-2">
                  {challenge.participatingOrganizations.map((org: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{typeof org === 'object' ? org.name : org}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {challenge.aiAnalysis && (
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-blue-700 dark:text-blue-400 italic">
                  AI-assisted analysis — requires human verification
                </p>
                <div>
                  <h5 className="text-xs font-medium mb-1">Classification</h5>
                  <p className="text-sm">{challenge.aiAnalysis.classification}</p>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1">Impact Score</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-blue-100 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${challenge.aiAnalysis.impactScore}%` }} />
                    </div>
                    <span className="text-sm font-bold">{challenge.aiAnalysis.impactScore}/100</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1">Urgency Score</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-orange-100 rounded-full">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${challenge.aiAnalysis.urgencyScore}%` }} />
                    </div>
                    <span className="text-sm font-bold">{challenge.aiAnalysis.urgencyScore}/100</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1">Recommended Expertise</h5>
                  <div className="flex flex-wrap gap-1">
                    {(challenge.aiAnalysis.requiredExpertise || []).map((e: string) => (
                      <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Link href={`/solutions/submit?challenge=${challenge._id}`} className="block">
                <Button className="w-full gradient-primary">
                  <Lightbulb className="h-4 w-4 mr-2" /> Submit Solution
                </Button>
              </Link>
              <Link href="/collaborate" className="block">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" /> Collaborate
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
