/**
 * Collection-center & shelter layer — acopios-refugios.vercel.app
 * ("Venezuela Resiste"), a community-run crisis map of earthquake-relief points.
 *
 * This is a STATIC SNAPSHOT, not a live feed. A daily script
 * (scripts/fetch-relief-points.mjs, `npm run relief:refresh`) pulls the upstream
 * server-side and writes src/data/relief-points.json, which ships in the bundle.
 * We moved off a live fetch on purpose: the upstream (a Google Apps Script Web App)
 * 302-redirects cross-origin, tripping the browser's CORS check on a direct fetch,
 * and the serverless proxy that worked around that kept failing on Vercel
 * ("live relief-point data is temporarily unavailable"). A bundled snapshot renders
 * instantly and can never be "unavailable" — at the cost of being at most a day
 * stale, which is fine for a moderated registry that changes slowly.
 *
 * `normalizeReliefRows` still applies the moderation gate and shapes each row, so
 * the trust logic lives in one pure, tested place regardless of where the rows came
 * from.
 *
 * Trust note: these are COMMUNITY-REPORTED points. Collection centers (acopios)
 * publish instantly with a "sin verificar" (unverified) stamp; shelters (refugios)
 * are moderated before publishing. This is third-party data the Hub neither owns
 * nor curates — it is deliberately kept OUT of the Hub's verification gate and
 * rendered as a clearly-attributed external layer, with the per-point unverified
 * state preserved so it is never presented as vetted. The Hub also refers people
 * to the source site so they can report new points there.
 */

import snapshot from "../data/relief-points.json";

/** When the bundled snapshot was pulled from the source (ISO-8601). */
export const RELIEF_SNAPSHOT_AT: string = snapshot.generatedAt;

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
  contacto: string | null;
  necesidades: string | null;
  capacidad: string | null;
  estado_moderacion: string | null;
}

const VALID_TYPES: ReadonlySet<string> = new Set(["acopio", "refugio"]);

function clean(s: string | null | undefined): string | null {
  const v = (s ?? "").trim();
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
        needs: clean(r.necesidades),
        capacity: clean(r.capacidad),
        verified: mod === "aprobado",
      };
    })
    .filter((p): p is ReliefPoint => p != null);
}

/**
 * Returns mappable, moderation-visible relief points from the bundled snapshot.
 * No network — the data ships in the bundle — so this can never be "unavailable".
 * Kept async (Promise-returning) so `ReliefConsole`'s loading contract is
 * unchanged; refresh the underlying data with `npm run relief:refresh`.
 */
export function fetchReliefPoints(): Promise<ReliefPoint[]> {
  const rows = Array.isArray(snapshot.rows) ? (snapshot.rows as SourceRow[]) : [];
  return Promise.resolve(normalizeReliefRows(rows));
}

/** Tally of points by type — drives the layer-toggle counts and legend. */
export interface ReliefTally {
  acopio: number;
  refugio: number;
  unverified: number;
  all: number;
}

export function tallyRelief(points: ReliefPoint[]): ReliefTally {
  const t = { acopio: 0, refugio: 0, unverified: 0, all: points.length };
  for (const p of points) {
    t[p.type] += 1;
    if (!p.verified) t.unverified += 1;
  }
  return t;
}
