import { memo } from "react";
import type { HomeFeedKey } from "@/lib/listingSearchParams";
import { useI18n } from "@/lib/i18n";

type Props = {
  feed: HomeFeedKey;
  onChange: (feed: HomeFeedKey) => void;
};

const HOME_FEED_TABS: { key: HomeFeedKey; label: string }[] = [
  { key: "recommend", label: "home.recommend" },
  { key: "latest", label: "home.latest" },
];

export const HomeFeedTabs = memo(function HomeFeedTabs({ feed, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="content-tabs home-feed-tabs" role="tablist" aria-label={t("home.aria")}>
      {HOME_FEED_TABS.map((tab) => {
        const active = tab.key === feed;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            className="content-tabs__tab home-feed-tabs__tab"
            onClick={() => onChange(tab.key)}
          >
            {t(tab.label)}
          </button>
        );
      })}
    </div>
  );
});

export { HOME_FEED_TABS };
