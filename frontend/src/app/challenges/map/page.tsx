'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber, getStatusColor, getSeverityColor, getCategoryIcon } from '@/lib/utils';
import { MapPin, Users, ArrowRight, Layers, X, Filter } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const challenges = [
  { _id: '1', title: 'Smart Waste Collection', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } }, severity: 'high', affectedPopulation: 25000, status: 'open', numberOfSolutions: 2 },
  { _id: '2', title: 'Rural Water Quality Monitoring', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.6093, lng: 85.1376 } }, severity: 'critical', affectedPopulation: 150000, status: 'open', numberOfSolutions: 1 },
  { _id: '3', title: 'Traffic Congestion Prediction', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 } }, severity: 'high', affectedPopulation: 500000, status: 'open', numberOfSolutions: 3 },
  { _id: '4', title: 'Telemedicine for Remote Areas', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } }, severity: 'critical', affectedPopulation: 75000, status: 'open', numberOfSolutions: 1 },
  { _id: '5', title: 'Urban Flood Prevention', category: 'Infrastructure', location: { city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } }, severity: 'critical', affectedPopulation: 300000, status: 'open', numberOfSolutions: 2 },
  { _id: '6', title: 'Digital Education Access', category: 'Education', location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.5913, lng: 85.1376 } }, severity: 'high', affectedPopulation: 500000, status: 'open', numberOfSolutions: 4 },
  { _id: '7', title: 'Agricultural Supply Chain', category: 'Agriculture', location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3696, lng: 85.3096 } }, severity: 'high', affectedPopulation: 200000, status: 'open', numberOfSolutions: 1 },
  { _id: '8', title: 'Public Transport Optimization', category: 'Transportation', location: { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } }, severity: 'high', affectedPopulation: 1000000, status: 'open', numberOfSolutions: 0 },
];

const categoryColors: Record<string, string> = {
  'Environment': '#22c55e',
  'Healthcare': '#ef4444',
  'Education': '#3b82f6',
  'Transportation': '#f59e0b',
  'Agriculture': '#84cc16',
  'Infrastructure': '#8b5cf6',
  'Social Welfare': '#ec4899',
};

export default function ChallengeMapPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const filteredChallenges = categoryFilter === 'all'
    ? challenges
    : challenges.filter(c => c.category === categoryFilter);

  const createIcon = (color: string) => {
    if (!L) return undefined;
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Challenge Map</h1>
          <p className="text-muted-foreground mt-1">Explore societal challenges geographically across India</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.keys(categoryColors).map(cat => (
                <SelectItem key={cat} value={cat}>{getCategoryIcon(cat)} {cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <div className="h-[500px] lg:h-[600px] relative">
              {L ? (
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredChallenges.map((challenge) => {
                    const coords = challenge.location.coordinates;
                    if (!coords) return null;
                    return (
                      <Marker
                        key={challenge._id}
                        position={[coords.lat, coords.lng]}
                        icon={createIcon(categoryColors[challenge.category] || '#666')}
                        eventHandlers={{
                          click: () => setSelectedChallenge(challenge)
                        }}
                      >
                        <Popup>
                          <div className="min-w-[200px]">
                            <h3 className="font-semibold text-sm">{challenge.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{challenge.category} • {challenge.location.city}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <span className={`inline-block w-2 h-2 rounded-full ${challenge.severity === 'critical' ? 'bg-red-500' : challenge.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                              <span className="text-xs capitalize">{challenge.severity}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs">{challenge.numberOfSolutions} solutions</span>
                            </div>
                            <Link href={`/challenges/${challenge._id}`}>
                              <button className="mt-2 text-xs text-blue-600 hover:underline font-medium">View Challenge →</button>
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              ) : (
                <div className="h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              )}
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 z-[1000]">
                <h4 className="text-xs font-semibold mb-2">Categories</h4>
                <div className="space-y-1">
                  {Object.entries(categoryColors).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs">{getCategoryIcon(cat)} {cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Challenges ({filteredChallenges.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-3 max-h-[600px] overflow-y-auto space-y-2">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedChallenge?._id === challenge._id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: categoryColors[challenge.category] }} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{challenge.title}</h4>
                      <p className="text-xs text-muted-foreground">{challenge.location.city}, {challenge.location.state}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[10px] ${getSeverityColor(challenge.severity)}`}>{challenge.severity}</Badge>
                        <span className="text-[10px] text-muted-foreground">{formatNumber(challenge.affectedPopulation)} affected</span>
                      </div>
                      <Link href={`/challenges/${challenge._id}`} className="mt-2 inline-flex items-center text-xs text-primary hover:underline">
                        View Details <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
