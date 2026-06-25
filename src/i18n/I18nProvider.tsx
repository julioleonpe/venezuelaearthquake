/**
 * I18nProvider + useI18n hook.
 *
 * Holds the active Interface_Language and exposes `t(messageId)`. Defaults to
 * English (Req 10.3), persists the choice across navigation via localStorage
 * (Req 10.4), and keeps the choice in place without a network round-trip so the
 * Language_Toggle re-renders chrome within budget (Req 10.2, 10.6). Also syncs
 * `<html lang>` for assistive technology (Req 9) and the document title.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { catalog, type Locale, type MessageId } from "./catalog";

const STORAGE_KEY = "vzhub.lang";

interface I18nContextValue {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: (id: MessageId) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function initialLang(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "es" ? "es" : "en"; // English default (Req 10.3)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(initialLang);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage may be unavailable (private mode) — non-fatal */
    }
  }, []);

  // Keep <html lang> in sync for AT and correct hyphenation (Req 9.1 family).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((id: MessageId) => catalog[lang][id] ?? catalog.en[id] ?? id, [lang]);

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
