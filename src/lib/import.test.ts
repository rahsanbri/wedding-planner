import { describe, expect, it } from "vitest";
import { createInitialWeddingData } from "./weddingStorage";
import { parseImportedWeddingData } from "./import";

describe("parseImportedWeddingData", () => {
  it("rejects malformed JSON", () => {
    const result = parseImportedWeddingData("{not-json");

    expect("error" in result).toBe(true);
  });

  it("rejects JSON that contains no wedding data", () => {
    expect("error" in parseImportedWeddingData(JSON.stringify({ foo: "bar" }))).toBe(
      true,
    );
    expect("error" in parseImportedWeddingData("null")).toBe(true);
    expect("error" in parseImportedWeddingData("[]")).toBe(true);
  });

  it("accepts a full backup and restores every module", () => {
    const backup = createInitialWeddingData();
    const result = parseImportedWeddingData(JSON.stringify(backup));

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.budgetItems).toHaveLength(backup.budgetItems.length);
      expect(result.data.guests).toHaveLength(backup.guests.length);
      expect(result.data.vendors).toHaveLength(backup.vendors.length);
      expect(result.data.checklist).toHaveLength(backup.checklist.length);
      expect(result.data.timeline).toHaveLength(backup.timeline.length);
      expect(result.data.settings).toEqual(backup.settings);
    }
  });

  it("merges partial backups with the defaults", () => {
    const result = parseImportedWeddingData(
      JSON.stringify({
        guests: [],
        settings: { guestTarget: 500 },
      }),
    );

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.guests).toEqual([]);
      expect(result.data.budgetItems.length).toBeGreaterThan(0);
      expect(result.data.settings.guestTarget).toBe(500);
    }
  });
});
