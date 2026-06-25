/**
 * Read API for the Hub's curated content.
 *
 * The Hub deploys as a pure static SPA (Vercel) with no backend, so this module
 * reads the published dataset (`published.ts`) directly in the browser and runs
 * the pure domain gate over it — there is no network call. That is why the tiles
 * render reliably on a static host: previously this was an HTTP client hitting a
 * local Node service at `/api`, which does not exist in production and made every
 * subsystem report "unavailable".
 *
 * Trust is preserved structurally: `published.ts` ships ONLY verified records, and
 * every function here still routes through the pure domain functions
 * (`isVisibleToVisitor` via `orderedVerifiedNews` / `visibleDonations` /
 * `searchResources`), so the verified-only guarantee, newest-first ordering,
 * donation completeness, and case-insensitive search stay enforced by the same
 * tested logic.
 *
 * Public function signatures are unchanged, so the pages and `useSubsystem` are
 * untouched. Each function still returns a Promise (the subsystems fetch
 * independently and the UI maps a rejection to its "unavailable by name" notice),
 * and the `?fail=` fault-injection demo is honored client-side so the existing
 * degradation demo URLs keep working.
 */

import {
  orderedVerifiedNews,
  searchResources,
  visibleDonations,
} from "../domain/core";
import type {
  DonationChannel,
  NewsItem,
  ResourceEntry,
  SubsystemMeta,
  SubsystemName,
} from "../domain/types";
import { publishedDonations, publishedNews, publishedResources } from "./published";

/** Per-subsystem response budget (Req 8.5). Retained for API parity. */
export const SUBSYSTEM_TIMEOUT_MS = 5000;

/**
 * Raised when a subsystem read is forced to fail via the `?fail=` demo. The pages
 * don't read its fields (they only need the promise to reject), but it carries the
 * subsystem name for diagnostics.
 */
export class SubsystemUnavailableError extends Error {
  readonly subsystem: SubsystemName;
  constructor(subsystem: SubsystemName) {
    super(`Subsystem unavailable: ${subsystem}`);
    this.name = "SubsystemUnavailableError";
    this.subsystem = subsystem;
  }
}

/** The set of subsystems forced unavailable via `?fail=news,donations,resources`. */
function failedSubsystems(): Set<SubsystemName> {
  if (typeof window === "undefined") return new Set();
  const raw = new URLSearchParams(window.location.search).get("fail");
  const names = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as SubsystemName[];
  return new Set(names);
}

/**
 * Resolves with the verified-only result of `compute()`, or rejects with
 * `SubsystemUnavailableError` when this subsystem is selected by the `?fail=`
 * demo. Async so callers keep the same Promise-based contract.
 */
function read<T>(name: SubsystemName, compute: () => T): Promise<T> {
  if (failedSubsystems().has(name)) {
    return Promise.reject(new SubsystemUnavailableError(name));
  }
  return Promise.resolve(compute());
}

// ---------------------------------------------------------------------------
// Public read endpoints — verified-only output guaranteed by the domain gate.
// ---------------------------------------------------------------------------

export function getNews(): Promise<NewsItem[]> {
  return read("news", () => orderedVerifiedNews(publishedNews));
}

export function getDonations(): Promise<DonationChannel[]> {
  return read("donations", () => visibleDonations(publishedDonations));
}

export function getResources(opts: {
  category?: string;
  keyword?: string;
}): Promise<ResourceEntry[]> {
  return read("resources", () => searchResources(publishedResources, opts));
}

/** All verified resources (unfiltered) — used to populate the category list. */
export function getAllVerifiedResources(): Promise<ResourceEntry[]> {
  return read("resources", () => searchResources(publishedResources, {}));
}

/**
 * Meta: most-recent verified content `updatedAt` (Req 1.7) + the set of
 * subsystems currently unavailable (Req 8.4). Computed from the published data
 * plus the `?fail=` selection.
 */
export function getMeta(): Promise<SubsystemMeta> {
  const all = [...publishedNews, ...publishedDonations, ...publishedResources];
  const lastUpdated =
    all.reduce<string | null>((latest, r) => {
      return !latest || Date.parse(r.updatedAt) > Date.parse(latest) ? r.updatedAt : latest;
    }, null) ?? new Date().toISOString();

  return Promise.resolve({
    lastUpdated,
    unavailableSubsystems: Array.from(failedSubsystems()),
  });
}
