import React, { useState } from 'react';
import { Product, MaterialFinish } from '../types';
import { 
  Box, 
  Layers, 
  ShoppingCart, 
  Tag, 
  Check, 
  Search, 
  Clock, 
  Ruler, 
  Plus,
  Sparkles
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onOpen3D: (product: Product) => void;
  onAddToCart: (product: Product, material: MaterialFinish, quantity: number) => void;
  isAdminMode?: boolean;
  onEditProduct?: (product: Product) => void;
  onAddNewProduct?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onOpen3D,
  onAddToCart,
  isAdminMode,
  onEditProduct,
  onAddNewProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'anime_keychains', label: 'Anime Keychains' },
    { id: 'cars_bikes', label: 'Cars & Bikes' },
    { id: 'gods_idols', label: 'Gods & Idols' },
    { id: 'photo_to_3d', label: 'Photo to 3D' },
    { id: 'phone_cases', label: 'Phone Cases' },
    { id: 'business_gapfillers', label: 'Business Gap Fillers' },
    { id: 'corporate_display', label: 'Corporate Displays' },
  ];

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesAvailability = 
      selectedAvailability === 'all' || 
      (selectedAvailability === 'in_stock' && (p.availability === 'in_stock' || p.availability === 'low_stock')) ||
      (selectedAvailability === 'made_to_order' && p.availability === 'made_to_order');
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesAvailability && matchesSearch;
  });

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product, product.defaultMaterial, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const getAvailabilityBadge = (p: Product) => {
    if (p.availability === 'in_stock') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          In Stock ({p.stock} units) · {p.leadTime}
        </span>
      );
    }
    if (p.availability === 'low_stock') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Low Stock ({p.stock} left) · {p.leadTime}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px]">
        <Clock size={10} />
        {p.leadTime}
      </span>
    );
  };

  const getEmojiIcon = (category: string) => {
    switch (category) {
      case 'anime_keychains': return '⚡';
      case 'cars_bikes': return '🏍️';
      case 'gods_idols': return '🛕';
      case 'photo_to_3d': return '🖼️';
      case 'phone_cases': return '📱';
      case 'business_gapfillers': return '⚙️';
      case 'corporate_display': return '🏢';
      default: return '📦';
    }
  };

  return (
    <section id="products" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase mb-2">
              <Box size={14} />
              <span>CUSTOM 3D PRODUCT CATALOG · INDIA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending 3D Products &amp; Live Availability
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
              Explore our made-to-order anime keychains, bike miniatures, devotional idols, photo lamps and business parts. Click <strong>Inspect in 3D</strong> to orbit 360°, separate layers, and select your preferred material finish.
            </p>
          </div>

          {isAdminMode && onAddNewProduct && (
            <button
              onClick={onAddNewProduct}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer self-start md:self-auto"
            >
              <Plus size={16} />
              <span>Add New Product (Admin)</span>
            </button>
          )}
        </div>

        {/* Filter and Search Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input & Availability Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search keychains, idols, cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Availability</option>
              <option value="in_stock">In Stock / Ships Today</option>
              <option value="made_to_order">Custom 3D Print</option>
            </select>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
            <Box size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-mono">No matching products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try modifying your category filter or search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prod) => {
              const hasDiscount = (prod.discountPercent && prod.discountPercent > 0) || (prod.salePrice && prod.salePrice < prod.basePrice);
              const displayPrice = prod.salePrice || prod.basePrice;

              return (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/40 group relative overflow-hidden"
                >
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {getAvailabilityBadge(prod)}

                    {hasDiscount && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-mono font-bold text-[10px] shadow-sm">
                        <Tag size={10} />
                        <span>-{prod.discountPercent || Math.round((1 - (prod.salePrice || prod.basePrice) / prod.basePrice) * 100)}% OFF</span>
                      </span>
                    )}
                  </div>

                  {/* 3D Model Visual Preview Trigger Area */}
                  <div
                    onClick={() => onOpen3D(prod)}
                    className="h-44 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 flex flex-col items-center justify-center relative cursor-pointer group-hover:border-cyan-500/50 transition-colors overflow-hidden"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl group-hover:rotate-6 transition-transform">
                        {getEmojiIcon(prod.category)}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                      <Layers size={12} />
                      <span>Inspect in 3D (360°)</span>
                    </div>

                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 flex-1">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                      {prod.name}
                    </h3>
                    
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Ruler size={12} className="text-cyan-400 shrink-0" />
                        <span className="truncate">{prod.dimensions}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Sparkles size={12} className="text-purple-400 shrink-0" />
                        <span>{prod.weightGrams}g mass</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Row in INR (₹) */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold font-mono text-cyan-400">
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs font-mono text-slate-500 line-through">
                            ₹{prod.basePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Incl. all taxes</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdminMode && onEditProduct && (
                        <button
                          onClick={() => onEditProduct(prod)}
                          className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                          title="Edit Product & Discount (Admin)"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => onOpen3D(prod)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                        title="Open interactive 3D studio"
                      >
                        <Layers size={14} className="text-cyan-400" />
                        <span className="hidden sm:inline">3D View</span>
                      </button>

                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                          justAddedId === prod.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-500/20'
                        }`}
                      >
                        {justAddedId === prod.id ? (
                          <>
                            <Check size={14} className="stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            <span>Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
