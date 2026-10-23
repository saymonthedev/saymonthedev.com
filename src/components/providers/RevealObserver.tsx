"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-revealed])";

/**
 * Um único IntersectionObserver para todos os elementos com `data-reveal`.
 * Um MutationObserver registra os que entram depois da montagem: na troca de
 * idioma o React recria itens cuja `key` é um texto traduzido, e sem isso eles
 * ficariam invisíveis para sempre.
 */
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

    const observeWithin = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches(SELECTOR)) observer.observe(node);
      node.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => observer.observe(el));
    };

    observeWithin(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeWithin(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
