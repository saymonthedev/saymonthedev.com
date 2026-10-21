"use client";

import { ArrowUpRight, Check, FolderGit2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { publishedProjects, type Project } from "@/data/projects";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/style";
import { ProjectPreview } from "./ProjectPreview";

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  const { dict, locale } = useI18n();
  const labels = dict.projects.labels;

  return (
    <article
      data-reveal
      className={cn(
        "spotlight surface grid gap-8 rounded-[2rem] p-3 sm:p-4",
        featured && "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10",
      )}
    >
      <ProjectPreview project={project} />

      <div className="flex flex-col px-3 pb-4 sm:px-4 lg:py-6 lg:pr-6 lg:pl-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-subtle">
          <span>{project.kind[locale]}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
        </p>
        <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{project.title}</h3>
        <p className="mt-4 text-base leading-relaxed text-muted text-pretty">{project.description[locale]}</p>

        <h4 className="mt-8 font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">{labels.highlights}</h4>
        <ul className="mt-3 space-y-2.5">
          {project.highlights[locale].map((highlight) => (
            <li key={highlight} className="flex gap-3 text-[15px] leading-snug text-soft">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-300" strokeWidth={2.2} />
              {highlight}
            </li>
          ))}
        </ul>

        <h4 className="mt-8 font-mono text-[10.5px] tracking-[0.18em] text-subtle uppercase">{labels.stack}</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech.name}
              className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white/[0.02] py-1.5 pr-3 pl-2 text-[13px] text-soft"
            >
              <BrandLogo name={tech.logo} className="size-3.5" />
              {tech.name}
            </li>
          ))}
        </ul>

        {(project.repoUrl || project.liveUrl) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-9">
            {project.liveUrl && (
              <ButtonLink href={project.liveUrl} external icon={ArrowUpRight} iconMotion="diag">
                {labels.live}
              </ButtonLink>
            )}
            {project.repoUrl && (
              <ButtonLink
                href={project.repoUrl}
                external
                variant={project.liveUrl ? "ghost" : "primary"}
                leading={<BrandLogo name="github" tone="mono" className="size-4" />}
                icon={ArrowUpRight}
                iconMotion="diag"
              >
                {labels.repo}
              </ButtonLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  const { dict } = useI18n();
  const copy = dict.projects;
  const onPointerMove = useSpotlight<HTMLDivElement>();
  const projects = publishedProjects;
  // Um card "mais projetos" completa a grade quando ela fica ímpar ou com um só item.
  const showMore = projects.length === 0 || projects.length % 2 === 1;

  return (
    <section
      id={dict.sections.projects}
      tabIndex={-1}
      aria-labelledby="projects-title"
      className="relative py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/30 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          id="projects-title"
          eyebrow={copy.eyebrow}
          title={copy.title}
          accent={copy.titleAccent}
          intro={copy.intro}
        />

        <div
          data-spotlight-group
          onPointerMove={onPointerMove}
          className={cn("mt-14 grid gap-5 lg:mt-16", projects.length > 1 && "lg:grid-cols-2")}
        >
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={cn(projects.length > 1 && index === 0 && projects.length % 2 === 1 && "lg:col-span-2")}
            >
              {/* Layout de destaque só quando o cartão ocupa a linha inteira. */}
              <ProjectCard project={project} featured={projects.length === 1 || (index === 0 && projects.length % 2 === 1)} />
            </div>
          ))}

          {showMore && (
            <div
              data-reveal
              style={revealDelay(120)}
              className={cn(
                "flex flex-col gap-6 rounded-[2rem] border border-dashed border-(--line-strong) p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8",
                projects.length > 1 && "lg:col-span-2",
              )}
            >
              <div className="flex items-start gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-(--line-strong) bg-white/[0.03] text-accent-200">
                  <FolderGit2 aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{copy.more.title}</h3>
                  <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-muted">{copy.more.text}</p>
                </div>
              </div>
              <ButtonLink
                href={site.github.url}
                external
                variant="ghost"
                leading={<BrandLogo name="github" tone="mono" className="size-4" />}
                icon={ArrowUpRight}
                iconMotion="diag"
                className="shrink-0"
              >
                {copy.more.cta}
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
