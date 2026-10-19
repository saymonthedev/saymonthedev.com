"use client";

import Image from "next/image";
import { localePaths, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

const flags: Record<Locale, string> = {
  "pt-BR": "/flags/br.svg",
  en: "/flags/us.svg",
};

/**
 * Seletor PT/EN. São links reais (/ e /en), então funcionam sem JavaScript e
 * ajudam buscadores a encontrar as duas versões; com JavaScript, a troca é
 * feita no lugar, com transição.
 */
export function LanguageSwitcher({
  className,
  animatedPill = false,
}: {
  className?: string;
  /** Só um seletor por página pode ter a pílula animada na transição. */
  animatedPill?: boolean;
}) {
  const { locale, dict, setLocale } = useI18n();

  return (
    <div
      role="group"
      aria-label={dict.a11y.languageSwitcher}
      className={cn(
        "relative grid h-10 grid-cols-2 rounded-full border border-(--line-strong) bg-ink-900/60 p-1",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="lang-pill absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full border border-white/10 bg-white/[0.09] shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset] transition-transform duration-500 ease-out-expo"
        style={{
          transform: locale === "en" ? "translateX(100%)" : undefined,
          viewTransitionName: animatedPill ? "lang-pill" : undefined,
        }}
      />
      {locales.map((option) => {
        const active = option === locale;
        return (
          <a
            key={option}
            href={localePaths[option]}
            hrefLang={option}
            lang={option}
            aria-current={active ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setLocale(option);
            }}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wider transition-colors duration-300",
              active ? "text-fg" : "text-subtle hover:text-soft",
            )}
          >
            <Image
              src={flags[option]}
              alt=""
              width={18}
              height={13}
              unoptimized
              className={cn(
                "h-[13px] w-[18px] rounded-[3px] object-cover ring-1 ring-white/15 transition-[filter,opacity] duration-300",
                active ? "opacity-100" : "opacity-60 saturate-[0.65]",
              )}
            />
            {dict.language[option].short}
            <span className="sr-only"> — {dict.language[option].name}</span>
          </a>
        );
      })}
    </div>
  );
}
