/**
 * AppShell — a slim console command bar over the routed view.
 *
 * The bar carries the brand mark, a live status readout, the Primary_Navigation
 * (Latest · Donate · Other), and the persistent Language_Toggle (Req 10.1). On the
 * home route the shell locks to one viewport (the bento command center owns its
 * own internal scroll); drill-down routes (/news, /donate, /resources) scroll
 * normally. A skip link + focusable <main> keep it keyboard/AT operable.
 */

import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageToggle } from "./LanguageToggle";
import { OtherMenu } from "./OtherMenu";
import { BrandMark, MenuIcon, CloseIcon } from "./icons";

export function AppShell() {
  const { t } = useI18n();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const isWide = useIsWide(860);
  const navVisible = isWide || navOpen;

  return (
    <div className={`app ${isHome ? "app--console" : ""}`}>
      <a className="skip-link" href="#main">
        {t("skip.toContent")}
      </a>

      <header className="cmd-bar">
        <div className="cmd-bar__inner">
          <Link to="/" className="brand" aria-label={t("nav.home")}>
            <span className="brand-mark">
              <BrandMark size={22} />
            </span>
            <span className="brand-text">
              <span className="brand-name">{t("brand.name")}</span>
              <span className="brand-tag">{t("brand.tagline")}</span>
            </span>
          </Link>

          <span className="cmd-bar__status" aria-live="off">
            <span className="live-dot" aria-hidden="true" />
            {t("cmd.status")}
          </span>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            aria-label={t("nav.other.aria")}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>

          <nav id="primary-nav" className="primary-nav" data-open={navVisible} aria-label={t("brand.name")}>
            <NavLink to="/news" className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}>
              {t("nav.latest")}
            </NavLink>
            <NavLink to="/donate" className={({ isActive }) => `nav-link donate ${isActive ? "is-active" : ""}`}>
              {t("nav.donate")}
            </NavLink>
            <OtherMenu onNavigate={() => setNavOpen(false)} />
            <LanguageToggle />
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="app__main">
        <Outlet />
      </main>

      {!isHome && <Footer />}
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div style={{ maxWidth: "44ch" }}>
          <div className="footer-brand">{t("brand.name")}</div>
          <hr className="tricolor-rule thin" style={{ marginBottom: 14 }} />
          <p style={{ color: "#aab2bb" }}>{t("footer.note")}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link to="/news" style={{ color: "#e8d3b0" }}>{t("nav.latest")}</Link>
          <Link to="/donate" style={{ color: "#e8d3b0" }}>{t("nav.donate")}</Link>
          <Link to="/resources" style={{ color: "#e8d3b0" }}>{t("nav.resources")}</Link>
        </div>
      </div>
      <div className="container" style={{ marginTop: 28, color: "#8b939c", fontSize: "0.82rem" }}>
        {t("footer.notAffiliated")}
      </div>
    </footer>
  );
}

function useIsWide(px: number): boolean {
  const [wide, setWide] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > px,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px + 1}px)`);
    const handler = () => setWide(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [px]);
  return wide;
}
