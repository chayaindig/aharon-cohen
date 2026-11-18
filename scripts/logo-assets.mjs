// Builds two assets from the logo:
//  1. src/logo.svg   - the Magnific vector trace, background removed, white counters set to the page colour
//  2. src/pixelLogo.json - the bar mark sampled into a pixel grid (drawn as SVG rects, no canvas)
// node scripts/logo-assets.mjs <traced.svg> <logo.png>
import fs from 'node:fs';
import sharp from 'sharp';

const [traced, png] = process.argv.slice(2);

let s = fs.readFileSync(traced, 'utf8');
s = s.replace(/<path[^>]*d="M 0 0 L 2048 0 L 2048 1325 L 0 1325 L 0 0 z"\s*\/>\s*/, '');
s = s.replace(/fill="rgb\((2[3-5]\d),\s*(2[3-5]\d),\s*(2[3-5]\d)\)"/g, 'fill="var(--logo-hole, #fbf8f1)"');
s = s.replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1325">');
s = s.replace(/ transform="translate\(0,0\)"/g, '');
fs.writeFileSync('src/logo.svg', s.trim());

// The mark sits at x 670-970, y 25-470 of the 1000x647 logo
const CELL = 9;
const box = { left: 672, top: 28, width: 296, height: 442 };
const cols = Math.floor(box.width / CELL);
const rows = Math.floor(box.height / CELL);
const { data } = await sharp(png).extract(box).resize(cols, rows, { kernel: 'cubic' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const palette = { teal: [25, 135, 150], gold: [194, 159, 94], petrol: [6, 83, 93] };
const cells = [];
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const i = (y * cols + x) * 3;
    const px = [data[i], data[i + 1], data[i + 2]];
    if (px[0] > 225 && px[1] > 220 && px[2] > 210) continue; // background
    let best = 'petrol', bd = Infinity;
    for (const [k, c] of Object.entries(palette)) {
      const d = c.reduce((a, v, j) => a + (v - px[j]) ** 2, 0);
      if (d < bd) { bd = d; best = k; }
    }
    cells.push([x, y, best[0]]);
  }
}
fs.writeFileSync('src/pixelLogo.json', JSON.stringify({ cols, rows, cells }));
console.log('logo.svg', s.length, 'pixels', cells.length, `${cols}x${rows}`);
