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
 * mapping earthquake damage. The Hub links out to it (new tab) from the relief-tools
 * launcher; it no longer feeds the map centerpiece.
 */
export const DAMAGE_MAP_URL = "https://terremotovenezuela.com/";

/**
 * External "Acopios y Refugios" map — a community-run ("Venezuela Resiste") crisis
 * map of donation collection centers (acopios) and shelters (refugios) across all
 * Venezuelan states. This is the source behind the Hub's map centerpiece; the
 * client links out here for attribution + "report a point".
 *
 * The point data itself ships as a bundled STATIC SNAPSHOT
 * (src/data/relief-points.json, refreshed via `npm run relief:refresh`) rather than
 * fetched live: the site's underlying Google Apps Script endpoint 302-redirects to
 * script.googleusercontent.com, and that cross-origin redirect trips the browser's
 * CORS check, so a live browser fetch can't reach it. It is deliberately kept OUT
 * of the Hub's verification gate — third-party, community-reported data, attributed
 * and normalized client-side (see src/lib/acopios.ts), with each point's
 * "sin verificar" state preserved.
 */
export const ACOPIOS_MAP_URL = "https://acopios-refugios.vercel.app/";

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
      // Mapa de Daño. Link-out only — the Hub's live map centerpiece is the
      // acopios & refugios feed, not a damage layer.
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
 * GiveDirectly — the featured donation channel. GiveDirectly is a U.S. 501(c)(3)
 * (EIN 27-1661997) that delivers unconditional cash transfers directly to the
 * highest-need survivors (about $340/person, targeted via damage + poverty data).
 * The Donate tile links out to GiveDirectly's own "Venezuela Earthquakes" appeal,
 * where donations are processed entirely on GiveDirectly's own infrastructure —
 * the Hub never sees card data or funds. U.S. donations are tax-deductible.
 * (Caritas remains a verified channel, now surfaced in the "more channels" list.)
 */
export const FEATURED_DONATE_URL = "https://www.givedirectly.org/venezuela-earthquakes";

/**
 * Embedded-widget support. Reputable charities (GiveDirectly included) forbid
 * being framed — they serve `X-Frame-Options: SAMEORIGIN` and a
 * `frame-ancestors 'self'` CSP, so a browser refuses to render their donation
 * form inside our iframe. That anti-clickjacking posture is exactly what protects
 * donors from scam clones, so we honor it rather than fight it: embedding stays
 * OFF and the Donate tile is a branded, trustworthy link-out card. If a recipient
 * ever provides an officially embeddable form URL, set `FEATURED_EMBED_ENABLED =
 * true` and point `FEATURED_EMBED_URL` at it — the iframe path in DonatePanel is ready.
 */
export const FEATURED_EMBED_ENABLED = false;
export const FEATURED_EMBED_URL = "";

/**
 * Default map framing for the relief-map centerpiece — centered on Venezuela
 * (near Caracas, where the relief points cluster) with a country-wide zoom.
 */
export const MAP_VIEW = {
  center: [10.2, -66.9] as [number, number],
  zoom: 7,
};
