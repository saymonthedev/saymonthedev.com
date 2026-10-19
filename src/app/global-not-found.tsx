import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Monogram } from "@/components/ui/Monogram";
import { fontVariables } from "@/config/fonts";

export const metadata: Metadata = {
  title: "404 — Página não encontrada · Page not found",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="grain">
        <main className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
          <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10 opacity-70" />
          <div
            aria-hidden="true"
            className="absolute top-[-20rem] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.35),transparent)]"
          />
          <Monogram className="size-14" />
          <p className="mt-10 font-mono text-sm tracking-[0.3em] text-accent-200">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mt-2 font-serif text-3xl text-muted italic sm:text-4xl" lang="en">
            Page not found
          </p>
          <p className="mt-6 max-w-md text-muted">
            O endereço que você acessou não existe ou foi movido.
            <span className="mt-1 block text-subtle" lang="en">
              The address you tried doesn&apos;t exist or has moved.
            </span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Voltar ao início
            </Link>
            <Link href="/en" className="btn btn-ghost" lang="en">
              Go to the English site
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
