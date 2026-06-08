import sharp from 'sharp';
const SRC = 'assets/onlyfans-src.png';
const { width:W, height:H } = await sharp(SRC).metadata();
// find bounding box of the dark circle (brightness < 90), robust via row/col counts
const g = await sharp(SRC).removeAlpha().greyscale().raw().toBuffer();
const rc = new Array(H).fill(0), cc = new Array(W).fill(0);
for (let y=0;y<H;y++) for (let x=0;x<W;x++){ if (g[y*W+x] < 90){ rc[y]++; cc[x]++; } }
const minR = Math.max(3, Math.round(W*0.02)), minC = Math.max(3, Math.round(H*0.02));
let x0=W,x1=0,y0=H,y1=0;
for (let y=0;y<H;y++) if (rc[y]>=minC){ if(y<y0)y0=y; if(y>y1)y1=y; }
for (let x=0;x<W;x++) if (cc[x]>=minR){ if(x<x0)x0=x; if(x>x1)x1=x; }
// square box centered on the circle
const cx=(x0+x1)/2, cy=(y0+y1)/2;
const side=Math.max(x1-x0, y1-y0)+2;
let left=Math.round(cx-side/2), top=Math.round(cy-side/2);
left=Math.max(0,left); top=Math.max(0,top);
const sz=Math.min(side, W-left, H-top);
console.log('circle bbox', x0,y0,x1,y1,'-> crop', left,top,sz);
const square = await sharp(SRC).extract({left,top,width:sz,height:sz}).png().toBuffer();
// circular alpha mask, slightly inset to drop the gray rim/shadow
const r = Math.round(sz/2)-2;
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="#fff"/></svg>`);
const circ = await sharp(square).composite([{input:mask, blend:'dest-in'}]).png().toBuffer();
await sharp(circ).resize({width:512,height:512}).png().toFile('public/assets/onlyfans.png');
await sharp(circ).resize({width:256,height:256}).webp({quality:92,alphaQuality:100}).toFile('public/assets/onlyfans.webp');
// proof on checkerboard
const ck=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><pattern id="c" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#dcdcdc"/><rect width="20" height="20" fill="#9a9a9a"/><rect x="20" y="20" width="20" height="20" fill="#9a9a9a"/></pattern></defs><rect width="100%" height="100%" fill="url(#c)"/></svg>`);
await sharp(ck).composite([{input:await sharp(circ).resize({width:512,height:512}).png().toBuffer()}]).png().toFile('proof-of.png');
console.log('onlyfans logo written');
