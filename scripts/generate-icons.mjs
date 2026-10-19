// Gera favicon.ico, icon.svg e apple-icon.png a partir do monograma.
// Uso: npm run icons
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = await import(new URL("../src/lib/monogram-svg.ts", import.meta.url).href).catch(() => null);
const svg = source?.monogramSvg;
if (!svg) {
  console.error("Não foi possível ler src/lib/monogram-svg.ts (use Node 22.6+).");
  process.exit(1);
}

const png = (size, svgText = svg) =>
  sharp(Buffer.from(svgText), { density: 600 }).resize(size, size).png().toBuffer();

// favicon.ico com imagens PNG de 16, 32 e 48 px.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => png(size)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((image, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[index], 0);
  entry.writeUInt8(sizes[index], 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += image.length;
  return entry;
});
await writeFile(`${root}src/app/favicon.ico`, Buffer.concat([header, ...entries, ...images]));

await writeFile(`${root}src/app/icon.svg`, svg);

// Ícone da Apple: sem cantos arredondados (o iOS aplica a máscara).
const appleSvg = svg.replace(/<rect[^>]*\/>/, '<rect width="64" height="64" fill="url(#bg)"/>');
await writeFile(`${root}src/app/apple-icon.png`, await png(180, appleSvg));

// Ícones do manifesto (PWA / Android).
await writeFile(`${root}public/icon-192.png`, await png(192, appleSvg));
await writeFile(`${root}public/icon-512.png`, await png(512, appleSvg));

console.log("Ícones gerados.");
