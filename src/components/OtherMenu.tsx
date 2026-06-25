/**
 * Other_Menu — the "Other" grouping in the Primary_Navigation (Req 1.2, 5.1).
 *
 * Opening "Other" reveals two DISTINCT links: an in-Hub navigation link to the
 * Resource_Directory, and an outbound link to the existing People_Finder. The
 * People_Finder link is rendered through the shared ExternalLink so its host
 * name shows and it opens in a new context (Req 5.2, 5.3).
 *
 * Implemented as an accessible disclosure: a button with aria-expanded controlling
 * a panel; Escape closes and returns focus; outside-click closes.
 */

import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sourceHostLabel } from "../domain/core";
import { useI18n } from "../i18n/I18nProvider";
import { DAMAGE_MAP_URL, PEOPLE_FINDER_URL } from "../config";
import { ExternalIcon, MapIcon, PeopleIcon, ResourceIcon } from "./icons";

export function OtherMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
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

  const peopleHost = sourceHostLabel(PEOPLE_FINDER_URL).label;
  const damageMapHost = sourceHostLabel(DAMAGE_MAP_URL).label;

  function handleNavigate() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div className="other-menu" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className={`nav-link ${open ? "is-active" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {t("nav.other")}
        <span aria-hidden="true" style={{ fontSize: "0.7em", opacity: 0.7 }}>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className="other-menu__panel" id={panelId} role="menu" aria-label={t("nav.other.aria")}>
          {/* Distinct in-Hub link: Resource Directory */}
          <Link to="/resources" className="other-item" role="menuitem" onClick={handleNavigate}>
            <span className="other-item__title">
              <ResourceIcon size={18} />
              {t("nav.resources")}
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>
              {t("card.resources.body")}
            </span>
          </Link>

          <div className="other-menu__divider" role="separator" />

          {/* Distinct outbound link: People_Finder (external, host shown, new tab) */}
          <a
            href={PEOPLE_FINDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="other-item"
            role="menuitem"
            onClick={handleNavigate}
          >
            <span className="other-item__title">
              <PeopleIcon size={18} />
              {t("nav.peopleFinder")}
              <ExternalIcon size={14} />
            </span>
            <span className="other-item__host">
              {peopleHost} · {t("ext.opensNewTab")}
            </span>
          </a>

          {/* Distinct outbound link: Mapa de Daño (external damage map, new tab) */}
          <a
            href={DAMAGE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="other-item"
            role="menuitem"
            onClick={handleNavigate}
          >
            <span className="other-item__title">
              <MapIcon size={18} />
              {t("nav.damageMap")}
              <ExternalIcon size={14} />
            </span>
            <span className="other-item__host">
              {damageMapHost} · {t("ext.opensNewTab")}
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
