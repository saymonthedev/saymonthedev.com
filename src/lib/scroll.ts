import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}

/**
 * Rola até uma seção e move o foco para ela, para que quem navega pelo
 * teclado continue a partir do ponto certo.
 */
export function scrollToSection(id: string, { updateHash = true } = {}) {
  const target = id ? document.getElementById(id) : null;
  // Seções marcadas com data-scroll-top (o Hero) levam ao topo absoluto.
  const destination = target && target.dataset.scrollTop === undefined ? target : 0;

  if (lenis) {
    lenis.scrollTo(destination, { duration: 1.25, force: true });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    if (destination === 0) window.scrollTo({ top: 0, behavior });
    else destination.scrollIntoView({ behavior, block: "start" });
  }

  // No próximo frame: se o clique veio do menu mobile, o conteúdo já deixou
  // de estar `inert` e pode receber o foco.
  requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  if (updateHash && id) window.history.pushState(null, "", `#${id}`);
}
