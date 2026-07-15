/**
 * Relief-points read proxy — a tiny, self-contained Vercel serverless endpoint.
 *
 *   GET /api/relief-points → SourceRow[]  (the community acopios/refugios feed)
 *
 * Why a proxy at all? The upstream is a Google Apps Script Web App
 * (acopios-refugios.vercel.app's own data source). It 302-redirects to
 * script.googleusercontent.com, and that cross-origin redirect trips the browser's
 * CORS check on a direct `fetch()` from our SPA (even though every hop returns
 * `Access-Control-Allow-Origin: *`). Server-to-server requests have NO CORS, so we
 * fetch it here and re-serve it from our own origin — guaranteed to work in prod.
 *
 * This is deliberately SEPARATE from the curated read core: the acopios/refugios
 * feed is third-party, COMMUNITY-REPORTED data the Hub neither owns nor verifies.
 * It never touches the visibility gate or the curated store — it is passed through
 * verbatim and normalized/attributed client-side (see src/lib/acopios.ts).
 *
 * Graceful degradation: any upstream failure returns HTTP 502 so the client marks
 * just this layer unavailable while the rest of the command center keeps rendering.
 */

const UPSTREAM =
  "https://script.google.com/macros/s/AKfycbzKAcMzH739iu1nL6ztBmm3uymajUy6V0lPEQmbQeBjABUJ84odAxEnv0QD9Cjy5pP0Tw/exec";

export default async function handler(_request: Request): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    // `fetch` follows the 302 → script.googleusercontent.com server-side (no CORS).
    const upstream = await fetch(UPSTREAM, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!upstream.ok) {
      return json(502, { error: "upstream_error", status: upstream.status });
    }
    // Pass the JSON array through verbatim; the client normalizes + attributes it.
    const body = await upstream.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        // The upstream is a moderated registry that changes slowly; a short edge
        // cache keeps us well within its limits while staying fresh enough.
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return json(502, { error: "upstream_unreachable" });
  } finally {
    clearTimeout(timer);
  }
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
