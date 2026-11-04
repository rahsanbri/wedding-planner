-- ==============================================================================
-- WEDDING MASTER PLANNER - SUPABASE SCHEMA & SEED SCRIPT
-- Jalankan skrip ini langsung di Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. TABEL TAMU & RSVP (GUESTS)
create table if not exists public.guests (
  id text primary key,
  name text not null,
  category text not null check (category in ('VIP', 'Keluarga Inti', 'Sahabat & Teman', 'Rekan Kerja')),
  invitation_count integer not null default 1,
  table_number text not null default '',
  rsvp_status text not null default 'menunggu' check (rsvp_status in ('hadir', 'tidak_hadir', 'menunggu')),
  attendance_event text not null default 'Semua Acara' check (attendance_event in ('Semua Acara', 'Hanya Gereja', 'Hanya Resepsi', 'Midodareni')),
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. TABEL ANGGARAN (BUDGET ITEMS)
create table if not exists public.budget_items (
  id text primary key,
  category text not null check (category in ('Acara Utama', 'Dekorasi & Venue', 'Dokumentasi', 'Busana & MUA', 'Katering & FnB', 'Lain-lain')),
  title text not null,
  vendor_name text not null default '',
  estimated_budget numeric not null default 0,
  actual_paid numeric not null default 0,
  payment_status text not null default 'belum_bayar' check (payment_status in ('lunas', 'dp', 'belum_bayar')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. TABEL VENDOR (VENDORS)
create table if not exists public.vendors (
  id text primary key,
  name text not null,
  category text not null check (category in ('Venue', 'Dekorasi', 'Katering', 'Dokumentasi', 'Busana & MUA', 'Entertainment & Music', 'Wedding Organizer')),
  contact_person text not null default '',
  phone text not null default '',
  email text not null default '',
  contract_status text not null default 'draft' check (contract_status in ('signed', 'review', 'draft')),
  payment_progress integer not null default 0,
  total_contract numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. TABEL CHECKLIST PERSIAPAN (CHECKLIST ITEMS)
create table if not exists public.checklist_items (
  id text primary key,
  title text not null,
  phase text not null check (phase in ('H-180 s/d H-120', 'H-90 s/d H-60', 'H-30 s/d H-14', 'H-7 s/d Hari-H')),
  pillar text not null check (pillar in ('Gereja', 'Pre-Wedding', 'Midodareni', 'Resepsi', 'Umum / Finansial')),
  pic text not null default '',
  completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  due_date text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. TABEL TIMELINE & RUNDOWN (TIMELINE MILESTONES)
create table if not exists public.timeline_milestones (
  id text primary key,
  phase_id text not null check (phase_id in ('h-6m', 'h-3m', 'h-1m', 'h-1w', 'h-day')),
  phase_name text not null,
  timeframe text not null default '',
  title text not null,
  pillar text not null check (pillar in ('Gereja', 'Pre-Wedding', 'Midodareni', 'Resepsi', 'Master')),
  date_formatted text not null,
  description text not null default '',
  location text not null default '',
  pic text not null default '',
  status text not null default 'upcoming' check (status in ('completed', 'in_progress', 'upcoming')),
  key_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. TABEL PENGATURAN WEDDING (SETTINGS)
create table if not exists public.wedding_settings (
  id text primary key default 'primary',
  target_date text not null default '2027-05-16T00:00:00+07:00',
  target_date_label text not null default '16 Mei 2027',
  guest_target integer not null default 450,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - PERMISIF UNTUK KOLABORASI KELUARGA & WO
-- ==============================================================================
alter table public.guests enable row level security;
alter table public.budget_items enable row level security;
alter table public.vendors enable row level security;
alter table public.checklist_items enable row level security;
alter table public.timeline_milestones enable row level security;
alter table public.wedding_settings enable row level security;

-- Kebijakan akses penuh untuk anonim / siapa pun dengan link dashboard
create policy "Allow all operations for public on guests" on public.guests for all using (true) with check (true);
create policy "Allow all operations for public on budget_items" on public.budget_items for all using (true) with check (true);
create policy "Allow all operations for public on vendors" on public.vendors for all using (true) with check (true);
create policy "Allow all operations for public on checklist_items" on public.checklist_items for all using (true) with check (true);
create policy "Allow all operations for public on timeline_milestones" on public.timeline_milestones for all using (true) with check (true);
create policy "Allow all operations for public on wedding_settings" on public.wedding_settings for all using (true) with check (true);

-- ==============================================================================
-- AKTIFKAN SUPABASE REALTIME REPLICATION (INSTANT LIVE SYNC HP & TABLET)
-- ==============================================================================
begin;
  -- Hapus dari publikasi jika sebelumnya sudah ada agar idempotent
  alter publication supabase_realtime add table public.guests;
  alter publication supabase_realtime add table public.budget_items;
  alter publication supabase_realtime add table public.vendors;
  alter publication supabase_realtime add table public.checklist_items;
  alter publication supabase_realtime add table public.timeline_milestones;
  alter publication supabase_realtime add table public.wedding_settings;
commit;

-- ==============================================================================
-- SEED INITIAL DATA
-- ==============================================================================

-- 1. Seed Settings
insert into public.wedding_settings (id, target_date, target_date_label, guest_target)
values ('primary', '2027-05-16T00:00:00+07:00', '16 Mei 2027', 450)
on conflict (id) do nothing;

-- 2. Seed Guests
insert into public.guests (id, name, category, invitation_count, table_number, rsvp_status, attendance_event, phone, notes)
values
  ('g1', 'Bp. Jenderal (Purn) Wiryanto & Ibu', 'VIP', 2, 'VIP-01', 'hadir', 'Semua Acara', '+62 811-0001-2345', 'Duduk bersama keluarga mempelai pria'),
  ('g2', 'Prof. Dr. Hendra Sujono & Partner', 'VIP', 2, 'VIP-02', 'hadir', 'Semua Acara', '+62 812-3344-5566', 'Saksi nikah gereja'),
  ('g3', 'Keluarga Besar Eyang Sasongko (Solo)', 'Keluarga Inti', 8, 'Fam-01', 'hadir', 'Semua Acara', '+62 813-1122-3344', 'Akomodasi di Hotel Mulia'),
  ('g4', 'Keluarga Bp. Bambang Hermanto', 'Keluarga Inti', 4, 'Fam-02', 'hadir', 'Semua Acara', '+62 815-5566-7788', 'PIC seserahan midodareni'),
  ('g5', 'Dimas Anggara & Istri', 'Sahabat & Teman', 2, 'Table-05', 'hadir', 'Hanya Resepsi', '+62 817-9988-7711', 'Groomsmen'),
  ('g6', 'Clarissa Putri & Partner', 'Sahabat & Teman', 2, 'Table-06', 'hadir', 'Hanya Resepsi', '+62 818-8877-6655', 'Bridesmaid'),
  ('g7', 'Tim Direksi PT Mega Kencana Perkasa', 'Rekan Kerja', 6, 'Table-08', 'hadir', 'Hanya Resepsi', '+62 812-4455-6677', 'Rekan kantor pengantin'),
  ('g8', 'Dra. Hj. Ratna Juwita (Surabaya)', 'VIP', 2, 'VIP-03', 'tidak_hadir', 'Hanya Resepsi', '+62 813-7788-9900', 'Berhalangan dinas luar kota'),
  ('g9', 'Alumni SMA Kolese Gonzaga Angkatan ''16', 'Sahabat & Teman', 10, 'Table-12', 'menunggu', 'Hanya Resepsi', null, 'Konfirmasi akhir saat H-14')
on conflict (id) do nothing;

-- 3. Seed Budget Items
insert into public.budget_items (id, category, title, vendor_name, estimated_budget, actual_paid, payment_status, notes)
values
  ('b1', 'Acara Utama', 'Administrasi Kanonik & Persembahan Gereja', 'Sekretariat Paroki Katedral', 15000000, 15000000, 'lunas', 'Termasuk paduan suara & organis liturgi'),
  ('b2', 'Acara Utama', 'MC Adat & Pranata Cara Midodareni', 'Sanggar Suryo Budoyo', 8000000, 8000000, 'lunas', 'Termasuk pemain gamelan live 1 set'),
  ('b3', 'Acara Utama', 'Wedding Organizer (12 Crew All-Day)', 'Kencana Wedding Organizer', 35000000, 20000000, 'dp', 'Pelunasan sisa Rp 15 Jt saat H-3'),
  ('b4', 'Dekorasi & Venue', 'Sewa Grand Ballroom Hotel Mulia', 'Hotel Mulia Senayan', 90000000, 90000000, 'lunas', 'Termasuk pemakaian 5 jam & 2 bridal suites'),
  ('b5', 'Dekorasi & Venue', 'Dekorasi Pelaminan & Lighting Ambience', 'Lotus Floral & Décor', 55000000, 30250000, 'dp', 'Termasuk pergola entrance 15 meter & karpet mawar'),
  ('b6', 'Dekorasi & Venue', 'Dekorasi Gereja (Altar & Lorong Bunga)', 'Katedral Floral Team', 12000000, 12000000, 'lunas', 'Bunga lily putih & baby breath import'),
  ('b7', 'Katering & FnB', 'Paket Buffet & 8 Food Stall 450 Pax', 'Mulia Culinary Banquet', 65000000, 48750000, 'dp', 'Termasuk Salmon En Croute & Kambing Guling'),
  ('b8', 'Dokumentasi', 'Foto & Sinematografi (Gereja + Resepsi)', 'CinemaVows Production', 50000000, 30000000, 'dp', 'Paket Cinematic 4K, 3 Album Leather, Drone coverage'),
  ('b9', 'Busana & MUA', 'Gaun Pengantin Resepsi & Jas Bespoke', 'Atelier Bridal Couture', 32000000, 32000000, 'lunas', 'Include fitting 3x & veil bordir 3 meter'),
  ('b10', 'Busana & MUA', 'MUA Pengantin & 2 Ibu Kandung', 'Victoria MUA Jakarta', 18000000, 9000000, 'dp', 'Retouch standby s/d resepsi selesai'),
  ('b11', 'Lain-lain', 'Cinderamata / Souvenir Keramik 450 Pcs', 'Kriya Keramik Nusantara', 9000000, 0, 'belum_bayar', 'Selesai produksi H-20')
on conflict (id) do nothing;

-- 4. Seed Vendors
insert into public.vendors (id, name, category, contact_person, phone, email, contract_status, payment_progress, total_contract)
values
  ('v1', 'Hotel Mulia Senayan', 'Venue', 'Ms. Linda (Senior Event Specialist)', '+62 811-1234-5678', 'events@hotelmulia.com', 'signed', 100, 90000000),
  ('v2', 'Lotus Floral & Décor Concept', 'Dekorasi', 'Bp. Indra (Creative Director)', '+62 812-9876-5432', 'lotusdecor@gmail.com', 'signed', 55, 55000000),
  ('v3', 'Mulia Culinary Catering', 'Katering', 'Chef Adrian', '+62 813-5566-7788', 'banquet@hotelmulia.com', 'signed', 75, 65000000),
  ('v4', 'CinemaVows Production & Photography', 'Dokumentasi', 'Arya Wirawan', '+62 817-2233-4455', 'contact@cinemavows.com', 'signed', 60, 50000000),
  ('v5', 'Atelier Bridal Couture', 'Busana & MUA', 'Jessica Tan', '+62 819-3344-5566', 'atelier@bridalcouture.com', 'signed', 100, 32000000),
  ('v6', 'The Velvet Jazz Harmony', 'Entertainment & Music', 'David (Band Leader)', '+62 812-6677-8899', 'velvetjazz@gmail.com', 'signed', 50, 18000000),
  ('v7', 'Kencana Wedding Organizer (12 Crew)', 'Wedding Organizer', 'Daniel Pratama', '+62 811-9988-7766', 'kencana.wo@gmail.com', 'signed', 60, 35000000)
on conflict (id) do nothing;

-- 5. Seed Checklist Items
insert into public.checklist_items (id, title, phase, pillar, pic, completed, priority, due_date)
values
  ('mc1', 'Menentukan tanggal pernikahan & booking Gereja Katedral', 'H-180 s/d H-120', 'Gereja', 'Kedua Mempelai', true, 'high', 'Mei 2026'),
  ('mc2', 'Booking Grand Ballroom Hotel Mulia Senayan (DP 30%)', 'H-180 s/d H-120', 'Resepsi', 'Groom / Finance', true, 'high', 'Juni 2026'),
  ('mc3', 'Menyusun estimasi anggaran total (Rp 350 Juta) & pos biaya', 'H-180 s/d H-120', 'Umum / Finansial', 'Lead Planner', true, 'high', 'Juni 2026'),
  ('mc4', 'Booking Vendor Fotografer Prewed & Tim Dokumentasi', 'H-180 s/d H-120', 'Pre-Wedding', 'Bride', true, 'medium', 'Juli 2026'),
  ('mc5', 'Pendaftaran Berkas Kanonik & KPP (Kursus Persiapan Perkawinan)', 'H-180 s/d H-120', 'Gereja', 'Kedua Mempelai', true, 'high', 'Juli 2026'),
  ('mc6', 'Eksekusi sesi foto Pre-Wedding outdoor di Bromo & studio', 'H-90 s/d H-60', 'Pre-Wedding', 'Tim Visual', true, 'high', 'Agustus 2026'),
  ('mc7', 'Test Food katering ballroom & finalisasi 8 stall pilihan', 'H-90 s/d H-60', 'Resepsi', 'Keluarga Inti', true, 'high', 'Agustus 2026'),
  ('mc8', 'Fitting busana adat Jawa (Beskap & Kebaya) untuk Midodareni', 'H-90 s/d H-60', 'Midodareni', 'Perias Adat', true, 'high', 'September 2026'),
  ('mc9', 'Penyusunan 16 baki seserahan adat & mahar pernikahan', 'H-90 s/d H-60', 'Midodareni', 'Keluarga Pria', true, 'medium', 'September 2026'),
  ('mc10', 'Desain undangan cetak hardcover & website undangan digital', 'H-90 s/d H-60', 'Resepsi', 'Vendor Grafis', false, 'high', 'Akhir September 2026'),
  ('mc11', 'Distribusi 450 undangan fisik & broadcast link RSVP digital', 'H-30 s/d H-14', 'Resepsi', 'Sekretariat', false, 'high', '1 Oktober 2026'),
  ('mc12', 'Finalisasi cetak buku liturgi gereja & briefing paduan suara', 'H-30 s/d H-14', 'Gereja', 'Koordinator Liturgi', false, 'high', '5 Oktober 2026'),
  ('mc13', 'Cetak 2 kanvas galeri 60x90cm untuk foyer ballroom', 'H-30 s/d H-14', 'Pre-Wedding', 'Vendor Foto', false, 'medium', '10 Oktober 2026'),
  ('mc14', 'Briefing gabungan 14 vendor utama bersama Hotel & WO', 'H-30 s/d H-14', 'Resepsi', 'Lead WO', false, 'high', '15 Oktober 2026'),
  ('mc15', 'Pengambilan cincin nikah dari safebox & pengecekan sertifikat', 'H-7 s/d Hari-H', 'Gereja', 'Best Man / Groom', false, 'high', '20 Oktober 2026'),
  ('mc16', 'Pemasangan kembar mayang & sesaji di kediaman mempelai wanita', 'H-7 s/d Hari-H', 'Midodareni', 'Pranata Adat', false, 'high', '23 Oktober Pagi'),
  ('mc17', 'Pelaksanaan upacara sakral Midodareni (Malam H-1)', 'H-7 s/d Hari-H', 'Midodareni', 'Seluruh Keluarga', false, 'high', '23 Oktober Malam'),
  ('mc18', 'Gladi resik grand entrance ballroom & uji sound/lighting', 'H-7 s/d Hari-H', 'Resepsi', 'Lead WO', false, 'high', '24 Oktober 16.00'),
  ('mc19', 'Serah terima kotak angpau & souvenir sisa kepada orang tua', 'H-7 s/d Hari-H', 'Resepsi', 'Keamanan Keluarga', false, 'high', '24 Oktober 22.00')
on conflict (id) do nothing;
