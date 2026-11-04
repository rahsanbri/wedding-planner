import { describe, expect, it } from "vitest";
import type { WeddingTask } from "../data/weddingEvents";
import type { BudgetItem } from "../data/budgetData";
import type { Guest } from "../data/supportingData";
import type { MasterChecklistItem } from "../data/checklistAndMoodboardData";
import {
  budgetStatusBreakdown,
  budgetSummary,
  categoryBreakdown,
  checklistSummary,
  countdownDays,
  eventProgress,
  formatCompactRupiah,
  formatRupiah,
  formatWeddingDate,
  groupChecklistByPhase,
  guestCategoryBreakdown,
  guestSummary,
} from "./selectors";

const task = (completed: boolean): WeddingTask => ({
  id: "t",
  title: "Task",
  category: "Administrasi",
  completed,
  dueDate: "2026",
  pic: "PIC",
  priority: "medium",
});

const budgetItem = (
  category: BudgetItem["category"],
  estimatedBudget: number,
  actualPaid: number,
  paymentStatus: BudgetItem["paymentStatus"] = "dp",
): BudgetItem => ({
  id: "b",
  category,
  title: "Item",
  vendorName: "Vendor",
  estimatedBudget,
  actualPaid,
  paymentStatus,
});

const guest = (
  invitationCount: number,
  rsvpStatus: Guest["rsvpStatus"],
  category: Guest["category"] = "VIP",
): Guest => ({
  id: "g",
  name: "Guest",
  category,
  invitationCount,
  tableNumber: "VIP-01",
  rsvpStatus,
  attendanceEvent: "Semua Acara",
});

const checklistItem = (
  completed: boolean,
  phase: MasterChecklistItem["phase"] = "H-90 s/d H-60",
): MasterChecklistItem => ({
  id: "c",
  title: "Checklist",
  phase,
  pillar: "Resepsi",
  pic: "PIC",
  completed,
  priority: "high",
  dueDate: "2026",
});

describe("eventProgress", () => {
  it("returns 0 for an empty task list", () => {
    expect(eventProgress([])).toBe(0);
  });

  it("rounds completed tasks into a percentage", () => {
    expect(eventProgress([task(true), task(true), task(true), task(false)])).toBe(75);
  });

  it("returns 100 when every task is complete", () => {
    expect(eventProgress([task(true), task(true)])).toBe(100);
  });
});

describe("budgetSummary", () => {
  it("returns zeroed totals for an empty list", () => {
    expect(budgetSummary([])).toEqual({
      totalEstimated: 0,
      totalPaid: 0,
      remaining: 0,
      percentPaid: 0,
    });
  });

  it("sums estimates and payments and rounds the paid percentage", () => {
    const items = [
      budgetItem("Acara Utama", 15_000_000, 15_000_000),
      budgetItem("Dekorasi & Venue", 90_000_000, 30_000_000),
    ];

    expect(budgetSummary(items)).toEqual({
      totalEstimated: 105_000_000,
      totalPaid: 45_000_000,
      remaining: 60_000_000,
      percentPaid: 43,
    });
  });
});

describe("guestSummary", () => {
  it("returns zeroed totals for an empty list", () => {
    expect(guestSummary([])).toEqual({
      totalEntries: 0,
      totalInvitations: 0,
      confirmed: 0,
      declined: 0,
      pending: 0,
      percentConfirmed: 0,
    });
  });

  it("counts pax by RSVP status", () => {
    const guests = [
      guest(2, "hadir"),
      guest(4, "hadir"),
      guest(2, "tidak_hadir"),
      guest(3, "menunggu"),
    ];

    expect(guestSummary(guests)).toEqual({
      totalEntries: 4,
      totalInvitations: 11,
      confirmed: 6,
      declined: 2,
      pending: 3,
      percentConfirmed: 55,
    });
  });
});

describe("checklistSummary", () => {
  it("returns zeroed totals for an empty list", () => {
    expect(checklistSummary([])).toEqual({
      total: 0,
      completed: 0,
      percent: 0,
    });
  });

  it("counts completed checklist items", () => {
    expect(
      checklistSummary([checklistItem(true), checklistItem(false), checklistItem(true)]),
    ).toEqual({ total: 3, completed: 2, percent: 67 });
  });
});

describe("countdownDays", () => {
  it("counts calendar days from now to the wedding date", () => {
    expect(
      countdownDays(
        "2027-05-16T00:00:00+07:00",
        new Date("2026-11-02T00:00:00+07:00"),
      ),
    ).toBe(195);
  });

  it("clamps a past wedding date to zero", () => {
    expect(
      countdownDays(
        "2027-05-16T00:00:00+07:00",
        new Date("2027-06-01T00:00:00+07:00"),
      ),
    ).toBe(0);
  });

  it("returns zero on the wedding day", () => {
    expect(
      countdownDays(
        "2027-05-16T00:00:00+07:00",
        new Date("2027-05-16T10:00:00+07:00"),
      ),
    ).toBe(0);
  });
});

describe("categoryBreakdown", () => {
  it("returns an empty list when there are no budget items", () => {
    expect(categoryBreakdown([])).toEqual([]);
  });

  it("groups paid and estimated amounts by category, largest first", () => {
    const items = [
      budgetItem("Acara Utama", 15_000_000, 15_000_000),
      budgetItem("Dekorasi & Venue", 90_000_000, 30_000_000),
      budgetItem("Acara Utama", 5_000_000, 5_000_000),
      budgetItem("Dokumentasi", 50_000_000, 20_000_000),
    ];

    expect(categoryBreakdown(items)).toEqual([
      { category: "Dekorasi & Venue", estimated: 90_000_000, paid: 30_000_000 },
      { category: "Dokumentasi", estimated: 50_000_000, paid: 20_000_000 },
      { category: "Acara Utama", estimated: 20_000_000, paid: 20_000_000 },
    ]);
  });
});

describe("currency formatting", () => {
  it("formats full rupiah amounts", () => {
    expect(formatRupiah(350_000_000)).toContain("350.000.000");
    expect(formatRupiah(350_000_000)).toContain("Rp");
  });

  it("formats compact rupiah amounts for badges", () => {
    expect(formatCompactRupiah(350_000_000)).toBe("Rp 350 jt");
    expect(formatCompactRupiah(7_500_000)).toBe("Rp 7,5 jt");
    expect(formatCompactRupiah(500_000)).toBe("Rp 500 rb");
  });
});

describe("formatWeddingDate", () => {
  it("formats an Indonesian long date", () => {
    expect(formatWeddingDate("2027-05-16T00:00:00+07:00")).toBe("16 Mei 2027");
    expect(formatWeddingDate("2026-12-01")).toBe("1 Desember 2026");
  });

  it("returns the original string when the date is invalid", () => {
    expect(formatWeddingDate("not-a-date")).toBe("not-a-date");
  });
});

describe("budgetStatusBreakdown", () => {
  it("returns all payment statuses with zero totals", () => {
    expect(budgetStatusBreakdown([])).toEqual([
      { status: "lunas", count: 0, estimated: 0, paid: 0 },
      { status: "dp", count: 0, estimated: 0, paid: 0 },
      { status: "belum_bayar", count: 0, estimated: 0, paid: 0 },
    ]);
  });

  it("groups counts and amounts by payment status", () => {
    const items = [
      budgetItem("Acara Utama", 5_000_000, 5_000_000, "lunas"),
      budgetItem("Dekorasi & Venue", 10_000_000, 4_000_000, "dp"),
      budgetItem("Dokumentasi", 5_000_000, 1_000_000, "dp"),
      budgetItem("Lain-lain", 2_000_000, 0, "belum_bayar"),
    ];

    expect(budgetStatusBreakdown(items)).toEqual([
      { status: "lunas", count: 1, estimated: 5_000_000, paid: 5_000_000 },
      { status: "dp", count: 2, estimated: 15_000_000, paid: 5_000_000 },
      {
        status: "belum_bayar",
        count: 1,
        estimated: 2_000_000,
        paid: 0,
      },
    ]);
  });
});

describe("guestCategoryBreakdown", () => {
  it("returns every category with zero totals", () => {
    expect(guestCategoryBreakdown([])).toEqual([
      { category: "VIP", entries: 0, pax: 0, confirmed: 0 },
      { category: "Keluarga Inti", entries: 0, pax: 0, confirmed: 0 },
      { category: "Sahabat & Teman", entries: 0, pax: 0, confirmed: 0 },
      { category: "Rekan Kerja", entries: 0, pax: 0, confirmed: 0 },
    ]);
  });

  it("counts entries, pax, and confirmed pax per category", () => {
    const guests = [
      guest(2, "hadir", "VIP"),
      guest(4, "hadir", "Keluarga Inti"),
      guest(6, "tidak_hadir", "Keluarga Inti"),
      guest(8, "menunggu", "Rekan Kerja"),
    ];

    expect(guestCategoryBreakdown(guests)).toEqual([
      { category: "VIP", entries: 1, pax: 2, confirmed: 2 },
      { category: "Keluarga Inti", entries: 2, pax: 10, confirmed: 4 },
      { category: "Sahabat & Teman", entries: 0, pax: 0, confirmed: 0 },
      { category: "Rekan Kerja", entries: 1, pax: 8, confirmed: 0 },
    ]);
  });
});

describe("groupChecklistByPhase", () => {
  it("returns all phases with empty arrays", () => {
    expect(groupChecklistByPhase([])).toEqual({
      "H-180 s/d H-120": [],
      "H-90 s/d H-60": [],
      "H-30 s/d H-14": [],
      "H-7 s/d Hari-H": [],
    });
  });

  it("groups items under their phase while preserving order", () => {
    const first = checklistItem(false, "H-180 s/d H-120");
    const second = checklistItem(true, "H-90 s/d H-60");
    const third = checklistItem(false, "H-7 s/d Hari-H");

    const grouped = groupChecklistByPhase([first, second, third]);

    expect(grouped["H-180 s/d H-120"]).toEqual([first]);
    expect(grouped["H-90 s/d H-60"]).toEqual([second]);
    expect(grouped["H-30 s/d H-14"]).toEqual([]);
    expect(grouped["H-7 s/d Hari-H"]).toEqual([third]);
  });
});
