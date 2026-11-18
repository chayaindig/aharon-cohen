// Cleans Magnific-generated SVGs: drops the white background shapes, turns colours into currentColor,
// and crops the viewBox to the drawing. Usage: node scripts/clean-generated-svg.mjs in.svg out.svg
import fs from 'node:fs';
import sharp from 'sharp';

const [inp, out] = process.argv.slice(2);
let s = fs.readFileSync(inp, 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/g, '');

const isLight = (c) => {
  const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) return +m[1] > 200 && +m[2] > 200 && +m[3] > 200;
  return /^#(f{3}|f{6}|fefefe|fdfdfd)$/i.test(c) || c === 'white';
};
s = s.replace(/<path[^>]*fill="([^"]*)"[^>]*>(<\/path>)?/g, (tag, fill) => (/d="M 0 0 L 2048 0 L 2048 2048 L 0 2048/.test(tag)
    ? ''
    : tag.replace(/fill="[^"]*"/, isLight(fill) ? 'fill="var(--icon-hole, #fbf8f1)"' : 'fill="currentColor"')));

// Crop to the drawn area using a raster pass
const { data, info } = await sharp(Buffer.from(s.replace(/currentColor/g, '#000'))).flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
let [x0, y0, x1, y1] = [info.width, info.height, 0, 0];
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[y * info.width + x] < 200) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
const vb = s.match(/viewBox="([^"]*)"/)[1].split(/\s+/).map(Number);
const k = vb[2] / info.width;
const pad = 0.04 * Math.max(x1 - x0, y1 - y0);
const side = Math.max(x1 - x0, y1 - y0) + pad * 2;
const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
const nvb = [(cx - side / 2) * k, (cy - side / 2) * k, side * k, side * k].map((n) => n.toFixed(1)).join(' ');
s = s.replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${nvb}" fill="currentColor" aria-hidden="true">`);
fs.writeFileSync(out, s.trim());
console.log(out, nvb);
