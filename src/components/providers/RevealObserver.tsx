"use client";

import { useEffect } from "react";

/** Um único IntersectionObserver para todos os elementos com `data-reveal`. */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.revealReady = "";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
