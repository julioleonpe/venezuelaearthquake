/**
 * Seed dataset for the mock API.
 *
 * Deliberately includes a mix of verification statuses (verified / pending /
 * rejected) and edge cases — a news item with no source link, a donation channel
 * missing its destination link, accented Spanish content — so the trust model and
 * the pure domain functions are exercised by real data the moment the app runs.
 *
 * NOTE: This is illustrative relief-coordination content for a demonstration build.
 * In production these records would come from the curated data store via the API.
 */

import type { DonationChannel, NewsItem, ResourceEntry } from "../domain/types";

export const seedNews: NewsItem[] = [
  {
    id: "n0",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T09:30:00-04:00",
    updatedAt: "2026-06-25T09:30:00-04:00",
    // Primary source: The New York Times live coverage of the earthquake.
    headline: "Live coverage: Powerful earthquakes hit western Venezuela",
    summary:
      "The New York Times is tracking the aftermath of the two earthquakes — the stronger at magnitude 7.5 — with continuously updated reporting on casualties, damage, and the international relief response.",
    sourceAttribution: "The New York Times",
    sourceLink: "https://www.nytimes.com/live/2026/06/24/world/venezuela-earthquake",
    publishedAt: "2026-06-25T09:15:00-04:00",
  },
  {
    id: "n1",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-25T08:10:00-04:00",
    updatedAt: "2026-06-25T08:10:00-04:00",
    headline: "Government declares state of emergency across three western states",
    summary:
      "Authorities confirmed coordinated relief operations in the most affected regions, with shelters opening in municipal buildings. Officials report main highway access is being restored in stages.",
    sourceAttribution: "Agence France-Presse",
    sourceLink: "https://www.afp.com/en",
    publishedAt: "2026-06-25T07:45:00-04:00",
  },
  {
    id: "n2",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-25T06:30:00-04:00",
    updatedAt: "2026-06-25T06:30:00-04:00",
    headline: "Equipos de rescate amplían la búsqueda en zonas rurales de los Andes",
    summary:
      "Brigadas de Protección Civil y voluntarios trabajan en comunidades de montaña donde los deslizamientos bloquearon el acceso. Se habilitaron puntos de acopio de agua y alimentos.",
    sourceAttribution: "Cruz Roja Venezolana",
    sourceLink: "https://www.cruzrojavenezolana.org",
    publishedAt: "2026-06-25T05:50:00-04:00",
  },
  {
    id: "n3",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T19:05:00-04:00",
    updatedAt: "2026-06-24T19:05:00-04:00",
    headline: "International medical teams arrive to support overwhelmed hospitals",
    summary:
      "Field hospitals are being established near the epicenter. Relief agencies are coordinating supply corridors for medicine, clean water, and temporary shelter materials.",
    sourceAttribution: "Reuters",
    sourceLink: "https://www.reuters.com/world/americas",
    publishedAt: "2026-06-24T18:30:00-04:00",
  },
  {
    id: "n4",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T14:00:00-04:00",
    updatedAt: "2026-06-24T14:00:00-04:00",
    // Edge case: verified but no source link → "unverified source" label (Req 7.2).
    headline: "Telecommunications partially restored in coastal corridor",
    summary:
      "Mobile network operators report progressive service restoration. Residents are advised that emergency lines have priority and to keep non-urgent calls brief.",
    sourceAttribution: "National emergency briefing",
    sourceLink: null,
    publishedAt: "2026-06-24T13:20:00-04:00",
  },
  {
    id: "n5",
    verificationStatus: "verified",
    contentLanguage: "es",
    createdAt: "2026-06-24T09:15:00-04:00",
    updatedAt: "2026-06-24T09:15:00-04:00",
    headline: "Habilitan albergues temporales en escuelas y centros deportivos",
    summary:
      "Las autoridades locales informan la apertura de albergues con capacidad para familias desplazadas. Se solicita donación de colchonetas, agua potable y kits de higiene.",
    sourceAttribution: "Alcaldía Metropolitana",
    sourceLink: "https://example.gob.ve/albergues",
    publishedAt: "2026-06-24T08:40:00-04:00",
  },
  {
    id: "n6",
    verificationStatus: "pending",
    contentLanguage: "en",
    createdAt: "2026-06-25T09:00:00-04:00",
    updatedAt: "2026-06-25T09:00:00-04:00",
    // Pending: must never reach a Visitor (Req 6.7). Visible only in the Admin Console.
    headline: "UNVERIFIED: reports of a second tremor near the coast",
    summary:
      "Awaiting confirmation from seismological authorities before publication. Held pending source verification.",
    sourceAttribution: "Social media (unconfirmed)",
    sourceLink: "https://example.com/unconfirmed",
    publishedAt: "2026-06-25T08:55:00-04:00",
  },
  {
    id: "n7",
    verificationStatus: "rejected",
    contentLanguage: "en",
    createdAt: "2026-06-24T22:00:00-04:00",
    updatedAt: "2026-06-24T22:30:00-04:00",
    headline: "REJECTED: misleading casualty figures from unverified blog",
    summary: "Rejected during curation: figures could not be corroborated by any reputable source.",
    sourceAttribution: "Unverified blog",
    sourceLink: "https://example.com/rumor",
    publishedAt: "2026-06-24T21:00:00-04:00",
  },
];

export const seedDonations: DonationChannel[] = [
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
    destinationLink: "https://donate.redcrossredcrescent.org/~share?cid=1139&lang=en_EN",
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
    id: "d4",
    verificationStatus: "pending",
    contentLanguage: "en",
    createdAt: "2026-06-25T08:00:00-04:00",
    updatedAt: "2026-06-25T08:00:00-04:00",
    // Pending → hidden from Visitors (Req 3.1).
    recipientOrganization: "New local fund (awaiting verification)",
    description: "Submitted for review; legitimacy checks in progress.",
    destinationLink: "https://example.org/new-fund",
    affiliationLabel: null,
  },
  {
    id: "d5",
    verificationStatus: "verified",
    contentLanguage: "en",
    createdAt: "2026-06-24T13:00:00-04:00",
    updatedAt: "2026-06-24T13:00:00-04:00",
    // Verified but INCOMPLETE (no destination link) → excluded by Req 3.3.
    recipientOrganization: "Incomplete channel (missing link)",
    description: "This channel is verified but has no destination link and must not be displayed.",
    destinationLink: "",
    affiliationLabel: null,
  },
];

export const seedResources: ResourceEntry[] = [
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
    id: "r7",
    verificationStatus: "pending",
    contentLanguage: "en",
    createdAt: "2026-06-25T08:30:00-04:00",
    updatedAt: "2026-06-25T08:30:00-04:00",
    // Pending → hidden from the directory (Req 2.1).
    name: "Unverified supply drive",
    description: "Submitted by the public; pending source verification before listing.",
    category: "Water & Food",
    sourceLink: "https://example.com/unverified-supply",
  },
];
