/**
 * Endereço público do site, usado em canonical, Open Graph, sitemap e JSON-LD.
 * Para publicar em outro domínio, defina NEXT_PUBLIC_SITE_URL no build.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://saymonthedev.com").replace(/\/+$/, "");
