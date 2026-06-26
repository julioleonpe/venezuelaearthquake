/**
 * Hub configuration constants.
 *
 * The People_Finder is an existing, separately built external system; the Hub
 * only links out to it. Donations now feature an embedded recipient widget
 * (Caritas) in addition to verified link-out channels — see CLAUDE.md.
 */

/** The external People_Finder destination (separate, pre-existing system). */
export const PEOPLE_FINDER_URL = "https://venezuelatebusca.com/";

/**
 * Second external People_Finder — a separate, pre-existing community-run registry
 * of missing persons after the earthquake. The Hub only links out to it (new tab),
 * consistent with the People_Finder pattern; it neither builds nor embeds it.
 * (The `fbclid` Facebook click-id from the shared link is intentionally dropped:
 * it is an ephemeral tracking token, not part of the canonical URL.)
 */
export const PEOPLE_FINDER_2_URL = "https://desaparecidosterremotovenezuela.com/";

/**
 * External "Mapa de Daño" (damage map) — a separate, pre-existing community system
 * mapping earthquake damage. The Hub only links out to it (new tab), consistent
 * with the People_Finder pattern; it does not build or embed the map.
 */
export const DAMAGE_MAP_URL = "https://terremotovenezuela.com/";

/** Public site origin (ships at venezuelaearthquake2026.com). */
export const SITE_ORIGIN = "https://venezuelaearthquake2026.com";

/**
 * Caritas Internationalis — the launch donation channel, the Catholic Church's
 * international aid agency. The Donate tile links out to Caritas's own
 * "Bringing relief in Venezuela" appeal page, where donations are processed
 * entirely on Caritas's own infrastructure — the Hub never sees card data or
 * funds. Caritas Internationalis is a global confederation of 162 members that
 * can receive international donations and route them to relief partners on the
 * ground in Venezuela.
 */
export const CARITAS_SITE_URL = "https://donate.caritas.org/venezuela/";

/**
 * Embedded-widget support. Caritas (like most reputable charities) forbids being
 * framed — it serves `X-Frame-Options: SAMEORIGIN` and a `frame-ancestors 'self'`
 * CSP, so a browser refuses to render their donation form inside our iframe. That
 * anti-clickjacking posture is exactly what protects donors from scam clones, so
 * we honor it rather than fight it: embedding stays OFF and the Donate tile is a
 * branded, trustworthy link-out card. If a recipient ever provides an officially
 * embeddable form URL, set `CARITAS_EMBED_ENABLED = true` and point
 * `CARITAS_EMBED_URL` at it — the iframe code path in DonatePanel is ready.
 */
export const CARITAS_EMBED_ENABLED = false;
export const CARITAS_EMBED_URL = "";

/**
 * USGS earthquake feed region. Venezuela + near borders bounding box, used to
 * query the public FDSN event service for live regional seismicity.
 */
export const USGS_REGION = {
  minLatitude: 0,
  maxLatitude: 16,
  minLongitude: -74,
  maxLongitude: -59,
  /** Map view center + zoom (matches the regional framing). */
  center: [9.3, -66.5] as [number, number],
  zoom: 6,
};
