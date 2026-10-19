"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { LOCALE_COOKIE, localePaths, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

type SectionKey = keyof Dictionary["sections"];

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const localeFromPath = (pathname: string): Locale =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-BR";

/** Converte a âncora atual para o ID equivalente no outro idioma. */
function translateHash(hash: string, from: Locale, to: Locale) {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return "";
  }
  if (!id) return "";
  const source = dictionaries[from].sections;
  const key = (Object.keys(source) as SectionKey[]).find((k) => source[k] === id);
  return key ? `#${dictionaries[to].sections[key]}` : "";
}

/**
 * A troca de idioma acontece no cliente, sem recarregar a página: o texto é
 * trocado dentro de uma View Transition, a URL passa a ser a do outro idioma
 * (/ ou /en) e o cookie guarda a preferência. Ao recarregar, o servidor já
 * entrega a página pronta no idioma da URL.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      const url = localePaths[next] + translateHash(window.location.hash, locale, next);
      const secure = window.location.protocol === "https:" ? "; secure" : "";
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${secure}`;

      const commit = () => {
        flushSync(() => setLocaleState(next));
        window.history.replaceState(null, "", url);
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || typeof document.startViewTransition !== "function") {
        commit();
        return;
      }

      const root = document.documentElement;
      root.dataset.localeTransition = "";
      const transition = document.startViewTransition(commit);
      transition.finished.finally(() => delete root.dataset.localeTransition);
    },
    [locale],
  );

  useEffect(() => {
    const { meta } = dictionaries[locale];
    document.documentElement.lang = locale;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [locale]);

  useEffect(() => {
    const onPopState = () => setLocaleState(localeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale, setLocale],
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useI18n() {
  const context = use(LocaleContext);
  if (!context) throw new Error("useI18n precisa estar dentro de <LocaleProvider>.");
  return context;
}
