import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <button
      className="main-nav__link"
      role="menuitem"
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      title={lang === "zh" ? "Switch to English" : "切换为中文"}
    >
      {lang === "zh" ? "EN" : "中文"}
    </button>
  );
}
