#!/usr/bin/env node
/* Draws the Đông Sơn bronze-drum face used by the "dongson" storefront theme:
   a 14-ray star, tangent-circle rings, ladder and sawtooth bands, and a ring of
   flying Lạc birds. Writes lazadee/assets/dongson-drum.svg.

     node tools/dongson-drum.mjs [colour]      default colour #C98A2B */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ink = process.argv[2] || '#C98A2B';
const C = 300;
const f = (n) => +n.toFixed(2);
const pt = (r, deg) => { const a = (deg * Math.PI) / 180; return [f(C + r * Math.cos(a)), f(C + r * Math.sin(a))]; };
const out = [];
const ring = (r, w = 1.6) => out.push(`<circle cx="${C}" cy="${C}" r="${r}" stroke-width="${w}"/>`);

// Centre: the 14-ray star, a feather mark between each pair of rays.
const star = [];
for (let i = 0; i < 28; i++) star.push(pt(i % 2 ? 19 : 74, -90 + i * (360 / 28)).join(' '));
out.push(`<path d="M${star.join(' L')}Z" fill="${ink}" stroke="none"/>`);
for (let i = 0; i < 14; i++) {
  const a = -90 + (i + 0.5) * (360 / 14);
  const [x1, y1] = pt(34, a), [x2, y2] = pt(58, a - 4), [x3, y3] = pt(58, a + 4);
  out.push(`<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}Z" stroke-width="1.2"/>`);
}
ring(78); ring(83);

// Tangent circles, each with a centre dot, joined by tangent strokes.
const tangents = (R, n, r) => {
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n, [x, y] = pt(R, a);
    out.push(`<circle cx="${x}" cy="${y}" r="${r}" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="${f(r / 3.5)}" fill="${ink}" stroke="none"/>`);
    const [ax, ay] = pt(R + r, a), [bx, by] = pt(R - r, a + 360 / n);
    out.push(`<path d="M${ax} ${ay} L${bx} ${by}" stroke-width="1.1"/>`);
  }
};
tangents(95, 24, 8);
ring(107); ring(111);

// Ladder band: short parallel strokes across the ring.
const ladder = (r1, r2, n) => { for (let i = 0; i < n; i++) { const a = (i * 360) / n; out.push(`<path d="M${pt(r1, a).join(' ')} L${pt(r2, a).join(' ')}" stroke-width="1.2"/>`); } };
ladder(111, 121, 120);
ring(121); ring(125);

// Sawtooth band: filled teeth pointing outward.
const saw = (r1, r2, n) => {
  const d = [];
  for (let i = 0; i < n; i++) { const a = (i * 360) / n, b = ((i + 0.5) * 360) / n, c = ((i + 1) * 360) / n; d.push(`M${pt(r1, a).join(' ')} L${pt(r2, b).join(' ')} L${pt(r1, c).join(' ')}Z`); }
  out.push(`<path d="${d.join(' ')}" fill="${ink}" stroke="none"/>`);
};
saw(125, 136, 64);
ring(140);
tangents(170, 32, 13);
ring(198); ring(202);
saw(202, 213, 96);
ring(217); ring(221);

// Lạc birds flying anticlockwise: long beak ahead, crest, raised wings, split tail.
const bird = 'M-24 2C-12-1 4-3 12-3L38-5L13 0C4 4-12 5-24 2Z M12-3L6-15L10-14L15-4Z M3-2L-13-15L-9-15L-21-23L-13-22L-24-29L-6-3Z M-24 2L-37-9L-31 2L-37 13Z';
for (let i = 0; i < 14; i++) {
  const a = (i * 360) / 14, [x, y] = pt(246, a);
  out.push(`<path d="${bird}" transform="translate(${x} ${y}) rotate(${f(a + 90)}) scale(1.15)" fill="${ink}" stroke="none"/>`);
}
ring(278); ring(282);
ladder(282, 291, 180);
ring(291); ring(296, 2.2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none" stroke="${ink}">\n${out.join('\n')}\n</svg>\n`;
const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'lazadee/assets/dongson-drum.svg');
writeFileSync(file, svg);
console.log('wrote', file, svg.length, 'bytes');
