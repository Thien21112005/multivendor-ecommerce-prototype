/* Admin: home banners by position with schedule, click-through rate and an instant
   "Tắt ngay". Max 8 live per position; target links stay inside the platform. Saved to
   localStorage so the storefront home in this browser shows the live top banner. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Modal, Input, Select, Tabs } = DS;
  const { BANNERS, BANNER_POSITIONS } = window.LZA;
  const KEY = 'lz_home_banners';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || BANNERS; } catch (e) { return BANNERS; } };
  const persist = (rows) => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) { /* preview only */ } };
  const today = () => new Date().toISOString().slice(0, 10);
  const stateOf = (b) => (!b.on ? 'OFF' : b.endsAt < today() ? 'ENDED' : b.startsAt > today() ? 'SCHEDULED' : 'LIVE');
  const ST = { LIVE: ['success', 'Đang hiển thị'], SCHEDULED: ['primary', 'Đã lên lịch'], ENDED: ['neutral', 'Đã kết thúc'], OFF: ['danger', 'Đã tắt'] };
  const EMPTY = { title: '', image: '', imageMobile: '', link: '/?screen=category&cat=Điện tử', position: 'HOME_TOP_CAROUSEL', category: 'Điện tử', order: 1, startsAt: '', endsAt: '', on: true };

  function Banners() {
    const [rows, setRows] = React.useState(load);
    const [pos, setPos] = React.useState('all');
    const [form, setForm] = React.useState(null);
    const [err, setErr] = React.useState({});
    const fileRef = React.useRef(null);
    const mobileRef = React.useRef(null);
    const update = (next) => { setRows(next); persist(next); };
    const list = rows.filter((b) => pos === 'all' || b.position === pos).sort((a, b) => a.order - b.order);
    const liveAt = (p, except) => rows.filter((b) => b.position === p && b.id !== except && stateOf(b) === 'LIVE').length;

    const pick = (field) => (e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (f.size > 1024 * 1024) { setErr((x) => ({ ...x, image: 'Ảnh tối đa 1MB để lưu được trong bản mock' })); return; }
      const r = new FileReader();
      r.onload = () => { setForm((x) => ({ ...x, [field]: r.result })); setErr((x) => ({ ...x, image: null })); };
      r.readAsDataURL(f);
    };
    const save = () => {
      const e = {};
      if (!form.title.trim()) e.title = 'Nhập tiêu đề';
      if (!form.image) e.image = 'Chọn ảnh desktop';
      if (!form.link.startsWith('/')) e.link = 'Liên kết đích phải thuộc miền của sàn';
      if (!form.startsAt || !form.endsAt) e.date = 'Chọn thời gian hiển thị';
      else if (form.endsAt <= form.startsAt) e.date = 'Ngày kết thúc phải sau ngày bắt đầu';
      if (form.position === 'CATEGORY_TOP' && !form.category) e.position = 'Chọn danh mục cho banner này';
      if (liveAt(form.position, form.id) >= 8) e.position = 'Vị trí này đã đủ 8 banner đang hiển thị';
      setErr(e);
      if (Object.keys(e).length) return;
      update(form.id ? rows.map((b) => (b.id === form.id ? form : b)) : [{ ...form, id: 'BN-' + Date.now().toString(36), views: 0, clicks: 0 }, ...rows]);
      setForm(null);
    };

    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Tabs value={pos} onChange={setPos} items={[{ id: 'all', label: 'Tất cả' }, ...BANNER_POSITIONS.map((p) => ({ id: p.id, label: p.label }))]} />
          </div>
          <Button iconLeft="plus" style={{ marginLeft: 12, flex: 'none' }} onClick={() => { setErr({}); setForm({ ...EMPTY }); }}>Thêm banner</Button>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={hrow}><th style={c}>Banner</th><th style={c}>Vị trí</th><th style={c}>Thời gian</th><th style={{ ...c, textAlign: 'right' }}>Hiển thị / Bấm</th><th style={{ ...c, textAlign: 'right' }}>CTR</th><th style={c}>Trạng thái</th><th style={{ ...c, textAlign: 'right' }}>Thao tác</th></tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan="7" style={{ padding: 40, textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Chưa có banner ở vị trí này.</td></tr>}
              {list.map((b) => {
                const s = stateOf(b);
                return (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={c}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><img src={b.image} alt="" width="84" height="44" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none' }} /><div style={{ maxWidth: 240 }}><div style={{ fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div><div className="code" style={{ font: '11px var(--font-mono)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.link}</div></div></div></td>
                    <td style={c}>{(BANNER_POSITIONS.find((p) => p.id === b.position) || {}).label}{b.position === 'CATEGORY_TOP' && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{b.category}</div>}</td>
                    <td style={{ ...c, color: 'var(--text-muted)', fontSize: 12 }}>{b.startsAt}<br />→ {b.endsAt}</td>
                    <td style={{ ...c, textAlign: 'right' }}>{b.views.toLocaleString('vi-VN')} / {b.clicks.toLocaleString('vi-VN')}</td>
                    <td style={{ ...c, textAlign: 'right', fontWeight: 600 }}>{b.views ? (b.clicks / b.views * 100).toFixed(1).replace('.', ',') + '%' : '—'}</td>
                    <td style={c}><Badge variant={ST[s][0]}>{ST[s][1]}</Badge></td>
                    <td style={{ ...c, textAlign: 'right' }}><div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <Button size="sm" variant="ghost" iconLeft="pencil" onClick={() => { setErr({}); setForm({ ...b }); }}>Sửa</Button>
                      {b.on
                        ? <Button size="sm" variant="ghost" iconLeft="power" style={{ color: 'var(--red-600)' }} onClick={() => update(rows.map((x) => (x.id === b.id ? { ...x, on: false } : x)))}>Tắt ngay</Button>
                        : <Button size="sm" variant="ghost" onClick={() => update(rows.map((x) => (x.id === b.id ? { ...x, on: true } : x)))}>Bật lại</Button>}
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Modal open={!!form} onClose={() => setForm(null)} width={560} title={form && form.id ? 'Sửa banner' : 'Thêm banner'}
          footer={<><Button variant="ghost" onClick={() => setForm(null)}>Huỷ</Button><Button iconLeft="check" onClick={save}>Lưu banner</Button></>}>
          {form && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Tiêu đề" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={err.title} placeholder="VD: SIÊU SALE 12.12" />
            <div>
              <label style={lab}>Ảnh desktop (bắt buộc)</label>
              <div onClick={() => fileRef.current.click()} style={{ marginTop: 6, height: 110, border: '1.5px dashed ' + (err.image ? 'var(--red-500)' : 'var(--border-strong)'), borderRadius: 'var(--radius-md)', background: 'var(--gray-25)', cursor: 'pointer', display: 'grid', placeItems: 'center', overflow: 'hidden', color: 'var(--text-muted)' }}>
                {form.image ? <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--type-body-sm)' }}><Icon name="upload" size={18} />Bấm để chọn ảnh</span>}
              </div>
              <input ref={fileRef} type="file" hidden accept="image/*" onChange={pick('image')} />
              {err.image && <Err text={err.image} />}
              <input ref={mobileRef} type="file" hidden accept="image/*" onChange={pick('imageMobile')} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <Button size="sm" variant="outline" iconLeft="upload" onClick={() => mobileRef.current.click()}>{form.imageMobile ? 'Đổi ảnh mobile' : 'Thêm ảnh mobile (không bắt buộc)'}</Button>
                {form.imageMobile && <img src={form.imageMobile} alt="" width="48" height="48" style={{ objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />}
              </div>
            </div>
            <Input label="Liên kết đích" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} error={err.link} placeholder="/?screen=category&cat=..." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <Select label="Vị trí" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>{BANNER_POSITIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select>
                {err.position && <Err text={err.position} />}
              </div>
              {form.position === 'CATEGORY_TOP'
                ? <Select label="Danh mục" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Điện tử', 'Thời trang', 'Làm đẹp', 'Nhà cửa', 'Phụ kiện'].map((x) => <option key={x}>{x}</option>)}</Select>
                : <Input label="Thứ tự" value={String(form.order)} onChange={(e) => setForm({ ...form, order: Number(e.target.value.replace(/\D/g, '')) || 1 })} />}
            </div>
            <div>
              <label style={lab}>Thời gian hiển thị</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <input type="date" aria-label="Ngày bắt đầu" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} style={dateBox} />
                <Icon name="arrow-right" size={16} style={{ color: 'var(--text-subtle)' }} />
                <input type="date" aria-label="Ngày kết thúc" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} style={dateBox} />
              </div>
              {err.date && <Err text={err.date} />}
            </div>
          </div>}
        </Modal>
      </div>
    );
  }
  const Err = ({ text }) => <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{text}</div>;
  const hrow = { font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' };
  const c = { padding: '11px 16px', whiteSpace: 'nowrap' };
  const lab = { display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' };
  const dateBox = { flex: 1, height: 42, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 10px', font: 'var(--type-body-sm)', outline: 'none' };
  window.LZABanners = Banners;
})();
