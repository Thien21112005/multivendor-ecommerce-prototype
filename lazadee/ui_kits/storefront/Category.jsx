/* Lazadee category landing page: colored header, sub-category chips, filter sidebar
   (price band, Mall, Freeship, rating), sort bar and paginated product grid. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, ProductCard, Checkbox } = DS;
  const LZ = window.LZ;

  const PAGE_SIZE = 12;
  const BANDS = [
    { id: 'b1', label: 'Dưới 100.000₫', min: 0, max: 100000 },
    { id: 'b2', label: '100.000₫ – 500.000₫', min: 100000, max: 500000 },
    { id: 'b3', label: '500.000₫ – 1.000.000₫', min: 500000, max: 1000000 },
    { id: 'b4', label: 'Trên 1.000.000₫', min: 1000000, max: Infinity },
  ];
  const SORTS = [{ id: 'rel', label: 'Liên quan' }, { id: 'hot', label: 'Bán chạy' }, { id: 'new', label: 'Mới nhất' }, { id: 'price', label: 'Giá' }];
  const parseSold = (s) => { const n = parseFloat(String(s).replace(',', '.')); return /k/i.test(String(s)) ? n * 1000 : n; };

  function Category({ categoryName, onOpen, onHome, onCategory }) {
    const meta = LZ.CATEGORY_META[categoryName] || { icon: 'package', desc: 'Khám phá các sản phẩm trong danh mục này.' };
    const subs = LZ.subCategoriesOf(categoryName);
    const [sub, setSub] = React.useState(null);
    const [sort, setSort] = React.useState('rel');
    const [asc, setAsc] = React.useState(true);
    const [band, setBand] = React.useState(null);
    const [range, setRange] = React.useState({ min: '', max: '' });
    const [mall, setMall] = React.useState(false);
    const [free, setFree] = React.useState(false);
    const [rate, setRate] = React.useState(0);
    const [brand, setBrand] = React.useState(null);
    const [page, setPage] = React.useState(1);

    const clearAll = () => { setSub(null); setBand(null); setRange({ min: '', max: '' }); setMall(false); setFree(false); setRate(0); setBrand(null); };
    React.useEffect(() => { clearAll(); setPage(1); }, [categoryName]);
    React.useEffect(() => { setPage(1); }, [sub, band, range.min, range.max, mall, free, rate, sort, brand]);

    const b = BANDS.find((x) => x.id === band);
    const min = range.min !== '' ? +range.min : b ? b.min : 0;
    const max = range.max !== '' ? +range.max : b ? b.max : Infinity;

    let list = LZ.productsOfCategory(categoryName, sub);
    list = list.filter((p) => p.price >= min && p.price <= max);
    const brands = Array.from(new Set(list.map((p) => p.brand)));
    if (brand) list = list.filter((p) => p.brand === brand);
    if (mall) list = list.filter((p) => p.mall || LZ.V[p.v].mall);
    if (free) list = list.filter((p) => p.freeship);
    if (rate) list = list.filter((p) => p.rating >= rate);
    if (sort === 'price') list = [...list].sort((x, y) => (asc ? x.price - y.price : y.price - x.price));
    else if (sort === 'hot') list = [...list].sort((x, y) => parseSold(y.sold) - parseSold(x.sold));
    else if (sort === 'new') list = [...list].reverse();

    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const chips = [
      ...(sub ? [{ k: 'sub', label: sub, clear: () => setSub(null) }] : []),
      ...(b ? [{ k: 'band', label: b.label, clear: () => setBand(null) }] : []),
      ...(mall ? [{ k: 'mall', label: 'Lazadee Mall', clear: () => setMall(false) }] : []),
      ...(free ? [{ k: 'free', label: 'Freeship', clear: () => setFree(false) }] : []),
      ...(rate ? [{ k: 'rate', label: `${rate}★ trở lên`, clear: () => setRate(0) }] : []),
    ];

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 14 }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-link)' }} onClick={onHome}>Trang chủ</span><Icon name="chevron-right" size={14} /><span style={{ color: 'var(--text-body)', fontWeight: 600 }}>{categoryName}</span>
        </div>

        <div style={{ background: 'var(--orange-50)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 22, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: 68, height: 68, borderRadius: 'var(--radius-lg)', background: '#fff', boxShadow: 'var(--shadow-sm)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={meta.icon} size={32} style={{ color: 'var(--color-primary)' }} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ font: '800 26px/1.15 var(--font-sans)', color: 'var(--text-strong)', margin: 0 }}>{categoryName}</h1>
            <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: '6px 0 0' }}>{meta.desc}</p>
          </div>
          <div style={{ textAlign: 'right', flex: 'none' }}>
            <div style={{ font: '800 26px var(--font-sans)', color: 'var(--color-primary)' }}>{LZ.productsOfCategory(categoryName).length}</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>sản phẩm</div>
          </div>
        </div>

        {subs.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {[null, ...subs].map((s) => {
              const on = s === sub;
              return <button key={s || 'all'} onClick={() => setSub(s)} style={{ height: 36, padding: '0 18px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary)' : '#fff', color: on ? '#fff' : 'var(--text-body)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', whiteSpace: 'nowrap' }}>{s || 'Tất cả'}</button>;
            })}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '232px minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
          <aside style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}><Icon name="list" size={16} /> Bộ lọc tìm kiếm</div>
            <Group title="Nơi bán & dịch vụ">
              <Checkbox checked={mall} onChange={() => setMall(!mall)}>Lazadee Mall</Checkbox>
              <Checkbox checked={free} onChange={() => setFree(!free)}>Freeship</Checkbox>
            </Group>
            <Group title="Thương hiệu">
              {brands.map((x) => <label key={x} style={fRow}><input type="radio" name="brand" checked={brand === x} onChange={() => setBrand(x)} style={{ accentColor: 'var(--color-primary)' }} />{x}</label>)}
            </Group>
            <Group title="Khoảng giá">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input value={range.min} onChange={(e) => { setRange((r) => ({ ...r, min: e.target.value.replace(/\D/g, '') })); setBand(null); }} placeholder="TỪ" style={priceBox} />
                <span style={{ color: 'var(--text-subtle)' }}>—</span>
                <input value={range.max} onChange={(e) => { setRange((r) => ({ ...r, max: e.target.value.replace(/\D/g, '') })); setBand(null); }} placeholder="ĐẾN" style={priceBox} />
              </div>
              {BANDS.map((x) => <label key={x.id} style={fRow}><input type="radio" name="band" checked={band === x.id} onChange={() => { setBand(x.id); setRange({ min: '', max: '' }); }} style={{ accentColor: 'var(--color-primary)' }} />{x.label}</label>)}
            </Group>
            <Group title="Đánh giá">
              {[5, 4, 3].map((r) => (
                <label key={r} style={fRow}><input type="radio" name="rate" checked={rate === r} onChange={() => setRate(r)} style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={13} style={{ color: i < r ? 'var(--gold-500)' : 'var(--gray-300)', fill: i < r ? 'var(--gold-500)' : 'none' }} />)}<span style={{ marginLeft: 4 }}>trở lên</span></span>
                </label>
              ))}
            </Group>
            <Button block variant="outline" iconLeft="refresh-cw" onClick={clearAll} style={{ marginTop: 14 }}>Xoá tất cả</Button>
          </aside>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '9px 14px', marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Sắp xếp theo</span>
              {SORTS.map((s) => {
                const on = sort === s.id;
                return <button key={s.id} onClick={() => { if (s.id === 'price' && on) setAsc(!asc); setSort(s.id); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 34, padding: '0 14px', borderRadius: 'var(--radius-sm)', border: 0, cursor: 'pointer', font: on ? 'var(--weight-semibold) var(--text-sm) var(--font-sans)' : 'var(--type-body-sm)', background: on ? 'var(--color-primary)' : '#fff', color: on ? '#fff' : 'var(--text-body)', boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--border-default)' }}>{s.label}{s.id === 'price' && <Icon name={asc ? 'chevron-up' : 'chevron-down'} size={14} />}</button>;
              })}
              <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}><b style={{ color: 'var(--color-primary)' }}>{list.length}</b> sản phẩm</span>
            </div>
            {chips.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {chips.map((c) => <span key={c.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 6px 0 12px', borderRadius: 'var(--radius-pill)', background: 'var(--orange-50)', color: 'var(--color-primary)', font: '600 12px var(--font-sans)' }}>{c.label}<button onClick={c.clear} aria-label="Bỏ lọc" style={{ width: 20, height: 20, border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="x" size={13} /></button></span>)}
                <button onClick={clearAll} style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>Xoá lọc</button>
              </div>
            )}
            {shown.length === 0
              ? <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '64px 0', background: '#fff', borderRadius: 'var(--radius-lg)', color: 'var(--text-subtle)' }}><Icon name="search" size={40} /><span style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>Không có sản phẩm nào khớp bộ lọc</span><Button variant="outline" onClick={clearAll}>Xoá lọc</Button></div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>{shown.map((p) => <window.LZCardX key={p.id} p={p} onClick={() => onOpen(p.id)} />)}</div>}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
                {Array.from({ length: pages }).map((_, i) => <button key={i} onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }} style={{ minWidth: 40, height: 40, borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1.5px solid ' + (page === i + 1 ? 'var(--color-primary)' : 'var(--border-default)'), background: page === i + 1 ? 'var(--color-primary)' : '#fff', color: page === i + 1 ? '#fff' : 'var(--text-body)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)' }}>{i + 1}</button>)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function Group({ title, children }) {
    return (
      <div style={{ paddingTop: 12, marginTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 9 }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{children}</div>
      </div>
    );
  }
  const fRow = { display: 'flex', alignItems: 'center', gap: 9, font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer' };
  const priceBox = { width: '100%', minWidth: 0, height: 34, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 8px', font: 'var(--type-body-sm)', textAlign: 'center', outline: 'none', background: 'var(--surface-sunken)', boxSizing: 'border-box' };

  window.LZCategory = Category;
})();
