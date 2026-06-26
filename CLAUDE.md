# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is an **implemented React + TypeScript SPA**. The original `requirements.md` / `design.md` spec
documents have been **removed** — the code is now the source of truth. Historical acceptance criteria
are still referenced in some code comments as `Req N.M`; treat those as provenance/rationale, not as a
live contract to a spec file that no longer exists.

Key source layout (`src/`):

- `domain/` — pure, framework-free trust logic (`core.ts`, `types.ts`). The heart of the Hub.
- `api/` — in-browser read API over a published dataset: `store.ts` (reads `published.ts` and runs the
  pure gate; no network call), `published.ts` (the verified-only dataset that ships in the bundle),
  `seed.ts` (authoring data the published set is derived from).
- `lib/` — `usgs.ts` (live USGS seismic feed), `damage.ts` (live community damage-report feed),
  `useSubsystem.ts`, `useMediaQuery.ts`, `datetime.ts`, `usePageTitle.ts`, `openExternal.ts`.
- `components/` — `AppShell` (console command bar), `SeismicConsole` + `SeismicMap` (live dual-layer
  feed + Leaflet map), `DonatePanel` (Caritas link-out card), `ExternalLink`, `LanguageToggle`,
  `RouteError`, `primitives`, `icons`.
- `pages/` — `CommandCenter` only (the bento home, `/`). There are **no drill-down routes** — the Hub
  is a single self-contained view (see `router.tsx`); any unknown path falls back to the Command Center.
- `i18n/` — EN/ES string catalog (`catalog.ts`) + provider. `styles/` — `global.css` (the
  "Seismograph Console" design system) + `pages.css` (bento + launcher + console styles).

The Hub ships at **venezuelaearthquake2026.com** as a **pure static SPA on Vercel — no backend**. Stack:
React + TypeScript (Vite), React Router, Leaflet for the map. A `server/` directory exists (a zero-dep
Node read service) but is **not used by the deployed static build**; production reads curated data from
`published.ts` in the browser. The shared TS domain types/functions are written to be reusable on a
backend should one return.

## What the product is

A public, **bilingual (English + Spanish)** earthquake-relief coordination Hub. It presents curated,
verified content (News, Donation channels, and relief Resources) in a **single command-center view**,
alongside **live data layers** (USGS seismicity + community damage reports) and a launcher of **outbound
links** to external relief tools — most importantly several **People Finders** (separate, pre-existing
missing-persons systems the Hub does not build). Trust and accuracy are first-class: no *curated* record
reaches a Visitor unless an Administrator has marked it `verified`.

The audience is two-fold: largely **international** visitors who come to **be informed** and to
**donate**, and **Venezuelans** directly affected who need relief info and the People Finders. Interface
chrome is shown in English (default) or Spanish via a persistent Language_Toggle; curated record content
stays in its authored language with a language indicator (Req 10).

## UI/UX direction (decided)

The Hub is a **single-view bento "command center"** — an instrument-grade emergency operations console,
**not** an emotional campaign scroll. Load-bearing points:

- **Bento command center on `/`.** The home route (`CommandCenter.tsx`) fits **one desktop viewport with
  no page scroll**: a status strip (what happened + key stats + last-updated) over a bento grid. Tiles:
  **News** (verified feed, internal scroll), **Relief Tools & Apps** (the outbound launcher), the
  **Seismic console** centerpiece, and **Donate** (Caritas + other verified channels). Each tile owns its
  own data source and degrades independently. Below ~1080px the grid relaxes into a natural vertical
  stack; the command bar locks to one viewport only on the home route.
- **Everything lives in one view.** There are no `/news`, `/donate`, or `/resources` drill-down pages
  anymore — depth that used to live on sub-pages now lives inside the tiles (internal scroll, the tools
  launcher's expandable folders, etc.). External tools open in a new tab.
- **Live seismic monitoring is the centerpiece, now a dual-layer map.** `SeismicConsole` shows a live
  feed list (left, the accessible source of truth) beside a **Leaflet** map (right), with a segmented
  **layer toggle**:
  - **Seismic** — live **USGS** FDSN regional feed (`lib/usgs.ts`); epicenters as circle markers on an
    **amber→red magnitude** scale.
  - **Damage** — live **community-reported** damaged buildings pulled from terremotovenezuela.com's public
    Supabase feed (`lib/damage.ts`); square markers on a **distinct cool ramp** (blue→violet→magenta) so
    damage level is never misread as a magnitude, with a legend and an always-on provenance line.
  The two sources fetch and degrade **independently**; a failure marks only its own layer unavailable.
- **Donate is a branded link-out card (embed OFF by default).** `DonatePanel.tsx` renders Caritas's
  Venezuela appeal as a trustworthy link-out card (recipient identity, affiliation, suggested amounts that
  deep-link to Caritas, prominent donate button). Funds are processed entirely on Caritas's own
  infrastructure. An iframe-embed code path exists behind `CARITAS_EMBED_ENABLED` (off) for any future
  recipient that supplies an officially embeddable form, with this card as the guaranteed fallback.
- **Tone is practical, factual, results-oriented** — no sob-story or manipulative urgency.
- **Bilingual, English-first.** Persistent Language_Toggle (EN/ES) in the command bar; switching
  re-renders chrome in place (no network) and persists across navigation. Spanish held to the same
  factual tone; layouts absorb ~15–30% text expansion.
- **Visual identity: "Seismograph Console" (light).** Cool light-slate base, monospace data readings
  (magnitudes, hosts, ISO timestamps), the seismic amber→red magnitude scale as the action accent, and the
  Venezuela tricolor as a thin instrument marker. Reads as an authoritative coordination utility — not a
  campaign, not a scam clone.

## Architecture invariants (do not violate when implementing)

These are the load-bearing trust decisions. Most acceptance criteria collapse into a few
invariants — honor these and the rest follow:

- **Single visibility gate.** One pure function, `isVisibleToVisitor(record)`, decides whether any
  *curated* record is shown. *Every* curated read routes through it (via `orderedVerifiedNews` /
  `visibleDonations` / `searchResources` in `domain/core.ts`). Do not let a subsystem implement its own
  "verified only" check — that is how the rule gets bypassed.
- **Verified-only data ships; nothing else.** `published.ts` contains ONLY verified records, so
  `pending`/`rejected` records are never put in the bundle. (The published set is the static-host
  equivalent of the old server's server-side enforcement.)
- **Live external layers are NOT curated content.** The USGS seismic feed and the community damage feed
  are third-party live data the Hub neither owns nor verifies. They are **deliberately kept out of the
  visibility gate** and rendered as clearly-attributed external layers (the damage layer always shows
  "community-reported · unverified · via terremotovenezuela.com"). Never launder live external data into
  the curated record types or through the gate. The damage feed also intentionally **drops** sensitive
  missing-persons fields (`trapped_names`, `casualties_notes`) — that domain belongs to the external
  People Finders.
- **Pure, framework-free domain functions.** The error-prone logic — case-insensitive substring
  search, descending-by-timestamp sort, field validation, donation completeness, source-host
  labeling — lives in pure functions in `src/domain/core.ts`. These are the primary
  unit/property-test targets; keep them free of DB/HTTP/React dependencies.
- **Per-subsystem / per-layer graceful degradation.** Each data source is fetched independently with its
  own budget; a slow/failed source marks *that* source unavailable while the others still render, and the
  UI names the unavailable one (Req 8.4/8.5). The `?fail=news,donations,resources` URL param injects
  faults client-side so the degradation UI stays demonstrable.
- **Centralized external links.** A single `ExternalLink` component renders the destination host name
  as visible text, opens links in a new browser context, and keeps the current view; it shows an
  "unverified source" label when a curated item has no source link (Req 7.2–7.4). It backs curated source
  links and the outbound relief-tool / People Finder links (Req 5.2/5.3).
- **Donations: the Hub never handles funds.** The Hub **never collects, processes, holds, or proxies**
  donations — money always moves on the recipient's own infrastructure. The Donate tile is a branded
  link-out card and **always** links to the recipient's official site. It **may** embed a recipient's own
  donation widget (behind `CARITAS_EMBED_ENABLED`, currently off) with the link-out card as the guaranteed
  fallback. Donation channels missing recipient name, description, or destination link are not shown.
- **Audit every mutation.** Each create/edit/delete/verify on a curated record appends an
  `AuditEntry` (actor + action + record type/id + timestamp) (Req 6.5).
- **Localization is presentation-only.** Bilingual support lives in a frontend i18n string catalog
  (EN/ES chrome strings) and client-held Interface_Language. Domain functions take no language
  parameter and stay language-agnostic — the only domain-level language logic is the pure
  `needsLanguageIndicator(contentLanguage, interfaceLanguage)` comparison. Never push translation into
  the visibility gate, search, sort, or validation.

## Data model

The three curated record types (`ResourceEntry`, `DonationChannel`, `NewsItem`) extend a common
`Curated` envelope (`id`, `verificationStatus`, `contentLanguage`, `createdAt`, `updatedAt`) so the
visibility gate and audit logic apply uniformly. `contentLanguage` (`"en"`/`"es"`) drives the
language-indicator decision (Req 10.5). `DonationChannel` carries an optional `affiliationLabel` (e.g.
Caritas → Catholic Church aid agency, Req 3.9). Full interfaces live in `src/domain/types.ts` and the
validation constraints (keyword 1–100 chars after trim; donation completeness) in `src/domain/core.ts` —
treat those as the source of truth.

Live-layer shapes are separate and live outside the domain: `Quake` (`lib/usgs.ts`) and `DamageReport`
(`lib/damage.ts`). The outbound launcher's catalog of external tools lives in `RELIEF_TOOLS`
(`src/config.ts`), grouped people / damage / services; ordering within a group is meaningful (most
authoritative first).

## Conventions

- Where requirements are referenced in comments, EARS keywords carry a deliberate distinction: `WHILE` =
  continuous state, `WHEN` = triggered event, `IF/THEN` = conditional, `WHERE` = feature/context
  precondition. Preserve these when editing such comments.
- Visitor-facing **interface chrome** is bilingual EN/ES, English default, via the Language_Toggle (Req
  1.4, 10). Every message id used by the UI must exist in BOTH locales (enforced by the catalog's
  `Record<MessageId, string>` type). Curated **record content** stays in its authored language
  (`contentLanguage`) with a language indicator (Req 10.5) — no machine translation of crisis content.
- Timestamps are ISO-8601 **with timezone**; the "last updated" line shows date, time, and timezone
  (Req 1.7).
