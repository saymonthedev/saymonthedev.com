// Gera as variantes responsivas das imagens depois do `next build`.
// Para cada imagem em out/_next/static/media cria <nome>.w<largura>.webp em
// todas as larguras de image-sizes.json (sem ampliar além do original).
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import config from "../image-sizes.json" with { type: "json" };

const root = fileURLToPath(new URL("..", import.meta.url));
const mediaDir = join(root, "out/_next/static/media");
const widths = [...config.imageSizes, ...config.deviceSizes];
// Ícones do app (favicon, apple-icon) não passam pelo next/image.
const isSource = (file) =>
  /\.(png|jpe?g|webp|avif)$/i.test(file) && !/\.w\d+\.webp$/.test(file) && !/^(apple-icon|icon|favicon)\./.test(file);

const files = (await readdir(mediaDir).catch(() => [])).filter(isSource);
if (files.length === 0) {
  console.log("optimize-images: nenhuma imagem em out/_next/static/media.");
  process.exit(0);
}

let created = 0;
for (const file of files) {
  const input = join(mediaDir, file);
  const { width: original = 0 } = await sharp(input).metadata();
  const base = file.replace(/\.[a-z0-9]+$/i, "");

  for (const width of widths) {
    const output = join(mediaDir, `${base}.w${width}.webp`);
    if (await stat(output).catch(() => null)) continue;
    await sharp(input)
      .resize({ width: Math.min(width, original), withoutEnlargement: true })
      .webp({ quality: config.quality, effort: 5 })
      .toFile(output);
    created += 1;
  }
}

console.log(`optimize-images: ${created} variantes geradas para ${files.length} imagens.`);
