import {
  Boxes,
  Braces,
  Cable,
  CodeXml,
  Infinity as InfinityIcon,
  ListChecks,
  Network,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BrandIconName } from "./brand-icons";

type ConceptKey = keyof Dictionary["stack"]["items"];
export type TechCategoryId = keyof Dictionary["stack"]["categories"];

/**
 * Tecnologias com marca usam o logotipo oficial e o nome da marca.
 * Conceitos (testes, CI/CD...) não têm logo: usam um ícone de interface e o
 * nome traduzido em `stack.items` no dicionário.
 */
export type TechItem =
  | { kind: "brand"; id: string; name: string; logo: BrandIconName }
  | { kind: "concept"; id: ConceptKey; icon: LucideIcon };

export type TechCategory = { id: TechCategoryId; items: TechItem[] };

const brand = (id: string, name: string, logo: BrandIconName): TechItem => ({
  kind: "brand",
  id,
  name,
  logo,
});

const concept = (id: ConceptKey, icon: LucideIcon): TechItem => ({ kind: "concept", id, icon });

export const techCategories: TechCategory[] = [
  {
    id: "frontend",
    items: [
      brand("react", "React", "react"),
      brand("nextjs", "Next.js", "nextjs"),
      brand("typescript", "TypeScript", "typescript"),
      brand("javascript", "JavaScript", "javascript"),
      brand("html", "HTML", "html"),
      brand("css", "CSS", "css"),
      brand("tailwind", "Tailwind CSS", "tailwind"),
    ],
  },
  {
    id: "backend",
    items: [
      brand("nodejs", "Node.js", "nodejs"),
      brand("java", "Java", "java"),
      brand("springboot", "Spring Boot", "springboot"),
      brand("python", "Python", "python"),
      brand("django", "Django", "django"),
      brand("flask", "Flask", "flask"),
      concept("rest", Braces),
    ],
  },
  {
    id: "data",
    items: [
      brand("postgresql", "PostgreSQL", "postgresql"),
      brand("prisma", "Prisma", "prisma"),
      brand("git", "Git", "git"),
      brand("gitlab", "GitLab", "gitlab"),
    ],
  },
  {
    id: "devops",
    items: [
      brand("docker", "Docker", "docker"),
      brand("kubernetes", "Kubernetes", "kubernetes"),
      brand("rancher", "Rancher", "rancher"),
      brand("aws", "AWS", "aws"),
      concept("cicd", InfinityIcon),
      concept("networking", Network),
    ],
  },
  {
    id: "engineering",
    items: [
      concept("testing", ListChecks),
      concept("cleancode", CodeXml),
      concept("bestpractices", ShieldCheck),
      concept("architecture", Boxes),
      concept("integrations", Cable),
    ],
  },
];
