/**
 * LanguageToggle — persistent EN/ES control in the Primary_Navigation (Req 10.1).
 * Switching re-renders chrome in place via the I18nProvider (no navigation, no
 * network) so it stays well within the 3s re-render budget (Req 10.2, 10.6).
 * Implemented as a two-button group using aria-pressed for clear state.
 */

import { useI18n } from "../i18n/I18nProvider";
import { useMediaQuery } from "../lib/useMediaQuery";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  // Compact short codes (EN/ES) on phones; full names where there's room.
  const compact = useMediaQuery("(max-width: 720px)");
  return (
    <div className="lang-toggle" role="group" aria-label={t("lang.toggle.aria")}>
      <button
        type="button"
        aria-pressed={lang === "en"}
        aria-label={t("lang.en.full")}
        onClick={() => setLang("en")}
      >
        {compact ? t("lang.en") : t("lang.en.full")}
      </button>
      <button
        type="button"
        aria-pressed={lang === "es"}
        aria-label={t("lang.es.full")}
        onClick={() => setLang("es")}
      >
        {compact ? t("lang.es") : t("lang.es.full")}
      </button>
    </div>
  );
}
