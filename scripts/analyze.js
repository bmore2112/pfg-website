import sharp from 'sharp';
const img = sharp('assets/logo-full.png');
const { width, height } = await img.metadata();
const { data, info } = await sharp('assets/logo-full.png').greyscale().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, ch = info.channels;
const rowBright = [];
for (let y = 0; y < H; y++) {
  let c = 0;
  for (let x = 0; x < W; x++) {
    const v = data[(y*W + x)*ch];
    if (v > 40) c++;
  }
  rowBright.push(c);
}
// find content bands (rows with >1% width bright)
const thr = W * 0.01;
const bands = [];
let start = -1;
for (let y = 0; y < H; y++) {
  if (rowBright[y] > thr && start < 0) start = y;
  else if (rowBright[y] <= thr && start >= 0) { bands.push([start, y-1]); start = -1; }
}
if (start >= 0) bands.push([start, H-1]);
console.log('image', W, 'x', H);
console.log('content bands (top,bottom,height):');
bands.forEach(b => console.log('  ', b[0], b[1], 'h='+(b[1]-b[0]+1)));
