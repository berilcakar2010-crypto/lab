/**
 * Bilingual text. English is the main language, Turkish the option.
 *
 * Strings are written inline as pairs — `L("Home", "Ana sayfa")` — so a
 * translation always sits next to the text it translates. The current
 * language is a module variable set from the user's preference before every
 * render (App) and before engines run, so engines and UI agree.
 */
export const LANGS = ["en", "tr"] as const;
export type Lang = (typeof LANGS)[number];
export const LANG_LABEL: Record<Lang, string> = { en: "English", tr: "Türkçe" };
export const DEFAULT_LANG: Lang = "en";

let current: Lang = DEFAULT_LANG;

export const isLang = (x: unknown): x is Lang => x === "en" || x === "tr";

export function setLang(lang: Lang | undefined): void {
  current = isLang(lang) ? lang : DEFAULT_LANG;
  if (typeof document !== "undefined") document.documentElement.lang = current;
}

export const getLang = (): Lang => current;

/** Pick the text for the current language. */
export function L(en: string, tr: string): string {
  return current === "tr" ? tr : en;
}

/** Pick any value (arrays, objects, numbers) for the current language. */
export function pick<T>(en: T, tr: T): T {
  return current === "tr" ? tr : en;
}

/** BCP-47 locale for dates and numbers. */
export const locale = (): string => (current === "tr" ? "tr-TR" : "en-GB");

/** Case-insensitive helpers that respect Turkish dotted/dotless i. */
export const lower = (s: string): string => s.toLocaleLowerCase(locale());
export const upper = (s: string): string => s.toLocaleUpperCase(locale());

export const fmtDate = (ms: number, opts: Intl.DateTimeFormatOptions = {}): string =>
  new Date(ms).toLocaleDateString(locale(), opts);

/** Decimal with the locale's separator (1,5 in Turkish, 1.5 in English). */
export const fmtNum = (n: number, digits = 1): string =>
  n.toLocaleString(locale(), { maximumFractionDigits: digits });

/**
 * A label table that follows the current language. Call sites keep using
 * `TABLE[key]`, `Object.entries(TABLE)` etc.; the lookup happens at access time,
 * so module-level tables never freeze the language they were loaded in.
 */
export function lazyLabels<K extends string>(en: Record<K, string>, tr: Record<K, string>): Record<K, string> {
  const cur = () => (current === "tr" ? tr : en);
  return new Proxy({} as Record<K, string>, {
    get: (_t, k) => cur()[k as K],
    has: (_t, k) => k in cur(),
    ownKeys: () => Reflect.ownKeys(cur()),
    getOwnPropertyDescriptor: (_t, k) => {
      const v = cur()[k as K];
      return v === undefined ? undefined : { value: v, enumerable: true, configurable: true, writable: false };
    },
  });
}

/** Run `fn` with a temporary language (used when re-localising stored content). */
export function withLang<T>(lang: Lang, fn: () => T): T {
  const prev = current;
  current = lang;
  try {
    return fn();
  } finally {
    current = prev;
  }
}
