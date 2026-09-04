'use client';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber, getStatusColor, getSeverityColor, getCategoryIcon, formatDate } from '@/lib/utils';
import { challengesAPI } from '@/lib/api';
import { MapPin, Users, ArrowRight, Layers, X, Filter, Navigation, Search, List, Maximize2, Minus, Plus, Eye, EyeOff, Target, AlertTriangle, Clock, ChevronRight, LocateFixed, RefreshCcw, Share2, Scan } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Demo fallback data — shown when API is unavailable
const DEMO_CHALLENGES = [
  { _id: '1', title: 'Smart Waste Collection', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } }, severity: 'high', affectedPopulation: 25000, status: 'open', numberOfSolutions: 2, createdAt: '2024-01-15', description: 'Ranchi generates 450 tonnes of municipal solid waste daily, but collection efficiency is only ~40%. Poor segregation and routing cause landfill overflow and disease.' },
  { _id: '2', title: 'Rural Water Quality Monitoring', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.6093, lng: 85.1376 } }, severity: 'critical', affectedPopulation: 150000, status: 'open', numberOfSolutions: 1, createdAt: '2024-01-20', description: 'Over 200 villages rely on groundwater contaminated with arsenic and fluoride. No real-time testing network exists.' },
  { _id: '3', title: 'Traffic Congestion Prediction', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 } }, severity: 'high', affectedPopulation: 500000, status: 'open', numberOfSolutions: 3, createdAt: '2024-02-01', description: 'Peak-hour commutes take 200% longer. No AI-driven signal optimization or predictive routing is deployed.' },
  { _id: '4', title: 'Telemedicine for Remote Areas', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } }, severity: 'critical', affectedPopulation: 75000, status: 'open', numberOfSolutions: 1, createdAt: '2024-02-10', description: 'Remote villages are 15–30 km from the nearest PHC. Specialist access is near zero without a telemedicine corridor.' },
  { _id: '5', title: 'Urban Flood Prevention', category: 'Infrastructure', location: { city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } }, severity: 'critical', affectedPopulation: 300000, status: 'open', numberOfSolutions: 2, createdAt: '2024-02-15', description: 'Monsoon floods paralyze drainage in 70+ wards annually. Early warning and micro-catchment routing is missing.' },
  { _id: '6', title: 'Digital Education Access', category: 'Education', location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.5913, lng: 84.95 } }, severity: 'high', affectedPopulation: 500000, status: 'open', numberOfSolutions: 4, createdAt: '2024-02-20', description: 'Millions lack quality digital education, devices and vernacular content. Dropout rates spike after grade 8.' },
  { _id: '7', title: 'Agricultural Supply Chain', category: 'Agriculture', location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3696, lng: 85.55 } }, severity: 'high', affectedPopulation: 200000, status: 'open', numberOfSolutions: 1, createdAt: '2024-03-01', description: 'Farmers lose 25–40% of produce due to cold-chain and market-linkage gaps between farm and mandi.' },
  { _id: '8', title: 'Public Transport Optimization', category: 'Transportation', location: { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } }, severity: 'medium', affectedPopulation: 1000000, status: 'open', numberOfSolutions: 0, createdAt: '2024-03-05', description: 'Bus routes are unoptimized and overcrowded. No demand-responsive scheduling or live tracking exists.' },
  { _id: '9', title: 'Air Quality Early Warning - Delhi', category: 'Environment', location: { city: 'New Delhi', state: 'Delhi', coordinates: { lat: 28.6139, lng: 77.2090 } }, severity: 'critical', affectedPopulation: 2000000, status: 'open', numberOfSolutions: 5, createdAt: '2024-03-10', description: 'Winter AQI regularly exceeds 300. Hyperlocal forecasting and citizen advisories need block-level precision.' },
  { _id: '10', title: 'Skilling for Green Jobs', category: 'Social Welfare', location: { city: 'Bengaluru', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } }, severity: 'medium', affectedPopulation: 90000, status: 'open', numberOfSolutions: 2, createdAt: '2024-03-12', description: 'Solar and EV maintenance roles go unfilled. No standardized curriculum or placement linkage exists.' },
];

const categoryConfig: Record<string, { color: string; bg: string; dot: string }> = {
  'Environment': { color: '#059669', bg: 'bg-emerald-500', dot: 'bg-emerald-500' },
  'Healthcare': { color: '#dc2626', bg: 'bg-red-500', dot: 'bg-red-500' },
  'Education': { color: '#2563eb', bg: 'bg-blue-500', dot: 'bg-blue-500' },
  'Transportation': { color: '#d97706', bg: 'bg-amber-500', dot: 'bg-amber-500' },
  'Agriculture': { color: '#65a30d', bg: 'bg-lime-600', dot: 'bg-lime-500' },
  'Infrastructure': { color: '#7c3aed', bg: 'bg-violet-500', dot: 'bg-violet-500' },
  'Social Welfare': { color: '#db2777', bg: 'bg-pink-500', dot: 'bg-pink-500' },
  'Technology': { color: '#0891b2', bg: 'bg-cyan-600', dot: 'bg-cyan-500' },
};

const severityDot: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

export default function ChallengeMapPage() {
  const [selected, setSelected] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(true);
  const [L, setL] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'dark'>('street');
  const [challenges, setChallenges] = useState<any[]>(DEMO_CHALLENGES);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    import('leaflet').then((m) => setL(m.default));
  }, []);

  // Restore filters from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('cat')) setCategoryFilter(params.get('cat')!);
    if (params.get('sev')) setSeverityFilter(params.get('sev')!);
    if (params.get('status')) setStatusFilter(params.get('status')!);
    if (params.get('q')) setSearch(params.get('q')!);
  }, []);

  // Fetch real challenges from API, fall back to demo data
  useEffect(() => {
    (async () => {
      try {
        const res = await challengesAPI.getAll({ limit: 100 });
        const list = res.data.challenges;
        if (list?.length) {
          // Normalize API data to match the map's expected shape
          const normalized = list.map((c: any) => ({
            ...c,
            location: {
              city: c.location?.city || 'Unknown',
              state: c.location?.state || 'India',
              coordinates: c.location?.coordinates || { lat: 22.5 + Math.random() * 8, lng: 78 + Math.random() * 12 },
            },
            severity: c.severity || 'medium',
            affectedPopulation: c.affectedPopulation || 0,
            numberOfSolutions: c.numberOfSolutions || 0,
            createdAt: c.createdAt,
            description: c.description || '',
          }));
          setChallenges(normalized);
        }
      } catch {
        // Keep demo data
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return challenges.filter(c => {
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search && !`${c.title} ${c.location.city} ${c.location.state} ${c.category}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [categoryFilter, severityFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const bySeverity = filtered.reduce((acc: any, c) => { acc[c.severity] = (acc[c.severity] || 0) + 1; return acc; }, {});
    return {
      total: filtered.length,
      critical: bySeverity.critical || 0,
      high: bySeverity.high || 0,
      states: new Set(filtered.map(c => c.location.state)).size,
      impacted: filtered.reduce((s, c) => s + c.affectedPopulation, 0),
    };
  }, [filtered]);

  const createIcon = (category: string, isSelected: boolean, severity: string) => {
    if (!L) return undefined;
    const cfg = categoryConfig[category] || { color: '#64748b', bg: 'bg-slate-500', dot: 'bg-slate-400' };
    const size = isSelected ? 36 : 28;
    const border = isSelected ? '3px' : '2.5px';
    const pulse = severity === 'critical' ? `<span style="position:absolute;inset:-6px;border-radius:50%;background:${cfg.color};opacity:0.18;animation: ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>` : '';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="position:relative;width:${size}px;height:${size}px;">
        ${pulse}
        <div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:${cfg.color};border:${border} solid white;box-shadow:0 4px 16px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;${isSelected ? 'transform:scale(1.08);' : ''}">
          <span style="font-size:${isSelected ? 14 : 11}px;line-height:1;">${getCategoryIcon(category)}</span>
        </div>
        ${isSelected ? `<div style="position:absolute;left:50%;bottom:-6px;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:${cfg.color};border-right:2px solid white;border-bottom:2px solid white;"></div>` : ''}
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const flyTo = (lat: number, lng: number) => {
    const m: any = mapRef.current;
    if (m?.flyTo) m.flyTo([lat, lng], 7, { duration: 0.9 });
    else if (m?.leafletElement?.flyTo) m.leafletElement.flyTo([lat, lng], 7, { duration: 0.9 });
  };
  const handleZoomIn = () => {
    const m: any = mapRef.current;
    if (m?.zoomIn) m.zoomIn();
    else if (m?.leafletElement?.zoomIn) m.leafletElement.zoomIn();
    else if (m?.getZoom && m?.setZoom) m.setZoom(m.getZoom()+1);
  };
  const handleZoomOut = () => {
    const m: any = mapRef.current;
    if (m?.zoomOut) m.zoomOut();
    else if (m?.leafletElement?.zoomOut) m.leafletElement.zoomOut();
    else if (m?.getZoom && m?.setZoom) m.setZoom(m.getZoom()-1);
  };
  const handleResetView = () => flyTo(22.5, 79.5);
  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => flyTo(p.coords.latitude, p.coords.longitude),
      () => flyTo(22.5, 79.5)
    );
  };

  const handleSelect = (c: any) => {
    setSelected(c);
    setShowPanel(true);
    flyTo(c.location.coordinates.lat, c.location.coordinates.lng);
  };

  const fitAll = () => {
    if (!filtered.length) return;
    const m: any = mapRef.current;
    const bounds = filtered.map(c => [c.location.coordinates.lat, c.location.coordinates.lng]);
    if (m?.fitBounds) m.fitBounds(bounds, { padding: [40, 40], maxZoom: 8, duration: 0.9 });
    else if (m?.leafletElement?.fitBounds) m.leafletElement.fitBounds(bounds, { padding: [40, 40], maxZoom: 8, duration: 0.9 });
  };

  const shareLink = () => {
    const params = new URLSearchParams();
    if (categoryFilter !== 'all') params.set('cat', categoryFilter);
    if (severityFilter !== 'all') params.set('sev', severityFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('q', search);
    const url = `${window.location.origin}/challenges/map${params.toString() ? '?' + params.toString() : ''}`;
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070A12]">
      <style>{`@keyframes ping{75%,100%{transform:scale(1.9);opacity:0}}`}</style>

      <div className="border-b border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0F1420] sticky top-0 z-30">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex h-10 w-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 items-center justify-center shrink-0"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight">Challenge Map</h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 px-2.5 py-0.5 text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">· Pan-India · {stats.states} states</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Explore geo-tagged challenges. Filter, locate and jump into collaboration.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/challenges/submit"><Button size="sm" className="rounded-full h-9 gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm"><Plus className="h-4 w-4" /> Submit</Button></Link>
              <Link href="/challenges"><Button variant="outline" className="rounded-full h-9 gap-1.5 bg-white dark:bg-white/5"><List className="h-4 w-4" /> List</Button></Link>
              <Button variant="outline" onClick={() => setShowPanel(!showPanel)} className="rounded-full h-9 gap-1.5 bg-white dark:bg-white/5">
                {showPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showPanel ? 'Hide panel' : 'Show panel'}
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { label: 'Visible', value: stats.total, sub: `of ${challenges.length} total`, icon: Target, tint: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' },
              { label: 'Critical', value: stats.critical, sub: 'needs attention', icon: AlertTriangle, tint: 'bg-red-50 text-red-600 dark:bg-red-950/30' },
              { label: 'Lives impacted', value: formatNumber(stats.impacted), sub: 'combined', icon: Users, tint: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30' },
              { label: 'States', value: stats.states, sub: 'coverage', icon: Layers, tint: 'bg-violet-50 text-violet-600 dark:bg-violet-950/30' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3 py-3 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${s.tint}`}><Icon className="h-4 w-4" /></div>
                  <div><div className="text-lg font-bold leading-none tracking-tight">{s.value}</div><div className="text-xs font-medium text-slate-500">{s.label} <span className="text-slate-400 font-normal">· {s.sub}</span></div></div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, city, state, category…" className="pl-10 h-10 rounded-full bg-white dark:bg-[#070A12] border-slate-200 dark:border-white/10 shadow-sm" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[175px] h-10 rounded-full bg-white dark:bg-[#070A12]"><Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All categories</SelectItem>{Object.keys(categoryConfig).map(c => <SelectItem key={c} value={c}>{getCategoryIcon(c)} {c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px] h-10 rounded-full bg-white dark:bg-[#070A12]"><AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All severities</SelectItem><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] h-10 rounded-full bg-white dark:bg-[#070A12]"><Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="solved">Solved</SelectItem></SelectContent>
              </Select>
              {(categoryFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all' || search) && (
                <Button variant="ghost" onClick={() => { setCategoryFilter('all'); setSeverityFilter('all'); setStatusFilter('all'); setSearch(''); setSelected(null); }} className="h-10 rounded-full gap-1.5"><RefreshCcw className="h-3.5 w-3.5" /> Reset</Button>
              )}
            </div>
          </div>

          {(categoryFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all' || search) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {categoryFilter !== 'all' && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 gap-1 pr-1">{getCategoryIcon(categoryFilter)} {categoryFilter} <button onClick={() => setCategoryFilter('all')} className="ml-1 h-5 w-5 rounded-full bg-white/20 grid place-items-center"><X className="h-3 w-3" /></button></Badge>}
              {severityFilter !== 'all' && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 capitalize gap-1 pr-1">{severityFilter} <button onClick={() => setSeverityFilter('all')} className="ml-1 h-5 w-5 rounded-full bg-white/20 grid place-items-center"><X className="h-3 w-3" /></button></Badge>}
              {statusFilter !== 'all' && <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 capitalize gap-1 pr-1">{statusFilter} <button onClick={() => setStatusFilter('all')} className="ml-1 h-5 w-5 rounded-full bg-white/20 grid place-items-center"><X className="h-3 w-3" /></button></Badge>}
              {search && <Badge variant="outline" className="rounded-full gap-1 pr-1">“{search}” <button onClick={() => setSearch('')} className="ml-1 h-5 w-5 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center"><X className="h-3 w-3" /></button></Badge>}
              <span className="text-xs text-slate-400 self-center ml-1">{filtered.length} matches</span>
            </div>
          )}
        </div>
      </div>

      <div className="container py-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="rounded-[20px] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] shadow-sm relative">
              <div className="h-[560px] xl:h-[640px] relative">
                {L ? (
                  <MapContainer
                    center={[22.5, 79.5]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    ref={mapRef}
                  >
                    {mapStyle === 'street' && (
                      <TileLayer
                        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={19}
                      />
                    )}
                    {mapStyle === 'satellite' && (
                      <TileLayer
                        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={19}
                      />
                    )}
                    {mapStyle === 'dark' && (
                      <TileLayer
                        attribution='&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={16}
                      />
                    )}
                    {filtered.map((c) => (
                      <Marker
                        key={c._id}
                        position={[c.location.coordinates.lat, c.location.coordinates.lng]}
                        icon={createIcon(c.category, selected?._id === c._id, c.severity)}
                        eventHandlers={{ click: () => setSelected(c) }}
                      >
                        <Popup maxWidth={280} className="pro-popup">
                          <div className="p-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className={`h-2 w-2 rounded-full ${severityDot[c.severity]}`} />
                              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{c.severity}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[11px] font-medium text-slate-600">{c.category}</span>
                            </div>
                            <div className="text-sm font-bold leading-tight text-slate-900">{c.title}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{c.location.city}, {c.location.state} · {formatNumber(c.affectedPopulation)} affected</div>
                            <div className="flex gap-1.5 mt-2.5">
                              <Link href={`/challenges/${c._id}`} className="flex-1"><span className="flex h-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold w-full">View <ArrowRight className="h-3 w-3 ml-1" /></span></Link>
                              <button onClick={() => handleSelect(c)} className="h-7 px-3 rounded-full border border-slate-200 text-xs font-medium">Details</button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full grid place-items-center bg-slate-50 dark:bg-white/[0.02]">
                    <div className="text-center"><div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin mx-auto" /><p className="text-sm text-slate-500 mt-3">Loading map…</p></div>
                  </div>
                )}

                <div className="absolute top-3 left-3 z-[500] flex flex-col gap-1.5 pointer-events-auto">
                  <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/15 shadow-lg p-1 flex flex-col">
                    <button type="button" onClick={handleZoomIn} className="h-8 w-8 grid place-items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"><Plus className="h-4 w-4" /></button>
                    <div className="h-px bg-slate-200 dark:bg-white/15 my-1" />
                    <button type="button" onClick={handleZoomOut} className="h-8 w-8 grid place-items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"><Minus className="h-4 w-4" /></button>
                  </div>
                  <button type="button" onClick={handleResetView} title="Reset view" className="h-9 w-9 rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/15 shadow-md grid place-items-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"><Navigation className="h-4 w-4" /></button>
                  <button type="button" onClick={handleLocate} title="Locate me" className="h-9 w-9 rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/15 shadow-md grid place-items-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"><LocateFixed className="h-4 w-4" /></button>
                </div>

                <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                  <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/15 shadow-lg px-2 py-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-1">{filtered.length} shown</span>
                    <span className="h-4 w-px bg-slate-200 dark:bg-white/15" />
                    <button onClick={() => { const el = document.documentElement; if (!document.fullscreenElement) el.requestFullscreen?.(); else document.exitFullscreen?.(); }} className="h-7 w-7 grid place-items-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white transition-all"><Maximize2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-0.5 rounded-full bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/15 shadow-lg p-0.5">
                    {([['street', 'Map'], ['satellite', 'Sat'], ['dark', 'Dark']] as const).map(([key, label]) => (
                      <button key={key} onClick={() => setMapStyle(key)} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${mapStyle === key ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/15'}`}>{label}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5 rounded-full bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/15 shadow-lg p-0.5">
                    <button onClick={fitAll} title="Fit all markers" className="h-7 w-7 grid place-items-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white transition-all"><Scan className="h-3.5 w-3.5" /></button>
                    <button onClick={shareLink} title="Copy share link" className="h-7 w-7 grid place-items-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white transition-all"><Share2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 z-10 rounded-2xl bg-white/95 dark:bg-[#0F1420]/95 backdrop-blur border border-slate-200 dark:border-white/10 shadow-lg p-3 hidden sm:block">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2 flex items-center gap-1"><Layers className="h-3 w-3" /> Legend — tap to filter</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {Object.entries(categoryConfig).map(([cat, cfg]) => (
                      <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)} className={`flex items-center gap-2 text-left rounded-full px-2 py-1 -mx-2 transition ${categoryFilter === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot} shrink-0`} />
                        <span className="text-xs font-medium leading-none">{cat}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 flex gap-1.5">
                    {[
                      { k: 'critical', label: 'Critical', cls: 'bg-red-500' },
                      { k: 'high', label: 'High', cls: 'bg-orange-500' },
                      { k: 'medium', label: 'Med', cls: 'bg-amber-500' },
                    ].map(s => (
                      <span key={s.k} className="inline-flex items-center gap-1 text-[11px] text-slate-500"><span className={`h-2 w-2 rounded-full ${s.cls}`} />{s.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-200 dark:border-white/10 text-xs">
                <span className="text-slate-500 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Data refreshed · {new Date().toLocaleDateString('en-IN')}</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-slate-400"><Clock className="h-3 w-3" /> Click a pin to inspect · Use filters to narrow</span>
              </div>
            </div>
          </div>

          {showPanel && (
            <div className="xl:w-[380px] shrink-0">
              <div className="rounded-[20px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] shadow-sm overflow-hidden xl:sticky xl:top-[84px] max-h-[640px] flex flex-col">
                {selected ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1"><Target className="h-3 w-3" /> Selected</span>
                      <button onClick={() => setSelected(null)} className="h-7 w-7 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 grid place-items-center hover:bg-slate-50"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge className={`${getSeverityColor(selected.severity)} rounded-full border-0 capitalize text-[11px]`}>{selected.severity}</Badge>
                        <Badge className={`${getStatusColor(selected.status)} rounded-full capitalize text-[11px]`}>{selected.status}</Badge>
                      </div>
                      <h3 className="text-[17px] font-bold leading-tight tracking-tight">{selected.title}</h3>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                        <span>{getCategoryIcon(selected.category)} {selected.category}</span><span className="opacity-30">·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{selected.location.city}, {selected.location.state}</span><span className="opacity-30">·</span><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(selected.createdAt || selected.date)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{selected.description}</p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 p-3 text-center">
                          <div className="text-lg font-bold tracking-tight">{formatNumber(selected.affectedPopulation)}</div><div className="text-[11px] font-medium text-slate-500">Affected</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 p-3 text-center">
                          <div className="text-lg font-bold tracking-tight">{selected.numberOfSolutions}</div><div className="text-[11px] font-medium text-slate-500">Solutions</div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Timeline</div>
                        <div className="relative pl-6 space-y-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-white/10">
                          {[
                            { t: 'Challenge submitted', d: formatDate(selected.createdAt || selected.date), dot: 'bg-slate-900 dark:bg-white' },
                            { t: 'Verification pending', d: 'Awaiting government review', dot: 'bg-amber-500' },
                            { t: 'AI analysis complete', d: `${selected.numberOfSolutions} potential matches identified`, dot: 'bg-violet-500' },
                          ].map(r => (
                            <div key={r.t} className="relative">
                              <span className={`absolute -left-6 top-1 h-2.5 w-2.5 rounded-full ${r.dot} ring-4 ring-white dark:ring-[#0F1420]`} />
                              <div className="text-sm font-semibold leading-none">{r.t}</div><div className="text-xs text-slate-500 mt-1">{r.d}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <Link href={`/challenges/${selected._id}`} className="flex-1"><Button className="w-full rounded-full h-10 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">View details <ArrowRight className="h-4 w-4 ml-1.5" /></Button></Link>
                        <Button variant="outline" onClick={() => flyTo(selected.location.coordinates.lat, selected.location.coordinates.lng)} className="rounded-full h-10 px-4"><Navigation className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <h3 className="text-sm font-bold">Challenges <span className="font-normal text-slate-500">· {filtered.length}</span></h3>
                      <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Click to locate</span>
                    </div>
                    <div className="p-2 space-y-1.5 max-h-[520px] overflow-y-auto">
                      {filtered.length === 0 ? (
                        <div className="py-10 text-center px-6">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 grid place-items-center mx-auto"><Search className="h-5 w-5 text-slate-400" /></div>
                          <div className="mt-3 text-sm font-semibold">No matches</div><p className="text-xs text-slate-500 mt-1">Try adjusting search or filters.</p>
                          <Button variant="outline" onClick={() => { setSearch(''); setCategoryFilter('all'); setSeverityFilter('all'); }} className="mt-4 rounded-full h-8 text-xs">Clear filters</Button>
                        </div>
                      ) : filtered.map(c => {
                        const cfg = categoryConfig[c.category];
                        return (
                          <button key={c._id} onClick={() => handleSelect(c)} className="w-full text-left rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-3 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-sm transition flex gap-3 group">
                            <span className={`h-9 w-9 rounded-xl ${cfg?.bg || 'bg-slate-500'} text-white grid place-items-center text-sm shrink-0 mt-0.5`}>{getCategoryIcon(c.category)}</span>
                            <span className="min-w-0 flex-1">
                              <span className="text-[13px] font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors block">{c.title}</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{c.location.city}, {c.location.state}</span>
                              <span className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className={`h-2 w-2 rounded-full ${severityDot[c.severity]}`} />
                                <span className="text-[11px] font-medium capitalize text-slate-600 dark:text-slate-400">{c.severity}</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-[11px] text-slate-500">{formatNumber(c.affectedPopulation)} affected</span>
                              </span>
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-2" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
