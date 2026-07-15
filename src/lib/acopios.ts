/**
 * Live collection-center & shelter feed — acopios-refugios.vercel.app
 * ("Venezuela Resiste"), a community-run crisis map of earthquake-relief points.
 *
 * Sibling of the old `usgs.ts` / `damage.ts` live layers: reads the point registry
 * and normalizes each row into a small, presentation-ready shape. Network/parse
 * failures surface as a rejected promise so the console can degrade gracefully
 * (the rest of the command center keeps rendering).
 *
 * The upstream is the source site's own Google Apps Script Web App, but we read it
 * through our OWN same-origin proxy (`/api/relief-points`, see api/relief-points.ts
 * + the Vite dev plugin) rather than directly: the Apps Script endpoint 302-
 * redirects to script.googleusercontent.com, and that cross-origin redirect trips
 * the browser's CORS check on a direct fetch. A server-to-server proxy has no CORS,
 * so this works identically in local dev and production.
 *
 * Trust note: these are COMMUNITY-REPORTED points. Collection centers (acopios)
 * publish instantly with a "sin verificar" (unverified) stamp; shelters (refugios)
 * are moderated before publishing. This is third-party data the Hub neither owns
 * nor curates — it is deliberately kept OUT of the Hub's verification gate and
 * rendered as a clearly-attributed external layer, with the per-point unverified
 * state preserved so it is never presented as vetted. The Hub also refers people
 * to the source site so they can report new points there.
 */

import { categorizeNeeds, NEED_CATEGORIES, type NeedCategory } from "./reliefNeeds";

/** Same-origin proxy that fronts the community feed (see api/relief-points.ts). */
const RELIEF_POINTS_ENDPOINT = "/api/relief-points";

/** Point type as authored by the source registry. */
export type ReliefPointType = "acopio" | "refugio";

export interface ReliefPoint {
  /** Stable within a load; the source rows carry no id, so we derive one. */
  id: string;
  type: ReliefPointType;
  /** Place name, e.g. "Escuela Simón Bolívar". */
  name: string;
  /** Venezuelan state, as authored (e.g. "La Guaira (Vargas)"). */
  state: string | null;
  /** Free-text address / reference. */
  address: string | null;
  latitude: number;
  longitude: number;
  /** Public contact (phone / Instagram), if the reporter shared one. */
  contact: string | null;
  /** Acopios: what the center is receiving (agua, medicinas, …). */
  needs: string | null;
  /**
   * Stable need categories derived from `needs` (see lib/reliefNeeds.ts). Drives
   * the category filter and bilingual tags; empty for refugios and untagged text.
   */
  needsCategories: NeedCategory[];
  /** Refugios: approximate capacity (e.g. "40 personas"). */
  capacity: string | null;
  /**
   * False while the point is still `por_verificar` (unverified) at the source.
   * Acopios may be shown unverified; refugios are only surfaced once approved.
   */
  verified: boolean;
}

interface SourceRow {
  tipo: string | null;
  nombre: string | null;
  estado: string | null;
  direccion: string | null;
  lat: number | string | null;
  lng: number | string | null;
  // Free-text fields are authored in a Google Sheet, so an all-digit cell (e.g. a
  // phone number in `contacto`) arrives as a JSON number, not a string. Type these
  // as scalars and let `clean()` coerce — never assume `.trim()` is safe.
  contacto: string | number | null;
  necesidades: string | number | null;
  capacidad: string | number | null;
  estado_moderacion: string | null;
}

const VALID_TYPES: ReadonlySet<string> = new Set(["acopio", "refugio"]);

function clean(s: string | number | null | undefined): string | null {
  // Coerce first: the source can hand us a number for any free-text field.
  const v = String(s ?? "").trim();
  return v.length ? v : null;
}

function coord(v: number | string | null): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Moderation gate, mirroring the source site's own visibility rules:
 *  - refugio: shown only once `aprobado` (moderated) — shelters are sensitive.
 *  - acopio:  shown when `aprobado` OR `por_verificar` (published instantly,
 *             but flagged unverified so we can mark it as such).
 * Anything else (rejected/blank) is dropped.
 */
function moderationOk(type: ReliefPointType, mod: string): boolean {
  if (mod === "aprobado") return true;
  if (type === "acopio" && mod === "por_verificar") return true;
  return false;
}

/**
 * Normalizes raw source rows into mappable, moderation-visible relief points.
 * Pure — no network — so it stays trivially testable. Drops rows that aren't a
 * valid type, lack coordinates, or fail the moderation gate.
 */
export function normalizeReliefRows(rows: SourceRow[]): ReliefPoint[] {
  return rows
    .map((r, i): ReliefPoint | null => {
      const type = (r.tipo ?? "").trim().toLowerCase();
      const lat = coord(r.lat);
      const lng = coord(r.lng);
      if (!VALID_TYPES.has(type) || lat == null || lng == null) return null;
      const mod = (r.estado_moderacion ?? "").trim().toLowerCase();
      if (!moderationOk(type as ReliefPointType, mod)) return null;
      const needs = clean(r.necesidades);
      return {
        // The source rows are anonymous; a stable-per-load index + coords key
        // is enough for React keys and marker/selection bookkeeping.
        id: `${type}-${i}-${lat.toFixed(5)}-${lng.toFixed(5)}`,
        type: type as ReliefPointType,
        name: clean(r.nombre) ?? "—",
        state: clean(r.estado),
        address: clean(r.direccion),
        latitude: lat,
        longitude: lng,
        contact: clean(r.contacto),
        needs,
        // Only acopios advertise needs; categorize now so the filter/tags are pure.
        needsCategories: type === "acopio" ? categorizeNeeds(needs) : [],
        capacity: clean(r.capacidad),
        verified: mod === "aprobado",
      };
    })
    .filter((p): p is ReliefPoint => p != null);
}

/**
 * Fetches the live relief points from our same-origin proxy. Aborts after
 * `timeoutMs` so a hung upstream can't stall the panel. Returns mappable,
 * moderation-visible points only.
 */
export async function fetchReliefPoints(
  { timeoutMs = 8000 }: { timeoutMs?: number } = {},
): Promise<ReliefPoint[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(RELIEF_POINTS_ENDPOINT, { signal: controller.signal });
    if (!res.ok) throw new Error(`Relief feed responded ${res.status}`);
    const rows = (await res.json()) as SourceRow[];
    return normalizeReliefRows(Array.isArray(rows) ? rows : []);
  } finally {
    clearTimeout(timer);
  }
}

/** Tally of points by type — drives the layer-toggle counts and legend. */
export interface ReliefTally {
  acopio: number;
  refugio: number;
  unverified: number;
  all: number;
  /** How many acopios fall in each need category — drives the chip counts. */
  categories: Record<NeedCategory, number>;
}

export function tallyRelief(points: ReliefPoint[]): ReliefTally {
  const categories = Object.fromEntries(
    NEED_CATEGORIES.map((c) => [c, 0]),
  ) as Record<NeedCategory, number>;
  const t: ReliefTally = { acopio: 0, refugio: 0, unverified: 0, all: points.length, categories };
  for (const p of points) {
    t[p.type] += 1;
    if (!p.verified) t.unverified += 1;
    for (const c of p.needsCategories) categories[c] += 1;
  }
  return t;
}
