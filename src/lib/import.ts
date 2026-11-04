import {
  createInitialWeddingData,
  mergeWeddingData,
} from "./weddingStorage";
import type { WeddingData } from "./weddingStorage";

export type ImportResult =
  | { data: WeddingData }
  | { error: string };

export function parseImportedWeddingData(raw: string): ImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "File bukan JSON yang valid." };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { error: "Struktur data tidak dikenali." };
  }

  const base = createInitialWeddingData();
  const merged = mergeWeddingData(base, parsed);

  if (merged === base) {
    return { error: "File tidak berisi data wedding yang dikenali." };
  }

  return { data: merged };
}
