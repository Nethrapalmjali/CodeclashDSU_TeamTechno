import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, Fingerprint, Activity, RadioTower, ShieldAlert, 
  Map, Bell, Zap, Crosshair, Wifi, Menu, X, Rocket, Database, Settings
} from 'lucide-react';
import { 
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  RadarChart, Radar as RechartsRadar, ZAxis
} from 'recharts';

const MOCK_RADAR_DATA = [
  { angle: 0, distance: 120, severity: 'Low', id: 'RF-99' },
  { angle: 45, distance: 80, severity: 'Medium', id: 'RF-102' },
  { angle: 110, distance: 40, severity: 'High', id: 'RF-X7' },
  { angle: 220, distance: 150, severity: 'Low', id: 'RF-33' },
  { angle: 300, distance: 60, severity: 'High', id: 'JAM-1' },
];

const SIGNAL_DATA = Array.from({ length: 20 }).map((_, i) => ({
  time: `T-${20-i}`,
  noise: 20 + Math.random() * 5,
  signal1: 40 + Math.random() * 20,
  signal2: 30 + Math.random() * 10,
  jamming: i > 15 ? 80 + Math.random() * 20 : 10,
}));

const FREQ_HOPPING_DATA = Array.from({ length: 50 }).map(() => ({
  time: Date.now() - Math.random() * 10000,
  freq: 2.4 + Math.random() * 0.5,
  power: Math.random() * 100,
}));

export default function RFDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'CRITICAL', msg: 'High Power Jammer detected at Bearing 110°', time: 'Just now' },
    { id: 2, type: 'WARNING', msg: 'Frequency Hopping source identified', time: '2 mins ago' },
    { id: 3, type: 'INFO', msg: 'UAV Dispatch Ready', time: '5 mins ago' },
  ]);

  // Simulate incoming alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const isCritical = Math.random() > 0.8;
      const newAlert = {
        id: Date.now(),
        type: isCritical ? 'CRITICAL' : 'WARNING',
        msg: isCritical ? 'Unknown Rogue RF Burst Detected' : 'Anomalous SNR Spike',
        time: 'Just now'
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }} animate={{ x: sidebarOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -300) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col shadow-2xl lg:shadow-none"
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 text-cyan-400">
            <RadioTower size={28} className="animate-pulse" />
            <span className="text-xl font-bold tracking-wider">RFIDS-X</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: <Radar size={20} />, label: 'Live Radar' },
            { id: 'analysis', icon: <Activity size={20} />, label: 'Signal Analysis' },
            { id: 'ai', icon: <Fingerprint size={20} />, label: 'AI Threat ID' },
            { id: 'map', icon: <Map size={20} />, label: 'Geo-Tracking' },
            { id: 'drone', icon: <Rocket size={20} />, label: 'UAV Dispatch' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500">
            <Database size={16} />
            <span>System Status: <span className="text-emerald-400">Online</span></span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-300 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hidden sm:block">
              Tactical RF Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="p-2 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 border-2 border-slate-700 overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              <img src="https://ui-avatars.com/api/?name=Team+Techno&background=random" alt="User" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Signals', value: '24', icon: <Wifi className="text-cyan-400" size={24}/>, trend: '+3', color: 'from-cyan-500/20 to-transparent', border: 'border-cyan-500/30' },
                { label: 'High Severity', value: '2', icon: <ShieldAlert className="text-red-400" size={24}/>, trend: '+1', color: 'from-red-500/20 to-transparent', border: 'border-red-500/30' },
                { label: 'Network SNR', value: '42 dB', icon: <Activity className="text-emerald-400" size={24}/>, trend: 'Stable', color: 'from-emerald-500/20 to-transparent', border: 'border-emerald-500/30' },
                { label: 'UAV Units', value: 'Ready', icon: <Rocket className="text-purple-400" size={24}/>, trend: 'Standby', color: 'from-purple-500/20 to-transparent', border: 'border-purple-500/30' },
              ].map((kpi, idx) => (
                <motion.div key={idx} variants={itemVariants} className={`bg-gradient-to-br ${kpi.color} bg-slate-900 rounded-xl p-5 border ${kpi.border} relative overflow-hidden group hover:shadow-lg transition-all`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-1">{kpi.label}</p>
                      <h3 className="text-3xl font-bold text-white tracking-tight">{kpi.value}</h3>
                    </div>
                    <div className="p-2 bg-slate-950/50 rounded-lg backdrop-blur-md border border-slate-800">
                      {kpi.icon}
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-medium text-slate-500">
                    <span className={kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}>{kpi.trend}</span> since last scan
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              
              {/* Radar View */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6 z-10 relative">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Crosshair className="text-cyan-400" /> Live Detection Radar
                  </h2>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /> High</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500" /> Med</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-cyan-500" /> Low</span>
                  </div>
                </div>
                
                {/* Radar Mockup Animation Overlay */}
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center pt-10">
                   <motion.div 
                     animate={{ rotate: 360 }} 
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="w-[150%] aspect-square rounded-full border border-cyan-500/10 border-t-cyan-500/40 relative shadow-[0_0_50px_rgba(6,182,212,0.1)]"
                     style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(6,182,212,0.15) 100%)' }}
                   />
                </div>

                <div className="h-[400px] w-full z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" dataKey="angle" name="Bearing" unit="°" stroke="#475569" hide />
                      <YAxis type="number" dataKey="distance" name="Distance" unit="m" stroke="#475569" hide />
                      <ZAxis type="category" dataKey="severity" name="Severity" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#06b6d4' }}
                      />
                      <Scatter name="RF Sources" data={MOCK_RADAR_DATA} fill="#06b6d4">
                        {MOCK_RADAR_DATA.map((entry, index) => (
                           <cell key={`cell-${index}`} fill={entry.severity === 'High' ? '#ef4444' : entry.severity === 'Medium' ? '#f59e0b' : '#06b6d4'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom glowing rings for structural feel */}
                <div className="absolute w-full h-[400px] pointer-events-none mt-[64px] flex items-center justify-center opacity-50 z-0">
                  <div className="absolute w-[80%] aspect-square rounded-full border border-slate-700 border-dashed" />
                  <div className="absolute w-[50%] aspect-square rounded-full border border-slate-700" />
                  <div className="absolute w-[20%] aspect-square rounded-full border border-cyan-500/50" />
                  <div className="w-[1px] h-[80%] bg-slate-700/50 absolute" />
                  <div className="h-[1px] w-[80%] bg-slate-700/50 absolute" />
                </div>
              </motion.div>

              {/* Alert Feed */}
              <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Zap className="text-yellow-400" /> Threat Log
                </h2>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                  <AnimatePresence>
                    {alerts.map((alert) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        key={alert.id}
                        className={`p-3 rounded-lg border-l-4 ${alert.type === 'CRITICAL' ? 'border-red-500 bg-red-500/10' : alert.type === 'WARNING' ? 'border-yellow-500 bg-yellow-500/10' : 'border-cyan-500 bg-cyan-500/10'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold ${alert.type === 'CRITICAL' ? 'text-red-400' : alert.type === 'WARNING' ? 'text-yellow-400' : 'text-cyan-400'}`}>{alert.type}</span>
                          <span className="text-xs text-slate-500">{alert.time}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-200">{alert.msg}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Feature 1: Signal SNR Chart */}
              <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 overflow-hidden">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Activity className="text-indigo-400" /> Power vs Noise (SNR)
                </h2>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SIGNAL_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="signal1" stroke="#06b6d4" strokeWidth={2} dot={false} name="Source A" />
                      <Line type="monotone" dataKey="jamming" stroke="#ef4444" strokeWidth={2} dot={false} name="Jammer" />
                      <Line type="monotone" dataKey="noise" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Noise Floor" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

                           {/* NEW Feature 2: Frequency Hopping Tracker AI */}
              <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Fingerprint className="text-purple-400" /> AI Frequency Hopping Tracker
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Neural network pattern analysis suggests a 94% probability of intentional Frequency-Hopping Spread Spectrum (FHSS) evasion tactics.
                </p>
                <div className="h-[200px] w-full border border-slate-800 rounded bg-slate-950 relative overflow-hidden">
                   {/* Mock Frequency hopping visualization */}
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                   <ResponsiveContainer width="100%" height="100%">
                     <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                       <XAxis type="number" dataKey="time" domain={['dataMin', 'dataMax']} hide />
                       <YAxis type="number" dataKey="freq" domain={[2.0, 3.0]} stroke="#475569" fontSize={10} tickFormatter={(val)=>val.toFixed(1)+'G'} />
                       <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{backgroundColor:'#0f172a', borderColor:'#334155'}} />
                       <Scatter name="Burst" data={FREQ_HOPPING_DATA} fill="#a855f7" line shape="circle" />
                     </ScatterChart>
                   </ResponsiveContainer>
                </div>
              </motion.div>

              {/* NEW Feature 3: Automated Drone Dispatch Panel */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-xl p-4 sm:p-6 flex flex-col justify-between group shadow-[0_0_30px_rgba(139,92,246,0.05)]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                      <Rocket className="text-emerald-400" /> Automated UAV Neutralizer
                    </h2>
                    <span className="px-2 py-1 text-xs font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    Deploy autonomous drone swarm to triangulate and neutralize high-severity RF interference at localized coordinates.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Target Lock:</span>
                      <span className="text-red-400 font-mono">JAM-1 (Brg 300°, 60m)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Fleet Status:</span>
                      <span className="text-emerald-400 font-mono">3 / 3 Ready</span>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(52,211,153,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <Rocket size={18} /> Dispatch UAV Swarm
                </motion.button>
              </motion.div>

            </div>
          </motion.div>
        </main>
      </div>

      {/* Global Custom Scrollbar Styles appended to avoid inline style clutter */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
