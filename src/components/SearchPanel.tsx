import { memo, type FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { withListingNavigation } from "@/lib/listingSearchParams";
import { useI18n } from "@/lib/i18n";

const SEARCH_DEBOUNCE_MS = 500;

type SearchPanelProps = {
  value?: string;
  onSearch?: (keyword: string) => void;
  navigationPath?: string;
  variant?: "default" | "uiverse";
  placeholder?: string;
  className?: string;
};

export const SearchPanel = memo(function SearchPanel({
  value,
  onSearch,
  navigationPath = "/list",
  variant = "default",
  placeholder,
  className,
}: SearchPanelProps = {}) {
  const isUiverse = variant === "uiverse";
  const navigate = useNavigate();
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder ?? t("search.placeholder");
  const [params] = useSearchParams();
  const urlKeyword = params.get("q") ?? "";
  const committedKeyword = value ?? urlKeyword;
  const [keyword, setKeyword] = useState(committedKeyword);

  const commitSearch = useCallback((value: string) => {
    const q = value.trim();
    if (onSearch) {
      onSearch(q);
      return;
    }
    const next = withListingNavigation(params, { q, page: 1 });
    const query = next.toString();
    navigate(query ? `${navigationPath}?${query}` : navigationPath);
  }, [navigate, navigationPath, onSearch, params]);

  useEffect(() => {
    setKeyword(committedKeyword);
  }, [committedKeyword]);

  useEffect(() => {
    if (keyword.trim() === committedKeyword.trim()) return;
    const timer = window.setTimeout(() => {
      commitSearch(keyword);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [commitSearch, committedKeyword, keyword]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    commitSearch(keyword);
  }

  function handleReset() {
    setKeyword("");
    commitSearch("");
  }

  const searchInput = (
    <input
      className={isUiverse ? "search-panel__uiverse-input" : "search-panel__input"}
      type="text"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder={resolvedPlaceholder}
      aria-label={t("search.ariaKeyword")}
    />
  );

  return (
    <form
      className={`search-panel${isUiverse ? " search-panel--uiverse" : ""}${className ? ` ${className}` : ""}`}
      onSubmit={handleSubmit}
      role="search"
    >
      {isUiverse ? (
        <>
          <button className="search-panel__uiverse-submit" type="submit" aria-label={t("search.submit")}>
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {searchInput}
          <button
            className="search-panel__reset"
            type="button"
            onClick={handleReset}
            aria-label={t("search.clear")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </>
      ) : (
        <div className="search-panel__form">
          <div className="search-panel__input-wrapper">
            <Search size={16} className="search-panel__search-icon" aria-hidden="true" />
            {searchInput}
          </div>
          <button className="search-panel__submit" type="submit" aria-label={t("search.submit")}>
            <Search size={16} className="search-panel__submit-icon" aria-hidden="true" />
            <span className="search-panel__submit-text">{t("search.submit")}</span>
          </button>
        </div>
      )}
    </form>
  );
});
