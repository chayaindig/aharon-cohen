// Builds src/logo.svg from the Magnific vector trace: background removed, light counters set to the page colour.
// node scripts/logo-assets.mjs <traced.svg>
import fs from 'node:fs';

const [traced] = process.argv.slice(2);

let s = fs.readFileSync(traced, 'utf8');
s = s.replace(/<path[^>]*d="M 0 0 L 2048 0 L 2048 1325 L 0 1325 L 0 0 z"\s*\/>\s*/, '');
s = s.replace(/fill="rgb\((2[3-5]\d),\s*(2[3-5]\d),\s*(2[3-5]\d)\)"/g, 'fill="var(--logo-hole, #fbf8f1)"');
s = s.replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1325">');
s = s.replace(/ transform="translate\(0,0\)"/g, '');
fs.writeFileSync('src/logo.svg', s.trim());
console.log('logo.svg', s.length);
