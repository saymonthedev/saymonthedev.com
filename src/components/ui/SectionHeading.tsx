import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { keepHyphenated, revealDelay } from "@/lib/style";

export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  intro,
  align = "left",
  className,
  children,
}: {
  /** ID do título, para `aria-labelledby` da seção. */
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p className="eyebrow" data-reveal="fade">
        {eyebrow}
      </p>
      <h2
        id={id}
        data-reveal
        style={revealDelay(80)}
        className={cn(
          "max-w-[22ch] text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.5rem]",
          align === "center" && "mx-auto",
        )}
      >
        {title} <span className="accent-serif block text-[1.08em] leading-[1.02]">{keepHyphenated(accent)}</span>
      </h2>
      {intro && (
        <p
          data-reveal
          style={revealDelay(160)}
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
