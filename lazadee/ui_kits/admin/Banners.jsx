/* Admin: home banners by position with schedule, click-through rate and an instant
   "Tắt ngay". Max 8 live per position; target links stay inside the platform. Rows live in
   the shared banner store (window.LZ.banners), which every storefront slot reads. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Modal, Input, Select, Tabs } = DS;
  const { BANNER_POSITIONS } = window.LZA;
  const store = window.LZ.banners;
  const load = store.all;
  const persist = store.save;
  const stateOf = store.stateOf;
  const posOf = (id) => BANNER_POSITIONS.find((p) => p.id === id) || {};
  // Opens the storefront page where this banner shows, in a new tab.
  const previewHref = (b) => '../storefront/index.html' + posOf(b.position).preview.replace(/cat=$/, 'cat=' + encodeURIComponent(b.category || ''));
  const ST = { LIVE: ['success', 'Đang hiển thị'], SCHEDULED: ['primary', 'Đã lên lịch'], ENDED: ['neutral', 'Đã kết thúc'], OFF: ['danger', 'Đã tắt'] };
  const EMPTY = { title: '', image: '', imageMobile: '', link: '', position: 'HOME_TOP_CAROUSEL', category: 'Điện tử', order: 1, startsAt: '', endsAt: '', on: true };

  // The target is picked from platform data and stored as a link inside the platform domain.
  const { CATEGORIES, PRODUCTS, V, productsOfCategory } = window.LZ;
  const LINK_CATEGORIES = CATEGORIES.map((x) => x.name).filter((name) => productsOfCategory(name).length);
  const SHOPS = Object.values(V);
  const LINK_TYPES = [
    { id: 'category', label: 'Danh mục' },
    { id: 'product', label: 'Sản phẩm' },
    { id: 'shop', label: 'Cửa hàng' },
    { id: 'flash', label: 'Flash Sale' },
    { id: 'discover', label: 'Gợi ý hôm nay' },
    { id: 'campaign', label: 'Trang chiến dịch' },
  ];
  const FLASH_LINK = '/?screen=home#flash-sale';
  const DISCOVER_LINK = '/?screen=discover';
  const SITE = 'https://genie.example';
  const parseLink = (link) => {
    const u = new URL(link || '/', SITE);
    const q = u.searchParams;
    if (!link) return { type: 'category', value: '' };
    if (link === FLASH_LINK) return { type: 'flash', value: '' };
    if (link === DISCOVER_LINK) return { type: 'discover', value: '' };
    if (q.get('screen') === 'category' && q.get('cat')) return { type: 'category', value: q.get('cat') };
    if (q.get('screen') === 'product' && q.get('product')) return { type: 'product', value: q.get('product') };
    if (q.get('screen') === 'shop' && q.get('shop')) return { type: 'shop', value: q.get('shop') };
    return { type: 'campaign', value: link };
  };
  const linkTo = {
    category: (name) => (name ? '/?screen=category&cat=' + encodeURIComponent(name) : ''),
    product: (id) => (id ? '/?screen=product&product=' + id : ''),
    shop: (id) => (id ? '/?screen=shop&shop=' + id : ''),
    flash: () => FLASH_LINK,
    discover: () => DISCOVER_LINK,
    campaign: () => '',
  };
  // Parsing against the site blocks //other.com, /\other.com and javascript: links.
  const sitePath = (link) => {
    try {
      const u = new URL(link.trim(), SITE);
      return u.origin === SITE ? u.pathname + u.search + u.hash : null;
    } catch (e) { return null; }
  };
  const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const linkParts = (link) => {
    const { type, value } = parseLink(link);
    const name = type === 'product' ? (PRODUCTS.find((p) => p.id === value) || {}).title : type === 'shop' ? (V[value] || {}).name : value;
    return { type, label: LINK_TYPES.find((t) => t.id === type).label, name: name || value };
  };

  function ProductPicker({ value, onChange }) {
    const [query, setQuery] = React.useState('');
    const chosen = PRODUCTS.find((p) => p.id === value);
    if (chosen) {
      return (
        <div>
          <label style={lab}>Sản phẩm</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, padding: '4px 4px 4px 8px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <img src={chosen.image} alt="" width="32" height="32" style={{ objectFit: 'cover', borderRadius: 'var(--radius-sm)', flex: 'none' }} />
            <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chosen.title}</span>
            <Button size="sm" variant="ghost" onClick={() => { setQuery(''); onChange(''); }}>Đổi</Button>
          </div>
        </div>
      );
    }
    const q = plain(query.trim());
    const found = q ? PRODUCTS.filter((p) => plain(p.title).includes(q)).slice(0, 5) : [];
    return (
      <div>
        <Input label="Sản phẩm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên sản phẩm" />
        {q && <div style={{ marginTop: 6, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {found.length === 0 && <div style={{ padding: '10px 12px', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Không tìm thấy sản phẩm</div>}
          {found.map((p) => (
            <button key={p.id} type="button" onClick={() => onChange(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '6px 10px', border: 0, background: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <img src={p.image} alt="" width="32" height="32" style={{ objectFit: 'cover', borderRadius: 'var(--radius-sm)', flex: 'none' }} />
              <span style={{ minWidth: 0, font: 'var(--type-body-sm)', color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
            </button>
          ))}
        </div>}
      </div>
    );
  }

  function LinkPicker({ link, error, onChange }) {
    const parsed = parseLink(link);
    const [type, setType] = React.useState(parsed.type);
    const value = type === parsed.type ? parsed.value : '';
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '170px minmax(0, 1fr)', gap: 12, alignItems: 'start' }}>
          <Select label="Liên kết đích" value={type} onChange={(e) => { setType(e.target.value); onChange(linkTo[e.target.value]('')); }}>{LINK_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</Select>
          {type === 'category' && <Select label="Danh mục" value={value} onChange={(e) => onChange(linkTo.category(e.target.value))}>{[<option key="" value="">Chọn danh mục</option>, ...LINK_CATEGORIES.map((x) => <option key={x} value={x}>{x}</option>)]}</Select>}
          {type === 'product' && <ProductPicker value={value} onChange={(id) => onChange(linkTo.product(id))} />}
          {type === 'shop' && <Select label="Cửa hàng" value={value} onChange={(e) => onChange(linkTo.shop(e.target.value))}>{[<option key="" value="">Chọn cửa hàng</option>, ...SHOPS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)]}</Select>}
          {(type === 'flash' || type === 'discover') && <div style={{ alignSelf: 'end', minHeight: 42, display: 'flex', alignItems: 'center', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{type === 'flash' ? 'Mở khu Flash Sale trên trang chủ' : 'Mở trang Gợi ý hôm nay'}</div>}
          {type === 'campaign' && <Input label="Đường dẫn trang" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/sieu-sale-12-12" />}
        </div>
        {error && <Err text={error} />}
      </div>
    );
  }

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
      const link = form.link.trim() && sitePath(form.link);
      if (!form.link.trim()) e.link = 'Chọn liên kết đích cho banner';
      else if (!link) e.link = 'Liên kết đích phải thuộc miền genie.example';
      if (!form.startsAt || !form.endsAt) e.date = 'Chọn thời gian hiển thị';
      else if (form.endsAt <= form.startsAt) e.date = 'Ngày kết thúc phải sau ngày bắt đầu';
      if (form.position === 'CATEGORY_TOP' && !form.category) e.position = 'Chọn danh mục cho banner này';
      if (liveAt(form.position, form.id) >= 8) e.position = 'Vị trí này đã đủ 8 banner đang hiển thị';
      setErr(e);
      if (Object.keys(e).length) return;
      const saved = { ...form, link };
      update(form.id ? rows.map((b) => (b.id === form.id ? saved : b)) : [{ ...saved, id: 'BN-' + Date.now().toString(36), views: 0, clicks: 0 }, ...rows]);
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
                const target = linkParts(b.link);
                return (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={c}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><img src={b.image} alt="" width="84" height="44" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none' }} /><div style={{ maxWidth: 240 }}><div style={{ fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{target.label}{target.name && ': '}{target.name && <span style={target.type === 'campaign' ? { fontFamily: 'var(--font-mono)' } : undefined}>{target.name}</span>}</div></div></div></td>
                    <td style={c}>{posOf(b.position).label}{b.position === 'CATEGORY_TOP' && <span style={{ color: 'var(--text-muted)' }}> · {b.category}</span>}<div style={{ maxWidth: 220, whiteSpace: 'normal', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{posOf(b.position).where}</div></td>
                    <td style={{ ...c, color: 'var(--text-muted)', fontSize: 12 }}>{b.startsAt}<br />→ {b.endsAt}</td>
                    <td style={{ ...c, textAlign: 'right' }}>{b.views.toLocaleString('vi-VN')} / {b.clicks.toLocaleString('vi-VN')}</td>
                    <td style={{ ...c, textAlign: 'right', fontWeight: 600 }}>{b.views ? (b.clicks / b.views * 100).toFixed(1).replace('.', ',') + '%' : '—'}</td>
                    <td style={c}><Badge variant={ST[s][0]}>{ST[s][1]}</Badge></td>
                    <td style={{ ...c, textAlign: 'right' }}><div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <a href={previewHref(b)} target="_blank" rel="noopener" style={viewLink} title={'Mở ' + posOf(b.position).label.toLowerCase() + ' trên storefront'}><Icon name="external-link" size={14} />Xem</a>
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
            <LinkPicker link={form.link} error={err.link} onChange={(link) => { setForm({ ...form, link }); setErr({ ...err, link: null }); }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <Select label="Vị trí" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>{BANNER_POSITIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select>
                {err.position ? <Err text={err.position} /> : <div style={{ marginTop: 4, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{posOf(form.position).where}</div>}
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
  const viewLink = { display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 'var(--radius-md)', color: 'var(--text-link)', font: '600 13px var(--font-sans)', textDecoration: 'none' };
  const lab = { display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' };
  const dateBox = { flex: 1, height: 42, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 10px', font: 'var(--type-body-sm)', outline: 'none' };
  window.LZABanners = Banners;
})();
