import { useId } from "react";
import { cn } from "@/lib/cn";

/** Letras "s" e "d" em Geist Mono Bold (mesmo desenho de `lib/monogram-svg`). */
const LETTERS_PATH =
  "M14.93 40.62Q12.71 40.62 11.22 39.92Q9.72 39.21 8.93 38.05Q8.14 36.89 8 35.45L11.85 35.28Q12.11 36.23 12.83 36.79Q13.55 37.35 14.96 37.35Q16.31 37.35 16.94 37.03Q17.57 36.71 17.57 36.08Q17.57 35.62 17.34 35.35Q17.11 35.08 16.48 34.83Q15.85 34.59 14.58 34.36Q12.25 33.87 10.89 33.25Q9.52 32.63 8.93 31.7Q8.34 30.76 8.34 29.36Q8.34 28.03 9.03 26.94Q9.72 25.85 11.13 25.19Q12.54 24.53 14.67 24.53Q16.97 24.53 18.39 25.27Q19.81 26.02 20.53 27.2Q21.25 28.38 21.45 29.7L17.57 29.87Q17.46 29.24 17.08 28.78Q16.71 28.32 16.11 28.06Q15.5 27.8 14.67 27.8Q13.43 27.8 12.89 28.28Q12.34 28.75 12.34 29.36Q12.34 29.9 12.63 30.25Q12.91 30.59 13.68 30.85Q14.44 31.11 15.82 31.4Q18.06 31.83 19.3 32.42Q20.53 33.01 21.05 33.85Q21.57 34.7 21.57 36Q21.57 37.43 20.78 38.47Q19.99 39.5 18.51 40.06Q17.03 40.62 14.93 40.62ZM47.58 40.62Q45.74 40.62 44.36 39.67Q42.98 38.73 42.22 36.93Q41.46 35.13 41.46 32.57Q41.46 30.02 42.22 28.22Q42.98 26.42 44.36 25.48Q45.74 24.53 47.58 24.53Q48.9 24.53 49.91 24.99Q50.91 25.45 51.57 26.24Q52.23 27.03 52.44 28.03L52.09 28.69V19.87H56V40.28H52.26L52.09 36.2L52.52 36.86Q52.23 37.89 51.57 38.75Q50.91 39.62 49.91 40.12Q48.9 40.62 47.58 40.62ZM48.7 37.17Q49.73 37.17 50.5 36.64Q51.26 36.11 51.67 35.08Q52.09 34.04 52.09 32.57Q52.09 31.08 51.67 30.05Q51.26 29.01 50.5 28.49Q49.73 27.98 48.7 27.98Q47.12 27.98 46.31 29.15Q45.51 30.33 45.51 32.57Q45.51 34.79 46.31 35.98Q47.12 37.17 48.7 37.17Z";
/** O "_" entre as letras, na cor de destaque. */
const BAR = { x: 24.61, y: 41.05, width: 14.83, height: 3.08 };

/**
 * Logo: "s_d" (saymon_dev), com o sublinhado em azul. No hover de um
 * elemento `group`, o sublinhado pisca como um cursor de terminal.
 */
export function Monogram({ className, framed = true }: { className?: string; framed?: boolean }) {
  const bg = `${useId()}-bg`;

  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101A2F" />
          <stop offset="1" stopColor="#05070B" />
        </linearGradient>
      </defs>
      {framed && (
        <rect x="1" y="1" width="62" height="62" rx="16" fill={`url(#${bg})`} stroke="#22304A" strokeWidth="2" />
      )}
      <path d={LETTERS_PATH} fill="#F8FAFC" />
      <rect {...BAR} fill="#3B82F6" className="group-hover:animate-[caret_1s_steps(1)_infinite]" />
    </svg>
  );
}
