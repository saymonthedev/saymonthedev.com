import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { localePaths, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const absolute = (path: string) => new URL(path, siteUrl).toString();

/** Data do último commit. Sem git, o campo fica de fora (nunca uma data inventada). */
function lastCommitDate() {
  try {
    return execSync("git log -1 --format=%cI", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || undefined;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((locale) => [locale, absolute(localePaths[locale])]));
  const lastModified = lastCommitDate();
  return locales.map((locale) => ({
    url: absolute(localePaths[locale]),
    ...(lastModified && { lastModified }),
    changeFrequency: "monthly",
    priority: locale === "pt-BR" ? 1 : 0.9,
    alternates: { languages },
  }));
}
