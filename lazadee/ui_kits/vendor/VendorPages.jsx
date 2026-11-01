/* Lazadee Seller Center — extra screens: Khuyến mãi (shop vouchers + flash sale),
   Đánh giá (rating summary + reply to reviews), Phân tích (KPIs, revenue trend,
   top products, traffic), Cài đặt (shop profile, shipping, payout, toggles). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Switch, Input, Select, Avatar, Rating, Money, Tabs, Modal, Checkbox, Radio } = DS;
  const fmt = (n) => Money.format(n);
  const genCode = () => { const C = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 8; i++) s += C[Math.floor(Math.random() * C.length)]; return s; };

  /* ============================== KHUYẾN MÃI ============================== */
  const VOUCHERS = [
    { id: 'SALE15', type: 'Giảm %', value: '15%', cap: 'Tối đa 50k', cond: 'Đơn từ 250k', used: 142, total: 500, state: 'ACTIVE', ends: '20/06/2026' },
    { id: 'FREESHIP', type: 'Freeship', value: '0₫', cap: 'Phí ship', cond: 'Đơn từ 99k', used: 380, total: 1000, state: 'ACTIVE', ends: '30/06/2026' },
    { id: 'NEW30K', type: 'Giảm tiền', value: '30k', cap: '', cond: 'Khách mới', used: 0, total: 300, state: 'SCHEDULED', ends: '01/07/2026' },
    { id: 'TET50', type: 'Giảm tiền', value: '50k', cap: '', cond: 'Đơn từ 500k', used: 210, total: 210, state: 'ENDED', ends: '15/02/2026' },
  ];
  const V_STATE = { ACTIVE: { label: 'Đang chạy', c: 'var(--mint-600)', bg: 'var(--mint-50)' }, SCHEDULED: { label: 'Đã lên lịch', c: 'var(--blue-600)', bg: 'var(--blue-50)' }, ENDED: { label: 'Đã kết thúc', c: 'var(--text-muted)', bg: 'var(--surface-sunken)' } };

  function Promo() {
    const [voucherModal, setVoucherModal] = React.useState(null); // null | {} | voucher
    const [confirmOff, setConfirmOff] = React.useState(null);
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle icon="megaphone" title="Khuyến mãi của Shop" sub="Tạo voucher và tham gia chiến dịch của sàn" />
          <Button iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={() => setVoucherModal({})}>Tạo voucher</Button>
        </div>

        {/* flash sale banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(110deg, var(--flash-600, #DB1F4E), var(--flash-500))', color: '#fff', borderRadius: 'var(--radius-lg)', padding: '18px 22px', marginBottom: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="zap" size={26} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--weight-bold) var(--text-lg) var(--font-sans)' }}>FLASH SALE 12.12 — Đăng ký gian hàng</div>
            <div style={{ font: 'var(--type-body-sm)', color: 'rgba(255,255,255,.9)' }}>Hạn đăng ký: 10/06/2026 · Chọn tối đa 20 sản phẩm tham gia khung giờ vàng.</div>
          </div>
          <Button variant="secondary">Đăng ký ngay</Button>
        </div>

        {/* KPI mini */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 18 }}>
          <MiniStat icon="ticket" tone={{ bg: 'var(--orange-50)', fg: 'var(--orange-600)' }} label="Voucher đang chạy" value="2" />
          <MiniStat icon="user" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} label="Lượt dùng tháng này" value="522" />
          <MiniStat icon="banknote" tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} label="Doanh thu từ KM" value={fmt(8400000)} />
        </div>

        {/* voucher table */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-subtle)', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Mã giảm giá của Shop</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
              <thead><tr style={hrow}><th style={th}>Mã</th><th style={th}>Loại</th><th style={th}>Điều kiện</th><th style={th}>Đã dùng</th><th style={th}>Trạng thái</th><th style={th}>Kết thúc</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {VOUCHERS.map((v) => {
                  const st = V_STATE[v.state];
                  return (
                    <tr key={v.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                      <td style={td}><span className="code" style={{ fontWeight: 600, color: 'var(--orange-600)' }}>{v.id}</span></td>
                      <td style={td}>{v.type} <b>{v.value}</b> {v.cap && <span style={{ color: 'var(--text-subtle)' }}>· {v.cap}</span>}</td>
                      <td style={{ ...td, color: 'var(--text-muted)' }}>{v.cond}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 70, height: 6, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (v.used / v.total * 100) + '%', height: '100%', background: 'var(--orange-500)' }} /></div>
                          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{v.used}/{v.total}</span>
                        </div>
                      </td>
                      <td style={td}><span style={{ display: 'inline-flex', alignItems: 'center', font: '600 12px var(--font-sans)', color: st.c, background: st.bg, borderRadius: 'var(--radius-pill)', padding: '3px 10px' }}>{st.label}</span></td>
                      <td style={{ ...td, color: 'var(--text-muted)' }}>{v.ends}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{v.state === 'ENDED' ? <Button size="sm" variant="ghost" onClick={() => setVoucherModal({ ...v, _dup: true })}>Nhân bản</Button> : <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}><Button size="sm" variant="ghost" onClick={() => setVoucherModal(v)}>Chỉnh sửa</Button>{v.state === 'ACTIVE' && <Button size="sm" variant="ghost" style={{ color: 'var(--red-600)' }} onClick={() => setConfirmOff(v)}>Tắt</Button>}</div>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {voucherModal && <VoucherFormModal voucher={voucherModal} onClose={() => setVoucherModal(null)} />}
        {confirmOff && <Modal open onClose={() => setConfirmOff(null)} title="Tắt voucher"
          footer={<><Button variant="ghost" onClick={() => setConfirmOff(null)}>Huỷ</Button><Button variant="danger" iconLeft="power" onClick={() => setConfirmOff(null)}>Tắt voucher</Button></>}>
          <div style={{ width: 'min(420px, 80vw)', font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Tắt voucher <b className="code">{confirmOff.id}</b>? Khách hàng sẽ không thể dùng mã này nữa.</div>
        </Modal>}
      </div>
    );
  }

  /* ---- VĐ-3: shop voucher create/edit modal (also reused by admin platform vouchers) ---- */
  function VoucherFormModal({ voucher, onClose, platform }) {
    const editing = voucher && voucher.id && !voucher._dup;
    const [f, setF] = React.useState({
      code: voucher && voucher.id ? (voucher._dup ? '' : voucher.id) : '',
      kind: (voucher && voucher.kind) || 'percent',
      value: '', cap: '', minOrder: '', total: '', perUser: '1', start: '', end: '',
      scope: 'all', sponsor: 'Lazadee', budget: '',
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
        title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="ticket" size={18} style={{ color: 'var(--color-primary)' }} />{editing ? `Chỉnh sửa voucher ${voucher.id}` : (platform ? 'Tạo Voucher Sàn' : 'Tạo Voucher Shop')}</span>}
        footer={<><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="check" onClick={submit}>{editing ? 'Lưu thay đổi' : 'Tạo voucher'}</Button></>}>
        <div style={{ width: 'min(540px, 84vw)', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <label style={lab}>Mã voucher</label>
              <button onClick={() => set('code', genCode())} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, border: 0, background: 'transparent', color: 'var(--orange-600)', font: '600 12px var(--font-sans)', cursor: 'pointer' }}><Icon name="refresh-cw" size={13} />Tự tạo</button>
            </div>
            <Input value={f.code} onChange={(e) => set('code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="VD: SUMMER2026" error={err.code} />
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
                {f.kind === 'percent' && <div style={{ flex: 1 }}><Input label="Giảm tối đa (₫)" value={f.cap} onChange={(e) => set('cap', e.target.value.replace(/\D/g, ''))} iconRight="banknote" placeholder="50000" /></div>}
              </div>}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}><Input label="Đơn tối thiểu (₫)" value={f.minOrder} onChange={(e) => set('minOrder', e.target.value.replace(/\D/g, ''))} iconRight="banknote" placeholder="200000" /></div>
            <div style={{ flex: 1 }}><Input label="Số lượng phát hành" value={f.total} onChange={(e) => set('total', e.target.value.replace(/\D/g, ''))} error={err.total} placeholder="500" /></div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ width: 150 }}><Input label="Giới hạn / người" value={f.perUser} onChange={(e) => set('perUser', e.target.value.replace(/\D/g, ''))} /></div>
            {platform && <div style={{ flex: 1 }}><Input label="Ngân sách tối đa (₫)" value={f.budget} onChange={(e) => set('budget', e.target.value.replace(/\D/g, ''))} iconRight="banknote" placeholder="500000000" /></div>}
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
          {platform ? (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}><label style={lab}>Phạm vi</label><div style={{ marginTop: 6 }}><Badge variant="primary" icon="store">Toàn sàn</Badge></div></div>
              <div style={{ flex: 1 }}><Select label="Nhà tài trợ"><option>Lazadee</option><option>Co-sponsor với Shop</option></Select></div>
            </div>
          ) : (
            <div>
              <label style={lab}>Sản phẩm áp dụng</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', font: 'var(--type-body)', color: 'var(--text-body)' }}><Radio name="vscope" checked={f.scope === 'all'} onChange={() => set('scope', 'all')} />Tất cả sản phẩm shop</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', font: 'var(--type-body)', color: 'var(--text-body)' }}><Radio name="vscope" checked={f.scope === 'some'} onChange={() => set('scope', 'some')} />Chọn sản phẩm cụ thể</label>
                {f.scope === 'some' && <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  {['Tai nghe ANC Pro 5', 'Watch S2 AMOLED', 'Bàn phím cơ RGB'].map((p) => <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><Checkbox />{p}</label>)}
                </div>}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
  const DIST = [{ s: 5, n: 842 }, { s: 4, n: 196 }, { s: 3, n: 48 }, { s: 2, n: 14 }, { s: 1, n: 9 }];
  const REVIEWS = [
    { id: 1, user: 'Trần T. Mai', avatar: 'Trần T. Mai', rating: 5, product: 'Tai nghe ANC Pro 5', variant: 'Đen', date: '08/06/2026', text: 'Âm thanh hay, chống ồn tốt, pin trâu. Shop đóng gói cẩn thận, giao nhanh!', images: ['headphones'], replied: true, reply: 'Cảm ơn bạn đã ủng hộ shop 🧡' },
    { id: 2, user: 'Nguyễn V. An', avatar: 'Nguyễn V. An', rating: 4, product: 'Watch S2 AMOLED', variant: 'Đen', date: '07/06/2026', text: 'Đồng hồ đẹp, đo SpO2 ổn. Trừ 1 sao vì giao hơi chậm.', images: [], replied: false },
    { id: 3, user: 'Lê H. Phúc', avatar: 'Lê H. Phúc', rating: 2, product: 'Bàn phím cơ RGB', variant: 'Blue switch', date: '05/06/2026', text: 'Một phím bị kẹt, mong shop hỗ trợ đổi.', images: ['keyboard'], replied: false },
  ];

  function Reviews() {
    const [tab, setTab] = React.useState('all');
    const [reviews, setReviews] = React.useState(REVIEWS);
    const total = DIST.reduce((n, d) => n + d.n, 0);
    const avg = (DIST.reduce((n, d) => n + d.s * d.n, 0) / total).toFixed(1);
    const list = tab === 'all' ? reviews : tab === 'unreplied' ? reviews.filter((r) => !r.replied) : reviews.filter((r) => r.rating <= 3);
    const reply = (id, text) => setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, replied: true, reply: text } : r)));

    return (
      <div style={{ maxWidth: 1180 }}>
        <SectionTitle icon="star" title="Đánh giá sản phẩm" sub="Phản hồi đánh giá để tăng uy tín Shop" />
        <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 18, marginTop: 16, alignItems: 'start' }}>
          {/* summary */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 20, position: 'sticky', top: 88 }}>
            <div style={{ textAlign: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)', marginBottom: 14 }}>
              <div style={{ font: '800 44px var(--font-sans)', color: 'var(--gold-600, #E09600)', lineHeight: 1 }}>{avg}</div>
              <div style={{ marginTop: 6 }}><Rating value={parseFloat(avg)} /></div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 6 }}>{total.toLocaleString('vi-VN')} đánh giá</div>
            </div>
            {DIST.map((d) => (
              <div key={d.s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, font: 'var(--type-caption)', color: 'var(--text-muted)', width: 24 }}>{d.s}<Icon name="star" size={11} style={{ color: 'var(--gold-500)' }} /></span>
                <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (d.n / total * 100) + '%', height: '100%', background: 'var(--gold-500)' }} /></div>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', width: 36, textAlign: 'right' }}>{d.n}</span>
              </div>
            ))}
          </div>

          {/* list */}
          <div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', boxShadow: 'var(--shadow-sm)', padding: '4px 16px 0' }}>
              <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: `Tất cả (${reviews.length})` }, { id: 'unreplied', label: `Chưa phản hồi (${reviews.filter((r) => !r.replied).length})` }, { id: 'low', label: 'Cần chú ý (≤3★)' }]} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--surface-sunken)', padding: 16, borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
              {list.map((r) => <ReviewCard key={r.id} r={r} onReply={reply} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  function ReviewCard({ r, onReply }) {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState('');
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar name={r.avatar} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{r.user}</span>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginLeft: 'auto' }}>{r.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, margin: '3px 0' }}>{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} style={{ color: i < r.rating ? 'var(--gold-500)' : 'var(--gray-300)' }} />)}</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 6 }}>{r.product} · Phân loại: {r.variant}</div>
            <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>{r.text}</div>
            {r.images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {r.images.map((im) => <img key={im} src={'../../assets/img/' + im + '.jpg'} alt="" width="56" height="56" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />)}
              </div>
            )}
            {r.replied ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, padding: '10px 12px', background: 'var(--orange-50)', borderRadius: 'var(--radius-md)' }}>
                <Icon name="message-square" size={15} style={{ color: 'var(--orange-600)', flex: 'none', marginTop: 2 }} />
                <div><span style={{ font: '600 12px var(--font-sans)', color: 'var(--orange-700)' }}>Phản hồi từ Shop: </span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{r.reply}</span></div>
              </div>
            ) : open ? (
              <div style={{ marginTop: 10 }}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Nhập phản hồi…" style={{ width: '100%', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '8px 12px', font: 'var(--type-body-sm)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button size="sm" onClick={() => onReply(r.id, text || 'Cảm ơn đánh giá của bạn!')}>Gửi phản hồi</Button>
                  <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" iconLeft="message-square" style={{ marginTop: 10 }} onClick={() => setOpen(true)}>Phản hồi</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ============================== PHÂN TÍCH ============================== */
  const TREND = [{ d: 'T2', v: 4.2 }, { d: 'T3', v: 5.8 }, { d: 'T4', v: 5.1 }, { d: 'T5', v: 7.4 }, { d: 'T6', v: 9.2 }, { d: 'T7', v: 11.6 }, { d: 'CN', v: 8.9 }];
  const TOP = [
    { name: 'Tai nghe ANC Pro 5', img: 'headphones', sold: 412, rev: 160068000, conv: 8.2 },
    { name: 'Bàn phím cơ RGB', img: 'keyboard', sold: 198, rev: 90882000, conv: 6.1 },
    { name: 'Watch S2 AMOLED', img: 'watch', sold: 156, rev: 107640000, conv: 5.4 },
    { name: 'Loa bluetooth mini', img: 'speaker', sold: 143, rev: 45760000, conv: 4.8 },
  ];
  const SOURCES = [{ name: 'Tìm kiếm trong sàn', pct: 46, c: 'var(--orange-500)' }, { name: 'Trang chủ / Gợi ý', pct: 28, c: 'var(--blue-500)' }, { name: 'Khuyến mãi / Flash Sale', pct: 16, c: 'var(--flash-500)' }, { name: 'Link ngoài / Chia sẻ', pct: 10, c: 'var(--mint-500)' }];

  function Stats() {
    const max = Math.max(...TREND.map((d) => d.v));
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle icon="chart-column" title="Phân tích bán hàng" sub="Hiệu suất Shop trong 7 ngày qua" />
          <div style={{ marginLeft: 'auto', width: 180 }}><Select defaultValue="7 ngày qua"><option>7 ngày qua</option><option>30 ngày qua</option><option>Tháng này</option></Select></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
          <MiniStat icon="banknote" tone={{ bg: 'var(--orange-50)', fg: 'var(--orange-600)' }} label="Doanh thu" value={fmt(45800000)} delta="+18,4%" />
          <MiniStat icon="package" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} label="Đơn hàng" value="312" delta="+9,1%" />
          <MiniStat icon="user" tone={{ bg: 'var(--purple-50)', fg: 'var(--purple-600, #6C2BD9)' }} label="Lượt truy cập" value="8.420" delta="+12%" />
          <MiniStat icon="percent" tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} label="Tỉ lệ chuyển đổi" value="3,7%" delta="+0,4%" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' }}>
            <div style={{ display: 'flex', marginBottom: 18 }}><span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Doanh thu theo ngày</span><span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>triệu ₫</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 170 }}>
              {TREND.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <div style={{ font: '600 11px var(--font-sans)', color: 'var(--text-body)' }}>{d.v}</div>
                  <div style={{ width: '100%', height: (d.v / max) * 130, borderRadius: '6px 6px 0 0', background: i === TREND.length - 2 ? 'var(--color-primary)' : 'var(--orange-200)' }} />
                  <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)' }}>{d.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Nguồn truy cập</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 16 }}>
              {SOURCES.map((s) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', font: 'var(--type-body-sm)', color: 'var(--text-body)', marginBottom: 5 }}><span style={{ flex: 1 }}>{s.name}</span><b>{s.pct}%</b></div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: s.pct + '%', height: '100%', background: s.c }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-subtle)', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Sản phẩm bán chạy</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
              <thead><tr style={hrow}><th style={th}>Sản phẩm</th><th style={{ ...th, textAlign: 'right' }}>Đã bán</th><th style={{ ...th, textAlign: 'right' }}>Doanh thu</th><th style={{ ...th, textAlign: 'right' }}>Chuyển đổi</th></tr></thead>
              <tbody>
                {TOP.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={'../../assets/img/' + p.img + '.jpg'} alt="" width="36" height="36" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none' }} /><span>{p.name}</span></div></td>
                    <td style={{ ...td, textAlign: 'right' }}>{p.sold}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: 'var(--text-price)' }}>{fmt(p.rev)}</td>
                    <td style={{ ...td, textAlign: 'right', color: 'var(--mint-600)' }}>{p.conv}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ============================== CÀI ĐẶT ============================== */
  function Settings() {
    const [t, setT] = React.useState({ autoReply: true, vacation: false, freeship: true, preorder: false });
    const tog = (k) => setT((s) => ({ ...s, [k]: !s[k] }));
    return (
      <div style={{ maxWidth: 1180 }}>
        <SectionTitle icon="settings" title="Cài đặt Shop" sub="Thông tin gian hàng, vận chuyển và thanh toán" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          {/* shop profile */}
          <Section title="Thông tin gian hàng" icon="store">
            {/* cover image */}
            <div style={{ marginBottom: 18 }}>
              <label style={lab}>Ảnh bìa Shop</label>
              <div style={{ position: 'relative', marginTop: 8, height: 150, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'linear-gradient(120deg, #1E232E, #3a4250)', border: '1px solid var(--border-subtle)' }}>
                <img src="../../assets/img/banner-tech.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,23,31,.55), rgba(20,23,31,.1))' }} />
                {/* logo overlapping a corner, like a real marketplace */}
                <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: '#1E232E', color: '#fff', display: 'grid', placeItems: 'center', font: '800 26px var(--font-sans)', border: '3px solid #fff', boxShadow: 'var(--shadow-md)' }}>T</div>
                  <span style={{ color: '#fff', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', textShadow: '0 1px 3px rgba(0,0,0,.4)' }}>TechZone Official</span>
                </div>
                <div style={{ position: 'absolute', right: 12, top: 12 }}>
                  <Button size="sm" variant="secondary" iconLeft="upload">Tải ảnh bìa</Button>
                </div>
              </div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 6 }}>Khuyến nghị 1200×300px (tỉ lệ 4:1), JPG/PNG, tối đa 2 MB. Ảnh bìa hiển thị ở đầu trang Shop.</div>
            </div>
            <div style={{ display: 'flex', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 84, height: 84, borderRadius: 'var(--radius-lg)', background: '#1E232E', color: '#fff', display: 'grid', placeItems: 'center', font: '800 36px var(--font-sans)' }}>T</div>
                <Button size="sm" variant="outline" iconLeft="upload">Đổi logo</Button>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Tên Shop" defaultValue="TechZone Official" />
                <div>
                  <label style={lab}>Mô tả Shop</label>
                  <textarea defaultValue="Thiết bị công nghệ chính hãng — bảo hành 12 tháng." rows={2} style={{ width: '100%', marginTop: 6, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '9px 12px', font: 'var(--type-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          </Section>

          {/* shipping */}
          <Section title="Vận chuyển" icon="truck">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[['GHN — Giao Hàng Nhanh', true, 'Đối tác 3PL'], ['GHTK — Giao Hàng Tiết Kiệm', true, 'Đối tác 3PL'], ['ViettelPost', false, 'Đối tác 3PL'], ['J&T Express', false, 'Đối tác 3PL'], ['Lazadee Express', false, 'Giao nội thành · FBL (Fulfillment by Lazadee)']].map(([name, on, desc]) => (
                <ToggleRow key={name} label={name} desc={desc} on={on} />
              ))}
              <ToggleRow label="Miễn phí vận chuyển" desc="Cho đơn từ 99.000₫" on={t.freeship} onToggle={() => tog('freeship')} />
            </div>
          </Section>

          {/* payout bank */}
          <Section title="Tài khoản nhận tiền (Payout)" icon="banknote">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="credit-card" size={22} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Vietcombank · CTK: TECHZONE OFFICIAL</div>
                <div className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-muted)' }}>•••• •••• 6712</div>
              </div>
              <Badge variant="mint" icon="badge-check">Đã xác minh</Badge>
              <Button size="sm" variant="ghost">Thay đổi</Button>
            </div>
          </Section>

          {/* preferences */}
          <Section title="Tuỳ chọn vận hành" icon="sliders-horizontal">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <ToggleRow label="Tự động trả lời chat" desc="Gửi lời chào khi khách nhắn tin" on={t.autoReply} onToggle={() => tog('autoReply')} />
              <ToggleRow label="Cho phép đặt trước (Pre-order)" desc="Bán sản phẩm chưa có sẵn hàng" on={t.preorder} onToggle={() => tog('preorder')} />
              <ToggleRow label="Chế độ nghỉ (Vacation)" desc="Tạm ẩn toàn bộ sản phẩm khỏi sàn" on={t.vacation} onToggle={() => tog('vacation')} danger />
            </div>
          </Section>

          <SecuritySection />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="ghost">Huỷ</Button>
            <Button iconLeft="check">Lưu cài đặt</Button>
          </div>
        </div>
      </div>
    );
  }
  function Section({ title, icon, children }) {
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Icon name={icon} size={18} style={{ color: 'var(--orange-500)' }} /><span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{title}</span></div>
        {children}
      </div>
    );
  }
  function ToggleRow({ label, desc, on, onToggle, danger }) {
    const [v, setV] = React.useState(on);
    const toggle = () => { setV((x) => !x); onToggle && onToggle(); };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: danger ? 'var(--red-600)' : 'var(--text-strong)' }}>{label}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{desc}</div>
        </div>
        <Switch checked={v} onChange={toggle} />
      </div>
    );
  }

  /* ---- Bảo mật tài khoản: đổi mật khẩu + xác thực OTP inline (VĐ-2) ---- */
  const VPW_COLORS = ['var(--red-500)', 'var(--red-500)', 'var(--gold-500)', 'var(--mint-500)', 'var(--mint-600)'];
  const VPW_LABELS = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const vStrength = (p) => { let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s; };
  function SecuritySection() {
    const [f, setF] = React.useState({ cur: '', nw: '', cf: '' });
    const [err, setErr] = React.useState({});
    const [stage, setStage] = React.useState('form');
    const [otp, setOtp] = React.useState('');
    const [resend, setResend] = React.useState(0);
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const strength = vStrength(f.nw);
    React.useEffect(() => { if (stage !== 'otp' || resend <= 0) return; const t = setInterval(() => setResend((s) => (s > 0 ? s - 1 : 0)), 1000); return () => clearInterval(t); }, [stage, resend]);
    const submit = () => {
      const e = {};
      if (!f.cur) e.cur = 'Nhập mật khẩu hiện tại';
      if (f.nw.length < 8) e.nw = 'Tối thiểu 8 ký tự'; else if (!/[0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ số'; else if (!/[^A-Za-z0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 ký tự đặc biệt';
      if (f.cf !== f.nw) e.cf = 'Mật khẩu nhập lại không khớp';
      setErr(e); if (Object.keys(e).length === 0) { setStage('otp'); setResend(60); setOtp(''); }
    };
    const confirm = () => { setStage('done'); setF({ cur: '', nw: '', cf: '' }); setTimeout(() => setStage('form'), 2800); };
    return (
      <Section title="Bảo mật tài khoản" icon="shield-check">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 260px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <VPwField label="Mật khẩu hiện tại" value={f.cur} onChange={(v) => set('cur', v)} err={err.cur} />
            <div>
              <VPwField label="Mật khẩu mới" value={f.nw} onChange={(v) => set('nw', v)} err={err.nw} hint="Tối thiểu 8 ký tự, cần chữ hoa, số và ký tự đặc biệt" />
              {f.nw && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}><div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (strength / 4 * 100) + '%', height: '100%', borderRadius: 3, background: VPW_COLORS[strength], transition: 'all .3s' }} /></div><span style={{ font: '600 12px var(--font-sans)', color: VPW_COLORS[strength], minWidth: 64 }}>{VPW_LABELS[strength]}</span></div>}
            </div>
            <VPwField label="Nhập lại mật khẩu mới" value={f.cf} onChange={(v) => set('cf', v)} err={err.cf} />
            {stage === 'form' && <div><Button iconLeft="check" onClick={submit}>Cập nhật mật khẩu</Button></div>}
            {stage === 'otp' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}><Icon name="mail" size={16} style={{ color: 'var(--orange-500)' }} /><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Mã OTP đã gửi đến email <b>tr****@gmail.com</b></span></div>
                <VOtpBoxes onChange={setOtp} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  <Button iconLeft="check" disabled={otp.length < 6} onClick={confirm}>Xác nhận</Button>
                  <Button variant="ghost" onClick={() => setStage('form')}>Huỷ</Button>
                  <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{resend > 0 ? `Gửi lại OTP (còn ${resend}s)` : <a style={{ color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setResend(60)}>Gửi lại OTP</a>}</span>
                </div>
              </div>
            )}
            {stage === 'done' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--mint-600)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', background: 'var(--mint-50)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}><Icon name="circle-check" size={18} />Đổi mật khẩu thành công</div>}
          </div>
          <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}><Icon name="info" size={16} style={{ color: 'var(--blue-600)' }} /><span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Lưu ý</span></div>
            <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>Đổi mật khẩu yêu cầu xác thực OTP gửi tới email đăng ký của Shop để đảm bảo an toàn cho ví Escrow.</p>
          </div>
        </div>
      </Section>
    );
  }
  function VPwField({ label, value, onChange, err, hint }) {
    const [show, setShow] = React.useState(false);
    return (
      <div>
        <label style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' }}>{label}</label>
        <div style={{ position: 'relative', marginTop: 6 }}>
          <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', height: 44, border: '1.5px solid ' + (err ? 'var(--red-500)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', padding: '0 42px 0 14px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' }} />
          <button type="button" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 6, top: 6, width: 32, height: 32, border: 0, background: 'transparent', color: 'var(--text-subtle)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name={show ? 'eye-off' : 'eye'} size={18} /></button>
        </div>
        {err ? <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{err}</div> : hint ? <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 5 }}>{hint}</div> : null}
      </div>
    );
  }
  function VOtpBoxes({ onChange }) {
    const [d, setD] = React.useState(['', '', '', '', '', '']);
    const refs = React.useRef([]);
    const set = (i, val) => { const v = val.replace(/\D/g, '').slice(-1); const nd = d.slice(); nd[i] = v; setD(nd); onChange && onChange(nd.join('')); if (v && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus(); };
    const key = (i, e) => { if (e.key === 'Backspace' && !d[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus(); };
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {d.map((x, i) => (<input key={i} ref={(el) => (refs.current[i] = el)} inputMode="numeric" maxLength={1} value={x} onChange={(e) => set(i, e.target.value)} onKeyDown={(e) => key(i, e)} onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')} style={{ width: 44, height: 52, textAlign: 'center', font: '800 22px var(--font-sans)', color: 'var(--text-strong)', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' }} />))}
      </div>
    );
  }

  /* ============================== SHARED ============================== */
  function SectionTitle({ icon, title, sub }) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name={icon} size={22} style={{ color: 'var(--orange-500)' }} /><h1 style={{ font: 'var(--weight-bold) var(--text-2xl) var(--font-sans)', color: 'var(--text-strong)', margin: 0 }}>{title}</h1></div>
        {sub && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', margin: '5px 0 0 31px' }}>{sub}</p>}
      </div>
    );
  }
  function MiniStat({ icon, tone, label, value, delta }) {
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={17} /></span>
          <span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ font: '800 24px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {delta && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, font: '600 12px var(--font-sans)', color: 'var(--green-600)', marginTop: 4 }}><Icon name="arrow-up-right" size={13} />{delta}</div>}
      </div>
    );
  }

  const hrow = { font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' };
  const th = { padding: '10px 14px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 14px', whiteSpace: 'nowrap' };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };
  const dateInput = { flex: 1, height: 44, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' };

  window.LZVPromo = Promo;
  window.LZVReviews = Reviews;
  window.LZVStats = Stats;
  window.LZVSettings = Settings;
})();
