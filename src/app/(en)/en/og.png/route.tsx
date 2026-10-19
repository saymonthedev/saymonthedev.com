import { renderOgImage } from "@/lib/og-image";

// Rota com extensão no nome: no export estático vira o arquivo /en/og.png.
export const dynamic = "force-static";

export function GET() {
  return renderOgImage("en");
}
