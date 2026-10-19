"use client";

import { MousePointer2, MoveDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

/**
 * Captura real do projeto numa moldura de navegador. No hover (ou pelo
 * botão, no toque e no teclado) a imagem desliza e percorre a página inteira.
 */
export function ProjectPreview({ project }: { project: Project }) {
  const { dict, locale } = useI18n();
  const labels = dict.projects.labels;
  const [browsing, setBrowsing] = useState(false);
  const { desktop, mobile, alt } = project.images;

  return (
    <div className="group/preview relative pb-6 sm:pr-10 sm:pb-10">
      <div className="overflow-hidden rounded-[1.25rem] border border-(--line-strong) bg-ink-850 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]">
        <div className="flex h-9 items-center gap-3 border-b border-(--line) px-4">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="mx-auto truncate rounded-md bg-white/[0.04] px-3 py-0.5 font-mono text-[11px] text-subtle">
            {project.slug}
          </span>
          <span aria-hidden="true" className="w-[42px]" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden [container-type:size]">
          <Image
            src={desktop}
            alt={`${alt[locale]} — ${labels.desktopPreview}`}
            sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 92vw"
            data-browsing={browsing}
            className={cn(
              "absolute inset-x-0 top-0 h-auto w-full ease-in-out",
              "transition-transform duration-[1.4s]",
              "group-hover/preview:translate-y-[calc(-100%+100cqh)] group-hover/preview:duration-[9s]",
              "data-[browsing=true]:translate-y-[calc(-100%+100cqh)] data-[browsing=true]:duration-[9s]",
            )}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950/50 to-transparent"
          />
        </div>
      </div>

      {mobile && (
        <div className="absolute right-0 bottom-0 hidden w-[23%] min-w-[7.5rem] overflow-hidden rounded-[1.4rem] border-[5px] border-ink-700 bg-ink-850 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] transition-transform duration-700 ease-out-expo group-hover/preview:-translate-y-2 sm:block">
          <Image
            src={mobile}
            alt={`${alt[locale]} — ${labels.mobilePreview}`}
            sizes="180px"
            className="h-auto w-full"
          />
        </div>
      )}

      <button
        type="button"
        aria-pressed={browsing}
        onClick={() => setBrowsing((value) => !value)}
        className="absolute bottom-0 left-3 inline-flex items-center gap-2 rounded-full border border-(--line-strong) bg-ink-900/90 px-3.5 py-2 text-xs text-soft backdrop-blur-md transition-colors hover:text-fg sm:bottom-4 sm:left-4"
      >
        {browsing ? (
          <MousePointer2 aria-hidden="true" className="size-3.5" />
        ) : (
          <MoveDown aria-hidden="true" className="size-3.5 animate-bounce [animation-duration:2s]" />
        )}
        {browsing ? labels.browseStop : labels.browse}
      </button>
    </div>
  );
}
