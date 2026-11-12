import React from 'react';
import { Sparkles, Bike, Heart, Image as ImageIcon, Smartphone, Wrench, Building2 } from 'lucide-react';

export const SolutionsSection: React.FC = () => {
  const categories = [
    {
      icon: <Sparkles className="text-amber-400" size={24} />,
      title: 'Anime & Pop-Culture 3D Keychains',
      desc: 'Dragon Ball Z, Demon Slayer, One Piece, Naruto, and Marvel/DC heroes crafted in drop-resistant solid tough resin with nickel steel keyrings.',
      tag: 'FOR ANIME FANS & COLLECTORS',
    },
    {
      icon: <Bike className="text-cyan-400" size={24} />,
      title: 'Royal Enfield, Thar & Superbike Replicas',
      desc: 'Precision scale miniatures of beloved Indian cruisers, 4x4 SUVs, sports cars, custom key chains, and helmet action-cam mounts.',
      tag: 'FOR BIKERS & AUTO ENTHUSIASTS',
    },
    {
      icon: <span className="text-2xl">🛕</span>,
      title: 'Devotional Sacred Idols & Pooja Decor',
      desc: 'Respectfully designed Ganesha, Adiyogi Shiva, and temple replicas with ornate halo prabhavalis and metallic antique gold/bronze luster.',
      tag: 'FOR HOMES, CARS & POOJA ROOMS',
    },
    {
      icon: <ImageIcon className="text-pink-400" size={24} />,
      title: 'Human Photo to 3D Lithophane Lamps',
      desc: 'Convert any portrait, wedding, or couple photo into a 3D curved lithophane night lamp. When backlit by warm LED, your memories illuminate in 3D.',
      tag: 'FOR PERSONALIZED MEMORABLE GIFTS',
    },
    {
      icon: <Smartphone className="text-purple-400" size={24} />,
      title: 'Cyber Armor Custom Phone Cases',
      desc: 'Heavy-duty impact-absorbing phone covers with hexagonal heat ventilation, camera bezel lip protection, and tactile clicky side buttons.',
      tag: 'FOR IPHONE, SAMSUNG, ONEPLUS',
    },
    {
      icon: <Wrench className="text-emerald-400" size={24} />,
      title: 'Business Gap Fillers & Machine Parts',
      desc: 'Custom-fit machinery spacers, replacement gear wheels, vibration dampening grommets, and workshop fixtures without costly foreign imports.',
      tag: 'FOR FACTORIES, WORKSHOPS & MSMES',
    },
    {
      icon: <Building2 className="text-sky-400" size={24} />,
      title: 'Corporate 3D Logo Plinths & Awards',
      desc: 'Elevate office receptions and executive desks with 3D embossed corporate logos, company mascots, nameplates, and custom awards.',
      tag: 'FOR BUSINESS REPRESENTATIONS',
    },
  ];

  return (
    <section id="solutions" className="py-16 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
            WHAT WE MAKE &amp; SELL ACROSS INDIA
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            From Trending Consumer Collectibles to Custom Business Parts.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Every product is manufactured on high-precision 3D printing equipment in India. Whether you need a single custom keychain or a batch of 500 business gap fillers, we fulfill with fast turnarounds.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2 font-mono">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <span className="inline-block mt-4 text-[10px] font-mono font-bold text-cyan-400/90 tracking-wider">
                {item.tag}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
