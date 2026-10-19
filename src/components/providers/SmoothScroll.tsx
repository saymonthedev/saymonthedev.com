"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { registerLenis, scrollToSection } from "@/lib/scroll";

/**
 * Inércia na rolagem com Lenis (que mantém a rolagem nativa do navegador)
 * e rolagem suave para todos os links de âncora da página.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ autoRaf: true, lerp: 0.11 });
    registerLenis(lenis);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !document.getElementById(id)) return;
      event.preventDefault();
      scrollToSection(id);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      registerLenis(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
