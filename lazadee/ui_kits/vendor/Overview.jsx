/* Vendor overview: KPI stats, 7-day sales chart, recent orders, KYC banner. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Money } = DS;
  const formatVND = Money.format;
  const { WALLET, SALES_7D, ORDERS } = window.LZV;

  function Stat({ icon, label, value, delta, tone }) {
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={17} /></span>
          <span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ font: '800 26px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {delta && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, font: '600 12px var(--font-sans)', color: 'var(--green-600)', marginTop: 4 }}><Icon name="arrow-up-right" size={13} /> {delta}</div>}
      </div>
    );
  }

  function Overview({ onNav }) {
    const max = Math.max(...SALES_7D.map((d) => d.v));
    return (
      <div style={{ maxWidth: 1180 }}>
        {/* KYC verified banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--green-50)', border: '1px solid #BCEBCF', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 18 }}>
          <Icon name="shield-check" size={20} style={{ color: 'var(--green-600)' }} />
          <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>Tài khoản đã <b>xác minh KYC</b> — bạn có thể đăng bán và nhận thanh toán.</span>
          <StatusBadge status="VERIFIED" />
          <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} iconRight="chevron-right">Xem hồ sơ</Button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <Stat icon="banknote" label="Doanh thu tháng" value={formatVND(WALLET.monthRevenue)} delta={'+' + WALLET.monthGrowth + '%'} tone={{ bg: 'var(--color-primary-tint)', fg: 'var(--color-primary)' }} />
          <Stat icon="wallet" label="Số dư khả dụng" value={formatVND(WALLET.available)} tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} />
          <Stat icon="lock" label="Đang giữ (Escrow)" value={formatVND(WALLET.held)} tone={{ bg: 'var(--amber-50)', fg: 'var(--amber-600)' }} />
          <Stat icon="package" label="Đơn cần xử lý" value="2" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          {/* sales chart */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Doanh thu 7 ngày</span>
              <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Đơn vị: triệu ₫</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '0 4px' }}>
              {SALES_7D.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ font: '600 11px var(--font-sans)', color: 'var(--text-body)' }}>{d.v}</div>
                  <div style={{ width: '100%', height: (d.v / max) * 140, borderRadius: '6px 6px 0 0', background: i === SALES_7D.length - 2 ? 'var(--color-primary)' : 'var(--orange-200)' }} />
                  <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)' }}>{d.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* escrow flow */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Dòng tiền Escrow</span>
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

        {/* recent orders */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginTop: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Đơn hàng gần đây</span>
            <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} iconRight="chevron-right" onClick={() => onNav('orders')}>Xem tất cả</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}>
              <th style={th}>Mã đơn</th><th style={th}>Khách hàng</th><th style={th}>SP</th><th style={{ ...th, textAlign: 'right' }}>Giá trị</th><th style={th}>Thời gian</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th>
            </tr></thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                  <td style={td}><span className="code" style={{ fontSize: 12 }}>{o.id}</span></td>
                  <td style={td}>{o.customer}</td>
                  <td style={{ ...td, color: 'var(--text-muted)' }}>{o.items}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatVND(o.total)}</td>
                  <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }}>{o.when}</td>
                  <td style={td}><StatusBadge status={o.status} /></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    {o.status === 'PAID' ? <Button size="sm" iconLeft="truck">Chuẩn bị</Button> : <Button variant="ghost" size="sm">Chi tiết</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const th = { padding: '10px 18px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 18px', whiteSpace: 'nowrap' };

  window.LZVOverview = Overview;
})();
