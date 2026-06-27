/**
 * StakeholderMap (/stakeholders) — the relief-response "player map".
 *
 * A TRUE single-view dashboard: a slim header over a fixed bento grid that fills
 * the remaining viewport. Every functional category and every organization is
 * visible at once — nothing scrolls. Each tile is a category; each row is one org
 * (status dot + name, name links to the org's site in a new tab). The dot colour
 * tells you at a glance which are strong contacts (Hub-cited = green); the org's
 * role + host show on hover (title tooltip) so the grid stays dense.
 *
 * This is NOT trust-gated content: it's an informational index of third-party
 * responders the Hub does not own, so it leads with a "listing is not
 * verification" note and shows each org's `status`. Data is from
 * src/data/stakeholders.ts (single source of truth); chrome is bilingual.
 */

import { Link } from "react-router-dom";
import { AlertIcon, ArrowRightIcon, ExternalIcon } from "../components/icons";
import {
  STAKEHOLDER_COUNT,
  STAKEHOLDER_GROUPS,
  type Stakeholder,
  type StakeholderStatus,
} from "../data/stakeholders";
import { sourceHostLabel } from "../domain/core";
import type { MessageId } from "../i18n/catalog";
import { useI18n } from "../i18n/I18nProvider";
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

  return (
    <div className="stake">
      {/* ── Slim header: back · title+count · legend · one-line note ──────── */}
      <header className="stake__head">
        <Link to="/" className="stake__back-btn">
          <span className="stake__back-arrow" aria-hidden="true">
            <ArrowRightIcon size={15} />
          </span>
          {t("stake.back")}
        </Link>

        <div className="stake__titles">
          <h1 id="stake-h1" ref={h1Ref} tabIndex={-1}>
            {t("stake.title")}
          </h1>
          <span className="stake__count-pill">
            {t("stake.count.many").replace("{n}", String(STAKEHOLDER_COUNT))}
          </span>
        </div>

        <p className="stake__note" role="note">
          <AlertIcon size={13} aria-hidden="true" />
          <span>{t("stake.disclaimer.short")}</span>
        </p>

        <ul className="stake__legend" aria-label={t("stake.legend.title")}>
          <li><Dot status="hub" /> {t("stake.legend.hub")}</li>
          <li><Dot status="cand" /> {t("stake.legend.cand")}</li>
          <li><Dot status="verify" /> {t("stake.legend.verify")}</li>
        </ul>
      </header>

      {/* ── Fixed bento: all categories + orgs in one view, no scroll ────── */}
      <div className="stake__map">
        {STAKEHOLDER_GROUPS.map((group, i) => (
          <section className="stake-tile" key={group.key} aria-labelledby={`stake-${group.key}`}>
            <header className="stake-tile__head">
              <span className="stake-tile__num">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="stake-tile__title" id={`stake-${group.key}`}>
                {es ? group.titleEs : group.titleEn}
              </h2>
              <span className="stake-tile__count">{group.orgs.length}</span>
            </header>
            <ul className="stake-tile__orgs">
              {group.orgs.map((org) => (
                <OrgRow key={org.name} org={org} es={es} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function OrgRow({ org, es }: { org: Stakeholder; es: boolean }) {
  const { t } = useI18n();
  const role = es ? org.roleEs : org.roleEn;
  const host = org.url ? sourceHostLabel(org.url).label : "";
  const tip = host ? `${role} · ${host}` : role;
  const status = t(STATUS_MSG[org.status]);

  // Each org is a compact row; the name links out (new tab). Role + host live in
  // the tooltip so the grid stays dense enough to show everything at once.
  const inner = (
    <>
      <Dot status={org.status} />
      <span className="stake-org__name">{org.name}</span>
      {org.url && <ExternalIcon size={11} aria-hidden="true" />}
    </>
  );

  if (!org.url) {
    return (
      <li className="stake-org is-nolink" title={`${status} · ${role}`}>
        {inner}
      </li>
    );
  }
  return (
    <li className="stake-org">
      <a
        className="stake-org__link"
        href={org.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${status} · ${tip}`}
      >
        {inner}
      </a>
    </li>
  );
}

function Dot({ status }: { status: StakeholderStatus }) {
  const { t } = useI18n();
  return (
    <span
      className={`stake-dot stake-dot--${status}`}
      role="img"
      aria-label={t(STATUS_MSG[status])}
    />
  );
}
