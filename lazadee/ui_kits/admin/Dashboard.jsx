/* Admin: platform finance overview — 8 KPI tiles (month switch on commission and
   voucher cost), growth area chart with range switch, breakout vendors with search
   and paging. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Avatar, Button } = DS;
  const { DASHBOARD } = window.LZA;
  const vnd = (n) => n.toLocaleString('vi-VN') + '₫';

  function MonthPick({ value, onChange }) {
    const [open, setOpen] = React.useState(false);
    return (
      <span style={{ position: 'relative', marginLeft: 'auto' }}>
        <button onClick={() => setOpen((o) => !o)} style={pill}>{value} <Icon name="chevron-down" size={13} /></button>
        {open && <>
          <span onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, width: 130, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 41, padding: 4 }}>
            {DASHBOARD.months.map((m) => <div key={m} onClick={() => { onChange(m); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', font: 'var(--type-body-sm)', background: m === value ? 'var(--blue-50)' : 'transparent', color: m === value ? 'var(--blue-600)' : 'var(--text-body)' }}>{m}{m === value && <Icon name="check" size={14} />}</div>)}
          </div>
        </>}
      </span>
    );
  }

  function Tile({ icon, tone, label, value, note, action }) {
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={19} /></span>
          {action}
        </div>
        <div style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ font: '800 22px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', margin: '4px 0' }}>{value}</div>
        <div style={{ font: 'var(--type-caption)', color: note && note.startsWith('+') ? 'var(--green-600)' : 'var(--text-subtle)' }}>{note}</div>
      </div>
    );
  }

  function AreaChart({ points }) {
    const [hover, setHover] = React.useState(null);
    const W = 1000, H = 260, PX = 30, PT = 40, CH = 180;
    const max = Math.max(...points.map((p) => p.v), 1);
    const x = (i) => PX + (points.length > 1 ? i / (points.length - 1) : 0.5) * (W - 2 * PX);
    const y = (v) => PT + (1 - v / max) * CH;
    const line = points.map((p, i) => `${x(i)},${y(p.v)}`).join(' L ');
    const step = points.length > 1 ? (W - 2 * PX) / (points.length - 1) : W;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Biểu đồ tăng trưởng doanh thu" style={{ width: '100%', display: 'block' }}>
        <defs><linearGradient id="lzArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--blue-500)" stopOpacity=".28" /><stop offset="100%" stopColor="var(--blue-500)" stopOpacity="0" /></linearGradient></defs>
        <line x1={PX} y1={PT + CH} x2={W - PX} y2={PT + CH} stroke="var(--border-default)" strokeDasharray="4 4" />
        <path d={`M ${x(0)},${PT + CH} L ${line} L ${x(points.length - 1)},${PT + CH} Z`} fill="url(#lzArea)" />
        <path d={`M ${line}`} fill="none" stroke="var(--blue-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => {
          const on = hover === i, top = p.v === max;
          return (
            <g key={i}>
              <circle cx={x(i)} cy={y(p.v)} r={on || top ? 6 : 4} fill={on || top ? 'var(--blue-500)' : '#fff'} stroke="var(--blue-500)" strokeWidth="2" />
              <text x={x(i)} y={PT + CH + 24} textAnchor="middle" fill={on ? 'var(--text-strong)' : 'var(--text-muted)'} fontSize="12" fontFamily="var(--font-sans)">{p.d}</text>
              {(on || top) && <text x={x(i)} y={y(p.v) - 14} textAnchor="middle" fill="var(--blue-600)" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">{vnd(p.v)}</text>}
              <rect x={x(i) - step / 2} y={0} width={step} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            </g>
          );
        })}
      </svg>
    );
  }

  const PAGE = 5;
  function Dashboard() {
    const [commMonth, setCommMonth] = React.useState(DASHBOARD.months[0]);
    const [costMonth, setCostMonth] = React.useState(DASHBOARD.months[0]);
    const [range, setRange] = React.useState('week');
    const [q, setQ] = React.useState('');
    const [page, setPage] = React.useState(1);
    const D = DASHBOARD;
    const vendors = D.vendors.filter((v) => v.name.toLowerCase().includes(q.trim().toLowerCase()));
    const pages = Math.max(1, Math.ceil(vendors.length / PAGE));
    const shown = vendors.slice((page - 1) * PAGE, page * PAGE);
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
          <Tile icon="shopping-bag" tone={{ bg: 'var(--orange-50)', fg: 'var(--orange-600)' }} label="Tổng GMV Toàn Sàn" value={vnd(D.gmv)} note={'+' + D.gmvGrowth + '% vs tháng trước'} />
          <Tile icon="banknote" tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} label="Doanh thu hoa hồng" value={vnd(D.commission[commMonth])} note="+9,2% vs tháng trước" action={<MonthPick value={commMonth} onChange={setCommMonth} />} />
          <Tile icon="ticket" tone={{ bg: 'var(--flash-50)', fg: 'var(--flash-600)' }} label="Chi phí Voucher / Freeship" value={vnd(D.voucherCost[costMonth])} note="Trợ giá Marketing" action={<MonthPick value={costMonth} onChange={setCostMonth} />} />
          <Tile icon="percent" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} label="Lợi nhuận ròng (Net Profit)" value={vnd(D.commission[commMonth] - D.voucherCost[costMonth])} note="+6,4% vs tháng trước" />
          <Tile icon="lock" tone={{ bg: 'var(--amber-50)', fg: 'var(--amber-600)' }} label="Đang giữ Escrow (toàn sàn)" value={vnd(D.escrow)} note="Tiền đang chờ đối soát" />
          <Tile icon="clock" tone={{ bg: 'var(--purple-50)', fg: 'var(--purple-500)' }} label="Nợ Vendor (Liabilities)" value={vnd(D.liabilities)} note="Số dư chưa payout" />
          <Tile icon="refresh-cw" tone={{ bg: 'var(--red-50, #FDECEA)', fg: 'var(--red-600)' }} label="Tiền chờ hoàn trả (Refunds)" value={vnd(D.refunds)} note={D.refundCount + ' yêu cầu đang xử lý'} />
          <Tile icon="bell" tone={{ bg: 'var(--gray-100)', fg: 'var(--gray-600)' }} label="Cần xử lý (Pending Ops)" value={(D.pendingKyc + D.pendingProducts) + ' mục'} note={D.pendingKyc + ' KYC, ' + D.pendingProducts + ' duyệt SP'} />
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Biểu đồ tăng trưởng</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: 'var(--gray-50)', padding: 4, borderRadius: 6 }}>
              {[['week', 'Tuần này'], ['month', 'Tháng 6'], ['year', 'Năm 2026']].map(([id, label]) => <button key={id} onClick={() => setRange(id)} style={{ border: 0, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', font: '500 12px var(--font-sans)', background: range === id ? '#fff' : 'transparent', color: range === id ? 'var(--text-strong)' : 'var(--text-muted)', boxShadow: range === id ? 'var(--shadow-sm)' : 'none' }}>{label}</button>)}
            </div>
          </div>
          <AreaChart points={D.chart[range]} />
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Vendor tiềm năng bứt phá</span>
            <div style={{ position: 'relative', marginLeft: 'auto', width: 240 }}>
              <span style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Nhập tên shop" style={{ width: '100%', height: 36, paddingLeft: 32, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}><th style={c}>Vendor</th><th style={c}>Ngành hàng</th><th style={c}>Sản phẩm bán ra</th><th style={c}>Đánh giá</th><th style={c}>Tăng trưởng</th><th style={{ ...c, textAlign: 'right' }}>Lợi nhuận</th></tr></thead>
            <tbody>
              {shown.map((v) => (
                <tr key={v.name} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                  <td style={c}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600, color: 'var(--text-strong)' }}><Avatar name={v.name} size={30} />{v.name}</span></td>
                  <td style={c}>{v.cat}</td>
                  <td style={c}>{v.sold.toLocaleString('vi-VN')}</td>
                  <td style={c}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="star" size={14} style={{ color: 'var(--gold-500)', fill: 'var(--gold-500)' }} />{v.rating}</span></td>
                  <td style={{ ...c, color: 'var(--green-600)', fontWeight: 600 }}>+{v.growth}%</td>
                  <td style={{ ...c, textAlign: 'right', fontWeight: 600 }}>{vnd(v.rev)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <span>Hiển thị {vendors.length ? (page - 1) * PAGE + 1 : 0} - {Math.min(page * PAGE, vendors.length)} trong tổng số {vendors.length} shop</span>
            <Button size="sm" variant="outline" disabled={page === 1} style={{ marginLeft: 'auto' }} onClick={() => setPage((p) => p - 1)}>Trước</Button>
            <span>Trang {page} / {pages}</span>
            <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Sau</Button>
          </div>
        </div>
      </div>
    );
  }
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 8px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', background: '#fff', font: '500 12px var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer' };
  const c = { padding: '11px 20px', whiteSpace: 'nowrap' };
  window.LZADashboard = Dashboard;
})();
