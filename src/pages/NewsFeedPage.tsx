/**
 * NewsFeedPage — verified News_Items, newest first, ≤50 (the API already applies
 * `orderedVerifiedNews`). Each item shows headline, summary, source attribution,
 * and a date+time timestamp (Req 4.2). Selecting an item opens its source link in
 * a new tab (Req 4.3); an item with no source link shows a source-unavailable
 * indication while staying on the feed (Req 4.7, 7.2). Empty + unavailable states
 * per Req 4.6 / 8.x.
 */

import { getNews } from "../api/store";
import { ExternalLink } from "../components/ExternalLink";
import { ClockIcon } from "../components/icons";
import {
  EmptyState,
  LanguageIndicator,
  LoadingBlock,
  Notice,
  TrustStatement,
  VerifiedBadge,
} from "../components/primitives";
import type { NewsItem } from "../domain/types";
import { useI18n } from "../i18n/I18nProvider";
import { formatDateTime } from "../lib/datetime";
import { openExternal } from "../lib/openExternal";
import { useSubsystem } from "../lib/useSubsystem";
import { usePageHeadingFocus } from "../lib/usePageTitle";

export default function NewsFeedPage() {
  const { t, lang } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("news.title"));
  const news = useSubsystem(() => getNews(), []);

  return (
    <div className="container page">
      <header className="page-head">
        <div className="kicker">
          <hr className="tricolor-rule thin" />
          {t("nav.latest")}
        </div>
        <h1 ref={h1Ref} tabIndex={-1} style={{ outline: "none" }}>
          {t("news.title")}
        </h1>
        <p className="lede">{t("news.intro")}</p>
      </header>

      <div style={{ marginBottom: 24 }}>
        <TrustStatement />
      </div>

      {news.status === "loading" && <LoadingBlock slow={news.slow} />}
      {news.status === "error" && <Notice tone="danger" role="alert">{t("news.unavailable")}</Notice>}
      {news.status === "ready" &&
        (news.data.length === 0 ? (
          <EmptyState title={t("news.empty")} />
        ) : (
          <div className="record-list">
            {news.data.map((item) => (
              <NewsCard key={item.id} item={item} formatLang={lang} />
            ))}
          </div>
        ))}
    </div>
  );
}

function NewsCard({ item, formatLang }: { item: NewsItem; formatLang: "en" | "es" }) {
  const { t } = useI18n();
  const hasSource = !!item.sourceLink;

  // Whole-card affordance: clicking opens source in a new tab (Req 4.3) when present.
  function openSource() {
    if (item.sourceLink) openExternal(item.sourceLink);
  }

  return (
    <article
      className={`record-card ${hasSource ? "news-card" : ""}`}
      onClick={hasSource ? openSource : undefined}
      onKeyDown={
        hasSource
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openSource();
              }
            }
          : undefined
      }
      tabIndex={hasSource ? 0 : undefined}
      role={hasSource ? "link" : undefined}
      aria-label={hasSource ? `${item.headline} — ${t("news.openSource")}` : undefined}
    >
      <div className="record-card__meta">
        <VerifiedBadge />
        <LanguageIndicator contentLanguage={item.contentLanguage} />
        <span className="record-card__time">
          <ClockIcon size={14} />
          <time dateTime={item.publishedAt}>{formatDateTime(item.publishedAt, formatLang)}</time>
        </span>
      </div>

      <h3>{item.headline}</h3>
      <p className="record-card__desc">{item.summary}</p>

      <div className="record-card__foot">
        <span className="news-card__attribution">
          {t("news.source")}: {item.sourceAttribution}
        </span>
        {/* Source link / unverified handling (Req 7.1, 7.2, 4.7) */}
        {hasSource ? (
          <span onClick={(e) => e.stopPropagation()}>
            <ExternalLink href={item.sourceLink}>{t("news.openSource")}</ExternalLink>
          </span>
        ) : (
          <ExternalLink href={null}>{t("news.openSource")}</ExternalLink>
        )}
      </div>
    </article>
  );
}
