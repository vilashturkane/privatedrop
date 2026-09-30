/**
 * Simple localStorage-based store for ZK proof history.
 *
 * All reads and writes are SSR-safe: when `window` is not available the
 * functions degrade gracefully (reads return `[]`, writes are no-ops).
 */

import type { ProofRecord } from "@/types";

const STORAGE_KEY = "privatedrop:proof-history";

/**
 * Retrieve the full proof history from localStorage.
 *
 * @returns An array of {@link ProofRecord} entries, or an empty array when
 *          nothing is stored or the code is running on the server.
 */
export function getProofHistory(): ProofRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ProofRecord[];
  } catch {
    return [];
  }
}

/**
 * Append a proof record to the persisted history.
 *
 * @param record - The {@link ProofRecord} to save.
 */
export function saveProofRecord(record: ProofRecord): void {
  if (typeof window === "undefined") return;

  const history = getProofHistory();
  history.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Clear all stored proof history.
 */
export function clearProofHistory(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}
