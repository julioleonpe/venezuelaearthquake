/**
 * Live seismic feed — USGS FDSN event service (public, no key).
 *
 * Queries real earthquakes in the Venezuela region and normalizes the GeoJSON
 * into a small, presentation-ready shape. Network/parse failures surface as a
 * rejected promise so the console panel can degrade gracefully (the rest of the
 * command center keeps rendering).
 *
 * Docs: https://earthquake.usgs.gov/fdsnws/event/1/
 */

import { USGS_REGION } from "../config";

export interface Quake {
  id: string;
  /** Richter/moment magnitude. */
  magnitude: number;
  /** USGS place string, e.g. "28 km SE of Yumare, Venezuela". */
  place: string;
  /** Event time (epoch ms). */
  time: number;
  /** Depth in km. */
  depthKm: number;
  latitude: number;
  longitude: number;
  /** Canonical USGS event page. */
  url: string;
}

const FDSN_ENDPOINT = "https://earthquake.usgs.gov/fdsnws/event/1/query";

/** Builds the regional query URL. Last `days` of events, strongest-relevant first. */
function buildUrl(days: number, limit: number): string {
  const params = new URLSearchParams({
    format: "geojson",
    minlatitude: String(USGS_REGION.minLatitude),
    maxlatitude: String(USGS_REGION.maxLatitude),
    minlongitude: String(USGS_REGION.minLongitude),
    maxlongitude: String(USGS_REGION.maxLongitude),
    orderby: "time",
    limit: String(limit),
    starttime: new Date(Date.now() - days * 86_400_000).toISOString(),
  });
  return `${FDSN_ENDPOINT}?${params.toString()}`;
}

interface UsgsFeature {
  id: string;
  properties: { mag: number | null; place: string | null; time: number; url: string };
  geometry: { coordinates: [number, number, number] }; // [lon, lat, depth]
}

/**
 * Fetches recent regional quakes. Aborts after `timeoutMs` so a hung upstream
 * doesn't stall the panel. Returns newest-first.
 */
export async function fetchRegionalQuakes(
  { days = 30, limit = 60, timeoutMs = 8000 }: { days?: number; limit?: number; timeoutMs?: number } = {},
): Promise<Quake[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(buildUrl(days, limit), { signal: controller.signal });
    if (!res.ok) throw new Error(`USGS responded ${res.status}`);
    const json = (await res.json()) as { features: UsgsFeature[] };
    return json.features
      .filter((f) => f.properties.mag != null && f.geometry?.coordinates)
      .map((f) => {
        const [lon, lat, depth] = f.geometry.coordinates;
        return {
          id: f.id,
          magnitude: f.properties.mag as number,
          place: f.properties.place ?? "Unknown location",
          time: f.properties.time,
          depthKm: depth,
          latitude: lat,
          longitude: lon,
          url: f.properties.url,
        };
      })
      .sort((a, b) => b.time - a.time);
  } finally {
    clearTimeout(timer);
  }
}

/** Seismic intensity band → drives the amber→red magnitude scale. */
export type MagnitudeBand = "minor" | "light" | "moderate" | "strong" | "major";

export function magnitudeBand(mag: number): MagnitudeBand {
  if (mag >= 7) return "major";
  if (mag >= 6) return "strong";
  if (mag >= 5) return "moderate";
  if (mag >= 4) return "light";
  return "minor";
}

/** Compact "6h ago" / "8d ago" relative label. `now` injectable for testing. */
export function relativeTime(time: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - time);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
