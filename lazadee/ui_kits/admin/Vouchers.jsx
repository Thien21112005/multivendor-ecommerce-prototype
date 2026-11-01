/* Lazadee Admin — Voucher sàn (platform-wide vouchers sponsored by Lazadee).
   KPIs + status tabs + table with usage progress, sponsor, and a create/edit
   modal (reuses the shop voucher form pattern with platform-only fields:
   scope = Toàn sàn, sponsor select, budget cap). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Select, Input, Radio, Tabs, Modal, Checkbox } = DS;
  const { PLATFORM_VOUCHERS } = window.LZA;
  const fmtV = (n) => n.toLocaleString('vi-VN') + '₫';
  const genCode = () => { const C = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 8; i++) s += C[Math.floor(Math.random() * C.length)]; return s; };

  const STATUS = {
    ACTIVE: { label: 'Đang chạy', variant: 'success' },
    SCHEDULED: { label: 'Sắp diễn ra', variant: 'primary' },
    ENDED: { label: 'Đã kết thúc', variant: 'neutral' },
    DISABLED: { label: 'Đã tắt', variant: 'danger' },
  };
  const KIND = { percent: 'Giảm %', fixed: 'Giảm tiền', freeship: 'Freeship' };
  const valueLabel = (v) => v.type === 'percent' ? `${v.value}%` : v.type === 'fixed' ? fmtV(v.value) : 'Miễn ship';

  function PlatformVouchers() {
    const [tab, setTab] = React.useState('all');
    const [list, setList] = React.useState(PLATFORM_VOUCHERS);
    const [modal, setModal] = React.useState(null); // null | {} | voucher
    const [confirm, setConfirm] = React.useState(null);
    const filtered = list.filter((v) => tab === 'all' || (tab === 'active' ? v.status === 'ACTIVE' : tab === 'scheduled' ? v.status === 'SCHEDULED' : v.status === 'ENDED'));
    const setStatus = (code, status) => setList((l) => l.map((v) => (v.code === code ? { ...v, status } : v)));

    return (
      <div style={{ maxWidth: 1180 }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 18 }}>
          <Kpi icon="ticket" tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} label="Voucher đang chạy" value={list.filter((v) => v.status === 'ACTIVE').length} />
          <Kpi icon="chart-column" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} label="Lượt dùng tháng" value="12.320" />
          <Kpi icon="receipt" tone={{ bg: 'var(--amber-50, #FEF3E2)', fg: 'var(--amber-600, #C77700)' }} label="Tổng giảm giá tháng" value="456.800.000₫" />
          <Kpi icon="calendar" tone={{ bg: 'var(--orange-50)', fg: 'var(--orange-600)' }} label="Voucher sắp ra mắt" value={list.filter((v) => v.status === 'SCHEDULED').length} />
        </div>

        {/* tabs + action */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Tất cả' }, { id: 'active', label: 'Đang chạy' }, { id: 'scheduled', label: 'Sắp diễn ra' }, { id: 'ended', label: 'Đã kết thúc' }]} />
          <Button iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={() => setModal({})}>Tạo voucher sàn</Button>
        </div>

        {/* table */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 1040, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={hrow}>
              <th style={th}>Mã</th><th style={th}>Loại</th><th style={{ ...th, textAlign: 'right' }}>Giá trị</th><th style={{ ...th, textAlign: 'right' }}>Đơn tối thiểu</th><th style={{ ...th, textAlign: 'right' }}>Giảm tối đa</th><th style={th}>Sử dụng</th><th style={th}>Thời gian</th><th style={th}>Nhà tài trợ</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th>
            </tr></thead>
            <tbody>
              {filtered.map((v) => {
                const st = STATUS[v.status];
                const pct = Math.min(100, Math.round(v.used / v.total * 100));
                return (
                  <tr key={v.code} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={td}><span className="code" style={{ fontWeight: 600, color: 'var(--orange-600)' }}>{v.code}</span></td>
                    <td style={td}>{KIND[v.type]}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>{valueLabel(v)}</td>
                    <td style={{ ...td, textAlign: 'right' }}>{fmtV(v.minOrder)}</td>
                    <td style={{ ...td, textAlign: 'right' }}>{v.maxDiscount ? fmtV(v.maxDiscount) : '—'}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: pct + '%', height: '100%', background: pct >= 100 ? 'var(--text-subtle)' : 'var(--orange-500)' }} /></div>
                        <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{(v.used / 1000).toFixed(v.used >= 1000 ? 1 : 0).replace('.0', '')}k/{(v.total / 1000)}k</span>
                      </div>
                    </td>
                    <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }}>{v.start}<br />→ {v.end}</td>
                    <td style={td}>{v.sponsor === 'Lazadee' ? <Badge variant="primary">Lazadee</Badge> : <Badge variant="neutral">Co-sponsor</Badge>}</td>
                    <td style={td}><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {v.status === 'ENDED'
                        ? <Button size="sm" variant="ghost" onClick={() => setModal({ ...v, _dup: true })}>Nhân bản</Button>
                        : <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                            <Button size="sm" variant="ghost" onClick={() => setModal(v)}>Sửa</Button>
                            <Button size="sm" variant="ghost" style={{ color: 'var(--red-600)' }} onClick={() => setConfirm(v)}>{v.status === 'SCHEDULED' ? 'Huỷ' : 'Tắt'}</Button>
                          </div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {modal && <PlatformVoucherModal voucher={modal} onClose={() => setModal(null)} />}
        {confirm && <Modal open onClose={() => setConfirm(null)} title={confirm.status === 'SCHEDULED' ? 'Huỷ voucher' : 'Tắt voucher'}
          footer={<><Button variant="ghost" onClick={() => setConfirm(null)}>Huỷ</Button><Button variant="danger" onClick={() => { setStatus(confirm.code, 'DISABLED'); setConfirm(null); }}>{confirm.status === 'SCHEDULED' ? 'Huỷ voucher' : 'Tắt voucher'}</Button></>}>
          <div style={{ width: 'min(420px, 80vw)', font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>{confirm.status === 'SCHEDULED' ? 'Huỷ' : 'Tắt'} voucher <b className="code">{confirm.code}</b>? Khách hàng sẽ không thể dùng mã này nữa.</div>
        </Modal>}
      </div>
    );
  }

  /* Create/edit a platform voucher — like the shop modal but with platform-only fields. */
  function PlatformVoucherModal({ voucher, onClose }) {
    const editing = voucher && voucher.code && !voucher._dup;
    const [f, setF] = React.useState({
      code: voucher && voucher.code ? (voucher._dup ? '' : voucher.code) : '',
      kind: (voucher && voucher.type) || 'percent',
      value: voucher && voucher.value ? String(voucher.value) : '', cap: voucher && voucher.maxDiscount ? String(voucher.maxDiscount) : '',
      minOrder: voucher && voucher.minOrder ? String(voucher.minOrder) : '', total: voucher && voucher.total ? String(voucher.total) : '',
      perUser: voucher && voucher.perUser ? String(voucher.perUser) : '1', start: '', end: '', sponsor: (voucher && voucher.sponsor) || 'Lazadee', budget: '',
    });
    const [err, setErr] = React.useState({});
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const KINDS = [['percent', 'Giảm %', 'percent'], ['fixed', 'Giảm ₫', 'banknote'], ['freeship', 'Freeship', 'truck']];
    const submit = () => {
      const e = {};
      if (!/^[A-Z0-9]{6,12}$/.test(f.code)) e.code = 'Mã 6–12 ký tự, chỉ chữ HOA và số';
      if (f.kind !== 'freeship') { if (!f.value || Number(f.value) <= 0) e.value = 'Giá trị phải > 0'; else if (f.kind === 'percent' && Number(f.value) > 100) e.value = 'Phần trăm ≤ 100'; }
      if (!f.total || Number(f.total) <= 0) e.total = 'Số lượng phải > 0';
      if (f.start && f.end && f.end <= f.start) e.end = 'Ngày kết thúc phải sau ngày bắt đầu';
      setErr(e);
      if (Object.keys(e).length === 0) onClose();
    };
    return (
      <Modal open onClose={onClose} width={580}
        title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="ticket" size={18} style={{ color: 'var(--color-primary)' }} />{editing ? `Chỉnh sửa voucher ${voucher.code}` : 'Tạo Voucher Sàn'}</span>}
        footer={<><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="check" onClick={submit}>{editing ? 'Lưu thay đổi' : 'Tạo voucher'}</Button></>}>
        <div style={{ width: 'min(540px, 84vw)', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <label style={lab}>Mã voucher</label>
              <button onClick={() => set('code', genCode())} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, border: 0, background: 'transparent', color: 'var(--orange-600)', font: '600 12px var(--font-sans)', cursor: 'pointer' }}><Icon name="refresh-cw" size={13} />Tự tạo</button>
            </div>
            <Input value={f.code} onChange={(e) => set('code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="VD: LAZADEE50" error={err.code} />
            {!err.code && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 5 }}>6–12 ký tự, chỉ chữ HOA và số.</div>}
          </div>
          <div>
            <label style={lab}>Loại giảm giá</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {KINDS.map(([id, label, icon]) => { const on = f.kind === id; return (
                <button key={id} onClick={() => set('kind', id)} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary)' : '#fff', color: on ? '#fff' : 'var(--text-body)', font: '600 13px var(--font-sans)', cursor: 'pointer' }}><Icon name={icon} size={15} />{label}</button>
              ); })}
            </div>
          </div>
          {f.kind === 'freeship'
            ? <div style={{ display: 'flex', gap: 9, alignItems: 'center', background: 'var(--mint-50)', borderRadius: 'var(--radius-md)', padding: '11px 13px', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><Icon name="truck" size={16} style={{ color: 'var(--mint-600)' }} />Miễn phí vận chuyển cho đơn đủ điều kiện.</div>
            : <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}><Input label="Giá trị" value={f.value} onChange={(e) => set('value', e.target.value.replace(/\D/g, ''))} iconRight={f.kind === 'percent' ? 'percent' : 'banknote'} error={err.value} /></div>
                {f.kind === 'percent' && <div style={{ flex: 1 }}><Input label="Giảm tối đa (₫)" value={f.cap} onChange={(e) => set('cap', e.target.value.replace(/\D/g, ''))} iconRight="banknote" placeholder="100000" /></div>}
              </div>}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}><Input label="Đơn tối thiểu (₫)" value={f.minOrder} onChange={(e) => set('minOrder', e.target.value.replace(/\D/g, ''))} iconRight="banknote" placeholder="500000" /></div>
            <div style={{ flex: 1 }}><Input label="Số lượng phát hành" value={f.total} onChange={(e) => set('total', e.target.value.replace(/\D/g, ''))} error={err.total} placeholder="10000" /></div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ width: 150 }}><Input label="Giới hạn / người" value={f.perUser} onChange={(e) => set('perUser', e.target.value.replace(/\D/g, ''))} /></div>
            <div style={{ flex: 1 }}><Input label="Ngân sách tối đa (₫)" value={f.budget} onChange={(e) => set('budget', e.target.value.replace(/\D/g, ''))} iconRight="banknote" placeholder="500000000" /></div>
          </div>
          <div>
            <label style={lab}>Thời gian hiệu lực</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
              <input type="date" value={f.start} onChange={(e) => set('start', e.target.value)} style={dateInput} />
              <Icon name="arrow-right" size={16} style={{ color: 'var(--text-subtle)' }} />
              <input type="date" value={f.end} onChange={(e) => set('end', e.target.value)} style={{ ...dateInput, borderColor: err.end ? 'var(--red-500)' : 'var(--border-default)' }} />
            </div>
            {err.end && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{err.end}</div>}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}><label style={lab}>Phạm vi</label><div style={{ marginTop: 6 }}><Badge variant="primary" icon="store">Toàn sàn</Badge></div></div>
            <div style={{ flex: 1 }}><Select label="Nhà tài trợ" value={f.sponsor} onChange={(e) => set('sponsor', e.target.value)}><option>Lazadee</option><option>Co-sponsor với Shop</option></Select></div>
          </div>
        </div>
      </Modal>
    );
  }

  function Kpi({ icon, tone, label, value }) {
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={17} /></span>
          <span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ font: '800 24px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      </div>
    );
  }

  const hrow = { font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' };
  const th = { padding: '11px 14px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };
  const dateInput = { flex: 1, height: 44, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' };

  window.LZAVouchers = PlatformVouchers;
})();
