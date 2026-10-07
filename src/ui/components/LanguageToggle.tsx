import { LANGS, LANG_LABEL, L, type Lang } from "../../i18n";
import { store, useDB } from "../state";
import { switchLanguage } from "../../knowledge/relocalize";

/** EN / TR switch. Switching also re-localises built-in course content the learner has not edited. */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const db = useDB();
  const cur = db.preferences.language;
  const set = (lang: Lang) => {
    if (lang !== cur) store.transact((d) => switchLanguage(d, lang));
  };
  return (
    <div className="lang-toggle" role="group" aria-label={L("Language", "Dil")}>
      {LANGS.map((l) => (
        <button key={l} className={`btn small ${cur === l ? "primary" : "ghost"}`} aria-pressed={cur === l} onClick={() => set(l)}>
          {compact ? l.toUpperCase() : LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
