import type { BudgetItem } from "../data/budgetData";
import type { Guest } from "../data/supportingData";

const PAYMENT_STATUS_LABELS: Record<BudgetItem["paymentStatus"], string> = {
  lunas: "Lunas",
  dp: "DP",
  belum_bayar: "Belum Bayar",
};

const RSVP_LABELS: Record<Guest["rsvpStatus"], string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  menunggu: "Menunggu",
};

function escapeCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\n");
}

export function budgetToCsv(items: BudgetItem[]): string {
  return toCsv([
    [
      "Pos Pengeluaran",
      "Kategori",
      "Vendor / PIC",
      "Target Estimasi",
      "Telah Terbayar",
      "Status",
      "Catatan",
    ],
    ...items.map((item) => [
      item.title,
      item.category,
      item.vendorName,
      item.estimatedBudget,
      item.actualPaid,
      PAYMENT_STATUS_LABELS[item.paymentStatus],
      item.notes ?? "",
    ]),
  ]);
}

export function guestsToCsv(guests: Guest[]): string {
  return toCsv([
    [
      "Nama Tamu",
      "Kategori",
      "Jumlah Pax",
      "Meja",
      "Status RSVP",
      "Rangkaian Acara",
      "Telepon",
      "Catatan",
    ],
    ...guests.map((guest) => [
      guest.name,
      guest.category,
      guest.invitationCount,
      guest.tableNumber,
      RSVP_LABELS[guest.rsvpStatus],
      guest.attendanceEvent,
      guest.phone ?? "",
      guest.notes ?? "",
    ]),
  ]);
}
