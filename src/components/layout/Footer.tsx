"use client";

import { ArrowUp } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { Monogram } from "@/components/ui/Monogram";
import { site } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import { mailtoUrl, whatsappUrl } from "@/lib/links";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navKeys } from "./nav";

export function Footer() {
  const { dict } = useI18n();
  const footer = dict.footer;
  const frame = useRef(0);

  // O nome gigante acende sob o cursor.
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--fx", `${clientX - rect.left}px`);
      el.style.setProperty("--fy", `${clientY - rect.top}px`);
    });
  };

  const social = [
    { name: "GitHub", logo: "github", href: site.github.url },
    { name: "LinkedIn", logo: "linkedin", href: site.linkedin.url },
    { name: "WhatsApp", logo: "whatsapp", href: whatsappUrl(dict.whatsappMessage) },
  ] as const;

  return (
    <footer className="relative overflow-hidden border-t border-(--line) pt-16 sm:pt-20">
      <div className="container-page grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <Monogram className="size-10" />
            <div>
              <p className="font-semibold tracking-tight">{site.name}</p>
              <p className="mt-0.5 text-sm text-muted">{footer.role}</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">{footer.description}</p>
          <LanguageSwitcher className="mt-7 w-fit" />
        </div>

        <nav aria-labelledby="footer-nav-title">
          <h2 id="footer-nav-title" className="font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">
            {footer.navTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {navKeys.map((key) => (
              <li key={key}>
                <a href={`#${dict.sections[key]}`} className="link-underline text-[15px] text-muted hover:text-fg">
                  {dict.nav[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">{footer.contactTitle}</h2>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li>
              <a href={mailtoUrl()} className="link-underline text-muted hover:text-fg">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(dict.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-muted hover:text-fg"
              >
                {site.whatsapp.display}
                <span className="sr-only"> ({dict.a11y.newTab})</span>
              </a>
            </li>
          </ul>
          <h2 className="mt-9 font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">{footer.socialTitle}</h2>
          <ul className="mt-4 flex gap-2">
            {social.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} (${dict.a11y.newTab})`}
                  className="group grid size-11 place-items-center rounded-xl border border-(--line) bg-white/[0.02] text-muted transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-(--line-strong) hover:bg-white/[0.05]"
                >
                  <BrandLogo name={item.logo} tone="hover" className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page relative mt-16 flex flex-col gap-4 border-t border-(--line) py-7 text-[13px] text-subtle sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CurrentYear /> {site.name}. {footer.rights}
        </p>
        <p>{footer.independent}</p>
        <a
          href={`#${dict.sections.home}`}
          className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
        >
          {footer.backToTop}
          <ArrowUp
            aria-hidden="true"
            className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div
        aria-hidden="true"
        onPointerMove={onPointerMove}
        onPointerLeave={(event) => event.currentTarget.style.setProperty("--fy", "-999px")}
        className="relative -mb-[0.06em] select-none text-center font-serif text-[clamp(5.5rem,25vw,23rem)] leading-[0.92] tracking-[-0.03em] italic"
      >
        <p className="text-transparent [-webkit-text-stroke:1px_rgb(148_163_184/0.22)]">Saymon</p>
        <p className="footer-wordmark-lit absolute inset-0">Saymon</p>
      </div>
    </footer>
  );
}
