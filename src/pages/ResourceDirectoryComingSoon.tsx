/**
 * ResourceDirectoryComingSoon — placeholder shown at /resources until the
 * directory has verified entries to publish.
 *
 * The full ResourceDirectoryPage (search, category filter, verified cards) is
 * built and kept in the tree; this "in the works" page stands in front of it
 * while there is no curated content, so Visitors get an honest status rather
 * than an empty results grid. Swap the route back in router.tsx once the first
 * Resource_Entries are verified.
 */

import { Link } from "react-router-dom";
import { ArrowRightIcon, ResourceIcon } from "../components/icons";
import { useI18n } from "../i18n/I18nProvider";
import { usePageHeadingFocus } from "../lib/usePageTitle";

export default function ResourceDirectoryComingSoon() {
  const { t } = useI18n();
  const h1Ref = usePageHeadingFocus<HTMLHeadingElement>(t("resources.soon.title"));

  return (
    <div className="container page">
      <div className="coming-soon" role="status">
        <div className="coming-soon__icon" aria-hidden="true">
          <ResourceIcon size={44} />
        </div>
        <div className="kicker kicker--center">
          <hr className="tricolor-rule thin" />
          {t("resources.soon.kicker")}
        </div>
        <h1 ref={h1Ref} tabIndex={-1} style={{ outline: "none" }}>
          {t("resources.soon.title")}
        </h1>
        <p className="lede">{t("resources.soon.body")}</p>
        <Link to="/" className="btn btn-primary coming-soon__back">
          {t("resources.soon.backHome")} <ArrowRightIcon size={15} />
        </Link>
      </div>
    </div>
  );
}
