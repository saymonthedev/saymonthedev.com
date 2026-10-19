import type { ReactNode } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { RevealObserver } from "@/components/providers/RevealObserver";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { fontVariables } from "@/config/fonts";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";

/**
 * Roda antes da primeira pintura:
 * - em `/`, quem já escolheu inglês (cookie `locale=en`) vai direto para /en;
 * - liga as animações de revelação (classe `js`). Se o React não hidratar em
 *   4s, desliga, para o conteúdo nunca ficar escondido.
 */
const bootScript = `(function(){var d=document.documentElement;if(location.pathname==="/"&&/(?:^|;\\s*)${LOCALE_COOKIE}=en(?:;|$)/.test(document.cookie)){location.replace("/en"+location.search+location.hash);return}d.classList.add("js");setTimeout(function(){if(!("revealReady" in d.dataset))d.classList.remove("js")},4000)})();`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      {/* <head> manual é suportado na root layout do App Router; a regra do
          ESLint vale para o Pages Router. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="grain">
        <LocaleProvider initialLocale={locale}>
          <MotionProvider>
            <SmoothScroll />
            <RevealObserver />
            {children}
          </MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
