/**
 * useMediaQuery — subscribe to a CSS media query and re-render on changes.
 *
 * Used to drive the mobile-only accordion on the command center: below the bento
 * breakpoint, each tile collapses behind an "app button" header and its body is
 * conditionally mounted (so e.g. the Leaflet map doesn't load until expanded).
 * Desktop is unaffected — the hook reports `false` and the bento renders as-is.
 */

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const get = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState<boolean>(get);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sync in case the query changed between render and effect
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
