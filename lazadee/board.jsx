/* Lazadee — Figma-style screen board.
   Lays every kit screen out as a live artboard on a pan/zoom canvas.
   A global load-queue boots only a couple of iframes at a time (behind
   skeletons) so 17 React apps don't all compile Babel on the same frame. */

/* ---- Throttled iframe loader -------------------------------------------- */
const LZ_QUEUE = [];
let lz_active = 0;
const LZ_MAX = 3;        // how many kit iframes may boot concurrently
const LZ_GAP = 500;      // ms breathing room after each load before the next
function lzPump() {
  while (lz_active < LZ_MAX && LZ_QUEUE.length) {
    const job = LZ_QUEUE.shift();
    lz_active++;
    job();
  }
}

function Skeleton({ surface }) {
  const tint = surface === 'vendor' ? '#14171F' : surface === 'admin' ? '#0E2440' : 'var(--surface-page)';
  return (
    <div style={{ position: 'absolute', inset: 0, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: .6 }}>
        <div className="lz-spin" style={{ width: 30, height: 30, border: '3px solid rgba(245,81,30,.25)', borderTopColor: 'var(--orange-500)', borderRadius: '50%' }} />
        <div style={{ font: '500 14px var(--font-sans)', color: surface === 'storefront' ? 'var(--text-subtle)' : 'rgba(255,255,255,.6)' }}>Đang tải…</div>
      </div>
    </div>
  );
}

function KitFrame({ surface, screen, w, h, query }) {
  const [src, setSrc] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    const qs = `?screen=${screen}${query ? '&' + query : ''}`;
    const job = () => { if (!cancelled) setSrc(`lazadee/ui_kits/${surface}/index.html${qs}`); };
    LZ_QUEUE.push(job);
    lzPump();
    return () => { cancelled = true; };
  }, [surface, screen, query]);
  const onLoad = () => {
    setLoaded(true);
    setTimeout(() => { lz_active = Math.max(0, lz_active - 1); lzPump(); }, LZ_GAP);
  };
  return (
    <div style={{ position: 'relative', width: w, height: h, background: '#fff', overflow: 'hidden' }}>
      {!loaded && <Skeleton surface={surface} />}
      {src && (
        <iframe title={`${surface}/${screen}`} src={src} onLoad={onLoad} scrolling="no"
          style={{ width: w, height: h, border: 0, display: 'block', background: '#fff' }} />
      )}
    </div>
  );
}

/* ---- Screen catalogue (Figma frames) ------------------------------------ */
const W = 1280;
const BOARD = [
  {
    id: 'storefront', title: 'Cửa hàng — Khách hàng',
    sub: 'Luồng mua sắm: Trang chủ → Chi tiết SP → Giỏ đa người bán → Thanh toán gộp → Hoàn tất',
    screens: [
      { screen: 'home', label: 'Trang chủ', h: 2458 },
      { screen: 'discover', label: 'Gợi ý hôm nay · phân trang (trang 2)', h: 2590 },
      { screen: 'product', label: 'Chi tiết sản phẩm', h: 2462 },
      { screen: 'cart', label: 'Giỏ hàng (tách theo shop)', h: 2480 },
      { screen: 'checkout', label: 'Thanh toán · voucher chồng', h: 2060 },
      { screen: 'checkout', id: 'checkout-address', label: 'Đổi địa chỉ nhận hàng (chọn / thêm mới)', h: 2060, query: 'addr=1' },
      { screen: 'checkout', id: 'checkout-oos', label: 'Hết hàng giữa lúc thanh toán · ERR_STOCK_UNAVAILABLE', h: 2060, query: 'oos=1' },
      { screen: 'payfail', label: 'Thanh toán thất bại · PAYMENT_FAILED', h: 1098 },
      { screen: 'done', label: 'Đặt hàng thành công', h: 913 },
      { screen: 'account', label: 'Tài khoản · Đơn mua', h: 2010 },
      { screen: 'account', id: 'account-notifications', label: 'Tài khoản · Thông báo', h: 1237, query: 'view=notifications' },
      { screen: 'account', id: 'account-profile', label: 'Tài khoản · Hồ sơ', h: 1180, query: 'view=profile' },
      { screen: 'account', id: 'account-address', label: 'Tài khoản · Sổ địa chỉ', h: 1024, query: 'view=address' },
      { screen: 'account', id: 'account-password', label: 'Tài khoản · Đổi mật khẩu', h: 998, query: 'view=password' },
      { screen: 'account', id: 'account-devices', label: 'Tài khoản · Thiết bị đăng nhập', h: 1020, query: 'view=devices' },
      { screen: 'account', id: 'account-vouchers', label: 'Tài khoản · Kho Voucher', h: 1024, query: 'view=vouchers' },
      { screen: 'account', id: 'account-coins', label: 'Tài khoản · Lazadee Xu', h: 1076, query: 'view=coins' },
      { screen: 'account', id: 'account-follow', label: 'Tài khoản · Shop theo dõi', h: 1024, query: 'view=follow' },
      { screen: 'tracking', label: 'Theo dõi đơn hàng · đang giao', h: 1342 },
      { screen: 'tracking', id: 'tracking-delivered', label: 'Theo dõi · đã giao (xác nhận / trả hàng)', h: 1402, query: 'order=ORD-2412-0041' },
      { screen: 'shop', label: 'Thông tin Shop · sản phẩm của shop', h: 1752, query: 'shop=techzone' },
      { screen: 'search', id: 'search-all', label: 'Tìm kiếm · Toàn sàn', h: 2142, query: 'q=' },
      { screen: 'search', id: 'search-shop', label: 'Tìm kiếm · Trong Shop', h: 1486, query: 'scope=shop&shop=techzone&q=' },
      { screen: 'seller', label: 'Đăng ký trở thành Người bán', h: 1680 },
    ],
  },
  {
    id: 'vendor', title: 'Người bán — Seller Center',
    sub: 'KYC · ví escrow & hoa hồng · quản lý sản phẩm · giao vận · chat',
    screens: [
      { screen: 'overview', label: 'Tổng quan', h: 1122 },
      { screen: 'wallet', label: 'Ví & Escrow', h: 994 },
      { screen: 'kyc', label: 'Định danh KYC', h: 868 },
      { screen: 'products', label: 'Quản lý sản phẩm', h: 606 },
      { screen: 'orders', label: 'Xử lý đơn & vận đơn', h: 634 },
      { screen: 'chat', label: 'Chat với khách', h: 800 },
      { screen: 'promo', label: 'Khuyến mãi của Shop', h: 820 },
      { screen: 'reviews', label: 'Đánh giá & phản hồi', h: 948 },
      { screen: 'stats', label: 'Phân tích bán hàng', h: 966 },
      { screen: 'settings', label: 'Cài đặt Shop', h: 1436 },
    ],
  },
  {
    id: 'admin', title: 'Quản trị — Admin Console',
    sub: 'Duyệt KYC · phân xử đổi trả/hoàn tiền · sổ cái tài chính',
    screens: [
      { screen: 'kyc', label: 'Hàng đợi duyệt KYC', h: 632 },
      { screen: 'refunds', label: 'Phân xử đổi/trả', h: 824 },
      { screen: 'withdrawals', label: 'Xử lý rút tiền (payout)', h: 632 },
      { screen: 'commission', label: 'Cấu hình hoa hồng', h: 886 },
      { screen: 'ledger', label: 'Sổ cái tài chính', h: 570 },
      { screen: 'reviews', label: 'Kiểm duyệt đánh giá', h: 842 },
      { screen: 'catalog', label: 'Danh mục toàn sàn', h: 884 },
      { screen: 'vouchers', label: 'Voucher sàn', h: 720 },
      { screen: 'audit', label: 'Nhật ký hệ thống (Audit Log)', h: 868 },
      { screen: 'rbac', label: 'Phân quyền nhân viên', h: 534 },
      { screen: 'account', label: 'Tài khoản Admin', h: 1180 },
    ],
  },
  {
    id: 'auth', title: 'Đăng nhập — OTP',
    sub: 'Đăng nhập SĐT → xác thực OTP 6 số → khoá tài khoản sau 5 lần sai',
    screens: [
      { screen: 'login', label: 'Đăng nhập', h: 820 },
      { screen: 'register', label: 'Đăng ký tài khoản', h: 820 },
      { screen: 'forgot', label: 'Quên mật khẩu', h: 820 },
      { screen: 'otp', label: 'Nhập mã OTP', h: 820 },
      { screen: 'locked', label: 'Tài khoản bị khoá', h: 820 },
    ],
  },
];

function Board() {
  const [hint, setHint] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setHint(false), 6000); return () => clearTimeout(t); }, []);
  return (
    <React.Fragment>
      <DesignCanvas minScale={0.06} maxScale={2}>
        {BOARD.map((sec) => (
          <DCSection key={sec.id} id={sec.id} title={sec.title} subtitle={sec.sub}>
            {sec.screens.map((s) => (
              <DCArtboard key={s.id || `${sec.id}-${s.screen}`} id={s.id || `${sec.id}-${s.screen}`} label={s.label} width={W} height={s.h}>
                <KitFrame surface={sec.id} screen={s.screen} query={s.query} w={W} h={s.h} />
              </DCArtboard>
            ))}
          </DCSection>
        ))}
      </DesignCanvas>

      {/* Reset-view control — guarantees the user can always get back to content */}
      <button onClick={() => window.__LZ_RESET_VIEW && window.__LZ_RESET_VIEW()}
        title="Đưa khung nhìn về vị trí ban đầu"
        style={lzBoard.reset}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink-900)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--ink-900)'; }}>
        <Icon name="layout-grid" size={16} />
        Về vị trí ban đầu
      </button>

      {hint && (
        <div style={lzBoard.hint}>
          <Icon name="refresh-cw" size={15} />
          Kéo nền để di chuyển · cuộn để phóng to/thu nhỏ
        </div>
      )}
    </React.Fragment>
  );
}

const { Icon: LZIcon } = window.LazadeeDesignSystem_0477b7;
const Icon = LZIcon;
const lzBoard = {
  reset: { position: 'fixed', right: 18, bottom: 18, zIndex: 9000, display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', borderRadius: 'var(--radius-pill)', border: '1.5px solid var(--border-strong)', background: '#fff', color: 'var(--ink-900)', font: '600 13px var(--font-sans)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'all var(--dur-fast) var(--ease-out)' },
  hint: { position: 'fixed', left: '50%', bottom: 20, transform: 'translateX(-50%)', zIndex: 9000, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 'var(--radius-pill)', background: 'var(--ink-900)', color: '#fff', font: '500 13px var(--font-sans)', boxShadow: 'var(--shadow-lg)', opacity: .94, pointerEvents: 'none' },
};

ReactDOM.createRoot(document.getElementById('app')).render(<Board />);
