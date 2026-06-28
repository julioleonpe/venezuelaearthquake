/**
 * Live community damage-report feed — terremotovenezuela.com (Supabase/PostgREST).
 *
 * Sibling of `usgs.ts`: queries the public `buildings` table and normalizes each
 * row into a small, presentation-ready shape. Network/parse failures surface as a
 * rejected promise so the console can degrade *that layer only* (the seismic layer
 * and the rest of the command center keep rendering).
 *
 * Trust note: these are COMMUNITY-REPORTED, UNVERIFIED records (every row is
 * `en_revision` — under review). They are deliberately kept out of the Hub's
 * verification gate and rendered as an attributed third-party overlay. We expose
 * only structural-damage fields here and intentionally DROP sensitive
 * missing-persons fields (`trapped_names`, `casualties_notes`) — that domain
 * belongs to the external People_Finder, not this Hub.
 */

import { DAMAGE_SOURCE } from "../config";

/** Community-reported damage severity, as authored by the source registry. */
export type DamageLevel = "parcial" | "severo" | "total";

export interface DamageReport {
  id: string;
  /** Building / place name, e.g. "Edificio Bancaribe". */
  name: string;
  /** Free-text address (may be approximate / "por confirmar"). */
  address: string | null;
  city: string | null;
  /** Neighborhood / sector, e.g. "Montalbán I". */
  zone: string | null;
  latitude: number;
  longitude: number;
  level: DamageLevel;
  /** Where the report came from, e.g. "Familia", "Coberturas de medios". */
  source: string | null;
  /** First photo, if the reporter attached one. */
  photoUrl: string | null;
  /** Last edit timestamp (ISO-8601 with tz). */
  updatedAt: string;
  /** Canonical per-report detail page on the source site. */
  url: string;
}

interface BuildingRow {
  id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  zone: string | null;
  lat: number | null;
  lng: number | null;
  damage_level: string | null;
  general_source: string | null;
  main_photo_url: string | null;
  last_updated_at: string | null;
  updated_at: string | null;
}

const VALID_LEVELS: ReadonlySet<string> = new Set(["parcial", "severo", "total"]);

/** Builds the PostgREST query URL — mappable rows only, freshest first. */
function buildUrl(limit: number): string {
  const params = new URLSearchParams({
    select: "id,name,address,city,zone,lat,lng,damage_level,general_source,main_photo_url,last_updated_at,updated_at",
    // Only rows we can actually place on the map (a portion of reports have no
    // coords yet). As of 2026-06 the source holds ~665 mappable rows and growing,
    // so the default limit is set well above that (see fetchDamageReports).
    lat: "not.is.null",
    lng: "not.is.null",
    order: "last_updated_at.desc",
    limit: String(limit),
  });
  return `${DAMAGE_SOURCE.restUrl}?${params.toString()}`;
}

/**
 * Fetches recent community damage reports. Aborts after `timeoutMs` so a hung
 * upstream can't stall the panel. Returns freshest-first, mappable rows only.
 */
export async function fetchDamageReports(
  { limit = 1500, timeoutMs = 8000 }: { limit?: number; timeoutMs?: number } = {},
): Promise<DamageReport[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(buildUrl(limit), {
      signal: controller.signal,
      headers: {
        apikey: DAMAGE_SOURCE.anonKey,
        Authorization: `Bearer ${DAMAGE_SOURCE.anonKey}`,
      },
    });
    if (!res.ok) throw new Error(`Damage feed responded ${res.status}`);
    const rows = (await res.json()) as BuildingRow[];
    return rows
      .filter(
        (r) =>
          r.lat != null &&
          r.lng != null &&
          r.damage_level != null &&
          VALID_LEVELS.has(r.damage_level),
      )
      .map((r) => ({
        id: r.id,
        name: r.name?.trim() || "—",
        address: r.address,
        city: r.city,
        zone: r.zone,
        latitude: r.lat as number,
        longitude: r.lng as number,
        level: r.damage_level as DamageLevel,
        source: r.general_source,
        photoUrl: r.main_photo_url,
        updatedAt: r.last_updated_at ?? r.updated_at ?? "",
        url: `${DAMAGE_SOURCE.siteUrl.replace(/\/$/, "")}/edificio/${r.id}`,
      }));
  } finally {
    clearTimeout(timer);
  }
}

/** Tally of reports by severity — drives the legend counts. */
export interface DamageTally {
  total: number;
  severo: number;
  parcial: number;
  all: number;
}

export function tallyDamage(reports: DamageReport[]): DamageTally {
  const t = { total: 0, severo: 0, parcial: 0, all: reports.length };
  for (const r of reports) t[r.level] += 1;
  return t;
}
