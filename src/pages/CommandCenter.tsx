/**
 * CommandCenter — the single-view bento "seismograph console" home.
 *
 * One desktop viewport, no page scroll: a fixed bento grid where each tile owns
 * an independent data source and degrades on its own (Req: per-subsystem graceful
 * degradation is preserved). Tiles:
 *  - Status strip: what happened + a key stat + content-last-updated (Req 1.7).
 *  - Seismic console: live USGS feed + epicenter map (centerpiece).
 *  - News: verified News_Items, newest first — internal scroll; routes to /news.
 *  - Donate: embedded Caritas appeal (funds handled on Caritas's own site).
 *  - People Finder: outbound to the separate system (new tab).
 *  - Resource Directory: routes to /resources.
 *
 * The trust spine is untouched: news/resources still flow through the pure
 * visibility gate via the mock API. Below the fold (and on mobile) the grid
 * relaxes into a natural vertical stack.
 */

import { Link } from "react-router-dom";
import { getMeta, getNews } from "../api/store";
import { DonatePanel } from "../components/DonatePanel";
import { ExternalLink } from "../components/ExternalLink";
import { SeismicConsole } from "../components/SeismicConsole";
import { ArrowRightIcon, ExternalIcon, PeopleIcon, ResourceIcon, MapIcon, ClockIcon } from "../components/icons";
import { PEOPLE_FINDER_URL, DAMAGE_MAP_URL } from "../config";
import { needsLanguageIndicator, sourceHostLabel } from "../domain/core";
import type { NewsItem } from "../domain/types";
import { useI18n } from "../i18n/I18nProvider";
import { formatDateTime, formatDateTimeTz } from "../lib/datetime";
import { openExternal } from "../lib/openExternal";
import { useSubsystem } from "../lib/useSubsystem";
import { usePageHeadingFocus } from "../lib/usePageTitle";

export default function CommandCenter() {
  const { t, lang } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("brand.name"));
  const news = useSubsystem(() => getNews(), []);
  const meta = useSubsystem(() => getMeta(), []);
  const peopleHost = sourceHostLabel(PEOPLE_FINDER_URL).label;
  const damageMapHost = sourceHostLabel(DAMAGE_MAP_URL).label;

  return (
    <div className="cc">
      {/* ── Status strip: headline + stat + last-updated ──────────────────── */}
      <section className="cc-strip" aria-labelledby="cc-h1">
        <div className="cc-strip__lead">
          <h1 id="cc-h1" ref={h1Ref} tabIndex={-1}>
            {t("cc.headline")}
          </h1>
          <p className="cc-strip__blurb">{t("cc.blurb")}</p>
        </div>
        <div className="cc-strip__stats">
          <Stat value="7.5" label={t("cc.stat.magnitude")} accent />
          <Stat value="2" label={t("cc.stat.quakes")} />
          <Stat value="32+" label={t("cc.stat.deaths")} />
          <Stat value="700" label={t("cc.stat.injuries")} />
          <Stat value={t("cc.stat.missing.value")} label={t("cc.stat.missing")} />
        </div>
        <div className="cc-strip__updated">
          {meta.status === "ready" ? (
            <span className="last-updated">
              <span className="badge-dot" aria-hidden="true" />
              {t("landing.lastUpdated")}:{" "}
              <time dateTime={meta.data.lastUpdated}>{formatDateTimeTz(meta.data.lastUpdated, lang)}</time>
            </span>
          ) : (
            <span className="last-updated" aria-busy="true">
              <ClockIcon size={13} /> {t("loading.label")}
            </span>
          )}
        </div>
      </section>

      {/* ── Bento grid ────────────────────────────────────────────────────── */}
      <div className="cc-grid">
        {/* News — tall left tile, internal scroll */}
        <section className="tile tile--news" aria-labelledby="tile-news-h">
          <TileHead id="tile-news-h" title={t("cc.tile.news")} to="/news" cta={t("cc.viewAll")} />
          <div className="tile__scroll">
            {news.status === "loading" && (
              <div className="console__msg"><span className="spinner" aria-hidden="true" /> {t("loading.label")}</div>
            )}
            {news.status === "error" && (
              <div className="console__msg console__msg--err" role="alert">{t("news.unavailable")}</div>
            )}
            {news.status === "ready" && news.data.length === 0 && (
              <div className="console__msg">{t("news.empty")}</div>
            )}
            {news.status === "ready" &&
              news.data.map((item) => <NewsRow key={item.id} item={item} lang={lang} />)}
          </div>
        </section>

        {/* Quick links — sits above the seismic console (People / Resources / Damage Map) */}
        <nav className="cc-links" aria-label={t("cc.links.label")}>
          {/* People Finder — outbound */}
          <a
            className="tile tile--link tile--people"
            href={PEOPLE_FINDER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="tile-link__icon"><PeopleIcon size={22} /></span>
            <span className="tile-link__body">
              <span className="tile-link__title">
                {t("nav.peopleFinder")} <ExternalIcon size={14} />
              </span>
              <span className="tile-link__sub">{t("cc.people.sub")}</span>
            </span>
            <span className="tile-link__host">{peopleHost}</span>
          </a>

          {/* Mapa de Daño — outbound external damage map */}
          <a
            className="tile tile--link tile--damagemap"
            href={DAMAGE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="tile-link__icon"><MapIcon size={22} /></span>
            <span className="tile-link__body">
              <span className="tile-link__title">
                {t("nav.damageMap")} <ExternalIcon size={14} />
              </span>
              <span className="tile-link__sub">{t("nav.damageMap.sub")}</span>
            </span>
            <span className="tile-link__host">{damageMapHost}</span>
          </a>

          {/* Resource Directory — internal route (currently in progress) */}
          <Link className="tile tile--link tile--resources" to="/resources">
            <span className="tile-link__icon"><ResourceIcon size={22} /></span>
            <span className="tile-link__body">
              <span className="tile-link__title">
                {t("nav.resources")} <ArrowRightIcon size={15} />
              </span>
              <span className="tile-link__sub">{t("cc.resources.sub")}</span>
            </span>
          </Link>
        </nav>

        {/* Seismic console — wide centerpiece */}
        <section className="tile tile--seismic" aria-label={t("seismic.title")}>
          <SeismicConsole />
        </section>

        {/* Donate — embedded Caritas appeal */}
        <section className="tile tile--donate" aria-labelledby="tile-donate-h">
          <TileHead id="tile-donate-h" title={t("cc.tile.donate")} />
          <DonatePanel />
        </section>
      </div>
    </div>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`cc-stat ${accent ? "cc-stat--accent" : ""}`}>
      <span className="cc-stat__value">{value}</span>
      <span className="cc-stat__label">{label}</span>
    </div>
  );
}

function TileHead({ id, title, to, cta }: { id: string; title: string; to?: string; cta?: string }) {
  return (
    <header className="tile__head">
      <h2 id={id} className="tile__title">{title}</h2>
      {to && cta && (
        <Link to={to} className="tile__cta">
          {cta} <ArrowRightIcon size={14} />
        </Link>
      )}
    </header>
  );
}

function NewsRow({ item, lang }: { item: NewsItem; lang: "en" | "es" }) {
  const { t } = useI18n();
  const hasSource = !!item.sourceLink;
  const showLang = needsLanguageIndicator(item.contentLanguage, lang);

  function open() {
    if (item.sourceLink) openExternal(item.sourceLink);
  }

  return (
    <article
      className={`news-row ${hasSource ? "is-link" : ""}`}
      onClick={hasSource ? open : undefined}
      onKeyDown={hasSource ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } } : undefined}
      tabIndex={hasSource ? 0 : undefined}
      role={hasSource ? "link" : undefined}
      aria-label={hasSource ? `${item.headline} — ${t("news.openSource")}` : undefined}
    >
      <div className="news-row__meta">
        <span className="news-row__time">
          <time dateTime={item.publishedAt}>{formatDateTime(item.publishedAt, lang)}</time>
        </span>
        {showLang && (
          <span className="news-row__lang">{item.contentLanguage.toUpperCase()}</span>
        )}
      </div>
      <h3 className="news-row__head">{item.headline}</h3>
      <p className="news-row__summary">{item.summary}</p>
      <div className="news-row__foot">
        <span className="news-row__src">{item.sourceAttribution}</span>
        {hasSource ? (
          <span className="news-row__ext" aria-hidden="true"><ExternalIcon size={13} /></span>
        ) : (
          <span onClick={(e) => e.stopPropagation()}>
            <ExternalLink href={null}>{t("news.openSource")}</ExternalLink>
          </span>
        )}
      </div>
    </article>
  );
}
