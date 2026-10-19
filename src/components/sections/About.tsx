"use client";

import {
  Briefcase,
  GraduationCap,
  Languages,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useI18n } from "@/i18n/LocaleProvider";
import { revealDelay } from "@/lib/style";

const traitIcons: Record<string, LucideIcon> = {
  proactive: Rocket,
  quality: ShieldCheck,
  fullstack: Layers,
  languages: Languages,
};

const timelineIcons: LucideIcon[] = [GraduationCap, Briefcase, Sparkles];

export function About() {
  const { dict } = useI18n();
  const about = dict.about;
  const onPointerMove = useSpotlight<HTMLUListElement>();
  const [lead, ...paragraphs] = about.paragraphs;

  return (
    <section
      id={dict.sections.about}
      tabIndex={-1}
      aria-labelledby="about-title"
      className="relative overflow-x-clip py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-[-18rem] -z-10 size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.12),transparent)]"
      />

      <div className="container-page grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <SectionHeading
            id="about-title"
            eyebrow={about.eyebrow}
            title={about.title}
            accent={about.titleAccent}
          />
          <p
            data-reveal
            style={revealDelay(200)}
            className="mt-8 hidden max-w-sm border-l border-(--line-strong) pl-4 text-sm leading-relaxed text-subtle lg:block"
          >
            {about.disclaimer}
          </p>
        </div>

        <div>
          <p data-reveal className="text-xl leading-relaxed text-soft text-pretty sm:text-[1.375rem]">
            {lead}
          </p>
          <div className="mt-6 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-reveal
                style={revealDelay(60 * (index + 1))}
                className="text-base leading-relaxed text-muted text-pretty sm:text-[1.0625rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <h3 data-reveal className="mt-14 font-mono text-xs tracking-[0.18em] text-subtle uppercase">
            {about.timelineTitle}
          </h3>
          <ol className="relative mt-6">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[1.1875rem] w-px bg-gradient-to-b from-accent-300/60 via-(--line-strong) to-transparent"
            />
            {about.timeline.map((item, index) => {
              const Icon = timelineIcons[index] ?? Sparkles;
              return (
                <li
                  key={item.title}
                  data-reveal
                  style={revealDelay(index * 90)}
                  className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-5 pb-9 last:pb-0"
                >
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-(--line-strong) bg-ink-900 text-accent-200">
                    <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.6} />
                  </span>
                  <div className="pt-1">
                    <p className="font-mono text-xs tracking-wider text-accent-300">{item.period}</p>
                    <p className="mt-1.5 text-lg font-medium tracking-tight text-fg">{item.title}</p>
                    <p className="mt-1 text-[15px] text-muted">{item.place}</p>
                    {item.detail && (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent-300/25 bg-accent/10 px-3 py-1 text-[13px] text-accent-200">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-300" />
                        {item.detail}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <ul data-spotlight-group onPointerMove={onPointerMove} className="mt-14 grid gap-3 sm:grid-cols-2">
            {about.traits.map((trait, index) => {
              const Icon = traitIcons[trait.id];
              return (
                <li key={trait.id} data-reveal style={revealDelay((index % 2) * 90)}>
                  <div className="spotlight surface group h-full rounded-[1.5rem] p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.6}
                        className="size-5 text-accent-200 transition-transform duration-700 ease-out-expo group-hover:-translate-y-0.5"
                      />
                      <h3 className="font-medium tracking-tight">{trait.title}</h3>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{trait.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 border-l border-(--line-strong) pl-4 text-sm leading-relaxed text-subtle lg:hidden">
            {about.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
