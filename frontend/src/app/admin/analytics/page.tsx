'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Eye, Users, Radio, Globe, Laptop, Compass, Calendar, ChevronRight, BarChart2, AlertCircle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OverviewStats {
  totalViews: number;
  totalUniques: number;
  liveSessionCount: number;
}

interface TrendPoint {
  label: string;
  views: number;
  uniques: number;
}

interface TopPage {
  path: string;
  views: number;
  uniques: number;
}

interface TopReferrer {
  name: string;
  count: number;
}

interface TopCountry {
  name: string;
  count: number;
}

interface HardwareStat {
  name: string;
  count: number;
}

interface DashboardStats {
  overview: OverviewStats;
  trends: {
    daily: TrendPoint[];
    weekly: TrendPoint[];
    monthly: TrendPoint[];
  };
  topPages: TopPage[];
  topReferrers: TopReferrer[];
  topCountries: TopCountry[];
  hardware: {
    devices: HardwareStat[];
    browsers: HardwareStat[];
    os: HardwareStat[];
  };
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeScope, setTimeScope] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fetchStats = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await api.get('/analytics/dashboard');
      setStats(res.data);
      if (showToast) toast.success('Analytics stats updated in real-time');
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      toast.error('Failed to load real-time analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh stats every 30 seconds for live active tracking
    const interval = setInterval(() => {
      fetchStats(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Aggregating live visitor statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load analytics</h3>
        <p className="text-slate-500 text-sm mb-6">
          There was an error retrieving the user traffic aggregates from the backend service. Make sure database is seeded and running.
        </p>
        <button 
          onClick={() => { setLoading(true); fetchStats(); }} 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <RefreshCw size={16} /> Retry Fetch
        </button>
      </div>
    );
  }

  // Pick correct trend series
  const activeTrends = stats.trends[timeScope] || [];
  
  // Custom SVG Chart calculations
  const chartWidth = 740;
  const chartHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  
  const maxViews = Math.max(...activeTrends.map(t => t.views), 10);
  const maxUniques = Math.max(...activeTrends.map(t => t.uniques), 10);
  const maxValue = Math.max(maxViews, maxUniques) * 1.15; // Give 15% head space

  // Generate SVG points
  const points = activeTrends.map((d, index) => {
    const x = paddingLeft + (index / Math.max(activeTrends.length - 1, 1)) * innerWidth;
    const yViews = paddingTop + innerHeight - (d.views / maxValue) * innerHeight;
    const yUniques = paddingTop + innerHeight - (d.uniques / maxValue) * innerHeight;
    return { x, yViews, yUniques, label: d.label, views: d.views, uniques: d.uniques };
  });

  // SVG Path definitions
  const viewsPath = points.length > 0 
    ? `M ${points[0].x} ${points[0].yViews} ` + points.slice(1).map(p => `L ${p.x} ${p.yViews}`).join(' ') 
    : '';

  const uniquesPath = points.length > 0 
    ? `M ${points[0].x} ${points[0].yUniques} ` + points.slice(1).map(p => `L ${p.x} ${p.yUniques}`).join(' ') 
    : '';

  const viewsAreaPath = points.length > 0
    ? `${viewsPath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`
    : '';

  const uniquesAreaPath = points.length > 0
    ? `${uniquesPath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`
    : '';

  // Sum total events for percentage ratios
  const deviceTotal = stats.hardware.devices.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const browserTotal = stats.hardware.browsers.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const osTotal = stats.hardware.os.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      
      {/* Dashboard Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">Global Presence Hub</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Advanced Visit Analytics</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Live Sync'}
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. OVERVIEW GRID METRIC CARDS */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Total Views */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Eye size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-blue-500 bg-blue-50/70 px-2.5 py-1 rounded-full uppercase tracking-wider">Accumulated</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Page Views</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {stats.overview.totalViews.toLocaleString()}
          </h3>
          <p className="text-slate-400 text-[10px] font-medium mt-1">Hits logged across all public pages</p>
        </div>

        {/* Card: Unique Visitors */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-50/70 px-2.5 py-1 rounded-full uppercase tracking-wider">GDPR Compliant</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Unique Visitors</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {stats.overview.totalUniques.toLocaleString()}
          </h3>
          <p className="text-slate-400 text-[10px] font-medium mt-1">Rolling hashed distinct sessions</p>
        </div>

        {/* Card: Active Sessions */}
        <div className="relative overflow-hidden bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl text-white group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/20 text-primary rounded-2xl border border-primary/20">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block shrink-0" />
              Live Now
            </div>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Visitors</p>
          <h3 className="text-4xl font-black text-white mt-1 tracking-tight flex items-baseline gap-2">
            {stats.overview.liveSessionCount}
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-normal normal-case">sessions</span>
          </h3>
          <p className="text-slate-500 text-[10px] font-medium mt-1.5">Users active in the last 5 minutes</p>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. DYNAMIC MAIN SVG TREND GRAPH */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
        
        {/* Header and Scope Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart2 className="text-primary w-5 h-5" />
              Traffic Analytics Curve
            </h4>
            <p className="text-slate-400 text-xs font-medium">Page hits compared with unique visits over time</p>
          </div>
          
          {/* Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl max-w-fit border border-slate-200/40">
            {(['daily', 'weekly', 'monthly'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => { setTimeScope(scope); setHoveredIndex(null); }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  timeScope === scope 
                    ? 'bg-white text-slate-950 shadow-sm font-bold border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Interactive SVG Graph */}
        <div className="relative">
          {activeTrends.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
              <AlertCircle size={24} className="mb-2 text-slate-300" />
              <p className="text-xs">No trend logs recorded for this timespan yet</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto select-none">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full min-w-[700px] h-auto overflow-visible"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="uniquesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines & Left Axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = paddingTop + ratio * innerHeight;
                  const labelVal = Math.round(maxValue - ratio * maxValue);
                  return (
                    <g key={i} className="opacity-45">
                      <line 
                        x1={paddingLeft} 
                        y1={yVal} 
                        x2={chartWidth - paddingRight} 
                        y2={yVal} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                      />
                      <text 
                        x={paddingLeft - 8} 
                        y={yVal + 4} 
                        textAnchor="end" 
                        className="text-[10px] font-bold fill-slate-400 font-sans"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Guides & Labels */}
                {points.map((p, index) => {
                  // Only label every N points on dense viewports
                  const labelSkip = activeTrends.length > 8 ? Math.ceil(activeTrends.length / 7) : 1;
                  const showLabel = index % labelSkip === 0;

                  return (
                    <g key={index}>
                      {showLabel && (
                        <text
                          x={p.x}
                          y={chartHeight - paddingBottom + 18}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-slate-400 font-sans"
                        >
                          {p.label}
                        </text>
                      )}

                      {/* Interactive Hover Vertical Strip */}
                      <rect
                        x={p.x - (innerWidth / Math.max(points.length - 1, 1)) / 2}
                        y={paddingTop}
                        width={innerWidth / Math.max(points.length - 1, 1)}
                        height={innerHeight}
                        className="fill-transparent cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      />
                    </g>
                  );
                })}

                {/* Views Filled Area */}
                <path d={viewsAreaPath} fill="url(#viewsGrad)" className="transition-all duration-300" />
                {/* Uniques Filled Area */}
                <path d={uniquesAreaPath} fill="url(#uniquesGrad)" className="transition-all duration-300" />

                {/* Views Stroke Line */}
                <path 
                  d={viewsPath} 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="transition-all duration-300"
                />

                {/* Uniques Stroke Line */}
                <path 
                  d={uniquesPath} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="transition-all duration-300"
                />

                {/* Highlight/Hover Overlay */}
                {hoveredIndex !== null && points[hoveredIndex] && (
                  <g className="transition-all duration-150">
                    {/* Vertical guideline */}
                    <line 
                      x1={points[hoveredIndex].x} 
                      y1={paddingTop} 
                      x2={points[hoveredIndex].x} 
                      y2={paddingTop + innerHeight} 
                      stroke="#94a3b8" 
                      strokeWidth="1.5"
                    />
                    
                    {/* Views Dot */}
                    <circle 
                      cx={points[hoveredIndex].x} 
                      cy={points[hoveredIndex].yViews} 
                      r="5.5" 
                      fill="#3b82f6" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />

                    {/* Uniques Dot */}
                    <circle 
                      cx={points[hoveredIndex].x} 
                      cy={points[hoveredIndex].yUniques} 
                      r="5" 
                      fill="#10b981" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />
                  </g>
                )}
              </svg>
            </div>
          )}

          {/* Floating Details Tooltip Panel */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-6 transition-all duration-150 animate-in fade-in zoom-in-95 text-xs font-sans z-10">
              <div>
                <span className="text-slate-400 font-bold block">Period</span>
                <span className="font-extrabold text-sm text-primary">{points[hoveredIndex].label}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Page Views
                </span>
                <span className="font-black text-sm">{points[hoveredIndex].views.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Uniques
                </span>
                <span className="font-black text-sm">{points[hoveredIndex].uniques.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-blue-500 inline-block" />
              Page Views (Hits)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Unique Hashed Visitors
            </span>
          </div>

        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. DUAL-GRID PANELS: POPULAR CONTENT & TRAFFIC SOURCES */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular Content */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Globe className="text-blue-500 w-5 h-5" />
                Popular Portfolio Content
              </h4>
              <p className="text-slate-400 text-xs font-medium">Most active URLs visited on your site</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {stats.topPages.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">No page views recorded yet</p>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="py-2.5 font-bold">Path / Link</th>
                    <th className="py-2.5 text-right font-bold">Total Hits</th>
                    <th className="py-2.5 text-right font-bold">Unique Visitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {stats.topPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 max-w-[240px] truncate break-all">
                        <a 
                          href={page.path} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:text-primary hover:underline flex items-center gap-1.5"
                        >
                          <ChevronRight size={12} className="text-slate-400 inline" />
                          {page.path}
                        </a>
                      </td>
                      <td className="py-3 text-right font-black text-slate-900">{page.views.toLocaleString()}</td>
                      <td className="py-3 text-right text-slate-500">{page.uniques.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Traffic Referral Sources */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="text-purple-500 w-5 h-5" />
              Traffic Acquisition Channels
            </h4>
            <p className="text-slate-400 text-xs font-medium">Origin referral sources directing visitors to you</p>
          </div>

          <div className="flex-1 space-y-4">
            {stats.topReferrers.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">No referrers logged yet</p>
            ) : (
              stats.topReferrers.map((ref, idx) => {
                const maxRef = stats.topReferrers[0]?.count || 1;
                const percentage = Math.round((ref.count / maxRef) * 100);
                
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {ref.name}
                      </span>
                      <span className="text-slate-500 font-extrabold">{ref.count.toLocaleString()} visits</span>
                    </div>
                    {/* Glass progress bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. THIRD-ROW METRICS: GEOGRAPHICAL MAP & HARDWAREBreakdown */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Geo Distribution (2/3 width on LG) */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Globe className="text-emerald-500 w-5 h-5" />
                Geographic Demographics
              </h4>
              <p className="text-slate-400 text-xs font-medium">Visitor locations based on request headers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.topCountries.length === 0 ? (
                <p className="text-slate-400 text-xs py-8 text-center col-span-2">No country data captured yet</p>
              ) : (
                stats.topCountries.map((c, idx) => {
                  const maxCountryVal = stats.topCountries[0]?.count || 1;
                  const ratio = Math.round((c.count / maxCountryVal) * 100);
                  
                  // Extract simple timezone labels to look friendly if they are long
                  const countryName = c.name.length > 20 ? c.name.split('/').pop()?.replace('_', ' ') || c.name : c.name;

                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                          {c.name.length === 2 ? c.name : '🌐'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block truncate max-w-[120px]">{countryName}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{ratio}% relative strength</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">{c.count.toLocaleString()} visits</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold mt-6 border-t border-slate-100 pt-3">
            * Geographic detection queries Render proxy IP routing and client timezone fallbacks.
          </div>
        </div>

        {/* Hardware Distribution Gauge Lists */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Laptop className="text-amber-500 w-5 h-5" />
                Hardware Breakdowns
              </h4>
              <p className="text-slate-400 text-xs font-medium">Device, Browser, and OS telemetry</p>
            </div>

            <div className="space-y-6">
              
              {/* Category: Devices */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Device Type Ratio</p>
                <div className="space-y-2">
                  {stats.hardware.devices.length === 0 ? (
                    <p className="text-slate-400 text-[10px]">No hardware detected</p>
                  ) : (
                    stats.hardware.devices.slice(0, 3).map((dev, i) => {
                      const pct = Math.round((dev.count / deviceTotal) * 100);
                      const barColor = i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-orange-400' : 'bg-slate-400';
                      
                      return (
                        <div key={i} className="text-xs">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>{dev.name}</span>
                            <span className="font-bold">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Category: Browsers */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Top Browsers</p>
                <div className="space-y-2">
                  {stats.hardware.browsers.length === 0 ? (
                    <p className="text-slate-400 text-[10px]">No browsers logged</p>
                  ) : (
                    stats.hardware.browsers.slice(0, 3).map((brow, i) => {
                      const pct = Math.round((brow.count / browserTotal) * 100);
                      const barColor = i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-400' : 'bg-slate-400';

                      return (
                        <div key={i} className="text-xs">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>{brow.name}</span>
                            <span className="font-bold">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Category: OS */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Operating Systems</p>
                <div className="space-y-2">
                  {stats.hardware.os.length === 0 ? (
                    <p className="text-slate-400 text-[10px]">No OS logged</p>
                  ) : (
                    stats.hardware.os.slice(0, 3).map((os, i) => {
                      const pct = Math.round((os.count / osTotal) * 100);
                      const barColor = i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-teal-400' : 'bg-slate-400';

                      return (
                        <div key={i} className="text-xs">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>{os.name}</span>
                            <span className="font-bold">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          </div>
          
          <div className="text-[9px] text-slate-400 font-semibold pt-4">
            Analytics parse based on standard HTTP user agent requests.
          </div>
        </div>

      </div>

    </div>
  );
}
