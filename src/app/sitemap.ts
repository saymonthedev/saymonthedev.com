import type { MetadataRoute } from "next";
import { localePaths, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const absolute = (path: string) => new URL(path, siteUrl).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((locale) => [locale, absolute(localePaths[locale])]));
  return locales.map((locale) => ({
    url: absolute(localePaths[locale]),
    changeFrequency: "monthly",
    priority: locale === "pt-BR" ? 1 : 0.9,
    alternates: { languages },
  }));
}
