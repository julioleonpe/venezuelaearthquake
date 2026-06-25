/**
 * LanguageToggle — persistent EN/ES control in the Primary_Navigation (Req 10.1).
 * Switching re-renders chrome in place via the I18nProvider (no navigation, no
 * network) so it stays well within the 3s re-render budget (Req 10.2, 10.6).
 * Implemented as a two-button group using aria-pressed for clear state.
 */

import { useI18n } from "../i18n/I18nProvider";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label={t("lang.toggle.aria")}>
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        title={t("lang.en.full")}
      >
        {t("lang.en")}
        <span className="sr-only"> — {t("lang.en.full")}</span>
      </button>
      <button
        type="button"
        aria-pressed={lang === "es"}
        onClick={() => setLang("es")}
        title={t("lang.es.full")}
      >
        {t("lang.es")}
        <span className="sr-only"> — {t("lang.es.full")}</span>
      </button>
    </div>
  );
}
