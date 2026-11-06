#!/usr/bin/env node
/* Paints the Đông Sơn drum face (tools/Trống_đồng_Đông_Sơn.svg, black line art) in drum
   gold for the "dongson" storefront theme: drops the Inkscape metadata and the white
   backing disc, fills every shape with one gold, and rounds coordinates to keep it light.
   Writes genie/assets/dongson-drum.svg.

     node tools/dongson-paint.mjs [colour]      default colour #E6A04B */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gold = process.argv[2] || '#E6A04B';
let svg = readFileSync(join(root, 'tools/Trống_đồng_Đông_Sơn.svg'), 'utf8');

svg = svg
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace(/<!--[\s\S]*?-->\s*/g, '')
  .replace(/<sodipodi:namedview[\s\S]*?\/>\s*/, '')
  .replace(/<metadata[\s\S]*?<\/metadata>\s*/, '')
  .replace(/<defs[^>]*\/>\s*/, '')
  .replace(/<circle[^>]*fill:#ffffff[^>]*\/>\s*/, '')
  .replace(/\s(?:inkscape|sodipodi):[a-z-]+="[^"]*"/g, '')
  .replace(/\sxmlns:(?:dc|cc|rdf|svg|sodipodi|inkscape)="[^"]*"/g, '')
  .replace(/\sid="[^"]*"/g, '')
  .replace(/\swidth="200mm"\s+height="200mm"/, '')
  .replace(/<svg\b/, `<svg fill="${gold}"`)
  // Path data keeps one decimal (under 0.05px at the drawn scale); transforms stay exact.
  .replace(/\sd="([^"]*)"/g, (m, d) => ' d="' + d.replace(/-?\d+\.\d+/g, (n) => String(+(+n).toFixed(1))) + '"')
  .replace(/\n\s*/g, ' ');

const out = join(root, 'genie/assets/dongson-drum.svg');
writeFileSync(out, svg.trim() + '\n');
console.log('wrote', out, Math.round(svg.length / 1024) + ' KB');
