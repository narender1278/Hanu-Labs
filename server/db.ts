import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, DiscountCoupon, Order, Inquiry, SupabaseConfigStatus } from '../src/types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface LocalDatabase {
  products: Product[];
  discounts: DiscountCoupon[];
  orders: Order[];
  inquiries: Inquiry[];
  supabaseConfig?: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-anime-01',
    name: 'Super Saiyan 3D Chibi Anime Keychain & Pocket Figurine',
    category: 'anime_keychains',
    description: 'High-detail collectible anime chibi character with durable metal split key-ring, vibrant matte finish, and drop-tested tough resin composition.',
    basePrice: 399,
    discountPercent: 25,
    salePrice: 299,
    stock: 48,
    availability: 'in_stock',
    leadTime: 'In Stock · Ships in 24h across India',
    dimensions: '65 × 42 × 32 mm',
    weightGrams: 28,
    model3dPreset: 'anime_keychain',
    defaultMaterial: 'vibrant_gloss',
    availableMaterials: ['vibrant_gloss', 'tough_resin', 'carbon_fiber', 'gold_bronze'],
    features: ['High-resolution 4K resin detail', 'Rust-proof nickel steel key ring', 'Water-resistant UV protective coating', 'Custom collector box packaging'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-anime-02',
    name: 'Demon Slayer Nichirin Blade & Tanjiro Mask 3D Keychain',
    category: 'anime_keychains',
    description: 'Iconic anime sword hilt and fox warding mask combo charm. Ultra-crisp edge definition with micro-textured grip pattern.',
    basePrice: 449,
    discountPercent: 22,
    salePrice: 349,
    stock: 35,
    availability: 'in_stock',
    leadTime: 'Ships today from Bengaluru/Delhi Hub',
    dimensions: '75 × 38 × 18 mm',
    weightGrams: 22,
    model3dPreset: 'anime_keychain',
    defaultMaterial: 'tough_resin',
    availableMaterials: ['tough_resin', 'vibrant_gloss', 'carbon_fiber', 'gold_bronze'],
    features: ['Crisp Japanese kanji engraving', 'Heavy-duty lobster clasp included', 'Pocket-safe rounded tips', 'Popular gift for anime enthusiasts'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-bike-01',
    name: 'Royal Enfield Classic 350 Scale Miniature & Keychain',
    category: 'cars_bikes',
    description: 'Precision scale 3D replica of India\'s beloved road cruiser featuring spoked wheel detail, teardrop tank curves, exhaust canister, and key chain.',
    basePrice: 599,
    discountPercent: 20,
    salePrice: 479,
    stock: 24,
    availability: 'in_stock',
    leadTime: 'In Stock · Ready to Dispatch',
    dimensions: '85 × 38 × 52 mm',
    weightGrams: 45,
    model3dPreset: 'bike_car_model',
    defaultMaterial: 'titanium',
    availableMaterials: ['titanium', 'carbon_fiber', 'tough_resin', 'gold_bronze'],
    features: ['Realistic twin-spark engine casing relief', 'Sturdy solid-core infill (no hollow fragility)', 'Perfect for bike keys and garage showcase', 'Tested against vibration and pocket wear'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-bike-02',
    name: 'Mahindra Thar 4x4 Off-Road Adventure Scale Model',
    category: 'cars_bikes',
    description: 'Rugged scale miniature of the legendary Indian 4x4 SUV with aggressive tread tyres, grille guard, and removable luggage rack.',
    basePrice: 699,
    discountPercent: 21,
    salePrice: 549,
    stock: 16,
    availability: 'in_stock',
    leadTime: 'Ships within 24 hours',
    dimensions: '95 × 48 × 46 mm',
    weightGrams: 62,
    model3dPreset: 'bike_car_model',
    defaultMaterial: 'carbon_fiber',
    availableMaterials: ['carbon_fiber', 'tough_resin', 'titanium', 'vibrant_gloss'],
    features: ['Detailed multi-slat front grille', 'Dashboard display stand included', 'All-weather heat-resistant polymer up to 85°C', 'Can be customized with your vehicle number plate'],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-god-01',
    name: 'Vighnaharta Ganesha 3D Sacred Idol with Prabhavali',
    category: 'gods_idols',
    description: 'Devotionally designed Lord Ganesha 3D idol with intricately carved halo aura, modak, mushika, and sacred lotus plinth. Ideal for car dashboards and home pooja altars.',
    basePrice: 1499,
    discountPercent: 20,
    salePrice: 1199,
    stock: 28,
    availability: 'in_stock',
    leadTime: 'Special auspicious packaging · Ships in 24h',
    dimensions: '110 × 75 × 65 mm',
    weightGrams: 140,
    model3dPreset: 'gods_idol',
    defaultMaterial: 'gold_bronze',
    availableMaterials: ['gold_bronze', 'tough_resin', 'titanium', 'vibrant_gloss'],
    features: ['Electrostatic metallic gold & antique bronze finish', 'Includes 3M peel-and-stick car dashboard pad', 'Non-toxic eco-friendly resin', 'Created with utmost respect and spiritual aesthetic'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-god-02',
    name: 'Adiyogi Shiva Meditative 3D Miniature Statue',
    category: 'gods_idols',
    description: 'Graceful contemplative bust of Adiyogi Shiva with crescent moon, flowing jata locks, and snake ornament. Finished in deep matte graphite black.',
    basePrice: 1299,
    discountPercent: 23,
    salePrice: 999,
    stock: 19,
    availability: 'in_stock',
    leadTime: 'Ships tomorrow Pan-India',
    dimensions: '125 × 95 × 80 mm',
    weightGrams: 165,
    model3dPreset: 'gods_idol',
    defaultMaterial: 'carbon_fiber',
    availableMaterials: ['carbon_fiber', 'gold_bronze', 'tough_resin', 'titanium'],
    features: ['Serene meditative facial expression', 'Heavy weighted base for car dashboard stability', 'Dust-repellent matte nano-coating', 'Pooja room and work desk centerpiece'],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-photo-01',
    name: 'Personalized Photo to 3D Curved Lithophane Night Lamp',
    category: 'photo_to_3d',
    description: 'Transform your favorite couple, family, wedding or memorial photo into a stunning 3D lithophane light sculpture. When the internal warm LED illuminates, your picture magically reveals in lifelike 3D depth.',
    basePrice: 1999,
    discountPercent: 25,
    salePrice: 1499,
    stock: 50,
    availability: 'made_to_order',
    leadTime: 'Custom crafted in 48h · Priority courier',
    dimensions: '160 × 120 × 65 mm',
    weightGrams: 220,
    model3dPreset: 'photo_to_3d',
    defaultMaterial: 'tough_resin',
    availableMaterials: ['tough_resin', 'vibrant_gloss'],
    features: ['USB-powered warm LED wooden base included', 'Ultra-dense 0.1mm micro-layer precision', 'Preview rendering sent on WhatsApp before printing', 'Best gift for birthdays, anniversaries & weddings'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-phone-01',
    name: 'Cybernetic Hex-Armor Custom 3D Printed Phone Case',
    category: 'phone_cases',
    description: 'Drop-tested shockproof phone cover with generative hexagonal ventilation grid, reinforced corner air-cushion bumpers, and raised camera bevel.',
    basePrice: 799,
    discountPercent: 25,
    salePrice: 599,
    stock: 32,
    availability: 'in_stock',
    leadTime: 'Available for iPhone, Samsung, OnePlus, Xiaomi',
    dimensions: '162 × 80 × 12 mm',
    weightGrams: 42,
    model3dPreset: 'phone_case',
    defaultMaterial: 'carbon_fiber',
    availableMaterials: ['carbon_fiber', 'tough_resin', 'vibrant_gloss', 'titanium'],
    features: ['Precise tactile clicky button covers', 'Heat dissipation hexagonal lattice', 'Military-grade drop protection tested to 2.5m', 'Anti-slip textured matte side grips'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-gap-01',
    name: 'Industrial Machinery Gap Filler & Custom Spacers',
    category: 'business_gapfillers',
    description: 'Made-to-measure technical gap fillers, vibration dampening grommets, and hard-to-source machine replacement gears for workshops and manufacturing lines.',
    basePrice: 850,
    discountPercent: 20,
    salePrice: 680,
    stock: 40,
    availability: 'in_stock',
    leadTime: 'Direct factory replacement · Ships in 24h',
    dimensions: '90 × 60 × 40 mm',
    weightGrams: 75,
    model3dPreset: 'business_gapfiller',
    defaultMaterial: 'carbon_fiber',
    availableMaterials: ['carbon_fiber', 'titanium', 'tough_resin', 'gold_bronze'],
    features: ['Chemical, oil & coolant resistant PA12/PETG-CF', 'Sub-millimeter tolerance matching ±0.05mm', 'Replaces expensive imported spare parts', 'Bulk batch discounting available for MSMEs'],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-corp-01',
    name: 'Custom 3D Corporate Logo Desk Nameplate & Plinth',
    category: 'corporate_display',
    description: 'Elevate your brand reception desk or executive office with a bespoke 3D dual-layer embossed logo, company insignia, and polished acrylic base.',
    basePrice: 1250,
    discountPercent: 20,
    salePrice: 999,
    stock: 25,
    availability: 'made_to_order',
    leadTime: 'Custom logo preview in 4 hours · Ships in 48h',
    dimensions: '180 × 65 × 45 mm',
    weightGrams: 180,
    model3dPreset: 'corporate_display',
    defaultMaterial: 'gold_bronze',
    availableMaterials: ['gold_bronze', 'titanium', 'carbon_fiber', 'vibrant_gloss'],
    features: ['Sharp dimensional 3D lettering & bevels', 'Weighted anti-scratch felt bottom', 'Perfect for business gifting & awards', 'High-end executive aesthetic'],
    featured: true,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_DISCOUNTS: DiscountCoupon[] = [
  {
    id: 'disc-001',
    code: 'NAMASTE10',
    type: 'percentage',
    value: 10,
    minOrderValue: 299,
    isActive: true,
    usageCount: 68,
    description: '10% off storewide welcoming discount across India'
  },
  {
    id: 'disc-002',
    code: 'FIRSTPRINT',
    type: 'fixed',
    value: 150,
    minOrderValue: 599,
    isActive: true,
    usageCount: 41,
    description: 'Flat ₹150 instant discount on orders above ₹599'
  },
  {
    id: 'disc-003',
    code: 'DESI20',
    type: 'percentage',
    value: 20,
    minOrderValue: 999,
    isActive: true,
    usageCount: 89,
    description: '20% off on premium 3D gifts, idols & custom orders above ₹999'
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-in-101',
    orderNumber: 'LL-IN-842109',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.s@techinnovate.in',
    customerPhone: '+91 98450 12894',
    companyName: 'TechInnovate Solutions',
    shippingAddress: {
      street: 'Flat 402, Lotus Greens, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India'
    },
    shippingMethod: 'express_rush',
    shippingCost: 99.00,
    items: [
      {
        productId: 'prod-anime-01',
        name: 'Super Saiyan 3D Chibi Anime Keychain & Pocket Figurine',
        quantity: 2,
        material: 'vibrant_gloss',
        unitPrice: 299.00,
        totalPrice: 598.00
      },
      {
        productId: 'prod-god-01',
        name: 'Vighnaharta Ganesha 3D Sacred Idol with Prabhavali',
        quantity: 1,
        material: 'gold_bronze',
        unitPrice: 1199.00,
        totalPrice: 1199.00
      }
    ],
    subtotal: 1797.00,
    discountAmount: 359.40,
    appliedCoupon: 'DESI20',
    taxAmount: 92.50,
    totalAmount: 1629.10,
    paymentMethod: 'upi_qr',
    paymentStatus: 'paid',
    fulfillmentStatus: 'printing',
    notes: 'Please pack the Ganesha idol with extra bubble wrap.'
  }
];

class DatabaseService {
  private db: LocalDatabase;
  private supabase: SupabaseClient | null = null;
  private isSupabaseLive = false;

  constructor() {
    this.db = this.loadData();
    this.initSupabaseClient();
  }

  private loadData(): LocalDatabase {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // If the database has old international items, refresh with new India-focused items
        const isOldData = parsed.products && parsed.products.some((p: any) => p.id === 'prod-001');
        if (isOldData) {
          const refreshed: LocalDatabase = {
            products: INITIAL_PRODUCTS,
            discounts: INITIAL_DISCOUNTS,
            orders: INITIAL_ORDERS,
            inquiries: parsed.inquiries || [],
            supabaseConfig: parsed.supabaseConfig
          };
          this.saveData(refreshed);
          return refreshed;
        }

        return {
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          discounts: parsed.discounts && parsed.discounts.length > 0 ? parsed.discounts : INITIAL_DISCOUNTS,
          orders: parsed.orders || INITIAL_ORDERS,
          inquiries: parsed.inquiries || [],
          supabaseConfig: parsed.supabaseConfig
        };
      }
    } catch (e) {
      console.warn('Failed reading db.json, using defaults:', e);
    }

    const initial: LocalDatabase = {
      products: INITIAL_PRODUCTS,
      discounts: INITIAL_DISCOUNTS,
      orders: INITIAL_ORDERS,
      inquiries: []
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: LocalDatabase): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving to db.json:', err);
    }
  }

  public initSupabaseClient(): void {
    const url = process.env.SUPABASE_URL || this.db.supabaseConfig?.url;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || this.db.supabaseConfig?.anonKey;

    if (url && key && url.startsWith('http') && !url.includes('your-project')) {
      try {
        this.supabase = createClient(url, key);
        this.isSupabaseLive = true;
        console.log('✓ Supabase Client initialized successfully with:', url);
      } catch (e) {
        console.warn('Could not initialize Supabase client:', e);
        this.supabase = null;
        this.isSupabaseLive = false;
      }
    } else {
      this.supabase = null;
      this.isSupabaseLive = false;
    }
  }

  public getSupabaseStatus(): SupabaseConfigStatus {
    const url = process.env.SUPABASE_URL || this.db.supabaseConfig?.url;
    return {
      isConfigured: !!(this.isSupabaseLive && this.supabase),
      url: url || undefined,
      usingFallback: !this.isSupabaseLive,
      tableCount: 4
    };
  }

  public setSupabaseConfig(config: { url: string; anonKey: string; serviceRoleKey?: string }): SupabaseConfigStatus {
    this.db.supabaseConfig = config;
    this.saveData(this.db);
    this.initSupabaseClient();
    return this.getSupabaseStatus();
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return this.db.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.db.products.find(p => p.id === id);
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    
    if (newProduct.discountPercent && newProduct.discountPercent > 0) {
      newProduct.salePrice = Math.round(newProduct.basePrice * (1 - newProduct.discountPercent / 100));
    } else {
      newProduct.salePrice = newProduct.basePrice;
    }

    this.db.products.unshift(newProduct);
    this.saveData(this.db);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const current = this.db.products[idx];
    const updated: Product = { ...current, ...updates };

    if (updated.discountPercent && updated.discountPercent > 0) {
      updated.salePrice = Math.round(updated.basePrice * (1 - updated.discountPercent / 100));
    } else {
      updated.salePrice = updated.basePrice;
    }

    this.db.products[idx] = updated;
    this.saveData(this.db);
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.db.products.length;
    this.db.products = this.db.products.filter(p => p.id !== id);
    if (this.db.products.length !== initialLen) {
      this.saveData(this.db);
      return true;
    }
    return false;
  }

  // --- DISCOUNTS ---
  public getDiscounts(): DiscountCoupon[] {
    return this.db.discounts;
  }

  public addDiscount(discountData: Omit<DiscountCoupon, 'id' | 'usageCount'>): DiscountCoupon {
    const coupon: DiscountCoupon = {
      ...discountData,
      id: `disc-${Date.now().toString(36)}`,
      code: discountData.code.trim().toUpperCase(),
      usageCount: 0
    };
    this.db.discounts.push(coupon);
    this.saveData(this.db);
    return coupon;
  }

  public deleteDiscount(id: string): boolean {
    const initialLen = this.db.discounts.length;
    this.db.discounts = this.db.discounts.filter(d => d.id !== id);
    if (this.db.discounts.length !== initialLen) {
      this.saveData(this.db);
      return true;
    }
    return false;
  }

  public toggleDiscount(id: string): DiscountCoupon | null {
    const coupon = this.db.discounts.find(d => d.id === id);
    if (!coupon) return null;
    coupon.isActive = !coupon.isActive;
    this.saveData(this.db);
    return coupon;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: DiscountCoupon; discountAmount: number; error?: string } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.db.discounts.find(d => d.code === cleanCode && d.isActive);
    if (!coupon) {
      return { valid: false, discountAmount: 0, error: 'Invalid or expired coupon code' };
    }
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return { 
        valid: false, 
        discountAmount: 0, 
        error: `Cart subtotal must be at least ₹${coupon.minOrderValue} to apply code ${coupon.code}` 
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return { valid: true, coupon, discountAmount };
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return this.db.orders;
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'fulfillmentStatus'>): Order {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `LL-IN-${randomDigits}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString(36)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      fulfillmentStatus: 'printing'
    };

    if (orderData.appliedCoupon) {
      const coupon = this.db.discounts.find(d => d.code === orderData.appliedCoupon?.toUpperCase());
      if (coupon) {
        coupon.usageCount += 1;
      }
    }

    for (const item of newOrder.items) {
      const prod = this.db.products.find(p => p.id === item.productId);
      if (prod && prod.stock > 0) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (prod.stock === 0) {
          prod.availability = 'made_to_order';
        } else if (prod.stock <= 5) {
          prod.availability = 'low_stock';
        }
      }
    }

    this.db.orders.unshift(newOrder);
    this.saveData(this.db);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['fulfillmentStatus']): Order | null {
    const order = this.db.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.fulfillmentStatus = status;
    this.saveData(this.db);
    return order;
  }

  // --- INQUIRIES ---
  public getInquiries(): Inquiry[] {
    return this.db.inquiries;
  }

  public createInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const inquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.db.inquiries.unshift(inquiry);
    this.saveData(this.db);
    return inquiry;
  }
}

export const dbService = new DatabaseService();
