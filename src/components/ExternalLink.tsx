/**
 * ExternalLink — the single component for every link that leaves the Hub.
 *
 * Centralizes Req 7.3/7.4 and 5.2/5.3: it renders the destination host name as
 * visible text adjacent to the link text, opens in a new browser context while
 * keeping the current Hub view (`target="_blank"` + `rel="noopener noreferrer"`),
 * and — when a curated item has no source link — renders the "unverified source"
 * label while the item itself is still presented (Req 7.2).
 *
 * Backs both curated source links and the outbound People_Finder link.
 */

import { sourceHostLabel } from "../domain/core";
import { useI18n } from "../i18n/I18nProvider";
import { ExternalIcon } from "./icons";

interface ExternalLinkProps {
  /** The destination URL. `null`/blank → the unverified-source label is shown. */
  href: string | null;
  /** Visible link text (e.g. "Open source", "Donate on official site"). */
  children: React.ReactNode;
  /** Visual treatment. "button" renders the primary action button styling. */
  variant?: "inline" | "button";
  className?: string;
  /** Optional click hook (e.g. fire-and-forget engagement telemetry). */
  onClick?: () => void;
}

export function ExternalLink({ href, children, variant = "inline", className, onClick }: ExternalLinkProps) {
  const { t } = useI18n();
  const { label, unverified } = sourceHostLabel(href);

  // No usable link → present the "unverified source" label, no anchor (Req 7.2).
  if (unverified || href === null) {
    return (
      <span className="ext-link__unverified" role="note">
        <ExternalIcon size={14} />
        {t("ext.unverifiedSource")}
      </span>
    );
  }

  // Accessible name combines the link text, the host, and the new-tab affordance.
  const newTabHint = t("ext.opensNewTab");

  if (variant === "button") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-primary ${className ?? ""}`}
        onClick={onClick}
      >
        {children}
        <ExternalIcon size={16} />
        <span className="sr-only">
          — {label}, {newTabHint}
        </span>
      </a>
    );
  }

  return (
    <span className={`ext-link ${className ?? ""}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="ext-link__text"
        onClick={onClick}
      >
        {children}
        <span className="sr-only"> — {newTabHint}</span>
      </a>
      {/* Fully qualified host name as visible text adjacent to the link (Req 7.3). */}
      <span className="ext-link__host" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}
