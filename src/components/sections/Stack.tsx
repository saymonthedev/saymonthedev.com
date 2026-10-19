"use client";

import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { brandIcons } from "@/data/brand-icons";
import { techCategories, type TechCategoryId, type TechItem } from "@/data/technologies";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/style";

/** Posição de cada categoria na grade bento (desktop e tablet). */
const layout: Record<TechCategoryId, { panel: string; tiles: string }> = {
  frontend: { panel: "md:col-span-2 lg:col-span-4", tiles: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" },
  backend: { panel: "lg:col-span-2", tiles: "grid-cols-2" },
  data: { panel: "lg:col-span-2", tiles: "grid-cols-2" },
  devops: { panel: "lg:col-span-2", tiles: "grid-cols-2" },
  engineering: { panel: "md:col-span-2 lg:col-span-2", tiles: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-2" },
};

function Tile({ item, label, delay }: { item: TechItem; label: string; delay: number }) {
  const glow = item.kind === "brand" ? brandIcons[item.logo].paths.at(-1)?.color : "#60A5FA";

  return (
    <li data-reveal="scale" style={revealDelay(delay)}>
      <div
        style={{ "--glow": glow } as CSSProperties}
        className="group flex h-full items-center gap-3 rounded-2xl border border-(--line) bg-white/[0.015] px-3.5 py-3 transition-[border-color,background-color,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-(--line-strong) hover:bg-white/[0.04]"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.035] text-muted transition-[filter] duration-500 group-hover:[filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--glow)_55%,transparent))]">
          {item.kind === "brand" ? (
            <BrandLogo name={item.logo} tone="reveal" className="size-5" />
          ) : (
            <item.icon
              aria-hidden="true"
              strokeWidth={1.7}
              className="size-5 text-accent-200 transition-transform duration-500 ease-out-expo group-hover:scale-110"
            />
          )}
        </span>
        <span className="text-sm leading-tight text-soft transition-colors group-hover:text-fg">{label}</span>
      </div>
    </li>
  );
}

export function Stack() {
  const { dict } = useI18n();
  const stack = dict.stack;
  const onPointerMove = useSpotlight<HTMLDivElement>();

  return (
    <section
      id={dict.sections.stack}
      tabIndex={-1}
      aria-labelledby="stack-title"
      className="relative py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/30 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          id="stack-title"
          eyebrow={stack.eyebrow}
          title={stack.title}
          accent={stack.titleAccent}
          intro={stack.intro}
        />

        <div
          data-spotlight-group
          onPointerMove={onPointerMove}
          className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-6"
        >
          {techCategories.map((category, categoryIndex) => {
            const copy = stack.categories[category.id];
            const titleId = `stack-${category.id}`;
            return (
              <section
                key={category.id}
                aria-labelledby={titleId}
                data-reveal
                style={revealDelay((categoryIndex % 3) * 80)}
                className={cn("spotlight surface rounded-[1.75rem] p-5 sm:p-6", layout[category.id].panel)}
              >
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h3 id={titleId} className="text-lg font-semibold tracking-tight">
                      {copy.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{copy.note}</p>
                  </div>
                  <span className="font-mono text-xs text-subtle">
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </span>
                </header>
                <ul className={cn("mt-6 grid gap-2", layout[category.id].tiles)}>
                  {category.items.map((item, index) => (
                    <Tile
                      key={item.id}
                      item={item}
                      label={item.kind === "brand" ? item.name : stack.items[item.id]}
                      delay={120 + index * 55}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
