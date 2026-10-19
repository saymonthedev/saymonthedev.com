import { useId } from "react";
import { cn } from "@/lib/cn";

/** Contorno do "S" (mesmo desenho de `lib/monogram-svg`). */
const S_PATH =
  "M43 12H29.5A12.5 12 0 0 0 29.5 36H35.5A4 4 0 0 1 35.5 44H20L16 52H35.5A12.5 12 0 0 0 35.5 28H29.5A4 4 0 0 1 29.5 20H39Z";
/** Ponta superior em barra "/", na cor de destaque. */
const SLASH_PATH = "M41 12H47L43 20H37Z";

/**
 * Logo: um "S" geométrico cuja ponta de cima é uma barra "/" de código, em
 * azul. No hover de um elemento `group`, a barra se desloca na própria
 * diagonal.
 */
export function Monogram({ className, framed = true }: { className?: string; framed?: boolean }) {
  const id = useId();
  const bg = `${id}-bg`;
  const letter = `${id}-s`;
  const accent = `${id}-a`;

  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101A2F" />
          <stop offset="1" stopColor="#05070B" />
        </linearGradient>
        <linearGradient id={letter} gradientUnits="userSpaceOnUse" x1="26" y1="12" x2="38" y2="52">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id={accent} gradientUnits="userSpaceOnUse" x1="37" y1="20" x2="47" y2="12">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {framed && (
        <rect x="1" y="1" width="62" height="62" rx="16" fill={`url(#${bg})`} stroke="#22304A" strokeWidth="2" />
      )}
      <path d={S_PATH} fill={`url(#${letter})`} />
      <path
        d={SLASH_PATH}
        fill={`url(#${accent})`}
        className="transition-transform duration-500 ease-out-expo group-hover:translate-x-[1px] group-hover:-translate-y-[2px]"
      />
    </svg>
  );
}
