/**
 * LastUpdatedBadge — the "content last updated" pill, shown in the top-right of the
 * shell's floating nav (opposite the Language_Toggle). Reads the published dataset's
 * meta via the same subsystem hook the Command Center uses; it degrades on its own
 * (shows a loading state) without affecting the rest of the chrome. Req 1.7.
 */

import { getMeta } from "../api/store";
import { ClockIcon } from "./icons";
import { useI18n } from "../i18n/I18nProvider";
import { formatDateTimeTz } from "../lib/datetime";
import { useSubsystem } from "../lib/useSubsystem";

export function LastUpdatedBadge() {
  const { t, lang } = useI18n();
  const meta = useSubsystem(() => getMeta(), []);

  if (meta.status === "ready") {
    return (
      <span className="last-updated">
        <span className="badge-dot" aria-hidden="true" />
        {t("landing.lastUpdated")}:{" "}
        <time dateTime={meta.data.lastUpdated}>{formatDateTimeTz(meta.data.lastUpdated, lang)}</time>
      </span>
    );
  }

  return (
    <span className="last-updated" aria-busy="true">
      <ClockIcon size={13} /> {t("loading.label")}
    </span>
  );
}
