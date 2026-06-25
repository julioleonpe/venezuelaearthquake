/**
 * Small presentational primitives shared across pages: the language indicator,
 * verification badge, the trust/verification statement, notices, loading
 * indicators, and empty states. All chrome text routes through i18n.
 */

import type { ReactNode } from "react";
import { needsLanguageIndicator } from "../domain/core";
import type { Language } from "../domain/types";
import { useI18n } from "../i18n/I18nProvider";
import {
  AlertIcon,
  InboxIcon,
  InfoIcon,
  ShieldCheckIcon,
} from "./icons";

// --- Language indicator (Req 10.5) -----------------------------------------

/**
 * Shows a small marker identifying a curated record's authored language, but
 * only when it differs from the Visitor's interface language. The decision is
 * the pure `needsLanguageIndicator`; this component is presentation only.
 */
export function LanguageIndicator({ contentLanguage }: { contentLanguage: Language }) {
  const { lang, t } = useI18n();
  if (!needsLanguageIndicator(contentLanguage, lang)) return null;
  const id = contentLanguage === "en" ? "lang.indicator.en" : "lang.indicator.es";
  return (
    <span className="badge badge-lang" title={t(id)}>
      {contentLanguage.toUpperCase()} · {t(id)}
    </span>
  );
}

// --- Verification statement (Req 7.5) --------------------------------------

/** The "who verifies and what they check" statement, shown on attributed pages. */
export function TrustStatement() {
  const { t } = useI18n();
  return (
    <div className="notice notice-trust" role="note">
      <span className="notice__icon" aria-hidden="true">
        <ShieldCheckIcon size={20} />
      </span>
      <span>{t("trust.statement")}</span>
    </div>
  );
}

// --- Notices ---------------------------------------------------------------

type NoticeTone = "info" | "warn" | "danger";

export function Notice({
  tone = "info",
  children,
  role = "status",
}: {
  tone?: NoticeTone;
  children: ReactNode;
  role?: "status" | "alert" | "note";
}) {
  const Icon = tone === "danger" || tone === "warn" ? AlertIcon : InfoIcon;
  return (
    <div className={`notice notice-${tone}`} role={role}>
      <span className="notice__icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <span>{children}</span>
    </div>
  );
}

// --- Loading indicator (Req 8.2) -------------------------------------------

export function LoadingBlock({ slow = false }: { slow?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="loading-block" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{slow ? t("loading.slow") : t("loading.label")}</span>
    </div>
  );
}

// --- Empty state -----------------------------------------------------------

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        <InboxIcon size={44} />
      </div>
      <h3>{title}</h3>
      {children ? <p style={{ marginTop: 6, maxWidth: "44ch", marginInline: "auto" }}>{children}</p> : null}
    </div>
  );
}

// --- Verified marker -------------------------------------------------------

/**
 * The "Verified" badge shown on every curated card. Only verified records ever
 * reach a Visitor (the visibility gate runs server-side), so this badge is
 * always affirmative — it signals an item passed curation (Req 7.5 context).
 */
export function VerifiedBadge() {
  const { t } = useI18n();
  return (
    <span className="badge badge-verified">
      <span className="badge-dot" aria-hidden="true" />
      {t("trust.verified")}
    </span>
  );
}
