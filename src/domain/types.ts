/**
 * Shared domain types for the Venezuela Earthquake Hub.
 *
 * These mirror `design.md` → "Data Models" verbatim so the same types back the
 * (mock) API layer, the pure domain functions, and the React presentation layer.
 * The language is shared across the stack specifically so these types and the
 * trust-critical pure functions can be reused everywhere.
 */

export type VerificationStatus = "verified" | "pending" | "rejected";

/** Authored language of a record's text (Req 10.5). Distinct from Interface_Language. */
export type Language = "en" | "es";

/** Common curation envelope shared by every curated record. */
export interface Curated {
  id: string;
  verificationStatus: VerificationStatus; // new records start "pending"
  contentLanguage: Language; // authored language of the record's text (Req 10.5)
  createdAt: string; // ISO-8601 with timezone
  updatedAt: string; // ISO-8601 with timezone
}

export interface ResourceEntry extends Curated {
  name: string;
  description: string;
  category: string;
  sourceLink: string | null;
}

export interface DonationChannel extends Curated {
  recipientOrganization: string; // required to display
  description: string; // required to display
  destinationLink: string; // required to display; recipient's own donation page (link out only)
  affiliationLabel: string | null; // optional legitimacy affiliation shown by the name (Req 3.9)
}

export interface NewsItem extends Curated {
  headline: string;
  summary: string;
  sourceAttribution: string;
  sourceLink: string | null;
  publishedAt: string; // ISO-8601 with timezone; sort key
}

export type CuratedRecord = ResourceEntry | DonationChannel | NewsItem;

/** Names used in the unavailable-subsystems notice (Req 8.4). */
export type SubsystemName = "news" | "donations" | "resources";

export interface SubsystemMeta {
  lastUpdated: string; // date + time + timezone (Req 1.7)
  unavailableSubsystems: SubsystemName[]; // by name (Req 8.4)
}
