// Renders SVG files side by side: node scripts/svgsheet.mjs out.png a.svg b.svg ...
import sharp from 'sharp';
const [out, ...files] = process.argv.slice(2);
const tiles = await Promise.all(files.map(f => sharp(f).resize(300, 300, { fit: 'contain', background: '#fff' }).png().toBuffer()));
await sharp({ create: { width: 320 * tiles.length, height: 320, channels: 3, background: '#fff' } })
  .composite(tiles.map((t, i) => ({ input: t, left: i * 320 + 10, top: 10 }))).png().toFile(out);
