-- ============================================================
--  Setup Supabase untuk Portfolio Prizuri Hartadi
--  Jalankan SEKALI di: Supabase Dashboard -> SQL Editor -> New query
--  Aman dijalankan ulang (idempotent).
-- ============================================================

-- 1) Tabel konten: satu baris (id=1) menampung seluruh isi situs sebagai JSON
create table if not exists public.site_content (
  id         int primary key,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Baris kosong awal; akan diisi saat klik "Simpan ke Supabase" di admin
insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- 2) RLS: publik boleh BACA, hanya yang login boleh TULIS
alter table public.site_content enable row level security;

drop policy if exists "public read content"  on public.site_content;
drop policy if exists "auth insert content"   on public.site_content;
drop policy if exists "auth update content"   on public.site_content;

create policy "public read content"
  on public.site_content for select
  using (true);

create policy "auth insert content"
  on public.site_content for insert to authenticated
  with check (true);

create policy "auth update content"
  on public.site_content for update to authenticated
  using (true) with check (true);

-- 3) Storage: bucket publik untuk gambar
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "public read images"  on storage.objects;
drop policy if exists "auth upload images"  on storage.objects;
drop policy if exists "auth delete images"  on storage.objects;

create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "auth upload images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-images');

create policy "auth delete images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-images');
