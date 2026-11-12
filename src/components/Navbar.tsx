import React from 'react';
import { ShoppingCart, ShieldCheck, Cpu, MessageSquare, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  onSelectProductFor3D?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  isAdminMode,
  onToggleAdmin,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/919845012894?text=Hello%20LayerLab%203D!%20I%20have%20an%20enquiry%20regarding%20custom%203D%20printing%20in%20India.', '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top micro announcement bar for India */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-purple-950 px-4 py-1 text-[11px] font-mono text-center text-slate-300 border-b border-slate-900 flex items-center justify-center gap-2">
        <Truck size={12} className="text-cyan-400" />
        <span>Pan-India Delivery via BlueDart &amp; Delhivery · Free Shipping on Orders Above ₹999 · UPI &amp; COD Available</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-white text-lg leading-none">
                <span>LayerLab</span>
                <span className="bg-gradient-to-r from-cyan-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">3D</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-1">
                Custom 3D Printing &amp; Manufacturing · India
              </span>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-mono font-medium text-slate-300">
          <a href="#products" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span>Store &amp; 3D Models</span>
          </a>
          <a href="#solutions" className="hover:text-cyan-400 transition-colors">
            Categories
          </a>
          <a href="#availability" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>Live Availability</span>
          </a>
          <a href="#process" className="hover:text-cyan-400 transition-colors">
            How It Works
          </a>
          <a href="#quote" className="hover:text-cyan-400 transition-colors">
            Custom Quote
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* WhatsApp Direct Chat Button */}
          <button
            onClick={handleOpenWhatsApp}
            className="hidden sm:flex px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium items-center gap-1.5 transition-colors cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare size={14} className="text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          {/* Admin Portal Toggle */}
          <button
            onClick={onToggleAdmin}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              isAdminMode 
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30' 
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-purple-500/50 hover:text-white'
            }`}
            title="Toggle Admin Privileges (Manage products, discounts, orders & Supabase)"
          >
            <ShieldCheck size={14} className={isAdminMode ? 'text-white' : 'text-purple-400'} />
            <span className="hidden sm:inline">Admin Mode</span>
            {isAdminMode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            aria-label="View shopping cart"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline font-mono">Cart</span>
            {totalCartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-slate-950 font-bold text-[11px] leading-none">
                {totalCartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
