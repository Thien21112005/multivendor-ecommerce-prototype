#!/usr/bin/env node
/* Renames the brand across every UI file. window.LazadeeDesignSystem_* and
   lz_* storage keys are internal and stay as they are.

     node tools/rebrand.mjs Trao "Tên Mới"          rename the current brand
     node tools/rebrand.mjs Trao "Tên Mới" --dry    list the changes without writing

   Pass "--code XX" to change the order code prefix too (TR-20260608-... becomes XX-20260608-...). */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const codeAt = args.indexOf('--code');
const code = codeAt >= 0 ? args[codeAt + 1] : null;
const [from, to] = args.filter((a, i) => !a.startsWith('--') && i !== codeAt + 1 || codeAt < 0 && !a.startsWith('--'));
if (!from || !to) { console.error('Usage: node tools/rebrand.mjs <from> <to> [--code XX] [--dry]'); process.exit(1); }

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXT = new Set(['.jsx', '.js', '.html', '.css']);
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? (n === 'assets' ? [] : walk(p)) : EXT.has(extname(p)) ? [p] : [];
});

const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
const slug = ascii(to).toLowerCase().replace(/[^a-z0-9]+/g, '');
const fromSlug = ascii(from).toLowerCase();
// "Trao đổi", "trao trả" and similar are ordinary Vietnamese words, not the brand.
const notWord = '(?! (?:đổi|trả|tặng|quyền|gửi))';

const rules = [
  [new RegExp(`\\b${from}\\b${notWord}(?!DesignSystem)`, 'g'), to],
  [new RegExp(`\\b${from.toUpperCase()}\\b(?! (?:ĐỔI|TRẢ))`, 'g'), ascii(to).toUpperCase()],
  [new RegExp(`\\b${from.toUpperCase()}(?=\\d)`, 'g'), slug.toUpperCase()],
  [new RegExp(`\\b${fromSlug}\\.example\\b`, 'g'), `${slug}.example`],
  [new RegExp(`\\b${fromSlug}\\\\\\.example\\b`, 'g'), `${slug}\\.example`],
  [new RegExp(`(>|')${fromSlug}(<|')(?!\\s*\\?)`, 'g'), `$1${slug}$2`],
];
if (code) rules.push([/\bTR(?=-\d|-INV|RF\b)/g, code]);

let total = 0;
for (const file of [join(root, 'index.html'), join(root, 'genie/assets/logomark.svg'), ...walk(join(root, 'genie'))]) {
  const src = readFileSync(file, 'utf8');
  let out = src, hits = 0;
  for (const [re, val] of rules) out = out.replace(re, (...m) => { hits++; return typeof val === 'string' ? val.replace(/\$(\d)/g, (_, n) => m[n]) : val; });
  if (hits) { total += hits; console.log(String(hits).padStart(4), file.slice(root.length + 1)); if (!dry) writeFileSync(file, out); }
}
console.log(dry ? `${total} changes (dry run)` : `${total} changes written`);
