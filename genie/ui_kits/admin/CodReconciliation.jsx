/* Admin: COD reconciliation with the carrier (UC-LOG-03). SePay reports the money the
   carrier sent; staff upload its statement; the total must equal the money received,
   each line is matched by tracking code and amount, and matched lines fund escrow. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Money } = DS;
  const { COD_SESSIONS, COD_SHIPMENTS, downloadCsv } = window.LZA;
  const fmt = Money.format;

  const parseCsv = (text) => text.split(/\r?\n/).slice(1).map((l) => l.split(',').map((c) => c.replace(/^"|"$/g, '').trim())).filter((c) => c[0]).map(([code, amount, fee]) => ({ code, amount: Number(amount) || 0, fee: Number(fee) || 0 }));
  const matchLine = (line) => {
    const hit = COD_SHIPMENTS[line.code];
    if (!hit) return { ...line, result: 'UNKNOWN' };
    return { ...line, order: hit.order, expected: hit.total, result: hit.total === line.amount ? 'MATCH' : 'AMOUNT' };
  };
  const RESULT = { MATCH: ['success', 'Khớp'], AMOUNT: ['danger', 'Lệch số tiền'], UNKNOWN: ['danger', 'Không tìm thấy vận đơn'] };

  function CodReconciliation() {
    const [rows, setRows] = React.useState(COD_SESSIONS);
    const [sel, setSel] = React.useState(COD_SESSIONS[0].id);
    const [err, setErr] = React.useState('');
    const fileRef = React.useRef(null);
    const cur = rows.find((s) => s.id === sel);
    const patch = (p) => setRows((rs) => rs.map((s) => (s.id === sel ? { ...s, ...p } : s)));
    const lines = (cur.lines || []).map(matchLine);
    const gross = lines.reduce((n, l) => n + l.amount, 0);
    const fees = lines.reduce((n, l) => n + l.fee, 0);
    const totalOk = lines.length > 0 && gross - fees === cur.received;
    const matched = lines.filter((l) => l.result === 'MATCH');
    const flagged = lines.length - matched.length;

    const load = (e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (!/\.csv$/i.test(f.name)) { setErr('Bảng kê phải là tệp CSV.'); return; }
      const r = new FileReader();
      r.onload = () => {
        const parsed = parseCsv(String(r.result));
        if (!parsed.length) { setErr('Không đọc được dòng nào. Cột cần có: mã vận đơn, số tiền, phí thu hộ.'); return; }
        setErr(''); patch({ lines: parsed, file: f.name });
      };
      r.readAsText(f);
    };
    const pending = rows.filter((s) => s.status !== 'DONE');

    return (
      <div style={{ maxWidth: 1180, display: 'grid', gridTemplateColumns: '340px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Phiên đối soát</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{pending.length} phiên chờ · {fmt(pending.reduce((n, s) => n + s.received, 0))} đã về tài khoản sàn</div>
          </div>
          {rows.map((s) => (
            <button key={s.id} onClick={() => { setSel(s.id); setErr(''); }} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, borderBottom: '1px solid var(--border-subtle)', padding: '12px 16px', cursor: 'pointer', background: s.id === sel ? 'var(--blue-50)' : '#fff' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="code" style={{ flex: 1, font: '600 13px var(--font-mono)', color: 'var(--text-strong)' }}>{s.id}</span><Badge variant={s.status === 'DONE' ? 'success' : 'warning'}>{s.status === 'DONE' ? 'Đã đối soát' : 'Chờ bảng kê'}</Badge></span>
              <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{s.carrier} · {fmt(s.received)} · {s.at}</span>
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ font: 'var(--weight-bold) var(--text-lg) var(--font-sans)', color: 'var(--text-strong)' }}>Đã nhận {fmt(cur.received)} từ {cur.carrier}</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>SePay báo tiền vào lúc {cur.at} · Mã giao dịch <span className="code">{cur.ref}</span></div>
            </div>
            <input ref={fileRef} type="file" hidden accept=".csv,text/csv" onChange={load} />
            {cur.status !== 'DONE' && <>
              <Button size="sm" variant="ghost" iconLeft="file-text" onClick={() => { setErr(''); patch({ lines: cur.sample, file: 'bang-ke-mau.csv' }); }}>Dùng bảng kê mẫu</Button>
              <Button size="sm" variant="secondary" iconLeft="upload" onClick={() => fileRef.current.click()}>Tải bảng kê CSV</Button>
            </>}
          </div>
          {err && <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', color: 'var(--red-600)', font: 'var(--type-body-sm)' }}><Icon name="circle-alert" size={15} />{err}</div>}
          {lines.length === 0
            ? <div style={{ padding: '56px 20px', textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Chưa có bảng kê. Tải tệp CSV của hãng với 3 cột: mã vận đơn, số tiền, phí thu hộ.</div>
            : <>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 20px', background: totalOk ? 'var(--mint-50)' : 'var(--red-50)', font: 'var(--type-body-sm)', color: 'var(--text-body)', flexWrap: 'wrap' }}>
                <Icon name={totalOk ? 'circle-check' : 'triangle-alert'} size={17} style={{ color: totalOk ? 'var(--mint-600)' : 'var(--red-600)', flex: 'none' }} />
                <span>{cur.file}: tổng {fmt(gross)} − phí {fmt(fees)} = <b>{fmt(gross - fees)}</b>{totalOk ? ', khớp số tiền đã nhận.' : ', lệch ' + fmt(Math.abs(gross - fees - cur.received)) + ' so với số tiền đã nhận.'}</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
                  <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}><th style={c}>Mã vận đơn</th><th style={c}>Đơn hàng</th><th style={{ ...c, textAlign: 'right' }}>Bảng kê</th><th style={{ ...c, textAlign: 'right' }}>Trên đơn</th><th style={{ ...c, textAlign: 'right' }}>Phí</th><th style={c}>Kết quả</th></tr></thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.code} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                        <td style={c}><span className="code">{l.code}</span></td>
                        <td style={c}><span className="code">{l.order || '—'}</span></td>
                        <td style={{ ...c, textAlign: 'right' }}>{fmt(l.amount)}</td>
                        <td style={{ ...c, textAlign: 'right' }}>{l.expected != null ? fmt(l.expected) : '—'}</td>
                        <td style={{ ...c, textAlign: 'right' }}>{fmt(l.fee)}</td>
                        <td style={c}><Badge variant={RESULT[l.result][0]}>{RESULT[l.result][1]}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                {cur.status === 'DONE'
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', color: 'var(--mint-600)' }}><Icon name="circle-check" size={16} />Đã nạp ký quỹ {matched.length} đơn; đơn đã xác nhận hoặc quá 7 ngày được hoàn tất và giải ngân.</span>
                  : <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{matched.length} dòng khớp sẽ chuyển ký quỹ sang giữ tiền.{flagged > 0 && <b style={{ color: 'var(--red-600)' }}> {flagged} dòng cần xử lý tay với hãng.</b>}</span>}
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="ghost" iconLeft="download" onClick={() => downloadCsv('doi-soat-' + cur.id + '.csv', [['Mã vận đơn', 'Đơn hàng', 'Bảng kê', 'Trên đơn', 'Phí', 'Kết quả'], ...lines.map((l) => [l.code, l.order || '', l.amount, l.expected == null ? '' : l.expected, l.fee, RESULT[l.result][1]])])}>Xuất kết quả</Button>
                  {cur.status !== 'DONE' && <Button size="sm" iconLeft="check" disabled={!totalOk || matched.length === 0} onClick={() => patch({ status: 'DONE' })}>Xác nhận đối soát</Button>}
                </span>
              </div>
            </>}
        </div>
      </div>
    );
  }
  const c = { padding: '11px 16px', whiteSpace: 'nowrap' };
  window.LZACod = CodReconciliation;
})();
