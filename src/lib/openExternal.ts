/**
 * Opens an external URL in a new browser context, reliably.
 *
 * Why not `window.open(url, "_blank", "noopener,noreferrer")`? Passing a features
 * string makes browsers treat the call as a *popup*, which popup blockers commonly
 * suppress — so a card click silently does nothing. A synthetic anchor click with
 * `target="_blank"` + `rel="noopener noreferrer"` is treated as a normal
 * user-initiated link navigation (not a popup), so it is not blocked, while still
 * severing the `window.opener` reference for security.
 *
 * Used by the clickable News rows/cards (Req 4.3) whose whole surface is the
 * affordance; `ExternalLink` remains the component for rendered anchor links.
 */
export function openExternal(url: string): void {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
