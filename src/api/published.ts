/**
 * Published curated dataset — the static, client-shipped relief content.
 *
 * The Hub is deployed as a pure static SPA (Vercel) with no backend, so the
 * curated content ships in the bundle and is **updated manually** by editing
 * this file. To honor the trust invariant ("unverified records must never be
 * sent to the browser"), this file contains ONLY verified, visitor-visible
 * records — no pending/rejected items live here. (The richer `seed.ts`, which
 * mixes verification statuses for the mock REST service + tests, is no longer
 * imported by the client bundle.)
 *
 * `store.ts` still runs every read through the pure domain gate
 * (`isVisibleToVisitor`, `orderedVerifiedNews`, `visibleDonations`,
 * `searchResources`), so the verified-only guarantee, newest-first ordering,
 * donation completeness, and search all stay enforced by the same tested logic.
 *
 * ── To update content ──────────────────────────────────────────────────────
 *  • Add/edit/remove entries below. Keep `verificationStatus: "verified"`.
 *  • News shows newest-first by `publishedAt`; donations need recipient +
 *    description + destination link or they're dropped; resources are grouped
 *    by `category`. Use ISO-8601 timestamps WITH timezone.
 */

import type { DonationChannel, NewsItem, ResourceEntry } from "../domain/types";

export const publishedNews: NewsItem[] = [
  {
    id: "n0",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T14:00:00-04:00",
    updatedAt: "2026-06-27T09:52:00-04:00",
    // Primary source: The New York Times live coverage. Kept first.
    headline: "Live coverage: Rescuers race a narrowing window as quake death toll rises to 920",
    summary:
      "The New York Times is tracking the aftermath of the two earthquakes — the stronger at magnitude 7.5 — with continuously updated reporting. Venezuela's government says the death toll has risen to 920 with about 3,360 injured and 172 still trapped, as international search-and-rescue teams from more than a dozen countries work through the latter part of the 72-hour window humanitarian groups consider critical for finding survivors. Roughly 1,400 buildings were damaged, including 13 hospitals, with the heaviest devastation in La Guaira state north of Caracas.",
    sourceAttribution: "The New York Times",
    sourceLink: "https://www.nytimes.com/live/2026/06/27/world/venezuela-earthquake",
    publishedAt: "2026-06-27T09:52:00-04:00",
  },
  {
    id: "n-cnn-vis",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-26T09:00:00-04:00",
    updatedAt: "2026-06-26T09:00:00-04:00",
    headline: "A visual guide to the Venezuela earthquakes",
    summary:
      "CNN maps the disaster with charts and satellite imagery: the two quakes were a rare 'doublet,' with the 7.5 magnitude main shock striking 39 seconds after a 7.2 foreshock — the largest recorded earthquake in Venezuela in more than a century. More than 100 buildings have collapsed in La Guaira state, designated a disaster zone.",
    sourceAttribution: "CNN",
    sourceLink: "https://www.cnn.com/2026/06/25/americas/venezuela-earthquake-map-vis",
    publishedAt: "2026-06-26T09:10:00-04:00",
  },
  {
    id: "n-cbs",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T13:30:00-04:00",
    updatedAt: "2026-06-25T13:30:00-04:00",
    headline: "Venezuela earthquakes kill at least 188 as La Guaira becomes a disaster zone",
    summary:
      "At least 188 people are dead and about 1,500 injured after back-to-back magnitude 7.2 and 7.5 quakes struck 39 seconds apart. The coastal state of La Guaira is the hardest hit, and a 22-story building collapsed in the Altamira area of Caracas.",
    sourceAttribution: "CBS News",
    sourceLink: "https://www.cbsnews.com/news/venezuela-earthquakes-death-toll-damage-la-guaira/",
    publishedAt: "2026-06-25T13:20:00-04:00",
  },
  {
    id: "n-reuters",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T12:30:00-04:00",
    updatedAt: "2026-06-25T12:30:00-04:00",
    headline: "Thousands feared dead after two major earthquakes strike Venezuela",
    summary:
      "Reuters reports that two major earthquakes have struck Venezuela, with thousands feared dead as rescue crews search collapsed buildings and authorities declare a state of emergency across the worst-affected western regions.",
    sourceAttribution: "Reuters",
    sourceLink:
      "https://www.reuters.com/business/environment/thousands-feared-dead-after-two-major-earthquakes-strike-venezuela-2026-06-25/",
    publishedAt: "2026-06-25T12:15:00-04:00",
  },
  {
    id: "n-npr-science",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T11:30:00-04:00",
    updatedAt: "2026-06-25T11:30:00-04:00",
    headline: "What made the deadly Venezuelan earthquakes different",
    summary:
      "NPR examines why the twin quakes were so destructive: two powerful, shallow ruptures striking seconds apart in a country that sits away from the Pacific 'Ring of Fire,' amplifying the damage to unprepared communities.",
    sourceAttribution: "NPR",
    sourceLink: "https://www.npr.org/2026/06/25/nx-s1-5870557/what-made-the-deadly-venezuelan-earthquakes-different",
    publishedAt: "2026-06-25T11:15:00-04:00",
  },
  {
    id: "n-ifrc",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T11:00:00-04:00",
    updatedAt: "2026-06-25T11:00:00-04:00",
    headline:
      "Venezuela: Red Cross responds as needs emerge in aftermath of powerful back-to-back earthquakes",
    summary:
      "The IFRC reports that Venezuelan Red Cross volunteers are providing first aid, search-and-rescue support, and emergency relief as humanitarian needs grow following the two earthquakes.",
    sourceAttribution: "IFRC",
    sourceLink:
      "https://www.ifrc.org/press-release/venezuela-red-cross-responds-needs-emerge-aftermath-powerful-back-back-earthquakes",
    publishedAt: "2026-06-25T10:45:00-04:00",
  },
  {
    id: "n-npr-photos",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T10:30:00-04:00",
    updatedAt: "2026-06-25T10:30:00-04:00",
    headline: "Photos: See the destruction in Venezuela after the earthquakes",
    summary:
      "An NPR photo essay documenting the scale of destruction across Venezuela — collapsed buildings, rescue operations, and displaced residents in the aftermath of the twin quakes.",
    sourceAttribution: "NPR",
    sourceLink:
      "https://www.npr.org/sections/the-picture-show/2026/06/25/nx-s1-5870661/photos-see-venezuela-destruction-after-earthquakes",
    publishedAt: "2026-06-25T10:15:00-04:00",
  },
  {
    id: "n-nbc",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T10:00:00-04:00",
    updatedAt: "2026-06-25T10:00:00-04:00",
    headline: "Satellite images show aftermath of earthquakes in Venezuela",
    summary:
      "NBC News presents satellite imagery revealing the extent of the earthquake damage across affected regions of Venezuela, showing collapsed structures and disruption to infrastructure.",
    sourceAttribution: "NBC News",
    sourceLink:
      "https://www.nbcnews.com/video/shorts/satellite-images-show-aftermath-of-earthquakes-in-venezuela-265699909671",
    publishedAt: "2026-06-25T09:45:00-04:00",
  },
];

export const publishedDonations: DonationChannel[] = [
  {
    id: "d1",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T10:00:00-04:00",
    updatedAt: "2026-06-25T07:00:00-04:00",
    recipientOrganization: "Caritas — Bringing Relief in Venezuela Appeal",
    description:
      "Emergency appeal funding food, clean water, shelter, and medical aid for affected families. Donations are processed on Caritas's own official site.",
    destinationLink: "https://donate.caritas.org/venezuela/",
    affiliationLabel: "International aid agency of the Catholic Church",
  },
  {
    id: "d2",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T11:30:00-04:00",
    updatedAt: "2026-06-24T11:30:00-04:00",
    recipientOrganization: "International Federation of Red Cross (IFRC)",
    description:
      "Supports the Venezuelan Red Cross with emergency health, water, and sanitation response. Funds the deployment of trained volunteers and relief supplies.",
    destinationLink: "https://www.ifrc.org/emergencies",
    affiliationLabel: "Global Red Cross and Red Crescent network",
  },
  {
    id: "d3",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-24T12:45:00-04:00",
    updatedAt: "2026-06-24T12:45:00-04:00",
    recipientOrganization: "UNICEF — Niñez en Emergencia",
    description:
      "Atención a la infancia afectada: nutrición, agua segura, espacios protegidos y apoyo psicosocial para niñas y niños desplazados por el terremoto.",
    destinationLink: "https://www.unicef.org/emergencies",
    affiliationLabel: "Fondo de las Naciones Unidas para la Infancia",
  },
  {
    id: "d10",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-26T11:10:00-04:00",
    updatedAt: "2026-06-26T11:10:00-04:00",
    // International Rescue Committee — confirmed live event-specific press release with
    // donate CTAs. IRC has operated in Venezuela since 2021. Funds processed on rescue.org.
    recipientOrganization: "International Rescue Committee (IRC) — Venezuela Earthquake Response",
    description:
      "Mobilizing an emergency response in the hardest-hit areas: distribution of essential relief items and emergency medical supplies to frontline workers, building on the IRC's health and protection work in Venezuela since 2021. Donations are processed on the IRC's own site.",
    destinationLink: "https://www.rescue.org/press-release/venezuela-irc-launches-emergency-response-twin-earthquakes",
    affiliationLabel: "International humanitarian NGO",
  },
  {
    id: "d8",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-26T11:00:00-04:00",
    updatedAt: "2026-06-26T11:00:00-04:00",
    // World Central Kitchen — event-specific campaign donate page confirmed live
    // (multi-currency; Charity Navigator 4-star / Candid Platinum). Funds processed
    // on WCK's own platform — the Hub only links out.
    recipientOrganization: "World Central Kitchen — Venezuela Earthquake Relief",
    description:
      "Funds fresh meals for families and first responders affected by the earthquakes, served through WCK's Relief Team and longtime local partners. Donations are processed on World Central Kitchen's own platform.",
    destinationLink: "https://donate.wck.org/campaign/815521/donate",
    affiliationLabel: "Disaster-relief nonprofit founded by chef José Andrés (501(c)(3))",
  },
  {
    id: "d9",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-26T11:05:00-04:00",
    updatedAt: "2026-06-26T11:05:00-04:00",
    // Direct Relief — event page states 100% of donations go to Venezuela earthquake
    // response; coordinates medical aid with local providers and PAHO. Link-out only.
    recipientOrganization: "Direct Relief — Venezuela Earthquake Response",
    description:
      "Funds emergency medical aid — wound care, surgical supplies, antibiotics, and field medic packs — mobilized to health providers near the epicenter. Direct Relief states 100% of donations go to Venezuela earthquake response, processed on its own site.",
    destinationLink: "https://www.directrelief.org/2026/06/venezuela-earthquake-caracas-damage/",
    affiliationLabel: "U.S. medical relief nonprofit (501(c)(3))",
  },
  {
    id: "d6",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-26T10:00:00-04:00",
    updatedAt: "2026-06-26T10:00:00-04:00",
    // Healing Venezuela — UK-registered medical relief charity (Charity Comm. no. 1170709).
    // Primary link-out is the GlobalGiving project (multi-currency, built for international
    // donors, third-party vetted). Funds are processed on GlobalGiving's platform, not the Hub.
    recipientOrganization: "Healing Venezuela — Earthquake Emergency Appeal",
    description:
      "Funds emergency medical response to the June 2026 earthquake: first-aid supplies and trauma kits for hospitals, treatment of the injured by the charity's doctors, and distribution of potable water. Donations are processed on GlobalGiving's platform.",
    destinationLink: "https://www.globalgiving.org/projects/emergency-appeal-earthquake-in-venezuela/",
    affiliationLabel: "UK-registered medical relief charity (Charity Comm. no. 1170709) working in Venezuela",
  },
  {
    id: "d7",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-26T10:05:00-04:00",
    updatedAt: "2026-06-26T10:05:00-04:00",
    // Yummy donation portal. Unlike the pass-through charities, funds move on Yummy's OWN
    // infrastructure (Stripe / Pago Móvil / ACH). The Hub honors its "never proxy funds"
    // invariant by LINKING OUT to Yummy's portal — never embedding the donation flow.
    recipientOrganization: "Yummy — Donaciones por el terremoto",
    description:
      "Portal de donaciones de Yummy para la emergencia, con Pago Móvil, tarjeta internacional y ACH. Yummy iguala el 25% de lo recaudado hasta $100.000. Los fondos se procesan en la propia plataforma de Yummy.",
    destinationLink: "https://dona.yummyrides.com/",
    affiliationLabel: "Super-app venezolana (Yummy Rides)",
  },
];

export const publishedResources: ResourceEntry[] = [
  {
    id: "r1",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T09:00:00-04:00",
    updatedAt: "2026-06-24T09:00:00-04:00",
    name: "National Civil Protection — Shelter Locator",
    description:
      "Official directory of open emergency shelters, capacity status, and accepted donations by location.",
    category: "Shelter",
    sourceLink: "https://example.gob.ve/proteccion-civil",
  },
  {
    id: "r2",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-24T09:20:00-04:00",
    updatedAt: "2026-06-24T09:20:00-04:00",
    name: "Médicos por Venezuela — Atención primaria",
    description:
      "Red de brigadas médicas voluntarias que ofrecen atención primaria gratuita y derivación hospitalaria en zonas afectadas.",
    category: "Medical",
    sourceLink: "https://example.org/medicos-vzla",
  },
  {
    id: "r3",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T10:10:00-04:00",
    updatedAt: "2026-06-24T10:10:00-04:00",
    name: "Clean Water Distribution Points",
    description:
      "Map and schedule of potable water distribution operated by relief partners. Bring your own containers where possible.",
    category: "Water & Food",
    sourceLink: "https://example.org/water-points",
  },
  {
    id: "r4",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T10:40:00-04:00",
    updatedAt: "2026-06-24T10:40:00-04:00",
    // Verified, no source link → "unverified source" label but still shown (Req 7.2).
    name: "Family Reunification Helpline",
    description:
      "Multilingual phone line for reporting and locating separated family members. Operated in coordination with relief agencies.",
    category: "Missing Persons",
    sourceLink: null,
  },
  {
    id: "r5",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-24T11:00:00-04:00",
    updatedAt: "2026-06-24T11:00:00-04:00",
    name: "Apoyo psicosocial en crisis",
    description:
      "Líneas de apoyo emocional y primeros auxilios psicológicos para personas afectadas y personal de respuesta.",
    category: "Mental Health",
    sourceLink: "https://example.org/apoyo-psicosocial",
  },
  {
    id: "r6",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T11:30:00-04:00",
    updatedAt: "2026-06-24T11:30:00-04:00",
    name: "Volunteer Coordination Registry",
    description:
      "Sign up to volunteer with vetted relief organizations. Lists current needs by skill, location, and shift.",
    category: "Volunteering",
    sourceLink: "https://example.org/volunteer",
  },
  {
    id: "r8",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-26T10:10:00-04:00",
    updatedAt: "2026-06-26T10:10:00-04:00",
    // Yummy "Heroes" — verified first-party Yummy program (free/subsidized rides for
    // first responders). Service link-out only; no funds involved.
    name: "Yummy Heroes — Viajes para personal de emergencias",
    description:
      "Personal de emergencias (paramédicos, bomberos, rescatistas, Protección Civil, Cruz Roja, policía) registra su cuenta de Yummy para activar viajes subsidiados durante la emergencia.",
    category: "Transportation",
    sourceLink: "https://heroes.yummyrides.com/",
  },
  {
    id: "r9",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-26T10:15:00-04:00",
    updatedAt: "2026-06-26T10:15:00-04:00",
    // Missing-persons registry. Community-run; self-presents as independent and non-profit.
    name: "Ubicados Venezuela — Registro de personas",
    description:
      "Registro comunitario para reportar y buscar personas tras el terremoto, con detección de duplicados asistida por IA y validación humana. También permite proponer centros de acopio y reportar edificaciones afectadas.",
    category: "Missing Persons",
    sourceLink: "https://ubicadosvzla.com/",
  },
  {
    id: "r10",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-26T10:20:00-04:00",
    updatedAt: "2026-06-26T10:20:00-04:00",
    // Encuéntralos — community missing-persons registry (also aggregates shelters, donation
    // points, affected zones). Included for completeness as a tool in the directory.
    name: "Encuéntralos — Buscador de personas",
    description:
      "Iniciativa ciudadana para reportar y buscar personas desaparecidas tras el terremoto. Incluye directorio de teléfonos de emergencia, refugios, centros de acopio y zonas afectadas.",
    category: "Missing Persons",
    sourceLink: "https://encuentralos.tecnosoft.dev/",
  },
];
