/**
 * StakeholderMap (/stakeholders) — an in-app reference of organizations engaged
 * in the response, grouped by function.
 *
 * Like the Command Center, this is a SINGLE-VIEW surface: a fixed header (back
 * button, title, the "listing is not verification" notice, status legend) over
 * one internal scroll region for the grouped directory. The page itself never
 * scrolls the document — only the body region scrolls — so the back button and
 * disclaimer stay pinned. Below the bento breakpoint it relaxes to a normal stack.
 *
 * Unlike the curated subsystems it is NOT trust-gated content: it's an
 * informational index of third-party responders the Hub does not own. So it
 * shows each org's `status` (Hub-cited / candidate / verify-first) as a badge and
 * routes every outbound link through ExternalLink (host shown, opens new tab).
 *
 * Data comes from src/data/stakeholders.ts (the single source of truth). Chrome is
 * bilingual via i18n; org role blurbs carry their own EN/ES copy in the dataset.
 */

import { Link } from "react-router-dom";
import { ExternalLink } from "../components/ExternalLink";
import { AlertIcon, ArrowRightIcon } from "../components/icons";
import {
  STAKEHOLDER_COUNT,
  STAKEHOLDER_GROUPS,
  type StakeholderStatus,
} from "../data/stakeholders";
import type { MessageId } from "../i18n/catalog";
import { useI18n } from "../i18n/I18nProvider";
import { useMediaQuery } from "../lib/useMediaQuery";
import { usePageHeadingFocus } from "../lib/usePageTitle";

const STATUS_MSG: Record<StakeholderStatus, MessageId> = {
  hub: "stake.status.hub",
  cand: "stake.status.cand",
  verify: "stake.status.verify",
};

export default function StakeholderMap() {
  const { t, lang } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("stake.title"));
  const es = lang === "es";
  const mobile = useMediaQuery("(max-width: 720px)");

  return (
    <div className={`stake ${mobile ? "stake--mobile" : ""}`}>
      {/* ── Fixed header: back · title · disclaimer · legend ──────────────── */}
      <header className="stake__head">
        <div className="stake__head-top">
          <Link to="/" className="stake__back-btn">
            <span className="stake__back-arrow" aria-hidden="true">
              <ArrowRightIcon size={15} />
            </span>
            {t("stake.back")}
          </Link>
          <span className="stake__count-pill">
            {t("stake.count.many").replace("{n}", String(STAKEHOLDER_COUNT))}
          </span>
        </div>

        <div className="stake__titles">
          <p className="kicker">{t("stake.kicker")}</p>
          <h1 id="stake-h1" ref={h1Ref} tabIndex={-1}>
            {t("stake.title")}
          </h1>
        </div>

        <div className="notice notice-warn stake__disclaimer" role="note">
          <span className="notice__icon" aria-hidden="true">
            <AlertIcon size={18} />
          </span>
          <span>{t("stake.disclaimer")}</span>
        </div>

        <div className="stake__legend">
          <span className="stake__legend-item">
            <StatusBadge status="hub" />
            <span>{t("stake.legend.hub")}</span>
          </span>
          <span className="stake__legend-item">
            <StatusBadge status="cand" />
            <span>{t("stake.legend.cand")}</span>
          </span>
          <span className="stake__legend-item">
            <StatusBadge status="verify" />
            <span>{t("stake.legend.verify")}</span>
          </span>
        </div>
      </header>

      {/* ── Single internal scroll region ────────────────────────────────── */}
      <div className="stake__scroll">
        {STAKEHOLDER_GROUPS.map((group, i) => (
          <section className="stake__cat" key={group.key} aria-labelledby={`stake-${group.key}`}>
            <header className="stake__cat-head">
              <span className="stake__cat-num">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="stake__cat-title" id={`stake-${group.key}`}>
                {es ? group.titleEs : group.titleEn}
              </h2>
              <span className="stake__cat-count">
                {t(group.orgs.length === 1 ? "stake.count.one" : "stake.count.many").replace(
                  "{n}",
                  String(group.orgs.length),
                )}
              </span>
            </header>

            <div className="stake__grid">
              {group.orgs.map((org) => (
                <article className="stake-org" key={org.name}>
                  <div className="stake-org__top">
                    <StatusBadge status={org.status} />
                  </div>
                  <h3 className="stake-org__name">{org.name}</h3>
                  <p className="stake-org__role">{es ? org.roleEs : org.roleEn}</p>
                  <div className="stake-org__foot">
                    <ExternalLink href={org.url}>{t("stake.open")}</ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <p className="stake__sources">{t("stake.sources")}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StakeholderStatus }) {
  const { t } = useI18n();
  return (
    <span className={`badge stake-badge stake-badge--${status}`}>
      {t(STATUS_MSG[status])}
    </span>
  );
}
