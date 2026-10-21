import photo from "@/assets/images/saymon.png";
import { site } from "@/config/site";
import { localePaths, locales, type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { techCategories } from "@/data/technologies";
import { siteUrl } from "./site-url";

/**
 * Dados estruturados (schema.org) da página de cada idioma. Pessoa e site
 * são as mesmas entidades nos dois idiomas (mesmo @id e URL); só a
 * ProfilePage muda de endereço.
 */
export function buildJsonLd(locale: Locale) {
  const dict = dictionaries[locale];
  const home = `${siteUrl}/`;
  const pageUrl = new URL(localePaths[locale], siteUrl).toString();
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const photoId = `${siteUrl}/#photo`;
  const jaragua = {
    "@type": "PostalAddress",
    addressLocality: "Jaraguá do Sul",
    addressRegion: "SC",
    addressCountry: "BR",
  };

  const knowsAbout = techCategories.flatMap((category) =>
    category.items.map((item) => (item.kind === "brand" ? item.name : dict.stack.items[item.id])),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        primaryImageOfPage: { "@id": photoId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: site.github.handle,
        givenName: "Saymon",
        familyName: "Oliveira de Castro",
        description: dict.meta.description,
        jobTitle: dict.footer.role,
        url: home,
        image: {
          "@type": "ImageObject",
          "@id": photoId,
          url: new URL(photo.src, siteUrl).toString(),
          width: photo.width,
          height: photo.height,
          caption: dict.hero.card.photoAlt,
        },
        email: `mailto:${site.email}`,
        telephone: `+${site.whatsapp.number}`,
        sameAs: [site.github.url, site.linkedin.url],
        knowsAbout,
        knowsLanguage: ["pt-BR", "en"],
        alumniOf: [
          { "@type": "EducationalOrganization", name: "CentroWEG" },
          { "@type": "EducationalOrganization", name: "SENAI", address: jaragua },
        ],
        award: dict.about.award.schema,
        address: jaragua,
        makesOffer: dict.services.items.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
            provider: { "@id": personId },
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: home,
        name: site.name,
        alternateName: [site.github.handle, "saymonthedev.com"],
        inLanguage: [...locales],
        publisher: { "@id": personId },
      },
    ],
  };
}

/** Serializa para <script type="application/ld+json"> sem permitir fechar a tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
