'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { solutionsAPI } from '@/lib/api';
import { getStatusColor, formatDate, formatNumber } from '@/lib/utils';
import { Plus, Rocket, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const demoSolutions = [
  { _id: 's1', title: 'SmartBin: IoT-Enabled Waste Collection', challenge: { title: 'Smart Waste Collection for Urban Wards', category: 'Environment' }, status: 'under-review', scorecard: { totalScore: 7.85 }, technology: ['IoT Sensors', 'Machine Learning', 'Mobile App'], estimatedCost: 2500000, submittedBy: { name: 'Prof. Amit Verma' }, team: { name: 'EcoTech Solutions' }, createdAt: '2024-03-15' },
  { _id: 's2', title: 'AquaSense: Rural Water Quality Monitor', challenge: { title: 'Rural Water Quality Monitoring System', category: 'Healthcare' }, status: 'submitted', scorecard: null, technology: ['IoT Sensors', 'LoRaWAN', 'Solar Power'], estimatedCost: 1800000, submittedBy: { name: 'Dr. Sunita Reddy' }, team: { name: 'WaterGuard India' }, createdAt: '2024-03-20' },
  { _id: 's3', title: 'TrafficPulse: AI Traffic Management', challenge: { title: 'Traffic Congestion Prediction', category: 'Transportation' }, status: 'pilot', scorecard: { totalScore: 8.05 }, technology: ['Computer Vision', 'Deep Learning', 'Edge Computing'], estimatedCost: 5000000, submittedBy: { name: 'Prof. Amit Verma' }, team: { name: 'TrafficAI Labs' }, createdAt: '2024-04-01' },
];

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await solutionsAPI.getAll();
        setSolutions(res.data.solutions);
      } catch { setSolutions(demoSolutions); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Solutions</h1>
          <p className="text-muted-foreground mt-1">Explore collaborative solutions to societal challenges</p>
        </div>
        <Link href="/solutions/submit">
          <Button className="gradient-primary"><Plus className="h-4 w-4 mr-2" /> Submit Solution</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Card key={i} className="animate-pulse"><CardContent className="p-6 h-48 bg-muted" /></Card>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(solutions.length > 0 ? solutions : demoSolutions).map((sol) => (
            <Link key={sol._id} href={`/solutions/${sol._id}`}>
              <Card className="hover:shadow-md transition-all h-full group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getStatusColor(sol.status)} capitalize text-xs`}>{sol.status}</Badge>
                    {sol.scorecard && <div className="text-lg font-bold text-primary">{sol.scorecard.totalScore}/10</div>}
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">{sol.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{sol.challenge?.title || 'Challenge'}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(sol.technology || []).map((t: string) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>by {sol.submittedBy?.name || 'Team'}</span>
                    <span>₹{(sol.estimatedCost / 100000).toFixed(1)}L</span>
                    <span>{formatDate(sol.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
