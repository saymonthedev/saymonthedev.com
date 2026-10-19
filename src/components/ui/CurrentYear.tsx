"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const buildYear = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || 2026;

/** Ano atual no navegador; o HTML estático sai com o ano do build. */
export function CurrentYear() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => buildYear);
  return <>{year}</>;
}
