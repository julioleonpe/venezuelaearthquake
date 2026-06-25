/**
 * Shared read-API core — framework-agnostic.
 *
 * This is the single source of truth for the Hub's public reads: the curated
 * store, the visibility gate wiring, fault injection, and route dispatch. It is
 * deliberately decoupled from any HTTP server so the SAME code backs both runtimes
 * without drifting:
 *   - local dev:   server/server.ts wraps it in a node:http listener
 *   - production:  api/[...path].ts wraps it as a Vercel serverless function
 *
 * It honors the CLAUDE.md trust invariant: every read routes through the pure
 * `isVisibleToVisitor` gate (and the donation-completeness / news-ordering /
 * search functions) BEFORE serialization, so pending/rejected records are never
 * put on the wire — regardless of which runtime is serving.
 */

import {
  isVisibleToVisitor,
  orderedVerifiedNews,
  searchResources,
  visibleDonations,
} from "../src/domain/core.ts";
import type {
  DonationChannel,
  NewsItem,
  ResourceEntry,
  SubsystemMeta,
  SubsystemName,
} from "../src/domain/types.ts";
import { seedDonations, seedNews, seedResources } from "../src/api/seed.ts";

/** Per-subsystem response budget (Req 8.5). */
export const SUBSYSTEM_TIMEOUT_MS = 5000;

/**
 * Artificial network jitter so loading states are demonstrable in dev. Disabled
 * in production (Vercel sets `VERCEL`) — a real serverless function should add no
 * gratuitous latency or billed execution time.
 */
const BASE_LATENCY_MS = process.env.VERCEL || process.env.NODE_ENV === "production" ? 0 : 120;

/**
 * The curated data store, held server-side. In production this would be a
 * database; here it is the seed the design ships with. The deep clone makes the
 * in-memory copy authoritative and immutable to accidental mutation.
 */
const db = {
  news: structuredClone(seedNews),
  donations: structuredClone(seedDonations),
  resources: structuredClone(seedResources),
};

// ---------------------------------------------------------------------------
// Fault injection (so the per-subsystem degradation UI is demonstrable — Req 8.4/8.5)
// ---------------------------------------------------------------------------

/** Parse `?fail=news,donations` into the set of subsystems to force unavailable. */
function forcedFailures(searchParams: URLSearchParams): Set<SubsystemName> {
  const out = new Set<SubsystemName>();
  const raw = searchParams.get("fail");
  if (!raw) return out;
  for (const part of raw.split(",").map((s) => s.trim().toLowerCase())) {
    if (part === "news" || part === "donations" || part === "resources") out.add(part);
  }
  return out;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class SubsystemUnavailableError extends Error {
  // Declared explicitly (not via a TS parameter property): Node's strip-only TS
  // mode rejects parameter properties.
  readonly subsystem: SubsystemName;
  constructor(subsystem: SubsystemName) {
    super(`Subsystem unavailable: ${subsystem}`);
    this.name = "SubsystemUnavailableError";
    this.subsystem = subsystem;
  }
}

/**
 * Wraps a subsystem read in the 5s budget. A forced failure hangs for the full
 * timeout (mimicking a stalled upstream) and then rejects, so the client's own
 * budget / "unavailable by name" path is exercised end to end.
 */
async function withSubsystemBudget<T>(
  name: SubsystemName,
  failures: Set<SubsystemName>,
  produce: () => T,
): Promise<T> {
  if (failures.has(name)) {
    await delay(SUBSYSTEM_TIMEOUT_MS);
    throw new SubsystemUnavailableError(name);
  }
  if (BASE_LATENCY_MS) await delay(BASE_LATENCY_MS);
  return produce();
}

// ---------------------------------------------------------------------------
// Public read endpoints — every path routes through the domain gate.
// ---------------------------------------------------------------------------

function getNews(failures: Set<SubsystemName>): Promise<NewsItem[]> {
  return withSubsystemBudget("news", failures, () => orderedVerifiedNews(db.news));
}

function getDonations(failures: Set<SubsystemName>): Promise<DonationChannel[]> {
  return withSubsystemBudget("donations", failures, () => visibleDonations(db.donations));
}

function getResources(
  failures: Set<SubsystemName>,
  opts: { category?: string; keyword?: string },
): Promise<ResourceEntry[]> {
  return withSubsystemBudget("resources", failures, () => searchResources(db.resources, opts));
}

function getAllVerifiedResources(failures: Set<SubsystemName>): Promise<ResourceEntry[]> {
  return withSubsystemBudget("resources", failures, () => db.resources.filter(isVisibleToVisitor));
}

/**
 * Meta composes the most-recent verified `updatedAt` (Req 1.7) and the set of
 * currently-unavailable subsystems (Req 8.4). Meta itself never fails — it reports
 * the failures rather than becoming one.
 */
async function getMeta(failures: Set<SubsystemName>): Promise<SubsystemMeta> {
  if (BASE_LATENCY_MS) await delay(BASE_LATENCY_MS);
  const verifiedUpdatedTimes = [
    ...db.news.filter(isVisibleToVisitor).map((r) => r.updatedAt),
    ...db.donations.filter(isVisibleToVisitor).map((r) => r.updatedAt),
    ...db.resources.filter(isVisibleToVisitor).map((r) => r.updatedAt),
  ];
  const lastUpdated =
    verifiedUpdatedTimes.sort((a, b) => Date.parse(b) - Date.parse(a))[0] ??
    new Date().toISOString();

  return {
    lastUpdated,
    unavailableSubsystems: (["news", "donations", "resources"] as SubsystemName[]).filter((s) =>
      failures.has(s),
    ),
  };
}

// ---------------------------------------------------------------------------
// Runtime-agnostic dispatch. Returns a status + JSON body; the HTTP/serverless
// wrapper is responsible only for writing it to its own response object.
// ---------------------------------------------------------------------------

export interface ReadResult {
  status: number;
  body: unknown;
}

/**
 * Routes a read by pathname + query and returns `{ status, body }`. Never throws:
 * a forced subsystem failure becomes a 503 carrying the subsystem name (so the
 * client maps it to its "unavailable by name" notice, Req 8.4); an unknown path
 * is a 404.
 */
export async function handleRead(pathname: string, searchParams: URLSearchParams): Promise<ReadResult> {
  const failures = forcedFailures(searchParams);
  try {
    switch (pathname) {
      case "/api/health":
        return { status: 200, body: { ok: true } };
      case "/api/news":
        return { status: 200, body: await getNews(failures) };
      case "/api/donations":
        return { status: 200, body: await getDonations(failures) };
      case "/api/resources":
        return {
          status: 200,
          body: await getResources(failures, {
            category: searchParams.get("category") ?? undefined,
            keyword: searchParams.get("keyword") ?? undefined,
          }),
        };
      case "/api/resources/all":
        return { status: 200, body: await getAllVerifiedResources(failures) };
      case "/api/meta":
        return { status: 200, body: await getMeta(failures) };
      default:
        return { status: 404, body: { error: "not_found" } };
    }
  } catch (err) {
    if (err instanceof SubsystemUnavailableError) {
      return { status: 503, body: { error: "subsystem_unavailable", subsystem: err.subsystem } };
    }
    return { status: 500, body: { error: "internal_error" } };
  }
}
