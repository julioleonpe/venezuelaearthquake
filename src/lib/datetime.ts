/**
 * Timestamp formatting for the presentation layer.
 *
 * Requirements call for "last updated" with calendar date, time of day, AND
 * timezone (Req 1.7), and news timestamps with date + time of day (Req 4.2).
 * Formatting is locale-aware (EN/ES) but the underlying instant is the same —
 * localization here is presentation, not data.
 */

import type { Locale } from "../i18n/catalog";

const localeTag: Record<Locale, string> = { en: "en-US", es: "es-VE" };

/** Date only. e.g. "Jun 25, 2026" — for freshness lines where time adds noise. */
export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(localeTag[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/** Date + time of day (Req 4.2). e.g. "Jun 25, 2026, 7:45 AM". */
export function formatDateTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(localeTag[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** Date + time of day + timezone (Req 1.7). e.g. "Jun 25, 2026, 7:45 AM EDT". */
export function formatDateTimeTz(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(localeTag[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

/** Machine-readable value for <time datetime>. */
export function isoForTimeAttr(iso: string): string {
  return iso;
}

/**
 * True if `iso` is within `windowDays` of `now` — used to show the transient
 * "newly added" badge on relief tools, which then drops automatically once the
 * window passes (no manual cleanup). `now` is injected so the rule stays pure
 * and testable; callers pass `new Date()` at render time. A missing/invalid
 * `iso` is never "new". A future timestamp is treated as new (badge shows).
 */
export function isWithinDays(iso: string | undefined, windowDays: number, now: Date): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  const ageMs = now.getTime() - t;
  return ageMs < windowDays * 24 * 60 * 60 * 1000;
}
