import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { dictionaries } from "@/i18n/dictionaries";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${dictionaries["pt-BR"].footer.role}`,
    short_name: site.shortName,
    description: dictionaries["pt-BR"].meta.description,
    lang: "pt-BR",
    start_url: "/",
    display: "browser",
    background_color: "#05070B",
    theme_color: "#05070B",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
