# Venezuela Earthquake Hub — Frontend

A public, **bilingual (EN/ES)** earthquake-relief coordination Hub. Ships at **venezuelaearthquake2026.com**.

The aesthetic is **calm institutional / civic** — an official coordination utility,
deliberately *not* an emotional campaign or a scam clone. Deep navy ink on warm
paper, a single restrained ochre accent for actions, a thin Venezuela tricolor as
a recurring civic marker, and a type-forward hierarchy (Fraunces · IBM Plex Sans ·
IBM Plex Mono).

## Run it

```bash
npm install
npm run dev        # starts BOTH: REST read service (:5181) + SPA (:5180)
npm run build      # tsc --noEmit + vite production build
npm run preview    # preview the production build
```

`npm run dev` runs both processes together (the SPA proxies `/api` → the read
service). To run them separately: `npm run server` and `npm run dev:web`.

The SPA needs the read service running for News / Donations / Resources to load;
the Seismic console (live USGS) and the Donate link-out work without it.

### Things to try

- **Language toggle** (top-right EN/ES) — re-renders chrome in place, persists
  across navigation, never machine-translates curated record content (those keep a
  small `EN`/`ES` language indicator).
- **Graceful degradation** — append `?fail=news,donations` (any subset of
  `news`/`donations`/`resources`) to the URL. Those subsystems are marked
  unavailable *by name* while the rest of the Hub keeps rendering (Req 8.4/8.5).

> **Scope:** this is the **public, Visitor-facing** Hub. 

## Architecture

Two processes, one shared trust-critical domain:

- **`src/` — React + TypeScript SPA (Vite).** Renders the bento command center and
  drill-down pages. It holds **no curated data**; `src/api/store.ts` is a thin HTTP
  client that fetches verified-only data from the read service over `/api/*`.
- **`server/server.ts` — stateless REST read service (Node 24 native TS, zero deps).**
  Holds the curated store and is the **single place the visibility gate runs**.
  Every public read routes through the pure domain functions before serialization,
  so `pending` / `rejected` records are never put on the wire — honoring the
  CLAUDE.md invariant *"unverified records must never be sent to the browser"*
  (the old in-browser mock only *hid* them, but still shipped them in the bundle).
- **`src/domain/{core,types}.ts` — pure, framework-free trust logic.** Imported
  **directly by both** the SPA and the server (its imports are all `import type`,
  fully erased at runtime), so the gate, search, sort, donation-completeness, and
  source-host labeling are physically the same code on both sides.

Endpoints (all GET, verified-only): `/api/news`, `/api/donations`, `/api/resources`
(`?category=&keyword=`), `/api/resources/all`, `/api/meta`, `/api/health`. Each
subsystem read has a 5 s budget; `?fail=news,donations,resources` forces a 503 per
named subsystem so the graceful-degradation UI is demonstrable end to end.

