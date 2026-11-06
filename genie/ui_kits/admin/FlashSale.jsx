/* Admin: Flash Sale campaigns — create (name, time window, max products, sign-up
   deadline), review shop registrations, schedule, activate and end early. Status flows
   DRAFT → SCHEDULED → ACTIVE → ENDED. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Modal, Input } = DS;
  const { FLASH_CAMPAIGNS } = window.LZA;
  const ST = { DRAFT: ['neutral', 'Nháp'], SCHEDULED: ['primary', 'Đã lên lịch'], ACTIVE: ['success', 'Đang chạy'], ENDED: ['neutral', 'Đã kết thúc'] };
  const vnd = (n) => n.toLocaleString('vi-VN') + '₫';

  function FlashSale() {
    const [rows, setRows] = React.useState(FLASH_CAMPAIGNS);
    const [sel, setSel] = React.useState(FLASH_CAMPAIGNS[0].id);
    const [form, setForm] = React.useState(null);
    const [err, setErr] = React.useState({});
    const cur = rows.find((c) => c.id === sel) || rows[0];
    const patch = (id, p) => setRows((rs) => rs.map((c) => (c.id === id ? { ...c, ...p } : c)));
    const setItem = (sku, status) => patch(cur.id, { items: cur.items.map((i) => (i.sku === sku ? { ...i, status } : i)) });
    const approved = cur.items.filter((i) => i.status === 'APPROVED').length;

    const create = () => {
      const e = {};
      if (!form.name.trim()) e.name = 'Nhập tên chiến dịch';
      if (!form.startsAt || !form.endsAt) e.time = 'Chọn khung giờ';
      else if (form.endsAt <= form.startsAt) e.time = 'Giờ kết thúc phải sau giờ bắt đầu';
      if (!form.deadline) e.deadline = 'Chọn hạn đăng ký';
      setErr(e);
      if (Object.keys(e).length) return;
      const id = 'FS-' + (2100 + rows.length);
      setRows((rs) => [{ id, name: form.name.trim(), startsAt: form.startsAt.replace('T', ' '), endsAt: form.endsAt.replace('T', ' '), max: Number(form.max) || 20, deadline: form.deadline, status: 'DRAFT', items: [] }, ...rs]);
      setSel(id); setForm(null);
    };

    return (
      <div style={{ maxWidth: 1180, display: 'grid', gridTemplateColumns: '340px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <b style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Chiến dịch</b>
            <Button size="sm" iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={() => { setErr({}); setForm({ name: '', startsAt: '', endsAt: '', max: '20', deadline: '' }); }}>Tạo chiến dịch</Button>
          </div>
          {rows.map((c) => {
            const on = c.id === cur.id;
            return (
              <button key={c.id} onClick={() => setSel(c.id)} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, borderBottom: '1px solid var(--border-subtle)', padding: '12px 16px', cursor: 'pointer', background: on ? 'var(--blue-50)' : '#fff' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ flex: 1, font: '600 14px var(--font-sans)', color: 'var(--text-strong)' }}>{c.name}</span><Badge variant={ST[c.status][0]}>{ST[c.status][1]}</Badge></span>
                <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{c.startsAt} → {c.endsAt}</span>
              </button>
            );
          })}
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--flash-50)', color: 'var(--flash-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="zap" size={21} /></span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ font: 'var(--weight-bold) var(--text-lg) var(--font-sans)', color: 'var(--text-strong)' }}>{cur.name}</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{approved}/{cur.max} sản phẩm · hạn đăng ký {cur.deadline}</div>
            </div>
            {cur.status === 'DRAFT' && <Button iconLeft="calendar" disabled={approved === 0} onClick={() => patch(cur.id, { status: 'SCHEDULED' })}>Lên lịch</Button>}
            {cur.status === 'SCHEDULED' && <Button variant="secondary" iconLeft="zap" onClick={() => patch(cur.id, { status: 'ACTIVE' })}>Mô phỏng: đến giờ mở bán</Button>}
            {cur.status === 'ACTIVE' && <Button variant="danger" iconLeft="power" onClick={() => patch(cur.id, { status: 'ENDED' })}>Kết thúc sớm</Button>}
          </div>
          <div style={{ padding: '14px 20px 6px', font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Sản phẩm shop đăng ký</div>
          {cur.items.length === 0
            ? <div style={{ padding: '32px 20px', textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Chưa có shop nào đăng ký. Shop đăng ký ở mục Khuyến mãi của Seller Center.</div>
            : <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
                <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}><th style={c}>Sản phẩm</th><th style={c}>Shop</th><th style={{ ...c, textAlign: 'right' }}>Giá gốc 30 ngày</th><th style={{ ...c, textAlign: 'right' }}>Giá Flash</th><th style={{ ...c, textAlign: 'right' }}>Giảm</th><th style={{ ...c, textAlign: 'right' }}>Số suất</th><th style={{ ...c, textAlign: 'right' }}>Duyệt</th></tr></thead>
                <tbody>
                  {cur.items.map((i) => {
                    const off = Math.round((1 - i.flashPrice / i.price) * 100);
                    const low = off < 15;
                    return (
                      <tr key={i.sku} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                        <td style={c}>{i.name}<div className="code" style={{ font: '11px var(--font-mono)', color: 'var(--text-muted)' }}>{i.sku}</div></td>
                        <td style={c}>{i.shop}</td>
                        <td style={{ ...c, textAlign: 'right' }}>{vnd(i.price)}</td>
                        <td style={{ ...c, textAlign: 'right', fontWeight: 600, color: 'var(--text-price)' }}>{vnd(i.flashPrice)}</td>
                        <td style={{ ...c, textAlign: 'right', color: low ? 'var(--red-600)' : 'var(--mint-600)', fontWeight: 600 }} title={low ? 'Phải giảm tối thiểu 15%' : undefined}>−{off}%</td>
                        <td style={{ ...c, textAlign: 'right' }}>{i.stock}</td>
                        <td style={{ ...c, textAlign: 'right' }}>{i.status === 'PENDING' && cur.status === 'DRAFT'
                          ? <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}><Button size="sm" variant="ghost" onClick={() => setItem(i.sku, 'REJECTED')}>Từ chối</Button><Button size="sm" iconLeft="check" disabled={low} onClick={() => setItem(i.sku, 'APPROVED')}>Duyệt</Button></div>
                          : <Badge variant={i.status === 'APPROVED' ? 'success' : i.status === 'REJECTED' ? 'danger' : 'warning'}>{i.status === 'APPROVED' ? 'Đã duyệt' : i.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}</Badge>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>}
        </div>

        <Modal open={!!form} onClose={() => setForm(null)} width={520} title="Tạo chiến dịch Flash Sale"
          footer={<><Button variant="ghost" onClick={() => setForm(null)}>Huỷ</Button><Button iconLeft="check" onClick={create}>Tạo chiến dịch</Button></>}>
          {form && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Tên chiến dịch" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={err.name} placeholder="VD: FLASH SALE 12.12" />
            <div>
              <label style={lab}>Khung giờ</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <input type="datetime-local" aria-label="Bắt đầu" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} style={box} />
                <Icon name="arrow-right" size={16} style={{ color: 'var(--text-subtle)', flex: 'none' }} />
                <input type="datetime-local" aria-label="Kết thúc" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} style={box} />
              </div>
              {err.time && <Err text={err.time} />}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Số sản phẩm tối đa" value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value.replace(/\D/g, '') })} />
              <div>
                <label style={lab}>Hạn đăng ký</label>
                <input type="date" aria-label="Hạn đăng ký" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} style={{ ...box, width: '100%', marginTop: 6, boxSizing: 'border-box' }} />
                {err.deadline && <Err text={err.deadline} />}
              </div>
            </div>
          </div>}
        </Modal>
      </div>
    );
  }
  const Err = ({ text }) => <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{text}</div>;
  const c = { padding: '11px 16px', whiteSpace: 'nowrap' };
  const lab = { display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' };
  const box = { flex: 1, minWidth: 0, height: 42, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 10px', font: 'var(--type-body-sm)', outline: 'none' };
  window.LZAFlashSale = FlashSale;
})();
