import React, { useState } from 'react';
import { 
  Product, 
  DiscountCoupon, 
  Order, 
  Inquiry, 
  SupabaseConfigStatus,
  Model3DPreset,
  AvailabilityStatus,
  MaterialFinish,
  ProductCategory
} from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Database, 
  ShoppingBag, 
  Package, 
  Check, 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Inbox
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  discounts: DiscountCoupon[];
  orders: Order[];
  inquiries: Inquiry[];
  supabaseStatus: SupabaseConfigStatus;
  onRefreshData: () => void;
  onProductAdded: (prod: Product) => void;
  onProductUpdated: (prod: Product) => void;
  onProductDeleted: (id: string) => void;
  onDiscountAdded: (discount: DiscountCoupon) => void;
  onDiscountToggled: (id: string) => void;
  onDiscountDeleted: (id: string) => void;
  onOrderStatusUpdated: (orderId: string, status: Order['fulfillmentStatus']) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  discounts,
  orders,
  inquiries,
  supabaseStatus,
  onRefreshData,
  onProductAdded,
  onProductUpdated,
  onProductDeleted,
  onDiscountAdded,
  onDiscountToggled,
  onDiscountDeleted,
  onOrderStatusUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'discounts' | 'orders' | 'supabase' | 'inquiries'>('products');
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const [supabaseUrl, setSupabaseUrl] = useState<string>(supabaseStatus.url || '');
  const [supabaseKey, setSupabaseKey] = useState<string>('');
  const [savingSupabase, setSavingSupabase] = useState<boolean>(false);
  const [supabaseSaveMsg, setSupabaseSaveMsg] = useState<string | null>(null);

  // New product form in INR
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'anime_keychains' as ProductCategory,
    description: '',
    basePrice: 499,
    discountPercent: 15,
    stock: 25,
    availability: 'in_stock' as AvailabilityStatus,
    leadTime: 'In Stock · Ships in 24h across India',
    dimensions: '75 × 45 × 12 mm',
    weightGrams: 35,
    model3dPreset: 'anime_keychain' as Model3DPreset,
    defaultMaterial: 'vibrant_gloss' as MaterialFinish,
  });

  // New discount coupon form in INR
  const [newDisc, setNewDisc] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 15,
    minOrderValue: 499,
    description: '',
  });

  if (!isOpen) return null;

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProd,
        availableMaterials: ['vibrant_gloss', 'gold_bronze', 'tough_resin', 'carbon_fiber', 'titanium'],
        features: ['Drop-tested tough core', 'Made in India', 'Sub-millimeter 3D accuracy ±0.05mm'],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create product');
      const created = await res.json();
      onProductAdded(created);
      setShowAddProductModal(false);
      setNewProd({
        name: '',
        category: 'anime_keychains',
        description: '',
        basePrice: 499,
        discountPercent: 15,
        stock: 25,
        availability: 'in_stock',
        leadTime: 'In Stock · Ships in 24h across India',
        dimensions: '75 × 45 × 12 mm',
        weightGrams: 35,
        model3dPreset: 'anime_keychain',
        defaultMaterial: 'vibrant_gloss',
      });
    } catch (err: any) {
      alert(err.message || 'Error creating product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) throw new Error('Failed to update product');
      const updated = await res.json();
      onProductUpdated(updated);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Error updating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the Indian store?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onProductDeleted(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisc.code.trim()) return;

    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDisc),
      });

      if (!res.ok) throw new Error('Failed to create coupon');
      const created = await res.json();
      onDiscountAdded(created);
      setShowAddDiscountModal(false);
      setNewDisc({
        code: '',
        type: 'percentage',
        value: 15,
        minOrderValue: 499,
        description: '',
      });
    } catch (err: any) {
      alert(err.message || 'Error creating coupon');
    }
  };

  const handleToggleDiscount = async (id: string) => {
    try {
      const res = await fetch(`/api/discounts/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        onDiscountToggled(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      const res = await fetch(`/api/discounts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDiscountDeleted(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSupabase(true);
    setSupabaseSaveMsg(null);

    try {
      const res = await fetch('/api/supabase/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: supabaseUrl, anonKey: supabaseKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setSupabaseSaveMsg('Supabase credentials successfully saved and validated!');
        onRefreshData();
      } else {
        setSupabaseSaveMsg(data.error || 'Failed saving credentials');
      }
    } catch (err: any) {
      setSupabaseSaveMsg(err.message || 'Error connecting to backend');
    } finally {
      setSavingSupabase(false);
    }
  };

  const copySupabaseSql = () => {
    const sql = `-- Run this in your Supabase SQL editor:
create extension if not exists "uuid-ossp";

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  base_price numeric(10,2) not null,
  discount_percent numeric(5,2) default 0,
  sale_price numeric(10,2),
  stock integer default 10,
  availability text default 'in_stock',
  created_at timestamptz default now()
);

create table if not exists public.discounts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  type text not null,
  value numeric(10,2) not null,
  is_active boolean default true
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  total_amount numeric(10,2) not null,
  fulfillment_status text default 'printing'
);`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-5xl bg-slate-950 border border-purple-900/50 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Admin Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  LayerLab 3D Admin Control Center (India)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                  ADMIN PRIVILEGES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Manage products, set discounts in ₹, update UPI/COD customer orders &amp; Supabase database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshData}
              title="Refresh Data from Backend"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-900/30 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package size={14} />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'discounts'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tag size={14} />
            <span>Coupons in ₹ ({discounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database size={14} />
            <span>Supabase Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Inbox size={14} />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Products Management */}
        {activeTab === 'products' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Store Product Inventory</h3>
                <p className="text-slate-400">Add, remove, or modify product pricing in ₹, discounts %, and availability.</p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">3D Preset</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Sale Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-white max-w-[180px] truncate">{p.name}</td>
                        <td className="p-3 capitalize">{p.category.replace('_', ' ')}</td>
                        <td className="p-3 text-cyan-400">{p.model3dPreset}</td>
                        <td className="p-3">₹{p.basePrice}</td>
                        <td className="p-3">
                          {p.discountPercent ? (
                            <span className="text-pink-400 font-bold">-{p.discountPercent}%</span>
                          ) : (
                            <span className="text-slate-600">0%</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-emerald-400">₹{p.salePrice || p.basePrice}</td>
                        <td className="p-3">{p.stock}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            p.availability === 'in_stock'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : p.availability === 'low_stock'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 cursor-pointer"
                            title="Remove Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Discounts & Coupons */}
        {activeTab === 'discounts' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Promotional Discount Coupons (INR)</h3>
                <p className="text-slate-400">Generate coupon codes for festive sales (Diwali, New Year) or launch discounts.</p>
              </div>

              <button
                onClick={() => setShowAddDiscountModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <Plus size={15} />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {discounts.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-sm">
                      {d.code}
                    </span>
                    <button
                      onClick={() => handleToggleDiscount(d.id)}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        d.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {d.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div>
                    <span className="text-base font-bold text-white">
                      {d.type === 'percentage' ? `${d.value}% OFF` : `₹${d.value} OFF`}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{d.description || 'No description'}</p>
                    {d.minOrderValue ? (
                      <span className="text-[10px] text-slate-500 block mt-1">Min. cart: ₹{d.minOrderValue}</span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500">Redeemed: {d.usageCount} times</span>
                    <button
                      onClick={() => handleDeleteDiscount(d.id)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
            <div>
              <h3 className="text-sm font-bold text-white">Pan-India Customer Orders</h3>
              <p className="text-slate-400">Track orders from checkout (UPI, PhonePe, COD) and update print farm queue status.</p>
            </div>

            {orders.length === 0 ? (
              <p className="text-slate-500">No orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold text-sm">{ord.orderNumber}</span>
                        <span className="text-slate-400">· {new Date(ord.createdAt).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Farm Status:</span>
                        <select
                          value={ord.fulfillmentStatus}
                          onChange={(e) => onOrderStatusUpdated(ord.id, e.target.value as any)}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-cyan-300"
                        >
                          <option value="processing">Processing</option>
                          <option value="printing">Printing on 3D Farm</option>
                          <option value="qc_inspection">QC &amp; Cured</option>
                          <option value="dispatched">Dispatched (BlueDart)</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px]">CUSTOMER</span>
                        <strong>{ord.customerName}</strong> ({ord.customerPhone})
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">DELIVERY DESTINATION</span>
                        <span>{ord.shippingAddress.street}, {ord.shippingAddress.city} - {ord.shippingAddress.pincode}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">TOTAL COLLECTED</span>
                        <strong className="text-emerald-400">₹{ord.totalAmount.toLocaleString('en-IN')}</strong> via {ord.paymentMethod.toUpperCase()}
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block mb-1">ITEMS SPECIFIED:</span>
                      <div className="space-y-1">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between text-[11px] text-slate-300">
                            <span>{it.quantity}x {it.name} ({it.material})</span>
                            <span>₹{it.totalPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Supabase Database Configuration */}
        {activeTab === 'supabase' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database size={16} className="text-emerald-400" />
                <span>Supabase PostgreSQL Cloud Integration</span>
              </h3>
              <p className="text-slate-400 mt-1">
                Your application includes full Node.js API persistence out-of-the-box and can connect directly to your Supabase PostgreSQL cloud instance.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Engine State:</span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  supabaseStatus.isConfigured
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {supabaseStatus.isConfigured ? '✓ LIVE SUPABASE CLOUD' : 'HYBRID RESILIENT PERSISTENT STORE'}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">
                Storage Endpoint: <strong className="text-white">{supabaseStatus.url || 'Local Node.js Storage (data/db.json) + Supabase Bridge Ready'}</strong>
              </div>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <span className="text-cyan-400 uppercase font-bold block">
                Connect Custom Supabase Credentials
              </span>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">SUPABASE URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">SUPABASE ANON KEY / SERVICE ROLE KEY</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {supabaseSaveMsg && (
                <p className="text-xs text-emerald-400">{supabaseSaveMsg}</p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={copySupabaseSql}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedSql ? 'SQL Copied!' : 'Copy Supabase DDL SQL'}</span>
                </button>

                <button
                  type="submit"
                  disabled={savingSupabase}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  {savingSupabase ? 'Verifying...' : 'Save & Connect Supabase'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Customer Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
            <div>
              <h3 className="text-sm font-bold text-white">Custom 3D Print Quote Requests (India)</h3>
              <p className="text-slate-400">Inquiries submitted by anime fans, bikers, factories, and gift shoppers.</p>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-slate-500">No inquiries received yet. Submit one from the website form to test!</p>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/80 pb-1.5">
                      <span className="text-white font-bold">{inq.name} ({inq.phone}) - {inq.city || 'India'}</span>
                      <span>{new Date(inq.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-300">
                      <span className="text-cyan-400">Category:</span> {inq.category} · <span className="text-purple-400">Role:</span> {inq.customerType}
                    </div>
                    <p className="text-slate-400 text-[11px] bg-slate-950/60 p-2 rounded-lg">
                      {inq.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Product Modal Sub-dialog */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-slate-950 border border-purple-500/40 rounded-2xl p-6 font-mono text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Add New Product to Indian Store</h3>
                <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Zoro Sword 3D Keychain"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    >
                      <option value="anime_keychains">Anime Keychains</option>
                      <option value="cars_bikes">Cars &amp; Bikes</option>
                      <option value="gods_idols">Gods &amp; Idols</option>
                      <option value="photo_to_3d">Photo to 3D</option>
                      <option value="phone_cases">Phone Cases</option>
                      <option value="business_gapfillers">Business Gap Fillers</option>
                      <option value="corporate_display">Corporate Displays</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">3D CAD Model Preset</label>
                    <select
                      value={newProd.model3dPreset}
                      onChange={(e) => setNewProd({ ...newProd, model3dPreset: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300"
                    >
                      <option value="anime_keychain">Anime Character / Keychain</option>
                      <option value="photo_to_3d">Photo to 3D Lithophane Lamp</option>
                      <option value="gods_idol">Sacred God Idol / Temple Decor</option>
                      <option value="bike_car_model">Bike / Car Miniature</option>
                      <option value="phone_case">Cyber Armor Phone Case</option>
                      <option value="business_gapfiller">Machine Gap Filler &amp; Spacer</option>
                      <option value="corporate_display">3D Corporate Logo Plinth</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Base Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProd.basePrice}
                      onChange={(e) => setNewProd({ ...newProd, basePrice: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={newProd.discountPercent}
                      onChange={(e) => setNewProd({ ...newProd, discountPercent: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Availability</label>
                    <select
                      value={newProd.availability}
                      onChange={(e) => setNewProd({ ...newProd, availability: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="made_to_order">Made to Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Lead Time Text</label>
                    <input
                      type="text"
                      value={newProd.leadTime}
                      onChange={(e) => setNewProd({ ...newProd, leadTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-950 border border-purple-500/40 rounded-2xl p-6 font-mono text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Edit Product: {editingProduct.name}</h3>
                <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.basePrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={editingProduct.discountPercent || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-pink-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Availability</label>
                    <select
                      value={editingProduct.availability}
                      onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="made_to_order">Made to Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Lead Time</label>
                    <input
                      type="text"
                      value={editingProduct.leadTime}
                      onChange={(e) => setEditingProduct({ ...editingProduct, leadTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Update Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Discount Modal Sub-dialog */}
        {showAddDiscountModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-950 border border-purple-500/40 rounded-2xl p-6 font-mono text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Create Promotional Discount Code (₹)</h3>
                <button onClick={() => setShowAddDiscountModal(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateDiscount} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Promo Code (e.g. DIWALI20) *</label>
                  <input
                    type="text"
                    required
                    value={newDisc.code}
                    onChange={(e) => setNewDisc({ ...newDisc, code: e.target.value.toUpperCase() })}
                    placeholder="DIWALI20"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Discount Type</label>
                    <select
                      value={newDisc.type}
                      onChange={(e) => setNewDisc({ ...newDisc, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Value (e.g. 20% or ₹150) *</label>
                    <input
                      type="number"
                      required
                      value={newDisc.value}
                      onChange={(e) => setNewDisc({ ...newDisc, value: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Min. Order Subtotal (₹)</label>
                  <input
                    type="number"
                    value={newDisc.minOrderValue}
                    onChange={(e) => setNewDisc({ ...newDisc, minOrderValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={newDisc.description}
                    onChange={(e) => setNewDisc({ ...newDisc, description: e.target.value })}
                    placeholder="e.g. 20% off on all anime keychains and idols"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDiscountModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
