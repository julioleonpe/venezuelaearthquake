/**
 * ResourceDirectoryPage — verified Resource_Entries with category filter (Req 2.3)
 * and keyword search (Req 2.4). Search is validated by the pure `validateKeyword`
 * (Req 2.5/2.6): an invalid keyword shows a message and KEEPS the current results.
 * Each card shows name, description, category, and source link (Req 2.2, 7.x), with
 * an "unverified source" label when no link is present. Empty + unavailable states
 * per Req 2.6 / 8.x.
 *
 * The actual filtering/searching is the API's `searchResources` (pure domain), so
 * verification is enforced server-side, never by hiding in the client.
 */

import { useCallback, useMemo, useState } from "react";
import { getAllVerifiedResources, getResources } from "../api/store";
import { ExternalLink } from "../components/ExternalLink";
import { SearchIcon } from "../components/icons";
import {
  EmptyState,
  LanguageIndicator,
  LoadingBlock,
  Notice,
  TrustStatement,
  VerifiedBadge,
} from "../components/primitives";
import { ALL_CATEGORIES, validateKeyword, verifiedCategories } from "../domain/core";
import { useI18n } from "../i18n/I18nProvider";
import { useSubsystem } from "../lib/useSubsystem";
import { usePageHeadingFocus } from "../lib/usePageTitle";

export default function ResourceDirectoryPage() {
  const { t } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("resources.title"));

  // Applied query state (drives the actual fetch). Separate from the input draft
  // so an invalid keyword can be rejected without disturbing the current results.
  const [applied, setApplied] = useState<{ category: string; keyword: string }>({
    category: ALL_CATEGORIES,
    keyword: "",
  });
  const [draft, setDraft] = useState("");
  const [keywordError, setKeywordError] = useState<"empty" | "too_long" | null>(null);

  // All verified resources → category list for the filter (independent of search).
  const all = useSubsystem(() => getAllVerifiedResources(), []);
  const categories = useMemo(
    () => (all.status === "ready" ? verifiedCategories(all.data) : []),
    [all],
  );

  // Filtered/searched results.
  const results = useSubsystem(
    () => getResources({ category: applied.category, keyword: applied.keyword }),
    [applied.category, applied.keyword],
  );

  const submitSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Empty draft = clear the keyword constraint (valid: browse all in category).
      if (draft.trim().length === 0) {
        setKeywordError(null);
        setApplied((a) => ({ ...a, keyword: "" }));
        return;
      }
      const v = validateKeyword(draft);
      if (!v.ok) {
        // Reject; keep current results unchanged (Req 2.5).
        setKeywordError(v.reason);
        return;
      }
      setKeywordError(null);
      setApplied((a) => ({ ...a, keyword: v.keyword }));
    },
    [draft],
  );

  function pickCategory(cat: string) {
    setApplied((a) => ({ ...a, category: cat }));
  }

  function clearAll() {
    setDraft("");
    setKeywordError(null);
    setApplied({ category: ALL_CATEGORIES, keyword: "" });
  }

  return (
    <div className="container page">
      <header className="page-head">
        <div className="kicker">
          <hr className="tricolor-rule thin" />
          {t("nav.resources")}
        </div>
        <h1 ref={h1Ref} tabIndex={-1} style={{ outline: "none" }}>
          {t("resources.title")}
        </h1>
        <p className="lede">{t("resources.intro")}</p>
      </header>

      <div style={{ marginBottom: 22 }}>
        <TrustStatement />
      </div>

      {/* Search toolbar */}
      <form className="toolbar" onSubmit={submitSearch} role="search">
        <div className="field search-field">
          <label htmlFor="res-search">{t("resources.search.label")}</label>
          <div className="search-input-wrap">
            <SearchIcon size={18} />
            <input
              id="res-search"
              type="search"
              value={draft}
              maxLength={400}
              placeholder={t("resources.search.placeholder")}
              onChange={(e) => setDraft(e.target.value)}
              aria-invalid={keywordError !== null}
              aria-describedby={keywordError ? "res-search-err" : undefined}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {t("resources.search.submit")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={clearAll}>
          {t("resources.search.clear")}
        </button>
      </form>

      {/* Invalid-keyword message; current results are retained (Req 2.5) */}
      {keywordError && (
        <div id="res-search-err" style={{ marginBottom: 18 }}>
          <Notice tone="warn" role="alert">
            {keywordError === "empty" ? t("resources.keyword.empty") : t("resources.keyword.tooLong")}
          </Notice>
        </div>
      )}

      {/* Category chips (Req 2.3) */}
      {categories.length > 0 && (
        <div className="category-chips" role="group" aria-label={t("resources.filter.label")}>
          <button
            type="button"
            className="chip"
            aria-pressed={applied.category === ALL_CATEGORIES}
            onClick={() => pickCategory(ALL_CATEGORIES)}
          >
            {t("resources.filter.all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="chip"
              aria-pressed={applied.category === cat}
              onClick={() => pickCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {results.status === "loading" && <LoadingBlock slow={results.slow} />}
      {results.status === "error" && (
        <Notice tone="danger" role="alert">
          {t("resources.unavailable")}
        </Notice>
      )}
      {results.status === "ready" &&
        (results.data.length === 0 ? (
          <EmptyState title={t("resources.empty")} />
        ) : (
          <>
            <div className="result-count" aria-live="polite">
              {results.data.length} {t("resources.resultCount")}
            </div>
            <div className="resources-grid">
              {results.data.map((r) => (
                <article key={r.id} className="record-card">
                  <div className="record-card__meta">
                    <VerifiedBadge />
                    <span className="badge badge-category">{r.category}</span>
                    <LanguageIndicator contentLanguage={r.contentLanguage} />
                  </div>
                  <h3>{r.name}</h3>
                  <p className="record-card__desc">{r.description}</p>
                  <div className="record-card__foot">
                    <ExternalLink href={r.sourceLink}>{t("news.source")}</ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </>
        ))}
    </div>
  );
}
