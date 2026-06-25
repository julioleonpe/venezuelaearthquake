# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is an **implemented React + TypeScript SPA**. The original `requirements.md` / `design.md` spec
documents have been **removed** — the code is now the source of truth. Historical acceptance criteria
are still referenced in code comments as `Req N.M`; treat those as provenance/rationale, not as a live
contract to a spec file that no longer exists.

Key source layout (`src/`):

- `domain/` — pure, framework-free trust logic (`core.ts`, `types.ts`). The heart of the Hub.
- `api/` — mock read API + seed data (`store.ts`, `seed.ts`); stands in for the REST service.
- `lib/` — `usgs.ts` (live USGS seismic feed), `useSubsystem.ts`, `datetime.ts`, `usePageTitle.ts`.
- `components/` — `AppShell` (console command bar), `SeismicConsole` + `SeismicMap` (live feed + Leaflet
  map), `DonatePanel` (embedded Caritas appeal), `ExternalLink`, `OtherMenu`, `LanguageToggle`, etc.
- `pages/` — `CommandCenter` (the bento home, `/`), plus drill-down routes `NewsFeedPage` (`/news`),
  `DonationsPage` (`/donate`), `ResourceDirectoryPage` (`/resources`).
- `i18n/` — EN/ES string catalog (`catalog.ts`) + provider. `styles/` — `global.css` (the
  "Seismograph Console" design system) + `pages.css` (bento + page styles).

The Hub ships at **venezuelaearthquake2026.com**. Stack: React + TypeScript SPA (Vite), React Router,
Leaflet for the map. The mock `api/` layer stands in for a future Node/TypeScript REST service; the
shared TS domain types/functions are written to be reusable on a backend.

## What the product is

A public, **bilingual (English + Spanish)** earthquake-relief coordination Hub with three curated
Visitor subsystems — News_Feed, Donation_Page, Resource_Directory — plus an outbound navigation link to
the external **People_Finder** (a separate, pre-existing system the Hub does not build) and an
authenticated Admin Console. An interactive Resource_Map is **out of scope** for this project. Trust
and accuracy are first-class: nothing reaches a Visitor unless an Administrator has curated it to
`verified`.

The audience is two-fold: largely **international** visitors who come to **be informed** and to
**donate**, and **Venezuelans** directly affected who need relief info and the People_Finder. The Hub
also acts as a directory of **outbound links** to related relief resources/apps. Interface chrome is
shown in English (default) or Spanish via a persistent Language_Toggle; curated record content stays in
its authored language with a language indicator (Req 10).

## UI/UX direction (decided)

The Hub is a **single-view bento "command center"** — an instrument-grade emergency operations console,
**not** an emotional campaign scroll and **not** the older multi-page "Action Cards Hub" (since replaced).
Load-bearing points:

- **Bento command center on `/`.** The home route (`CommandCenter.tsx`) fits **one desktop viewport with
  no page scroll**: a status strip (what happened + key stats + last-updated) over a bento grid. Tiles:
  **News** (verified feed, internal scroll), the **Seismic console** centerpiece, **Donate** (embedded
  Caritas), and two link tiles — **People Finder** (outbound) and **Resource Directory** (internal). Each
  tile owns its own data source and degrades independently. Below ~1080px the grid relaxes into a natural
  vertical stack; the command bar locks to one viewport only on the home route.
- **Drill-downs still exist.** Tiles route to dedicated pages where depth helps: `/news`, `/donate`,
  `/resources`. People Finder opens the separate external system in a new tab.
- **Live seismic monitoring is the centerpiece.** `SeismicConsole` shows a live **USGS** regional feed
  (left, the accessible list-of-events source of truth) beside a **Leaflet** dark-matter epicenter map
  (right), magnitudes on an amber→red scale. Data is fetched live from the public USGS FDSN service
  (`lib/usgs.ts`); failure degrades that tile only.
- **Donate embeds the recipient widget.** The Donate tile **embeds Caritas Australia's Venezuela appeal in
  an iframe** (`DonatePanel.tsx`), with a guaranteed "open official site" link-out fallback if framing is
  blocked. Funds are still processed entirely on Caritas's own infrastructure — see the donations
  invariant below. Caritas is labeled as the Catholic Church's international aid agency.
- **Tone is practical, factual, results-oriented** — no sob-story or manipulative urgency.
- **Bilingual, English-first.** Persistent Language_Toggle (EN/ES) in the command bar; switching
  re-renders chrome in place (no network) and persists across navigation. Spanish held to the same
  factual tone; layouts absorb ~15–30% text expansion.
- **Visual identity: "Seismograph Console" (dark).** Deep slate base, monospace data readings (magnitudes,
  hosts, ISO timestamps), the seismic amber→red magnitude scale as the action accent, and the Venezuela
  tricolor as a thin instrument marker. Reads as an authoritative coordination utility — not a campaign,
  not a scam clone.

## Architecture invariants (do not violate when implementing)

These are the load-bearing trust decisions. Most acceptance criteria collapse into a few
invariants — honor these and the rest follow:

- **Single visibility gate.** One pure function, `isVisibleToVisitor(record)`, decides whether any
  curated record is shown. *Every* public read endpoint routes through it. Do not let individual
  subsystems implement their own "verified only" check — that is how the rule gets bypassed.
- **Server-side verification enforcement, never client-side hiding.** Unverified records
  (`pending`/`rejected`) must never be sent to the browser. New records are created `pending` and are
  hidden until an Administrator sets them `verified`.
- **Pure, framework-free domain functions.** The error-prone logic — case-insensitive substring
  search, descending-by-timestamp sort, field validation, donation completeness, source-host
  labeling — lives in pure functions in `src/domain/core.ts`. These are the primary
  unit/property-test targets; keep them free of DB/HTTP/React dependencies.
- **Per-subsystem graceful degradation.** Each subsystem's data is fetched independently with a
  5-second budget; a slow/failed source marks *that* subsystem unavailable while the others still
  render, and the page names the unavailable ones by name (Req 8.4/8.5). A page-level 10-second
  threshold drives the loading indicator/notice (Req 8.2).
- **Centralized external links.** A single `ExternalLink` component renders the destination host name
  as visible text, opens links in a new browser context, and keeps the current view; it shows an
  "unverified source" label when a curated item has no source link (Req 7.2–7.4). It backs both
  curated source links and the outbound People_Finder link (Req 5.2/5.3).
- **Donations: the Hub never handles funds.** The Hub **never collects, processes, holds, or proxies**
  donations — money always moves on the recipient's own infrastructure. It **may embed** a recipient's own
  donation widget (the home Donate tile embeds Caritas's appeal in an iframe so the donor can give without
  leaving the console), and it **always** provides a link-out to the recipient's official site as the
  guaranteed fallback. *(This embed allowance is a deliberate change from the original "never embedded"
  rule.)* The drill-down `/donate` page still lists verified link-out `DonationChannel`s; channels missing
  recipient name, description, or destination link are not shown.
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

## Conventions

- Requirements use EARS keywords with a deliberate distinction: `WHILE` = continuous state, `WHEN` =
  triggered event, `IF/THEN` = conditional, `WHERE` = feature/context precondition. Preserve these
  when editing requirements.
- Visitor-facing **interface chrome** is bilingual EN/ES, English default, via the Language_Toggle (Req
  1.4, 10). Curated **record content** stays in its authored language (`contentLanguage`) with a
  language indicator (Req 10.5) — no machine translation of crisis content.
- Timestamps are ISO-8601 **with timezone**; the "last updated" line shows date, time, and timezone
  (Req 1.7).
