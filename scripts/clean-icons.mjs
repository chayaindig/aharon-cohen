// Strips fixed sizes and colours from Magnific SVGs so they take currentColor
import fs from 'node:fs';
const dir = new URL('../src/icons/', import.meta.url);
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.svg')) continue;
  const p = new URL(f, dir);
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/<\?xml[^>]*>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<svg([^>]*)>/, (_, a) => '<svg' + a.replace(/\s(width|height|id|style|x|y|xml:space|enable-background)="[^"]*"/g, '') + ' aria-hidden="true">');
  s = s.replace(/#0{3,6}\b|#010101/gi, 'currentColor');
  s = s.replace(/fill="(?!none|currentColor)[^"]*"/g, 'fill="currentColor"');
  s = s.replace(/stroke="(?!none|currentColor)[^"]*"/g, 'stroke="currentColor"');
  fs.writeFileSync(p, s.trim());
  console.log(f, s.length);
}
