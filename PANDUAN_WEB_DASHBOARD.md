# Panduan Membangun Web Dashboard Interaktif (Sales CRM Style)

Panduan ini merangkum arsitektur, komponen inti, dan langkah praktis pembuatan Web Dashboard interaktif seperti yang dicontohkan oleh *_code_and_chill_* (Sales CRM Dashboard).

---

## 1. Arsitektur & Teknologi (Tech Stack)

Karakteristik dashboard bergaya Code & Chill adalah performa cepat, tanpa bloatware, dan animasi fluid:

* **Markup & Struktur:** Semantic HTML5
* **Styling & Tata Letak:** CSS Grid + Flexbox (atau Tailwind CSS)
* **Interaktivitas:** Vanilla JavaScript / TypeScript
* **Grafik/Charts:** Chart.js, ApexCharts, atau Recharts
* **Drag-and-Drop:** Native HTML5 Drag and Drop API atau SortableJS
* **Build Tool:** Vite (cepat, ringan, dan modern)

---

## 2. Struktur Layout Inti Dashboard

Dashboard modern umumnya menggunakan layout 3-bagian:
1. **Sidebar Navigation (Kiri):** Menu navigasi utama, logo, switch profile/workspace.
2. **Top Header (Atas):** Kolom pencarian global, notifikasi, filter rentang tanggal, tombol aksi cepat (*Quick Action*).
3. **Main Workspace (Tengah/Kanan):**
   * **KPI Stats Row:** Kartu metrik penting (Revenue, Deals, Conversion, Active Leads).
   * **Visual Charts Section:** Grafik tren penjualan, target per kuartal.
   * **Pipeline/Kanban Board:** Kolom stage deal yang interaktif.
   * **Sliding Detail Drawer / Modal:** Panel detail yang muncul saat kartu diklik.

---

## 3. Komponen Utama & Cara Implementasinya

### A. Kartu Metrik KPI (Stats Cards)
```html
<div class="stats-grid">
  <div class="stat-card">
    <span class="stat-title">Total Pendapatan</span>
    <h3 class="stat-value">Rp 128.500.000</h3>
    <span class="badge positive">+14.2% vs bln lalu</span>
  </div>
  <!-- Ulangi untuk metrik lainnya -->
</div>
```

### B. Sales Pipeline Board (Kanban Drag-and-Drop)
Menggunakan HTML5 Drag and Drop API:
* Elemen kartu diberi atribut `draggable="true"`.
* Event listener:
  * `dragstart`: Simpan ID kartu ke `dataTransfer`.
  * `dragover`: `e.preventDefault()` pada kolom target agar drop diperbolehkan.
  * `drop`: Pindahkan kartu ke container kolom target dan perbarui status data.

### C. Visualisasi Data (Charts)
Gunakan library ringan seperti **Chart.js**:
```javascript
import Chart from 'chart.js/auto';

const ctx = document.getElementById('salesChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [{
      label: 'Pendapatan',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: '#4f46e5',
      tension: 0.4
    }]
  }
});
```

### D. Sliding Detail Drawer (Side Sheet)
Panel samping untuk melihat detail tanpa berpindah halaman:
```css
.drawer {
  position: fixed;
  top: 0;
  right: -420px;
  width: 420px;
  height: 100vh;
  background: #ffffff;
  box-shadow: -4px 0 24px rgba(0,0,0,0.12);
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 50;
}
.drawer.open {
  right: 0;
}
```

---

## 4. Langkah-Langkah Pembuatan dari Awal

1. **Inisialisasi Project:**
   ```bash
   npm create vite@latest sales-dashboard -- --template vanilla
   cd sales-dashboard
   npm install
   ```

2. **Desain Token & Warna:**
   * Tentukan tema palet warna (Primary, Dark Neutral, Soft Border, Background Wash).
   * Siapkan variabel CSS untuk Dark/Light mode jika diperlukan.

3. **Buat Kerangka HTML & CSS Grid:**
   * Atur layout utama dengan CSS Grid (`grid-template-columns: 240px 1fr`).

4. **Integrasikan Interaktivitas:**
   * Buat *mock data* (JSON) untuk daftar prospek/klien/deals.
   * Render kartu secara dinamis dengan JavaScript.
   * Pasang fungsi *filter*, *search*, dan *drag-and-drop*.

5. **Hubungkan Panel Detail (Drawer) & Form Aksi:**
   * Tambahkan event klik pada kartu untuk mengisi form di drawer.
