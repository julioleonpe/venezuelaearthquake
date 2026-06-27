/**
 * SituationOverview — a compact "Situation overview" trigger (placed in the status
 * strip) that opens an accessible modal dialog with the full situational briefing.
 *
 * The home view is locked to one viewport, so the long-form overview lives behind
 * this dialog rather than inline. The dialog traps nothing heavy: it closes on Esc
 * and on backdrop click, restores focus to the trigger on close, and renders into
 * the document body so it overlays the bento grid cleanly.
 *
 * Content is bilingual chrome (catalog `cc.overview.*`); the figures here mirror
 * the status-strip stats so the page never contradicts itself.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n/I18nProvider";
import { CloseIcon, InfoIcon } from "./icons";

/** The sources cited in the overview, rendered as outbound links. */
const SOURCES: { label: string; url: string }[] = [
  { label: "Reuters", url: "https://www.reuters.com/" },
  { label: "BBC", url: "https://www.bbc.com/news" },
  { label: "New York Times", url: "https://www.nytimes.com/" },
  { label: "NBC News", url: "https://www.nbcnews.com/" },
  { label: "Northeastern University", url: "https://news.northeastern.edu/" },
];

export function SituationOverview() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="overview-trigger"
        onClick={() => setOpen(true)}
      >
        <InfoIcon size={14} />
        {t("cc.overview.open")}
      </button>
      {open && (
        <OverviewDialog
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      )}
    </>
  );
}

function OverviewDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape; move focus into the dialog on mount.
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="overview-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="overview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overview-title"
        tabIndex={-1}
      >
        <header className="overview-modal__head">
          <h2 id="overview-title" className="overview-modal__title">
            {t("cc.overview.title")}
          </h2>
          <button
            type="button"
            className="overview-modal__close"
            onClick={onClose}
            aria-label={t("cc.overview.close")}
          >
            <CloseIcon size={18} />
          </button>
        </header>
        <div className="overview-modal__body">
          <p>{t("cc.overview.p1")}</p>
          <p>{t("cc.overview.p2")}</p>
          <p className="overview-modal__sources">
            <span className="overview-modal__sources-label">{t("cc.overview.sources")}:</span>{" "}
            {SOURCES.map((s, i) => (
              <span key={s.url}>
                {i > 0 && <span aria-hidden="true"> · </span>}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
