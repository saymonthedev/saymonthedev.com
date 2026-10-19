import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Monograma S·O·C: o anel aberto é o C, o ponto na abertura é o O e o S fica
 * no centro. No hover de um elemento `group`, o S é redesenhado.
 */
export function Monogram({ className, framed = true }: { className?: string; framed?: boolean }) {
  const id = useId();
  const stroke = `${id}-s`;
  const bg = `${id}-bg`;

  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={stroke} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101A2F" />
          <stop offset="1" stopColor="#05070B" />
        </linearGradient>
      </defs>
      {framed && (
        <rect x="1" y="1" width="62" height="62" rx="16" fill={`url(#${bg})`} stroke="#22304A" strokeWidth="2" />
      )}
      <path
        d="M47.3 19.1 A20 20 0 1 0 47.3 44.9"
        fill="none"
        stroke="#2563EB"
        strokeWidth="3.4"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="100 100"
        className="group-hover:animate-[ring-draw_1.1s_var(--ease-out-expo)]"
      />
      <path
        d="M37.1 21.2 A6.6 6.6 0 1 0 32 32 A6.6 6.6 0 1 1 26.9 42.8"
        fill="none"
        stroke={`url(#${stroke})`}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <circle
        cx="50.2"
        cy="32"
        r="3.1"
        fill="#3B82F6"
        className="origin-[50.2px_32px] transition-transform duration-700 ease-out-expo group-hover:scale-125"
      />
    </svg>
  );
}
