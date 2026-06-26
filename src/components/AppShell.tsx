/**
 * AppShell — minimal chrome over the single Command Center view.
 *
 * The Hub is one self-contained page (no drill-down routes), so the shell carries
 * only the tricolor instrument marker at the top edge and a persistent, floating
 * Language_Toggle (Req 10.1). A skip link + focusable <main> keep it keyboard/AT
 * operable.
 */

import { Outlet } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageToggle } from "./LanguageToggle";

export function AppShell() {
  const { t } = useI18n();

  return (
    <div className="app app--console">
      <a className="skip-link" href="#main">
        {t("skip.toContent")}
      </a>

      {/* Tricolor instrument marker at the very top edge (no chrome bar). */}
      <div className="topline" aria-hidden="true" />

      {/* Floating language toggle — the only persistent control. */}
      <div className="floating-nav">
        <LanguageToggle />
      </div>

      <main id="main" tabIndex={-1} className="app__main">
        <Outlet />
      </main>
    </div>
  );
}
