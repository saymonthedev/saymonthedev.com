import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata, viewport as siteViewport } from "@/lib/metadata";

export const viewport = siteViewport;
export const metadata = buildMetadata("en");

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
