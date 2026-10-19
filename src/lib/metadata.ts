import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { localePaths, locales, ogLocales, type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { ogSize } from "./og-size";
import { siteUrl } from "./site-url";

export function buildMetadata(locale: Locale): Metadata {
  const { meta } = dictionaries[locale];
  const path = localePaths[locale];
  const image = {
    url: locale === "en" ? "/en/og.png" : "/og.png",
    width: ogSize.width,
    height: ogSize.height,
    alt: meta.ogAlt,
    type: "image/png",
  };

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.github.url }],
    creator: site.name,
    alternates: {
      canonical: path,
      languages: {
        "pt-BR": localePaths["pt-BR"],
        en: localePaths.en,
        "x-default": localePaths["pt-BR"],
      },
    },
    openGraph: {
      type: "profile",
      firstName: "Saymon",
      lastName: "Oliveira de Castro",
      url: path,
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => ogLocales[other]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#05070B",
  colorScheme: "dark",
};
