/**
 * Donation click-counter client — talks to `/api/donate-clicks`.
 *
 * `recordDonateClick` is fire-and-forget: it's called from a link's onClick and
 * must NOT block, delay, or interfere with the navigation that opens the
 * recipient's site in a new tab. `fetchDonateClicks` reads the current total.
 *
 * Both degrade silently: if the endpoint or its KV store isn't configured (local
 * dev, a preview without KV) the calls resolve to `null` and the UI hides the
 * number. The Hub never depends on this count (see api/donate-clicks.ts).
 */

const ENDPOINT = "/api/donate-clicks";

/** Read the current shared click total. Returns null if unavailable. */
export async function fetchDonateClicks(timeoutMs = 4000): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(ENDPOINT, { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { total?: unknown };
    return typeof data.total === "number" ? data.total : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Record a donation-link click. Fire-and-forget — never awaited on the click path.
 * `id` optionally attributes the click to a recipient channel. Uses `keepalive`
 * so the POST survives the tab/navigation that the click triggers.
 */
export function recordDonateClick(id?: string): void {
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id ? { id } : {}),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let telemetry throw on the click path */
  }
}
