export type AvailabilityStatus = 'in_stock' | 'made_to_order' | 'low_stock' | 'backorder';

export type Model3DPreset = 
  | 'anime_keychain'
  | 'photo_to_3d'
  | 'gods_idol'
  | 'bike_car_model'
  | 'phone_case'
  | 'business_gapfiller'
  | 'corporate_display';

export type MaterialFinish = 
  | 'carbon_fiber'
  | 'tough_resin'
  | 'titanium'
  | 'gold_bronze'
  | 'vibrant_gloss';

export type ProductCategory = 
  | 'anime_keychains'
  | 'cars_bikes'
  | 'gods_idols'
  | 'photo_to_3d'
  | 'phone_cases'
  | 'business_gapfillers'
  | 'corporate_display';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  basePrice: number; // in INR (₹)
  discountPercent?: number; // e.g. 20 for 20% off
  salePrice?: number; // computed in INR
  stock: number;
  availability: AvailabilityStatus;
  leadTime: string; // e.g. "Ships in 24h · Pan-India"
  dimensions: string; // e.g. "75 × 45 × 12 mm"
  weightGrams: number;
  model3dPreset: Model3DPreset;
  defaultMaterial: MaterialFinish;
  availableMaterials: MaterialFinish[];
  features: string[];
  featured?: boolean;
  samplePhotoUrl?: string; // for Photo-to-3D products
  createdAt?: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 20% or ₹150 off
  minOrderValue?: number; // in INR
  isActive: boolean;
  usageCount: number;
  expiryDate?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMaterial: MaterialFinish;
  customNotes?: string;
  uploadedPhotoName?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  material: MaterialFinish;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  shippingMethod: 'standard' | 'express_rush';
  shippingCost: number;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'upi_qr' | 'gpay_phonepe' | 'card_netbanking' | 'cod' | 'corporate_gst';
  paymentStatus: 'paid' | 'pending';
  fulfillmentStatus: 'processing' | 'printing' | 'qc_inspection' | 'dispatched' | 'delivered';
  notes?: string;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  customerType: string;
  category: string;
  city?: string;
  details: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
}

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url?: string;
  usingFallback: boolean;
  tableCount?: number;
}
