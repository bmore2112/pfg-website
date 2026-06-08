import sharp from 'sharp';
const SRC = 'assets/miami-vice.png';
const { width: W, height: H } = await sharp(SRC).metadata();
const fr = (xf, yf) => ({ x: Math.round(xf[0]*W), y: Math.round(yf[0]*H), w: Math.round((xf[1]-xf[0])*W), h: Math.round((yf[1]-yf[0])*H) });

const jobs = [
  { name:'logo',    dst: fr([0.385,0.615],[0.27,0.635]), srcDX:-0.215, edges:{l:1,r:1,t:1,b:1} },
  { name:'caption', dst: fr([0.73,1.00],[0.56,0.70]),    srcDX:-0.26,  edges:{l:1,r:0,t:1,b:1} },
  { name:'arrow',   dst: fr([0.0,0.07],[0.81,0.95]),     srcDX:+0.08,  edges:{l:0,r:1,t:1,b:1} },
];

const feather = async (buf, w, h, f, e) => {
  const top=e.t?f:0, bottom=e.b?f:0, left=e.l?f:0, right=e.r?f:0;
  const mask = await sharp({ create:{ width:w-left-right, height:h-top-bottom, channels:4, background:'#fff' }})
    .extend({ top, bottom, left, right, background:{r:0,g:0,b:0,alpha:0} })
    .blur(f*0.55).png().toBuffer();
  return await sharp(buf).ensureAlpha().composite([{ input:mask, blend:'dest-in' }]).png().toBuffer();
};

const overlays = [];
for (const j of jobs) {
  const { x, y, w, h } = j.dst;
  const sx = Math.max(0, Math.min(W-w, Math.round(x + j.srcDX*W)));
  const patch = await sharp(SRC).extract({ left:sx, top:y, width:w, height:h }).png().toBuffer();
  const f = Math.max(10, Math.round(Math.min(w,h)*0.12));
  overlays.push({ input: await feather(patch, w, h, f, j.edges), left:x, top:y });
}
const cleaned = await sharp(SRC).composite(overlays).png().toBuffer();
await sharp(cleaned).toFile('assets/miami-clean.png');
await sharp(cleaned).resize({width:1100}).jpeg().toFile('preview.jpg');
console.log('cleaned + preview written');
