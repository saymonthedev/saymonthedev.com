export const locales = ["pt-BR", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";

/** Endereço da página inicial de cada idioma. */
export const localePaths: Record<Locale, string> = {
  "pt-BR": "/",
  en: "/en",
};

/** Valor usado no Open Graph (`og:locale`). */
export const ogLocales: Record<Locale, string> = {
  "pt-BR": "pt_BR",
  en: "en_US",
};

/** Cookie que guarda a preferência de idioma (lido pelo script inicial em `/`). */
export const LOCALE_COOKIE = "locale";

export const isLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale);

export type Localized<T> = Record<Locale, T>;
