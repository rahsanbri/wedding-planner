export interface BudgetItem {
  id: string;
  category: "Acara Utama" | "Dekorasi & Venue" | "Dokumentasi" | "Busana & MUA" | "Katering & FnB" | "Lain-lain";
  title: string;
  vendorName: string;
  estimatedBudget: number;
  actualPaid: number;
  paymentStatus: "lunas" | "dp" | "belum_bayar";
  notes?: string;
}

export const initialBudgetItems: BudgetItem[] = [
  // Acara Utama (Gereja, Midodareni, KUA/Catatan Sipil)
  {
    id: "b1",
    category: "Acara Utama",
    title: "Administrasi Kanonik & Persembahan Gereja",
    vendorName: "Sekretariat Paroki Katedral",
    estimatedBudget: 15000000,
    actualPaid: 15000000,
    paymentStatus: "lunas",
    notes: "Termasuk paduan suara & organis liturgi",
  },
  {
    id: "b2",
    category: "Acara Utama",
    title: "MC Adat & Pranata Cara Midodareni",
    vendorName: "Sanggar Suryo Budoyo",
    estimatedBudget: 8000000,
    actualPaid: 8000000,
    paymentStatus: "lunas",
    notes: "Termasuk pemain gamelan live 1 set",
  },
  {
    id: "b3",
    category: "Acara Utama",
    title: "Wedding Organizer (12 Crew All-Day)",
    vendorName: "Kencana Wedding Organizer",
    estimatedBudget: 35000000,
    actualPaid: 20000000,
    paymentStatus: "dp",
    notes: "Pelunasan sisa Rp 15 Jt saat H-3",
  },

  // Dekorasi & Venue
  {
    id: "b4",
    category: "Dekorasi & Venue",
    title: "Sewa Grand Ballroom Hotel Mulia",
    vendorName: "Hotel Mulia Senayan",
    estimatedBudget: 90000000,
    actualPaid: 90000000,
    paymentStatus: "lunas",
    notes: "Termasuk pemakaian 5 jam & 2 bridal suites",
  },
  {
    id: "b5",
    category: "Dekorasi & Venue",
    title: "Dekorasi Pelaminan & Lighting Ambience",
    vendorName: "Lotus Floral & Décor",
    estimatedBudget: 55000000,
    actualPaid: 30000000,
    paymentStatus: "dp",
    notes: "Fresh flower import warna Ivory & Champagne",
  },

  // Dokumentasi
  {
    id: "b6",
    category: "Dokumentasi",
    title: "Paket Pre-Wedding Bromo & Studio",
    vendorName: "Lensa Cerita Photography",
    estimatedBudget: 22000000,
    actualPaid: 22000000,
    paymentStatus: "lunas",
    notes: "30 foto cetak + 2 canvas 60x90cm",
  },
  {
    id: "b7",
    category: "Dokumentasi",
    title: "Dokumentasi Hari H (Foto, Video & Drone)",
    vendorName: "CinemaVows Production",
    estimatedBudget: 28000000,
    actualPaid: 15000000,
    paymentStatus: "dp",
    notes: "Same day edit video 3-5 menit",
  },

  // Katering & FnB
  {
    id: "b8",
    category: "Katering & FnB",
    title: "Buffet Utama 800 Pax + 8 Stall Pilihan",
    vendorName: "Mulia Culinary Catering",
    estimatedBudget: 65000000,
    actualPaid: 50000000,
    paymentStatus: "dp",
    notes: "Final menu lock saat test food",
  },

  // Busana & MUA
  {
    id: "b9",
    category: "Busana & MUA",
    title: "Bridal Gown, Tuxedo & MUA Hari-H",
    vendorName: "Atelier Bridal & Jessica MUA",
    estimatedBudget: 32000000,
    actualPaid: 32000000,
    paymentStatus: "lunas",
    notes: "Termasuk makeup 2 ibu & 4 bridesmaid",
  },
];
