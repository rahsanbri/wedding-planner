import { describe, expect, it } from "vitest";
import { initialBudgetItems } from "../data/budgetData";
import { initialGuestList, initialVendorList } from "../data/supportingData";
import { initialMasterChecklist } from "../data/checklistAndMoodboardData";
import { eventsDatabase } from "../data/weddingEvents";
import { timelineDatabase } from "../data/timelineRoadmapData";
import {
  createInitialWeddingData,
  mergeWeddingData,
  weddingSettings,
} from "./weddingStorage";

describe("createInitialWeddingData", () => {
  it("seeds every module from the existing default data", () => {
    const data = createInitialWeddingData();

    expect(Object.keys(data.eventTasks)).toEqual(Object.keys(eventsDatabase));
    expect(Object.keys(data.eventDocuments)).toEqual(Object.keys(eventsDatabase));
    expect(data.budgetItems).toHaveLength(initialBudgetItems.length);
    expect(data.guests).toHaveLength(initialGuestList.length);
    expect(data.vendors).toHaveLength(initialVendorList.length);
    expect(data.checklist).toHaveLength(initialMasterChecklist.length);
    expect(data.timeline).toHaveLength(timelineDatabase.length);
    expect(data.settings.targetDate).toBe(weddingSettings.targetDate);
    expect(data.settings.guestTarget).toBe(weddingSettings.guestTarget);
    expect(data.readNotificationIds).toEqual([]);
  });

  it("returns independent arrays on every call", () => {
    const first = createInitialWeddingData();
    const second = createInitialWeddingData();

    expect(first.budgetItems).not.toBe(second.budgetItems);
    first.budgetItems.pop();
    expect(second.budgetItems).toHaveLength(initialBudgetItems.length);
  });
});

describe("mergeWeddingData", () => {
  it("returns the base data when nothing usable is stored", () => {
    const base = createInitialWeddingData();

    expect(mergeWeddingData(base, null)).toBe(base);
    expect(mergeWeddingData(base, "corrupt")).toBe(base);
    expect(mergeWeddingData(base, { budgetItems: "nope", guests: null })).toBe(base);
  });

  it("restores stored arrays without dropping untouched modules", () => {
    const base = createInitialWeddingData();
    const storedBudget = [{ ...initialBudgetItems[0], id: "custom" }];
    const merged = mergeWeddingData(base, { budgetItems: storedBudget });

    expect(merged.budgetItems).toEqual(storedBudget);
    expect(merged.guests).toEqual(base.guests);
    expect(merged.vendors).toEqual(base.vendors);
  });

  it("merges per-event tasks and keeps events missing from storage", () => {
    const base = createInitialWeddingData();
    const storedTasks = {
      gereja: [{ ...eventsDatabase.gereja.tasks[0], id: "stored-task" }],
      resepsi: "invalid",
    };

    const merged = mergeWeddingData(base, { eventTasks: storedTasks });

    expect(merged.eventTasks.gereja[0].id).toBe("stored-task");
    expect(merged.eventTasks.resepsi).toEqual(base.eventTasks.resepsi);
    expect(merged.eventTasks.prewedding).toEqual(base.eventTasks.prewedding);
  });

  it("merges editable settings while keeping untouched defaults", () => {
    const base = createInitialWeddingData();
    const merged = mergeWeddingData(base, {
      settings: {
        targetDate: "2028-01-01T00:00:00+07:00",
        targetDateLabel: "1 Januari 2028",
        guestTarget: 500,
      },
    });

    expect(merged.settings).toEqual({
      targetDate: "2028-01-01T00:00:00+07:00",
      targetDateLabel: "1 Januari 2028",
      guestTarget: 500,
      accessKey: "AM2027",
    });

    const partial = mergeWeddingData(base, { settings: { guestTarget: 600 } });
    expect(partial.settings.targetDate).toBe(base.settings.targetDate);
    expect(partial.settings.guestTarget).toBe(600);
  });

  it("ignores invalid settings", () => {
    const base = createInitialWeddingData();

    expect(mergeWeddingData(base, { settings: "nope" })).toBe(base);
    expect(mergeWeddingData(base, { settings: { guestTarget: "many" } })).toBe(base);
  });

  it("merges read notification ids and removes duplicates or invalid values", () => {
    const base = createInitialWeddingData();
    const merged = mergeWeddingData(base, {
      readNotificationIds: ["a", "a", "b", 3, null],
    });

    expect(merged.readNotificationIds).toEqual(["a", "b"]);
  });

  it("ignores invalid read notification collections", () => {
    const base = createInitialWeddingData();

    expect(mergeWeddingData(base, { readNotificationIds: "nope" })).toBe(base);
  });

  it("keeps a stable wedding target date and guest target", () => {
    expect(weddingSettings.targetDate).toBe("2027-05-16T00:00:00+07:00");
    expect(weddingSettings.guestTarget).toBe(450);
  });
});
