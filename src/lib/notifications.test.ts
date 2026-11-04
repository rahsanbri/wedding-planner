import { describe, expect, it } from "vitest";
import type { WeddingData } from "./weddingStorage";
import { buildNotifications, filterUnreadNotifications } from "./notifications";

function baseData(overrides: Partial<WeddingData>): WeddingData {
  return {
    eventTasks: {},
    eventDocuments: {},
    budgetItems: [],
    guests: [],
    vendors: [],
    checklist: [],
    timeline: [],
    settings: {
      targetDate: "2027-05-16T00:00:00+07:00",
      targetDateLabel: "16 Mei 2027",
      guestTarget: 450,
    },
    readNotificationIds: [],
    ...overrides,
  };
}

describe("buildNotifications", () => {
  it("flags unpaid budget items and puts urgent items first", () => {
    const notifications = buildNotifications(
      baseData({
        budgetItems: [
          {
            id: "b1",
            category: "Dekorasi & Venue",
            title: "Dekorasi Pelaminan",
            vendorName: "Lotus",
            estimatedBudget: 10_000_000,
            actualPaid: 0,
            paymentStatus: "belum_bayar",
          },
          {
            id: "b2",
            category: "Acara Utama",
            title: "Sudah lunas",
            vendorName: "Vendor",
            estimatedBudget: 5_000_000,
            actualPaid: 5_000_000,
            paymentStatus: "lunas",
          },
        ],
      }),
    );

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({
      tone: "urgent",
      view: "budget",
      title: expect.stringContaining("Pelunasan"),
    });
    expect(notifications[0].description).toContain("Dekorasi Pelaminan");
    expect(notifications[0].description).toContain("Rp 10.000.000");
  });

  it("flags guests who have not confirmed", () => {
    const notifications = buildNotifications(
      baseData({
        guests: [
          {
            id: "g1",
            name: "Keluarga Menunggu",
            category: "VIP",
            invitationCount: 4,
            tableNumber: "VIP-01",
            rsvpStatus: "menunggu",
            attendanceEvent: "Semua Acara",
          },
        ],
      }),
    );

    expect(notifications[0]).toMatchObject({
      tone: "warning",
      view: "guests",
      title: expect.stringContaining("RSVP"),
    });
    expect(notifications[0].description).toContain("Keluarga Menunggu");
    expect(notifications[0].description).toContain("4 pax");
  });

  it("flags incomplete high-priority tasks and skips completed ones", () => {
    const notifications = buildNotifications(
      baseData({
        eventTasks: {
          gereja: [
            {
              id: "t1",
              title: "Konfirmasi saksi",
              category: "Saksi",
              completed: false,
              dueDate: "Mei 2027",
              pic: "Keluarga",
              priority: "high",
            },
            {
              id: "t2",
              title: "Tugas selesai",
              category: "Saksi",
              completed: true,
              dueDate: "Mei 2027",
              pic: "Keluarga",
              priority: "high",
            },
            {
              id: "t3",
              title: "Tugas rendah",
              category: "Lain",
              completed: false,
              dueDate: "Mei 2027",
              pic: "Keluarga",
              priority: "low",
            },
          ],
        },
      }),
    );

    expect(notifications).toHaveLength(1);
    expect(notifications[0].view).toBe("gereja");
    expect(notifications[0].title).toContain("To-do");
    expect(notifications[0].description).toContain("Konfirmasi saksi");
  });

  it("flags in-progress timeline milestones", () => {
    const notifications = buildNotifications(
      baseData({
        timeline: [
          {
            id: "tm1",
            phaseId: "h-3m",
            phaseName: "Fase H - 3 Bulan",
            timeframe: "Jan - Feb 2027",
            title: "Sesi foto Bromo",
            pillar: "Pre-Wedding",
            dateFormatted: "20 Februari 2027",
            description: "Sesi foto",
            location: "Bromo",
            pic: "Tim Visual",
            status: "in_progress",
            keyActions: [],
          },
        ],
      }),
    );

    expect(notifications[0]).toMatchObject({
      tone: "info",
      view: "rundown",
      title: expect.stringContaining("Sedang berjalan"),
    });
  });

  it("limits notifications and keeps unique ids", () => {
    const notifications = buildNotifications(
      baseData({
        budgetItems: Array.from({ length: 10 }, (_, index) => ({
          id: `b${index}`,
          category: "Lain-lain" as const,
          title: `Tagihan ${index}`,
          vendorName: "Vendor",
          estimatedBudget: 1_000_000,
          actualPaid: 0,
          paymentStatus: "belum_bayar" as const,
        })),
      }),
      4,
    );

    expect(notifications).toHaveLength(4);
    expect(new Set(notifications.map((item) => item.id)).size).toBe(4);
  });
});

describe("filterUnreadNotifications", () => {
  const notifications = [
    {
      id: "a",
      title: "A",
      description: "",
      tone: "urgent" as const,
      view: "budget",
    },
    {
      id: "b",
      title: "B",
      description: "",
      tone: "warning" as const,
      view: "guests",
    },
  ];

  it("returns all notifications when nothing is read", () => {
    expect(filterUnreadNotifications(notifications, [])).toEqual(notifications);
  });

  it("removes notifications whose ids are already read", () => {
    expect(filterUnreadNotifications(notifications, ["a"])).toEqual([
      notifications[1],
    ]);
  });

  it("ignores unknown read ids", () => {
    expect(filterUnreadNotifications(notifications, ["x"])).toEqual(notifications);
  });
});
