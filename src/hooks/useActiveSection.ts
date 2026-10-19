"use client";

import { useEffect, useState } from "react";

/**
 * Retorna a chave da seção que cruza a faixa central da tela.
 * `sections` mapeia chave → id do elemento.
 */
export function useActiveSection<K extends string>(sections: Record<K, string>) {
  const [active, setActive] = useState<K | null>(null);
  const signature = Object.values(sections).join("|");

  useEffect(() => {
    const entries = Object.entries(sections) as [K, string][];
    const byId = new Map(entries.map(([key, id]) => [id, key]));

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(byId.get(record.target.id) ?? null);
        }
      },
      { rootMargin: "-42% 0px -54% 0px" },
    );

    for (const [, id] of entries) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // `signature` muda quando os IDs mudam (troca de idioma).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return active;
}
