'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsAPI, challengesAPI } from '@/lib/api';
import { formatNumber, getCategoryIcon, getStatusColor, formatDate } from '@/lib/utils';
import {
  ArrowRight, ChevronRight, Lightbulb, Users, Building2, Target,
  TrendingUp, MapPin, CheckCircle2, Zap, Globe, Shield, Brain,
  Rocket, BarChart3, ArrowDown, Sparkles, GraduationCap, Factory,
  Landmark, Heart, Play
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [recentChallenges, setRecentChallenges] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [overviewRes, challengesRes] = await Promise.all([
        analyticsAPI.getOverview(),
        challengesAPI.getAll({ limit: 4, status: 'open' })
      ]);
      setStats(overviewRes.data.overview);
      setRecentChallenges(challengesRes.data.challenges);
    } catch (error) {
      // Use demo stats
      setStats({
        challenges: { total: 156, verified: 89, open: 45, inProgress: 23, solved: 15, implemented: 6 },
        solutions: { total: 87, approved: 34, pilot: 12 },
        organizations: { total: 120, universities: 45, industries: 38, government: 18, ngos: 19 },
        users: 2847,
        activeCollaborations: 67,
        totalPeopleImpacted: 425000
      });
    }
  };

  const liveStats = stats ? [
    { label: 'Challenges Submitted', value: stats.challenges?.total || 156, icon: Lightbulb, color: 'text-blue-600' },
    { label: 'Verified Challenges', value: stats.challenges?.verified || 89, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Active Collaborations', value: stats.activeCollaborations || 67, icon: Users, color: 'text-purple-600' },
    { label: 'Solutions Developed', value: stats.solutions?.total || 87, icon: Target, color: 'text-orange-600' },
    { label: 'Solutions Implemented', value: stats.solutions?.pilot || 12, icon: Rocket, color: 'text-indigo-600' },
    { label: 'People Impacted', value: stats.totalPeopleImpacted || 425000, icon: Heart, color: 'text-rose-600' },
  ] : [];

  const ecosystemSteps = [
    { icon: Users, label: 'Citizen', desc: 'Identifies a societal challenge', color: 'bg-blue-500' },
    { icon: Lightbulb, label: 'Challenge', desc: 'Problem is crowdsourced', color: 'bg-orange-500' },
    { icon: Brain, label: 'AI Analysis', desc: 'Intelligent classification & matching', color: 'bg-purple-500' },
    { icon: GraduationCap, label: 'University', desc: 'Academic expertise & research', color: 'bg-green-500' },
    { icon: Factory, label: 'Industry', desc: 'Technology & resources', color: 'bg-indigo-500' },
    { icon: Landmark, label: 'Government', desc: 'Verification & approval', color: 'bg-red-500' },
    { icon: Rocket, label: 'Solution', desc: 'Collaborative innovation', color: 'bg-cyan-500' },
    { icon: BarChart3, label: 'Impact', desc: 'Measurable social outcomes', color: 'bg-emerald-500' },
  ];

  const portalCards = [
    { href: '/university', icon: GraduationCap, title: 'University Portal', desc: 'Discover challenges, form teams, and apply academic expertise to real-world problems', color: 'from-green-500 to-emerald-600' },
    { href: '/industry', icon: Factory, title: 'Industry Portal', desc: 'Mentor teams, provide technology, fund pilots, and evaluate prototypes', color: 'from-indigo-500 to-blue-600' },
    { href: '/government', icon: Landmark, title: 'Government Portal', desc: 'Verify challenges, approve solutions, and monitor implementation', color: 'from-red-500 to-orange-600' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMS0ydjJoLTJ2LTJoMnpNMzUgMzZ2MmgtMnYtMmgyek0zNSAzMnY0aC0ydi00aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Smart India Hackathon 2024
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Samadhan
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Hub</span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white/90">
              Real Problems. Collective Intelligence. Measurable Solutions.
            </p>
            
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Connect communities, universities and industries to transform societal challenges into scalable, implementable solutions.
            </p>

            {/* Ecosystem Flow */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              {ecosystemSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.label}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`h-12 w-12 rounded-xl ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/80">{step.label}</span>
                    </div>
                    {i < ecosystemSteps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-white/40 mt-[-16px] hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/challenges/submit">
                <Button size="xl" className="gradient-primary text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40">
                  Submit a Challenge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/challenges">
                <Button size="xl" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
                  Explore Challenges
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Live Stats */}
      <section className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {liveStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{formatNumber(stat.value)}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How SamadhanHub Works</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Our platform converts societal problems into collaborative innovation challenges through a structured, measurable workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Lightbulb, title: 'Discover', desc: 'Citizens and communities identify and submit societal challenges from across India', color: 'bg-blue-500' },
              { step: '02', icon: Brain, title: 'Analyze & Match', desc: 'AI analyzes the challenge, classifies it, and matches with relevant universities and industry partners', color: 'bg-purple-500' },
              { step: '03', icon: Users, title: 'Collaborate', desc: 'Teams form, experts join as mentors, and collaborative solutions are developed in dedicated workspaces', color: 'bg-green-500' },
              { step: '04', icon: Target, title: 'Implement & Measure', desc: 'Approved solutions go through pilots, implementation, and measurable impact assessment', color: 'bg-orange-500' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="relative overflow-hidden hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-bold text-primary mb-1">Step {item.step}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenge Map CTA */}
      <section className="container py-16">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 text-white">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">Live Map</Badge>
              <h2 className="text-3xl font-bold mb-4">Explore Challenge Map</h2>
              <p className="text-white/80 mb-6">
                See societal challenges geographically across India. Filter by category, severity, and status. 
                Click on markers to view challenge details.
              </p>
              <Link href="/challenges/map">
                <Button className="bg-white text-blue-700 hover:bg-white/90">
                  Open Interactive Map
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-muted to-muted/50 p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-4">
                {[
                  { label: 'Challenges across India', count: '156', icon: MapPin },
                  { label: 'States covered', count: '18', icon: Globe },
                  { label: 'Active solutions', count: '45', icon: Rocket },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Portals */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Dedicated Portals</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Specialized dashboards for every stakeholder in the ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portalCards.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link key={portal.href} href={portal.href}>
                  <Card className="h-full hover:shadow-lg transition-all group cursor-pointer overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${portal.color}`} />
                    <CardContent className="p-6">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{portal.title}</h3>
                      <p className="text-sm text-muted-foreground">{portal.desc}</p>
                      <div className="mt-4 flex items-center text-sm text-primary font-medium">
                        Explore Portal <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Challenges */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Recent Challenges</h2>
            <p className="text-muted-foreground mt-2">Explore active societal challenges seeking innovative solutions</p>
          </div>
          <Link href="/challenges">
            <Button variant="outline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(recentChallenges.length > 0 ? recentChallenges : [
            { _id: '1', title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand' }, severity: 'high', affectedPopulation: 25000, status: 'open', suggestedExpertise: ['IoT', 'AI', 'Data Science'], createdAt: '2024-01-15', numberOfTeams: 3, submittedBy: { name: 'Rahul Singh', role: 'citizen' } },
            { _id: '2', title: 'Rural Water Quality Monitoring System', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar' }, severity: 'critical', affectedPopulation: 150000, status: 'open', suggestedExpertise: ['IoT', 'Environmental Engineering'], createdAt: '2024-01-20', numberOfTeams: 2, submittedBy: { name: 'Anita Devi', role: 'citizen' } },
            { _id: '3', title: 'Traffic Congestion Prediction in Smart Cities', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra' }, severity: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['AI/ML', 'Computer Vision', 'Data Science'], createdAt: '2024-02-01', numberOfTeams: 4, submittedBy: { name: 'Prof. Amit Verma', role: 'university' } },
            { _id: '4', title: 'Telemedicine for Remote Healthcare Access', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana' }, severity: 'critical', affectedPopulation: 75000, status: 'open', suggestedExpertise: ['Healthcare', 'Mobile Development', 'AI/ML'], createdAt: '2024-02-10', numberOfTeams: 2, submittedBy: { name: 'Dr. Sanjay Kumar', role: 'expert' } },
          ]).map((challenge: any) => (
            <Link key={challenge._id} href={`/challenges/${challenge._id}`}>
              <Card className="hover:shadow-md transition-all group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getStatusColor(challenge.status)} capitalize`}>
                      {challenge.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {challenge.severity} severity
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2">
                    {challenge.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{getCategoryIcon(challenge.category)}</span>
                    <span>{challenge.category}</span>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{challenge.location?.city}, {challenge.location?.state}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(challenge.suggestedExpertise || []).slice(0, 3).map((exp: string) => (
                      <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatNumber(challenge.affectedPopulation)} affected</span>
                    <span>{challenge.numberOfTeams} teams participating</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-y">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Submit your societal challenge or join as a collaborator. Together, we can build scalable solutions for India&apos;s most pressing problems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/challenges/submit">
              <Button size="lg" className="gradient-primary">
                Submit a Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/challenges">
              <Button size="lg" variant="outline">
                Browse Challenges
              </Button>
            </Link>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Demo Data</Badge>
            All data shown is for demonstration purposes only
          </div>
        </div>
      </section>
    </div>
  );
}
