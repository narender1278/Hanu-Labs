import React from 'react';
import { FileUp, SearchCheck, CheckSquare, Truck, DollarSign, Scale, Sparkles, Send } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Send Requirement or CAD',
      desc: 'Submit your 3D file (.STL, .STEP, .OBJ) or a sketch with key dimensions, quantity and mechanical requirements.',
    },
    {
      step: '02',
      title: 'Design Feasibility & Slicing QC',
      desc: 'Our mechanical team checks wall thickness, orientation stresses, material suitability, infill density and provides an instant quote.',
    },
    {
      step: '03',
      title: 'First-Article Approval',
      desc: 'For high-tolerance or sensitive jobs, inspect digital 3D model renders or request a physical sample before full batch production.',
    },
    {
      step: '04',
      title: 'Print, Post-Process & Deliver',
      desc: 'Parts undergo ultrasonic wash, thermal cure, deburring and precision micrometer QC before express sealed dispatch.',
    },
  ];

  const pricingPillars = [
    {
      symbol: '📐',
      title: 'CAD Engineering & Slicing',
      desc: 'Mesh repair, support optimization, orientation setup, and tolerance analysis.',
    },
    {
      symbol: '⚖️',
      title: 'Material & Machine Time',
      desc: 'Billed on actual resin or carbon fiber volume and continuous industrial printer runtime.',
    },
    {
      symbol: '✨',
      title: 'Finishing & Tolerance QC',
      desc: 'Wash, UV curing, surface vapor smoothing, threaded brass heat-set insert installation.',
    },
    {
      symbol: '🚀',
      title: 'Express Dispatch & Archive',
      desc: 'Sealed moisture-barrier packaging, batch traceability, and permanent CAD spec storage for 1-click reorders.',
    },
  ];

  return (
    <section id="process" className="py-20 border-t border-slate-900 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: 4-Step Process */}
          <div className="lg:col-span-7">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
              SEAMLESS ORDER FLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              From Concept to Finished Part in 4 Steps.
            </h2>
            <p className="text-slate-400 text-sm mt-3 mb-8">
              We eliminate complex bureaucratic supplier onboarding. Send what you need and get immediate production status.
            </p>

            <div className="space-y-6">
              {steps.map((st) => (
                <div key={st.step} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-sm">
                    {st.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">{st.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Transparency Panel */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-900/40 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
                  TRANSPARENT VALUE MATRIX
                </span>
                <h3 className="text-xl font-bold text-white font-mono mt-1">
                  How We Itemize Every Quote
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Never pay inflated flat margins. We price based on engineering reality:
                </p>
              </div>

              <div className="space-y-4">
                {pricingPillars.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 pb-3 border-b border-slate-800/80 last:border-0 last:pb-0">
                    <span className="text-xl shrink-0">{p.symbol}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                💡 Re-orders receive an automatic 15% discount as CAD setup and slice testing is already validated!
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
