export interface MasterChecklistItem {
  id: string;
  title: string;
  phase: "H-180 s/d H-120" | "H-90 s/d H-60" | "H-30 s/d H-14" | "H-7 s/d Hari-H";
  pillar: "Gereja" | "Pre-Wedding" | "Midodareni" | "Resepsi" | "Umum / Finansial";
  pic: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
}

export const initialMasterChecklist: MasterChecklistItem[] = [
  // Fase 1: H-180 s/d H-120 (Fondasi Awal)
  { id: "mc1", title: "Menentukan tanggal pernikahan & booking Gereja Katedral", phase: "H-180 s/d H-120", pillar: "Gereja", pic: "Kedua Mempelai", completed: true, priority: "high", dueDate: "Mei 2026" },
  { id: "mc2", title: "Booking Grand Ballroom Hotel Mulia Senayan (DP 30%)", phase: "H-180 s/d H-120", pillar: "Resepsi", pic: "Groom / Finance", completed: true, priority: "high", dueDate: "Juni 2026" },
  { id: "mc3", title: "Menyusun estimasi anggaran total (Rp 350 Juta) & pos biaya", phase: "H-180 s/d H-120", pillar: "Umum / Finansial", pic: "Lead Planner", completed: true, priority: "high", dueDate: "Juni 2026" },
  { id: "mc4", title: "Booking Vendor Fotografer Prewed & Tim Dokumentasi", phase: "H-180 s/d H-120", pillar: "Pre-Wedding", pic: "Bride", completed: true, priority: "medium", dueDate: "Juli 2026" },
  { id: "mc5", title: "Pendaftaran Berkas Kanonik & KPP (Kursus Persiapan Perkawinan)", phase: "H-180 s/d H-120", pillar: "Gereja", pic: "Kedua Mempelai", completed: true, priority: "high", dueDate: "Juli 2026" },

  // Fase 2: H-90 s/d H-60 (Konsep & Rekanan)
  { id: "mc6", title: "Eksekusi sesi foto Pre-Wedding outdoor di Bromo & studio", phase: "H-90 s/d H-60", pillar: "Pre-Wedding", pic: "Tim Visual", completed: true, priority: "high", dueDate: "Agustus 2026" },
  { id: "mc7", title: "Test Food katering ballroom & finalisasi 8 stall pilihan", phase: "H-90 s/d H-60", pillar: "Resepsi", pic: "Keluarga Inti", completed: true, priority: "high", dueDate: "Agustus 2026" },
  { id: "mc8", title: "Fitting busana adat Jawa (Beskap & Kebaya) untuk Midodareni", phase: "H-90 s/d H-60", pillar: "Midodareni", pic: "Perias Adat", completed: true, priority: "high", dueDate: "September 2026" },
  { id: "mc9", title: "Penyusunan 16 baki seserahan adat & mahar pernikahan", phase: "H-90 s/d H-60", pillar: "Midodareni", pic: "Keluarga Pria", completed: true, priority: "medium", dueDate: "September 2026" },
  { id: "mc10", title: "Desain undangan cetak hardcover & website undangan digital", phase: "H-90 s/d H-60", pillar: "Resepsi", pic: "Vendor Grafis", completed: false, priority: "high", dueDate: "Akhir September 2026" },

  // Fase 3: H-30 s/d H-14 (Detailing & Distribusi)
  { id: "mc11", title: "Distribusi 450 undangan fisik & broadcast link RSVP digital", phase: "H-30 s/d H-14", pillar: "Resepsi", pic: "Sekretariat", completed: false, priority: "high", dueDate: "1 Oktober 2026" },
  { id: "mc12", title: "Finalisasi cetak buku liturgi gereja & briefing paduan suara", phase: "H-30 s/d H-14", pillar: "Gereja", pic: "Koordinator Liturgi", completed: false, priority: "high", dueDate: "5 Oktober 2026" },
  { id: "mc13", title: "Cetak 2 kanvas galeri 60x90cm untuk foyer ballroom", phase: "H-30 s/d H-14", pillar: "Pre-Wedding", pic: "Vendor Foto", completed: false, priority: "medium", dueDate: "10 Oktober 2026" },
  { id: "mc14", title: "Briefing gabungan 14 vendor utama bersama Hotel & WO", phase: "H-30 s/d H-14", pillar: "Resepsi", pic: "Lead WO", completed: false, priority: "high", dueDate: "15 Oktober 2026" },

  // Fase 4: H-7 s/d Hari-H (Eksekusi Akhir)
  { id: "mc15", title: "Pengambilan cincin nikah dari safebox & pengecekan sertifikat", phase: "H-7 s/d Hari-H", pillar: "Gereja", pic: "Best Man / Groom", completed: false, priority: "high", dueDate: "20 Oktober 2026" },
  { id: "mc16", title: "Pemasangan kembar mayang & sesaji di kediaman mempelai wanita", phase: "H-7 s/d Hari-H", pillar: "Midodareni", pic: "Pranata Adat", completed: false, priority: "high", dueDate: "23 Oktober Pagi" },
  { id: "mc17", title: "Pelaksanaan upacara sakral Midodareni (Malam H-1)", phase: "H-7 s/d Hari-H", pillar: "Midodareni", pic: "Seluruh Keluarga", completed: false, priority: "high", dueDate: "23 Oktober Malam" },
  { id: "mc18", title: "Gladi resik grand entrance ballroom & uji sound/lighting", phase: "H-7 s/d Hari-H", pillar: "Resepsi", pic: "Lead WO", completed: false, priority: "high", dueDate: "24 Oktober 16.00" },
  { id: "mc19", title: "Serah terima kotak angpau & souvenir sisa kepada orang tua", phase: "H-7 s/d Hari-H", pillar: "Resepsi", pic: "Keamanan Keluarga", completed: false, priority: "high", dueDate: "24 Oktober 22.00" },
];

export interface MoodboardTheme {
  id: string;
  name: string;
  tagline: string;
  paletteColors: { hex: string; name: string }[];
  accentNotes: string;
  floralConcept: string;
  lightingVibe: string;
}

export const initialMoodboardThemes: MoodboardTheme[] = [
  {
    id: "mb1",
    name: "Classic Ivory & Champagne Royalty",
    tagline: "Palet utama ballroom resepsi bertema anggun, hangat, dan timeless",
    paletteColors: [
      { hex: "#faf7f2", name: "Warm Ivory" },
      { hex: "#e5c378", name: "Champagne Gold" },
      { hex: "#c98858", name: "Warm Amber" },
      { hex: "#3a281c", name: "Obsidian Earth" },
      { hex: "#f3e7dc", name: "Cream Silk" },
    ],
    accentNotes: "Kain drape sutra krem champagne, aksen gold leaf pada chandelier kristal, dan lilin pilar hangat.",
    floralConcept: "Mawar putih impor Avalanche, Baby's Breath mekar, Calla Lily, dan sentuhan daun Eucalyptus hijau sage lembut.",
    lightingVibe: "Warm ambient 2700K dengan spotlight pelaminan presisi dan fairy lights berkilau di langit-langit foyer."
  },
  {
    id: "mb2",
    name: "Javanese Heritage Joglo Romance",
    tagline: "Nuansa sakral adat Midodareni Jawa klasik yang agung dan sakral",
    paletteColors: [
      { hex: "#8c5530", name: "Kayu Jati Cokelat" },
      { hex: "#c98858", name: "Kuning Kunir" },
      { hex: "#5b8758", name: "Janur Segar" },
      { hex: "#fcf8f2", name: "Bunga Melati Putih" },
    ],
    accentNotes: "Ornamen gebyok kayu jati ukir Jepara, kain batik motif Sidomukti & Truntum, serta aroma semerbak sedap malam.",
    floralConcept: "Untaian roncean bunga melati pasar segar, daun kelapa gading kembar mayang, dan bunga sedap malam semerbak.",
    lightingVibe: "Penerangan lentera tembaga hangat temaram yang membangkitkan keintiman malam midodareni."
  },
  {
    id: "mb3",
    name: "Sacred Cathedral Serenity",
    tagline: "Kemurnian sakramen pernikahan suci di altar katedral yang khidmat",
    paletteColors: [
      { hex: "#ffffff", name: "Pure Altar White" },
      { hex: "#d4af37", name: "Sacred Gold" },
      { hex: "#558252", name: "Olive Palm" },
      { hex: "#7a6452", name: "Cathedral Stone" },
    ],
    accentNotes: "Pilar batu katedral berbalut garland mawar putih, karpet merah suci menuju altar, dan ornamen salib emas.",
    floralConcept: "Standing flower mawar putih Belanda, anggrek bulan putih (Phalaenopsis), dan dedaunan zaitun lambang damai.",
    lightingVibe: "Cahaya alami menembus stained glass katedral dipadu lilin altar persembahan suci."
  }
];
