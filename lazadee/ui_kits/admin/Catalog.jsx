/* Lazadee Admin — global catalog management (Quản lý danh mục toàn sàn).
   Two-level category tree with product/shop counts, visibility, and the default
   commission per category (ties into Commission config). Add / edit / hide
   categories and approve seller-suggested ones. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Switch, Input, Select, Modal, StatusBadge, Tabs } = DS;

  const CAT_ICONS = ['zap', 'shopping-bag', 'star', 'house', 'gift', 'ticket', 'package', 'shopping-cart', 'heart', 'book', 'dumbbell', 'gamepad-2'];
  const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0111/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const MOCK_PRODUCTS = [
    { name: 'Tai nghe Bluetooth ANC', shop: 'TechZone', price: 389000, stock: 38, status: 'APPROVED', img: 'headphones' },
    { name: 'iPhone 15 Pro Max 256GB', shop: 'AppleStore SG', price: 22990000, stock: 15, status: 'PENDING', img: 'phone' },
    { name: 'Ốp lưng silicon trong suốt', shop: 'PhoneCase VN', price: 49000, stock: 200, status: 'PENDING', img: 'case' },
    { name: 'Sạc nhanh 65W GaN', shop: 'ChargerPro', price: 350000, stock: 80, status: 'REJECTED', reason: 'Thiếu chứng nhận an toàn', img: 'charger' },
  ];
  const P_REASONS = ['Vi phạm chính sách', 'Ảnh sản phẩm không đạt', 'Mô tả sai / gây hiểu lầm', 'Giá bất hợp lý', 'Hàng cấm / hạn chế'];
  const fmtV = (n) => n.toLocaleString('vi-VN') + '₫';

  const TREE = [
    { id: 'dien-tu', name: 'Điện tử', icon: 'zap', products: 12840, shops: 312, comm: 5, on: true, subs: [
      { name: 'Điện thoại & Phụ kiện', products: 4210, comm: 4 },
      { name: 'Máy tính & Laptop', products: 3120, comm: 5 },
      { name: 'Âm thanh & Tai nghe', products: 2980, comm: 6 },
      { name: 'Camera & Máy quay', products: 2530, comm: 5 },
    ] },
    { id: 'thoi-trang', name: 'Thời trang', icon: 'shopping-bag', products: 28410, shops: 894, comm: 8, on: true, subs: [
      { name: 'Thời trang Nam', products: 9800, comm: 8 },
      { name: 'Thời trang Nữ', products: 12400, comm: 8 },
      { name: 'Giày dép', products: 6210, comm: 7 },
    ] },
    { id: 'lam-dep', name: 'Làm đẹp', icon: 'star', products: 9120, shops: 421, comm: 10, on: true, subs: [
      { name: 'Chăm sóc da', products: 3800, comm: 10 },
      { name: 'Trang điểm', products: 3120, comm: 10 },
      { name: 'Nước hoa', products: 2200, comm: 9 },
    ] },
    { id: 'nha-cua', name: 'Nhà cửa & Đời sống', icon: 'house', products: 15200, shops: 540, comm: 6, on: true, subs: [
      { name: 'Nội thất', products: 4100, comm: 6 },
      { name: 'Đồ dùng nhà bếp', products: 5600, comm: 6 },
      { name: 'Trang trí', products: 5500, comm: 7 },
    ] },
    { id: 'me-be', name: 'Mẹ & Bé', icon: 'gift', products: 6840, shops: 218, comm: 7, on: true, subs: [
      { name: 'Đồ dùng cho bé', products: 3400, comm: 7 },
      { name: 'Thời trang mẹ & bé', products: 3440, comm: 7 },
    ] },
    { id: 'voucher', name: 'Voucher & Dịch vụ', icon: 'ticket', products: 320, shops: 28, comm: 0, on: false, subs: [
      { name: 'Thẻ nạp & Dịch vụ', products: 320, comm: 0 },
    ] },
  ];

  const PENDING = [
    { name: 'Thú cưng (Pet)', by: 'PetWorld VN', date: '08/06', parent: '— (danh mục gốc mới)' },
    { name: 'Đồ chơi mô hình', by: 'GundamStore', date: '07/06', parent: 'Mẹ & Bé' },
  ];

  function Catalog() {
    const [tree, setTree] = React.useState(TREE);
    const [sel, setSel] = React.useState(TREE[0].id);
    const [pending, setPending] = React.useState(PENDING);
    const [catModal, setCatModal] = React.useState(null); // null | {} | category
    const [reject, setReject] = React.useState(null);
    const [productView, setProductView] = React.useState(null); // null | sub-name
    const [toast, setToast] = React.useState('');
    const current = tree.find((t) => t.id === sel);
    const totalProducts = tree.reduce((n, t) => n + t.products, 0);
    const toggle = (id) => setTree((ts) => ts.map((t) => (t.id === id ? { ...t, on: !t.on } : t)));
    const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };
    const approveSuggestion = (p) => { setPending((ps) => ps.filter((x) => x !== p)); flash('Đã duyệt danh mục “' + p.name + '”'); };

    if (productView) return <ProductList sub={productView} onBack={() => setProductView(null)} />;

    return (
      <div style={{ maxWidth: 1180, position: 'relative' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 18 }}>
          <Kpi icon="boxes" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} label="Danh mục gốc" value={tree.length} />
          <Kpi icon="package" tone={{ bg: 'var(--orange-50)', fg: 'var(--orange-600)' }} label="Danh mục con" value={tree.reduce((n, t) => n + t.subs.length, 0)} />
          <Kpi icon="package" tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} label="Tổng sản phẩm" value={totalProducts.toLocaleString('vi-VN')} />
          <Kpi icon="clock" tone={{ bg: 'var(--amber-50)', fg: 'var(--amber-600)' }} label="Chờ duyệt" value={PENDING.length} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
          {/* category tree */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Cây danh mục</span>
              <Button size="sm" iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={() => setCatModal({})}>Thêm</Button>
            </div>
            <div style={{ padding: 8 }}>
              {tree.map((t) => {
                const on = t.id === sel;
                return (
                  <button key={t.id} onClick={() => setSel(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', border: 0, background: on ? 'var(--blue-50)' : 'transparent', borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: on ? 'var(--blue-500)' : 'var(--surface-sunken)', color: on ? '#fff' : 'var(--text-muted)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={t.icon} size={17} /></span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', font: (on ? '600' : '500') + ' 14px var(--font-sans)', color: t.on ? 'var(--text-strong)' : 'var(--text-subtle)' }}>{t.name}</span>
                      <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{t.subs.length} mục con · {t.products.toLocaleString('vi-VN')} SP</span>
                    </span>
                    {!t.on && <Badge variant="outline">Ẩn</Badge>}
                    <Icon name="chevron-right" size={16} style={{ color: 'var(--text-subtle)', flex: 'none' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* detail + pending */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={current.icon} size={20} /></span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ font: 'var(--weight-bold) var(--text-lg) var(--font-sans)', color: 'var(--text-strong)' }}>{current.name}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{current.products.toLocaleString('vi-VN')} sản phẩm · {current.shops} shop · hoa hồng {current.comm}%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                  <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Hiển thị</span>
                  <Switch checked={current.on} onChange={() => toggle(current.id)} />
                  <Button size="sm" variant="outline" iconLeft="pencil" onClick={() => setCatModal(current)}>Sửa</Button>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
                  <thead><tr style={hrow}><th style={th}>Danh mục con</th><th style={{ ...th, textAlign: 'right' }}>Sản phẩm</th><th style={{ ...th, textAlign: 'right' }}>Hoa hồng</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th></tr></thead>
                  <tbody>
                    {current.subs.map((s, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                        <td style={td}><button onClick={() => setProductView(s.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--blue-600)', font: '600 13px var(--font-sans)' }}><Icon name="chevron-right" size={15} style={{ color: 'var(--text-subtle)' }} />{s.name}</button></td>
                        <td style={{ ...td, textAlign: 'right' }}>{s.products.toLocaleString('vi-VN')}</td>
                        <td style={{ ...td, textAlign: 'right' }}><span style={{ font: '600 12px var(--font-sans)', color: 'var(--orange-600)', background: 'var(--orange-50)', borderRadius: 'var(--radius-pill)', padding: '2px 10px' }}>{s.comm}%</span></td>
                        <td style={{ ...td, textAlign: 'right' }}><Button size="sm" variant="ghost" onClick={() => setProductView(s.name)}>Xem SP</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pending suggestions */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <Icon name="clock" size={18} style={{ color: 'var(--amber-600)' }} />
                <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Đề xuất danh mục từ người bán</span>
                <Badge variant="flash" style={{ marginLeft: 6 }}>{pending.length}</Badge>
              </div>
              {pending.length === 0 && <div style={{ padding: '20px', textAlign: 'center', font: 'var(--type-body-sm)', color: 'var(--text-subtle)' }}>Không có đề xuất nào.</div>}
              {pending.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{p.name}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Đề xuất bởi {p.by} · {p.date} · Thuộc: {p.parent}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setReject(p)}>Từ chối</Button>
                  <Button size="sm" iconLeft="check" onClick={() => approveSuggestion(p)}>Duyệt</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {catModal && <CatModal cat={catModal} tree={tree} onClose={() => setCatModal(null)} />}
        {reject && <Modal open onClose={() => setReject(null)} title="Từ chối đề xuất"
          footer={<><Button variant="ghost" onClick={() => setReject(null)}>Huỷ</Button><Button variant="danger" onClick={() => { setPending((ps) => ps.filter((x) => x !== reject)); setReject(null); }}>Từ chối</Button></>}>
          <div style={{ width: 'min(420px, 80vw)', font: 'var(--type-body)', color: 'var(--text-body)' }}>Từ chối đề xuất danh mục <b>“{reject.name}”</b> từ {reject.by}?</div>
        </Modal>}
        {toast && <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink-900)', color: '#fff', padding: '11px 18px', borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', boxShadow: 'var(--shadow-lg)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="circle-check" size={15} />{toast}</div>}
      </div>
    );
  }

  /* ---- VĐ-5C: product list inside a subcategory ---- */
  function ProductList({ sub, onBack }) {
    const [tab, setTab] = React.useState('all');
    const [items, setItems] = React.useState(MOCK_PRODUCTS);
    const [rejecting, setRejecting] = React.useState(null);
    const ST = { APPROVED: ['success', 'Đang bán'], PENDING: ['warning', 'Chờ duyệt'], REJECTED: ['danger', 'Đã ẩn'] };
    const set = (idx, status, reason) => setItems((it) => it.map((p, i) => (i === idx ? { ...p, status, reason } : p)));
    const list = items.map((p, i) => ({ ...p, _i: i })).filter((p) => tab === 'all' || (tab === 'pending' ? p.status === 'PENDING' : tab === 'sale' ? p.status === 'APPROVED' : p.status === 'REJECTED'));
    const pendCount = items.filter((p) => p.status === 'PENDING').length;
    return (
      <div style={{ maxWidth: 1180 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer', marginBottom: 12 }}><Icon name="chevron-left" size={16} /> Quay lại danh mục</button>
        <div style={{ font: 'var(--weight-bold) var(--text-xl) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 14 }}>Sản phẩm — {sub}</div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '4px 16px 0' }}>
            <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Tất cả' }, { id: 'pending', label: 'Chờ duyệt', badge: pendCount || undefined }, { id: 'sale', label: 'Đang bán' }, { id: 'hidden', label: 'Đã ẩn' }]} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
              <thead><tr style={hrow}><th style={th}>Sản phẩm</th><th style={th}>Shop</th><th style={{ ...th, textAlign: 'right' }}>Giá</th><th style={{ ...th, textAlign: 'right' }}>Kho</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {list.map((p) => { const [v, l] = ST[p.status]; return (
                  <tr key={p._i} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                    <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={'../../assets/img/' + p.img + '.jpg'} onError={(e) => { e.target.style.visibility = 'hidden'; }} style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover', background: 'var(--gray-100)' }} /><span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-strong)' }}>{p.name}</span></div></td>
                    <td style={{ ...td, color: 'var(--text-muted)' }}>{p.shop}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: 'var(--text-price)' }}>{fmtV(p.price)}</td>
                    <td style={{ ...td, textAlign: 'right' }}>{p.stock}</td>
                    <td style={td}><Badge variant={v}>{l}</Badge>{p.status === 'REJECTED' && p.reason && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 3 }}>{p.reason}</div>}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {p.status === 'PENDING'
                        ? <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}><Button size="sm" variant="ghost" style={{ color: 'var(--red-600)' }} onClick={() => setRejecting(p._i)}>Từ chối</Button><Button size="sm" iconLeft="check" onClick={() => set(p._i, 'APPROVED')}>Duyệt</Button></div>
                        : <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>—</span>}
                    </td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        </div>
        {rejecting !== null && <Modal open onClose={() => setRejecting(null)} title="Từ chối sản phẩm"
          footer={<><Button variant="ghost" onClick={() => setRejecting(null)}>Huỷ</Button><Button variant="danger" onClick={() => { set(rejecting, 'REJECTED', document.getElementById('p-reason').value); setRejecting(null); }}>Xác nhận từ chối</Button></>}>
          <div style={{ width: 'min(440px, 82vw)' }}><Select label="Lý do từ chối" id="p-reason">{P_REASONS.map((r) => <option key={r}>{r}</option>)}</Select></div>
        </Modal>}
      </div>
    );
  }

  /* ---- VĐ-5A: add / edit category modal ---- */
  function CatModal({ cat, tree, onClose }) {
    const editing = cat && cat.id;
    const [f, setF] = React.useState({ name: cat.name || '', slug: cat.id || '', parent: '', icon: cat.icon || 'package', comm: cat.comm != null ? String(cat.comm) : '5', on: cat.on != null ? cat.on : true });
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    return (
      <Modal open onClose={onClose} width={520}
        title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="boxes" size={18} style={{ color: 'var(--blue-600)' }} />{editing ? `Sửa danh mục — ${cat.name}` : 'Thêm danh mục'}</span>}
        footer={<><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="check" onClick={onClose}>Lưu danh mục</Button></>}>
        <div style={{ width: 'min(480px, 84vw)', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <Input label="Tên danh mục" value={f.name} onChange={(e) => { set('name', e.target.value); if (!editing) set('slug', slugify(e.target.value)); }} placeholder="Thú cưng" required />
          <div>
            <label style={clab}>Slug (URL)</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <div style={{ flex: 1 }}><Input value={f.slug} onChange={(e) => set('slug', e.target.value)} /></div>
              <Button variant="secondary" iconLeft="refresh-cw" onClick={() => set('slug', slugify(f.name))}>Auto</Button>
            </div>
          </div>
          <div><label style={clab}>Danh mục cha</label><div style={{ marginTop: 6 }}><Select value={f.parent} onChange={(e) => set('parent', e.target.value)}><option value="">— Danh mục gốc (root)</option>{tree.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></div></div>
          <div>
            <label style={clab}>Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {CAT_ICONS.map((ic) => { const on = f.icon === ic; return (
                <button key={ic} onClick={() => set('icon', ic)} style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (on ? 'var(--blue-500)' : 'var(--border-default)'), background: on ? 'var(--blue-50)' : '#fff', color: on ? 'var(--blue-600)' : 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name={ic} size={19} /></button>
              ); })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
            <div style={{ width: 140 }}><Input label="Hoa hồng mặc định (%)" value={f.comm} onChange={(e) => set('comm', e.target.value.replace(/\D/g, ''))} iconRight="percent" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Hiển thị</span><Switch checked={f.on} onChange={() => set('on', !f.on)} /></div>
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
  const th = { padding: '10px 16px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 16px', whiteSpace: 'nowrap' };
  const clab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };

  window.LZACatalog = Catalog;
})();
