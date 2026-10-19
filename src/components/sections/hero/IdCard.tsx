"use client";

import { m, useReducedMotion, useSpring } from "motion/react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import photo from "@/assets/images/saymon.png";
import { LocalTime } from "@/components/ui/LocalTime";
import { Monogram } from "@/components/ui/Monogram";
import { site } from "@/config/site";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { useI18n } from "@/i18n/LocaleProvider";
import { introDelay } from "@/lib/style";

const spring = { stiffness: 140, damping: 18, mass: 0.6 };

/** Cartão de identificação com a foto: inclina em 3D seguindo o cursor. */
export function IdCard() {
  const { dict, locale } = useI18n();
  const card = dict.hero.card;
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !finePointer) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    if (reduceMotion) return;
    rotateY.set((px - 0.5) * 12);
    rotateX.set((0.5 - py) * 10);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const rows = [
    [card.rows.role, card.roleValue],
    [card.rows.base, card.baseValue],
    [card.rows.status, card.statusValue],
    [card.rows.languages, card.languagesValue],
  ] as const;

  return (
    <div className="intro-card relative w-full max-w-[20.5rem] sm:max-w-[22rem]" style={introDelay(260)}>
      <div
        aria-hidden="true"
        className="absolute -inset-x-16 -inset-y-14 -z-10 bg-[radial-gradient(closest-side,rgb(37_99_235/0.3),transparent)]"
      />
      <m.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        className="group/card beam-border surface relative rounded-[1.75rem] p-2.5"
      >
        <div className="flex items-center justify-between px-2 pt-1 pb-3 font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">
          <span className="flex items-center gap-2">
            <Monogram framed={false} className="size-[18px]" />
            S·O·C
          </span>
          <span className="flex items-center gap-2" title={card.timeLabel}>
            <span className="sr-only">{card.timeLabel}:</span>
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_10px_rgb(52_211_153/0.8)]" />
            <LocalTime locale={locale} timeZone={site.timeZone} />
            <span aria-hidden="true">BRT</span>
          </span>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-ink-800">
          <Image
            src={photo}
            alt={card.photoAlt}
            preload
            quality={90}
            placeholder="blur"
            sizes="(min-width: 640px) 336px, 312px"
            className="size-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover/card:scale-[1.03]"
          />
          {/* Tratamento sutil: luz azul lateral e base escurecida para integrar ao layout. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(130deg,rgb(59_130_246/0.28),transparent_45%)] mix-blend-soft-light"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/5 to-transparent"
          />
          <div
            aria-hidden="true"
            className="card-sheen absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          />
          <span aria-hidden="true" className="absolute top-3 left-3 size-4 border-t border-l border-white/45" />
          <span aria-hidden="true" className="absolute top-3 right-3 size-4 border-t border-r border-white/45" />
          <span aria-hidden="true" className="absolute bottom-3 left-3 size-4 border-b border-l border-white/45" />
          <span aria-hidden="true" className="absolute right-3 bottom-3 size-4 border-r border-b border-white/45" />

          <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
            <p className="font-serif text-[2.1rem] leading-none text-white italic">Saymon</p>
            <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.24em] text-soft uppercase">
              Oliveira de Castro
            </p>
          </div>
        </div>

        <dl className="mt-2.5 grid grid-cols-2 gap-px overflow-hidden rounded-[1.1rem] border border-(--line) bg-(--line)">
          {rows.map(([label, value]) => (
            <div key={label} className="bg-ink-900 px-3.5 py-3">
              <dt className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{label}</dt>
              <dd className="mt-1 text-[13.5px] font-medium text-soft">{value}</dd>
            </div>
          ))}
        </dl>
      </m.div>
    </div>
  );
}
