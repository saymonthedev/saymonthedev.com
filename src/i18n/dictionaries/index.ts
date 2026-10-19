import type { Locale } from "../config";
import { en } from "./en";
import { ptBR, type Dictionary } from "./pt-BR";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBR,
  en,
};
