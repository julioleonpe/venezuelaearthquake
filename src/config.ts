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
 * mapping earthquake damage. The Hub links out to it (new tab), and now also pulls
 * its public report data live onto the seismic console map (see DAMAGE_SOURCE).
 */
export const DAMAGE_MAP_URL = "https://terremotovenezuela.com/";

/**
 * Live community damage-report feed. terremotovenezuela.com is a community-run,
 * Supabase-backed registry of buildings reported damaged by the earthquake; its
 * `buildings` table is exposed read-only via PostgREST with a public publishable
 * key (the same key the site ships in its own browser bundle). We pull it live as
 * a clearly-labelled, *community-reported / unverified* overlay on the seismic map.
 *
 * This is deliberately NOT routed through the Hub's verification gate: it is
 * third-party data the Hub neither owns nor curates, presented as an attributed
 * external layer — never laundered into the Hub's own verified record types.
 */
export const DAMAGE_SOURCE = {
  restUrl: "https://jckifxsdlnsvbztxydes.supabase.co/rest/v1/buildings",
  /** Public publishable (anon) key — read-only, safe to ship client-side. */
  anonKey: "sb_publishable_i7iEDrCVZcSt0k3RGFrY4g_WrtZBB4w",
  /** Canonical site, for attribution + per-report detail links. */
  siteUrl: DAMAGE_MAP_URL,
  hostLabel: "terremotovenezuela.com",
} as const;

/**
 * Relief Tools & Apps — the single source of truth for the outbound apps/tools
 * launcher on the command center. These are external, pre-existing systems the
 * Hub only links out to (new tab, via ExternalLink); it neither builds nor curates
 * them. Grouping them here (instead of splitting finders across config constants
 * AND resource entries) keeps the launcher consistent and lets it scale as more
 * tools arrive. Each item's `labelKey`/`subKey` resolve in the i18n catalog so the
 * chrome stays bilingual; `note` is an optional inline scope hint (already localized
 * copy lives in the catalog when it must be translated).
 *
 * Ordering within a group is meaningful: the most authoritative / broadest-coverage
 * tool is listed first so the multiple people-finders read as ranked alternatives.
 */
export interface ReliefTool {
  url: string;
  labelKey: string;
  subKey: string;
  /** When true, `url` is an in-app route (rendered as a client-side <Link>, not a
   *  new-tab external anchor). Used by the in-Hub stakeholder map. */
  internal?: boolean;
}
export interface ReliefToolGroup {
  key: "people" | "damage" | "services" | "donate" | "organizations";
  titleKey: string;
  tools: ReliefTool[];
}

export const RELIEF_TOOLS: ReliefToolGroup[] = [
  {
    key: "people",
    titleKey: "tools.group.people",
    tools: [
      { url: PEOPLE_FINDER_URL, labelKey: "tools.vtb.label", subKey: "tools.vtb.sub" },
      { url: PEOPLE_FINDER_2_URL, labelKey: "tools.dtv.label", subKey: "tools.dtv.sub" },
      { url: "https://ubicadosvzla.com/", labelKey: "tools.ubicados.label", subKey: "tools.ubicados.sub" },
      { url: "https://encuentralos.tecnosoft.dev/", labelKey: "tools.encuentralos.label", subKey: "tools.encuentralos.sub" },
    ],
  },
  {
    key: "damage",
    titleKey: "tools.group.damage",
    tools: [
      { url: "https://sos.yummyrides.com/", labelKey: "tools.yummysos.label", subKey: "tools.yummysos.sub" },
      { url: DAMAGE_MAP_URL, labelKey: "tools.damagemap.label", subKey: "tools.damagemap.sub" },
    ],
  },
  {
    key: "services",
    titleKey: "tools.group.services",
    tools: [
      { url: "https://heroes.yummyrides.com/", labelKey: "tools.yummyheroes.label", subKey: "tools.yummyheroes.sub" },
      { url: "https://interp-aid.lovable.app/", labelKey: "tools.interpaid.label", subKey: "tools.interpaid.sub" },
      { url: "https://dona.yummyrides.com/", labelKey: "tools.yummydona.label", subKey: "tools.yummydona.sub" },
    ],
  },
  {
    // Mirrors the verified Donate channels — intentionally duplicated here so the
    // launcher is a complete index of where to give as well as which tools exist.
    key: "donate",
    titleKey: "tools.group.donate",
    tools: [
      { url: "https://donate.caritas.org/venezuela/", labelKey: "tools.caritas.label", subKey: "tools.caritas.sub" },
      { url: "https://www.ifrc.org/emergencies", labelKey: "tools.ifrc.label", subKey: "tools.ifrc.sub" },
      { url: "https://www.unicef.org/emergencies", labelKey: "tools.unicef.label", subKey: "tools.unicef.sub" },
      { url: "https://www.rescue.org/press-release/venezuela-irc-launches-emergency-response-twin-earthquakes", labelKey: "tools.irc.label", subKey: "tools.irc.sub" },
      { url: "https://donate.wck.org/campaign/815521/donate", labelKey: "tools.wck.label", subKey: "tools.wck.sub" },
      { url: "https://www.directrelief.org/2026/06/venezuela-earthquake-caracas-damage/", labelKey: "tools.directrelief.label", subKey: "tools.directrelief.sub" },
      { url: "https://www.globalgiving.org/projects/emergency-appeal-earthquake-in-venezuela/", labelKey: "tools.healing.label", subKey: "tools.healing.sub" },
      { url: "https://dona.yummyrides.com/", labelKey: "tools.yummydona.label", subKey: "tools.yummydona.sub" },
    ],
  },
  {
    // Relief organizations — the in-Hub stakeholder map: a reference index of who is
    // responding, grouped by function. A single in-app route (not an external link),
    // so the launcher app navigates to /stakeholders inside the Hub. The map itself
    // links out to each organization (PAHO, OCHA, etc.) with the usual host labels.
    key: "organizations",
    titleKey: "tools.group.organizations",
    tools: [
      { url: "/stakeholders", labelKey: "tools.stakeholders.label", subKey: "tools.stakeholders.sub", internal: true },
    ],
  },
];

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
