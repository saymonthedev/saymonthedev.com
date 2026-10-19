/**
 * Logo como SVG puro. Mesmo desenho de `components/ui/Monogram`, usado no
 * favicon, no ícone da Apple e na imagem de compartilhamento.
 */
export const monogramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101A2F"/><stop offset="1" stop-color="#05070B"/></linearGradient>
    <linearGradient id="s" gradientUnits="userSpaceOnUse" x1="26" y1="12" x2="38" y2="52"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#BFDBFE"/></linearGradient>
    <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="37" y1="20" x2="47" y2="12"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#60A5FA"/></linearGradient>
  </defs>
  <rect x="1" y="1" width="62" height="62" rx="16" fill="url(#bg)" stroke="#22304A" stroke-width="2"/>
  <path d="M43 12H29.5A12.5 12 0 0 0 29.5 36H35.5A4 4 0 0 1 35.5 44H20L16 52H35.5A12.5 12 0 0 0 35.5 28H29.5A4 4 0 0 1 29.5 20H39Z" fill="url(#s)"/>
  <path d="M41 12H47L43 20H37Z" fill="url(#a)"/>
</svg>`;
