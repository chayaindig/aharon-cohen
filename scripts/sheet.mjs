// Contact sheet of icon previews: node scripts/sheet.mjs <dir> <id> <id> ...
import sharp from 'sharp';
const [dir, ...ids] = process.argv.slice(2);
const cell = 150;
const cols = 6;
const rows = Math.ceil(ids.length / cols);
const comps = ids.map((id, k) => ({ input: `${dir}/${id}.png`, left: (k % cols) * cell + 11, top: Math.floor(k / cols) * 170 + 11 }));
const labels = ids.map((id, k) => `<text x="${(k % cols) * cell + 75}" y="${Math.floor(k / cols) * 170 + 160}" font-size="14" text-anchor="middle">${id}</text>`).join('');
await sharp({ create: { width: cols * cell, height: rows * 170, channels: 3, background: '#fff' } })
  .composite([...comps, { input: Buffer.from(`<svg width="${cols * cell}" height="${rows * 170}">${labels}</svg>`), left: 0, top: 0 }])
  .png()
  .toFile(`${dir}/sheet.png`);
