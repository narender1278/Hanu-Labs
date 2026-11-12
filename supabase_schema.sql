-- LayerLab 3D Schema for Supabase (PostgreSQL)
-- Run this in your Supabase SQL Editor if you want to use Supabase cloud directly.

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Products Table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text not null,
  base_price numeric(10,2) not null,
  discount_percent numeric(5,2) default 0,
  sale_price numeric(10,2),
  stock integer default 10,
  availability text default 'in_stock',
  lead_time text default 'Ships in 24h',
  dimensions text default '120 x 80 x 40 mm',
  weight_grams integer default 120,
  model_3d_preset text default 'drone_arm',
  default_material text default 'carbon_fiber',
  available_materials text[] default array['carbon_fiber', 'tough_resin', 'titanium', 'nylon_orange', 'brass'],
  features text[] default array['High tensile strength', 'Precision ±0.05mm', 'UV resistant'],
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Discounts / Coupons Table
create table if not exists public.discounts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10,2) not null,
  min_order_value numeric(10,2) default 0,
  is_active boolean default true,
  usage_count integer default 0,
  expiry_date text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders Table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  company_name text,
  shipping_address jsonb not null,
  shipping_method text not null,
  shipping_cost numeric(10,2) not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0,
  applied_coupon text,
  tax_amount numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  payment_method text not null,
  payment_status text default 'paid',
  fulfillment_status text default 'printing',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Inquiries / Quotes Table
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  customer_type text not null,
  category text not null,
  details text not null,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.discounts enable row level security;
alter table public.orders enable row level security;
alter table public.inquiries enable row level security;

-- Public read access for products and active discounts
create policy "Allow public read access for products" on public.products for select using (true);
create policy "Allow public read access for active discounts" on public.discounts for select using (is_active = true);

-- Allow public insert for orders and inquiries
create policy "Allow public insert for orders" on public.orders for insert with check (true);
create policy "Allow public insert for inquiries" on public.inquiries for insert with check (true);

-- Allow full access to authenticated users / service role
create policy "Allow admin full access to products" on public.products for all using (true) with check (true);
create policy "Allow admin full access to discounts" on public.discounts for all using (true) with check (true);
create policy "Allow admin full access to orders" on public.orders for all using (true) with check (true);
create policy "Allow admin full access to inquiries" on public.inquiries for all using (true) with check (true);
