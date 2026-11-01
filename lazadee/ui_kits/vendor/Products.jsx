/* Vendor: product management with SKU variants (price>0, stock>=0), draft vs
   published. Publish is blocked until shop KYC is VERIFIED.
   Editor is a 6-section form: Images · Basic info (cascading category + brand
   combobox) · Specs table · Rich description · Variants & price · Shipping. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Input, Select, Switch, Money, Tabs } = DS;
  const formatVND = Money.format;
  const IMG_TINT = ['var(--orange-100, #FFE6D9)', 'var(--blue-100, #DCE8FE)', 'var(--mint-100, #D6F5E6)', 'var(--gold-100, #FFEFC2)'];

  const PRODUCTS = [
    { name: 'Tai nghe Bluetooth ANC Pro 5', img: 'headphones', skus: 4, price: 389000, stock: 38, sold: '2,1k', state: 'PUBLISHED' },
    { name: 'Đồng hồ thông minh Watch S2', img: 'watch', skus: 3, price: 690000, stock: 12, sold: '986', state: 'PUBLISHED' },
    { name: 'Loa bluetooth mini IPX7', img: 'speaker', skus: 2, price: 320000, stock: 0, sold: '2,6k', state: 'PUBLISHED' },
    { name: 'Bàn phím cơ RGB switch blue', img: 'keyboard', skus: 6, price: 459000, stock: 54, sold: '1,9k', state: 'DRAFT' },
    { name: 'Camera Mirrorless X-100 (bản mới)', img: 'camera', skus: 1, price: 12990000, stock: 8, sold: '—', state: 'DRAFT' },
  ];

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22, marginBottom: 16 };
  const cardHead = (icon, title, right) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <Icon name={icon} size={19} style={{ color: 'var(--color-primary)' }} />
      <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{title}</span>
      {right}
    </div>
  );
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block', marginBottom: 6 };
  const hint = { font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 6 };

  /* ---- VĐ-1: product image uploader (main + up to 7 secondary) ---- */
  function ImageUpload() {
    const [images, setImages] = React.useState([{ id: 1, tint: IMG_TINT[0] }, { id: 2, tint: IMG_TINT[1] }, { id: 3, tint: IMG_TINT[2] }]);
    const add = () => { if (images.length >= 8) return; setImages((im) => [...im, { id: Date.now(), tint: IMG_TINT[im.length % IMG_TINT.length] }]); };
    const remove = (id) => setImages((im) => im.filter((x) => x.id !== id));
    const Slot = ({ img, main }) => {
      const dim = main ? 200 : 120;
      return (
        <div style={{ position: 'relative', width: dim, height: dim, flex: 'none', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: main ? '2px dashed var(--color-primary)' : '1.5px dashed var(--border-strong)' }}>
          <div style={{ width: '100%', height: '100%', background: img.tint, display: 'grid', placeItems: 'center' }}><Icon name="image" size={main ? 40 : 26} style={{ color: 'rgba(0,0,0,.28)' }} /></div>
          {main && <span style={{ position: 'absolute', top: 6, left: 6, font: '700 10px var(--font-sans)', color: '#fff', background: 'var(--color-primary)', borderRadius: 'var(--radius-pill)', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="star" size={11} />Ảnh chính</span>}
          <button onClick={() => remove(img.id)} aria-label="Xoá ảnh" style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', border: 0, background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="x" size={14} /></button>
        </div>
      );
    };
    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon name="image" size={19} style={{ color: 'var(--color-primary)' }} />
          <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Hình ảnh sản phẩm</span>
          {images.length === 0 && <Badge variant="danger">Tối thiểu 1 ảnh</Badge>}
          <Badge variant="neutral" style={{ marginLeft: 'auto' }}>JPG/PNG · ≤ 2MB · 1:1</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          {images.map((img, i) => <Slot key={img.id} img={img} main={i === 0} />)}
          {images.length < 8 && (
            <button onClick={add} style={{ width: 120, height: 120, flex: 'none', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-strong)', background: 'var(--gray-50)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-subtle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}>
              <Icon name="image-plus" size={28} /><span style={{ font: 'var(--type-caption)' }}>Thêm ảnh</span>
            </button>
          )}
        </div>
        <div style={hint}>Tối đa 8 ảnh · JPG/PNG · ≤ 2MB/ảnh · Tỉ lệ 1:1 khuyến nghị. Ảnh đầu tiên là ảnh chính hiển thị trên kết quả tìm kiếm. Kéo thả để sắp xếp.</div>
      </div>
    );
  }

  /* ---- SECTION 2: basic info — cascading category + brand combobox ---- */
  const CATEGORY_TREE = {
    'Điện tử': {
      'Điện thoại & Phụ kiện': ['Điện thoại', 'Ốp lưng & Bao da', 'Miếng dán màn hình', 'Sạc & Cáp', 'Phụ kiện khác'],
      'Máy tính & Laptop': ['Laptop', 'PC & Linh kiện', 'Bàn phím', 'Chuột', 'Phụ kiện PC', 'Webcam'],
      'Tai nghe & Loa': ['Tai nghe có dây', 'Tai nghe Bluetooth', 'Loa Bluetooth', 'Loa thông minh'],
      'Camera': ['Mirrorless', 'DSLR', 'Action cam', 'Phụ kiện camera'],
    },
    'Thời trang': {
      'Thời trang Nam': ['Áo thun', 'Áo sơ mi', 'Quần jeans', 'Quần short', 'Giày', 'Phụ kiện'],
      'Thời trang Nữ': ['Đầm & Váy', 'Áo kiểu', 'Quần', 'Giày & Dép', 'Túi xách', 'Phụ kiện'],
      'Đồ lót & Đồ ngủ': ['Đồ lót nam', 'Đồ lót nữ', 'Đồ ngủ'],
    },
    'Làm đẹp': {
      'Chăm sóc da': ['Sữa rửa mặt', 'Kem chống nắng', 'Serum', 'Toner', 'Kem dưỡng'],
      'Trang điểm': ['Son', 'Phấn', 'Mascara', 'Kẻ mắt', 'Kem nền'],
      'Chăm sóc tóc': ['Dầu gội', 'Dầu xả', 'Serum tóc'],
    },
    'Nhà cửa & Đời sống': {
      'Nội thất': ['Bàn', 'Ghế', 'Kệ sách', 'Đèn'],
      'Đồ dùng nhà bếp': ['Nồi & Chảo', 'Dao & Thớt', 'Gia vị & Đồ khô'],
      'Đồ dùng phòng tắm': ['Khăn', 'Đồ dùng vệ sinh'],
    },
    'Mẹ & Bé': {
      'Đồ dùng cho bé': ['Tã & Bỉm', 'Sữa & Dinh dưỡng', 'Đồ chơi'],
      'Đồ dùng cho mẹ': ['Thời trang bầu', 'Đồ dùng sau sinh'],
    },
  };
  const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Sony', 'Logitech', 'Anker', 'JBL', 'No Brand', 'OEM', 'Baseus', 'Ugreen'];

  function CategoryPicker({ value, onChange }) {
    const [open, setOpen] = React.useState(!value.length);
    const [l1, setL1] = React.useState(value[0] || null);
    const [l2, setL2] = React.useState(value[1] || null);
    const col = { width: 200, height: 280, overflowY: 'auto', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' };
    const ItemRow = ({ label, active, hasChild, onClick }) => (
      <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', width: '100%', border: 0, padding: '8px 14px', cursor: 'pointer', textAlign: 'left', font: (active ? '600' : '400') + ' 13px var(--font-sans)', background: active ? 'var(--color-primary-tint)' : 'transparent', color: active ? 'var(--orange-700)' : 'var(--text-body)' }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--gray-50)'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
        <span style={{ flex: 1 }}>{label}</span>
        {hasChild && <Icon name="chevron-right" size={14} style={{ color: 'var(--text-subtle)' }} />}
        {active && !hasChild && <Icon name="check" size={14} />}
      </button>
    );
    if (!open) {
      return (
        <div>
          <label style={lab}>Danh mục <span style={{ color: 'var(--red-600)' }}>*</span></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
            <Icon name="boxes" size={16} style={{ color: 'var(--text-subtle)' }} />
            <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--text-strong)' }}>{value.join(' › ')}</span>
            <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>Thay đổi</Button>
          </div>
        </div>
      );
    }
    const l2obj = l1 ? CATEGORY_TREE[l1] : null;
    const l3arr = l1 && l2 ? CATEGORY_TREE[l1][l2] : null;
    return (
      <div>
        <label style={lab}>Danh mục <span style={{ color: 'var(--red-600)' }}>*</span></label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={col}>
            {Object.keys(CATEGORY_TREE).map((k) => <ItemRow key={k} label={k} active={l1 === k} hasChild onClick={() => { setL1(k); setL2(null); }} />)}
          </div>
          {l2obj && <div style={col}>
            {Object.keys(l2obj).map((k) => <ItemRow key={k} label={k} active={l2 === k} hasChild onClick={() => setL2(k)} />)}
          </div>}
          {l3arr && <div style={col}>
            {l3arr.map((k) => <ItemRow key={k} label={k} active={value[2] === k} onClick={() => { onChange([l1, l2, k]); setOpen(false); }} />)}
          </div>}
        </div>
        <div style={hint}>Chọn dần từ danh mục cha đến danh mục con. Danh mục cuối cùng xác định phí hoa hồng &amp; thông số gợi ý.</div>
      </div>
    );
  }

  function BrandCombo({ value, onChange }) {
    const [q, setQ] = React.useState(value || '');
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);
    const matches = BRANDS.filter((b) => b.toLowerCase().includes(q.trim().toLowerCase()));
    const exact = BRANDS.some((b) => b.toLowerCase() === q.trim().toLowerCase());
    const pick = (b) => { onChange(b); setQ(b); setOpen(false); };
    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <label style={lab}>Thương hiệu</label>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={15} style={{ position: 'absolute', left: 12, top: 15, color: 'var(--text-subtle)' }} />
          <input value={q} onChange={(e) => { setQ(e.target.value); onChange(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Tìm hoặc nhập thương hiệu…"
            style={{ width: '100%', height: 44, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px 0 34px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' }} />
        </div>
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 30, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}>
            {matches.map((b) => (
              <button key={b} onClick={() => pick(b)} style={{ display: 'flex', alignItems: 'center', width: '100%', border: 0, background: 'transparent', padding: '9px 14px', cursor: 'pointer', textAlign: 'left', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ flex: 1 }}>{b}</span>{value === b && <Icon name="check" size={14} style={{ color: 'var(--orange-600)' }} />}
              </button>
            ))}
            {q.trim() && !exact && (
              <button onClick={() => pick(q.trim())} style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', border: 0, borderTop: matches.length ? '1px solid var(--border-subtle)' : 0, background: 'transparent', padding: '9px 14px', cursor: 'pointer', textAlign: 'left', font: '600 var(--text-sm) var(--font-sans)', color: 'var(--orange-600)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--orange-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <Icon name="plus" size={14} />Thêm “{q.trim()}” làm thương hiệu mới
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  function BasicInfo({ category, onCategory }) {
    const [brand, setBrand] = React.useState('No Brand');
    return (
      <div style={card}>
        {cardHead('clipboard-check', 'Thông tin cơ bản')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Input label="Tên sản phẩm" defaultValue="Bàn phím cơ RGB switch blue Full-size" required />
            <div style={hint}>Tên gồm: Thương hiệu + Loại sản phẩm + Đặc điểm nổi bật. VD: Samsung Galaxy S24 Ultra 256GB Titanium</div>
          </div>
          <CategoryPicker value={category} onChange={onCategory} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <BrandCombo value={brand} onChange={setBrand} />
            <div />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Select label="Tình trạng" required><option>Mới</option><option>Đã qua sử dụng</option><option>Refurbished</option></Select>
            <Input label="Xuất xứ" defaultValue="Việt Nam" placeholder="VD: Việt Nam, Trung Quốc, Hàn Quốc" />
          </div>
        </div>
      </div>
    );
  }

  /* ---- SECTION 3: dynamic specs key-value table ---- */
  const SUGGESTED_SPECS = {
    'Điện tử': ['Bảo hành', 'Kết nối', 'Pin', 'Trọng lượng sản phẩm'],
    'Thời trang': ['Chất liệu', 'Xuất xứ vải', 'Hướng dẫn giặt'],
    'Làm đẹp': ['Thành phần', 'Dung tích', 'Hạn sử dụng', 'Loại da phù hợp'],
  };
  function SpecsTable({ rootCat }) {
    const [specs, setSpecs] = React.useState([
      { key: 'Chất liệu', value: 'Nhựa ABS + Polycarbonate' },
      { key: 'Loại switch', value: 'Cherry MX Blue' },
      { key: 'Layout', value: 'Full-size (104 phím)' },
      { key: 'Kết nối', value: 'USB-C, Bluetooth 5.0' },
      { key: 'Đèn nền', value: 'RGB 16.8 triệu màu' },
      { key: 'Pin', value: '4000mAh' },
      { key: 'Bảo hành', value: '12 tháng chính hãng' },
    ]);
    // ensure a trailing empty row for quick entry
    const rows = specs.length && specs[specs.length - 1].key === '' && specs[specs.length - 1].value === '' ? specs : [...specs, { key: '', value: '' }];
    const setRow = (i, patch) => {
      const next = rows.map((r, k) => (k === i ? { ...r, ...patch } : r));
      setSpecs(next.filter((r, k) => !(r.key === '' && r.value === '' && k !== next.length - 1)));
    };
    const removeRow = (i) => setSpecs(rows.filter((_, k) => k !== i).filter((r) => !(r.key === '' && r.value === '')));
    const addSuggested = (k) => setSpecs((s) => [...s.filter((r) => r.key || r.value), { key: k, value: '' }]);
    const sugg = (SUGGESTED_SPECS[rootCat] || []).filter((s) => !specs.some((r) => r.key === s));
    const cellInput = { width: '100%', border: 'none', background: 'transparent', padding: '10px 12px', font: 'var(--type-body-sm)', outline: 'none', color: 'var(--text-strong)', boxSizing: 'border-box' };
    const focusBg = (e) => (e.currentTarget.style.background = 'var(--blue-50, #EBF5FF)');
    const blurBg = (e) => (e.currentTarget.style.background = 'transparent');
    return (
      <div style={card}>
        {cardHead('sliders-horizontal', 'Thông số kỹ thuật', <Button size="sm" variant="ghost" iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={() => setSpecs((s) => [...s, { key: '', value: '' }])}>Thêm hàng</Button>)}
        {sugg.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Gợi ý:</span>
            {sugg.map((s) => <button key={s} onClick={() => addSuggested(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px dashed var(--border-strong)', background: '#fff', borderRadius: 'var(--radius-pill)', padding: '3px 10px', font: '600 12px var(--font-sans)', color: 'var(--orange-600)', cursor: 'pointer' }}><Icon name="plus" size={12} />{s}</button>)}
          </div>
        )}
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: 'var(--gray-25)', font: '600 12px var(--font-sans)', color: 'var(--text-muted)' }}>
            <div style={{ width: 220, padding: '10px 12px' }}>Tên thông số</div>
            <div style={{ flex: 1, padding: '10px 12px' }}>Giá trị</div>
            <div style={{ width: 44 }} />
          </div>
          {rows.map((r, i) => {
            const empty = r.key === '' && r.value === '';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <input value={r.key} onChange={(e) => setRow(i, { key: e.target.value })} onFocus={focusBg} onBlur={blurBg} placeholder="Nhập tên thông số…" style={{ ...cellInput, width: 220, borderRight: '1px solid var(--border-subtle)' }} />
                <input value={r.value} onChange={(e) => setRow(i, { value: e.target.value })} onFocus={focusBg} onBlur={blurBg} placeholder="Nhập giá trị…" style={{ ...cellInput, flex: 1 }} />
                <div style={{ width: 44, display: 'grid', placeItems: 'center' }}>
                  {!empty && <button onClick={() => removeRow(i)} aria-label="Xoá" style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--text-subtle)', display: 'grid', placeItems: 'center', padding: 6 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red-600)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}><Icon name="x" size={15} /></button>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 7, ...hint, marginTop: 10 }}><Icon name="info" size={14} style={{ flex: 'none', marginTop: 1 }} />Thông số sẽ hiển thị trong mục “Chi tiết sản phẩm” trên trang sản phẩm cho khách hàng xem.</div>
      </div>
    );
  }

  /* ---- SECTION 4: rich description (contentEditable + fake toolbar) ---- */
  function RichDescription() {
    const ref = React.useRef(null);
    const [count, setCount] = React.useState(0);
    const PREFILL = '<p style="font-weight:700">BÀN PHÍM CƠ RGB — GÕ SƯỚNG TAY, BỀN BỈ</p>'
      + '<p>Bàn phím cơ full-size với switch Cherry MX Blue, hành trình phím rõ ràng, phản hồi nhanh — lý tưởng cho cả làm việc và gaming.</p>'
      + '<p style="font-weight:700">Thông tin sản phẩm:</p>'
      + '<ul><li>Chất liệu: Nhựa ABS cao cấp, khung kim loại</li><li>Switch: Cherry MX Blue (clicky)</li><li>Kết nối: USB-C có dây &amp; Bluetooth 5.0</li><li>Đèn nền RGB 16.8 triệu màu, 18 hiệu ứng</li></ul>'
      + '<p style="font-weight:700">Cam kết:</p>'
      + '<ul><li>✅ Hàng chính hãng 100%</li><li>✅ Đổi trả miễn phí trong 7 ngày</li><li>✅ Bảo hành 12 tháng · Giao hàng toàn quốc</li></ul>';
    React.useEffect(() => { if (ref.current) { ref.current.innerHTML = PREFILL; setCount(ref.current.innerText.length); } }, []);
    const tools = [['bold', 'B'], ['italic', 'I'], ['underline', 'U'], '|', ['heading', 'H1'], ['heading', 'H2'], '|', ['list', '•'], ['list-ordered', '1.'], '|', ['paperclip', null], ['image', null]];
    const cColor = count > 9500 ? 'var(--red-600)' : count > 8000 ? 'var(--amber-600, #C77700)' : 'var(--text-subtle)';
    return (
      <div style={card}>
        {cardHead('file-text', 'Mô tả chi tiết sản phẩm')}
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--gray-25)', borderBottom: '1px solid var(--border-subtle)', padding: '5px 8px' }}>
            {tools.map((t, i) => t === '|'
              ? <span key={i} style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 4px' }} />
              : <button key={i} onMouseDown={(e) => e.preventDefault()} style={{ minWidth: 32, height: 32, border: 0, background: 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer', font: (t[0] === 'bold' ? '700' : t[0] === 'italic' ? '400' : '600') + ' 13px var(--font-sans)', fontStyle: t[0] === 'italic' ? 'italic' : 'normal', textDecoration: t[0] === 'underline' ? 'underline' : 'none', color: 'var(--text-body)', display: 'grid', placeItems: 'center', padding: '0 6px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-100)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  {t[1] || <Icon name={t[0]} size={16} />}
                </button>)}
          </div>
          <div ref={ref} contentEditable suppressContentEditableWarning onInput={(e) => setCount(e.currentTarget.innerText.length)}
            style={{ minHeight: 320, padding: '18px 20px', font: 'var(--type-body)', lineHeight: 1.7, color: 'var(--text-body)', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.parentNode.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.currentTarget.parentNode.style.borderColor = 'var(--border-default)')} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ font: '600 12px var(--font-sans)', color: cColor, fontVariantNumeric: 'tabular-nums' }}>Đã nhập: {count.toLocaleString('vi-VN')} / 10.000 ký tự</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center', ...hint, marginTop: 0, marginLeft: 'auto' }}><Icon name="info" size={13} />Mô tả tốt giúp tăng tỷ lệ mua hàng — nên có ảnh minh hoạ, chất liệu, cam kết.</span>
        </div>
      </div>
    );
  }

  /* ---- SECTION 5: dynamic variant groups + auto matrix (group name = combobox) ---- */
  const GROUP_NAMES = ['Màu sắc', 'Kích thước', 'Chất liệu', 'Kiểu dáng', 'Phiên bản', 'Dung lượng', 'Hương vị', 'Số lượng', 'Loại', 'Combo'];
  function GroupNameCombo({ value, onChange }) {
    const [q, setQ] = React.useState(value || '');
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => { setQ(value || ''); }, [value]);
    React.useEffect(() => {
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);
    const matches = GROUP_NAMES.filter((b) => b.toLowerCase().includes(q.trim().toLowerCase()));
    const exact = GROUP_NAMES.some((b) => b.toLowerCase() === q.trim().toLowerCase());
    return (
      <div ref={ref} style={{ position: 'relative', width: 200 }}>
        <input value={q} onChange={(e) => { setQ(e.target.value); onChange(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Chọn / nhập tên nhóm…"
          style={{ width: '100%', height: 40, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' }} />
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 30, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
            {matches.map((b) => (
              <button key={b} onClick={() => { onChange(b); setQ(b); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', width: '100%', border: 0, background: 'transparent', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ flex: 1 }}>{b}</span>{value === b && <Icon name="check" size={14} style={{ color: 'var(--orange-600)' }} />}
              </button>
            ))}
            {q.trim() && !exact && (
              <button onClick={() => { onChange(q.trim()); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', border: 0, borderTop: matches.length ? '1px solid var(--border-subtle)' : 0, background: 'transparent', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', font: '600 13px var(--font-sans)', color: 'var(--orange-600)' }}>
                <Icon name="pencil" size={13} />Tự đặt tên: “{q.trim()}”
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
  function TagInput({ values, onAdd, onRemove }) {
    const [v, setV] = React.useState('');
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {values.map((val) => (
          <span key={val} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--gray-100)', borderRadius: 'var(--radius-pill)', padding: '4px 10px', font: '600 13px var(--font-sans)', color: 'var(--text-body)' }}>
            {val}
            <button onClick={() => onRemove(val)} style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-subtle)', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red-600)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}><Icon name="x" size={13} /></button>
          </span>
        ))}
        <input value={v} placeholder="Nhập giá trị…" onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && v.trim()) { onAdd(v.trim()); setV(''); } }}
          style={{ minWidth: 110, height: 30, border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '0 12px', font: '13px var(--font-sans)', outline: 'none', background: 'transparent' }} />
      </div>
    );
  }
  function VariantSection() {
    const [groups, setGroups] = React.useState([
      { name: 'Màu sắc', values: ['Đen', 'Trắng'] },
      { name: 'Switch', values: ['Blue', 'Red'] },
    ]);
    const [bulk, setBulk] = React.useState({ price: '', stock: '' });
    const [cells, setCells] = React.useState({});
    const setGroup = (i, patch) => setGroups((g) => g.map((x, k) => (k === i ? { ...x, ...patch } : x)));
    const addValue = (i, val) => setGroup(i, { values: [...groups[i].values, val] });
    const removeValue = (i, val) => setGroup(i, { values: groups[i].values.filter((v) => v !== val) });
    const addGroup = () => groups.length < 2 && setGroups((g) => [...g, { name: '', values: [] }]);
    const removeGroup = (i) => setGroups((g) => g.filter((_, k) => k !== i));
    const active = groups.filter((g) => g.values.length > 0);
    const rows = active.reduce((acc, g) => { const out = []; acc.forEach((combo) => g.values.forEach((v) => out.push([...combo, v]))); return out; }, [[]]).filter((r) => r.length === active.length);
    const key = (r) => r.join('|');
    const cellVal = (r, field, dflt) => { const c = cells[key(r)] || {}; return c[field] !== undefined ? c[field] : dflt; };
    const setCell = (r, field, val) => setCells((c) => ({ ...c, [key(r)]: { ...(c[key(r)] || {}), [field]: val } }));
    const applyAll = () => { const next = {}; rows.forEach((r) => { next[key(r)] = { price: bulk.price, stock: bulk.stock }; }); setCells(next); };
    return (
      <div style={card}>
        {cardHead('tag', 'Phân loại hàng & Giá', <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}><Badge variant="neutral">Tối đa 2 nhóm</Badge>{groups.length < 2 && <Button variant="ghost" size="sm" iconLeft="plus" onClick={addGroup}>Thêm nhóm</Button>}</span>)}
        {groups.map((g, i) => (
          <div key={i} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '13px 15px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)' }}>Nhóm {i + 1}</span>
              <GroupNameCombo value={g.name} onChange={(v) => setGroup(i, { name: v })} />
              <Button variant="ghost" size="sm" iconLeft="trash-2" style={{ marginLeft: 'auto', color: 'var(--red-600)' }} onClick={() => removeGroup(i)}>Xoá nhóm</Button>
            </div>
            <TagInput values={g.values} onAdd={(v) => addValue(i, v)} onRemove={(v) => removeValue(i, v)} />
          </div>
        ))}
        {active.length === 0 ? (
          <div style={{ marginTop: 6 }}>
            <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 12 }}>Thêm phân loại hàng nếu sản phẩm có nhiều biến thể (màu, size…). Hoặc nhập giá &amp; tồn kho đơn lẻ:</div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}><Input label="Giá (₫)" iconRight="banknote" placeholder="0" /></div>
              <div style={{ flex: 1 }}><Input label="Tồn kho" placeholder="0" /></div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '12px 14px', margin: '6px 0 14px' }}>
              <span style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', marginBottom: 11 }}>Áp dụng nhanh:</span>
              <div style={{ width: 150 }}><Input label="Giá" value={bulk.price} onChange={(e) => setBulk((b) => ({ ...b, price: e.target.value.replace(/\D/g, '') }))} iconRight="banknote" /></div>
              <div style={{ width: 110 }}><Input label="Tồn kho" value={bulk.stock} onChange={(e) => setBulk((b) => ({ ...b, stock: e.target.value.replace(/[^0-9]/g, '') }))} /></div>
              <Button variant="secondary" onClick={applyAll}>Áp dụng</Button>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}>
                  {active.map((g, i) => <th key={i} style={{ padding: '10px 14px' }}>{g.name || `Nhóm ${i + 1}`}</th>)}
                  <th style={{ padding: '10px 14px' }}>Giá (₫)</th><th style={{ padding: '10px 14px' }}>Tồn kho</th><th style={{ padding: '10px 14px' }}>SKU</th>
                </tr></thead>
                <tbody>
                  {rows.map((r) => {
                    const price = cellVal(r, 'price', '');
                    const stock = cellVal(r, 'stock', '');
                    const priceErr = price !== '' && Number(price) <= 0;
                    return (
                      <tr key={key(r)} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)' }}>
                        {r.map((v, i) => <td key={i} style={{ padding: '8px 14px', color: 'var(--text-body)' }}>{v}</td>)}
                        <td style={{ padding: '8px 14px', width: 150 }}><Input value={price} onChange={(e) => setCell(r, 'price', e.target.value.replace(/\D/g, ''))} placeholder="0" invalid={priceErr} />{priceErr && <div style={{ font: '11px var(--font-sans)', color: 'var(--red-600)', marginTop: 3 }}>Giá &gt; 0</div>}</td>
                        <td style={{ padding: '8px 14px', width: 110 }}><Input value={stock} onChange={(e) => setCell(r, 'stock', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" /></td>
                        <td style={{ padding: '8px 14px', width: 150 }}><span className="code" style={{ fontSize: 12, color: 'var(--text-muted)' }}>SKU·{r.map((v) => v.slice(0, 2).toUpperCase()).join('·')}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ---- SECTION 6: shipping ---- */
  function ShippingInfo() {
    const [payer, setPayer] = React.useState('buyer');
    const dimInput = { width: '100%', height: 44, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' };
    return (
      <div style={card}>
        {cardHead('package', 'Thông tin vận chuyển')}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ width: 200 }}><Input label="Cân nặng đóng gói (g)" defaultValue="850" required /></div>
          <div>
            <label style={lab}>Kích thước đóng gói (cm)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['D', '30'], ['R', '20'], ['C', '10']].map(([p, v]) => (
                <div key={p} style={{ position: 'relative', width: 92 }}>
                  <span style={{ position: 'absolute', left: 11, top: 13, font: '600 13px var(--font-sans)', color: 'var(--text-subtle)' }}>{p}:</span>
                  <input defaultValue={v} style={{ ...dimInput, paddingLeft: 30 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7, ...hint, marginTop: 0, marginBottom: 16 }}><Icon name="info" size={14} style={{ flex: 'none', marginTop: 1 }} />Dùng để tính phí vận chuyển. Nếu bỏ trống, hãng vận chuyển sẽ cân/đo thực tế.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Select label="Gửi hàng từ" defaultValue="TP. Hồ Chí Minh"><option>TP. Hồ Chí Minh</option><option>Hà Nội</option><option>Đà Nẵng</option><option>Cần Thơ</option><option>Khác</option></Select>
          <div>
            <label style={lab}>Phí ship do</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                <input type="radio" name="payer" checked={payer === 'buyer'} onChange={() => setPayer('buyer')} style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }} />Người mua chịu (mặc định)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                <input type="radio" name="payer" checked={payer === 'shop'} onChange={() => setPayer('shop')} style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }} />
                Shop hỗ trợ freeship đơn từ
                <input defaultValue="200000" disabled={payer !== 'shop'} style={{ width: 110, height: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 10px', font: 'var(--type-body-sm)', outline: 'none', opacity: payer === 'shop' ? 1 : 0.5 }} />
                <span style={{ color: 'var(--text-muted)' }}>₫</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Editor({ onClose }) {
    const kycStatus = window.LZ_KYC_STATUS || 'VERIFIED';
    const [category, setCategory] = React.useState(['Điện tử', 'Máy tính & Laptop', 'Bàn phím']);
    return (
      <div style={{ maxWidth: 1180 }}>
        <button onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer', marginBottom: 14 }}><Icon name="chevron-left" size={16} /> Quay lại danh sách</button>
        <ImageUpload />
        <BasicInfo category={category} onCategory={setCategory} />
        <SpecsTable rootCat={category[0]} />
        <RichDescription />
        <VariantSection />
        <ShippingInfo />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" iconLeft="file-text">Lưu nháp</Button>
          <Button iconLeft="check" disabled={kycStatus !== 'VERIFIED'}>Đăng bán</Button>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)' }}>
            {kycStatus === 'VERIFIED' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--mint-600)' }}><Icon name="shield-check" size={14} /> Shop đã VERIFIED — được phép đăng bán</span>}
            {kycStatus === 'PENDING' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--amber-600, #C77700)' }}><Icon name="clock" size={14} /> KYC đang chờ duyệt — chưa thể đăng bán</span>}
            {kycStatus === 'REJECTED' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--red-600)' }}><Icon name="triangle-alert" size={14} /> KYC bị từ chối — vui lòng nộp lại hồ sơ</span>}
          </span>
        </div>
      </div>
    );
  }

  function Products() {
    const [tab, setTab] = React.useState('all');
    const [editing, setEditing] = React.useState(false);
    if (editing) return <Editor onClose={() => setEditing(false)} />;
    const list = PRODUCTS.filter((p) => tab === 'all' || (tab === 'pub' ? p.state === 'PUBLISHED' : p.state === 'DRAFT'));
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <Tabs value={tab} onChange={setTab} items={[
              { id: 'all', label: 'Tất cả', badge: PRODUCTS.length },
              { id: 'pub', label: 'Đang bán', badge: PRODUCTS.filter((p) => p.state === 'PUBLISHED').length },
              { id: 'draft', label: 'Bản nháp', badge: PRODUCTS.filter((p) => p.state === 'DRAFT').length },
            ]} />
          </div>
          <Button iconLeft="plus-circle" onClick={() => setEditing(true)}>Thêm sản phẩm</Button>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}>
              <th style={th}>Sản phẩm</th><th style={th}>SKU</th><th style={{ ...th, textAlign: 'right' }}>Giá</th><th style={{ ...th, textAlign: 'right' }}>Kho</th><th style={{ ...th, textAlign: 'right' }}>Đã bán</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}></th>
            </tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.name} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                  <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={'../../assets/img/' + p.img + '.jpg'} style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} /><span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-strong)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span></div></td>
                  <td style={{ ...td, color: 'var(--text-muted)' }}>{p.skus} loại</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: 'var(--text-price)' }}>{formatVND(p.price)}</td>
                  <td style={{ ...td, textAlign: 'right', color: p.stock === 0 ? 'var(--red-600)' : 'var(--text-body)', fontWeight: p.stock === 0 ? 600 : 400 }}>{p.stock === 0 ? 'Hết' : p.stock}</td>
                  <td style={{ ...td, textAlign: 'right', color: 'var(--text-muted)' }}>{p.sold}</td>
                  <td style={td}>{p.state === 'PUBLISHED' ? <Badge variant="success" icon="circle-check">Đang bán</Badge> : <Badge variant="neutral" icon="file-text">Nháp</Badge>}</td>
                  <td style={{ ...td, textAlign: 'right' }}><div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}><Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(true)}>Sửa</Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const th = { padding: '11px 16px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 16px', whiteSpace: 'nowrap' };
  window.LZVProducts = Products;
})();
