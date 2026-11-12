import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, Phone, Clock, MapPin } from 'lucide-react';

export const QuoteSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Bengaluru',
    customer: 'Direct consumer',
    category: 'Anime / character keychain',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.details) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          customerType: formData.customer,
          category: formData.category,
          city: formData.city,
          details: formData.details,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed submitting quote request', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = `Hello LayerLab 3D! I would like a custom 3D printing quotation in India.%0A%0AName: ${encodeURIComponent(formData.name || 'Customer')}%0APhone: ${encodeURIComponent(formData.phone || '')}%0ACity: ${encodeURIComponent(formData.city || '')}%0AProduct Type: ${encodeURIComponent(formData.category)}%0ARequirement: ${encodeURIComponent(formData.details || 'Please share catalog')}`;
    window.open(`https://wa.me/919845012894?text=${text}`, '_blank');
  };

  return (
    <section id="quote" className="py-16 border-t border-slate-900 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
                CUSTOM ORDERS &amp; BULK B2B ENQUIRIES
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Request a Custom 3D Design or Quote in India
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Want a custom anime figure, your bike scale model, a sacred idol for your car dashboard, a personalized photo lamp, or a machine gap-filler for your factory? Send us your requirement or chat directly on WhatsApp!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-cyan-400 shrink-0" />
                <span>3D Print Hub: Bengaluru &amp; Delhi NCR, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-purple-400 shrink-0" />
                <span>WhatsApp Helpline: +91 98450 12894</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-emerald-400 shrink-0" />
                <span>Design Desk: orders@layerlab3d.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-sky-400 shrink-0" />
                <span>Operating Hours: Mon–Sat, 9:00 AM – 8:00 PM IST</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs font-mono text-slate-400">
              💡 <strong>Photos &amp; Sketches:</strong> You can upload photos of your favorite anime character, vehicle or broken plastic part directly to our WhatsApp for instant sizing &amp; cost estimation.
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-10 text-center space-y-4 font-mono">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Quote Request Received!</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Our 3D designer will contact you on WhatsApp with 3D renders and exact pricing within 2 hours.
                  </p>
                  
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                    >
                      <MessageSquare size={14} />
                      <span>Chat on WhatsApp Directly</span>
                    </button>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditya Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">WhatsApp / Phone (+91) *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">City / State in India</label>
                      <input
                        type="text"
                        placeholder="e.g. Pune, Maharashtra"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Product Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option>Anime / character keychain</option>
                        <option>Bike or car miniature / mount</option>
                        <option>God / sacred idol for car/home</option>
                        <option>Human photo to 3D lithophane</option>
                        <option>Custom phone case</option>
                        <option>Industrial gap filler / replacement part</option>
                        <option>Corporate 3D logo / desk display</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
                      Describe your requirements (character name, bike model, photo details or dimensions) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g. Need a custom Zoro 3D keychain with metal ring + an Adiyogi Shiva miniature for my Royal Enfield handlebar mount."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
                    >
                      <Send size={14} />
                      <span>{isSubmitting ? 'Submitting to 3D Team...' : 'Request 3D Quotation ↗'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/40 text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <MessageSquare size={14} />
                      <span>Direct WhatsApp Message</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
