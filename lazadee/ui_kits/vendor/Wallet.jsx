/* Vendor escrow wallet: held vs available balances, commission breakdown,
   append-only transaction ledger, withdrawal request. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Money } = DS;
  const formatVND = Money.format;
  const { WALLET, LEDGER } = window.LZV;

  const TYPE_BADGE = {
    SALE:    ['warning', 'Bán hàng'],
    RELEASE: ['success', 'Giải ngân'],
    PAYOUT:  ['neutral', 'Rút tiền'],
    REFUND:  ['danger',  'Hoàn tiền'],
  };

  function Wallet() {
    const [show, setShow] = React.useState(false);

    return (
      <div style={{ maxWidth: 1180 }}>
        {/* balance cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
          {/* available */}
          <div style={{ ...bal, background: 'linear-gradient(135deg, var(--ink-800), var(--ink-900))', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="wallet" size={18} style={{ color: 'var(--mint-500)' }} />
              <span style={{ font: '600 13px var(--font-sans)', color: 'rgba(255,255,255,.78)' }}>Số dư khả dụng</span>
            </div>
            <div style={{ font: '800 30px var(--font-sans)', margin: '12px 0 4px', fontVariantNumeric: 'tabular-nums' }}>{formatVND(WALLET.available)}</div>
            <div style={{ font: '12px var(--font-sans)', color: 'rgba(255,255,255,.6)' }}>Có thể rút về ngân hàng</div>
            <Button block style={{ marginTop: 16 }} iconLeft="hand-coins">Yêu cầu rút tiền</Button>
          </div>
          {/* held / escrow */}
          <div style={{ ...bal, border: '1px solid var(--amber-200, #FCE3B0)', background: 'var(--amber-50)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="lock" size={18} style={{ color: 'var(--amber-600)' }} />
              <span style={{ font: '600 13px var(--font-sans)', color: 'var(--amber-600)' }}>Đang giữ (Escrow)</span>
            </div>
            <div style={{ font: '800 30px var(--font-sans)', margin: '12px 0 4px', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(WALLET.held)}</div>
            <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)' }}>Giải ngân khi đơn chuyển COMPLETED</div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, font: '12px var(--font-sans)', color: 'var(--amber-600)' }}>
              <Icon name="clock" size={14} /> Tự động giải ngân sau khi khách xác nhận
            </div>
          </div>
          {/* this month */}
          <div style={{ ...bal, border: '1px solid var(--border-subtle)', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="chart-column" size={18} style={{ color: 'var(--color-primary)' }} />
              <span style={{ font: '600 13px var(--font-sans)', color: 'var(--text-muted)' }}>Doanh thu tháng 6</span>
            </div>
            <div style={{ font: '800 30px var(--font-sans)', margin: '12px 0 4px', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(WALLET.monthRevenue)}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 12px var(--font-sans)', color: 'var(--green-600)' }}><Icon name="arrow-up-right" size={14} /> +{WALLET.monthGrowth}% so với tháng trước</div>
          </div>
        </div>

        {/* commission explainer */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="receipt" size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Cách tính tiền về ví</span>
            <Badge variant="outline">Phí sàn 5%</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Flow label="Tổng tiền hàng (Gross)" value="778.000₫" tone="var(--text-strong)" />
            <Op>−</Op>
            <Flow label="Phí hoa hồng (5%)" value="38.900₫" tone="var(--gray-500)" />
            <Op>=</Op>
            <Flow label="Thực nhận (Net) → Escrow" value="739.100₫" tone="var(--amber-600)" bg="var(--amber-50)" />
            <Op>→</Op>
            <Flow label="Giải ngân khi hoàn tất" value="739.100₫" tone="var(--green-600)" bg="var(--green-50)" />
          </div>
        </div>

        {/* ledger */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Sổ giao dịch ví</span>
            <Badge variant="neutral"><Icon name="lock" size={11} /> Append-only</Badge>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Button variant="ghost" size="sm" iconLeft="sliders-horizontal">Lọc</Button>
              <Button variant="secondary" size="sm" iconLeft="download">Xuất CSV</Button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead>
              <tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}>
                <th style={th}>Thời gian</th><th style={th}>Mã tham chiếu</th><th style={th}>Loại</th><th style={th}>Diễn giải</th>
                <th style={{ ...th, textAlign: 'right' }}>Gross</th><th style={{ ...th, textAlign: 'right' }}>Hoa hồng</th><th style={{ ...th, textAlign: 'right' }}>Net</th><th style={{ ...th, textAlign: 'center' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {LEDGER.map((r, i) => {
                const [bv, bl] = TYPE_BADGE[r.type];
                const neg = r.net < 0;
                return (
                  <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }}>{r.date}</td>
                    <td style={td}><span className="code" style={{ fontSize: 12 }}>{r.ref}</span></td>
                    <td style={td}><Badge variant={bv}>{bl}</Badge></td>
                    <td style={{ ...td, color: 'var(--text-muted)' }}>{r.label}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 500 }}>{r.gross ? formatVND(r.gross) : '—'}</td>
                    <td style={{ ...td, textAlign: 'right', color: 'var(--gray-500)' }}>{r.commission ? formatVND(-Math.abs(r.commission)) : '—'}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: neg ? 'var(--red-600)' : 'var(--green-600)' }}>{neg ? '' : '+'}{formatVND(r.net)}</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      {r.bucket === 'HELD' && <StatusBadge status="HELD" label="Escrow" dot={false} />}
                      {r.bucket === 'AVAILABLE' && <StatusBadge status="AVAILABLE" label="Khả dụng" dot={false} />}
                      {r.bucket === 'PAYOUT' && <Badge variant="neutral">Đã rút</Badge>}
                      {r.bucket === 'REFUND' && <Badge variant="danger">Hoàn</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    );
  }

  function Flow({ label, value, tone, bg }) {
    return (
      <div style={{ background: bg || 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '10px 14px', minWidth: 150 }}>
        <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ font: '700 18px var(--font-sans)', color: tone, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      </div>
    );
  }
  const Op = ({ children }) => <span style={{ font: '700 20px var(--font-sans)', color: 'var(--text-subtle)' }}>{children}</span>;

  const bal = { borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' };
  const th = { padding: '10px 12px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 12px', whiteSpace: 'nowrap' };

  window.LZVWallet = Wallet;
})();
