import { describe, expect, it } from "vitest";
import { createId } from "./utils";

describe("createId", () => {
  it("prefixes the id and stays unique across calls", () => {
    const first = createId("task");
    const second = createId("task");

    expect(first.startsWith("task-")).toBe(true);
    expect(second.startsWith("task-")).toBe(true);
    expect(first).not.toBe(second);
  });
});
