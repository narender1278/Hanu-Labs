import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 font-mono text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            <Cpu size={14} />
          </div>
          <span className="text-slate-300 font-bold">
            LayerLab 3D · Custom 3D Printing &amp; Manufacturing (India)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-slate-400">
          <span>Bengaluru &amp; Delhi 3D Hubs</span>
          <span>BlueDart &amp; Delhivery Logistics</span>
          <span>UPI / GPay / NetBanking / COD</span>
          <span className="text-cyan-400">Farm: 100% Operational</span>
        </div>

        <div className="text-slate-600 text-[11px]">
          © {new Date().getFullYear()} LayerLab 3D. Made with passion in India.
        </div>

      </div>
    </footer>
  );
};
