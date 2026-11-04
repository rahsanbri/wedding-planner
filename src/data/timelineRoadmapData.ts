export interface TimelineMilestone {
  id: string;
  phaseId: "h-6m" | "h-3m" | "h-1m" | "h-1w" | "h-day";
  phaseName: string;
  timeframe: string;
  title: string;
  pillar: "Gereja" | "Pre-Wedding" | "Midodareni" | "Resepsi" | "Master";
  dateFormatted: string;
  description: string;
  location: string;
  pic: string;
  status: "completed" | "in_progress" | "upcoming";
  keyActions: string[];
}

export const timelineDatabase: TimelineMilestone[] = [
  // ===================== H - 6 BULAN (NOVEMBER - DESEMBER 2026) =====================
  {
    id: "tm1",
    phaseId: "h-6m",
    phaseName: "Fase H - 6 Bulan",
    timeframe: "November - Desember 2026",
    title: "Penetapan Tanggal 16 Mei 2027 & Pendaftaran Berkas Sakramen",
    pillar: "Gereja",
    dateFormatted: "15 November 2026",
    description: "Pendaftaran resmi sakramen pernikahan ke Sekretariat Paroki Katedral, pengumpulan surat baptis terbaru dan pendaftaran kursus perkawinan (KPP).",
    location: "Sekretariat Paroki Katedral Jakarta",
    pic: "Mempelai & Romo Paroki",
    status: "completed",
    keyActions: [
      "Mengambil formulir Kanonik di Paroki",
      "Pembaruan Surat Baptis (< 6 bulan)",
      "Pendaftaran jadwal Kursus Persiapan Perkawinan (KPP)"
    ]
  },
  {
    id: "tm2",
    phaseId: "h-6m",
    phaseName: "Fase H - 6 Bulan",
    timeframe: "November - Desember 2026",
    title: "Penyusunan Moodboard Konsep Visual & Booking Studio",
    pillar: "Pre-Wedding",
    dateFormatted: "20 November 2026",
    description: "Menentukan arah tema foto: perpaduan Editorial Fashion studio modern dan Romantis Alam Bromo saat sunrise.",
    location: "Studio Kencana Art & Konsep Outdoor",
    pic: "Bride & Lead Visual",
    status: "completed",
    keyActions: [
      "Pemilihan palet gaun (Champagne, Hitam, Kebaya)",
      "Booking fotografer & videografer utama",
      "Penentuan jadwal sewa Jeep & izin lokasi Bromo"
    ]
  },
  {
    id: "tm3",
    phaseId: "h-6m",
    phaseName: "Fase H - 6 Bulan",
    timeframe: "November - Desember 2026",
    title: "Konsultasi Pranata Cara & Sesepuh Adat Jawa",
    pillar: "Midodareni",
    dateFormatted: "25 November 2026",
    description: "Pertemuan keluarga kedua mempelai bersama juru bicara adat untuk menetapkan pakem tata urutan Midodareni Surakarta.",
    location: "Kediaman Keluarga Mempelai Wanita",
    pic: "Pranata Cara & Orang Tua",
    status: "completed",
    keyActions: [
      "Penetapan jumlah 16 baki serah-serahan",
      "Pemesanan pembuat kembar mayang & janur kuning",
      "Penyelarasan gending Jawa pengiring upacara"
    ]
  },
  {
    id: "tm4",
    phaseId: "h-6m",
    phaseName: "Fase H - 6 Bulan",
    timeframe: "November - Desember 2026",
    title: "Penguncian Kontrak Grand Ballroom Hotel Mulia",
    pillar: "Resepsi",
    dateFormatted: "30 November 2026",
    description: "Pembayaran uang muka DP 50% untuk mengunci Grand Ballroom Hotel Mulia Senayan tanggal 16 Mei 2027 beserta 2 kamar bridal suites.",
    location: "Grand Ballroom Hotel Mulia Senayan",
    pic: "Groom & Hotel Mulia Event Team",
    status: "completed",
    keyActions: [
      "Penandatanganan Master Banquet Event Order (BEO)",
      "Alokasi 800 pax menu buffet & 8 food stall",
      "Booking tanggal gladi resik panggung H-1"
    ]
  },

  // ===================== H - 3 BULAN (JANUARI - FEBRUARI 2027) =====================
  {
    id: "tm5",
    phaseId: "h-3m",
    phaseName: "Fase H - 3 Bulan",
    timeframe: "Januari - Februari 2027",
    title: "Kelulusan Kursus KPP & Penyelidikan Kanonik Resmi",
    pillar: "Gereja",
    dateFormatted: "10 Februari 2027",
    description: "Menyelesaikan kursus persiapan perkawinan 3 hari dan wawancara kanonik mendalam bersama Pastor Paroki.",
    location: "Gedung Pastoral Katedral",
    pic: "Pastor Paroki & Kedua Mempelai",
    status: "in_progress",
    keyActions: [
      "Penerimaan Sertifikat Resmi KPP",
      "Wawancara Kanonik tertutup bersama Pastor",
      "Penetapan nama 2 saksi nikah gereja"
    ]
  },
  {
    id: "tm6",
    phaseId: "h-3m",
    phaseName: "Fase H - 3 Bulan",
    timeframe: "Januari - Februari 2027",
    title: "Eksekusi Sesi Foto Bromo Sunrise & Studio Indoor",
    pillar: "Pre-Wedding",
    dateFormatted: "20 Februari 2027",
    description: "Pengambilan foto 4 set busana di lautan pasir Bromo, Bukit Teletubbies, dan sesi gaun couture studio.",
    location: "Taman Nasional Bromo & Studio Kencana",
    pic: "Tim Produksi & Fotografer",
    status: "in_progress",
    keyActions: [
      "Sesi foto golden hour Penanjakan 1 Bromo",
      "Perekaman video drone cinematic 4K",
      "Seleksi 30 foto master retouch untuk album"
    ]
  },
  {
    id: "tm7",
    phaseId: "h-3m",
    phaseName: "Fase H - 3 Bulan",
    timeframe: "Januari - Februari 2027",
    title: "Penyusunan Baki Seserahan & Busana Beskap Pengantin",
    pillar: "Midodareni",
    dateFormatted: "25 Februari 2027",
    description: "Pengemasan baki seserahan akrilik transparan berhias bunga segar dan fitting busana beskap ksatrian.",
    location: "Atelier Kebaya Adat",
    pic: "Perias Adat & Keluarga",
    status: "in_progress",
    keyActions: [
      "Fitting beskap groom, kebaya ibu, dan jarik batik",
      "Penataan buah tangan, kosmetik, & perhiasan seserahan",
      "Konfirmasi katering menu khas Nasi Liwet Solo"
    ]
  },
  {
    id: "tm8",
    phaseId: "h-3m",
    phaseName: "Fase H - 3 Bulan",
    timeframe: "Januari - Februari 2027",
    title: "Test Food Katering & Finalisasi 14 Rekanan Vendor",
    pillar: "Resepsi",
    dateFormatted: "28 Februari 2027",
    description: "Sesi uji coba rasa 12 jenis menu hidangan bersama orang tua serta finalisasi kontrak dekorasi pelaminan.",
    location: "Hotel Mulia Senayan",
    pic: "Kedua Keluarga & Lead WO",
    status: "in_progress",
    keyActions: [
      "Persetujuan menu Signature Salmon Wellington & Zuppa",
      "Approval layout 3D panggung dekorasi Lotus Décor",
      "Booking band akustik jazz 6-piece & sound system"
    ]
  },

  // ===================== H - 1 BULAN (APRIL 2027) =====================
  {
    id: "tm9",
    phaseId: "h-1m",
    phaseName: "Fase H - 1 Bulan",
    timeframe: "April 2027",
    title: "Pengumuman Misa Perkawinan & Cetak Buku Liturgi",
    pillar: "Gereja",
    dateFormatted: "15 April 2027",
    description: "Pengumuman janji nikah dibacakan dalam 3 kali Misa Minggu berurutan dan pencetakan buku panduan misa.",
    location: "Gereja Katedral Jakarta",
    pic: "Sekretariat Paroki & Tim Liturgi",
    status: "upcoming",
    keyActions: [
      "Pengumuman Misa Minggu ke-1, 2, dan 3",
      "Pencetakan 200 buku panduan Misa berbalut foil emas",
      "Latihan paduan suara gabungan lagu Sanctus & Ave Maria"
    ]
  },
  {
    id: "tm10",
    phaseId: "h-1m",
    phaseName: "Fase H - 1 Bulan",
    timeframe: "April 2027",
    title: "Cetak 2 Kanvas Galeri 60x90cm & Teaser Instagram",
    pillar: "Pre-Wedding",
    dateFormatted: "20 April 2027",
    description: "Pencetakan kanvas tekstur museum-grade berbingkai floating frame champagne dan perilisan video undangan digital.",
    location: "Percetakan Seni Visual",
    pic: "Vendor Foto & Bride",
    status: "upcoming",
    keyActions: [
      "Inspeksi kualitas cetak kanvas display",
      "Final cut video cinematic teaser 60 detik",
      "Penyusunan album kolase hardcover 20 halaman"
    ]
  },
  {
    id: "tm11",
    phaseId: "h-1m",
    phaseName: "Fase H - 1 Bulan",
    timeframe: "April 2027",
    title: "Dekorasi Kamar Pengantin Putri & Gladi Pranata Adat",
    pillar: "Midodareni",
    dateFormatted: "25 April 2027",
    description: "Penataan kamar pengantin wanita dengan kain serba putih dan gladi kotor prosesi pasrah tinampi seserahan.",
    location: "Kediaman Mempelai Wanita",
    pic: "Pranata Adat & Ibunda",
    status: "upcoming",
    keyActions: [
      "Dekorasi tempat tidur calon pengantin putri",
      "Penetapan pembawa baki kembar mayang perjaka/perawan",
      "Simulasi nasehat Catur Wedha orang tua"
    ]
  },
  {
    id: "tm12",
    phaseId: "h-1m",
    phaseName: "Fase H - 1 Bulan",
    timeframe: "April 2027",
    title: "Distribusi 450 Undangan Fisik & Seating Chart VIP Meja",
    pillar: "Resepsi",
    dateFormatted: "28 April 2027",
    description: "Pengiriman undangan fisik hardcover beludru dan pembagian nomor meja bundar 20 VIP.",
    location: "Sekretariat Undangan",
    pic: "Kurir Khusus & Sistem RSVP",
    status: "upcoming",
    keyActions: [
      "Penyebaran undangan VIP VIP-01 s/d VIP-04",
      "Aktivasi QR Code RSVP digital untuk konfirmasi hadir",
      "Pemetaan nomor meja keluarga besar dan kolega kantor"
    ]
  },

  // ===================== H - 1 MINGGU (MEI 2027) =====================
  {
    id: "tm13",
    phaseId: "h-1w",
    phaseName: "Fase H - 1 Minggu",
    timeframe: "9 - 14 Mei 2027",
    title: "Pemberian Sakramen Tobat & Gladi Bersih Liturgi",
    pillar: "Gereja",
    dateFormatted: "13 Mei 2027",
    description: "Mempersiapkan batin kedua mempelai melalui sakramen tobat dan latihan prosesi jalan menuju altar suci.",
    location: "Altar Katedral Jakarta",
    pic: "Pastor & Tim Liturgi Katedral",
    status: "upcoming",
    keyActions: [
      "Sakramen Tobat / Rekonsiliasi kedua mempelai",
      "Gladi resik tata gerak sungkeman dan tukar cincin",
      "Briefing organis, lektor, dan penyanyi paduan suara"
    ]
  },
  {
    id: "tm14",
    phaseId: "h-1w",
    phaseName: "Fase H - 1 Minggu",
    timeframe: "9 - 14 Mei 2027",
    title: "Pengantaran Kanvas Display & Pengecekan Foto Galeri",
    pillar: "Pre-Wedding",
    dateFormatted: "14 Mei 2027",
    description: "Seluruh frame kanvas display dan album cetak diserahterimakan ke tim Wedding Organizer untuk display ballroom.",
    location: "Hotel Mulia Senayan",
    pic: "Crew WO & Studio Foto",
    status: "upcoming",
    keyActions: [
      "Pemeriksaan easel kayu penyangga kanvas",
      "Pengecekan album display meja penerima tamu",
      "Pemberian file video resolusi tinggi ke tim videotron"
    ]
  },
  {
    id: "tm15",
    phaseId: "h-1w",
    phaseName: "Fase H - 1 Minggu",
    timeframe: "9 - 14 Mei 2027",
    title: "Pemasangan Janur Kuning, Tarub & Kembar Mayang",
    pillar: "Midodareni",
    dateFormatted: "15 Mei 2027 (Pagi)",
    description: "Pemasangan hiasan janur kuning di pintu gerbang rumah mempelai wanita dan perakitan kembar mayang segar.",
    location: "Kediaman Mempelai Wanita",
    pic: "Tim Adat Jawa & Petugas Janur",
    status: "upcoming",
    keyActions: [
      "Pemasangan bleketepe dan tuwuhan pisang raja",
      "Peracikan air siraman bunga setaman tujuh rupa",
      "Penerimaan pasokan tumpeng robyong & sesaji"
    ]
  },
  {
    id: "tm16",
    phaseId: "h-1w",
    phaseName: "Fase H - 1 Minggu",
    timeframe: "9 - 14 Mei 2027",
    title: "Briefing Akbar 14 Vendor & Final Check Katering",
    pillar: "Resepsi",
    dateFormatted: "12 Mei 2027",
    description: "Pertemuan teknis seluruh pimpinan vendor dipimpin Lead WO untuk mematangkan cue-sheet menit-ke-menit.",
    location: "Meeting Room Hotel Mulia",
    pic: "Lead WO & GM Banquet Hotel Mulia",
    status: "upcoming",
    keyActions: [
      "Pembagian handy-talkie (HT) kanal komunikasi darurat",
      "Pengecekan loading dock barang dekor & sound system",
      "Konfirmasi final 422 tamu hadir RSVP"
    ]
  },

  // ===================== HARI - H (15 - 16 MEI 2027) =====================
  {
    id: "tm17",
    phaseId: "h-day",
    phaseName: "Hari - H Eksekusi Sakral",
    timeframe: "15 - 16 Mei 2027",
    title: "Malam Midodareni: Upacara Catur Wedha & Nyantri",
    pillar: "Midodareni",
    dateFormatted: "Sabtu, 15 Mei 2027 • 18.30 WIB",
    description: "Malam turunnya wahyu bidadari: keluarga pria menyerahkan 16 baki seserahan, wejangan orang tua, dan santap malam bersama.",
    location: "Kediaman Mempelai Wanita",
    pic: "Pranata Cara & Seluruh Keluarga",
    status: "upcoming",
    keyActions: [
      "18.30: Pasrah Tinampi baki seserahan adat",
      "19.30: Nasehat suci Catur Wedha dari ayahanda",
      "20.30: Santap hidangan tradisional & suapan kasih ibu"
    ]
  },
  {
    id: "tm18",
    phaseId: "h-day",
    phaseName: "Hari - H Eksekusi Sakral",
    timeframe: "15 - 16 Mei 2027",
    title: "Pemberkatan Pernikahan Suci di Katedral",
    pillar: "Gereja",
    dateFormatted: "Minggu, 16 Mei 2027 • 09.00 WIB",
    description: "Misa pernikahan ekaristi kudus, pengucapan janji setia di depan altar Tuhan, tukar cincin, dan penandatanganan akta sipil.",
    location: "Altar Utama Gereja Katedral Jakarta",
    pic: "Pastor Paroki & Petugas Catatan Sipil",
    status: "upcoming",
    keyActions: [
      "08.55: Barisan prosesi masuk pintu utama gereja",
      "09.30: Pengucapan janji suci pernikahan seumur hidup",
      "10.30: Penandatanganan berkas gereja & akta sipil resmi"
    ]
  },
  {
    id: "tm19",
    phaseId: "h-day",
    phaseName: "Hari - H Eksekusi Sakral",
    timeframe: "15 - 16 Mei 2027",
    title: "Pameran Galeri Pre-Wedding di Foyer Ballroom",
    pillar: "Pre-Wedding",
    dateFormatted: "Minggu, 16 Mei 2027 • 18.00 WIB",
    description: "Display kanvas 60x90cm berhias karangan bunga mawar putih dan pemutaran video cinematic sunrise Bromo di layar foyer.",
    location: "Foyer Grand Ballroom Hotel Mulia",
    pic: "Tim Fotografi & Resepsionis",
    status: "upcoming",
    keyActions: [
      "18.00: Pemasangan spotlight kanvas display",
      "18.30: Penayangan video cinematic teaser di LED screen",
      "19.00: Dokumentasi photobooth para tamu undangan"
    ]
  },
  {
    id: "tm20",
    phaseId: "h-day",
    phaseName: "Hari - H Eksekusi Sakral",
    timeframe: "15 - 16 Mei 2027",
    title: "Grand Reception: Puncak Pesta Pernikahan Ballroom",
    pillar: "Resepsi",
    dateFormatted: "Minggu, 16 Mei 2027 • 19.00 WIB",
    description: "Grand entrance kedua mempelai, pemotongan wedding cake, wedding toast kristal, santap malam 800 pax, dan live jazz band.",
    location: "Grand Ballroom Hotel Mulia Senayan",
    pic: "Lead WO, MC, & Seluruh Vendor",
    status: "upcoming",
    keyActions: [
      "16.00: Gladi resik alur panggung & uji lighting",
      "19.00: Grand entrance kedua mempelai diiringi orkestra",
      "19.30: Wedding toast, santap prasmanan & ramah tamah"
    ]
  }
];
