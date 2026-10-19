import photo from "@/assets/images/saymon.jpg";
import { site } from "@/config/site";
import { localePaths, type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { techCategories } from "@/data/technologies";
import { siteUrl } from "./site-url";

/** Dados estruturados (schema.org) da página de cada idioma. */
export function buildJsonLd(locale: Locale) {
  const dict = dictionaries[locale];
  const url = new URL(localePaths[locale], siteUrl).toString();
  const personId = `${siteUrl}/#person`;

  const knowsAbout = techCategories.flatMap((category) =>
    category.items.map((item) => (item.kind === "brand" ? item.name : dict.stack.items[item.id])),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        givenName: "Saymon",
        familyName: "Oliveira de Castro",
        jobTitle: dict.footer.role,
        url,
        image: new URL(photo.src, siteUrl).toString(),
        email: `mailto:${site.email}`,
        telephone: `+${site.whatsapp.number}`,
        sameAs: [site.github.url, site.linkedin.url],
        knowsAbout,
        knowsLanguage: ["pt-BR", "en"],
        award: dict.about.award.schema,
        address: { "@type": "PostalAddress", addressCountry: "BR" },
        makesOffer: dict.services.items.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service.title, description: service.description },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url,
        name: site.name,
        inLanguage: locale,
        author: { "@id": personId },
      },
    ],
  };
}

/** Serializa para <script type="application/ld+json"> sem permitir fechar a tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
