import { createElement, type CSSProperties, type ReactNode } from "react";

/** Atraso da revelação ao rolar (ver `[data-reveal]` em globals.css). */
export const revealDelay = (ms: number) => ({ "--reveal-delay": ms }) as CSSProperties;

/** Atraso da coreografia de entrada do Hero (ver `.intro` em globals.css). */
export const introDelay = (ms: number) => ({ "--d": ms }) as CSSProperties;

/**
 * Impede a quebra de linha no meio de palavras com hífen
 * ("transformá-la" não vira "transformá- / la").
 */
export function keepHyphenated(text: string): ReactNode[] {
  return text.split(/(\S+-\S+)/).map((part, index) =>
    index % 2 === 1 ? createElement("span", { key: index, className: "whitespace-nowrap" }, part) : part,
  );
}
