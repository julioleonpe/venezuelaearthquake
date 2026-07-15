# Venezuela Earthquake Hub — Frontend

A public, **bilingual (EN/ES)** earthquake-relief coordination Hub. Ships at **venezuelaearthquake2026.com**
on Vercel — **fully static**: every tile renders from data bundled with the app, with **no backend, no
`/api`, and no serverless functions**. Nothing can report "unavailable" in production.

The aesthetic is the **"Seismograph Console"** — an instrument-grade civic coordination utility,
deliberately *not* an emotional campaign or a scam clone. Cool light-slate base, monospace data readings,
a seismic amber→red magnitude accent, and a thin Venezuela tricolor as a recurring civic marker
(Fraunces · IBM Plex Sans · IBM Plex Mono).

## Run it

```bash
npm install
npm run dev            # Vite dev server — matches production exactly
npm run build          # tsc --noEmit + vite production build
npm run preview        # preview the production build
npm run typecheck      # tsc --noEmit
npm run relief:refresh # re-pull the relief-map snapshot (see below)
```

The Hub is a static SPA: curated content (News / Donations / Resources) is read **in the browser** from
the published dataset (`src/api/published.ts`) and filtered through the pure domain gate — no network
call. The relief map reads a **daily snapshot** of the community acopios & refugios feed bundled at
`src/data/relief-points.json`. `npm run dev` is all you need and matches production exactly.

### Refreshing the relief map

The relief points are a static snapshot, not a live feed. To refresh them:

```bash
npm run relief:refresh   # pulls the upstream server-side → src/data/relief-points.json
git add src/data/relief-points.json && git commit -m "Refresh relief points" && git push
```

Vercel redeploys on push. Run this on a daily cadence (manually, or via a scheduled job that runs the
script and commits). It's fetched **server-side** because the upstream (a Google Apps Script Web App)
302-redirects cross-origin, which trips the browser's CORS check on a direct fetch.

### Things to try

- **Single command center.** Everything lives in one view at `/` — News, the Relief Tools & Apps
  launcher, the relief map, and Donate. There are no drill-down pages; unknown paths fall back home.
- **Relief map.** Filter the centerpiece by **All / Acopios / Refugios** — community-reported donation
  **collection centers** (amber squares) and **shelters** (teal circles) from acopios-refugios.vercel.app,
  with a legend, a snapshot-date line, and an always-on provenance line that refers you there to report
  new points. Unverified ("sin verificar") acopios are flagged as such and never shown as vetted.
- **Language toggle** (EN/ES) — re-renders chrome in place, persists across navigation, never
  machine-translates curated record content (those keep a small `EN`/`ES` language indicator).
- **Graceful degradation** — append `?fail=news,donations` (any subset of `news`/`donations`/`resources`)
  to the URL. Those subsystems are marked unavailable *by name* while the rest keeps rendering (Req
  8.4/8.5).

> **Scope:** this is the **public, Visitor-facing** Hub.

## Architecture

A fully static SPA over a shared, trust-critical domain — no backend:

- **`src/` — React + TypeScript SPA (Vite).** Renders the bento command center.
- **`src/api/` — in-browser read API.** `store.ts` reads the published dataset (`published.ts`) and runs
  the pure domain gate over it; `published.ts` ships **only verified records**, so `pending` / `rejected`
  records never reach the bundle. Function signatures stay Promise-based so each subsystem reads
  independently and maps a rejection to its "unavailable by name" notice.
- **`src/domain/{core,types}.ts` — pure, framework-free trust logic.** The single place the visibility
  gate, search, sort, donation-completeness, and source-host labeling live. No DB/HTTP/React deps.
- **External layer** (`src/lib/acopios.ts`) reads the bundled `src/data/relief-points.json` snapshot of
  the third-party acopios/refugios feed. It is **deliberately outside the curated gate** and rendered as a
  clearly-attributed external layer, preserving the source's own moderation state (unverified acopios stay
  flagged) — never laundered into curated records.
- **`scripts/fetch-relief-points.mjs` — the daily refresh.** Pulls the upstream server-side (Node has no
  CORS) into the bundled JSON snapshot. Run via `npm run relief:refresh`, then commit + redeploy. This is
  the only "backend" touchpoint, and it runs offline — never at request time.

See `CLAUDE.md` for the full set of architecture invariants.
