"use client";

import { Menu, X } from "lucide-react";
import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Monogram } from "@/components/ui/Monogram";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/links";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { navKeys } from "./nav";

export function Header() {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const active = useActiveSection(
    Object.fromEntries(navKeys.map((key) => [key, dict.sections[key]])) as Record<
      (typeof navKeys)[number],
      string
    >,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "relative border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen
            ? "border-(--line) bg-ink-950/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-(--header-h) items-center justify-between gap-4">
          <a
            href={`#${dict.sections.home}`}
            aria-label={dict.a11y.home}
            className="group flex items-center gap-3 rounded-xl"
          >
            <Monogram className="size-9" />
            <span className="hidden flex-col leading-none xs:flex">
              <span className="text-[15px] font-semibold tracking-tight">Saymon</span>
              <span className="mt-1 font-mono text-[10px] tracking-[0.2em] text-subtle uppercase">
                Full Stack
              </span>
            </span>
          </a>

          <nav aria-label={dict.a11y.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-0.5 rounded-full border border-(--line) bg-ink-900/60 p-1">
              {navKeys.map((key) => {
                const current = active === key;
                return (
                  <li key={key}>
                    <a
                      href={`#${dict.sections[key]}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                        current ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {current && (
                        <m.span
                          layoutId="nav-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                          transition={{ type: "spring", bounce: 0.18, duration: 0.6 }}
                        />
                      )}
                      <span className="relative">{dict.nav[key]}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher animatedPill />
            <ButtonLink
              href={whatsappUrl(dict.whatsappMessage)}
              external
              className="hidden min-h-10 px-4 text-sm md:inline-flex"
            >
              {dict.nav.cta}
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
              className="relative grid size-10 place-items-center rounded-full border border-(--line-strong) bg-white/[0.03] text-fg transition-colors hover:bg-white/[0.07] lg:hidden"
            >
              <Menu
                aria-hidden="true"
                className={cn(
                  "absolute size-[18px] transition-all duration-300",
                  menuOpen ? "scale-50 rotate-90 opacity-0" : "opacity-100",
                )}
              />
              <X
                aria-hidden="true"
                className={cn(
                  "absolute size-[18px] transition-all duration-300",
                  menuOpen ? "opacity-100" : "scale-50 -rotate-90 opacity-0",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={(restoreFocus) => {
          setMenuOpen(false);
          if (restoreFocus) toggleRef.current?.focus();
        }}
        containerRef={headerRef}
      />
    </header>
  );
}
