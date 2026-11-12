import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { dbService } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// --- API ROUTES ---

// Health & status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'LayerLab 3D API', timestamp: new Date().toISOString() });
});

// Supabase Status & Config
app.get('/api/supabase/status', (_req: Request, res: Response) => {
  const status = dbService.getSupabaseStatus();
  res.json(status);
});

app.post('/api/supabase/config', (req: Request, res: Response) => {
  const { url, anonKey, serviceRoleKey } = req.body;
  if (!url || !anonKey) {
    res.status(400).json({ error: 'url and anonKey are required' });
    return;
  }
  const status = dbService.setSupabaseConfig({ url, anonKey, serviceRoleKey });
  res.json({ message: 'Supabase credentials saved', status });
});

// Products API
app.get('/api/products', (_req: Request, res: Response) => {
  const products = dbService.getProducts();
  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = dbService.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const { name, category, description, basePrice, stock, availability, leadTime, dimensions, weightGrams, model3dPreset, defaultMaterial, availableMaterials, features, discountPercent, featured } = req.body;
    
    if (!name || !category || basePrice === undefined) {
      res.status(400).json({ error: 'name, category, and basePrice are required' });
      return;
    }

    const created = dbService.addProduct({
      name,
      category,
      description: description || '',
      basePrice: Number(basePrice),
      discountPercent: discountPercent ? Number(discountPercent) : 0,
      stock: stock !== undefined ? Number(stock) : 10,
      availability: availability || 'in_stock',
      leadTime: leadTime || 'Ships in 24-48h',
      dimensions: dimensions || '100 × 100 × 50 mm',
      weightGrams: weightGrams ? Number(weightGrams) : 100,
      model3dPreset: model3dPreset || 'drone_arm',
      defaultMaterial: defaultMaterial || 'carbon_fiber',
      availableMaterials: availableMaterials || ['carbon_fiber', 'tough_resin', 'titanium'],
      features: features || ['Precision 3D Printed', 'Strict Tolerances ±0.05mm'],
      featured: Boolean(featured)
    });

    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed creating product' });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const updated = dbService.updateProduct(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed updating product' });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const success = dbService.deleteProduct(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ success: true, message: 'Product removed' });
});

// Discounts API
app.get('/api/discounts', (_req: Request, res: Response) => {
  res.json(dbService.getDiscounts());
});

app.post('/api/discounts', (req: Request, res: Response) => {
  try {
    const { code, type, value, minOrderValue, description, expiryDate } = req.body;
    if (!code || !type || value === undefined) {
      res.status(400).json({ error: 'code, type, and value are required' });
      return;
    }

    const created = dbService.addDiscount({
      code,
      type,
      value: Number(value),
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      isActive: true,
      description: description || '',
      expiryDate: expiryDate || undefined
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed creating coupon' });
  }
});

app.patch('/api/discounts/:id/toggle', (req: Request, res: Response) => {
  const toggled = dbService.toggleDiscount(req.params.id);
  if (!toggled) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }
  res.json(toggled);
});

app.delete('/api/discounts/:id', (req: Request, res: Response) => {
  const success = dbService.deleteDiscount(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }
  res.json({ success: true, message: 'Coupon deleted' });
});

app.post('/api/discounts/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Coupon code is required' });
    return;
  }
  const result = dbService.validateCoupon(code, Number(subtotal || 0));
  if (!result.valid) {
    res.status(400).json(result);
    return;
  }
  res.json(result);
});

// Orders & Checkout API
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json(dbService.getOrders());
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, companyName, shippingAddress, shippingMethod, shippingCost, items, subtotal, discountAmount, appliedCoupon, taxAmount, totalAmount, paymentMethod, notes } = req.body;
    
    if (!customerName || !customerEmail || !items || items.length === 0) {
      res.status(400).json({ error: 'Customer information and cart items are required' });
      return;
    }

    const order = dbService.createOrder({
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      companyName,
      shippingAddress: shippingAddress || {
        street: '123 Tech Blvd',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        country: 'US'
      },
      shippingMethod: shippingMethod || 'standard',
      shippingCost: Number(shippingCost || 0),
      items,
      subtotal: Number(subtotal),
      discountAmount: Number(discountAmount || 0),
      appliedCoupon: appliedCoupon || undefined,
      taxAmount: Number(taxAmount || 0),
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      notes
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed creating order' });
  }
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = dbService.updateOrderStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

// Inquiries / Custom Quotes API
app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json(dbService.getInquiries());
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  try {
    const { name, phone, customerType, category, details } = req.body;
    if (!name || !phone || !details) {
      res.status(400).json({ error: 'Name, phone and details are required' });
      return;
    }
    const inquiry = dbService.createInquiry({
      name,
      phone,
      customerType: customerType || 'Not specified',
      category: category || 'Custom 3D Print',
      details
    });
    res.status(201).json(inquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed submitting inquiry' });
  }
});

// --- SERVER & VITE INTEGRATION ---
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 LayerLab 3D Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
