"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/links";
import { introDelay } from "@/lib/style";
import { HeroBackdrop } from "./HeroBackdrop";
import { IdCard } from "./IdCard";

const WORD_START = 120;
const WORD_STEP = 65;

/** Cada palavra sobe e entra em foco, em sequência. */
function Words({ text, offset, className }: { text: string; offset: number; className?: string }) {
  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={index}>
      <span className={cn("intro-word", className)} style={introDelay(WORD_START + (offset + index) * WORD_STEP)}>
        {word}
      </span>
      {index < words.length - 1 && " "}
    </span>
  ));
}

export function Hero() {
  const { dict } = useI18n();
  const hero = dict.hero;
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setIntroDone(true), 2600);
    return () => window.clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0.15]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 50]);

  // Spotlight da grade: posição do cursor em variáveis CSS, uma vez por frame.
  const frame = useRef(0);
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  };

  const headlineWords = hero.headline.split(" ").length;

  return (
    <section
      ref={sectionRef}
      id={dict.sections.home}
      data-scroll-top
      tabIndex={-1}
      aria-labelledby="hero-title"
      data-intro-done={introDone ? "" : undefined}
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+3.5rem)]"
    >
      <HeroBackdrop />

      <div className="container-page grid flex-1 items-center gap-14 pb-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-8 lg:pb-24">
        <m.div style={{ y: copyY, opacity: copyOpacity }} className="max-w-[46rem]">
          <p
            className="intro inline-flex items-center gap-2.5 rounded-full border border-(--line-strong) bg-ink-900/70 py-1.5 pr-3.5 pl-2.5 text-[13px] text-soft"
            style={introDelay(0)}
          >
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-signal" />
              <span className="relative size-2 rounded-full bg-signal" />
            </span>
            {hero.availability}
          </p>

          <h1
            id="hero-title"
            className="mt-7 text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.045em] text-balance xs:text-[3.25rem] sm:text-[4.25rem] lg:text-[4.6rem] xl:text-[5.4rem]"
          >
            <Words text={hero.headline} offset={0} />{" "}
            <Words
              text={hero.headlineAccent}
              offset={headlineWords}
              className="accent-serif text-[1.1em] leading-[0.9]"
            />
          </h1>

          <p
            className="intro mt-7 max-w-[35rem] text-[1.0625rem] leading-relaxed text-muted text-pretty sm:text-lg"
            style={introDelay(380)}
          >
            {hero.lead}
          </p>

          <div className="intro mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center" style={introDelay(500)}>
            <Magnetic className="xs:w-auto">
              <ButtonLink
                href={whatsappUrl(dict.whatsappMessage)}
                external
                size="lg"
                icon={ArrowRight}
                className="w-full xs:w-auto"
              >
                {hero.primaryCta}
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href={`#${dict.sections.projects}`}
              variant="ghost"
              size="lg"
              icon={ArrowDown}
              iconMotion="y"
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>

          <p className="intro mt-6 flex items-center gap-2 text-sm text-subtle" style={introDelay(620)}>
            <BrandLogo name="whatsapp" className="size-3.5" />
            {hero.note}
          </p>
        </m.div>

        <m.div style={{ y: cardY }} className="flex justify-center lg:justify-end">
          <IdCard />
        </m.div>
      </div>

      <a
        href={`#${dict.sections.services}`}
        className="intro group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-subtle transition-colors hover:text-soft md:flex"
        style={introDelay(1100)}
      >
        <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase">{hero.scroll}</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-0 animate-[scroll-line_2.4s_var(--ease-in-out-circ)_infinite] bg-accent-300" />
        </span>
      </a>
    </section>
  );
}
