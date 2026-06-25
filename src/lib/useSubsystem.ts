/**
 * useSubsystem — fetches a single subsystem's data and tracks the loading/slow/
 * error states the requirements describe:
 *  - "loading" while the request is in flight,
 *  - a "slow" flag once the page-level 10s threshold passes (Req 8.2),
 *  - "error" when the subsystem fetch fails or exceeds its 5s budget (Req 8.5),
 *    so the page can show that one subsystem is unavailable while others render
 *    (Req 8.4).
 *
 * The 5s budget itself lives in the mock API (`withSubsystemBudget`); this hook
 * just reflects the resulting rejection.
 */

import { useEffect, useRef, useState } from "react";

const SLOW_THRESHOLD_MS = 10000; // Req 8.2

export type SubsystemState<T> =
  | { status: "loading"; slow: boolean }
  | { status: "ready"; data: T }
  | { status: "error" };

export function useSubsystem<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): SubsystemState<T> {
  const [state, setState] = useState<SubsystemState<T>>({ status: "loading", slow: false });
  // Keep the latest fetcher without making it a dependency (avoids refetch loops).
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", slow: false });

    const slowTimer = setTimeout(() => {
      if (!cancelled) {
        setState((prev) => (prev.status === "loading" ? { status: "loading", slow: true } : prev));
      }
    }, SLOW_THRESHOLD_MS);

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
