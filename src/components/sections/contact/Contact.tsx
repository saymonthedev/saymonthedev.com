"use client";

import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Monogram } from "@/components/ui/Monogram";
import { site } from "@/config/site";
import type { BrandIconName } from "@/data/brand-icons";
import { useI18n } from "@/i18n/LocaleProvider";
import { mailtoUrl, whatsappUrl } from "@/lib/links";
import { keepHyphenated, revealDelay } from "@/lib/style";
import { ContactComposer } from "./ContactComposer";

export function Contact() {
  const { dict } = useI18n();
  const contact = dict.contact;

  const channels: {
    key: keyof typeof contact.channels;
    logo: BrandIconName;
    value: string;
    href: string;
    external: boolean;
  }[] = [
    {
      key: "whatsapp",
      logo: "whatsapp",
      value: site.whatsapp.display,
      href: whatsappUrl(dict.whatsappMessage),
      external: true,
    },
    { key: "email", logo: "gmail", value: site.email, href: mailtoUrl(), external: false },
    { key: "github", logo: "github", value: `@${site.github.handle}`, href: site.github.url, external: true },
    { key: "linkedin", logo: "linkedin", value: site.name, href: site.linkedin.url, external: true },
  ];

  return (
    <section
      id={dict.sections.contact}
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="relative pt-4 pb-24 sm:pb-32"
    >
      <div className="container-page">
        <div
          data-reveal="fade"
          className="beam-border relative overflow-hidden rounded-[2.25rem] border border-(--line) bg-ink-900"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-56 -left-40 size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.28),transparent)]" />
            <div className="absolute -right-40 -bottom-72 size-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.16),transparent)]" />
            <div className="hero-grid absolute inset-0 opacity-50" />
            <Monogram framed={false} className="absolute -right-24 -bottom-24 size-[26rem] opacity-[0.04]" />
          </div>

          <div className="relative grid grid-cols-[minmax(0,1fr)] gap-12 px-4 py-12 xs:px-5 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:px-14 lg:py-20">
            <div>
              <p className="eyebrow">{contact.eyebrow}</p>
              <h2
                id="contact-title"
                data-reveal
                style={revealDelay(80)}
                className="mt-5 text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-[4rem]"
              >
                {contact.title}{" "}
                <span className="accent-serif block text-[1.06em] leading-[1.02]">{keepHyphenated(contact.titleAccent)}</span>
              </h2>
              <p
                data-reveal
                style={revealDelay(160)}
                className="mt-6 max-w-lg text-base leading-relaxed text-muted text-pretty sm:text-lg"
              >
                {contact.text}
              </p>

              <div data-reveal style={revealDelay(220)} className="mt-9">
                <Magnetic className="max-w-full">
                  <ButtonLink
                    href={whatsappUrl(dict.whatsappMessage)}
                    external
                    size="lg"
                    className="max-w-full px-6 text-center whitespace-normal sm:px-7 sm:whitespace-nowrap"
                    leading={<BrandLogo name="whatsapp" tone="mono" className="size-5" />}
                    icon={ArrowUpRight}
                    iconMotion="diag"
                  >
                    {contact.primary}
                  </ButtonLink>
                </Magnetic>
              </div>

              <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-2.5">
                {channels.map((channel, index) => (
                  <li
                    key={channel.key}
                    data-reveal
                    style={revealDelay(260 + index * 60)}
                    className="flex items-center gap-2.5"
                  >
                    <a
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-(--line) bg-ink-950/40 px-3 py-3 xs:gap-4 xs:px-4 transition-[border-color,background-color] duration-300 hover:border-(--line-strong) hover:bg-white/[0.035]"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] transition-transform duration-500 ease-out-expo group-hover:scale-105">
                        <BrandLogo name={channel.logo} className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10.5px] tracking-[0.16em] text-subtle uppercase">
                          {contact.channels[channel.key]}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-soft xs:text-[15px] transition-colors group-hover:text-fg">
                          {channel.value}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-subtle transition-all duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-300"
                      />
                      {channel.external && <span className="sr-only">({dict.a11y.newTab})</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal style={revealDelay(200)} className="lg:pt-2">
              <ContactComposer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
