/* Vendor escrow wallet: held vs available balances, commission breakdown,
   append-only transaction ledger, withdrawal request. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Money, Modal, Input, Select } = DS;
  const formatVND = Money.format;
  const { WALLET, LEDGER, BANK, downloadCsv } = window.LZV;
  const MIN_WITHDRAW = 100000;
  const T_FILTER = { 'Tất cả giao dịch': null, 'Bán hàng': 'SALE', 'Giải ngân': 'RELEASE', 'Rút tiền': 'PAYOUT', 'Hoàn tiền': 'REFUND' };

  function WithdrawModal({ balance, onClose, onDone, onGoSettings }) {
    const [step, setStep] = React.useState('form'); // form | otp
    const [amount, setAmount] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [err, setErr] = React.useState('');
    const n = Number(amount) || 0;
    const next = () => {
      if (n < MIN_WITHDRAW) { setErr('Số tiền rút tối thiểu ' + formatVND(MIN_WITHDRAW)); return; }
      if (n > balance) { setErr('Số dư ví không đủ để thực hiện giao dịch'); return; }
      setErr(''); setStep('otp');
    };
    return (
      <Modal open onClose={onClose} width={460} title="Yêu cầu rút tiền"
        footer={!BANK.number ? <Button variant="ghost" onClick={onClose}>Đóng</Button> : step === 'form'
          ? <><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button onClick={next}>Tiếp tục</Button></>
          : <><Button variant="ghost" onClick={() => setStep('form')}>Quay lại</Button><Button iconLeft="check" disabled={otp.length < 6} onClick={() => onDone(n)}>Xác nhận rút tiền</Button></>}>
        {!BANK.number
          ? <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn chưa có tài khoản nhận tiền đã xác minh. <a onClick={onGoSettings} style={{ color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 }}>Thêm ở Cài đặt</a> trước khi rút.</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-body-sm)' }}><span style={{ color: 'var(--text-muted)' }}>Số dư khả dụng</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>{formatVND(balance)}</b></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <Icon name="credit-card" size={18} style={{ color: 'var(--blue-600)' }} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{BANK.bank} · {BANK.holder}</div><div className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-muted)' }}>•••• •••• {BANK.number.slice(-4)}</div></div>
                <Badge variant="mint" icon="badge-check">Đã xác minh</Badge>
              </div>
              {step === 'form'
                ? <div>
                    <Input label="Số tiền cần rút (₫)" value={amount} onChange={(e) => { setAmount(e.target.value.replace(/\D/g, '')); setErr(''); }} error={err} placeholder="Tối thiểu 100.000" />
                    <button onClick={() => setAmount(String(balance))} style={{ marginTop: 6, border: 0, padding: 0, background: 'transparent', color: 'var(--orange-600)', font: '600 12px var(--font-sans)', cursor: 'pointer' }}>Rút toàn bộ</button>
                  </div>
                : <div><Input label={'Mã OTP gửi tới email để xác nhận rút ' + formatVND(n)} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Nhập đủ 6 số" /></div>}
            </div>}
      </Modal>
    );
  }

  const TYPE_BADGE = {
    SALE:    ['warning', 'Bán hàng'],
    RELEASE: ['success', 'Giải ngân'],
    PAYOUT:  ['neutral', 'Rút tiền'],
    REFUND:  ['danger',  'Hoàn tiền'],
  };

  function Wallet() {
    const [open, setOpen] = React.useState(false);
    const [available, setAvailable] = React.useState(WALLET.available);
    const [rows, setRows] = React.useState(LEDGER);
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [type, setType] = React.useState('Tất cả giao dịch');
    const [q, setQ] = React.useState('');
    const [toast, setToast] = React.useState('');
    const shown = rows.filter((r) => !T_FILTER[type] || r.type === T_FILTER[type]).filter((r) => (r.ref + ' ' + r.label).toLowerCase().includes(q.trim().toLowerCase()));
    const withdraw = (n) => {
      setAvailable((a) => a - n);
      setRows((rs) => [{ date: 'Vừa xong', ref: 'PAYOUT-00' + (13 + rs.length), type: 'PAYOUT', label: 'Rút tiền về ngân hàng (chờ duyệt)', gross: -n, commission: 0, net: -n, bucket: 'PAYOUT' }, ...rs]);
      setOpen(false);
      setToast('Lệnh rút tiền đã được tạo thành công và đang chờ kế toán sàn phê duyệt giải ngân trong 24 giờ làm việc');
      setTimeout(() => setToast(''), 4000);
    };
    const exportCsv = () => downloadCsv('so-giao-dich-vi.csv', [['Thời gian', 'Mã tham chiếu', 'Loại', 'Diễn giải', 'Gross', 'Hoa hồng', 'Net'], ...shown.map((r) => [r.date, r.ref, TYPE_BADGE[r.type][1], r.label, r.gross, r.commission, r.net])]);

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
            <div style={{ font: '800 30px var(--font-sans)', margin: '12px 0 4px', fontVariantNumeric: 'tabular-nums' }}>{formatVND(available)}</div>
            <div style={{ font: '12px var(--font-sans)', color: 'rgba(255,255,255,.6)' }}>Có thể rút về ngân hàng</div>
            <Button block style={{ marginTop: 16 }} iconLeft="hand-coins" onClick={() => setOpen(true)}>Yêu cầu rút tiền</Button>
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
              <Button variant="ghost" size="sm" iconLeft="sliders-horizontal" onClick={() => setFilterOpen((o) => !o)}>Lọc</Button>
              <Button variant="secondary" size="sm" iconLeft="download" onClick={exportCsv}>Xuất CSV</Button>
            </div>
          </div>
          {filterOpen && <div style={{ display: 'flex', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--gray-25)' }}>
            <div style={{ width: 200 }}><Select value={type} onChange={(e) => setType(e.target.value)}>{Object.keys(T_FILTER).map((k) => <option key={k}>{k}</option>)}</Select></div>
            <div style={{ flex: 1, maxWidth: 320 }}><Input iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mã đơn, diễn giải..." /></div>
          </div>}
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead>
              <tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}>
                <th style={th}>Thời gian</th><th style={th}>Mã tham chiếu</th><th style={th}>Loại</th><th style={th}>Diễn giải</th>
                <th style={{ ...th, textAlign: 'right' }}>Gross</th><th style={{ ...th, textAlign: 'right' }}>Hoa hồng</th><th style={{ ...th, textAlign: 'right' }}>Net</th><th style={{ ...th, textAlign: 'center' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && <tr><td colSpan="8" style={{ padding: 36, textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Chưa có giao dịch nào trong tháng này</td></tr>}
              {shown.map((r, i) => {
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
        {open && <WithdrawModal balance={available} onClose={() => setOpen(false)} onDone={withdraw} onGoSettings={() => { window.location.search = '?screen=settings'; }} />}
        {toast && <div role="status" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', maxWidth: '80vw', background: 'var(--ink-900)', color: '#fff', padding: '11px 18px', borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', boxShadow: 'var(--shadow-lg)', zIndex: 1000 }}>{toast}</div>}
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
