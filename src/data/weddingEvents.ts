export interface WeddingTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate: string;
  pic: string;
  notes?: string;
  priority: "high" | "medium" | "low";
}

export interface WeddingRundownItem {
  time: string;
  activity: string;
  location: string;
  pic: string;
  notes: string;
}

export interface WeddingDocument {
  id: string;
  name: string;
  type: string;
  status: "verified" | "pending" | "missing";
  uploadedDate?: string;
}

export interface EventDetailData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  targetDate: string;
  location: string;
  picName: string;
  picPhone: string;
  themeColor: string;
  badgeBg: string;
  tasks: WeddingTask[];
  rundown: WeddingRundownItem[];
  documents: WeddingDocument[];
}

export const eventsDatabase: Record<string, EventDetailData> = {
  gereja: {
    id: "gereja",
    title: "Gereja (Pemberkatan / Nikah)",
    subtitle: "Pendaftaran Kanonik & Sakramen Pernikahan Suci",
    category: "Sakramen & Administrasi",
    description: "Seluruh kelengkapan administrasi gereja, penyelidikan kanonik oleh Pastor Paroki, kursus persiapan perkawinan (KPP), serta gladi bersih liturgi dan paduan suara.",
    targetDate: "Minggu, 16 Mei 2027 • 09.00 - 11.00 WIB",
    location: "Gereja Katedral St. Maria Diangkat Ke Surga, Jakarta",
    picName: "Maria & Romo Yosef (Sekretariat Paroki)",
    picPhone: "+62 812-3456-7890",
    themeColor: "#d49957",
    badgeBg: "bg-[#faece0] text-[#b57a41]",
    tasks: [
      { id: "g1", title: "Pendaftaran Berkas Kanonik ke Sekretariat Paroki", category: "Administrasi", completed: true, dueDate: "15 November 2026", pic: "Groom & Bride", priority: "high" },
      { id: "g2", title: "Mengikuti Kursus Persiapan Perkawinan (KPP 3 Hari)", category: "Kursus", completed: true, dueDate: "10 Januari 2027", pic: "Kedua Mempelai", priority: "high" },
      { id: "g3", title: "Penyelidikan Kanonik Tatap Muka Bersama Pastor", category: "Wawancara", completed: true, dueDate: "10 Februari 2027", pic: "Pastor & Mempelai", priority: "high" },
      { id: "g4", title: "Pengumuman Perkawinan di Paroki Masing-Masing (3x Misa)", category: "Administrasi", completed: false, dueDate: "15 April 2027", pic: "Sekretariat Paroki", priority: "medium" },
      { id: "g5", title: "Finalisasi Buku Panduan Liturgi & Teks Misa", category: "Liturgi", completed: false, dueDate: "25 April 2027", pic: "Tim Liturgi & Romo", priority: "high" },
      { id: "g6", title: "Konfirmasi Paduan Suara (Choir) & Organis", category: "Musik", completed: false, dueDate: "1 Mei 2027", pic: "Koordinator Musik", priority: "medium" },
      { id: "g7", title: "Penunjukan 2 Orang Saksi Nikah Resmi Gereja", category: "Saksi", completed: false, dueDate: "5 Mei 2027", pic: "Keluarga Inti", priority: "high" },
      { id: "g8", title: "Gladi Bersih Prosesi Masuk & Liturgi Pemberkatan", category: "Gladi Resik", completed: false, dueDate: "14 Mei 2027", pic: "Seluruh Petugas & Romo", priority: "high" },
      { id: "g9", title: "Pemberian Sakramen Tobat / Rekonsiliasi Pra-Nikah", category: "Rohani", completed: false, dueDate: "15 Mei 2027", pic: "Kedua Mempelai", priority: "medium" },
      { id: "g10", title: "Koordinasi Persembahan Kasih & Stipendium Gereja", category: "Keuangan", completed: false, dueDate: "15 Mei 2027", pic: "Bendahara Keluarga", priority: "low" },
    ],
    rundown: [
      { time: "08.00 - 08.30", activity: "Mempelai & Keluarga Inti Tiba di Ruang Transit Gereja", location: "Ruang Transit Katedral", pic: "WO & Usher", notes: "Cek busana & touch-up makeup" },
      { time: "08.30 - 08.50", activity: "Pemeriksaan Dokumen Akhir & Tanda Tangan Berkas Saksi", location: "Sakristi Gereja", pic: "Sekretariat Paroki", notes: "Saksi nikah hadir lengkap dengan KTP" },
      { time: "08.55 - 09.00", activity: "Barisan Prosesi Masuk Gereja Berkumpul di Pintu Utama", location: "Pintu Depan Gereja", pic: "Lead WO", notes: "Orang tua mendampingi kedua mempelai" },
      { time: "09.00 - 10.30", activity: "Misa Perayaan Ekaristi & Peneguhan Janji Nikah Suci", location: "Altar Utama Katedral", pic: "Pastor Paroki", notes: "Janji suci, tukar cincin, sungkeman orang tua" },
      { time: "10.30 - 10.45", activity: "Penandatanganan Buku Nikah Gereja & Akta Sipil", location: "Meja Penandatanganan Altar", pic: "Petugas Catatan Sipil & Romo", notes: "Foto bersama dokumen resmi" },
      { time: "10.45 - 11.15", activity: "Foto Bersama Romo, Keluarga Besar & Tamu Pemberkatan", location: "Altar & Plaza Gereja", pic: "Fotografer & WO", notes: "Tertib sesuai nomor urut foto" },
    ],
    documents: [
      { id: "d1", name: "Surat Baptis Terbaru (Update < 6 Bulan)", type: "PDF / Fisik", status: "verified", uploadedDate: "12 November 2026" },
      { id: "d2", name: "Sertifikat Kursus Persiapan Perkawinan (KPP)", type: "PDF", status: "verified", uploadedDate: "15 Januari 2027" },
      { id: "d3", name: "Fotokopi KTP, KK, & Akta Kelahiran Kedua Mempelai", type: "PDF Bundle", status: "verified", uploadedDate: "15 November 2026" },
      { id: "d4", name: "KTP & Data Lengkap 2 Orang Saksi Nikah", type: "PDF", status: "pending" },
      { id: "d5", name: "Draft Buku Liturgi Pernikahan (Revisi 2)", type: "DOCX", status: "pending" },
    ]
  },

  prewedding: {
    id: "prewedding",
    title: "Pre-Wedding",
    subtitle: "Konsep Visual, Dokumentasi Outdoor & Cetak Galeri",
    category: "Visual & Content",
    description: "Sesi dokumentasi foto & video kreatif pra-nikah dengan tema perpaduan Tradisional Modern dan Romantis Alam Terbuka untuk dipajang di galeri pernikahan Hari-H.",
    targetDate: "Februari 2027 • Sesi 2 Hari (Outdoor & Studio)",
    location: "Studio Kencana Art & Taman Nasional Bromo Tengger Semeru",
    picName: "Arya (Lead Visual) & Jessica (MUA)",
    picPhone: "+62 813-9876-5432",
    themeColor: "#558252",
    badgeBg: "bg-[#edf4ec] text-[#3e683b]",
    tasks: [
      { id: "p1", title: "Penyusunan Moodboard & Storyboard Konsep Pre-Wedding", category: "Konsep", completed: true, dueDate: "1 Desember 2026", pic: "Lead Visual & Bride", priority: "high" },
      { id: "p2", title: "Booking Vendor Fotografer, Videografer & Drone Pilot", category: "Vendor", completed: true, dueDate: "10 Desember 2026", pic: "Groom", priority: "high" },
      { id: "p3", title: "Fitting 4 Set Gaun Bridal, Jas Groom, & Kebaya Modern", category: "Wardrobe", completed: true, dueDate: "15 Januari 2027", pic: "Bride & Stylist", priority: "high" },
      { id: "p4", title: "Izin Lokasi & Tiket Masuk Taman Nasional Bromo", category: "Logistik", completed: true, dueDate: "10 Februari 2027", pic: "Tim Produksi", priority: "medium" },
      { id: "p5", title: "Eksekusi Hari 1: Sesi Foto Studio Klasik & Gaun Hitam", category: "Shooting", completed: false, dueDate: "20 Februari 2027", pic: "Seluruh Tim", priority: "high" },
      { id: "p6", title: "Eksekusi Hari 2: Sesi Foto Sunrise & Savana Bromo", category: "Shooting", completed: false, dueDate: "22 Februari 2027", pic: "Seluruh Tim", priority: "high" },
      { id: "p7", title: "Proses Pemilihan 30 Foto Master untuk Retouching", category: "Editing", completed: false, dueDate: "15 Maret 2027", pic: "Kedua Mempelai", priority: "high" },
      { id: "p8", title: "Cetak 2 Canvas Frame Ukuran 60x90cm untuk Resepsi", category: "Percetakan", completed: false, dueDate: "15 April 2027", pic: "Studio Vendor", priority: "medium" },
      { id: "p9", title: "Final Cut Video Teaser 60 Detik untuk Instagram & Undangan Digital", category: "Video", completed: false, dueDate: "25 April 2027", pic: "Video Editor", priority: "medium" },
    ],
    rundown: [
      { time: "02.30 - 04.00", activity: "Persiapan Makeup & Wardrobe Sunrise Bromo", location: "Hotel Transit Bromo", pic: "MUA & Stylist", notes: "Suhu dingin, siapkan jaket & termos hangat" },
      { time: "04.15 - 05.00", activity: "Perjalanan Menuju Spot Sunrise Penanjakan", location: "Jeep Bromo", pic: "Driver & Crew", notes: "Membawa perlengkapan lampu & drone" },
      { time: "05.15 - 07.30", activity: "Sesi Foto Golden Hour: Gaun Champagne & Jas Wool", location: "Penanjakan & Lautan Pasir", pic: "Lead Photographer", notes: "Target 12 pose variasi landscape" },
      { time: "08.00 - 09.30", activity: "Sesi Foto Adat Kasual: Kain Batik & Kemeja Tenun", location: "Savana Bukit Teletubbies", pic: "Tim Visual", notes: "Shooting video cinematic gerak santai" },
    ],
    documents: [
      { id: "pd1", name: "PDF Moodboard & Panduan Pose Pre-Wedding", type: "PDF", status: "verified", uploadedDate: "5 Desember 2026" },
      { id: "pd2", name: "Surat Izin Pemotretan Komersial / Prewed Bromo", type: "PDF", status: "verified", uploadedDate: "10 Februari 2027" },
      { id: "pd3", name: "Katalog 30 Foto Pilihan Retouching", type: "Gallery Link", status: "pending" },
    ]
  },

  midodareni: {
    id: "midodareni",
    title: "Midodareni",
    subtitle: "Malam Adat Jawa Sebelum Hari-H Pernikahan",
    category: "Adat & Keluarga Besar",
    description: "Malam sakral sebelum hari pernikahan menurut adat Jawa gagrak Surakarta/Yogyakarta. Melambangkan turunnya bidadari khayangan yang menyempurnakan paras dan aura mempelai wanita (calon penganten).",
    targetDate: "Sabtu, 15 Mei 2027 • 18.30 - 22.00 WIB (Malam H-1)",
    location: "Kediaman Mempelai Wanita (Rumah Joglo)",
    picName: "Ibu Condro & Bp. Suryo (Pranata Cara Adat)",
    picPhone: "+62 811-2345-6789",
    themeColor: "#b85e6f",
    badgeBg: "bg-[#faedf0] text-[#913b4c]",
    tasks: [
      { id: "m1", title: "Penetapan Pranata Cara / MC Adat Jawa Berpengalaman", category: "Adat", completed: true, dueDate: "1 Desember 2026", pic: "Keluarga Wanita", priority: "high" },
      { id: "m2", title: "Penyusunan Daftar Seserahan & Serah-Serahan Adat", category: "Seserahan", completed: true, dueDate: "15 Januari 2027", pic: "Keluarga Pria", priority: "high" },
      { id: "m3", title: "Pemesanan Sepasang Kembar Mayang & Daun Janur Segar", category: "Perlengkapan", completed: true, dueDate: "10 Februari 2027", pic: "Perias Adat", priority: "high" },
      { id: "m4", title: "Fitting Busana Midodareni (Beskap Ksatrian & Kebaya)", category: "Busana", completed: false, dueDate: "20 Maret 2027", pic: "Kedua Mempelai", priority: "high" },
      { id: "m5", title: "Konfirmasi Katering Menu Masakan Tradisional Jawa (Tumpeng Robyong)", category: "Katering", completed: false, dueDate: "25 Maret 2027", pic: "Tim Katering", priority: "high" },
      { id: "m6", title: "Pengaturan Kamar Pengantin Putri (Kamar Tidur Pengantin)", category: "Dekorasi", completed: false, dueDate: "10 April 2027", pic: "Dekorator Adat", priority: "medium" },
      { id: "m7", title: "Briefing Pasukan Pambagyaharja & Pembawa Seserahan", category: "Keluarga", completed: false, dueDate: "5 Mei 2027", pic: "Ketua Panitia", priority: "medium" },
      { id: "m8", title: "Prosesi Nyantri: Calon Mempelai Pria Tidak Boleh Melihat Calon Istri", category: "Ritual Adat", completed: false, dueDate: "15 Mei 2027", pic: "Pranata Cara", priority: "high" },
    ],
    rundown: [
      { time: "18.30 - 19.00", activity: "Rombongan Keluarga Calon Mempelai Pria Tiba di Kediaman", location: "Halaman Depan Joglo", pic: "Penerima Tamu Adat", notes: "Disambut alunan gending Jawa & gending Kodok Ngorek" },
      { time: "19.00 - 19.30", activity: "Pasrah & Tampik (Penyerahan Seserahan Calon Pengantin)", location: "Pendopo Utama", pic: "Juru Bicara Kedua Keluarga", notes: "Penyerahan cindur mata & buah tangan secara simbolis" },
      { time: "19.30 - 20.15", activity: "Upacara Catur Wedha & Nasehat Pernikahan Orang Tua", location: "Ruang Tengah", pic: "Ayahanda Calon Pengantin", notes: "Pemberian wejangan luhur hidup berumah tangga" },
      { time: "20.15 - 20.45", activity: "Prosesi Nyantrik & Suapan Terakhir Kasih Sayang Ibu", location: "Kamar Pengantin / Beranda", pic: "Ibunda Mempelai", notes: "Calon mempelai wanita tetap di dalam kamar (tidak keluar)" },
      { time: "20.45 - 22.00", activity: "Santap Malam Bersama Seluruh Kerabat & Ramah Tamah", location: "Area Jamuan Pendopo", pic: "Katering", notes: "Menu Nasi Liwet Solo & Tengkleng hangat" },
    ],
    documents: [
      { id: "md1", name: "Teks Panduan Rangkaian Tata Urutan Upacara Midodareni", type: "PDF", status: "verified", uploadedDate: "15 Januari 2027" },
      { id: "md2", name: "Daftar Inventaris 16 Baki Seserahan Lengkap", type: "Spreadsheet", status: "pending" },
      { id: "md3", name: "Daftar Undangan Khusus Keluarga Inti Midodareni (100 Pax)", type: "Spreadsheet", status: "verified", uploadedDate: "20 Februari 2027" },
    ]
  },

  resepsi: {
    id: "resepsi",
    title: "Resepsi Pernikahan",
    subtitle: "Puncak Perayaan, Pelayanan Tamu & Operasional Vendor",
    category: "Hari-H & Operasional",
    description: "Perhelatan akbar resepsi pernikahan malam hari di ballroom. Mengoordinasikan seluruh 14 vendor utama, melayani 450 undangan VIP/keluarga, alur prasmanan katering, serta kelancaran hiburan musik.",
    targetDate: "Minggu, 16 Mei 2027 • 19.00 - 22.00 WIB",
    location: "Grand Ballroom Hotel Mulia Senayan, Jakarta",
    picName: "Daniel & Tim Wedding Organizer (12 Crew)",
    picPhone: "+62 811-9988-7766",
    themeColor: "#9ea873",
    badgeBg: "bg-[#f3f6ea] text-[#55632f]",
    tasks: [
      { id: "r1", title: "Pelunasan Tahap DP 50% Gedung Ballroom Hotel", category: "Venue", completed: true, dueDate: "30 November 2026", pic: "Finance / Groom", priority: "high" },
      { id: "r2", title: "Finalisasi Konsep Dekorasi Panggung Pelaminan & Lighting", category: "Dekorasi", completed: true, dueDate: "15 Januari 2027", pic: "Dekorator & Bride", priority: "high" },
      { id: "r3", title: "Test Food Katering & Pemilihan Menu 800 Pax + 8 Stall", category: "Katering", completed: true, dueDate: "28 Februari 2027", pic: "Kedua Keluarga", priority: "high" },
      { id: "r4", title: "Booking Band Akustik Jazz, Sound System 10.000 Watt, & MC", category: "Entertainment", completed: true, dueDate: "15 Maret 2027", pic: "Lead WO", priority: "medium" },
      { id: "r5", title: "Finalisasi Daftar 450 Undangan & Seating Chart VIP Meja", category: "Tamu", completed: false, dueDate: "10 April 2027", pic: "Sekretariat Undangan", priority: "high" },
      { id: "r6", title: "Distribusi Undangan Fisik Hardcover & Akses QR Code Digital", category: "Undangan", completed: false, dueDate: "20 April 2027", pic: "Kurir & Sistem RSVP", priority: "high" },
      { id: "r7", title: "Briefing 14 Vendor Utama (Dekor, Katering, Foto, Sound, MUA)", category: "Vendor", completed: false, dueDate: "5 Mei 2027", pic: "Lead WO & GM Hotel", priority: "high" },
      { id: "r8", title: "Penyusunan Kotak Angpau & Tim Keamanan Khusus Kunci Kotak", category: "Keamanan", completed: false, dueDate: "10 Mei 2027", pic: "Saudara Kandung", priority: "high" },
      { id: "r9", title: "Gladi Resik Masuk Ballroom, Grand Entrance & Toast Bersama", category: "Gladi Resik", completed: false, dueDate: "16 Mei 2027 Jam 16.00", pic: "Seluruh Tim", priority: "high" },
    ],
    rundown: [
      { time: "16.00 - 17.00", activity: "Gladi Resik Grand Entrance & Pengecekan Sound/Lighting", location: "Ballroom Utama", pic: "Lead WO & Tim Teknis", notes: "Uji coba mic MC, band, dan alur panggung" },
      { time: "17.00 - 18.30", activity: "Touch-up Makeup Pengantin, Ibu, dan Bridesmaid", location: "Bridal Suite Lantai 12", pic: "MUA Team", notes: "Makan malam ringan sebelum acara dimulai" },
      { time: "18.30 - 19.00", activity: "Pintu Ballroom Dibuka, Registrasi Tamu Undangan Dimulai", location: "Foyer Meja Registrasi", pic: "Usher & Resepsionis", notes: "Scan QR code souvenir & pengisian buku tamu" },
      { time: "19.00 - 19.15", activity: "Grand Entrance Kedua Mempelai Masuk ke Pelaminan", location: "Pintu Masuk Ballroom", pic: "MC & Band", notes: "Lampu dim, spotlight mengiringi kedua mempelai" },
      { time: "19.15 - 19.45", activity: "Sambutan Perwakilan Keluarga & Doa Bersama Pernikahan", location: "Panggung Pelaminan", pic: "Wakil Keluarga", notes: "Dilanjutkan Wedding Toast & Wedding Cake Cutting" },
      { time: "19.45 - 21.30", activity: "Pemberian Ucapan Selamat, Santap Prasmanan & Live Music", location: "Pelaminan & Buffet", pic: "WO & Katering", notes: "Alur antrean foto tertib didampingi usher" },
      { time: "21.30 - 21.45", activity: "Lempar Hand Bouquet & Foto Bersama Sahabat / Bridesmaid", location: "Area Tengah Ballroom", pic: "MC & Fotografer", notes: "Momen seru bersama para sahabat" },
      { time: "21.45 - 22.00", activity: "Penutupan Acara, Pengamanan Kotak Angpau & Souvenir Sisa", location: "Ruang Panitia", pic: "Keluarga Inti & WO", notes: "Serah terima kunci kotak angpau kepada orang tua" },
    ],
    documents: [
      { id: "rd1", name: "Master Kontrak Ballroom Hotel Mulia & BEO (Banquet Event Order)", type: "PDF", status: "verified", uploadedDate: "30 November 2026" },
      { id: "rd2", name: "Layout Seating Chart 20 Meja Bundar VIP & Buffet Line", type: "PDF Blueprint", status: "verified", uploadedDate: "15 Januari 2027" },
      { id: "rd3", name: "Daftar Kontak Darurat Seluruh 14 Vendor PIC", type: "Spreadsheet", status: "verified", uploadedDate: "15 April 2027" },
      { id: "rd4", name: "Buku Panduan Teknis WO (Cue Sheet & Rundown Menit-ke-Menit)", type: "PDF Booklet", status: "pending" },
    ]
  }
};
