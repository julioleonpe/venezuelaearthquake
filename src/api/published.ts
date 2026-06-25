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
    createdAt: "2026-06-25T09:30:00-04:00",
    updatedAt: "2026-06-25T09:30:00-04:00",
    // Primary source: The New York Times live coverage. Kept first.
    headline: "Live coverage: Powerful earthquakes hit western Venezuela",
    summary:
      "The New York Times is tracking the aftermath of the two earthquakes — the stronger at magnitude 7.5 — with continuously updated reporting on casualties, damage, and the international relief response.",
    sourceAttribution: "The New York Times",
    sourceLink: "https://www.nytimes.com/live/2026/06/24/world/venezuela-earthquake",
    publishedAt: "2026-06-25T09:15:00-04:00",
  },
  {
    id: "n-reuters",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T09:10:00-04:00",
    updatedAt: "2026-06-25T09:10:00-04:00",
    headline: "US says it is mobilizing assistance to Venezuela after earthquakes",
    summary:
      "The United States says it is mobilizing emergency assistance for Venezuela following the twin earthquakes, as international relief efforts ramp up across the affected region.",
    sourceAttribution: "Reuters",
    sourceLink:
      "https://www.reuters.com/world/americas/us-says-it-is-mobilizing-assistance-venezuela-after-earthquakes-2026-06-25/",
    publishedAt: "2026-06-25T09:08:00-04:00",
  },
  {
    id: "n-cnn",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T09:06:00-04:00",
    updatedAt: "2026-06-25T09:06:00-04:00",
    headline: "Venezuela earthquake: Live updates and Puerto Rico tsunami advisory",
    summary:
      "CNN's live coverage of the Venezuela earthquakes, including the tsunami advisory issued for Puerto Rico, evolving casualty figures, and the regional emergency response.",
    sourceAttribution: "CNN",
    sourceLink:
      "https://www.cnn.com/2026/06/24/weather/live-news/venezuela-earthquake-puerto-rico-tsunami",
    publishedAt: "2026-06-25T09:05:00-04:00",
  },
  {
    id: "n-un",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-25T08:55:00-04:00",
    updatedAt: "2026-06-25T08:55:00-04:00",
    headline:
      "Desastre por terremotos en Venezuela: la ONU coordina ayuda de emergencia internacional para ayudar a las víctimas",
    summary:
      "Naciones Unidas coordina la respuesta humanitaria internacional tras los terremotos en Venezuela, movilizando equipos y suministros de emergencia para apoyar a las personas afectadas.",
    sourceAttribution: "Noticias ONU",
    sourceLink: "https://news.un.org/es/story/2026/06/1541604",
    publishedAt: "2026-06-25T08:50:00-04:00",
  },
  {
    id: "n-ap",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T08:45:00-04:00",
    updatedAt: "2026-06-25T08:45:00-04:00",
    headline: "Photos: Earthquake damage in Caracas, Venezuela",
    summary:
      "An Associated Press photo gallery documenting the destruction in Caracas and surrounding areas — collapsed structures, rescue efforts, and displaced residents in the quakes' aftermath.",
    sourceAttribution: "Associated Press",
    sourceLink:
      "https://apnews.com/photo-gallery/venezuela-earthquake-caracas-8ac96a783cd3c3b4312653806511d824",
    publishedAt: "2026-06-25T08:40:00-04:00",
  },
  {
    id: "n1",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T09:10:00-04:00",
    updatedAt: "2026-06-25T09:10:00-04:00",
    headline: "Venezuela earthquakes live: 164 killed, many buried as US offers support",
    summary:
      "Al Jazeera's live blog tracks rescue operations as crews search collapsed buildings, hospitals treat the injured, and the United States pledges assistance following the twin quakes.",
    sourceAttribution: "Al Jazeera",
    sourceLink:
      "https://www.aljazeera.com/news/liveblog/2026/6/25/venezuela-earthquakes-live-two-powerful-quakes-shake-s-american-country",
    publishedAt: "2026-06-25T08:30:00-04:00",
  },
  {
    id: "n2",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T08:20:00-04:00",
    updatedAt: "2026-06-25T08:20:00-04:00",
    headline: "Venezuela earthquakes kill at least 164 people, injure 971",
    summary:
      "Authorities report rising casualties after back-to-back magnitude 7.5 and 7.2 quakes struck the country's west, with widespread structural damage and a declared state of emergency.",
    sourceAttribution: "Al Jazeera",
    sourceLink:
      "https://www.aljazeera.com/news/2026/6/25/venezuela-struck-by-back-to-back-earthquakes-high-casualties-feared",
    publishedAt: "2026-06-25T08:10:00-04:00",
  },
  {
    id: "n3",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T07:40:00-04:00",
    updatedAt: "2026-06-25T07:40:00-04:00",
    headline: "Venezuela rocked by 7.5, 7.2 earthquakes: What happened and what we know",
    summary:
      "An explainer on the twin earthquakes — their timing, epicenters near the western coast, the regions hit hardest, and the emergency response now under way.",
    sourceAttribution: "Al Jazeera",
    sourceLink:
      "https://www.aljazeera.com/news/2026/6/25/venezuela-rocked-by-7-5-7-2-earthquakes-what-happened-and-what-we-know",
    publishedAt: "2026-06-25T07:30:00-04:00",
  },
  {
    id: "n4",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T06:50:00-04:00",
    updatedAt: "2026-06-25T06:50:00-04:00",
    headline: "Venezuela earthquakes: How will sanctions impact aid operations?",
    summary:
      "Analysis of how existing sanctions and limited diplomatic channels could complicate the delivery of international relief and emergency supplies to affected areas.",
    sourceAttribution: "Al Jazeera",
    sourceLink:
      "https://www.aljazeera.com/news/2026/6/25/venezuela-quakes-how-will-sanctions-impact-aid-operations",
    publishedAt: "2026-06-25T06:40:00-04:00",
  },
  {
    id: "n5",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T06:10:00-04:00",
    updatedAt: "2026-06-25T06:10:00-04:00",
    headline: "'We hugged each other and ran': Venezuelans recount earthquake horror",
    summary:
      "Survivors describe the moments the quakes hit — fleeing shaking buildings, searching for family, and the long night that followed in the streets and shelters.",
    sourceAttribution: "Al Jazeera",
    sourceLink:
      "https://www.aljazeera.com/news/2026/6/25/we-hugged-each-other-and-ran-venezuelans-recount-earthquake-horror",
    publishedAt: "2026-06-25T06:00:00-04:00",
  },
  {
    id: "n6",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T05:30:00-04:00",
    updatedAt: "2026-06-25T05:30:00-04:00",
    headline: "Venezuela earthquakes: Why is Central America so vulnerable to tremors?",
    summary:
      "Context on the region's seismic risk — the fault systems beneath northern South America and the Caribbean, and why dense, older construction raises the human toll.",
    sourceAttribution: "Al Jazeera",
    sourceLink:
      "https://www.aljazeera.com/news/2026/6/25/venezuela-earthquakes-why-is-central-america-so-vulnerable-to-tremors",
    publishedAt: "2026-06-25T05:20:00-04:00",
  },
];

export const publishedDonations: DonationChannel[] = [
  {
    id: "d1",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T10:00:00-04:00",
    updatedAt: "2026-06-25T07:00:00-04:00",
    recipientOrganization: "Caritas Australia — Venezuela Earthquake Appeal",
    description:
      "Emergency appeal funding food, clean water, shelter, and medical aid for affected families. Donations are processed on Caritas Australia's own official site.",
    destinationLink: "https://www.caritas.org.au",
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
];
