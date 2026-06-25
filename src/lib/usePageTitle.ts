/**
 * Moves keyboard/screen-reader focus to the page heading on route change and sets
 * the document title (Req 9.2/9.5 — operability after in-app navigation). Returns
 * a ref to attach to the page's <h1>.
 */
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function usePageHeadingFocus<T extends HTMLElement>(title?: string) {
  const ref = useRef<T>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    ref.current?.focus();
    if (title) document.title = `${title} · Venezuela Earthquake Hub`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, title]);
  return ref;
}
