#!/usr/bin/env node
/* Renders the seeded storefront banners from HTML templates with headless Chrome:
   flat colour fields, Be Vietnam Pro type and the product photographs already in
   lazadee/assets/img. Every line of copy matches the mock data (voucher codes,
   conditions, categories), so nothing on a banner promises what the demo lacks.

     node tools/banners.mjs          writes lazadee/assets/img/banners/*.jpg   */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'lazadee/assets/img/banners');
const tmp = join(root, 'tools/.banners-tmp');
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });
const img = (n) => pathToFileURL(join(root, 'lazadee/assets/img', n + '.jpg')).href;
const fonts = pathToFileURL(join(root, 'lazadee/tokens/fonts.css')).href;

// Shapes: main and side slots are 3:1, category strips are 6:1.
const SIZE = { wide: [1500, 500], strip: [1800, 300] };
const BANNERS = [
  { id: 'home-trust', size: 'wide', field: '#0F3D2E', ink: '#F7F3E8', acc: '#F2C14E', head: 'Nhận hàng rồi, tiền mới đến shop', sub: 'Mọi shop đều đã xác minh danh tính', cta: 'Mua sắm ngay', pics: ['headphones', 'sneakers', 'watch'] },
  { id: 'home-tech', size: 'wide', field: '#1E2A44', ink: '#F3F6FB', acc: '#7FD1C7', head: 'Công nghệ chính hãng', sub: 'Mã TECH10 giảm 10% cho đơn từ 500.000₫', cta: 'Xem điện tử', pics: ['laptop', 'camera', 'speaker'] },
  { id: 'home-beauty', size: 'wide', field: '#F3D9CF', ink: '#4A1F2A', acc: '#B8455F', head: 'Làm đẹp mỗi ngày', sub: 'Mỹ phẩm, chăm sóc da và nước hoa chính hãng', cta: 'Xem làm đẹp', pics: ['cosmetics', 'skincare', 'perfume'] },
  { id: 'home-fashion', size: 'wide', field: '#D8E4D0', ink: '#1F2E1C', acc: '#2F5D3A', head: 'Thời trang mới về', sub: 'Mã STYLE20K giảm 20.000₫ cho đơn từ 150.000₫', cta: 'Xem thời trang', pics: ['jacket', 'heels', 'sunglasses'] },
  { id: 'side-freeship', size: 'wide', field: '#F2C14E', ink: '#2A1E05', acc: '#2A1E05', head: 'Freeship<br>đơn từ 99.000₫', sub: 'Lưu mã FREESHIP30', cta: 'Lưu mã', pics: ['backpack'], big: true },
  { id: 'side-seller', size: 'wide', field: '#1F4E5F', ink: '#F4F8F9', acc: '#F2C14E', head: 'Mở shop 0₫<br>trên Genie', sub: 'Xác minh danh tính rồi bán ngay', cta: 'Đăng ký bán', pics: ['mug'], big: true },
  { id: 'mid-home', size: 'wide', field: '#E3EAEE', ink: '#22303A', acc: '#C8702A', head: 'Nhà cửa<br>và đời sống', sub: 'Đèn, ghế, cốc sứ cho góc nhà', cta: 'Xem nhà cửa', pics: ['lamp', 'chair', 'mug'], big: true },
  { id: 'mid-acc', size: 'wide', field: '#2E2A27', ink: '#F4EFE8', acc: '#E9B23C', head: 'Phụ kiện<br>công nghệ', sub: 'Bàn phím, đồng hồ, balo', cta: 'Xem phụ kiện', pics: ['keyboard', 'watch2', 'backpack'], big: true },
  // Category strips spotlight one verified shop; the banner links to that shop.
  { id: 'cat-beauty', size: 'strip', field: '#F3D9CF', ink: '#4A1F2A', acc: '#B8455F', head: 'Beauty Box', sub: 'Shop làm đẹp đã xác minh · 4.9 sao · 203k người theo dõi', pics: ['cosmetics', 'skincare', 'perfume'] },
  { id: 'cat-tech', size: 'strip', field: '#1E2A44', ink: '#F3F6FB', acc: '#7FD1C7', head: 'TechZone Official', sub: 'Shop điện tử đã xác minh · 4.9 sao · 128k người theo dõi', pics: ['headphones', 'laptop', 'camera'] },
  { id: 'cat-fashion', size: 'strip', field: '#D8E4D0', ink: '#1F2E1C', acc: '#2F5D3A', head: 'Boutique Sài Gòn', sub: 'Shop thời trang đã xác minh · 4.8 sao · 67k người theo dõi', pics: ['jacket', 'tshirt', 'sunglasses'] },
  { id: 'cat-home', size: 'strip', field: '#E3EAEE', ink: '#22303A', acc: '#C8702A', head: 'Home & Living', sub: 'Shop nhà cửa đã xác minh · 4.6 sao · 19,8k người theo dõi', pics: ['lamp', 'chair', 'mug'] },
  { id: 'cat-acc', size: 'strip', field: '#2E2A27', ink: '#F4EFE8', acc: '#E9B23C', head: 'TravelGear', sub: 'Shop balo và phụ kiện du lịch đã xác minh · 4.5 sao · 8,4k người theo dõi', pics: ['backpack'] },
  // Flash Sale slot: links to one product.
  { id: 'flash-anc', size: 'strip', field: '#14171F', ink: '#F6F3EC', acc: '#F2C14E', head: 'Tai nghe ANC Pro 5 chỉ 389.000₫', sub: 'Giảm 51% trong Flash Sale hôm nay, còn 5 suất', pics: ['headphones'] },
  // Campaign: the carousel slide and the popup link to /sieu-sale-12-12.
  { id: 'camp-1212', size: 'wide', field: '#B3202E', ink: '#FFF6EC', acc: '#F2C14E', head: 'Siêu sale 12.12', sub: 'Mã SALE1212 giảm 12% cho đơn từ 300.000₫, dùng từ 12/12', cta: 'Xem chiến dịch', pics: ['sneakers', 'perfume', 'speaker'], big: true },
];

const page = (b) => {
  const [W, H] = SIZE[b.size];
  const strip = b.size === 'strip';
  const hs = strip ? 64 : b.big ? 88 : 64;
  const ss = strip ? 30 : b.big ? 36 : 32;
  const tile = Math.round(H * (strip ? 0.8 : b.pics.length > 1 ? 0.58 : 0.7));
  const step = Math.round(tile * 0.66);
  const picsW = 60 + (b.pics.length - 1) * step + tile;
  const turns = [-7, 5, -3];
  const pics = b.pics.map((p, i) => `<img src="${img(p)}" style="width:${tile}px;height:${tile}px;right:${60 + i * step}px;top:${Math.round((H - tile) / 2 + (i % 2 ? 18 : -12))}px;transform:rotate(${turns[i % 3]}deg);z-index:${3 - i}">`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${fonts}"><style>
  *{margin:0;box-sizing:border-box} html,body{width:${W}px;height:${H}px;overflow:hidden}
  .b{position:relative;width:${W}px;height:${H}px;background:${b.field};color:${b.ink};font-family:'Be Vietnam Pro',sans-serif;overflow:hidden}
  .sun{position:absolute;right:${strip ? 120 : 80}px;top:50%;width:${Math.round(H * 1.25)}px;height:${Math.round(H * 1.25)}px;margin-top:-${Math.round(H * 0.625)}px;border-radius:50%;background:${b.acc};opacity:.18}
  .t{position:absolute;left:${strip ? 80 : 90}px;top:50%;transform:translateY(-50%);max-width:${W - picsW - (strip ? 160 : 150)}px}
  h1{font-weight:800;font-size:${hs}px;line-height:1.12;letter-spacing:-.025em;text-wrap:balance}
  p{margin-top:${strip ? 10 : 18}px;font-size:${ss}px;font-weight:500;opacity:.9}
  .c{display:inline-block;margin-top:28px;padding:16px 34px;border-radius:999px;background:${b.acc};color:${b.field};font-weight:700;font-size:${Math.round(ss * .95)}px}
  img{position:absolute;object-fit:cover;border-radius:${strip ? 18 : 28}px;box-shadow:0 18px 40px -18px rgba(0,0,0,.45);border:6px solid #fff}
  </style></head><body><div class="b"><div class="sun"></div>${pics}<div class="t"><h1>${b.head}</h1><p>${b.sub}</p>${b.cta ? `<span class="c">${b.cta}</span>` : ''}</div></div></body></html>`;
};

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9341', '--allow-file-access-from-files', '--user-data-dir=' + join(tmp, 'profile'), 'about:blank']);
await new Promise((r) => setTimeout(r, 2500));
const list = await (await fetch('http://127.0.0.1:9341/json')).json();
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
const send = (method, params = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
for (const b of BANNERS) {
  const [W, H] = SIZE[b.size];
  const f = join(tmp, b.id + '.html');
  writeFileSync(f, page(b));
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(f).href });
  await new Promise((r) => setTimeout(r, 1500));
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
  writeFileSync(join(out, b.id + '.jpg'), Buffer.from(s.result.data, 'base64'));
  console.log('wrote', b.id + '.jpg', W + 'x' + H);
}
chrome.kill();
await new Promise((r) => setTimeout(r, 800));
try { rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* profile still locked */ }
process.exit(0);
