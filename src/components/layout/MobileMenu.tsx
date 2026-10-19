"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { site } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import { whatsappUrl } from "@/lib/links";
import { lockScroll } from "@/lib/scroll";
import { navKeys } from "./nav";

const ease = [0.16, 1, 0.3, 1] as const;

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function MobileMenu({
  open,
  onClose,
  containerRef,
}: {
  open: boolean;
  onClose: (restoreFocus: boolean) => void;
  /** Elemento que contém a barra e o menu: o foco fica preso dentro dele. */
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { dict } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    lockScroll(true);
    const outside = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    outside.forEach((el) => (el.inert = true));
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current(true);
        return;
      }
      if (event.key !== "Tab" || !containerRef.current) return;
      const items = Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = () => desktop.matches && onCloseRef.current(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      outside.forEach((el) => (el.inert = false));
      lockScroll(false);
    };
  }, [open, containerRef]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          key="mobile-menu"
          className="fixed inset-0 -z-10 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease, delay: 0.1 } }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-ink-950/96 backdrop-blur-2xl" />
          <div
            aria-hidden="true"
            className="absolute -top-40 right-[-20%] size-[28rem] rounded-full bg-accent/25 blur-[120px]"
          />
          <div
            ref={panelRef}
            data-lenis-prevent
            className="container-page relative flex h-full flex-col overflow-y-auto pt-[calc(var(--header-h)+1.5rem)] pb-8"
          >
            <nav aria-label={dict.a11y.mainNav}>
              <ol>
                {navKeys.map((key, index) => (
                  <m.li
                    key={key}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.06 + index * 0.05 } }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease } }}
                  >
                    <a
                      href={`#${dict.sections[key]}`}
                      onClick={() => onClose(false)}
                      className="group flex items-center justify-between border-b border-(--line) py-4 text-[1.75rem] font-semibold tracking-tight text-fg"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs font-normal text-subtle">0{index + 1}</span>
                        {dict.nav[key]}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-subtle transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-300"
                      />
                    </a>
                  </m.li>
                ))}
              </ol>
            </nav>

            <m.div
              className="mt-auto flex flex-col gap-6 pt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <ButtonLink
                href={whatsappUrl(dict.whatsappMessage)}
                external
                size="lg"
                className="w-full"
                leading={<BrandLogo name="whatsapp" tone="mono" className="size-[18px]" />}
              >
                {dict.contact.primary}
              </ButtonLink>
              <div className="flex items-center justify-between gap-4 text-sm text-muted">
                <a href={`mailto:${site.email}`} className="link-underline truncate">
                  {site.email}
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href={site.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub (${dict.a11y.newTab})`}
                    className="group grid size-10 place-items-center rounded-full border border-(--line-strong)"
                  >
                    <BrandLogo name="github" tone="hover" className="size-[18px]" />
                  </a>
                  <a
                    href={site.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn (${dict.a11y.newTab})`}
                    className="group grid size-10 place-items-center rounded-full border border-(--line-strong)"
                  >
                    <BrandLogo name="linkedin" tone="hover" className="size-[18px]" />
                  </a>
                </div>
              </div>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
