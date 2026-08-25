'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { challengesAPI } from '@/lib/api';
import { formatNumber, formatDate, getStatusColor, getSeverityColor, getCategoryIcon } from '@/lib/utils';
import {
  Search, Filter, MapPin, Users, Calendar, ArrowRight, ChevronLeft, ChevronRight,
  SlidersHorizontal, X, Plus, Lightbulb
} from 'lucide-react';

const categories = ['Environment', 'Healthcare', 'Education', 'Transportation', 'Agriculture', 'Infrastructure', 'Social Welfare', 'Technology'];
const severities = ['critical', 'high', 'medium', 'low'];
const statuses = ['submitted', 'verified', 'open', 'in-progress', 'solved', 'implemented'];
const states = ['Jharkhand', 'Bihar', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Delhi', 'West Bengal'];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '', category: '', state: '', severity: '', status: ''
  });

  useEffect(() => {
    loadChallenges();
  }, [filters, pagination.page]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.page, limit: 12 };
      if (filters.category) params.category = filters.category;
      if (filters.state) params.state = filters.state;
      if (filters.severity) params.severity = filters.severity;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      
      const res = await challengesAPI.getAll(params);
      setChallenges(res.data.challenges);
      setPagination(res.data.pagination);
    } catch {
      setChallenges([
        { _id: '1', title: 'Smart Waste Collection for Urban Wards', description: 'Ranchi city generates approximately 450 tonnes of municipal solid waste daily...', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand' }, severity: 'high', urgency: 'high', affectedPopulation: 25000, status: 'open', suggestedExpertise: ['IoT', 'AI', 'Data Science', 'Operations Research', 'Environmental Engineering'], createdAt: '2024-01-15', numberOfTeams: 3, numberOfSolutions: 2, submittedBy: { name: 'Rahul Singh', role: 'citizen' } },
        { _id: '2', title: 'Rural Water Quality Monitoring System', description: 'Over 200 villages in rural Bihar rely on groundwater sources that are increasingly contaminated...', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar' }, severity: 'critical', urgency: 'critical', affectedPopulation: 150000, status: 'open', suggestedExpertise: ['IoT', 'Environmental Engineering', 'Data Analytics'], createdAt: '2024-01-20', numberOfTeams: 2, numberOfSolutions: 1, submittedBy: { name: 'Anita Devi', role: 'citizen' } },
        { _id: '3', title: 'Traffic Congestion Prediction in Smart Cities', description: 'Mumbai experiences severe traffic congestion during peak hours...', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra' }, severity: 'high', urgency: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['AI/ML', 'Computer Vision', 'Data Science', 'IoT', 'Urban Planning'], createdAt: '2024-02-01', numberOfTeams: 4, numberOfSolutions: 3, submittedBy: { name: 'Prof. Amit Verma', role: 'university' } },
        { _id: '4', title: 'Telemedicine for Remote Healthcare Access', description: 'Remote villages in Telangana have limited access to healthcare...', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana' }, severity: 'critical', urgency: 'critical', affectedPopulation: 75000, status: 'open', suggestedExpertise: ['Healthcare', 'Mobile Development', 'AI/ML', 'IoT'], createdAt: '2024-02-10', numberOfTeams: 2, numberOfSolutions: 1, submittedBy: { name: 'Dr. Sanjay Kumar', role: 'expert' } },
        { _id: '5', title: 'Urban Flood Prevention Using IoT and AI', description: 'Chennai faces recurring urban floods during monsoon seasons...', category: 'Infrastructure', location: { city: 'Chennai', state: 'Tamil Nadu' }, severity: 'critical', urgency: 'critical', affectedPopulation: 300000, status: 'open', suggestedExpertise: ['IoT', 'AI/ML', 'GIS', 'Civil Engineering'], createdAt: '2024-02-15', numberOfTeams: 3, numberOfSolutions: 2, submittedBy: { name: 'Dr. Sunita Reddy', role: 'university' } },
        { _id: '6', title: 'Digital Education Access for Underprivileged Students', description: 'Millions of students in rural and semi-urban areas lack access to quality digital education...', category: 'Education', location: { city: 'Patna', state: 'Bihar' }, severity: 'high', urgency: 'high', affectedPopulation: 500000, status: 'open', suggestedExpertise: ['EdTech', 'Mobile Development', 'AI/ML', 'UX Design'], createdAt: '2024-02-20', numberOfTeams: 5, numberOfSolutions: 4, submittedBy: { name: 'Anita Devi', role: 'citizen' } },
        { _id: '7', title: 'Agricultural Supply Chain Optimization', description: 'Farmers in Jharkhand lose 25-40% of their produce due to inefficient supply chains...', category: 'Agriculture', location: { city: 'Ranchi', state: 'Jharkhand' }, severity: 'high', urgency: 'high', affectedPopulation: 200000, status: 'open', suggestedExpertise: ['Supply Chain', 'Mobile Development', 'AI/ML', 'Blockchain'], createdAt: '2024-03-01', numberOfTeams: 2, numberOfSolutions: 1, submittedBy: { name: 'Rahul Singh', role: 'citizen' } },
        { _id: '8', title: 'Public Transport Route Optimization', description: 'The public bus transport system in Kolkata suffers from poorly optimized routes...', category: 'Transportation', location: { city: 'Kolkata', state: 'West Bengal' }, severity: 'high', urgency: 'medium', affectedPopulation: 1000000, status: 'open', suggestedExpertise: ['Data Science', 'AI/ML', 'Mobile Development', 'Operations Research'], createdAt: '2024-03-05', numberOfTeams: 1, numberOfSolutions: 0, submittedBy: { name: 'Green Earth Foundation', role: 'citizen' } }
      ]);
      setPagination({ page: 1, pages: 1, total: 8 });
    }
    setLoading(false);
  };

  const activeFilters = Object.entries(filters).filter(([_, v]) => v).length;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Challenge Discovery</h1>
          <p className="text-muted-foreground mt-1">
            Explore societal challenges seeking innovative solutions
          </p>
        </div>
        <Link href="/challenges/submit">
          <Button className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Submit Challenge
          </Button>
        </Link>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges by title, description, or expertise..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilters > 0 && <Badge className="ml-1">{activeFilters}</Badge>}
          </Button>
          <Link href="/challenges/map">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" /> Map View
            </Button>
          </Link>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{getCategoryIcon(c)} {c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.state} onValueChange={(v) => setFilters({ ...filters, state: v })}>
                  <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>
                    {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.severity} onValueChange={(v) => setFilters({ ...filters, severity: v })}>
                  <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                  <SelectContent>
                    {severities.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {activeFilters > 0 && (
                  <Button variant="ghost" onClick={() => setFilters({ search: filters.search, category: '', state: '', severity: '', status: '' })}>
                    <X className="h-4 w-4 mr-1" /> Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {challenges.length} of {pagination.total} challenges
      </div>

      {/* Challenge Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-4 bg-muted rounded w-20 mb-3" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <Link key={challenge._id} href={`/challenges/${challenge._id}`}>
              <Card className="hover:shadow-md transition-all group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getStatusColor(challenge.status)} capitalize text-xs`}>
                      {challenge.status}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getSeverityColor(challenge.severity)}`}>
                      {challenge.severity}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {challenge.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span className="text-base">{getCategoryIcon(challenge.category)}</span>
                    <span>{challenge.category}</span>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{challenge.location?.city}, {challenge.location?.state}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(challenge.suggestedExpertise || []).slice(0, 3).map((exp: string) => (
                      <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
                    ))}
                    {(challenge.suggestedExpertise || []).length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{challenge.suggestedExpertise.length - 3}</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {formatNumber(challenge.affectedPopulation)} affected</span>
                    <span>{challenge.numberOfTeams || 0} teams</span>
                    <span>{challenge.numberOfSolutions || 0} solutions</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
