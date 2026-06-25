/**
 * DonationsPage — verified, complete Donation_Channels (the API applies
 * `visibleDonations`, so incomplete/unverified channels never arrive). Each card
 * shows the recipient name, affiliation label where present (Req 3.9), the
 * description, and a link OUT to the recipient's own donation page (Req 3.2, 3.8).
 * The confirm-on-official-site notice (Req 3.5), empty state (3.6), and
 * retrieval-failure notice (3.7) are all present. The Hub never collects,
 * processes, embeds, or proxies donations.
 */

import { getDonations } from "../api/store";
import { ExternalLink } from "../components/ExternalLink";
import {
  EmptyState,
  LanguageIndicator,
  LoadingBlock,
  Notice,
  TrustStatement,
  VerifiedBadge,
} from "../components/primitives";
import { useI18n } from "../i18n/I18nProvider";
import { useSubsystem } from "../lib/useSubsystem";
import { usePageHeadingFocus } from "../lib/usePageTitle";

export default function DonationsPage() {
  const { t } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("donations.title"));
  const donations = useSubsystem(() => getDonations(), []);

  return (
    <div className="container page">
      <header className="page-head">
        <div className="kicker">
          <hr className="tricolor-rule thin" />
          {t("nav.donate")}
        </div>
        <h1 ref={h1Ref} tabIndex={-1} style={{ outline: "none" }}>
          {t("donations.title")}
        </h1>
        <p className="lede">{t("donations.intro")}</p>
      </header>

      {/* Confirm-on-official-site notice (Req 3.5) */}
      <div style={{ marginBottom: 18 }}>
        <Notice tone="info" role="note">
          {t("donations.notice")}
        </Notice>
      </div>
      <div style={{ marginBottom: 26 }}>
        <TrustStatement />
      </div>

      {donations.status === "loading" && <LoadingBlock slow={donations.slow} />}
      {donations.status === "error" && (
        <Notice tone="danger" role="alert">
          {t("donations.unavailable")}
        </Notice>
      )}
      {donations.status === "ready" &&
        (donations.data.length === 0 ? (
          <EmptyState title={t("donations.empty")} />
        ) : (
          <div className="record-list">
            {donations.data.map((c) => (
              <article key={c.id} className="record-card donation-card">
                <div className="record-card__meta">
                  <VerifiedBadge />
                  <LanguageIndicator contentLanguage={c.contentLanguage} />
                </div>

                <div className="donation-card__org">
                  <h3>{c.recipientOrganization}</h3>
                  {/* Affiliation label adjacent to recipient name (Req 3.9) */}
                  {c.affiliationLabel && (
                    <span className="donation-card__affiliation">
                      {t("donations.affiliation")}: {c.affiliationLabel}
                    </span>
                  )}
                </div>

                <p className="record-card__desc">{c.description}</p>

                <div className="record-card__foot">
                  {/* Destination host shown; opens in new tab; Hub keeps the page (Req 3.4, 7.3) */}
                  <ExternalLink href={c.destinationLink}>{c.recipientOrganization}</ExternalLink>
                  <ExternalLink href={c.destinationLink} variant="button">
                    {t("donations.give")}
                  </ExternalLink>
                </div>
              </article>
            ))}
          </div>
        ))}
    </div>
  );
}
