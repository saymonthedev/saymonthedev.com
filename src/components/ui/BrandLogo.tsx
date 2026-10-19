import type { CSSProperties } from "react";
import { brandIcons, type BrandIconName } from "@/data/brand-icons";
import { cn } from "@/lib/cn";

type Tone = "brand" | "mono" | "hover" | "reveal";

const toneClass: Record<Tone, string> = {
  brand: "fill-(--brand)",
  mono: "fill-current",
  // Monocromático até o hover do elemento pai com a classe `group`; em telas
  // de toque (sem hover) já aparece colorido.
  hover:
    "fill-current transition-[fill] duration-500 group-hover:fill-(--brand) group-focus-visible:fill-(--brand) [@media(hover:none)]:fill-(--brand)",
  // Ganha a cor da marca quando o elemento `[data-reveal]` em volta aparece.
  reveal: "logo-reveal",
};

export function BrandLogo({
  name,
  tone = "brand",
  label,
  className,
}: {
  name: BrandIconName;
  tone?: Tone;
  /** Texto acessível. Sem ele, o logo é decorativo. */
  label?: string;
  className?: string;
}) {
  const icon = brandIcons[name];
  return (
    <svg
      viewBox={icon.viewBox}
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {icon.paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          className={toneClass[tone]}
          style={{ "--brand": path.color } as CSSProperties}
        />
      ))}
    </svg>
  );
}
