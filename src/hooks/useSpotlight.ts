"use client";

import { useCallback, useRef, type PointerEvent } from "react";

/**
 * Atualiza `--x`/`--y` de cada `.spotlight` dentro do elemento que recebe o
 * handler, relativo a cada cartão. Assim a luz da borda "vaza" para os
 * cartões vizinhos, como uma única fonte de luz sobre a grade.
 */
export function useSpotlight<T extends HTMLElement>() {
  const frame = useRef(0);

  return useCallback((event: PointerEvent<T>) => {
    if (event.pointerType !== "mouse") return;
    const container = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      container.querySelectorAll<HTMLElement>(".spotlight").forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", `${clientX - rect.left}px`);
        card.style.setProperty("--y", `${clientY - rect.top}px`);
      });
    });
  }, []);
}
