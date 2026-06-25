/**
 * Core Domain Module — pure, framework-free.
 *
 * This is the trust-critical heart of the Hub. Per `design.md` "Architecture
 * invariants", every public read routes through `isVisibleToVisitor`, and the
 * error-prone logic (case-insensitive substring search, descending-by-timestamp
 * sort, keyword validation, donation completeness, source-host labeling, the
 * language-indicator decision) lives here as pure functions with no DB / HTTP /
 * React dependency. These are the primary unit/property-test targets.
 *
 * Signatures match `design.md` → "Core Domain Module".
 */

import type {
  DonationChannel,
  Language,
  NewsItem,
  ResourceEntry,
  VerificationStatus,
} from "./types";

// ---------------------------------------------------------------------------
// Visibility gate (Properties 1, 2; Req 2.1, 4.4, 6.7, 6.3, 6.4)
// ---------------------------------------------------------------------------

/**
 * The single visibility gate. A curated record is shown to a Visitor if and only
 * if its Verification_Status is exactly "verified". Fail closed: anything that is
 * not provably "verified" is treated as not visible (design.md "Error Handling").
 */
export function isVisibleToVisitor(record: {
  verificationStatus: VerificationStatus;
}): boolean {
  return record?.verificationStatus === "verified";
}

// ---------------------------------------------------------------------------
// Resource directory search + keyword validation (Properties 4, 5, 6; Req 2.3–2.5)
// ---------------------------------------------------------------------------

const KEYWORD_MIN = 1;
const KEYWORD_MAX = 100;

export type KeywordValidation =
  | { ok: true; keyword: string }
  | { ok: false; reason: "empty" | "too_long" };

/**
 * Accepts a keyword iff its length after trimming leading/trailing whitespace is
 * between 1 and 100 inclusive (Req 2.5). Returns the trimmed keyword on success.
 * The `reason` is a stable id the presentation layer localizes (no display text
 * leaks into the domain).
 */
export function validateKeyword(raw: string): KeywordValidation {
  const keyword = (raw ?? "").trim();
  if (keyword.length < KEYWORD_MIN) return { ok: false, reason: "empty" };
  if (keyword.length > KEYWORD_MAX) return { ok: false, reason: "too_long" };
  return { ok: true, keyword };
}

/**
 * Verified resources, optionally narrowed by an exact category match and/or a
 * case-insensitive substring keyword over name + description (Req 2.3, 2.4).
 * Order of the input list is preserved. Visibility is always applied first so a
 * subsystem cannot bypass the gate.
 */
export function searchResources(
  entries: ResourceEntry[],
  opts: { category?: string; keyword?: string } = {},
): ResourceEntry[] {
  const keyword = opts.keyword?.trim().toLowerCase();
  const category = opts.category;

  return entries.filter((entry) => {
    if (!isVisibleToVisitor(entry)) return false;
    if (category && category !== ALL_CATEGORIES && entry.category !== category) {
      return false;
    }
    if (keyword) {
      const haystack = `${entry.name}\n${entry.description}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });
}

/** Sentinel meaning "no category filter applied" (presentation convenience). */
export const ALL_CATEGORIES = "__all__";

/** Distinct categories present among verified entries, sorted for stable display. */
export function verifiedCategories(entries: ResourceEntry[]): string[] {
  const set = new Set<string>();
  for (const entry of entries) {
    if (isVisibleToVisitor(entry)) set.add(entry.category);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// ---------------------------------------------------------------------------
// Donations (Property 7; Req 3.1, 3.3)
// ---------------------------------------------------------------------------

/** Non-empty after trimming. */
function isPresent(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Verified AND complete donation channels (Req 3.1, 3.3). A channel missing the
 * recipient organization, description, or destination link is excluded entirely.
 */
export function visibleDonations(channels: DonationChannel[]): DonationChannel[] {
  return channels.filter(
    (c) =>
      isVisibleToVisitor(c) &&
      isPresent(c.recipientOrganization) &&
      isPresent(c.description) &&
      isPresent(c.destinationLink),
  );
}

// ---------------------------------------------------------------------------
// News (Property 8; Req 4.1, 4.5)
// ---------------------------------------------------------------------------

export const NEWS_PAGE_SIZE = 50;

/**
 * Verified news, sorted by publication timestamp descending (newest first),
 * capped at `pageSize` (Req 4.1, 4.5). Input is not mutated.
 */
export function orderedVerifiedNews(
  items: NewsItem[],
  pageSize: number = NEWS_PAGE_SIZE,
): NewsItem[] {
  return items
    .filter(isVisibleToVisitor)
    .slice()
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, Math.max(0, pageSize));
}

// ---------------------------------------------------------------------------
// Source attribution / external links (Properties 11, 12; Req 7.1–7.4, 5.3)
// ---------------------------------------------------------------------------

export interface SourceHostLabel {
  /** The fully qualified destination host name, or a localizable marker when absent/invalid. */
  label: string;
  /** True when no usable source link is present → caller shows the "unverified source" label. */
  unverified: boolean;
}

/**
 * Derives the fully qualified host name to render adjacent to an external link
 * (Req 7.3, 5.3). When the URL is null/blank/unparseable, returns
 * `{ unverified: true }` so the caller renders the "unverified source" label
 * (Req 7.2). The `label` for the unverified case is the stable id "unverified".
 */
export function sourceHostLabel(url: string | null): SourceHostLabel {
  if (!isPresent(url)) return { label: "unverified", unverified: true };
  try {
    const parsed = new URL(url.trim());
    return { label: parsed.host, unverified: false };
  } catch {
    return { label: "unverified", unverified: true };
  }
}

// ---------------------------------------------------------------------------
// Localization support (Property 17; Req 10.5)
// ---------------------------------------------------------------------------

/**
 * True when a record's authored language differs from the Visitor's interface
 * language, i.e. a LanguageIndicator should be shown (Req 10.5). Language-tag
 * comparison only — no display text, keeping the domain language-agnostic.
 */
export function needsLanguageIndicator(
  contentLanguage: Language,
  interfaceLanguage: Language,
): boolean {
  return contentLanguage !== interfaceLanguage;
}
