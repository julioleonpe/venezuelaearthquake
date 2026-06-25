/**
 * DonatePanel — the Caritas donation tile.
 *
 * Caritas (correctly) forbids being framed, so by default this is a polished,
 * branded LINK-OUT card: recipient identity, affiliation, a few suggested amounts
 * that deep-link to Caritas's own appeal, and a prominent donate button. The Hub
 * never collects, processes, holds, or proxies funds — donation always happens on
 * Caritas's own infrastructure (see CLAUDE.md).
 *
 * An embedded-iframe path exists behind `CARITAS_EMBED_ENABLED` (off by default;
 * see config.ts) for any future recipient that supplies an officially embeddable
 * form URL, with this card as the guaranteed fallback.
 */

import { useEffect, useId, useRef, useState } from "react";
import {
  CARITAS_EMBED_ENABLED,
  CARITAS_EMBED_URL,
  CARITAS_SITE_URL,
} from "../config";
import { sourceHostLabel } from "../domain/core";
import { useI18n } from "../i18n/I18nProvider";
import { ExternalIcon, HeartIcon, InfoIcon, ShieldCheckIcon } from "./icons";

const SUGGESTED = [50, 100, 250] as const;

export function DonatePanel() {
  const { t } = useI18n();
  const host = sourceHostLabel(CARITAS_SITE_URL).label;

  return (
    <div className="donate-panel">
      <header className="donate-panel__head">
        <span className="donate-panel__badge">
          <ShieldCheckIcon size={15} />
          {t("donate.verified")}
        </span>
        <span className="donate-panel__host">{host}</span>
      </header>

      <div className="donate-panel__org">{t("donate.recipient")}</div>
      <div className="donate-panel__affil">
        <span>{t("donate.affiliation")}</span>
        <WhyAustralia />
      </div>

      {CARITAS_EMBED_ENABLED && CARITAS_EMBED_URL ? (
        <CaritasEmbed />
      ) : (
        <CaritasCard host={host} />
      )}
    </div>
  );
}

/**
 * "Why Australia?" info popover — explains why donations route through Caritas
 * Australia rather than directly to Venezuela. Accessible disclosure: a small
 * info button toggles a panel; Escape and outside-click close it.
 */
function WhyAustralia() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className="why-au" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className="why-au__btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("donate.whyAria")}
        onClick={() => setOpen((v) => !v)}
      >
        <InfoIcon size={15} />
      </button>
      {open && (
        <span className="why-au__pop" id={panelId} role="note">
          <span className="why-au__title">{t("donate.whyTitle")}</span>
          {t("donate.why")}
        </span>
      )}
    </span>
  );
}

/** Default: trustworthy branded link-out card with suggested amounts. */
function CaritasCard({ host }: { host: string }) {
  const { t } = useI18n();
  // Caritas's form reads `?amount=` to preselect a gift (graceful no-op if not).
  const amountUrl = (amt: number) => `${CARITAS_SITE_URL}?amount=${amt}`;

  return (
    <>
      <p className="donate-panel__desc">{t("donate.description")}</p>

      <div className="donate-amounts" role="group" aria-label={t("donate.amountsLabel")}>
        {SUGGESTED.map((amt) => (
          <a
            key={amt}
            className="donate-amount"
            href={amountUrl(amt)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="donate-amount__value">${amt}</span>
            <span className="sr-only"> — {host}, {t("ext.opensNewTab")}</span>
          </a>
        ))}
      </div>

      <a className="donate-panel__cta" href={CARITAS_SITE_URL} target="_blank" rel="noopener noreferrer">
        <HeartIcon size={16} />
        {t("donate.cta")}
        <ExternalIcon size={14} />
        <span className="sr-only">— {host}, {t("ext.opensNewTab")}</span>
      </a>
      <p className="donate-panel__note">{t("donate.note")}</p>
    </>
  );
}

/**
 * Optional embedded form (only when CARITAS_EMBED_ENABLED). Falls back to the
 * link-out CTA if the frame never signals load within the budget (i.e. framing
 * is blocked by the recipient's X-Frame-Options / CSP).
 */
function CaritasEmbed() {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const host = sourceHostLabel(CARITAS_SITE_URL).label;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setBlocked(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <>
      <div className="donate-panel__frame-wrap">
        {!blocked ? (
          <iframe
            ref={frameRef}
            className={`donate-panel__frame ${loaded ? "is-loaded" : ""}`}
            src={CARITAS_EMBED_URL}
            title={t("donate.frameTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="donate-panel__fallback">
            <p>{t("donate.fallback")}</p>
          </div>
        )}
        {!loaded && !blocked && (
          <div className="donate-panel__frame-loading" aria-hidden="true">
            <span className="spinner" />
          </div>
        )}
      </div>
      <a className="donate-panel__cta" href={CARITAS_SITE_URL} target="_blank" rel="noopener noreferrer">
        {t("donate.openOfficial")}
        <ExternalIcon size={15} />
        <span className="sr-only">— {host}, {t("ext.opensNewTab")}</span>
      </a>
      <p className="donate-panel__note">{t("donate.note")}</p>
    </>
  );
}
