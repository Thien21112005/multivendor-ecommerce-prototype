#!/usr/bin/env node
/* Draws the silk lanterns of the "hoian" storefront theme: a wire strung across, five
   lanterns hanging at different drops, each with ribs, caps and a tassel, swaying out of
   step. Writes genie/assets/hoian-lanterns.svg.

     node tools/hoian-lanterns.mjs */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 520, H = 300, WOOD = '#5A3A26';
const wireY = (x) => { const t = x / W; return 20 + 100 * t * (1 - t); };
const LANTERNS = [
  { x: 70, drop: 34, colour: '#C8323C', size: 1 },
  { x: 165, drop: 82, colour: '#F2B13E', size: 0.86 },
  { x: 262, drop: 46, colour: '#B8326E', size: 1.08 },
  { x: 358, drop: 96, colour: '#2C6E68', size: 0.9 },
  { x: 452, drop: 40, colour: '#C8323C', size: 0.96 },
];
const f = (n) => +n.toFixed(1);
const parts = [`<path d="M0 20Q${W / 2} 120 ${W} 20" stroke="${WOOD}" stroke-width="2"/>`];
LANTERNS.forEach((l, i) => {
  const top = wireY(l.x), cy = top + l.drop + 46 * l.size, rx = 30 * l.size, ry = 38 * l.size;
  const capW = 24 * l.size, capH = 8 * l.size;
  const ribs = [-0.55, 0, 0.55].map((k) => `<path d="M${f(l.x + k * rx * 0.4)} ${f(cy - ry + 2)}Q${f(l.x + k * rx * 1.45)} ${f(cy)} ${f(l.x + k * rx * 0.4)} ${f(cy + ry - 2)}" stroke="#000" stroke-opacity=".18" stroke-width="1.6"/>`).join('');
  parts.push(`<g class="l" style="transform-origin:${l.x}px ${f(top)}px;animation-delay:-${(i * 0.7).toFixed(1)}s;animation-duration:${(3.4 + (i % 3) * 0.6).toFixed(1)}s">
  <path d="M${l.x} ${f(top)}V${f(cy - ry - capH)}" stroke="${WOOD}" stroke-width="1.5"/>
  <rect x="${f(l.x - capW / 2)}" y="${f(cy - ry - capH)}" width="${f(capW)}" height="${f(capH)}" rx="2" fill="${WOOD}"/>
  <ellipse cx="${l.x}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${l.colour}"/>
  ${ribs}
  <ellipse cx="${f(l.x - rx * 0.35)}" cy="${f(cy - ry * 0.3)}" rx="${f(rx * 0.16)}" ry="${f(ry * 0.4)}" fill="#fff" fill-opacity=".22"/>
  <rect x="${f(l.x - capW / 2)}" y="${f(cy + ry)}" width="${f(capW)}" height="${f(capH)}" rx="2" fill="${WOOD}"/>
  <path d="M${l.x} ${f(cy + ry + capH)}v${f(26 * l.size)}" stroke="${l.colour}" stroke-width="3" stroke-linecap="round"/>
  <path d="M${f(l.x - 4)} ${f(cy + ry + capH + 18 * l.size)}h8" stroke="${WOOD}" stroke-width="2"/>
</g>`);
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none">
<style>
  .l { animation: sway 3.8s ease-in-out infinite alternate; }
  @keyframes sway { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
  @media (prefers-reduced-motion: reduce) { .l { animation: none; } }
</style>
${parts.join('\n')}
</svg>
`;
const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'genie/assets/hoian-lanterns.svg');
writeFileSync(file, svg);
console.log('wrote', file);
