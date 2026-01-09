-- Enable RLS (Supabase usually has this enabled by default, and modifying it might cause permission errors)
-- alter table auth.users enable row level security;

-- 1. PROFILES (Extends auth.users)
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  city text,
  role text not null default 'user' check (role in ('user', 'admin', 'staff')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Profile RLS
create policy "Public profiles are viewable by everyone" 
  on profiles for select using (true);

create policy "Users can insert their own profile" 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update using (auth.uid() = id);

-- 2. PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  category text not null, -- 'cake', 'pastry', 'cookie', etc.
  images text[] default '{}', -- Array of Supabase Storage URLs
  video text, -- Hero video URL
  tags text[] default '{}',
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

-- Products RLS
create policy "Products are viewable by everyone" 
  on products for select using (true);

create policy "Admins can insert products" 
  on products for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update products" 
  on products for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete products" 
  on products for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 3. PRODUCT SIZES (Dynamic Pricing)
create table public.product_sizes (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  size_label text not null, -- '0.5 kg', '1 kg'
  price numeric not null,
  created_at timestamptz default now()
);

alter table public.product_sizes enable row level security;

-- Product Sizes RLS
create policy "Sizes viewable by everyone" 
  on product_sizes for select using (true);

create policy "Admins can manage sizes" 
  on product_sizes for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 4. CART
create table public.cart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size_id uuid not null references public.product_sizes(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id, size_id) -- Prevent duplicate rows for same item
);

alter table public.cart enable row level security;

-- Cart RLS
create policy "Users can view own cart" 
  on cart for select using (auth.uid() = user_id);

create policy "Users can insert into own cart" 
  on cart for insert with check (auth.uid() = user_id);

create policy "Users can update own cart" 
  on cart for update using (auth.uid() = user_id);

create policy "Users can delete from own cart" 
  on cart for delete using (auth.uid() = user_id);

-- 5. WISHLIST
create table public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size_id uuid references public.product_sizes(id) on delete cascade, -- Optional specific size
  created_at timestamptz default now(),
  unique(user_id, product_id, size_id)
);

alter table public.wishlist enable row level security;

-- Wishlist RLS
create policy "Users can manage own wishlist" 
  on wishlist for all using (auth.uid() = user_id);

-- 6. ORDERS
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id),
  items jsonb not null, -- Snapshot of cart items at purchase time
  total_price numeric not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending', -- 'paid', 'failed'
  stripe_session_id text,
  delivery_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

-- Orders RLS
create policy "Users can view own orders" 
  on orders for select using (auth.uid() = user_id);

create policy "Admins and Staff can view all orders" 
  on orders for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
  );

create policy "Admins and Staff can update orders" 
  on orders for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
  );
  
-- Allow users to create orders (usually done via server-side or after payment, but for now allow insert if authenticated)
-- Ideally, order creation happens via a secure function or webhook, but basic RLS:
create policy "Users can create orders" 
  on orders for insert with check (auth.uid() = user_id);


-- UTILITIES & TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.phone, -- Supabase stores phone in auth.users.phone if used
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKET SETUP (Conceptual - needs to be done in dashboard or via API, but here for reference)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- insert into storage.buckets (id, name, public) values ('landing-pages', 'landing-pages', true);

-- Storage Policies
-- create policy "Public Access" on storage.objects for select using ( bucket_id in ('products', 'landing-pages') );
-- create policy "Admin Upload" on storage.objects for insert with check ( bucket_id in ('products', 'landing-pages') and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

