# Panduan Setup Supabase & Deploy ke Vercel (Multi-Device Real-Time)

Panduan ini berisi langkah praktis agar Wedding Planner Dashboard dapat diakses bersama secara real-time di HP, tablet, dan laptop oleh Anda, pasangan, keluarga, dan tim Wedding Organizer (WO).

---

## 🌟 Mengapa Supabase + Vercel?
1. **Real-time Live Sync:** Begitu tamu di-check-in di meja penerima tamu (HP panitia), status RSVP langsung terupdate seketika di laptop WO dan HP pengantin tanpa perlu refresh.
2. **Akses Dari Mana Saja:** Cukup buka link website Vercel di browser HP atau tablet.
3. **Gratis 100%:** Paket gratis (*Free Tier*) dari Supabase dan Vercel sangat mencukupi untuk kebutuhan event pernikahan.

---

## 🛠️ Langkah 1: Setup Supabase Database

1. Buka [https://supabase.com](https://supabase.com) dan buat akun (bisa sign in dengan GitHub).
2. Klik **"New project"**:
   - Berikan nama project, misalnya: `our-wedding-planner`
   - Buat database password yang aman (dan simpan).
   - Pilih region terdekat: `Singapore (ap-southeast-1)`.
   - Pilih paket **Free Plan**.
3. Tunggu 1-2 menit hingga database selesai dibuat.
4. Di menu sidebar kiri Supabase, klik **SQL Editor**.
5. Klik **"New query"**, lalu salin seluruh isi file:
   📂 `supabase/schema.sql`
6. Tempel (*paste*) ke SQL Editor, lalu klik tombol hijau **"Run"** di kanan bawah.
   > **Selesai!** Seluruh 6 tabel (`guests`, `budget_items`, `vendors`, `checklist_items`, `timeline_milestones`, `wedding_settings`), hak akses RLS, Realtime replication, dan data awal pernikahan Anda langsung terisi secara otomatis.

7. Mengambil API Keys:
   - Klik ikon gerigi **Project Settings** di pojok kiri bawah.
   - Pilih menu **Data API** (atau **API**).
   - Salin dua nilai berikut:
     - **Project URL** (misal: `https://xyzcompany.supabase.co`)
     - **Project API keys -> `anon` / `public`** (string panjang diawali `eyJ...`)

---

## 🚀 Langkah 2: Deploy ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Pastikan project Wedding Planner ini sudah Anda push ke repository GitHub Anda (bisa private).
3. Di dashboard Vercel, klik **"Add New..."** -> **"Project"**.
4. Pilih repository `Wedding Planner` Anda, lalu klik **"Import"**.
5. Pada bagian **Environment Variables**, tambahkan dua variabel yang didapat dari Langkah 1:
   - Nama: `NEXT_PUBLIC_SUPABASE_URL`  
     Value: *(Paste Project URL Supabase Anda)*
   - Nama: `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     Value: *(Paste anon public key Supabase Anda)*
6. Klik tombol **"Deploy"**.
7. Tunggu sekitar 1 menit hingga proses build selesai. Vercel akan memberikan domain publik gratis, contohnya:  
   👉 `https://wedding-planner-radit-maria.vercel.app`

---

## 📱 Langkah 3: Menggunakan di HP & Tablet

1. Buka link domain Vercel Anda di Safari (iPhone/iPad) atau Chrome (Android).
2. Perhatikan indikator di kanan atas header:
   - **🟢 Cloud Live**: Menandakan perangkat sudah terhubung secara real-time ke Supabase.
3. Coba lakukan perubahan di HP (misalnya centang checklist tugas atau ubah status RSVP tamu). Perubahan tersebut akan langsung terlihat di tablet dan laptop dalam sepersekian detik!
4. *(Tips Tambahan)*: Di browser HP, klik menu browser lalu pilih **"Add to Home Screen"** agar ikon Wedding Planner muncul seperti aplikasi asli di layar utama HP Anda.
