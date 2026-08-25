'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsAPI, challengesAPI } from '@/lib/api';
import { formatNumber, getCategoryIcon, getStatusColor, formatDate } from '@/lib/utils';
import {
  ArrowRight, ChevronRight, Lightbulb, Users, Target,
  MapPin, CheckCircle2, Globe, Brain,
  Rocket, BarChart3, Sparkles, GraduationCap, Factory,
  Landmark, Heart, ArrowUpRight, Zap, Shield, TrendingUp
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
    } catch {
      setStats({
        challenges: { total: 156, verified: 89, open: 45, inProgress: 23, solved: 15, implemented: 6 },
        solutions: { total: 87, approved: 34, pilot: 12 },
        organizations: { total: 120, universities: 45, industries: 38, government: 18, ngos: 19 },
        users: 2847,
        activeCollaborations: 67,
        totalPeopleImpacted: 425000
      });
      setRecentChallenges([
        { _id: '1', title: 'Smart Waste Collection for Urban Wards', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand' }, severity: 'high', affectedPopulation: 25000, status: 'open', suggestedExpertise: ['IoT', 'AI', 'Data Science'], createdAt: '2024-01-15', numberOfTeams: 3, submittedBy: { name: 'Rahul Singh', role: 'citizen' } },
        { _id: '2', title: 'Rural Water Quality Monitoring System', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar' }, severity: 'critical', affectedPopulation: 150000, status: 'open', suggestedExpertise: ['IoT', 'Environmental Engineering'], createdAt: '2024-01-20', numberOfTeams: 2, submittedBy: { name: 'Anita Devi', role: 'citizen' } },
        { _id: '3', title: 'Traffic Congestion Prediction in Smart Cities', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra' }, severity: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['AI/ML', 'Computer Vision', 'Data Science'], createdAt: '2024-02-01', numberOfTeams: 4, submittedBy: { name: 'Prof. Amit Verma', role: 'university' } },
        { _id: '4', title: 'Telemedicine for Remote Healthcare Access', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana' }, severity: 'critical', affectedPopulation: 75000, status: 'open', suggestedExpertise: ['Healthcare', 'Mobile Development', 'AI/ML'], createdAt: '2024-02-10', numberOfTeams: 2, submittedBy: { name: 'Dr. Sanjay Kumar', role: 'expert' } },
      ]);
    }
  };

  const liveStats = stats ? [
    { label: 'Challenges Submitted', value: stats.challenges?.total || 156, icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Verified Challenges', value: stats.challenges?.verified || 89, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Active Collaborations', value: stats.activeCollaborations || 67, icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { label: 'Solutions Developed', value: stats.solutions?.total || 87, icon: Target, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Solutions Implemented', value: stats.solutions?.pilot || 12, icon: Rocket, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { label: 'People Impacted', value: stats.totalPeopleImpacted || 425000, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  ] : [];

  const ecosystemSteps = [
    { icon: Users, label: 'Citizen', color: 'from-blue-500 to-blue-600' },
    { icon: Lightbulb, label: 'Challenge', color: 'from-amber-500 to-orange-500' },
    { icon: Brain, label: 'AI Analysis', color: 'from-violet-500 to-purple-600' },
    { icon: GraduationCap, label: 'University', color: 'from-emerald-500 to-green-600' },
    { icon: Factory, label: 'Industry', color: 'from-indigo-500 to-blue-600' },
    { icon: Landmark, label: 'Government', color: 'from-rose-500 to-red-600' },
    { icon: Rocket, label: 'Solution', color: 'from-cyan-500 to-teal-500' },
    { icon: BarChart3, label: 'Impact', color: 'from-emerald-400 to-green-500' },
  ];

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0" />
        {/* Ambient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="container relative py-24 lg:py-36">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2 text-sm font-medium text-white/80 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Collaborative Innovation Platform
            </div>

            {/* Title */}
            <h1 className="animate-fade-up animate-fade-up-delay-1 text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
              Samadhan
              <span className="text-gradient">Hub</span>
            </h1>

            {/* Tagline */}
            <p className="animate-fade-up animate-fade-up-delay-2 text-xl sm:text-2xl lg:text-[1.75rem] font-medium text-white/90 leading-snug mb-4">
              Real Problems. Collective Intelligence.<br className="hidden sm:block" /> Measurable Solutions.
            </p>

            <p className="animate-fade-up animate-fade-up-delay-3 text-base sm:text-lg text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect communities, universities, and industries to transform societal challenges into scalable, implementable solutions.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up animate-fade-up-delay-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/challenges/submit">
                <Button size="xl" className="gradient-primary text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200 px-8">
                  Submit a Challenge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/challenges">
                <Button size="xl" variant="ghost" className="text-base font-semibold text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm px-8">
                  Explore Challenges
                </Button>
              </Link>
            </div>

            {/* Ecosystem Flow */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
              {ecosystemSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.label}>
                    <div className="flex flex-col items-center gap-1.5 group">
                      <div className={`h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-lg sm:rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-medium text-white/60 tracking-wide uppercase whitespace-nowrap">{step.label}</span>
                    </div>
                    {i < ecosystemSteps.length - 1 && (
                      <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/20 mt-[-16px]" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0c1222] to-transparent" />
      </section>

      {/* ── Stats ── */}
      <section className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {liveStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`shadow-card hover:shadow-card-hover transition-all duration-200 border-0 ${stat.bg}`}>
                <CardContent className="p-4 text-center">
                  <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold tracking-tight">{formatNumber(stat.value)}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 font-medium leading-tight">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 mt-8">
        <div className="container">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-xs font-medium">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              From Problem to Impact
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A structured pipeline that converts real-world challenges into measurable social outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', icon: Lightbulb, title: 'Discover', desc: 'Citizens and communities identify societal challenges from across India', color: 'bg-blue-500', border: 'border-blue-100 dark:border-blue-900/30' },
              { step: '02', icon: Brain, title: 'Analyze & Match', desc: 'AI classifies, scores impact, and matches with the right universities and industry partners', color: 'bg-violet-500', border: 'border-violet-100 dark:border-violet-900/30' },
              { step: '03', icon: Users, title: 'Collaborate', desc: 'Teams form, experts join as mentors, and solutions are built in dedicated workspaces', color: 'bg-emerald-500', border: 'border-emerald-100 dark:border-emerald-900/30' },
              { step: '04', icon: Target, title: 'Implement & Measure', desc: 'Approved solutions go through pilots, deployment, and measurable impact assessment', color: 'bg-amber-500', border: 'border-amber-100 dark:border-amber-900/30' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className={`relative overflow-hidden hover:shadow-card-hover transition-all duration-200 group border ${item.border}`}>
                  <CardContent className="p-6">
                    <div className={`h-11 w-11 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1.5">Step {item.step}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Challenge Map CTA ── */}
      <section className="pb-20">
        <div className="container">
          <Card className="overflow-hidden border-0 shadow-elevated">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 lg:p-14 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative">
                  <Badge className="bg-white/10 text-white border-white/15 mb-5 text-xs">Interactive Map</Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">Explore Challenge Map</h2>
                  <p className="text-white/60 mb-8 leading-relaxed max-w-md">
                    See societal challenges geographically across India. Filter by category, severity, and status. Click markers for details.
                  </p>
                  <Link href="/challenges/map">
                    <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold shadow-lg">
                      Open Interactive Map
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10 lg:p-14 flex flex-col justify-center">
                <div className="space-y-6">
                  {[
                    { label: 'Challenges across India', count: '156', icon: MapPin, color: 'text-blue-500' },
                    { label: 'States covered', count: '18', icon: Globe, color: 'text-emerald-500' },
                    { label: 'Active solutions', count: '45', icon: Rocket, color: 'text-violet-500' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-card flex items-center justify-center">
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold tracking-tight">{item.count}</div>
                          <div className="text-sm text-muted-foreground">{item.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Portals ── */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-xs font-medium">Stakeholder Portals</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Dedicated Dashboards</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Specialized interfaces designed for every participant in the ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { href: '/university', icon: GraduationCap, title: 'University Portal', desc: 'Discover challenges, form teams, assign faculty mentors, and apply academic expertise to real-world problems.', gradient: 'from-emerald-500 to-green-600', accent: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30' },
              { href: '/industry', icon: Factory, title: 'Industry Portal', desc: 'Mentor university teams, provide technology and infrastructure, fund pilots, and evaluate prototypes.', gradient: 'from-indigo-500 to-blue-600', accent: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/30' },
              { href: '/government', icon: Landmark, title: 'Government Portal', desc: 'Verify challenges, invite universities and industry partners, approve solutions, and monitor implementation.', gradient: 'from-rose-500 to-red-600', accent: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30' },
            ].map((portal) => {
              const Icon = portal.icon;
              return (
                <Link key={portal.href} href={portal.href}>
                  <Card className={`h-full hover:shadow-card-hover transition-all duration-200 group cursor-pointer border ${portal.accent}`}>
                    <div className={`h-1.5 bg-gradient-to-r ${portal.gradient}`} />
                    <CardContent className="p-7">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{portal.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{portal.desc}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all duration-200">
                        Explore Portal <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recent Challenges ── */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="outline" className="mb-4 text-xs font-medium">Latest</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Active Challenges</h2>
              <p className="text-muted-foreground mt-2">Societal problems seeking innovative solutions</p>
            </div>
            <Link href="/challenges" className="hidden sm:block">
              <Button variant="outline" className="gap-2 font-medium">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(recentChallenges.length > 0 ? recentChallenges : []).map((challenge) => (
              <Link key={challenge._id} href={`/challenges/${challenge._id}`}>
                <Card className="hover:shadow-card-hover transition-all duration-200 group h-full border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getStatusColor(challenge.status)} capitalize text-[11px] font-medium`}>
                        {challenge.status}
                      </Badge>
                      <Badge variant="outline" className="text-[11px] capitalize">
                        {challenge.severity}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200 mb-2 leading-snug">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span>{getCategoryIcon(challenge.category)}</span>
                      <span>{challenge.category}</span>
                      <span className="text-border">·</span>
                      <MapPin className="h-3 w-3" />
                      <span>{challenge.location?.city}, {challenge.location?.state}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(challenge.suggestedExpertise || []).slice(0, 3).map((exp: string) => (
                        <Badge key={exp} variant="secondary" className="text-[10px] font-medium">{exp}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {formatNumber(challenge.affectedPopulation)} affected</span>
                      <span>{challenge.numberOfTeams || 0} teams</span>
                      <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all duration-200">
                        Details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/challenges">
              <Button variant="outline" className="gap-2 font-medium">
                View All Challenges <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="container text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Submit your societal challenge or join as a collaborator. Together, we can build scalable solutions for India&apos;s most pressing problems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/challenges/submit">
              <Button size="lg" className="gradient-primary font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 px-8">
                Submit a Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/challenges">
              <Button size="lg" variant="outline" className="font-semibold px-8">
                Browse Challenges
              </Button>
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-[10px] font-medium px-2 py-0.5">Demo</Badge>
            All data shown is for demonstration purposes only
          </div>
        </div>
      </section>
    </div>
  );
}
