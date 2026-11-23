import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/contact/Contact";
import { Hero } from "@/components/sections/hero/Hero";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/projects/Projects";
import { Services } from "@/components/sections/Services";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { buildJsonLd, serializeJsonLd } from "@/lib/json-ld";

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        {/* Cada seção abaixo da dobra é hidratada separadamente, sem travar
            o navegador num único bloco longo de JavaScript.
            Ordem pensada para quem procura um site para a empresa: primeiro os
            trabalhos, depois serviços e preços. A seção de tecnologias
            (Stack.tsx) está fora da página; para voltar, inclua <Stack /> aqui
            e "stack" em layout/nav.ts. */}
        <Suspense>
          <Projects />
        </Suspense>
        <Suspense>
          <Services />
        </Suspense>
        <Suspense>
          <Process />
        </Suspense>
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd(locale)) }}
      />
    </>
  );
}
