import React from 'react';
import { Activity, Clock, Zap, Cpu, CheckCircle2, Box, Truck } from 'lucide-react';

export const AvailabilityBar: React.FC = () => {
  return (
    <section id="availability" className="border-y border-cyan-900/40 bg-slate-950/70 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Activity size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Live 3D Print Farm &amp; Pan-India Dispatch Telemetry
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  FARM ACTIVE · BENGALURU &amp; DELHI HUBS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                12× Bambu Lab X1-Carbon &amp; Formlabs 3+ systems running 24/7 for swift delivery across India.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Truck size={14} className="text-cyan-400" />
              <span>Courier Cut-Off: <strong className="text-cyan-300">Today, 5:00 PM IST</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Telemetry Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>ACTIVE 3D PRINTERS</span>
              <Cpu size={14} className="text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white">12 / 12</span>
              <span className="text-[11px] text-emerald-400 font-mono">100% Online</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-full rounded-full" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>AVG DISPATCH TIME</span>
              <Clock size={14} className="text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white">24 Hours</span>
              <span className="text-[11px] text-slate-400 font-mono">In-stock models</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-400 h-full w-[85%] rounded-full" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>MATERIAL SPOOLS &amp; RESIN</span>
              <Box size={14} className="text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white">480+ kg</span>
              <span className="text-[11px] text-purple-300 font-mono">High-Temp / Tough</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[92%] rounded-full" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>QC ACCURACY</span>
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white">±0.05 mm</span>
              <span className="text-[11px] text-emerald-400 font-mono">Strict micrometer test</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[99.5%] rounded-full" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
