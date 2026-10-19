"use client";

import { useMemo, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
};

/**
 * Relógio no fuso informado. No servidor (e na hidratação) mostra "--:--",
 * então não há divergência entre o HTML e o cliente.
 */
export function LocalTime({ locale, timeZone }: { locale: string; timeZone: string }) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      }),
    [locale, timeZone],
  );

  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(Date.now()),
    () => null,
  );

  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
