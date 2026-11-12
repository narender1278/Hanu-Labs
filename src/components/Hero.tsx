import React from 'react';
import { ArrowRight, Layers, Sparkles, Box, Check, MessageSquare, Heart } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenFlagship3D: () => void;
  flagshipProduct?: Product;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onOpenFlagship3D,
  flagshipProduct,
}) => {
  return (
    <section id="home" className="relative pt-10 pb-16 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Pitch Copy */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono w-fit">
              <Sparkles size={14} className="text-cyan-400" />
              <span>CUSTOM 3D PRINTING · MADE TO ORDER IN INDIA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Anime Keychains, Sacred Idols, <br />
              <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Photo-to-3D &amp; Business Parts.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              From favorite anime character keychains, Royal Enfield &amp; Thar miniatures, respectful devotional idols, personalized photo-to-3D lithophane night lamps, to custom phone cases and industrial gap-filler parts for Indian businesses.
            </p>

            {/* Indian Market Offer Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
                ✨ Anime &amp; Superhero Keychains
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
                🏍️ Bike &amp; Car Scale Replicas
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-pink-300">
                🖼️ Photo to 3D Night Lamps
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">
                🛕 Respectful Pooja Idols
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                🏭 Business Gap Fillers
              </span>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs font-mono shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <span>Browse Catalog (From ₹299)</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenFlagship3D}
                className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Layers size={15} className="text-cyan-400" />
                <span>Inspect in 3D (360°)</span>
              </button>

              <a
                href="https://wa.me/919845012894?text=Hello%20LayerLab%203D!%20I%20want%20to%20order%20a%20custom%203D%20model/keychain."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare size={14} />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Key Trust Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>UPI / GPay / PhonePe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>100% Solid &amp; Tough Core</span>
              </div>
            </div>

          </div>

          {/* Right Interactive 3D Teaser Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-900/50 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl overflow-hidden group">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Box size={14} className="text-cyan-400" />
                  <span>INTERACTIVE 3D VIEWER</span>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  READY TO INSPECT
                </span>
              </div>

              {/* 3D Showcase Preview */}
              <div className="my-5 py-6 px-4 rounded-2xl bg-radial from-cyan-950/60 to-slate-950/90 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-3 border border-cyan-500/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <span className="text-4xl group-hover:rotate-12 transition-transform duration-500">⚡</span>
                </div>
                
                <h3 className="text-base font-bold text-white font-mono">
                  {flagshipProduct ? flagshipProduct.name : 'Super Saiyan 3D Chibi Keychain'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs font-mono">
                  Full 360° orbit, exploded layer view, and material finish choices.
                </p>

                <div className="mt-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-amber-300">
                    Gloss Finish
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300">
                    Metal Keyring
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-emerald-300">
                    ₹299 INR
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenFlagship3D}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Layers size={14} />
                <span>Go Inside This Product in 3D ↗</span>
              </button>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Free shipping above ₹999</span>
                <span className="text-emerald-400 font-bold">Fast Pan-India Speed Post</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
