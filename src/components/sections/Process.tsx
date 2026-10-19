"use client";

import { Info } from "lucide-react";
import { m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/style";

export function Process() {
  const { dict } = useI18n();
  const process = dict.process;
  const listRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  // A linha que liga as etapas se preenche conforme a rolagem.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setReached(Math.min(process.steps.length, Math.floor(value * process.steps.length + 0.35)));
  });

  return (
    <section
      id={dict.sections.process}
      tabIndex={-1}
      aria-labelledby="process-title"
      className="relative py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/30 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          id="process-title"
          eyebrow={process.eyebrow}
          title={process.title}
          accent={process.titleAccent}
          intro={process.intro}
        />

        <div ref={listRef} className="relative mt-16 lg:mt-20">
          <span aria-hidden="true" className="absolute top-6 bottom-6 left-[1.4375rem] w-px bg-(--line-strong) md:hidden" />
          <m.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute top-6 bottom-6 left-[1.4375rem] w-px origin-top bg-gradient-to-b from-accent-200 to-accent md:hidden"
          />
          <span
            aria-hidden="true"
            className="absolute top-[1.4375rem] right-[calc(25%-2.5625rem)] left-[1.4375rem] hidden h-px bg-(--line-strong) md:block"
          />
          <m.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute top-[1.4375rem] right-[calc(25%-2.5625rem)] left-[1.4375rem] hidden h-px origin-left bg-gradient-to-r from-accent-200 to-accent md:block"
          />

          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {process.steps.map((step, index) => {
              const active = index < reached;
              return (
                <li
                  key={step.title}
                  data-reveal
                  style={revealDelay(index * 90)}
                  className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-5 md:block"
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-12 place-items-center rounded-full border font-mono text-sm transition-[color,border-color,box-shadow,background-color] duration-700",
                      active
                        ? "border-accent-300/60 bg-ink-800 text-fg shadow-[0_0_0_6px_rgb(37_99_235/0.12),0_0_30px_rgb(37_99_235/0.45)]"
                        : "border-(--line-strong) bg-ink-950 text-subtle",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="md:mt-8 md:pr-4">
                    <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <p
          data-reveal
          className="mt-14 flex items-start gap-3 rounded-2xl border border-(--line) bg-white/[0.02] px-5 py-4 text-sm leading-relaxed text-muted sm:items-center"
        >
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-300 sm:mt-0" />
          {process.note}
        </p>
      </div>
    </section>
  );
}
