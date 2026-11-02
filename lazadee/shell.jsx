/* Genie — unified platform launcher shell.
   Frames the four DS ui_kits (storefront / vendor / admin / auth) in one
   navigable prototype with a PRD-journey guide and live accent/radius tweaks.
   The kit gets the whole window; the switcher lives in a tab on the right edge
   that opens a floating dock, so the demo chrome never covers the UI. */
const { Icon } = window.LazadeeDesignSystem_0477b7;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1D4ED8",
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
  '#1D4ED8': { 50: '#EEF3FF', 100: '#DCE6FE', 200: '#B9CDFB', 300: '#8CACF6', 400: '#5A85EE', 500: '#1D4ED8', 600: '#1A43BD', 700: '#16379B', 800: '#122C7A', 900: '#0B1F4B' },
  '#0369A1': { 50: '#E9F6FD', 100: '#D2EEFC', 200: '#A6DDF8', 300: '#74C8F3', 400: '#38B1EC', 500: '#0369A1', 600: '#035A8A', 700: '#024B73', 800: '#023D5D', 900: '#012C44' },
  '#0B7F4C': { 50: '#E6F8F0', 100: '#CFF2E2', 200: '#BCEDD8', 300: '#7FDDB2', 400: '#4DD08E', 500: '#0B7F4C', 600: '#096C41', 700: '#075A36', 800: '#05482B', 900: '#03341F' },
  '#6C2BD9': { 50: '#F1ECFE', 100: '#E4DAFC', 200: '#D6C4F7', 300: '#B592EF', 400: '#9460E8', 500: '#6C2BD9', 600: '#5A22B5', 700: '#4A1C95', 800: '#3A1675', 900: '#291054' },
};
const RADII = { 'Mềm': [6, 10, 16], 'Vuông': [2, 3, 4], 'Tròn': [10, 14, 20] };

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
function applyTheme(doc, accent, radius) {
  if (!doc || !doc.documentElement) return;
  // The storefront carries its own themes (themes.js); the accent tweak would overwrite them.
  if (doc !== document && doc.documentElement.hasAttribute('data-theme')) return;
  const r = ACCENTS[accent] || ACCENTS['#1D4ED8'];
  const s = doc.documentElement.style;
  Object.keys(r).forEach((stop) => s.setProperty('--brand-' + stop, r[stop]));
  s.setProperty('--shadow-lift', `0 10px 24px ${hexToRgba(r[500], 0.16)}, 0 2px 6px rgba(11, 31, 75, 0.08)`);
  s.setProperty('--focus-ring', `0 0 0 3px ${hexToRgba(r[500], 0.35)}`);
  const rad = RADII[radius] || RADII['Mềm'];
  s.setProperty('--radius-sm', rad[0] + 'px');
  s.setProperty('--radius-md', rad[1] + 'px');
  s.setProperty('--radius-lg', rad[2] + 'px');
}

/* ---- PRD journeys guide ---------------------------------------------------- */
const JOURNEYS = [
  { n: 1, title: 'Tách giỏ đa người bán & thanh toán gộp', surf: 'storefront',
    desc: 'Một giỏ gồm nhiều shop được tách thành các đơn riêng, gộp thanh toán một lần.', ref: 'FR-ORD-02, FR-ORD-03' },
  { n: 2, title: 'Mã giảm giá chồng (Sàn + Shop + Freeship)', surf: 'storefront',
    desc: 'Áp đồng thời voucher Shop → Sàn → Freeship rồi đến Điểm, phân bổ giảm giá theo từng sản phẩm.', ref: 'FR-PRO-04' },
  { n: 3, title: 'Chống bán quá hàng', surf: 'storefront',
    desc: 'Khoá mềm tồn kho 15 phút khi thanh toán; hết hàng giữa chừng trả về TR-INV-4090.', ref: 'FR-ORD-03, NFR-03' },
  { n: 4, title: 'KYC: nộp hồ sơ & duyệt', surf: 'vendor',
    desc: 'Người bán nộp hồ sơ KYC; Staff/Admin duyệt hoặc từ chối kèm lý do. Chưa VERIFIED thì không đăng bán.', ref: 'FR-VND-02, FR-VND-03' },
  { n: 5, title: 'Escrow, hoa hồng & payout', surf: 'vendor',
    desc: 'Tiền giữ tạm trong escrow; khi hoàn tất, sàn trừ hoa hồng và ghi Net vào ví người bán.', ref: 'FR-PAY-03, FR-PAY-05' },
  { n: 6, title: 'Vòng đời đơn hàng', surf: 'vendor',
    desc: 'PAID → CONFIRMED → PREPARING → READY_FOR_PICKUP → DELIVERING → DELIVERED → COMPLETED. Người bán xác nhận, chuẩn bị hàng, gọi 3PL, in vận đơn.', ref: 'UC-LOG-16, UC-LOG-01, UC-LOG-02' },
  { n: 7, title: 'Đổi/trả & phân xử hoàn tiền', surf: 'admin',
    desc: 'Khách gửi yêu cầu đổi trả kèm bằng chứng; Staff/Admin duyệt, từ chối, hoặc hoàn tiền.', ref: 'UC-SUP-01…04' },
];

// Corner brackets, drawn in the kit's icon stroke: outward to enter full screen, inward to leave.
const FullIcon = ({ exit }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {exit
      ? <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
      : <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />}
  </svg>
);

// Storefront screens the dock can jump to, so one theme can be judged across the whole journey.
const SCREENS = [
  { id: 'home', label: 'Trang chủ', q: '' },
  { id: 'category', label: 'Danh mục', q: '?screen=category&cat=' + encodeURIComponent('Điện tử') },
  { id: 'product', label: 'Sản phẩm', q: '?screen=product&product=p1' },
  { id: 'cart', label: 'Giỏ hàng', q: '?screen=cart' },
  { id: 'shop', label: 'Gian hàng', q: '?screen=shop&shop=techzone' },
  { id: 'account', label: 'Đơn của tôi', q: '?screen=account&view=orders' },
];
const THEMES = window.GENIE_THEMES || [];

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
  // The dock opens once on a first visit so the theme picker is found, then remembers.
  const [dockOpen, setDockOpen] = React.useState(() => { try { return !localStorage.getItem('genie_dock_seen'); } catch (e) { return false; } });
  React.useEffect(() => { try { localStorage.setItem('genie_dock_seen', '1'); } catch (e) {} }, []);
  const [theme, setTheme] = React.useState(() => document.documentElement.getAttribute('data-theme') || (THEMES[0] && THEMES[0].id));
  const [sfScreen, setSfScreen] = React.useState('home');
  const pickTheme = (id) => { setTheme(id); window.GENIE_SET_THEME && window.GENIE_SET_THEME(id); };
  const openScreen = (sc) => { setSfScreen(sc.id); go('storefront'); const f = frames.current.storefront; if (f) f.src = 'lazadee/ui_kits/storefront/index.html' + sc.q; };
  const [full, setFull] = React.useState(!!document.fullscreenElement);
  const frames = React.useRef({});
  const dockBtn = React.useRef(null);

  // The dock closes on Esc, and when the user clicks into the kit (the iframe takes focus).
  React.useEffect(() => {
    if (!dockOpen) return undefined;
    const key = (e) => { if (e.key === 'Escape') { setDockOpen(false); dockBtn.current && dockBtn.current.focus(); } };
    const blur = () => setTimeout(() => { if (document.activeElement && document.activeElement.tagName === 'IFRAME') setDockOpen(false); }, 0);
    window.addEventListener('keydown', key);
    window.addEventListener('blur', blur);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('blur', blur); };
  }, [dockOpen]);
  React.useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  };

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
      {/* ---- Demo switcher: an edge tab that opens a floating dock ---- */}
      <button ref={dockBtn} className="sh-handle" aria-expanded={dockOpen} aria-controls="sh-dock"
        aria-label={'Chuyển phân hệ, đang xem ' + active.label} title="Chuyển phân hệ" onClick={() => setDockOpen((o) => !o)}>
        <img src="lazadee/assets/logomark.svg" width="20" height="20" alt="" />
        <Icon name={dockOpen ? 'chevron-right' : 'chevron-left'} size={14} />
      </button>
      <div id="sh-dock" className="sh-dock" data-open={dockOpen ? 1 : 0} role="dialog" aria-label="Bảng điều khiển bản demo" hidden={!dockOpen}>
        <div className="sh-dock__brand">
          <img src="lazadee/assets/logomark.svg" width="24" height="24" alt="" />
          <b>Genie</b><span className="sh-dock__tag">Prototype</span>
          <button className="sh-dock__close" onClick={() => setDockOpen(false)} aria-label="Đóng"><Icon name="x" size={16} /></button>
        </div>
        <nav className="sh-dock__list" aria-label="Phân hệ">
          {SURFACES.map((s) => (
            <button key={s.id} className="sh-dock__item" aria-current={s.id === surface ? 'page' : undefined} title={s.blurb}
              onClick={() => { go(s.id); setDockOpen(false); }}>
              <Icon name={s.icon} size={18} />
              <span><b>{s.label}</b><small>{s.sub}</small></span>
            </button>
          ))}
        </nav>
        {THEMES.length > 0 && <section className="sh-dock__sec" aria-label="Giao diện cửa hàng">
          <h2>Giao diện cửa hàng</h2>
          <div className="sh-dock__themes" role="radiogroup" aria-label="Chọn giao diện">
            {THEMES.map((th, i) => (
              <button key={th.id} role="radio" aria-checked={theme === th.id} className="sh-theme" title={th.note} onClick={() => pickTheme(th.id)}>
                <span className="sh-theme__sw" aria-hidden="true">{th.swatch.map((c) => <i key={c} style={{ background: c }} />)}</span>
                <span className="sh-theme__name"><b>{th.id === 'classic' ? th.name : (i + 1) + '. ' + th.name}</b><small>{th.note}</small></span>
              </button>
            ))}
          </div>
        </section>}
        <section className="sh-dock__sec" aria-label="Màn hình cửa hàng">
          <h2>Xem màn hình</h2>
          <div className="sh-dock__screens">
            {SCREENS.map((sc) => <button key={sc.id} aria-pressed={surface === 'storefront' && sfScreen === sc.id} onClick={() => openScreen(sc)}>{sc.label}</button>)}
          </div>
        </section>
        <div className="sh-dock__foot">
          <button className="sh-dock__act" onClick={() => { setGuideOpen(true); setDockOpen(false); }}><Icon name="list" size={16} />Hành trình PRD</button>
          <button className="sh-dock__act" onClick={toggleFull} aria-pressed={full}><FullIcon exit={full} />{full ? 'Thoát toàn màn hình' : 'Toàn màn hình'}</button>
        </div>
      </div>

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
      <aside className="sh-guide" style={{ ...shell.guide, transform: guideOpen ? 'translateX(0)' : 'translateX(100%)' }}>
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
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-300)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
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
          options={['#1D4ED8', '#0369A1', '#0B7F4C', '#6C2BD9']}
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
  root: { height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: INK },
  stage: { flex: 1, position: 'relative', background: 'var(--surface-page)' },
  frame: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' },

  scrim: { position: 'fixed', inset: 0, background: 'var(--surface-overlay)', zIndex: 50 },
  guide: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '92vw', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xl)', zIndex: 60, transition: 'transform var(--dur-slow) var(--ease-out)', display: 'flex', flexDirection: 'column' },
  guideHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 24px 14px' },
  guideKicker: { font: '700 11px var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--brand-600)' },
  guideTitle: { font: 'var(--type-h3)', color: 'var(--text-strong)', marginTop: 4 },
  close: { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 8 },
  guideIntro: { font: 'var(--type-body-sm)', color: 'var(--text-muted)', padding: '0 24px 12px', margin: 0 },
  guideList: { flex: 1, overflowY: 'auto', padding: '4px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 },
  jrow: { display: 'flex', alignItems: 'flex-start', gap: 13, textAlign: 'left', padding: '14px 14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)' },
  jnum: { flex: '0 0 26px', width: 26, height: 26, borderRadius: '50%', background: 'var(--brand-50)', color: 'var(--brand-600)', font: '700 13px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  jtitle: { display: 'block', font: '600 14px var(--font-sans)', color: 'var(--text-strong)' },
  jdesc: { display: 'block', font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 },
  jmeta: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 },
  jchip: { display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 11px var(--font-sans)', color: 'var(--text-body)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: '3px 9px' },
  jref: { font: '11px var(--font-mono)', color: 'var(--text-subtle)' },
  jgo: { flex: '0 0 auto', color: 'var(--text-subtle)', marginTop: 2 },
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
