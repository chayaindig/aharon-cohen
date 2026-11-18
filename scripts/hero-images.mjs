// Photo + blueprint of the same building, same size, WebP. node scripts/hero-images.mjs photo.png blueprint.png
import sharp from 'sharp';
const [photo, plan] = process.argv.slice(2);
const W = 1200;
const meta = await sharp(photo).metadata();
const H = Math.round((W * meta.height) / meta.width);
for (const [src, name] of [[photo, 'building'], [plan, 'building-plan']]) {
  for (const w of [W, 720]) {
    const h = Math.round((w * H) / W);
    const info = await sharp(src).resize(w, h, { fit: 'cover' }).webp({ quality: name === 'building' ? 80 : 84 }).toFile(`public/img/${name}${w === W ? '' : '-sm'}.webp`);
    console.log(name, w, h, info.size);
  }
}
