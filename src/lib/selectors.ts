import type { WeddingTask } from "../data/weddingEvents";
import type { BudgetItem } from "../data/budgetData";
import type { Guest } from "../data/supportingData";
import type { MasterChecklistItem } from "../data/checklistAndMoodboardData";

export interface BudgetSummary {
  totalEstimated: number;
  totalPaid: number;
  remaining: number;
  percentPaid: number;
}

export interface GuestSummary {
  totalEntries: number;
  totalInvitations: number;
  confirmed: number;
  declined: number;
  pending: number;
  percentConfirmed: number;
}

export interface ChecklistSummary {
  total: number;
  completed: number;
  percent: number;
}

export interface CategoryBreakdownItem {
  category: BudgetItem["category"];
  estimated: number;
  paid: number;
}

export interface BudgetStatusBreakdownItem {
  status: BudgetItem["paymentStatus"];
  count: number;
  estimated: number;
  paid: number;
}

export interface GuestCategoryBreakdownItem {
  category: Guest["category"];
  entries: number;
  pax: number;
  confirmed: number;
}

export function eventProgress(tasks: WeddingTask[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((task) => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function budgetSummary(items: BudgetItem[]): BudgetSummary {
  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedBudget, 0);
  const totalPaid = items.reduce((sum, item) => sum + item.actualPaid, 0);

  return {
    totalEstimated,
    totalPaid,
    remaining: totalEstimated - totalPaid,
    percentPaid: totalEstimated > 0 ? Math.round((totalPaid / totalEstimated) * 100) : 0,
  };
}

export function guestSummary(guests: Guest[]): GuestSummary {
  const totalInvitations = guests.reduce((sum, guest) => sum + guest.invitationCount, 0);
  const confirmed = guests
    .filter((guest) => guest.rsvpStatus === "hadir")
    .reduce((sum, guest) => sum + guest.invitationCount, 0);
  const declined = guests
    .filter((guest) => guest.rsvpStatus === "tidak_hadir")
    .reduce((sum, guest) => sum + guest.invitationCount, 0);
  const pending = guests
    .filter((guest) => guest.rsvpStatus === "menunggu")
    .reduce((sum, guest) => sum + guest.invitationCount, 0);

  return {
    totalEntries: guests.length,
    totalInvitations,
    confirmed,
    declined,
    pending,
    percentConfirmed:
      totalInvitations > 0 ? Math.round((confirmed / totalInvitations) * 100) : 0,
  };
}

export function checklistSummary(items: MasterChecklistItem[]): ChecklistSummary {
  const completed = items.filter((item) => item.completed).length;
  return {
    total: items.length,
    completed,
    percent: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
  };
}

export function countdownDays(target: string | Date, now: Date): number {
  const targetTime = new Date(target).getTime();
  const difference = targetTime - now.getTime();
  return Math.max(0, Math.ceil(difference / 86_400_000));
}

export function categoryBreakdown(items: BudgetItem[]): CategoryBreakdownItem[] {
  const totals = new Map<BudgetItem["category"], CategoryBreakdownItem>();

  for (const item of items) {
    const current = totals.get(item.category) ?? {
      category: item.category,
      estimated: 0,
      paid: 0,
    };
    current.estimated += item.estimatedBudget;
    current.paid += item.actualPaid;
    totals.set(item.category, current);
  }

  return [...totals.values()].sort((a, b) => b.estimated - a.estimated);
}

function groupThousands(value: number): string {
  const sign = value < 0 ? "-" : "";
  const grouped = Math.round(Math.abs(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${grouped}`;
}

export function formatRupiah(value: number): string {
  return `Rp ${groupThousands(value)}`;
}

export function formatCompactRupiah(value: number): string {
  const format = (amount: number) =>
    (Math.round(amount * 10) / 10).toString().replace(".", ",");

  if (Math.abs(value) >= 1_000_000_000) return `Rp ${format(value / 1_000_000_000)} M`;
  if (Math.abs(value) >= 1_000_000) return `Rp ${format(value / 1_000_000)} jt`;
  if (Math.abs(value) >= 1_000) return `Rp ${format(value / 1_000)} rb`;
  return `Rp ${format(value)}`;
}

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatWeddingDate(isoDate: string): string {
  const [year, month, day] = isoDate
    .slice(0, 10)
    .split("-")
    .map((part) => Number(part));

  if (!year || !month || !day || !INDONESIAN_MONTHS[month - 1]) {
    return isoDate;
  }

  return `${day} ${INDONESIAN_MONTHS[month - 1]} ${year}`;
}

export function budgetStatusBreakdown(
  items: BudgetItem[],
): BudgetStatusBreakdownItem[] {
  const totals: Record<BudgetItem["paymentStatus"], BudgetStatusBreakdownItem> = {
    lunas: { status: "lunas", count: 0, estimated: 0, paid: 0 },
    dp: { status: "dp", count: 0, estimated: 0, paid: 0 },
    belum_bayar: { status: "belum_bayar", count: 0, estimated: 0, paid: 0 },
  };

  for (const item of items) {
    const total = totals[item.paymentStatus];
    total.count += 1;
    total.estimated += item.estimatedBudget;
    total.paid += item.actualPaid;
  }

  return [totals.lunas, totals.dp, totals.belum_bayar];
}

export function guestCategoryBreakdown(
  guests: Guest[],
): GuestCategoryBreakdownItem[] {
  const totals: Record<Guest["category"], GuestCategoryBreakdownItem> = {
    VIP: { category: "VIP", entries: 0, pax: 0, confirmed: 0 },
    "Keluarga Inti": {
      category: "Keluarga Inti",
      entries: 0,
      pax: 0,
      confirmed: 0,
    },
    "Sahabat & Teman": {
      category: "Sahabat & Teman",
      entries: 0,
      pax: 0,
      confirmed: 0,
    },
    "Rekan Kerja": { category: "Rekan Kerja", entries: 0, pax: 0, confirmed: 0 },
  };

  for (const guest of guests) {
    const total = totals[guest.category];
    total.entries += 1;
    total.pax += guest.invitationCount;
    if (guest.rsvpStatus === "hadir") {
      total.confirmed += guest.invitationCount;
    }
  }

  return [
    totals.VIP,
    totals["Keluarga Inti"],
    totals["Sahabat & Teman"],
    totals["Rekan Kerja"],
  ];
}

export function groupChecklistByPhase(
  items: MasterChecklistItem[],
): Record<MasterChecklistItem["phase"], MasterChecklistItem[]> {
  const grouped: Record<
    MasterChecklistItem["phase"],
    MasterChecklistItem[]
  > = {
    "H-180 s/d H-120": [],
    "H-90 s/d H-60": [],
    "H-30 s/d H-14": [],
    "H-7 s/d Hari-H": [],
  };

  for (const item of items) {
    grouped[item.phase].push(item);
  }

  return grouped;
}
