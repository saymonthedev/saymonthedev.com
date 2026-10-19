import type { NextConfig } from "next";
import imageSizes from "./image-sizes.json";

const nextConfig: NextConfig = {
  // Site 100% estático (pasta out/), publicado na Cloudflare. Ver wrangler.jsonc.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // O site tem duas root layouts (pt-BR e en), então a 404 global precisa
    // ser um documento próprio.
    globalNotFound: true,
  },
  env: {
    // Ano do build: usado como valor do servidor no copyright antes de o
    // navegador assumir o ano atual.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  images: {
    // Sem servidor de imagens: as variantes são geradas depois do build por
    // scripts/optimize-images.mjs e o loader aponta para elas.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: imageSizes.deviceSizes,
    imageSizes: imageSizes.imageSizes,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
