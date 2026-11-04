export interface AuthUser {
  name: string;
  role: "Mempelai" | "Keluarga" | "Wedding Organizer" | "Panitia" | string;
  loggedInAt: number;
}

export const AUTH_STORAGE_KEY = "wedding-planner-auth-v1";

export function getStoredAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === "string" && parsed.name.trim().length > 0) {
      return parsed as AuthUser;
    }
  } catch {
    // fallback
  }
  return null;
}

export function saveAuth(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function normalizePasscode(code: string): string {
  return (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function validatePasscode(entered: string, masterKey: string = "AM2027"): boolean {
  if (!entered) return false;
  const cleanEntered = normalizePasscode(entered);
  const cleanMaster = normalizePasscode(masterKey || "AM2027");
  
  // Accept custom master key, or standard default AM2027
  return cleanEntered === cleanMaster || cleanEntered === "AM2027";
}
