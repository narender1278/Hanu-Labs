import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, DiscountCoupon, Order } from '../types';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Building2, 
  Coins, 
  Check, 
  QrCode,
  Smartphone,
  Banknote
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: DiscountCoupon | null;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'shipping' | 'priority' | 'payment' | 'confirmation'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states with Indian demo address
  const [formData, setFormData] = useState({
    customerName: 'Aditya Verma',
    customerEmail: 'aditya.verma@gmail.com',
    customerPhone: '+91 98450 12894',
    companyName: '',
    street: 'Flat 304, Green Heights, Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    country: 'India',
    notes: 'Please pack the anime keychain & idol in protective box.',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express_rush'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'gpay_phonepe' | 'card_netbanking' | 'cod' | 'corporate_gst'>('upi_qr');
  const [upiId, setUpiId] = useState('aditya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('6521 •••• •••• 8910 (RuPay)');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvc, setCardCvc] = useState('321');

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

  const shippingCost = shippingMethod === 'express_rush' ? 199 : (subtotal >= 999 ? 0 : 79);
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const totalAmount = subtotal - discountAmount + shippingCost + taxAmount;

  const handleNextFromShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.street || !formData.city || !formData.pincode) {
      setErrorMsg('Please complete all required delivery fields');
      return;
    }
    setErrorMsg(null);
    setStep('priority');
  };

  const handleFinalSubmitOrder = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const orderPayload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      companyName: formData.companyName,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: 'India',
      },
      shippingMethod,
      shippingCost,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        material: i.selectedMaterial,
        unitPrice: i.product.salePrice || i.product.basePrice,
        totalPrice: (i.product.salePrice || i.product.basePrice) * i.quantity,
      })),
      subtotal,
      discountAmount,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : undefined,
      taxAmount,
      totalAmount,
      paymentMethod,
      notes: formData.notes,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Checkout order processing failed');
      }

      const orderData: Order = await res.json();
      setCompletedOrder(orderData);
      onOrderCompleted(orderData);
      setStep('confirmation');

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981'],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                {step === 'confirmation' ? 'Order Confirmed!' : 'Secure Checkout · Pan-India Dispatch'}
              </h2>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Lock size={11} className="text-emerald-400" />
                <span>UPI, Cards, NetBanking &amp; COD · Fast BlueDart Logistics</span>
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

        {/* Step Indicator */}
        {step !== 'confirmation' && (
          <div className="px-6 py-3 bg-slate-900/30 border-b border-slate-800/40 flex items-center justify-between text-xs font-mono">
            <div className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
              <span>Address</span>
            </div>
            <span className="text-slate-700">───</span>
            <div className={`flex items-center gap-1.5 ${step === 'priority' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
              <span>Delivery</span>
            </div>
            <span className="text-slate-700">───</span>
            <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
              <span>Payment (UPI / COD)</span>
            </div>
          </div>
        )}

        {/* Step 1: Shipping Address */}
        {step === 'shipping' && (
          <form onSubmit={handleNextFromShipping} className="p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 uppercase font-semibold">
                Delivery Address in India
              </span>
              <button
                type="button"
                onClick={() => setFormData({
                  customerName: 'Aditya Verma',
                  customerEmail: 'aditya.verma@gmail.com',
                  customerPhone: '+91 98450 12894',
                  companyName: '',
                  street: 'Flat 304, Green Heights, Outer Ring Road, Bellandur',
                  city: 'Bengaluru',
                  state: 'Karnataka',
                  pincode: '560103',
                  country: 'India',
                  notes: 'Please pack the anime keychain & idol in protective box.',
                })}
                className="text-[11px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
              >
                Auto-fill Indian Demo Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">WhatsApp / Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98450 12894"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Email Address (for order tracking) *</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Company / GST Number (Optional)</label>
                <input
                  type="text"
                  placeholder="29AAAAA0000A1Z5"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">House / Flat No, Building, Street, Area *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400">{errorMsg}</p>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Continue to Delivery Speed</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Delivery Speed */}
        {step === 'priority' && (
          <div className="p-6 space-y-4 font-mono text-xs">
            <span className="text-cyan-400 uppercase font-semibold">
              Select Courier Dispatch Speed
            </span>

            <div className="space-y-3">
              <label 
                className={`p-4 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'bg-cyan-950/40 border-cyan-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-1 accent-cyan-400"
                  />
                  <div>
                    <h4 className="font-bold text-white">Standard Pan-India Speed Courier (3-5 Days)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Shipped via BlueDart / Delhivery / DTDC with live SMS tracking link.
                    </p>
                  </div>
                </div>
                <span className="font-bold text-white">
                  {subtotal >= 999 ? 'FREE' : '₹79'}
                </span>
              </label>

              <label 
                className={`p-4 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                  shippingMethod === 'express_rush'
                    ? 'bg-purple-950/40 border-purple-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express_rush'}
                    onChange={() => setShippingMethod('express_rush')}
                    className="mt-1 accent-purple-400"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-purple-300">Priority Same-Day 3D Print &amp; Express Air (24-36h)</h4>
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] border border-purple-500/30">
                        RUSH
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Fast-tracked directly to our high-speed Bambu Lab print queue. Overnight air cargo to major Indian metros.
                    </p>
                  </div>
                </div>
                <span className="font-bold text-purple-300">
                  +₹199
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Method in India */}
        {step === 'payment' && (
          <div className="p-6 space-y-4 font-mono text-xs">
            <span className="text-cyan-400 uppercase font-semibold">
              Select Payment Method
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi_qr')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi_qr'
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode size={18} className="text-cyan-400" />
                <span>UPI QR / Apps</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('gpay_phonepe')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'gpay_phonepe'
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={18} className="text-purple-400" />
                <span>GPay / PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card_netbanking')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card_netbanking'
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard size={18} className="text-amber-400" />
                <span>Cards / NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Banknote size={18} className="text-emerald-400" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* UPI QR Code Preview Option */}
            {paymentMethod === 'upi_qr' && (
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  {/* Stylized simulated UPI QR Code */}
                  <div className="w-full h-full border-2 border-black grid grid-cols-4 grid-rows-4 p-1 gap-1">
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-cyan-300 font-bold">Scan with Any UPI App</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Instant</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pay securely using Google Pay, PhonePe, Paytm, CRED or BHIM UPI.
                  </p>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 select-all font-mono">
                    UPI VPA: <strong className="text-cyan-400">layerlab3d@icici</strong>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'gpay_phonepe' && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="block text-[11px] text-slate-400">Enter Your UPI ID / Mobile Number:</label>
                <input
                  type="text"
                  placeholder="e.g. 9845012894@upi or username@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <p className="text-[10px] text-slate-500">A payment collect request will be pushed directly to your UPI app.</p>
              </div>
            )}

            {paymentMethod === 'card_netbanking' && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Card Number (RuPay, Visa, MasterCard)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Check size={14} className="stroke-[3]" />
                  Cash on Delivery Active for Pincode {formData.pincode}
                </span>
                <p className="text-[11px] text-slate-400">
                  You can pay cash or scan the delivery agent's UPI QR upon receiving your parcel at your doorstep.
                </p>
              </div>
            )}

            {/* Total readout card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Final Order Amount (Incl. GST):</span>
              <span className="text-base font-bold text-cyan-400 font-mono">₹{totalAmount.toLocaleString('en-IN')} INR</span>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400">{errorMsg}</p>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('priority')}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmitOrder}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Lock size={14} />
                <span>{isSubmitting ? 'Routing to Print Farm...' : `Confirm Order (₹${totalAmount.toLocaleString('en-IN')})`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation & Receipt */}
        {step === 'confirmation' && completedOrder && (
          <div className="p-6 space-y-6 text-center font-mono">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Order Placed &amp; Assigned to Print Farm!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                A confirmation SMS &amp; email has been routed to <strong>{completedOrder.customerPhone}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tracking Reference</span>
                <span className="text-cyan-400 font-bold text-sm">{completedOrder.orderNumber}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Payment Mode</span>
                <span className="text-white capitalize">{completedOrder.paymentMethod.replace('_', ' ')}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Paid / COD Amount</span>
                <span className="text-emerald-400 font-bold text-sm">₹{completedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Manufacturing Stepper */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-2">Automated Farm Fulfillment:</span>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                  <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    1. CAD Sliced
                  </div>
                  <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold animate-pulse">
                    2. In 3D Queue
                  </div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-400">
                    3. QC &amp; Cured
                  </div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-400">
                    4. Dispatched
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
