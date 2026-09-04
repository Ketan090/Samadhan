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
function MapController({ onReady }: { onReady: (m:any)=>void }){
  const mod = require('react-leaflet') as any;
  const map = mod.useMap();
  React.useEffect(()=>{ onReady(map); }, [map, onReady]);
  return null;
}

const DEMO_CHALLENGES = [
  { _id: '1', title: 'Smart Waste Collection', category: 'Environment', location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } }, severity: 'high', affectedPopulation: 25000, status: 'open', numberOfSolutions: 2, createdAt: '2024-01-15', description: 'Ranchi generates 450 tonnes waste daily, collection only 40%.' },
  { _id: '2', title: 'Rural Water Quality Monitoring', category: 'Healthcare', location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.6093, lng: 85.1376 } }, severity: 'critical', affectedPopulation: 150000, status: 'open', numberOfSolutions: 1, createdAt: '2024-01-20', description: '200 villages rely on contaminated groundwater.' },
  { _id: '3', title: 'Traffic Congestion Prediction', category: 'Transportation', location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.076, lng: 72.8777 } }, severity: 'high', affectedPopulation: 500000, status: 'open', numberOfSolutions: 3, createdAt: '2024-02-01', description: 'Peak commutes 200% longer.' },
  { _id: '4', title: 'Telemedicine for Remote Areas', category: 'Healthcare', location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.385, lng: 78.4867 } }, severity: 'critical', affectedPopulation: 75000, status: 'open', numberOfSolutions: 1, createdAt: '2024-02-10', description: 'Villages 15-30km from PHC.' },
  { _id: '5', title: 'Urban Flood Prevention', category: 'Infrastructure', location: { city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } }, severity: 'critical', affectedPopulation: 300000, status: 'open', numberOfSolutions: 2, createdAt: '2024-02-15', description: 'Monsoon floods paralyze 70+ wards.' },
  { _id: '6', title: 'Digital Education Access', category: 'Education', location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.5913, lng: 84.95 } }, severity: 'high', affectedPopulation: 500000, status: 'open', numberOfSolutions: 4, createdAt: '2024-02-20', description: 'Millions lack devices.' },
  { _id: '7', title: 'Agricultural Supply Chain', category: 'Agriculture', location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3696, lng: 85.55 } }, severity: 'high', affectedPopulation: 200000, status: 'open', numberOfSolutions: 1, createdAt: '2024-03-01', description: 'Farmers lose 25-40% produce.' },
  { _id: '8', title: 'Public Transport Optimization', category: 'Transportation', location: { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } }, severity: 'medium', affectedPopulation: 1000000, status: 'open', numberOfSolutions: 0, createdAt: '2024-03-05', description: 'Bus routes unoptimized.' },
  { _id: '9', title: 'Air Quality Early Warning - Delhi', category: 'Environment', location: { city: 'New Delhi', state: 'Delhi', coordinates: { lat: 28.6139, lng: 77.209 } }, severity: 'critical', affectedPopulation: 2000000, status: 'open', numberOfSolutions: 5, createdAt: '2024-03-10', description: 'Winter AQI >300.' },
  { _id: '10', title: 'Skilling for Green Jobs', category: 'Social Welfare', location: { city: 'Bengaluru', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } }, severity: 'medium', affectedPopulation: 90000, status: 'open', numberOfSolutions: 2, createdAt: '2024-03-12', description: 'Solar/EV roles unfilled.' },
];

const categoryConfig: Record<string, { color: string; dot: string }> = {
  'Environment': { color: '#059669', dot: 'bg-emerald-500' },
  'Healthcare': { color: '#dc2626', dot: 'bg-red-500' },
  'Education': { color: '#2563eb', dot: 'bg-blue-500' },
  'Transportation': { color: '#d97706', dot: 'bg-amber-500' },
  'Agriculture': { color: '#65a30d', dot: 'bg-lime-500' },
  'Infrastructure': { color: '#7c3aed', dot: 'bg-violet-500' },
  'Social Welfare': { color: '#db2777', dot: 'bg-pink-500' },
  'Technology': { color: '#0891b2', dot: 'bg-cyan-500' },
};
const severityDot: Record<string, string> = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-500', low: 'bg-emerald-500' };

export default function ChallengeMapPage() {
  const [selected, setSelected] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(true);
  const [L, setL] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'dark'>('street');
  const [legendOpen, setLegendOpen] = useState(true);
  const [challenges, setChallenges] = useState<any[]>(DEMO_CHALLENGES);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    import('leaflet').then((m) => {
      const leaf = m.default;
      delete (leaf.Icon.Default.prototype as any)._getIconUrl;
      leaf.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setL(leaf);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await challengesAPI.getAll({ limit: 100 });
        const list = res.data.challenges;
        if (list?.length) {
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
          }));
          setChallenges(normalized);
        }
      } catch {}
    })();
  }, []);

  const filtered = useMemo(() => challenges.filter(c => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !`${c.title} ${c.location.city} ${c.location.state} ${c.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [challenges, categoryFilter, severityFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const bySeverity = filtered.reduce((acc: any, c) => { acc[c.severity] = (acc[c.severity] || 0) + 1; return acc; }, {});
    return { total: filtered.length, critical: bySeverity.critical || 0, high: bySeverity.high || 0, states: new Set(filtered.map(c => c.location.state)).size, impacted: filtered.reduce((s, c) => s + c.affectedPopulation, 0) };
  }, [filtered]);

  // Simple clustering: group by rounded coordinates ( ~50km grid )
  const clusters = useMemo(() => {
    const map = new Map<string, any[]>();
    filtered.forEach(c => {
      const key = `${c.location.coordinates.lat.toFixed(1)}_${c.location.coordinates.lng.toFixed(1)}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return Array.from(map.entries()).map(([key, items]) => ({
      key, lat: items[0].location.coordinates.lat, lng: items[0].location.coordinates.lng, items, count: items.length
    }));
  }, [filtered]);

  const createIcon = (category: string, isSelected: boolean, severity: string, count?: number) => {
    if (!L) return undefined;
    const cfg = categoryConfig[category] || { color: '#64748b', dot: 'bg-slate-400' };
    if (count && count > 1) {
      return L.divIcon({
        className: 'cluster-marker',
        html: `<div style="width:38px;height:38px;border-radius:50%;background:${cfg.color};border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.22);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:13px;">${count}</div>`,
        iconSize: [38, 38], iconAnchor: [19, 19]
      });
    }
    const size = isSelected ? 40 : 32;
    const border = isSelected ? '3px' : '2.5px';
    const pulse = severity === 'critical' ? `<span style="position:absolute;inset:-6px;border-radius:50%;background:${cfg.color};opacity:0.18;animation: ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>` : '';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div title="${category} • ${severity}" aria-label="${category} challenge" style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">${pulse}<div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:${cfg.color};border:${border} solid white;box-shadow:0 4px 16px rgba(0,0,0,0.22), 0 1px 3px rgba(0,0,0,0.14);display:flex;align-items:center;justify-content:center;font-size:${isSelected?15:13}px;">${getCategoryIcon(category)}</div>${isSelected ? `<div style="position:absolute;left:50%;bottom:-6px;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:${cfg.color};border-right:2px solid white;border-bottom:2px solid white;"></div>` : ''}</div>`,
      iconSize: [size, size], iconAnchor: [size/2, size/2],
    });
  };

  const flyTo = (lat: number, lng: number, z=7) => {
    if (mapInstance?.flyTo) mapInstance.flyTo([lat, lng], z, { duration: 0.9 });
    else {
      const m: any = mapRef.current;
      const target = (m?.leafletElement) || m;
      if (target?.flyTo) target.flyTo([lat, lng], z, { duration: 0.9 });
    }
  };
  const handleZoomIn = () => { if (mapInstance?.zoomIn) mapInstance.zoomIn(); else { const m:any = mapRef.current; (m?.leafletElement||m)?.zoomIn?.(); const t=(m?.leafletElement||m); if(t?.getZoom) t.setZoom(t.getZoom()+1); } };
  const handleZoomOut = () => { if (mapInstance?.zoomOut) mapInstance.zoomOut(); else { const m:any = mapRef.current; (m?.leafletElement||m)?.zoomOut?.(); const t=(m?.leafletElement||m); if(t?.getZoom) t.setZoom(t.getZoom()-1); } };
  const handleResetView = () => flyTo(22.5, 79.5, 5);
  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p)=>flyTo(p.coords.latitude,p.coords.longitude,9), ()=>flyTo(22.5,79.5,5), {enableHighAccuracy:true, timeout:7000});
  };
  const handleSelect = (c:any)=>{ setSelected(c); setShowPanel(true); flyTo(c.location.coordinates.lat, c.location.coordinates.lng, 7); };
  const fitAll = () => {
    if(!filtered.length) return;
    if (mapInstance?.fitBounds) { const bounds = filtered.map(c=>[c.location.coordinates.lat,c.location.coordinates.lng]) as any; mapInstance.fitBounds(bounds,{padding:[40,40],maxZoom:8}); return; }
    const m:any = mapRef.current; const target=(m?.leafletElement||m);
    const bounds = filtered.map(c=>[c.location.coordinates.lat,c.location.coordinates.lng]) as any;
    if(target?.fitBounds) target.fitBounds(bounds,{padding:[40,40],maxZoom:8});
  };
  const shareLink = ()=>{ const p=new URLSearchParams(); if(categoryFilter!=='all') p.set('cat',categoryFilter); if(severityFilter!=='all') p.set('sev',severityFilter); if(statusFilter!=='all') p.set('status',statusFilter); if(search) p.set('q',search); navigator.clipboard?.writeText(`${window.location.origin}/challenges/map${p.toString()?'?'+p.toString():''}`); };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070A12]">
      <style>{`@keyframes ping{75%,100%{transform:scale(1.9);opacity:0}}`}</style>
      <div className="border-b border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0F1420] sticky top-[66px] z-20 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex h-10 w-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 items-center justify-center shrink-0"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight">Challenge Map</h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 px-2.5 py-0.5 text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">· {stats.states} states · {stats.total} shown</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Explore geo-tagged challenges. Clustered, searchable, filterable — tap any pin.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/challenges/submit"><Button size="sm" className="rounded-full h-9 gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"><Plus className="h-4 w-4" /> Submit</Button></Link>
              <Link href="/challenges"><Button variant="outline" className="rounded-full h-9 gap-1.5 bg-white dark:bg-white/5"><List className="h-4 w-4" /> List</Button></Link>
              <Button variant="outline" onClick={()=>setShowPanel(!showPanel)} className="rounded-full h-9 gap-1.5 bg-white dark:bg-white/5">{showPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showPanel ? 'Hide' : 'Show'}</Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { label:'Visible', value: stats.total, sub:`of ${challenges.length}`, icon: Target, tint:'bg-slate-900 text-white dark:bg-white dark:text-slate-900' },
              { label:'Critical', value: stats.critical, sub:'needs attention', icon: AlertTriangle, tint:'bg-red-50 text-red-600 dark:bg-red-950/30' },
              { label:'Lives impacted', value: formatNumber(stats.impacted), sub:'combined', icon: Users, tint:'bg-blue-50 text-blue-600 dark:bg-blue-950/30' },
              { label:'States', value: stats.states, sub:'coverage', icon: Layers, tint:'bg-violet-50 text-violet-600 dark:bg-violet-950/30' },
            ].map(s=>{ const Icon=s.icon; return <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3 py-3 flex items-center gap-3"><div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${s.tint}`}><Icon className="h-4 w-4" /></div><div><div className="text-lg font-bold leading-none">{s.value}</div><div className="text-xs font-medium text-slate-500">{s.label} <span className="text-slate-400 font-normal">· {s.sub}</span></div></div></div>; })}
          </div>

          <div className="mt-4 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, city, state, category…" className="pl-10 h-10 rounded-full bg-white dark:bg-[#070A12] border-slate-200 dark:border-white/10 shadow-sm" />
              {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 grid place-items-center"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="w-[175px] h-10 rounded-full bg-white dark:bg-[#070A12]"><Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{Object.keys(categoryConfig).map(c=> <SelectItem key={c} value={c}>{getCategoryIcon(c)} {c}</SelectItem>)}</SelectContent></Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}><SelectTrigger className="w-[150px] h-10 rounded-full bg-white dark:bg-[#070A12]"><AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Severity" /></SelectTrigger><SelectContent><SelectItem value="all">All severities</SelectItem><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[150px] h-10 rounded-full bg-white dark:bg-[#070A12]"><Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="solved">Solved</SelectItem></SelectContent></Select>
              {(categoryFilter!=='all'||severityFilter!=='all'||statusFilter!=='all'||search) && <Button variant="ghost" onClick={()=>{setCategoryFilter('all');setSeverityFilter('all');setStatusFilter('all');setSearch('');setSelected(null);}} className="h-10 rounded-full gap-1.5"><RefreshCcw className="h-3.5 w-3.5" /> Reset</Button>}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="rounded-[20px] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] shadow-sm relative">
              <div className="h-[420px] sm:h-[560px] xl:h-[640px] relative bg-slate-100 dark:bg-[#0a0f1f]">
                {L ? (
                  <MapContainer center={[22.5,79.5]} zoom={5} style={{height:'100%',width:'100%',background: mapStyle==='dark' ? '#0f172a' : '#eef2f7'}} zoomControl={false} attributionControl={false} preferCanvas={false} ref={mapRef}>
                    {mapStyle==='street' && <TileLayer attribution='&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />}
                    {mapStyle==='satellite' && <TileLayer attribution='&copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />}
                    {mapStyle==='dark' && <TileLayer attribution='&copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />}
                    <MapController onReady={setMapInstance} />
                    {clusters.map(c=> c.count>1 ? (
                      <Marker key={c.key} position={[c.lat,c.lng]} icon={createIcon(c.items[0].category,false,c.items[0].severity,true as any)} eventHandlers={{click:()=>flyTo(c.lat,c.lng,8)}}>
                        <Popup maxWidth={300}><div className="p-1"><div className="text-sm font-bold">{c.count} challenges here</div><div className="text-xs text-slate-500">{c.items.map((x:any)=>x.title).slice(0,3).join(' • ')}</div><Button size="sm" className="mt-2 rounded-full h-7 text-xs w-full" onClick={()=>flyTo(c.lat,c.lng,9)}>Zoom in</Button></div></Popup>
                      </Marker>
                    ) : (
                      <Marker key={c.items[0]._id} position={[c.lat,c.lng]} icon={createIcon(c.items[0].category, selected?._id===c.items[0]._id, c.items[0].severity)} eventHandlers={{click:()=>setSelected(c.items[0])}}>
                        <Popup maxWidth={300}><div className="p-1"><div className="flex items-center gap-1.5 mb-1"><span className={`h-2 w-2 rounded-full ${severityDot[c.items[0].severity]}`} /><span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{c.items[0].severity}</span><span className="text-slate-300">·</span><span className="text-[11px] font-medium">{c.items[0].category}</span></div><div className="text-sm font-bold leading-tight">{c.items[0].title}</div><div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{c.items[0].location.city}, {c.items[0].location.state} · {formatNumber(c.items[0].affectedPopulation)} affected</div><div className="flex gap-1.5 mt-3"><Link href={`/challenges/${c.items[0]._id}`} className="flex-1"><span className="flex h-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold w-full">View <ArrowRight className="h-3 w-3 ml-1" /></span></Link><button onClick={()=>handleSelect(c.items[0])} className="h-8 px-3 rounded-full border border-slate-200 text-xs font-medium">Details</button></div></div></Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full grid place-items-center bg-white dark:bg-[#0F1420]"><div className="text-center"><div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-violet-600 animate-spin mx-auto" /><p className="text-sm font-medium mt-3">Loading premium map…</p><p className="text-xs text-slate-400">Esri Street · Satellite · Dark — all English, clustered</p></div></div>
                )}

                <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5 pointer-events-auto">
                  <div className="rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-lg p-1 flex flex-col">
                    <button onClick={handleZoomIn} aria-label="Zoom in" className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-50 dark:hover:bg-white/10"><Plus className="h-4 w-4" /></button>
                    <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />
                    <button onClick={handleZoomOut} aria-label="Zoom out" className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-50 dark:hover:bg-white/10"><Minus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={handleResetView} title="Reset India" className="h-9 w-9 rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-lg grid place-items-center hover:bg-slate-50"><Navigation className="h-4 w-4" /></button>
                  <button onClick={handleLocate} title="Locate me" className="h-9 w-9 rounded-xl bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-lg grid place-items-center hover:bg-slate-50"><LocateFixed className="h-4 w-4" /></button>
                </div>

                <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                  <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-lg px-2 py-1"><span className="text-[11px] font-semibold px-1">{filtered.length} shown · {clusters.length} clusters</span><span className="h-4 w-px bg-slate-200 dark:bg-white/10" /><button onClick={()=>{ const el=document.documentElement; if(!document.fullscreenElement) el.requestFullscreen?.(); else document.exitFullscreen?.(); }} className="h-7 w-7 grid place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><Maximize2 className="h-3.5 w-3.5" /></button></div>
                  <div className="flex items-center gap-0.5 rounded-full bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-lg p-0.5">
                    {([['street','Map'],['satellite','Sat'],['dark','Dark']] as const).map(([k,l])=> <button key={k} onClick={()=>setMapStyle(k)} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${mapStyle===k ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}>{l}</button>)}
                  </div>
                  <div className="flex items-center gap-0.5 rounded-full bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-white/10 shadow-lg p-0.5">
                    <button onClick={fitAll} title="Fit all" className="h-7 w-7 grid place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><Scan className="h-3.5 w-3.5" /></button>
                    <button onClick={shareLink} title="Copy link" className="h-7 w-7 grid place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><Share2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:left-[58px] sm:max-w-[320px] z-20">
                  <div className="rounded-2xl bg-white/95 dark:bg-[#0F1420]/95 backdrop-blur border border-slate-200 dark:border-white/10 shadow-xl">
                    <button onClick={()=>setLegendOpen(!legendOpen)} className="w-full flex items-center justify-between p-3">
                      <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1"><Layers className="h-3 w-3" /> Legend — {filtered.length} shown</span>
                      <span className="text-xs">{legendOpen ? '−' : '+'}</span>
                    </button>
                    {legendOpen && (
                      <div className="px-3 pb-3">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          {Object.entries(categoryConfig).map(([cat,cfg])=> <button key={cat} onClick={()=>setCategoryFilter(categoryFilter===cat?'all':cat)} className={`flex items-center gap-1.5 text-left rounded-full px-2 py-1 -mx-1 ${categoryFilter===cat?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'hover:bg-slate-50 dark:hover:bg-white/5'}`}><span className={`h-2.5 w-2.5 rounded-full ${cfg.dot} shrink-0`} /><span className="text-xs font-medium truncate">{cat}</span></button>)}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-2 text-[11px] text-slate-500"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Critical</span><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" />High</span><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />Med</span><span className="ml-auto hidden sm:inline">Tap to filter · Clustered</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-200 dark:border-white/10 text-xs">
                <span className="text-slate-500 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Esri · Premium · English · Live</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-slate-400"><Clock className="h-3 w-3" /> Click pin or cluster to inspect</span>
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
                      <button onClick={()=>setSelected(null)} className="h-7 w-7 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 grid place-items-center"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge className={`${getSeverityColor(selected.severity)} rounded-full border-0 capitalize text-[11px]`}>{selected.severity}</Badge>
                        <Badge className={`${getStatusColor(selected.status)} rounded-full capitalize text-[11px]`}>{selected.status}</Badge>
                      </div>
                      <h3 className="text-[17px] font-bold leading-tight">{selected.title}</h3>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap"><span>{getCategoryIcon(selected.category)} {selected.category}</span><span className="opacity-30">·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{selected.location.city}, {selected.location.state}</span><span className="opacity-30">·</span><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(selected.createdAt)}</span></div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{selected.description}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 p-3 text-center"><div className="text-lg font-bold">{formatNumber(selected.affectedPopulation)}</div><div className="text-[11px] font-medium text-slate-500">Affected</div></div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 p-3 text-center"><div className="text-lg font-bold">{selected.numberOfSolutions}</div><div className="text-[11px] font-medium text-slate-500">Solutions</div></div>
                      </div>
                      <div className="mt-5 flex gap-2">
                        <Link href={`/challenges/${selected._id}`} className="flex-1"><Button className="w-full rounded-full h-10 bg-slate-900 dark:bg-white dark:text-slate-900">View details <ArrowRight className="h-4 w-4 ml-1.5" /></Button></Link>
                        <Button variant="outline" onClick={()=>flyTo(selected.location.coordinates.lat, selected.location.coordinates.lng, 9)} className="rounded-full h-10 px-4"><Navigation className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between"><h3 className="text-sm font-bold">Challenges <span className="font-normal text-slate-500">· {filtered.length}</span></h3><span className="text-[11px] text-slate-400 hidden sm:inline">Click to locate · Clustered</span></div>
                    <div className="p-2 space-y-1.5 max-h-[520px] overflow-y-auto">
                      {filtered.length===0 ? (
                        <div className="py-10 text-center px-6"><div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 grid place-items-center mx-auto"><Search className="h-5 w-5 text-slate-400" /></div><div className="mt-3 text-sm font-semibold">No matches</div><p className="text-xs text-slate-500 mt-1">Try adjusting search or filters.</p><Button variant="outline" onClick={()=>{setSearch('');setCategoryFilter('all');setSeverityFilter('all');}} className="mt-4 rounded-full h-8 text-xs">Clear filters</Button></div>
                      ) : filtered.map(c=>{ const cfg=categoryConfig[c.category]; return <button key={c._id} onClick={()=>handleSelect(c)} className={`w-full text-left rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-3 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-sm transition flex gap-3 group`}><span className={`h-9 w-9 rounded-xl ${cfg?.dot||'bg-slate-500'} text-white grid place-items-center text-sm shrink-0 mt-0.5`}>{getCategoryIcon(c.category)}</span><span className="min-w-0 flex-1"><span className="text-[13px] font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors block">{c.title}</span><span className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{c.location.city}, {c.location.state}</span><span className="flex items-center gap-1.5 mt-1.5 flex-wrap"><span className={`h-2 w-2 rounded-full ${severityDot[c.severity]}`} /><span className="text-[11px] font-medium capitalize text-slate-600 dark:text-slate-400">{c.severity}</span><span className="text-slate-300">·</span><span className="text-[11px] text-slate-500">{formatNumber(c.affectedPopulation)} affected</span></span></span><ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-2" /></button>; })}
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
