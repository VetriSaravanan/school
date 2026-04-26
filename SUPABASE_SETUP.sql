-- =====================================================================
-- PAYITRAGAM PRESCHOOL — Database setup
-- Run this ENTIRE script ONCE in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)
-- =====================================================================

-- ============= TABLES =============

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  school_name text default 'Payitragam Preschool',
  tagline text default 'E for Education, P for Payitragam',
  logo_url text,
  favicon_url text,
  phone1 text default '9003845060',
  phone2 text default '9952740025',
  email text default 'payitragam@gmail.com',
  fb_url text,
  ig_url text,
  yt_url text,
  wa_number text default '9003845060',
  updated_at timestamptz default now()
);

create table if not exists public.home_content (
  id uuid primary key default gen_random_uuid(),
  hero_title text default 'Learning is Fun & Joyful Here!',
  hero_subtitle text default 'A pioneer in Multiple-Intelligence-based Learning in Tirunelveli.',
  hero_bg_url text,
  cta1_text text default 'Enroll Now',
  cta1_link text default '#reach-us',
  cta2_text text default 'Take a Tour',
  cta2_link text default '#gallery',
  programs_label text default '📚 Our Programs',
  programs_title text default 'Explore Our Classes',
  programs_subtitle text default 'Age-appropriate programs designed with love, expertise, and a whole lot of fun for every little learner!',
  stat_years int default 7,
  stat_students int default 500,
  stat_teachers int default 20,
  stat_branches int default 2,
  updated_at timestamptz default now()
);

create table if not exists public.about_content (
  id uuid primary key default gen_random_uuid(),
  who_we_are_text text,
  mission text,
  vision text,
  updated_at timestamptz default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  branch_name text not null,
  address text,
  map_embed_url text,
  phone text,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.sections_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null, -- playground|nursery|junior_kg|senior_kg
  title text,
  description text,
  features jsonb default '[]'::jsonb,
  photos jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  category_id uuid references public.gallery_categories(id) on delete set null,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,                   -- rich text HTML from Quill
  excerpt text,
  author text default 'Payitragam Team',
  cover_url text,
  status text default 'draft',    -- draft | published
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  badge_color text default '#e63946',
  is_pinned boolean default false,
  announcement_date date default current_date,
  created_at timestamptz default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  child_age text,
  message text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============= ROW LEVEL SECURITY =============
alter table public.site_settings enable row level security;
alter table public.home_content enable row level security;
alter table public.about_content enable row level security;
alter table public.team_members enable row level security;
alter table public.branches enable row level security;
alter table public.sections_content enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_images enable row level security;
alter table public.blogs enable row level security;
alter table public.announcements enable row level security;
alter table public.enquiries enable row level security;

-- Public READ on all content tables
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'site_settings','home_content','about_content','team_members','branches',
      'sections_content','gallery_categories','gallery_images','blogs','announcements'
    ])
  loop
    execute format('drop policy if exists "public read %1$s" on public.%1$s', t);
    execute format('create policy "public read %1$s" on public.%1$s for select using (true)', t);

    execute format('drop policy if exists "auth write %1$s" on public.%1$s', t);
    execute format('create policy "auth write %1$s" on public.%1$s for all to authenticated using (true) with check (true)', t);
  end loop;
end$$;

-- Enquiries: anon can INSERT (form submissions), only authenticated can read/update/delete
drop policy if exists "anyone insert enquiries" on public.enquiries;
create policy "anyone insert enquiries" on public.enquiries for insert to public with check (true);

drop policy if exists "auth read enquiries" on public.enquiries;
create policy "auth read enquiries" on public.enquiries for select to authenticated using (true);

drop policy if exists "auth update enquiries" on public.enquiries;
create policy "auth update enquiries" on public.enquiries for update to authenticated using (true) with check (true);

drop policy if exists "auth delete enquiries" on public.enquiries;
create policy "auth delete enquiries" on public.enquiries for delete to authenticated using (true);

-- ============= STORAGE BUCKETS =============
insert into storage.buckets (id, name, public) values
  ('logos','logos',true),
  ('gallery','gallery',true),
  ('team-photos','team-photos',true),
  ('blog-covers','blog-covers',true),
  ('section-photos','section-photos',true),
  ('hero-images','hero-images',true)
on conflict (id) do nothing;

-- Public read on all our buckets, authenticated write
drop policy if exists "public read storage" on storage.objects;
create policy "public read storage" on storage.objects for select using (
  bucket_id in ('logos','gallery','team-photos','blog-covers','section-photos','hero-images')
);

drop policy if exists "auth write storage" on storage.objects;
create policy "auth write storage" on storage.objects for insert to authenticated with check (
  bucket_id in ('logos','gallery','team-photos','blog-covers','section-photos','hero-images')
);

drop policy if exists "auth update storage" on storage.objects;
create policy "auth update storage" on storage.objects for update to authenticated using (
  bucket_id in ('logos','gallery','team-photos','blog-covers','section-photos','hero-images')
);

drop policy if exists "auth delete storage" on storage.objects;
create policy "auth delete storage" on storage.objects for delete to authenticated using (
  bucket_id in ('logos','gallery','team-photos','blog-covers','section-photos','hero-images')
);

-- ============= SEED DEFAULT ROWS =============
insert into public.site_settings (id) select gen_random_uuid()
where not exists (select 1 from public.site_settings);

insert into public.home_content (id) select gen_random_uuid()
where not exists (select 1 from public.home_content);

insert into public.about_content (who_we_are_text, mission, vision)
select
  'NELLAIAPPAR KANTHIMATHI PAYITRAGAM is a trailblazer in Multiple-Intelligence-based Learning and Development, located in Tirunelveli, Tamilnadu. Founded in 2018.',
  'Provide every child a safe, joyful environment that nurtures their unique multiple intelligences.',
  'Become the most trusted name in early childhood education across Tamilnadu.'
where not exists (select 1 from public.about_content);

insert into public.branches (branch_name, address, phone, order_index) values
  ('Branch 1 — South Balabakiya Nagar','122A, 6th Cross Street, South Balabakiya Nagar, Tirunelveli - 627001','9003845060',1),
  ('Branch 2 — Maharaja Nagar','Maharaja Nagar, Tirunelveli, Tamilnadu - 627011','9952740025',2)
on conflict do nothing;

insert into public.gallery_categories (name, slug, order_index) values
  ('All','all',0),
  ('Vegetable Day','vegetable-day',1),
  ('Blue Day','blue-day',2),
  ('Red Day','red-day',3),
  ('Festivals','festivals',4),
  ('Fathers Day','fathers-day',5),
  ('Transportation Day','transportation-day',6),
  ('Community Helpers','community-helpers',7),
  ('Yellow Day','yellow-day',8),
  ('Orange Day','orange-day',9),
  ('Pink Purple Day','pink-purple-day',10),
  ('Green Vegetables Day','green-vegetables-day',11)
on conflict (slug) do nothing;

insert into public.sections_content (section_key, title, description, features) values
  ('playground','Our Playground','Designed with child safety as the top priority. Spacious outdoor areas, age-appropriate equipment, and a 10:1 child-to-adult ratio.','["Safe outdoor play equipment","10:1 Child-Adult Ratio","Spacious play area","Supervised at all times","Age-appropriate activities","Nature exploration zone"]'::jsonb),
  ('nursery','Nursery (2–3 Years)','Our Nursery program uses Montessori and Reggio Emilia approaches to introduce toddlers to learning through play.','["Montessori-inspired learning","Sensory play activities","Language development","Social skill building","Art and music exploration","Gentle daily routines"]'::jsonb),
  ('junior_kg','Junior KG (3–4 Years)','Builds on early foundations with Multiple Intelligence-based activities.','["Multiple Intelligence approach","Reggio Emilia projects","Number and letter readiness","Creative arts program","Physical education","International curriculum"]'::jsonb),
  ('senior_kg','Senior KG (4–5 Years)','Prepares children for primary school with confidence.','["School readiness program","Reading and writing foundation","Mathematical thinking","Science exploration","Leadership activities","Parent-teacher collaboration"]'::jsonb)
on conflict (section_key) do nothing;

-- ============= DONE =============
-- Next steps:
-- 1. Go to Authentication → Users → Add user
-- 2. Email: admin@gmail.com  Password: Admin@123  (Auto-confirm: ON)
-- 3. Done. You can now log in at /admin
