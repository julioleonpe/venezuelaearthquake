/**
 * CommandCenter — the single-view bento "seismograph console" home, and the Hub's
 * only route (no drill-down pages). One desktop viewport, no page scroll: a fixed
 * bento grid where each tile owns an independent data source and degrades on its
 * own. Tiles:
 *  - Status strip: what happened + key stats (content-last-updated lives in the
 *    shell's floating nav, top-right, Req 1.7).
 *  - News: verified News_Items, newest first — internal scroll.
 *  - Relief Tools & Apps: outbound launcher (people finders, damage tools,
 *    services) sourced from RELIEF_TOOLS; multi-tool groups expand inline.
 *  - Seismic console: live dual-layer map (USGS seismicity + community damage),
 *    the centerpiece.
 *  - Donate: Caritas link-out card + other verified channels (funds handled on the
 *    recipient's own site).
 *
 * The trust spine: curated news/donations still flow through the pure visibility
 * gate via src/api (reading the verified-only published dataset). Below the fold
 * (and on mobile) the grid relaxes into a natural vertical stack.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDonations, getNews } from "../api/store";
import { DonatePanel } from "../components/DonatePanel";
import { ExternalLink } from "../components/ExternalLink";
import { SeismicConsole } from "../components/SeismicConsole";
import { SituationOverview } from "../components/SituationOverview";
import { ExternalIcon, PeopleIcon, MapIcon, HeartIcon, ShieldCheckIcon, ChevronDownIcon, NewsIcon, ResourceIcon, ActivityIcon, DonateIcon, InboxIcon, PawIcon } from "../components/icons";
import { RELIEF_TOOLS, CARITAS_SITE_URL, NEW_TOOL_WINDOW_DAYS } from "../config";
import type { ReliefTool, ReliefToolGroup } from "../config";
import { needsLanguageIndicator, sourceHostLabel } from "../domain/core";
import type { DonationChannel, NewsItem } from "../domain/types";
import type { MessageId } from "../i18n/catalog";
import { useI18n } from "../i18n/I18nProvider";
import { formatDateTime, isWithinDays } from "../lib/datetime";
import { fetchDonateClicks, recordDonateClick } from "../lib/donateClicks";
import { useMediaQuery } from "../lib/useMediaQuery";
import { openExternal } from "../lib/openExternal";
import { useSubsystem } from "../lib/useSubsystem";
import { usePageHeadingFocus } from "../lib/usePageTitle";
import type { ReactNode } from "react";

type SectionKey = "news" | "tools" | "seismic" | "donate";

export default function CommandCenter() {
  const { t, lang } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("brand.name"));
  const news = useSubsystem(() => getNews(), []);
  const donations = useSubsystem(() => getDonations(), []);

  // Mobile-only accordion: below the bento breakpoint each tile collapses behind an
  // "app button" header and only the open section's body mounts. Donate is the one
  // section open by default (the primary action). Desktop ignores this entirely.
  const mobile = useMediaQuery("(max-width: 720px)");
  const [open, setOpen] = useState<SectionKey>("donate");
  const toggle = (k: SectionKey) => setOpen((cur) => (cur === k ? ("" as SectionKey) : k));
  // On desktop everything is always shown; on mobile only the open section's body.
  const shows = (k: SectionKey) => !mobile || open === k;

  return (
    <div className={`cc ${mobile ? "cc--mobile" : ""}`}>
      {/* ── Status strip: headline + stats (last-updated lives in the shell nav) ─ */}
      <section className="cc-strip" aria-labelledby="cc-h1">
        <div className="cc-strip__lead">
          <h1 id="cc-h1" ref={h1Ref} tabIndex={-1}>
            {t("cc.headline")}
          </h1>
          <p className="cc-strip__blurb">{t("cc.blurb")}</p>
          <SituationOverview />
        </div>
        <div className="cc-strip__stats">
          <Stat value="7.5" label={t("cc.stat.magnitude")} accent />
          <Stat value="2" label={t("cc.stat.quakes")} />
          <Stat value="1,430" label={t("cc.stat.deaths")} />
          <Stat value="3,200+" label={t("cc.stat.injuries")} />
          <Stat value={t("cc.stat.missing.value")} label={t("cc.stat.missing")} />
        </div>
      </section>

      {/* ── Bento grid (desktop) / collapsible accordion (mobile) ─────────── */}
      <div className="cc-grid">
        {/* Donate — Caritas featured + other verified channels. PRIMARY action:
            on mobile it's the section open by default. */}
        <TileShell
          variant="donate"
          icon={<DonateIcon size={20} />}
          title={t("cc.tile.donate")}
          mobile={mobile}
          open={shows("donate")}
          onToggle={() => toggle("donate")}
          accessory={<DonateClicksBadge />}
        >
          <div className="tile__scroll tile__scroll--donate">
            {/* Caritas — the launch channel, highlighted in its own card. */}
            <div className="donate-featured">
              <DonatePanel />
            </div>
            {donations.status === "ready" && (
              // Caritas is already featured above; the remaining verified channels
              // stay collapsed behind a toggle so Caritas leads without scrolling.
              <DonateMore
                channels={donations.data.filter((c) => c.destinationLink !== CARITAS_SITE_URL)}
                lang={lang}
              />
            )}
          </div>
        </TileShell>

        {/* News — verified feed, newest first */}
        <TileShell
          variant="news"
          icon={<NewsIcon size={20} />}
          title={t("cc.tile.news")}
          mobile={mobile}
          open={shows("news")}
          onToggle={() => toggle("news")}
        >
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
        </TileShell>

        {/* Relief Tools & Apps — iOS-style app launcher (folders expand inline). */}
        <TileShell
          variant="tools"
          icon={<ResourceIcon size={20} />}
          title={t("tools.title")}
          mobile={mobile}
          open={shows("tools")}
          onToggle={() => toggle("tools")}
        >
          <div className="tile__scroll tools-launcher">
            <ToolsLauncher />
          </div>
        </TileShell>

        {/* Seismic console — wide centerpiece. On mobile, mounts only when expanded
            (so the Leaflet map isn't fetched until the user opens it). */}
        <TileShell
          variant="seismic"
          icon={<ActivityIcon size={20} />}
          title={t("seismic.title")}
          mobile={mobile}
          open={shows("seismic")}
          onToggle={() => toggle("seismic")}
          bare
        >
          <SeismicConsole />
        </TileShell>
      </div>
    </div>
  );
}

/**
 * TileShell — a bento tile on desktop; a collapsible "app button" on mobile.
 *
 * Desktop: renders the normal tile with its TileHead and always-visible body.
 * Mobile: the header becomes a full-width button (icon + title + chevron) that
 * toggles the body; the body is only rendered when `open`, so collapsed sections
 * (notably the Leaflet map) don't mount. Keeps the trust/data flow identical —
 * this is presentation only.
 */
function TileShell({
  variant,
  icon,
  title,
  mobile,
  open,
  onToggle,
  bare = false,
  accessory,
  children,
}: {
  variant: SectionKey;
  icon: ReactNode;
  title: string;
  mobile: boolean;
  open: boolean;
  onToggle: () => void;
  bare?: boolean;
  /** Optional element rendered next to the title in the tile header. */
  accessory?: ReactNode;
  children: ReactNode;
}) {
  const headId = `tile-${variant}-h`;
  const bodyId = `tile-${variant}-body`;

  if (!mobile) {
    // Desktop bento — unchanged behavior. `bare` tiles (seismic) own their header
    // internally, so they render no TileHead and label the section directly.
    if (bare) {
      return (
        <section className={`tile tile--${variant}`} aria-label={title}>
          {children}
        </section>
      );
    }
    return (
      <section className={`tile tile--${variant}`} aria-labelledby={headId}>
        <TileHead id={headId} title={title} accessory={accessory} />
        {children}
      </section>
    );
  }

  // Mobile accordion item.
  return (
    <section className={`tile tile--${variant} tile--collapsible ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="tile__appbtn"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={onToggle}
      >
        <span className="tile__appbtn-icon">{icon}</span>
        <span id={headId} className="tile__appbtn-title">{title}</span>
        {accessory}
        <ChevronDownIcon size={18} />
      </button>
      {open && (
        <div id={bodyId} className={`tile__body ${bare ? "tile__body--bare" : ""}`}>
          {children}
        </div>
      )}
    </section>
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

function TileHead({ id, title, accessory }: { id: string; title: string; accessory?: ReactNode }) {
  return (
    <header className="tile__head">
      <h2 id={id} className="tile__title">{title}</h2>
      {accessory}
    </header>
  );
}

const GROUP_ICON: Record<ReliefToolGroup["key"], typeof PeopleIcon> = {
  people: PeopleIcon,
  damage: MapIcon,
  services: HeartIcon,
  coordination: InboxIcon,
  pets: PawIcon,
  organizations: ResourceIcon,
};

/**
 * iOS-style app launcher. Each category is an "app" in a grid. Single-tool
 * categories launch their link directly (an anchor); multi-tool categories are
 * "folders" that expand inline to reveal their registries/tools. One folder is
 * open at a time (accordion) to stay within the tile.
 */
function ToolsLauncher() {
  const [open, setOpen] = useState<ReliefToolGroup["key"] | null>(null);

  return (
    <div className="app-launcher">
      <div className="app-grid">
        {RELIEF_TOOLS.map((group) => (
          <ToolApp
            key={group.key}
            group={group}
            expanded={open === group.key}
            onToggle={() => setOpen((cur) => (cur === group.key ? null : group.key))}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Transient "newly added" badge. Shows only while a tool's `addedAt` is within
 * NEW_TOOL_WINDOW_DAYS of now, then drops automatically (no manual cleanup). The
 * current time is read once per render via `new Date()` — presentation-only, so
 * it stays out of the pure domain layer.
 */
function NewBadge({ tool }: { tool: ReliefTool }) {
  const { t } = useI18n();
  if (!isWithinDays(tool.addedAt, NEW_TOOL_WINDOW_DAYS, new Date())) return null;
  return <span className="tool-new">{t("tools.newBadge")}</span>;
}

/** Any tool in the group still inside its "newly added" window? */
function groupHasNew(group: ReliefToolGroup): boolean {
  const now = new Date();
  return group.tools.some((tool) => isWithinDays(tool.addedAt, NEW_TOOL_WINDOW_DAYS, now));
}

function ToolApp({
  group,
  expanded,
  onToggle,
}: {
  group: ReliefToolGroup;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();
  const Icon = GROUP_ICON[group.key];
  const isFolder = group.tools.length > 1;
  const title = t(group.titleKey as MessageId);

  // Single-tool category → launch directly (no expansion).
  if (!isFolder) {
    const tool = group.tools[0];

    // Internal route → client-side navigation within the Hub (no new tab).
    if (tool.internal) {
      return (
        <Link
          className={`app-icon app-icon--${group.key}`}
          to={tool.url}
          title={t(tool.subKey as MessageId) ? `${title} — ${t(tool.subKey as MessageId)}` : title}
        >
          <span className="app-icon__glyph"><Icon size={24} /></span>
          <span className="app-icon__label">{title}</span>
          {t(tool.subKey as MessageId) && (
            <span className="app-icon__meta">{t(tool.subKey as MessageId)}</span>
          )}
        </Link>
      );
    }

    const host = sourceHostLabel(tool.url).label;
    return (
      <a
        className={`app-icon app-icon--${group.key}`}
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${title} — ${host}`}
      >
        <span className="app-icon__glyph"><Icon size={24} /></span>
        <span className="app-icon__label">{title}</span>
        <span className="app-icon__meta"><ExternalIcon size={11} /> {host}</span>
        <NewBadge tool={tool} />
      </a>
    );
  }

  // Multi-tool category → folder that expands inline.
  const panelId = `app-panel-${group.key}`;
  return (
    <>
      <button
        type="button"
        className={`app-icon app-icon--${group.key} app-icon--folder ${expanded ? "is-open" : ""}`}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="app-icon__glyph">
          <Icon size={24} />
          <span className="app-icon__badge">{group.tools.length}</span>
          {groupHasNew(group) && <span className="app-icon__newdot" title={t("tools.newBadge")} />}
        </span>
        <span className="app-icon__label">{title}</span>
        <span className="app-icon__meta">
          {t(
            group.key === "people" ? "tools.peopleCount" : "tools.itemCount",
          ).replace("{n}", String(group.tools.length))}
        </span>
      </button>

      {expanded && (
        <div className="app-folder" id={panelId} role="region" aria-label={title}>
          <ul className="app-folder__list">
            {group.tools.map((tool) => {
              const host = sourceHostLabel(tool.url).label;
              return (
                <li key={tool.url}>
                  <a className="tool-row" href={tool.url} target="_blank" rel="noopener noreferrer">
                    <span className="tool-row__body">
                      <span className="tool-row__label">
                        {t(tool.labelKey as MessageId)} <ExternalIcon size={12} />
                        <NewBadge tool={tool} />
                      </span>
                      <span className="tool-row__sub">{t(tool.subKey as MessageId)}</span>
                    </span>
                    <span className="tool-row__host" aria-hidden="true">{host}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

/**
 * DonateClicksBadge — shows the shared, community-wide count of donation links
 * opened from the Hub. Reads `/api/donate-clicks` on mount; if the counter store
 * isn't configured (local dev, preview without KV) the total is null and the badge
 * renders nothing. It's a best-effort engagement signal — never a financial figure
 * (the Hub still never handles funds).
 */
function DonateClicksBadge() {
  const { t, lang } = useI18n();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDonateClicks().then((n) => {
      if (!cancelled) setTotal(n);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (total == null || total <= 0) return null;
  const num = total.toLocaleString(lang);
  return (
    <span className="donate-clicks" role="note">
      <HeartIcon size={12} />
      <span className="donate-clicks__num">{num}</span>
      <span className="donate-clicks__label">{t("donate.clicks.label")}</span>
    </span>
  );
}

/**
 * DonateMore — the "other verified channels" list, collapsed behind a toggle so
 * the featured Caritas card is the default focus. Expanding reveals the rest.
 */
function DonateMore({ channels, lang }: { channels: DonationChannel[]; lang: "en" | "es" }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  if (channels.length === 0) return null;

  const panelId = "donate-more-panel";
  return (
    <div className="donate-more">
      <button
        type="button"
        className={`donate-more__toggle ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="donate-more__label">{t("cc.donate.more")}</span>
        <span className="donate-more__count">{channels.length}</span>
        <ChevronDownIcon size={16} />
      </button>
      {open && (
        <div id={panelId} className="donate-more__list">
          {channels.map((c) => (
            <DonationRow key={c.id} channel={c} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

function DonationRow({ channel, lang }: { channel: DonationChannel; lang: "en" | "es" }) {
  const { t } = useI18n();
  const showLang = needsLanguageIndicator(channel.contentLanguage, lang);

  const host = sourceHostLabel(channel.destinationLink).label;

  return (
    <article className="donate-row">
      <div className="donate-row__head">
        <span className="donate-panel__badge">
          <ShieldCheckIcon size={13} />
          {t("donate.verified")}
        </span>
        <span className="donate-panel__host">{host}</span>
      </div>
      <div className="donate-row__main">
        <h3 className="donate-row__org">{channel.recipientOrganization}</h3>
        {channel.affiliationLabel && (
          <span className="donate-row__affil">{channel.affiliationLabel}</span>
        )}
        <p className="donate-row__desc">{channel.description}</p>
      </div>
      <div className="donate-row__foot">
        {showLang && <span className="news-row__lang">{channel.contentLanguage.toUpperCase()}</span>}
        <ExternalLink
          href={channel.destinationLink}
          variant="button"
          onClick={() => recordDonateClick(channel.id)}
        >
          {t("donations.give")}
        </ExternalLink>
      </div>
    </article>
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
