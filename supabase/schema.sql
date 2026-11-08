-- Clinic Hub Agency — run this whole file once in Supabase > SQL Editor

create extension if not exists "pgcrypto";

-- ---------- Tables ----------
create table if not exists public.admins (
  email text primary key
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  clinic_name text not null default '',
  service_id uuid references public.services(id) on delete set null,
  image_url text not null,
  image_path text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '',
  instagram text not null default '',
  email text not null default ''
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------- Admin check ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- Row Level Security ----------
alter table public.admins   enable row level security;
alter table public.services enable row level security;
alter table public.works    enable row level security;
alter table public.settings enable row level security;

-- admins: no direct access (only through is_admin())

create policy "services read"  on public.services for select using (is_active or public.is_admin());
create policy "services write" on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy "works read"  on public.works for select using (is_published or public.is_admin());
create policy "works write" on public.works for all using (public.is_admin()) with check (public.is_admin());

create policy "settings read"  on public.settings for select using (true);
create policy "settings write" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public)
values ('works', 'works', true)
on conflict (id) do nothing;

create policy "works images public read" on storage.objects
  for select using (bucket_id = 'works');
create policy "works images admin insert" on storage.objects
  for insert with check (bucket_id = 'works' and public.is_admin());
create policy "works images admin update" on storage.objects
  for update using (bucket_id = 'works' and public.is_admin());
create policy "works images admin delete" on storage.objects
  for delete using (bucket_id = 'works' and public.is_admin());

-- ---------- Starter services (edit or delete from the admin page) ----------
insert into public.services (title, description, sort_order) values
  ('تصميم الروشتات', 'روشتة بهوية العيادة: ترتيب واضح، طباعة نظيفة، وتفاصيل الطبيب والتخصص في مكانها الصحيح.', 1),
  ('إعلانات العيادات', 'إدارة حملات ممولة على فيسبوك وانستجرام وجوجل توصّل خدمات العيادة للمرضى في منطقتك.', 2),
  ('تصميم الإعلانات', 'بوستات وقصص وبانرات للعيادة والعروض والحملات الموسمية، جاهزة للنشر على كل المنصات.', 3);

-- ---------- IMPORTANT: make yourself admin ----------
-- 1) Supabase > Authentication > Users > "Add user" (email + password)
-- 2) Supabase > Authentication > Providers > Email > turn OFF "Allow new users to sign up"
-- 3) Then run (replace with your email):
-- insert into public.admins (email) values ('you@example.com');
