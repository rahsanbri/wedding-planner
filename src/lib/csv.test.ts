import { describe, expect, it } from "vitest";
import type { BudgetItem } from "../data/budgetData";
import type { Guest } from "../data/supportingData";
import { budgetToCsv, guestsToCsv, toCsv } from "./csv";

describe("toCsv", () => {
  it("joins cells and rows", () => {
    expect(
      toCsv([
        ["a", "b"],
        [1, 2],
      ]),
    ).toBe("a,b\n1,2");
  });

  it("quotes commas, quotes, and newlines", () => {
    expect(
      toCsv([["Hotel, Mulia", 'He said "hi"', "line\nbreak"]]),
    ).toBe('"Hotel, Mulia","He said ""hi""","line\nbreak"');
  });
});

describe("budgetToCsv", () => {
  it("exports budget rows with readable status", () => {
    const items: BudgetItem[] = [
      {
        id: "b1",
        category: "Dekorasi & Venue",
        title: "Dekorasi Pelaminan",
        vendorName: "Lotus Floral",
        estimatedBudget: 10_000_000,
        actualPaid: 5_000_000,
        paymentStatus: "dp",
        notes: "DP 50%",
      },
    ];

    const csv = budgetToCsv(items);

    expect(csv).toContain("Pos Pengeluaran");
    expect(csv).toContain("Dekorasi Pelaminan");
    expect(csv).toContain("Lotus Floral");
    expect(csv).toContain("10000000");
    expect(csv).toContain("DP");
    expect(csv).toContain("DP 50%");
  });
});

describe("guestsToCsv", () => {
  it("exports guest rows with readable RSVP status", () => {
    const guests: Guest[] = [
      {
        id: "g1",
        name: "Keluarga Wiryanto",
        category: "VIP",
        invitationCount: 2,
        tableNumber: "VIP-01",
        rsvpStatus: "hadir",
        attendanceEvent: "Semua Acara",
        phone: "+62 811",
        notes: "Saksi",
      },
    ];

    const csv = guestsToCsv(guests);

    expect(csv).toContain("Nama Tamu");
    expect(csv).toContain("Keluarga Wiryanto");
    expect(csv).toContain("VIP-01");
    expect(csv).toContain("Hadir");
    expect(csv).toContain("Saksi");
  });
});
