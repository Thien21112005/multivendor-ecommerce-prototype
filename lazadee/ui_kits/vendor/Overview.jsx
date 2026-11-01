/* Vendor overview: KYC banner, 8 KPI tiles, quick access, revenue chart with range
   switch, escrow flow, product status bar, recent orders. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, StatusBadge, Money } = DS;
  const formatVND = Money.format;
  const { WALLET, SALES, ORDERS, PRODUCT_COUNTS, ORDER_COUNTS, ghnStatus } = window.LZV;

  function Stat({ icon, label, value, delta, tone }) {
    const [hover, setHover] = React.useState(false);
    return (
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: 'relative', overflow: 'hidden', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)', padding: '18px 20px', transform: hover ? 'translateY(-2px)' : 'none', transition: 'box-shadow .2s ease, transform .2s ease' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: tone.fg }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={18} /></span>
          <span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ font: '800 26px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</div>
        {delta != null && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 12px var(--font-sans)', color: delta >= 0 ? 'var(--green-600)' : 'var(--red-600)', background: delta >= 0 ? 'var(--green-50)' : 'var(--red-50, #FDECEA)', borderRadius: 'var(--radius-pill)', padding: '3px 8px', marginTop: 6 }}><Icon name={delta >= 0 ? 'arrow-up-right' : 'arrow-down-right'} size={13} />{delta >= 0 ? '+' : ''}{delta}%</div>}
      </div>
    );
  }

  const QUICK = [
    { icon: 'plus-circle', label: 'Thêm sản phẩm', nav: 'products', color: 'var(--color-primary)', bg: 'var(--orange-50)' },
    { icon: 'package', label: 'Xử lý đơn hàng', nav: 'orders', color: 'var(--blue-600)', bg: 'var(--blue-50)' },
    { icon: 'wallet', label: 'Quản lý ví', nav: 'wallet', color: 'var(--mint-600)', bg: 'var(--mint-50)' },
    { icon: 'message-circle', label: 'Chat khách hàng', nav: 'chat', color: 'var(--purple-500)', bg: 'var(--purple-50)' },
    { icon: 'megaphone', label: 'Khuyến mãi', nav: 'promo', color: 'var(--gold-600)', bg: 'var(--gold-50)' },
    { icon: 'chart-column', label: 'Phân tích', nav: 'stats', color: 'var(--green-600)', bg: 'var(--green-50)' },
  ];
  const RANGES = [{ id: 'week', label: '7 ngày' }, { id: 'month', label: '30 ngày' }, { id: 'year', label: 'Cả năm' }];

  function RevenueChart() {
    const [range, setRange] = React.useState('week');
    const [hover, setHover] = React.useState(-1);
    const data = SALES[range];
    const max = Math.max(...data.map((d) => d.v), 1);
    const total = data.reduce((n, d) => n + d.v, 0);
    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <span style={{ display: 'block', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Doanh thu</span>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Tổng: {total.toFixed(1)}M ₫</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: 'var(--gray-50)', padding: 4, borderRadius: 6 }}>
            {RANGES.map((r) => <button key={r.id} onClick={() => setRange(r.id)} style={{ border: 0, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', font: '500 12px var(--font-sans)', background: range === r.id ? '#fff' : 'transparent', color: range === r.id ? 'var(--text-strong)' : 'var(--text-muted)', boxShadow: range === r.id ? 'var(--shadow-sm)' : 'none' }}>{r.label}</button>)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: data.length > 10 ? 6 : 12, height: 200, padding: '0 4px' }}>
          {data.map((d, i) => {
            const top = d.v === max, on = hover === i;
            return (
              <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ font: '600 11px var(--font-sans)', color: on ? 'var(--color-primary)' : 'var(--text-body)' }}>{d.v}</div>
                <div style={{ position: 'relative', width: '100%', maxWidth: 56, height: (d.v / max) * 150, borderRadius: '8px 8px 2px 2px', background: top ? 'var(--color-primary)' : on ? 'var(--orange-400)' : 'var(--orange-200)', transition: 'background .15s ease' }}>
                  {top && <span style={{ position: 'absolute', top: -38, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: '#fff', padding: '2px 6px', borderRadius: 'var(--radius-sm)', font: '600 10px var(--font-sans)', whiteSpace: 'nowrap' }}>Cao nhất</span>}
                </div>
                <div style={{ font: '12px var(--font-sans)', color: on ? 'var(--text-strong)' : 'var(--text-muted)', fontWeight: on ? 600 : 400 }}>{d.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function ProductBar({ onNav }) {
    const { published, draft, hidden } = PRODUCT_COUNTS;
    const total = published + draft + hidden;
    const parts = [{ label: 'Đang bán', n: published, color: 'var(--green-500)' }, { label: 'Nháp', n: draft, color: 'var(--amber-500)' }, { label: 'Ẩn', n: hidden, color: 'var(--gray-400)' }];
    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Icon name="boxes" size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Sản phẩm</span>
          <span style={{ background: 'var(--gray-100)', color: 'var(--text-muted)', font: '700 12px var(--font-sans)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>{total}</span>
          <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} iconRight="chevron-right" onClick={() => onNav('products')}>Quản lý</Button>
        </div>
        <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: 'var(--gray-100)', marginBottom: 14 }}>
          {parts.map((p) => <div key={p.label} style={{ width: (p.n / total * 100) + '%', background: p.color }} />)}
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          {parts.map((p) => <span key={p.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '13px var(--font-sans)', color: 'var(--text-muted)' }}><i style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />{p.label}: <b style={{ color: 'var(--text-strong)' }}>{p.n}</b></span>)}
        </div>
      </div>
    );
  }

  function KycBanner({ kyc, onNav }) {
    const B = {
      VERIFIED: { bg: 'var(--green-50)', line: '#BCEBCF', icon: 'shield-check', c: 'var(--green-600)', t: <>Tài khoản đã <b>xác minh KYC</b></>, s: '— bạn có thể đăng bán và nhận thanh toán.', btn: 'Xem hồ sơ' },
      PENDING: { bg: 'var(--amber-50)', line: 'var(--gold-400)', icon: 'clock', c: 'var(--amber-600)', t: 'Hồ sơ KYC đang chờ duyệt', s: '— đội ngũ sẽ xét duyệt trong 1-3 ngày làm việc.', btn: 'Xem tiến độ' },
      REJECTED: { bg: 'var(--red-50, #FDECEA)', line: '#F5B5B5', icon: 'triangle-alert', c: 'var(--red-600)', t: 'KYC bị từ chối', s: '— vui lòng cập nhật hồ sơ và nộp lại.', btn: 'Nộp lại' },
    }[kyc] || null;
    if (!B) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: B.bg, border: '1px solid ' + B.line, borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 18 }}>
        <Icon name={B.icon} size={20} style={{ color: B.c }} />
        <span style={{ flex: 1, font: 'var(--type-body)', color: 'var(--text-body)' }}>{B.t} <span style={{ color: 'var(--text-muted)' }}>{B.s}</span></span>
        {kyc === 'VERIFIED' && <StatusBadge status="VERIFIED" />}
        <Button variant="ghost" size="sm" iconRight="chevron-right" onClick={() => onNav('kyc')}>{B.btn}</Button>
      </div>
    );
  }

  function Overview({ onNav }) {
    const kyc = window.LZ_KYC_STATUS || 'VERIFIED';
    const stats = [
      { icon: 'banknote', label: 'Doanh thu tháng', value: formatVND(WALLET.monthRevenue), delta: WALLET.monthGrowth, tone: { bg: 'var(--color-primary-tint)', fg: 'var(--color-primary)' } },
      { icon: 'wallet', label: 'Số dư khả dụng', value: formatVND(WALLET.available), tone: { bg: 'var(--mint-50)', fg: 'var(--mint-600)' } },
      { icon: 'lock', label: 'Chờ đối soát (Escrow)', value: formatVND(WALLET.held), tone: { bg: 'var(--amber-50)', fg: 'var(--amber-600)' } },
      { icon: 'chart-column', label: 'Lượt truy cập / CR', value: '18.420 / 3,2%', delta: 6.1, tone: { bg: 'var(--purple-50)', fg: 'var(--purple-600, #6C2BD9)' } },
      { icon: 'clock', label: 'Đơn chờ xác nhận', value: String(ORDER_COUNTS.toConfirm), tone: { bg: 'var(--gray-100)', fg: 'var(--gray-600)' } },
      { icon: 'package', label: 'Đơn chờ đóng gói', value: String(ORDER_COUNTS.toPack), tone: { bg: 'var(--blue-50)', fg: 'var(--blue-600)' } },
      { icon: 'truck', label: 'Đơn đang giao', value: String(ORDER_COUNTS.shipping), tone: { bg: 'var(--mint-50)', fg: 'var(--mint-600)' } },
      { icon: 'receipt', label: 'Hoàn trả / Hủy', value: String(ORDER_COUNTS.returned), tone: { bg: 'var(--red-50, #FDECEA)', fg: 'var(--red-600)' } },
    ];
    return (
      <div style={{ maxWidth: 1180 }}>
        <KycBanner kyc={kyc} onNav={onNav} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </div>

        <div style={{ ...card, marginBottom: 16, padding: '16px 20px' }}>
          <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 12 }}>Truy cập nhanh</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {QUICK.map((q) => (
              <button key={q.label} onClick={() => onNav(q.nav)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 8px', borderRadius: 'var(--radius-md)', border: 0, background: 'transparent', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: q.bg, color: q.color, display: 'grid', placeItems: 'center' }}><Icon name={q.icon} size={20} /></span>
                <span style={{ font: '500 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'center' }}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
          <RevenueChart />

          {/* escrow flow */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Dòng tiền Escrow</span>
              <span style={{ font: '600 10px var(--font-sans)', color: 'var(--text-muted)', background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Quy trình</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 16 }}>
              {[
                { ic: 'credit-card', t: 'Khách thanh toán', s: 'Tiền vào escrow của sàn', c: 'var(--blue-600)', bg: 'var(--blue-50)' },
                { ic: 'package', t: 'Shop giao hàng', s: 'Tạo waybill + mã vận đơn', c: 'var(--purple-500)', bg: 'var(--purple-50)' },
                { ic: 'circle-check', t: 'Khách xác nhận', s: 'Đơn chuyển COMPLETED', c: 'var(--mint-600)', bg: 'var(--mint-50)' },
                { ic: 'hand-coins', t: 'Giải ngân về ví', s: 'Net = Gross − hoa hồng', c: 'var(--green-600)', bg: 'var(--green-50)' },
              ].map((s, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: s.bg, color: s.c, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={s.ic} size={17} /></span>
                    {i < arr.length - 1 && <span style={{ width: 2, flex: 1, background: 'var(--border-default)', margin: '2px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                    <div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)' }}>{s.t}</div>
                    <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)' }}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductBar onNav={onNav} />

        {/* recent orders */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginTop: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <Icon name="receipt" size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Đơn hàng gần đây</span>
            <span style={{ background: 'var(--color-primary)', color: '#fff', font: '700 11px var(--font-sans)', minWidth: 22, height: 22, borderRadius: 11, display: 'grid', placeItems: 'center', padding: '0 6px' }}>{ORDERS.length}</span>
            <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} iconRight="chevron-right" onClick={() => onNav('orders')}>Xem tất cả</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}>
              <th style={th}>Mã đơn</th><th style={th}>Khách hàng</th><th style={th}>SP</th><th style={{ ...th, textAlign: 'right' }}>Giá trị</th><th style={th}>Thời gian</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th>
            </tr></thead>
            <tbody>
              {ORDERS.map((o) => {
                const g = ghnStatus(o.ghn);
                return (
                  <tr key={o.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={td}><span className="code" style={{ fontSize: 12 }}>{o.id}</span></td>
                    <td style={td}>{o.customer}</td>
                    <td style={{ ...td, color: 'var(--text-muted)' }}>{o.items}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatVND(o.total)}</td>
                    <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }}>{o.when}</td>
                    <td style={td}><StatusBadge status={g.color} label={g.label} /></td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {o.ghn === 'ready_to_pick' ? <Button size="sm" iconLeft="truck" onClick={() => onNav('orders')}>Chuẩn bị</Button> : <Button variant="ghost" size="sm" onClick={() => onNav('orders')}>Chi tiết</Button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' };
  const th = { padding: '10px 18px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 18px', whiteSpace: 'nowrap' };

  window.LZVOverview = Overview;
})();
