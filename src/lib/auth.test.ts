import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  normalizePasscode,
  validatePasscode,
  getStoredAuth,
  saveAuth,
  clearAuth,
} from "./auth";

describe("auth utilities", () => {
  const storage = new Map<string, string>();
  const localStorageMock = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  };

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", {});
  });

  describe("normalizePasscode", () => {
    it("normalizes case and strips special characters", () => {
      expect(normalizePasscode("am2027")).toBe("AM2027");
      expect(normalizePasscode("A&M2027")).toBe("AM2027");
      expect(normalizePasscode(" a & m - 2027 ")).toBe("AM2027");
    });
  });

  describe("validatePasscode", () => {
    it("validates default master key AM2027 in various formats", () => {
      expect(validatePasscode("AM2027")).toBe(true);
      expect(validatePasscode("am2027")).toBe(true);
      expect(validatePasscode("A&M2027")).toBe(true);
      expect(validatePasscode("wrong-code")).toBe(false);
      expect(validatePasscode("")).toBe(false);
    });

    it("validates custom master key", () => {
      expect(validatePasscode("KELUARGA2027", "KELUARGA2027")).toBe(true);
      expect(validatePasscode("keluarga2027", "KELUARGA2027")).toBe(true);
      // Default fallback still works
      expect(validatePasscode("AM2027", "KELUARGA2027")).toBe(true);
      expect(validatePasscode("salah", "KELUARGA2027")).toBe(false);
    });
  });

  describe("session storage", () => {
    it("saves and retrieves auth user", () => {
      expect(getStoredAuth()).toBeNull();

      const user = {
        name: "Maria",
        role: "Mempelai",
        loggedInAt: 123456789,
      };

      saveAuth(user);
      expect(getStoredAuth()).toEqual(user);

      clearAuth();
      expect(getStoredAuth()).toBeNull();
    });
  });
});
