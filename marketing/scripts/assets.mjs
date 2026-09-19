import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
const original = "src/assets/truva-logo-source.png";
// Exact nontransparent bounds; no recoloring, redrawing, or identity changes.
const mark = sharp(original).extract({
  left: 128,
  top: 116,
  width: 592,
  height: 636,
});
await mark
  .clone()
  .resize({ width: 152 })
  .webp({ quality: 90 })
  .toFile("public/images/truva-mark.webp");
await mark
  .clone()
  .resize({ height: 56 })
  .extend({
    top: 4,
    bottom: 4,
    left: 6,
    right: 6,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png()
  .toFile("public/favicon.png");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="white"/><g font-family="Arial, Helvetica, sans-serif"><text x="70" y="89" font-size="27" font-weight="700" fill="#292929">truva solutions</text><text x="70" y="217" font-size="13" letter-spacing="2" fill="#626262">AI SECURITY · CLOUD SECURITY · COMPLIANCE</text><text x="65" y="315" font-size="70" font-weight="700" letter-spacing="-3" fill="#292929">Startup security.</text><text x="65" y="400" font-size="70" font-weight="700" letter-spacing="-3" fill="#E67438">Confidence to grow.</text><text x="70" y="554" font-size="18" fill="#626262">truvasolutions.com</text></g><path d="M900 540V260a105 105 0 0 1 210 0v280M927 540V260a78 78 0 0 1 156 0v280M954 540V260a51 51 0 0 1 102 0v280" stroke="#E1E1E1" fill="none"/><path d="M930 475v-40c0-45 75-30 75-90v-60m-8 10 8-10 8 10" stroke="#E77539" stroke-width="2" fill="none"/></svg>`;
await writeFile("src/assets/og-home.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/images/og-home.png");
console.log("Generated original-logo WebP, favicon, and 1200×630 OG card.");
