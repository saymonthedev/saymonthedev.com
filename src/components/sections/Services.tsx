"use client";

import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceIcons } from "@/data/services";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useI18n } from "@/i18n/LocaleProvider";
import { whatsappUrl } from "@/lib/links";
import { revealDelay } from "@/lib/style";

export function Services() {
  const { dict } = useI18n();
  const services = dict.services;
  const onPointerMove = useSpotlight<HTMLUListElement>();

  return (
    <section
      id={dict.sections.services}
      tabIndex={-1}
      aria-labelledby="services-title"
      className="relative py-24 sm:py-32"
    >
      <div className="container-page">
        <SectionHeading
          id="services-title"
          eyebrow={services.eyebrow}
          title={services.title}
          accent={services.titleAccent}
          intro={services.intro}
        />

        <ul
          data-spotlight-group
          onPointerMove={onPointerMove}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {services.items.map((item, index) => {
            const Icon = serviceIcons[item.id];
            return (
              <li key={item.id} data-reveal style={revealDelay((index % 3) * 90)}>
                <article className="spotlight surface group flex h-full flex-col rounded-[1.75rem] p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="relative grid size-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] text-accent-200 shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset]">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-2xl bg-accent/40 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100"
                      />
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.6}
                        className="relative size-[22px] transition-transform duration-700 ease-out-expo group-hover:-rotate-6 group-hover:scale-110"
                      />
                    </span>
                    <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <h3 className="mt-8 text-[1.3rem] leading-snug font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.description}</p>

                  <div className="mt-auto pt-7">
                    <p className="font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">
                      {services.idealFor}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-(--line) bg-white/[0.02] px-2.5 py-1 text-xs text-soft transition-colors duration-300 group-hover:border-(--line-strong)"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div
          data-reveal
          className="mt-6 flex flex-col items-start gap-5 rounded-[1.75rem] border border-dashed border-(--line-strong) px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7"
        >
          <p className="text-[15px] text-soft">{services.cta.text}</p>
          <ButtonLink
            href={whatsappUrl(dict.whatsappMessage)}
            external
            variant="ghost"
            icon={ArrowUpRight}
            iconMotion="diag"
          >
            {services.cta.button}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
