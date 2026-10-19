import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { monogramSvg } from "./monogram-svg";
import { ogSize } from "./og-size";


const assets = join(process.cwd(), "src/assets");

const load = (path: string) => readFile(join(assets, path));

const toArrayBuffer = (data: Buffer) =>
  data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;

function loadAssets() {
  return Promise.all([
    load("fonts/geist-sans-latin-400-normal.woff"),
    load("fonts/geist-sans-latin-600-normal.woff"),
    load("fonts/geist-mono-latin-500-normal.woff"),
    load("fonts/instrument-serif-latin-400-italic.woff"),
    load("images/saymon.jpg"),
  ]);
}

/** Imagem de compartilhamento (Open Graph / Twitter), gerada no build. */
export async function renderOgImage(locale: Locale) {
  const dict = dictionaries[locale];
  const [sans, sansSemibold, mono, serifItalic, photo] = await loadAssets();

  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(monogramSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#05070B",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(37,99,235,0.45), rgba(5,7,11,0) 55%), radial-gradient(circle at 0% 100%, rgba(15,23,42,1), rgba(5,7,11,0) 60%)",
          color: "#F8FAFC",
          fontFamily: "Geist",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={markSrc} width={56} height={56} alt="" />
            <div
              style={{
                display: "flex",
                fontFamily: "Geist Mono",
                fontSize: 18,
                letterSpacing: 4,
                color: "#93C5FD",
                textTransform: "uppercase",
              }}
            >
              {dict.footer.role}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
            <div style={{ fontSize: 34, color: "#CBD5E1", fontWeight: 400 }}>Saymon Oliveira de Castro</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 18,
                fontSize: 62,
                fontWeight: 600,
                lineHeight: 1.02,
                letterSpacing: -3,
              }}
            >
              <span>{dict.hero.headline}</span>
              <span
                style={{
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 76,
                  letterSpacing: -1,
                  color: "#93C5FD",
                }}
              >
                {dict.hero.headlineAccent}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: "auto",
              fontFamily: "Geist Mono",
              fontSize: 17,
              color: "#94A3B8",
            }}
          >
            {dict.meta.ogTags.map((service, index) => (
              <span key={service} style={{ display: "flex", gap: 14 }}>
                {index > 0 && <span style={{ color: "#334155" }}>/</span>}
                {service}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            marginLeft: 48,
            padding: 12,
            borderRadius: 32,
            border: "1px solid rgba(148,163,184,0.22)",
            backgroundColor: "#080B12",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} width={300} height={300} alt="" style={{ borderRadius: 22, objectFit: "cover" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 6px 4px", fontSize: 18 }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: "#34D399" }} />
            <span style={{ color: "#CBD5E1" }}>{dict.hero.availability}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: toArrayBuffer(sans), weight: 400, style: "normal" },
        { name: "Geist", data: toArrayBuffer(sansSemibold), weight: 600, style: "normal" },
        { name: "Geist Mono", data: toArrayBuffer(mono), weight: 500, style: "normal" },
        { name: "Instrument Serif", data: toArrayBuffer(serifItalic), weight: 400, style: "italic" },
      ],
    },
  );
}
