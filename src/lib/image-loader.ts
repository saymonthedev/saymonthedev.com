"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Loader para hospedagem estática. Depois do `next build`, o script
 * scripts/optimize-images.mjs gera, para cada imagem importada, uma versão
 * WebP em cada largura configurada (`<nome>.w<largura>.webp`). Em
 * desenvolvimento, a imagem original é servida.
 */
export default function staticImageLoader({ src, width }: ImageLoaderProps) {
  const optimizable = src.startsWith("/_next/static/media/") && !src.endsWith(".svg");
  if (process.env.NODE_ENV === "development" || !optimizable) return src;
  return `${src.replace(/\.[a-z0-9]+$/i, "")}.w${width}.webp`;
}
