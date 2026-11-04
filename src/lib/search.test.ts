import { describe, expect, it } from "vitest";
import { createInitialWeddingData } from "./weddingStorage";
import { searchWeddingData } from "./search";

describe("searchWeddingData", () => {
  it("returns no results for an empty query", () => {
    expect(searchWeddingData(createInitialWeddingData(), "   ")).toEqual([]);
  });

  it("finds guests by name and routes to the guest list", () => {
    const results = searchWeddingData(createInitialWeddingData(), "Jenderal");

    expect(results).toContainEqual(
      expect.objectContaining({
        kind: "guest",
        view: "guests",
        title: expect.stringContaining("Jenderal"),
      }),
    );
  });

  it("finds budget items and vendors for a venue query", () => {
    const results = searchWeddingData(createInitialWeddingData(), "Hotel Mulia");
    const kinds = results.map((result) => result.kind);

    expect(kinds).toContain("budget");
    expect(kinds).toContain("vendor");
  });

  it("finds event tasks and timeline milestones for Bromo", () => {
    const results = searchWeddingData(createInitialWeddingData(), "Bromo");
    const views = results.map((result) => result.view);

    expect(views).toContain("prewedding");
    expect(views).toContain("rundown");
  });

  it("matches case-insensitively and across multiple words", () => {
    const results = searchWeddingData(createInitialWeddingData(), "hotel MULIA");

    expect(results.length).toBeGreaterThan(0);
  });

  it("respects the result limit", () => {
    const results = searchWeddingData(createInitialWeddingData(), "a", 3);

    expect(results).toHaveLength(3);
  });

  it("returns nothing when no record matches", () => {
    expect(searchWeddingData(createInitialWeddingData(), "zzzz-not-found")).toEqual([]);
  });

  it("gives every result a unique id and a navigation target", () => {
    const results = searchWeddingData(createInitialWeddingData(), "undangan");
    const ids = results.map((result) => result.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const result of results) {
      expect(result.view.length).toBeGreaterThan(0);
      expect(result.title.length).toBeGreaterThan(0);
    }
  });
});
