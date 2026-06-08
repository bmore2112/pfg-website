import sharp from 'sharp';
import { mkdirSync } from 'fs';
mkdirSync('public/assets', { recursive: true });

// 1) LOGO — make black transparent via brightness-as-alpha (keeps the neon glow),
//    then crop to a tight bounding box computed from the alpha mask itself.
const base = sharp('assets/logo-src.png').flatten({ background: '#000000' });
const { width: sw, height: sh } = await base.clone().metadata();
const srgb = await base.clone().removeAlpha().raw().toBuffer();              // sw*sh*3
const salpha = await base.clone().removeAlpha().greyscale().linear(1.9, -14)
  .toColourspace('b-w').raw().toBuffer();                                    // sw*sh*1

// bounding box from row/column histograms (robust to stray edge pixels):
// a row/col counts as "content" only if enough fairly-bright pixels sit in it.
const TH = 60;                       // brightness/alpha considered real ink
const rowCnt = new Array(sh).fill(0);
const colCnt = new Array(sw).fill(0);
for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
  if (salpha[y*sw + x] > TH) { rowCnt[y]++; colCnt[x]++; }
}
const minRow = Math.max(4, Math.round(sw * 0.004));
const minCol = Math.max(4, Math.round(sh * 0.004));
let minX = sw, minY = sh, maxX = 0, maxY = 0;
for (let y = 0; y < sh; y++) if (rowCnt[y] >= minRow) { if (y < minY) minY = y; if (y > maxY) maxY = y; }
for (let x = 0; x < sw; x++) if (colCnt[x] >= minCol) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
const pad = 16;
minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
maxX = Math.min(sw - 1, maxX + pad); maxY = Math.min(sh - 1, maxY + pad);
const lw = maxX - minX + 1, lh = maxY - minY + 1;
console.log('logo bbox ->', lw, 'x', lh, '(from', sw, 'x', sh + ')');

const lout = Buffer.alloc(lw * lh * 4);
for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
  const si = (y + minY) * sw + (x + minX);
  const di = (y * lw + x) * 4;
  lout[di] = srgb[si*3]; lout[di+1] = srgb[si*3+1]; lout[di+2] = srgb[si*3+2]; lout[di+3] = salpha[si];
}
const logo = () => sharp(lout, { raw: { width: lw, height: lh, channels: 4 } });
await logo().png().toFile('public/assets/logo.png');
await logo().resize({ width: 900 }).webp({ quality: 92, alphaQuality: 100 }).toFile('public/assets/logo.webp');
await logo().resize({ width: 512, height: 512, fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toFile('public/assets/logo-512.png');

// transparency proof on a checkerboard
const checker = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${lw}" height="${lh}"><defs><pattern id="c" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#e2e2e2"/><rect width="18" height="18" fill="#9a9a9a"/><rect x="18" y="18" width="18" height="18" fill="#9a9a9a"/></pattern></defs><rect width="100%" height="100%" fill="url(#c)"/></svg>`);
await sharp(checker).composite([{ input: await logo().png().toBuffer() }]).png().toFile('proof-checker.png');
const pm = await sharp('public/assets/logo.png').metadata();
console.log('logo.png ->', pm.width, 'x', pm.height, 'channels', pm.channels, 'hasAlpha', pm.hasAlpha);

// 2) HERO — Vice City photo, optimized + responsive widths
for (const w of [2192, 1600, 1080, 768]) {
  await sharp('assets/hero-miami-skyline.png').resize({ width: w }).webp({ quality: 82 }).toFile(`public/assets/hero-${w}.webp`);
}
await sharp('assets/hero-miami-skyline.png').resize({ width: 1600 }).jpeg({ quality: 84 }).toFile('public/assets/hero-1600.jpg');
await sharp('assets/hero-miami-skyline.png').resize({ width: 1200, height: 630, fit: 'cover', position: 'center' }).jpeg({ quality: 86 }).toFile('public/assets/og.jpg');
console.log('hero + og done');
