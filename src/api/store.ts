/**
 * API client for the Hub's REST read service.
 *
 * This module used to be an in-memory mock that imported the seed dataset and ran
 * the visibility gate in the browser. That worked, but it shipped the
 * pending/rejected records inside the client bundle — only *hiding* them, which
 * violates the CLAUDE.md trust invariant ("Unverified records must never be sent
 * to the browser"). It is now a thin HTTP client over the real stateless REST
 * service in `server/server.ts`, which holds the curated store and runs the pure
 * domain gate (`isVisibleToVisitor`, search, sort, donation completeness)
 * server-side. Unverified records never leave the server.
 *
 * The public function signatures are unchanged, so the pages and `useSubsystem`
 * are untouched: each subsystem still fetches independently and rejects on
 * failure, which the UI maps to its "unavailable by name" notice (Req 8.4/8.5).
 * Per-subsystem availability and the `?fail=` fault-injection demo are now
 * enforced by the server; the `?fail=` query is forwarded so the existing demo
 * URLs keep working end to end.
 */

import type {
  DonationChannel,
  NewsItem,
  ResourceEntry,
  SubsystemMeta,
  SubsystemName,
} from "../domain/types";

/**
 * Base path for the REST service. Relative `/api` so it works same-origin in
 * production and through the Vite dev proxy in development (see vite.config.ts).
 * Overridable via `VITE_API_BASE` for alternate deployments.
 */
const API_BASE = (import.meta.env?.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

/** Per-subsystem response budget (Req 8.5) — enforced by the server; mirrored here. */
export const SUBSYSTEM_TIMEOUT_MS = 5000;

/**
 * Raised when a subsystem read fails or exceeds its budget. The pages don't read
 * its fields (they only need the promise to reject), but it is preserved for API
 * parity with the former mock and to carry the subsystem name for diagnostics.
 */
export class SubsystemUnavailableError extends Error {
  readonly subsystem: SubsystemName;
  constructor(subsystem: SubsystemName) {
    super(`Subsystem unavailable: ${subsystem}`);
    this.name = "SubsystemUnavailableError";
    this.subsystem = subsystem;
  }
}

/**
 * Forward the current `?fail=` selection to the server so the graceful-degradation
 * demo (e.g. `?fail=news,donations`) drives real per-subsystem 503s end to end.
 */
function failQuery(): string {
  if (typeof window === "undefined") return "";
  const raw = new URLSearchParams(window.location.search).get("fail");
  return raw ? `fail=${encodeURIComponent(raw)}` : "";
}

function buildUrl(path: string, params: Record<string, string | undefined> = {}): string {
  const query = new URLSearchParams();
  const fail = failQuery();
  if (fail) query.set("fail", new URLSearchParams(fail).get("fail")!);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") query.set(k, v);
  }
  const qs = query.toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ""}`;
}

/**
 * Fetches JSON for one subsystem within its budget. A non-OK response or a
 * timeout/abort rejects with `SubsystemUnavailableError(name)` so the UI marks
 * exactly that subsystem unavailable while the others render.
 */
async function fetchSubsystem<T>(
  name: SubsystemName,
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<T> {
  const controller = new AbortController();
  // Guard slightly above the server's 5s budget so a real subsystem timeout
  // surfaces as the server's 503 rather than a premature client abort.
  const timer = setTimeout(() => controller.abort(), SUBSYSTEM_TIMEOUT_MS + 1500);
  try {
    const res = await fetch(buildUrl(path, params), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new SubsystemUnavailableError(name);
    return (await res.json()) as T;
  } catch {
    throw new SubsystemUnavailableError(name);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Public read endpoints — verified-only output is guaranteed by the server.
// ---------------------------------------------------------------------------

export function getNews(): Promise<NewsItem[]> {
  return fetchSubsystem<NewsItem[]>("news", "/api/news");
}

export function getDonations(): Promise<DonationChannel[]> {
  return fetchSubsystem<DonationChannel[]>("donations", "/api/donations");
}

export function getResources(opts: {
  category?: string;
  keyword?: string;
}): Promise<ResourceEntry[]> {
  return fetchSubsystem<ResourceEntry[]>("resources", "/api/resources", {
    category: opts.category,
    keyword: opts.keyword,
  });
}

/** All verified resources (unfiltered) — used to populate the category list. */
export function getAllVerifiedResources(): Promise<ResourceEntry[]> {
  return fetchSubsystem<ResourceEntry[]>("resources", "/api/resources/all");
}

/**
 * Meta: most-recent verified content `updatedAt` (Req 1.7) + the set of
 * subsystems currently unavailable (Req 8.4). Meta never fails — it reports the
 * failures; if the request itself errors we degrade to "now" with no failures so
 * the chrome still renders a last-updated line.
 */
export async function getMeta(): Promise<SubsystemMeta> {
  try {
    const res = await fetch(buildUrl("/api/meta"), { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("meta_unavailable");
    return (await res.json()) as SubsystemMeta;
  } catch {
    return { lastUpdated: new Date().toISOString(), unavailableSubsystems: [] };
  }
}
