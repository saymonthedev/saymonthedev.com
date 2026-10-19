import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Itálico serifado dos destaques ("soluções digitais.") e do nome. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const fontVariables = [geistSans.variable, geistMono.variable, instrumentSerif.variable].join(" ");
