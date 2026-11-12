import React, { useState } from 'react';
import { CartItem, DiscountCoupon } from '../types';
import { X, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingCart, Check, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  appliedCoupon: DiscountCoupon | null;
  onApplyCoupon: (coupon: DiscountCoupon | null, discountAmount: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout,
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const handleValidateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsVerifyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCodeInput.trim(), subtotal }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        onApplyCoupon(data.coupon, data.discountAmount);
        setCouponCodeInput('');
      } else {
        setCouponError(data.error || 'Invalid or expired discount coupon');
      }
    } catch {
      setCouponError('Unable to connect to verification server');
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null, 0);
  };

  const shippingEstimate = subtotal >= 999 ? 0 : 79;
  const taxEstimate = Math.round((subtotal - discountAmount) * 0.05); // 5% GST on custom 3D products
  const finalTotal = subtotal - discountAmount + shippingEstimate + taxEstimate;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">Your Cart</h2>
              <span className="text-xs text-slate-400 font-mono">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items selected
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Meter (₹999 threshold for Pan-India Free Delivery) */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800/60 text-xs font-mono">
          {subtotal >= 999 ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Check size={14} className="stroke-[3]" />
              You qualify for FREE Pan-India Speed Courier!
            </span>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-300">
                Add <strong className="text-cyan-400">₹{(999 - subtotal).toLocaleString('en-IN')}</strong> more for Free Shipping
              </span>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-800/60 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <ShoppingCart size={40} className="text-slate-700 mb-3" />
              <p className="text-sm font-mono text-slate-400">Your cart is currently empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Browse 3D Products
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const itemPrice = item.product.salePrice || item.product.basePrice;
              return (
                <div key={`${item.product.id}-${item.selectedMaterial}-${idx}`} className="pt-4 first:pt-0 flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-2xl">
                      {item.product.category === 'anime_keychains' ? '⚡' : 
                       item.product.category === 'gods_idols' ? '🛕' : 
                       item.product.category === 'cars_bikes' ? '🏍️' : 
                       item.product.category === 'photo_to_3d' ? '🖼️' : '⚙️'}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-tight font-mono">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <span className="text-[10px] text-cyan-400 font-mono mt-0.5 inline-block">
                        Finish: {item.selectedMaterial.replace('_', ' ')}
                      </span>

                      {item.customNotes && (
                        <p className="text-[10px] text-slate-400 font-mono italic">
                          "{item.customNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono text-white min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono text-white">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Discounts, Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800/80 bg-slate-950/90 space-y-4">
            
            {/* Promo Code Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Tag size={13} className="text-purple-400" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-purple-400 hover:text-white text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleValidateCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. NAMASTE10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifyingCoupon || !couponCodeInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {isVerifyingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && (
                <span className="text-[11px] font-mono text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{couponError}</span>
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-mono text-slate-400 border-t border-slate-900 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-purple-400">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery (Pan-India)</span>
                <span className="text-white">
                  {shippingEstimate === 0 ? 'FREE' : `₹${shippingEstimate}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST (5% Included)</span>
                <span className="text-white">₹{taxEstimate}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800 font-mono">
                <span>Total Amount</span>
                <span className="text-cyan-400 text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>Proceed to Checkout (₹{finalTotal.toLocaleString('en-IN')})</span>
              <ArrowRight size={14} />
            </button>

            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
                <span>🔒 UPI, GPay, PhonePe, Cards &amp; COD · Fast BlueDart Dispatch</span>
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
