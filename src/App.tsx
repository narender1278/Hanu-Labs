import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AvailabilityBar } from './components/AvailabilityBar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { SolutionsSection } from './components/SolutionsSection';
import { ProcessSection } from './components/ProcessSection';
import { QuoteSection } from './components/QuoteSection';
import { Footer } from './components/Footer';
import { Product3DModal } from './components/ThreeVisualizer/Product3DModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { 
  Product, 
  CartItem, 
  DiscountCoupon, 
  Order, 
  Inquiry, 
  SupabaseConfigStatus,
  MaterialFinish 
} from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCoupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus>({
    isConfigured: false,
    usingFallback: true,
  });

  // UI state
  const [active3DProduct, setActive3DProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Cart & checkout state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('layerlab_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('layerlab_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Load backend data
  const fetchData = async () => {
    try {
      const [prodRes, discRes, ordRes, inqRes, supaRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/discounts'),
        fetch('/api/orders'),
        fetch('/api/inquiries'),
        fetch('/api/supabase/status'),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (discRes.ok) setDiscounts(await discRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (supaRes.ok) setSupabaseStatus(await supaRes.json());
    } catch (err) {
      console.error('Error fetching data from server:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, material: MaterialFinish, quantity: number, customNotes?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedMaterial === material && i.customNotes === customNotes
      );
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, material, quantity, selectedMaterial: material, customNotes }];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyCoupon = (coupon: DiscountCoupon | null) => {
    setAppliedCoupon(coupon);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setCartItems([]);
    setAppliedCoupon(null);
    setOrders((prev) => [newOrder, ...prev]);
    // Refresh products to show updated stock
    fetchData();
  };

  // Flagship product for hero teaser
  const flagshipProduct = products.find((p) => p.model3dPreset === 'anime_keychain') || products[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top sticky Navigation */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminMode={isAdminMode}
        onToggleAdmin={() => {
          setIsAdminMode(!isAdminMode);
          setIsAdminPortalOpen(true);
        }}
        onSelectProductFor3D={() => {
          if (flagshipProduct) setActive3DProduct(flagshipProduct);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          flagshipProduct={flagshipProduct}
          onExploreProducts={() => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenFlagship3D={() => {
            if (flagshipProduct) setActive3DProduct(flagshipProduct);
          }}
        />

        {/* Live Manufacturing Fleet & Telemetry Bar */}
        <AvailabilityBar />

        {/* Products Catalog with Filters & 3D Inspection Triggers */}
        <ProductCatalog
          products={products}
          onOpen3D={(prod) => setActive3DProduct(prod)}
          onAddToCart={handleAddToCart}
          isAdminMode={isAdminMode}
          onAddNewProduct={() => setIsAdminPortalOpen(true)}
          onEditProduct={(prod) => {
            setIsAdminPortalOpen(true);
          }}
        />

        {/* Solutions & Problems We Solve */}
        <SolutionsSection />

        {/* 4-Step Process & Itemized Transparent Pricing */}
        <ProcessSection />

        {/* Custom Quote & WhatsApp Request Form */}
        <QuoteSection />

      </main>

      {/* Footer */}
      <Footer />

      {/* 3D Interactive Product Visualizer Modal */}
      {active3DProduct && (
        <Product3DModal
          product={active3DProduct}
          onClose={() => setActive3DProduct(null)}
          onAddToCart={(prod, mat, qty, notes) => handleAddToCart(prod, mat, qty, notes)}
        />
      )}

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-Step Secure Checkout Portal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        products={products}
        discounts={discounts}
        orders={orders}
        inquiries={inquiries}
        supabaseStatus={supabaseStatus}
        onRefreshData={fetchData}
        onProductAdded={(newProd) => {
          setProducts((prev) => [newProd, ...prev]);
        }}
        onProductUpdated={(updated) => {
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }}
        onProductDeleted={(id) => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }}
        onDiscountAdded={(disc) => {
          setDiscounts((prev) => [...prev, disc]);
        }}
        onDiscountToggled={(id) => {
          setDiscounts((prev) =>
            prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
          );
        }}
        onDiscountDeleted={(id) => {
          setDiscounts((prev) => prev.filter((d) => d.id !== id));
        }}
        onOrderStatusUpdated={async (orderId, status) => {
          try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            });
            if (res.ok) {
              setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: status } : o))
              );
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />

    </div>
  );
}
