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
  /** ISO-8601 timestamp of when this tool was added to the launcher. Drives the
   *  transient "newly added" badge, which the UI shows only for a short window
   *  (see NEW_TOOL_WINDOW_DAYS) and then drops automatically — no manual cleanup. */
  addedAt?: string;
}

/** How long (in days) a tool wears the "newly added" badge after its `addedAt`. */
export const NEW_TOOL_WINDOW_DAYS = 2;
export interface ReliefToolGroup {
  key: "people" | "damage" | "services" | "coordination" | "pets" | "organizations";
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
      // Doctor-maintained consolidated list of hospitalized patients (Dropbox .xlsx),
      // refreshed as residents submit new lists; the canonical share URL is stable
      // across updates. `rlkey` is the required Dropbox share key (kept); `dl=0`
      // opens the in-browser preview rather than forcing a download.
      { url: "https://www.dropbox.com/scl/fi/m4fbaw4metvkuay91fi0j/26JUN26-23.45-Pacientes-Consolidados-Hospitales-Venezuela.xlsx?rlkey=0bjem2yymn9q88qumzr33fisz&dl=0", labelKey: "tools.pacientes.label", subKey: "tools.pacientes.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Citizen-run clinical patient registry (non-profit): medical/paramedic staff
      // register & update patient records in real time; families can search a
      // hospitalized loved one by name (public view limited to name/age/hospital/
      // state; contact details hidden). Dual-purpose, listed here for the family
      // search use-case alongside the patient list above.
      { url: "https://buscatupaciente.netlify.app/", labelKey: "tools.buscapaciente.label", subKey: "tools.buscapaciente.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Non-profit, privacy-by-design registry to safely reunite unaccompanied
      // children with families (LOPNNA framework): no photos/locations published,
      // gated institutional access, in-person verification. The protected
      // counterpart to the open people-finders, for minors specifically.
      { url: "https://reencuentroseguro.com", labelKey: "tools.reencuentro.label", subKey: "tools.reencuentro.sub", addedAt: "2026-06-27T12:00:00-04:00" },
    ],
  },
  {
    key: "damage",
    titleKey: "tools.group.damage",
    tools: [
      { url: "https://sos.yummyrides.com/", labelKey: "tools.yummysos.label", subKey: "tools.yummysos.sub" },
      { url: DAMAGE_MAP_URL, labelKey: "tools.damagemap.label", subKey: "tools.damagemap.sub" },
      // Second community damage map (report building damage with level + photo;
      // also links out to a people-finder and drop-off centers). Listed after
      // Mapa de Daño, which is the Hub's live damage-layer source. Link-out only —
      // does not feed the seismic console's damage layer.
      { url: "https://sismovenezuela.org/", labelKey: "tools.sismovzla.label", subKey: "tools.sismovzla.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Post-quake structural assessment: submit photos of a damaged building and
      // volunteer civil engineers return an evaluation report by email.
      { url: "https://www.sismoayudave.com/", labelKey: "tools.sismoayuda.label", subKey: "tools.sismoayuda.sub", addedAt: "2026-06-27T12:00:00-04:00" },
    ],
  },
  {
    // Direct services — concrete help a person receives now (rides, interpreting,
    // a donation portal, a needs-matcher).
    key: "services",
    titleKey: "tools.group.services",
    tools: [
      { url: "https://heroes.yummyrides.com/", labelKey: "tools.yummyheroes.label", subKey: "tools.yummyheroes.sub" },
      { url: "https://interp-aid.lovable.app/", labelKey: "tools.interpaid.label", subKey: "tools.interpaid.sub" },
      { url: "https://dona.yummyrides.com/", labelKey: "tools.yummydona.label", subKey: "tools.yummydona.sub" },
      // Citizen-run platform matching people who need help with people offering it
      // (no accounts). The shared link's `fbclid` Facebook click-id is dropped — an
      // ephemeral tracking token, not part of the canonical URL.
      { url: "https://vzlayuda.com/", labelKey: "tools.vzlayuda.label", subKey: "tools.vzlayuda.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Network of volunteer psychologists (inside & outside Venezuela) offering
      // free emotional-support sessions to people living through the earthquake,
      // whether nearby or at a distance. Direct mental-health care a person
      // receives now — sits alongside the other direct services.
      { url: "https://escuchactiva.com/", labelKey: "tools.escuchactiva.label", subKey: "tools.escuchactiva.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Free medical teleconsultations for Caracas-quake victims, staffed by
      // Venezuelan doctors around the world. Direct clinical care delivered now
      // (remote), sibling to the volunteer-psychologist support above.
      { url: "https://www.medicosporvenezuela.org/", labelKey: "tools.medicosvzla.label", subKey: "tools.medicosvzla.sub", addedAt: "2026-06-27T12:00:00-04:00" },
    ],
  },
  {
    // Coordination & directories — registries you submit to (offer/request
    // resources, volunteer) and aggregators that index other tools. Distinct from
    // direct services: these coordinate the response rather than deliver aid.
    key: "coordination",
    titleKey: "tools.group.coordination",
    tools: [
      // Community-maintained map of donation drop-off centers (acopios) and shelters
      // (refugios) across all 24 states; filter by type/state, submit new points.
      { url: "https://acopios-refugios.vercel.app/", labelKey: "tools.acopios.label", subKey: "tools.acopios.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Verified meta-directory (Venezuela Solidaria, non-profit) aggregating tools
      // across health, missing persons, pets, engineers, donations/drop-offs,
      // shelters & services — a sibling aggregator to this Hub. Bilingual ES/EN.
      { url: "https://directorio-sismo.netlify.app/", labelKey: "tools.directorio.label", subKey: "tools.directorio.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // National heavy-machinery & equipment registry for safe debris removal,
      // ground stabilization and road clearing (Cámara Venezolana de la
      // Construcción + Cámara Petrolera). Register as provider/volunteer or
      // request help. The shared link's `utm_*` campaign params are dropped.
      { url: "https://cvcemergencia2026.netlify.app/", labelKey: "tools.cvc.label", subKey: "tools.cvc.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // National directory of volunteer physiotherapists: PTs register to help
      // (in their state or by travelling); health centers/hospitals/local govs
      // can reach the volunteer pool.
      { url: "https://fisioterapeutasvoluntarios.org/", labelKey: "tools.fisio.label", subKey: "tools.fisio.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Official AJE Venezuela (young entrepreneurs assoc.) aid platform: verified
      // drop-off points, organizations & initiatives — supply donation, volunteer,
      // money donation, report an initiative. Every entry reviewed & confirmed by AJE.
      { url: "https://ajevenezuela.org/ayuda-venezuela", labelKey: "tools.aje.label", subKey: "tools.aje.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Airbnb.org (Airbnb's nonprofit): free emergency housing for people impacted
      // by the Venezuela earthquakes, via its nonprofit partners. Canonical
      // Venezuela response page (the post's "link in bio").
      { url: "https://www.airbnb.org/venezuela-earthquakes", labelKey: "tools.airbnb.label", subKey: "tools.airbnb.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Drop-off center map focused on inter-center supply logistics: each point
      // lists what it has, what it urgently needs, and surplus it can share/transfer.
      // Complements acopios-refugios (which maps centers + shelters by state).
      { url: "https://centro-de-acopio-ven.vercel.app/", labelKey: "tools.acopioven.label", subKey: "tools.acopioven.sub", addedAt: "2026-06-27T12:00:00-04:00" },
    ],
  },
  {
    // Animals — their own domain, kept out of the people-finders and direct
    // services so a pet emergency is never misfiled as a person or a ride. Even
    // the meta-directories we link to treat pets as a separate category.
    key: "pets",
    titleKey: "tools.group.pets",
    tools: [
      // Pet-emergency platform: report lost pets, locate veterinary help, and
      // organize drop-off centers for animals affected by the earthquake.
      { url: "https://huellasasalvo.org/", labelKey: "tools.huellas.label", subKey: "tools.huellas.sub", addedAt: "2026-06-27T12:00:00-04:00" },
      // Second post-quake animal-response platform: report a lost pet, flag one
      // you found, or help with shelters/supplies; also a "see nearby needs"
      // donation view. Sibling to Huellas a Salvo (listed first).
      { url: "https://patitasasalvovenezuela.org/", labelKey: "tools.patitas.label", subKey: "tools.patitas.sub", addedAt: "2026-06-27T12:00:00-04:00" },
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
