/* Lazadee — unified platform launcher shell.
   Frames the four DS ui_kits (storefront / vendor / admin / auth) in one
   navigable prototype with a PRD-journey guide and live accent/radius tweaks. */
const { Icon } = window.LazadeeDesignSystem_0477b7;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#F5511E",
  "radius": "Mềm"
}/*EDITMODE-END*/;

/* ---- Surfaces -------------------------------------------------------------- */
const SURFACES = [
  { id: 'storefront', label: 'Cửa hàng', sub: 'Khách hàng', icon: 'store',
    src: 'lazadee/ui_kits/storefront/index.html',
    blurb: 'Trang chủ · chi tiết sản phẩm · giỏ đa người bán · thanh toán gộp' },
  { id: 'vendor', label: 'Người bán', sub: 'Seller Center', icon: 'layout-dashboard',
    src: 'lazadee/ui_kits/vendor/index.html',
    blurb: 'Tổng quan · ví & escrow · KYC · sản phẩm · giao vận · chat' },
  { id: 'admin', label: 'Quản trị', sub: 'Admin Console', icon: 'shield-check',
    src: 'lazadee/ui_kits/admin/index.html',
    blurb: 'Duyệt KYC · phân xử đổi trả · kiểm duyệt · tài chính · RBAC' },
  { id: 'auth', label: 'Đăng nhập', sub: 'OTP & khoá', icon: 'lock',
    src: 'lazadee/ui_kits/auth/index.html',
    blurb: 'Đăng nhập · xác thực OTP 6 số · khoá tài khoản sau 5 lần sai' },
];

/* ---- Accent ramps (keyed by the -500 swatch) ------------------------------- */
const ACCENTS = {
  '#F5511E': { 50: '#FFF3EE', 200: '#FFC1A6', 400: '#FB7440', 500: '#F5511E', 600: '#DB3F0E', 700: '#B53109' },
  '#2563EB': { 50: '#EAF1FE', 200: '#B7CEF9', 400: '#5B8DEF', 500: '#2563EB', 600: '#1A4FD0', 700: '#143FA8' },
  '#14B86E': { 50: '#E6F8F0', 200: '#BCEDD8', 400: '#4DD08E', 500: '#14B86E', 600: '#0E9A5A', 700: '#0B7E49' },
  '#6C2BD9': { 50: '#F1ECFE', 200: '#D6C4F7', 400: '#9460E8', 500: '#6C2BD9', 600: '#5A22B5', 700: '#4A1C95' },
};
const RADII = { 'Mềm': [5, 8, 12], 'Vuông': [2, 3, 4], 'Tròn': [10, 14, 18] };

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
function applyTheme(doc, accent, radius) {
  if (!doc || !doc.documentElement) return;
  const r = ACCENTS[accent] || ACCENTS['#F5511E'];
  const s = doc.documentElement.style;
  s.setProperty('--orange-50', r[50]);
  s.setProperty('--orange-200', r[200]);
  s.setProperty('--orange-400', r[400]);
  s.setProperty('--orange-500', r[500]);
  s.setProperty('--orange-600', r[600]);
  s.setProperty('--orange-700', r[700]);
  s.setProperty('--focus-ring', `0 0 0 3px ${hexToRgba(r[500], 0.35)}`);
  const rad = RADII[radius] || RADII['Mềm'];
  s.setProperty('--radius-sm', rad[0] + 'px');
  s.setProperty('--radius-md', rad[1] + 'px');
  s.setProperty('--radius-lg', rad[2] + 'px');
}

/* ---- PRD journeys guide ---------------------------------------------------- */
const JOURNEYS = [
  { n: 1, title: 'Tách giỏ đa người bán & thanh toán gộp', surf: 'storefront',
    desc: 'Một giỏ gồm nhiều shop được tách thành các đơn riêng, gộp thanh toán một lần.', ref: 'FR-ORD-001' },
  { n: 2, title: 'Mã giảm giá chồng (Sàn + Shop + Freeship)', surf: 'storefront',
    desc: 'Áp đồng thời 1 voucher Sàn + 1 Shop + 1 Freeship, phân bổ giảm giá theo từng sản phẩm.', ref: 'FR-ORD-003' },
  { n: 3, title: 'Chống bán quá hàng', surf: 'storefront',
    desc: 'Khoá mềm tồn kho 15 phút khi thanh toán; hết hàng giữa chừng trả về ERR_STOCK_UNAVAILABLE.', ref: 'FR-ORD-002' },
  { n: 4, title: 'KYC: nộp hồ sơ & duyệt', surf: 'vendor',
    desc: 'Người bán nộp hồ sơ KYC; Staff/Admin duyệt hoặc từ chối kèm lý do. Chưa VERIFIED thì không đăng bán.', ref: 'FR-VND-001' },
  { n: 5, title: 'Escrow, hoa hồng & payout', surf: 'vendor',
    desc: 'Tiền giữ tạm trong escrow; khi hoàn tất, sàn trừ hoa hồng và ghi Net vào ví người bán.', ref: 'FR-FIN-001' },
  { n: 6, title: 'Vòng đời đơn hàng', surf: 'vendor',
    desc: 'PAID → SHIPPED → DELIVERED → COMPLETED. Người bán chuẩn bị hàng, gọi 3PL, in vận đơn.', ref: 'UC-Fulfillment' },
  { n: 7, title: 'Đổi/trả & phân xử hoàn tiền', surf: 'admin',
    desc: 'Khách gửi yêu cầu đổi trả kèm bằng chứng; Staff/Admin duyệt, từ chối, hoặc hoàn tiền.', ref: 'UC-Returns' },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const init = (() => {
    const h = (location.hash || '').replace('#', '');
    if (SURFACES.some((s) => s.id === h)) return h;
    return localStorage.getItem('lz_surface') || 'storefront';
  })();
  const [surface, setSurface] = React.useState(init);
  const [visited, setVisited] = React.useState(() => new Set([init]));
  const [guideOpen, setGuideOpen] = React.useState(false);
  const frames = React.useRef({});

  const go = (id) => {
    setSurface(id);
    setVisited((v) => new Set(v).add(id));
    localStorage.setItem('lz_surface', id);
    history.replaceState(null, '', '#' + id);
  };

  // Re-apply theme to shell + every loaded iframe whenever a tweak changes.
  React.useEffect(() => {
    applyTheme(document, t.accent, t.radius);
    Object.values(frames.current).forEach((f) => {
      try { applyTheme(f.contentDocument, t.accent, t.radius); } catch (e) {}
    });
  }, [t.accent, t.radius]);

  const onFrameLoad = (id, el) => {
    if (!el) return;
    frames.current[id] = el;
    try { applyTheme(el.contentDocument, t.accent, t.radius); } catch (e) {}
  };

  const active = SURFACES.find((s) => s.id === surface);

  return (
    <div style={shell.root}>
      {/* ---- Top product chrome ---- */}
      <header style={shell.bar}>
        <div style={shell.brand}>
          <img src="lazadee/assets/logomark.svg" width="30" height="30" alt="" />
          <span style={shell.word}>lazad<span style={{ color: 'var(--orange-500)' }}>ee</span></span>
          <span style={shell.tag}>PROTOTYPE</span>
        </div>

        <nav style={shell.tabs}>
          {SURFACES.map((s) => {
            const on = s.id === surface;
            return (
              <button key={s.id} onClick={() => go(s.id)} title={s.blurb}
                style={{ ...shell.tab, ...(on ? shell.tabOn : null) }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                <Icon name={s.icon} size={17} />
                <span style={shell.tabText}>
                  <span style={shell.tabLabel}>{s.label}</span>
                  <span style={shell.tabSub}>{s.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <button onClick={() => setGuideOpen(true)} style={shell.guideBtn}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--orange-500)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.16)'; e.currentTarget.style.color = 'rgba(255,255,255,.82)'; }}>
          <Icon name="list" size={16} />
          Hành trình PRD
        </button>
      </header>

      {/* ---- Surface stage ---- */}
      <div style={shell.stage}>
        {SURFACES.map((s) => (
          <iframe key={s.id} title={s.label}
            ref={(el) => onFrameLoad(s.id, el)}
            src={visited.has(s.id) ? s.src : 'about:blank'}
            onLoad={(e) => onFrameLoad(s.id, e.currentTarget)}
            style={{ ...shell.frame, display: s.id === surface ? 'block' : 'none' }} />
        ))}
      </div>

      {/* ---- Journey guide slide-over ---- */}
      {guideOpen && <div style={shell.scrim} onClick={() => setGuideOpen(false)} />}
      <aside style={{ ...shell.guide, transform: guideOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={shell.guideHead}>
          <div>
            <div style={shell.guideKicker}>Hành trình nghiệp vụ</div>
            <div style={shell.guideTitle}>Demo theo PRD</div>
          </div>
          <button onClick={() => setGuideOpen(false)} style={shell.close} aria-label="Đóng">
            <Icon name="x" size={20} />
          </button>
        </div>
        <p style={shell.guideIntro}>
          Bảy hành trình lõi của sàn. Mở mỗi mục để nhảy thẳng tới bề mặt minh hoạ.
        </p>
        <div style={shell.guideList}>
          {JOURNEYS.map((j) => {
            const surf = SURFACES.find((s) => s.id === j.surf);
            return (
              <button key={j.n} style={shell.jrow} onClick={() => { go(j.surf); setGuideOpen(false); }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--orange-300)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={shell.jnum}>{j.n}</span>
                <span style={{ flex: 1 }}>
                  <span style={shell.jtitle}>{j.title}</span>
                  <span style={shell.jdesc}>{j.desc}</span>
                  <span style={shell.jmeta}>
                    <span style={shell.jchip}><Icon name={surf.icon} size={12} />{surf.label}</span>
                    <span className="code" style={shell.jref}>{j.ref}</span>
                  </span>
                </span>
                <span style={shell.jgo}><Icon name="arrow-right" size={16} /></span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ---- Tweaks ---- */}
      <TweaksPanel>
        <TweakSection label="Thương hiệu" />
        <TweakColor label="Màu nhấn" value={t.accent}
          options={['#F5511E', '#2563EB', '#14B86E', '#6C2BD9']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakRadio label="Bo góc" value={t.radius}
          options={['Mềm', 'Vuông', 'Tròn']}
          onChange={(v) => setTweak('radius', v)} />
      </TweaksPanel>
    </div>
  );
}

const INK = '#14171F';
const shell = {
  root: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: INK },
  bar: { height: 56, flex: '0 0 56px', background: INK, display: 'flex', alignItems: 'center', gap: 18, padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,.08)' },
  brand: { display: 'flex', alignItems: 'center', gap: 9 },
  word: { font: '800 21px var(--font-sans)', letterSpacing: '-0.02em', color: '#fff' },
  tag: { font: '700 9px var(--font-sans)', letterSpacing: '.14em', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 4, padding: '3px 6px', marginLeft: 2 },
  tabs: { display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 },
  tab: { display: 'flex', alignItems: 'center', gap: 9, height: 42, padding: '0 14px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,.62)', borderRadius: 8, cursor: 'pointer', transition: 'background var(--dur-fast) var(--ease-out)', textAlign: 'left' },
  tabOn: { background: 'var(--orange-500)', color: '#fff' },
  tabText: { display: 'flex', flexDirection: 'column', lineHeight: 1.1 },
  tabLabel: { font: '600 14px var(--font-sans)' },
  tabSub: { font: '500 10px var(--font-sans)', opacity: .72, marginTop: 1 },
  guideBtn: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,.16)', color: 'rgba(255,255,255,.82)', font: '600 13px var(--font-sans)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)' },
  stage: { flex: 1, position: 'relative', background: 'var(--surface-page)' },
  frame: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' },

  scrim: { position: 'fixed', inset: 0, background: 'var(--surface-overlay)', zIndex: 50 },
  guide: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '92vw', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xl)', zIndex: 60, transition: 'transform var(--dur-slow) var(--ease-out)', display: 'flex', flexDirection: 'column' },
  guideHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 24px 14px' },
  guideKicker: { font: '700 11px var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--orange-600)' },
  guideTitle: { font: 'var(--type-h3)', color: 'var(--text-strong)', marginTop: 4 },
  close: { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 8 },
  guideIntro: { font: 'var(--type-body-sm)', color: 'var(--text-muted)', padding: '0 24px 12px', margin: 0 },
  guideList: { flex: 1, overflowY: 'auto', padding: '4px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 },
  jrow: { display: 'flex', alignItems: 'flex-start', gap: 13, textAlign: 'left', padding: '14px 14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)' },
  jnum: { flex: '0 0 26px', width: 26, height: 26, borderRadius: '50%', background: 'var(--orange-50)', color: 'var(--orange-600)', font: '700 13px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  jtitle: { display: 'block', font: '600 14px var(--font-sans)', color: 'var(--text-strong)' },
  jdesc: { display: 'block', font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 },
  jmeta: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 },
  jchip: { display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 11px var(--font-sans)', color: 'var(--text-body)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: '3px 9px' },
  jref: { font: '11px var(--font-mono)', color: 'var(--text-subtle)' },
  jgo: { flex: '0 0 auto', color: 'var(--text-subtle)', marginTop: 2 },
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
