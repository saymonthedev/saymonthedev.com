import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata, viewport as siteViewport } from "@/lib/metadata";

export const viewport = siteViewport;
export const metadata = buildMetadata("pt-BR");

export default function PortugueseLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="pt-BR">{children}</RootDocument>;
}
