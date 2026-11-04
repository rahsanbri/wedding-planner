export interface Guest {
  id: string;
  name: string;
  category: "VIP" | "Keluarga Inti" | "Sahabat & Teman" | "Rekan Kerja";
  invitationCount: number; // pax
  tableNumber: string;
  rsvpStatus: "hadir" | "tidak_hadir" | "menunggu";
  attendanceEvent: "Semua Acara" | "Hanya Gereja" | "Hanya Resepsi" | "Midodareni";
  phone?: string;
  notes?: string;
}

export const initialGuestList: Guest[] = [
  { id: "g1", name: "Bp. Jenderal (Purn) Wiryanto & Ibu", category: "VIP", invitationCount: 2, tableNumber: "VIP-01", rsvpStatus: "hadir", attendanceEvent: "Semua Acara", phone: "+62 811-0001-2345", notes: "Duduk bersama keluarga mempelai pria" },
  { id: "g2", name: "Prof. Dr. Hendra Sujono & Partner", category: "VIP", invitationCount: 2, tableNumber: "VIP-02", rsvpStatus: "hadir", attendanceEvent: "Semua Acara", phone: "+62 812-3344-5566", notes: "Saksi nikah gereja" },
  { id: "g3", name: "Keluarga Besar Eyang Sasongko (Solo)", category: "Keluarga Inti", invitationCount: 8, tableNumber: "Fam-01", rsvpStatus: "hadir", attendanceEvent: "Semua Acara", phone: "+62 813-1122-3344", notes: "Akomodasi di Hotel Mulia" },
  { id: "g4", name: "Keluarga Bp. Bambang Hermanto", category: "Keluarga Inti", invitationCount: 4, tableNumber: "Fam-02", rsvpStatus: "hadir", attendanceEvent: "Semua Acara", phone: "+62 815-5566-7788", notes: "PIC seserahan midodareni" },
  { id: "g5", name: "Dimas Anggara & Istri", category: "Sahabat & Teman", invitationCount: 2, tableNumber: "Table-05", rsvpStatus: "hadir", attendanceEvent: "Hanya Resepsi", phone: "+62 817-9988-7711", notes: "Groomsmen" },
  { id: "g6", name: "Clarissa Putri & Partner", category: "Sahabat & Teman", invitationCount: 2, tableNumber: "Table-06", rsvpStatus: "hadir", attendanceEvent: "Hanya Resepsi", phone: "+62 818-8877-6655", notes: "Bridesmaid" },
  { id: "g7", name: "Tim Direksi PT Mega Kencana Perkasa", category: "Rekan Kerja", invitationCount: 6, tableNumber: "Table-08", rsvpStatus: "hadir", attendanceEvent: "Hanya Resepsi", phone: "+62 812-4455-6677", notes: "Rekan kantor pengantin" },
  { id: "g8", name: "Dra. Hj. Ratna Juwita (Surabaya)", category: "VIP", invitationCount: 2, tableNumber: "VIP-03", rsvpStatus: "tidak_hadir", attendanceEvent: "Hanya Resepsi", phone: "+62 813-7788-9900", notes: "Berhalangan dinas luar kota" },
  { id: "g9", name: "Alumni SMA Kolese Gonzaga Angkatan '16", category: "Sahabat & Teman", invitationCount: 10, tableNumber: "Table-12", rsvpStatus: "menunggu", attendanceEvent: "Hanya Resepsi", notes: "Konfirmasi akhir saat H-14" },
];

export interface Vendor {
  id: string;
  name: string;
  category: "Venue" | "Dekorasi" | "Katering" | "Dokumentasi" | "Busana & MUA" | "Entertainment & Music" | "Wedding Organizer";
  contactPerson: string;
  phone: string;
  email: string;
  contractStatus: "signed" | "review" | "draft";
  paymentProgress: number; // percent
  totalContract: number;
}

export const initialVendorList: Vendor[] = [
  { id: "v1", name: "Hotel Mulia Senayan", category: "Venue", contactPerson: "Ms. Linda (Senior Event Specialist)", phone: "+62 811-1234-5678", email: "events@hotelmulia.com", contractStatus: "signed", paymentProgress: 100, totalContract: 90000000 },
  { id: "v2", name: "Lotus Floral & Décor Concept", category: "Dekorasi", contactPerson: "Bp. Indra (Creative Director)", phone: "+62 812-9876-5432", email: "lotusdecor@gmail.com", contractStatus: "signed", paymentProgress: 55, totalContract: 55000000 },
  { id: "v3", name: "Mulia Culinary Catering", category: "Katering", contactPerson: "Chef Adrian", phone: "+62 813-5566-7788", email: "banquet@hotelmulia.com", contractStatus: "signed", paymentProgress: 75, totalContract: 65000000 },
  { id: "v4", name: "CinemaVows Production & Photography", category: "Dokumentasi", contactPerson: "Arya Wirawan", phone: "+62 817-2233-4455", email: "contact@cinemavows.com", contractStatus: "signed", paymentProgress: 60, totalContract: 50000000 },
  { id: "v5", name: "Atelier Bridal Couture", category: "Busana & MUA", contactPerson: "Jessica Tan", phone: "+62 819-3344-5566", email: "atelier@bridalcouture.com", contractStatus: "signed", paymentProgress: 100, totalContract: 32000000 },
  { id: "v6", name: "The Velvet Jazz Harmony", category: "Entertainment & Music", contactPerson: "David (Band Leader)", phone: "+62 812-6677-8899", email: "velvetjazz@gmail.com", contractStatus: "signed", paymentProgress: 50, totalContract: 18000000 },
  { id: "v7", name: "Kencana Wedding Organizer (12 Crew)", category: "Wedding Organizer", contactPerson: "Daniel Pratama", phone: "+62 811-9988-7766", email: "kencana.wo@gmail.com", contractStatus: "signed", paymentProgress: 60, totalContract: 35000000 },
];
