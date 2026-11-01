/* Lazadee search results — TWO SCOPES:
   • Toàn sàn (whole marketplace)  • Trong Shop <name> (single vendor)
   A segmented control switches scope; filters (category, price, rating,
   location, Mall, freeship) + sort (relevance / newest / best-selling / price)
   refine the grid. Reachable from the global header (all) or a shop (in-shop). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Checkbox, ProductCard, VendorChip } = DS;
  const { V, PRODUCTS, CATEGORIES, productsOfVendor } = window.LZ;
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
  const parseSold = (s) => { const n = parseFloat(String(s).replace(',', '.')); return /k/i.test(String(s)) ? n * 1000 : n; };

  const SORTS = [
    { id: 'rel', label: 'Liên quan' },
    { id: 'new', label: 'Mới nhất' },
    { id: 'hot', label: 'Bán chạy' },
    { id: 'price', label: 'Giá' },
  ];
  const PRICE_BANDS = [
    { id: 'b1', label: 'Dưới 100.000₫', min: 0, max: 100000 },
    { id: 'b2', label: '100.000₫ – 300.000₫', min: 100000, max: 300000 },
    { id: 'b3', label: '300.000₫ – 700.000₫', min: 300000, max: 700000 },
    { id: 'b4', label: '700.000₫ – 5 triệu', min: 700000, max: 5000000 },
    { id: 'b5', label: 'Trên 5 triệu', min: 5000000, max: Infinity },
  ];

  function Search({ query, scope, shopId, onOpen, onScope, onShop }) {
    // scope: 'all' | 'shop'
    const inShop = scope === 'shop' && shopId && V[shopId];
    const v = inShop ? V[shopId] : null;
    const [sort, setSort] = React.useState('rel');
    const [priceAsc, setPriceAsc] = React.useState(true);
    const [cats, setCats] = React.useState([]);
    const [band, setBand] = React.useState(null);
    const [minMax, setMinMax] = React.useState({ min: '', max: '' });
    const [mallOnly, setMallOnly] = React.useState(false);
    const [freeOnly, setFreeOnly] = React.useState(false);
    const [rating, setRating] = React.useState(0);

    const base = inShop ? productsOfVendor(shopId) : PRODUCTS;
    const q = (query || '').trim().toLowerCase();

    let res = base.filter((p) => !q || (p.title + ' ' + p.cat).toLowerCase().includes(q));
    if (cats.length) res = res.filter((p) => cats.includes(p.cat));
    if (mallOnly) res = res.filter((p) => p.mall || V[p.v].mall);
    if (freeOnly) res = res.filter((p) => p.freeship);
    if (rating) res = res.filter((p) => p.rating >= rating);
    const activeBand = PRICE_BANDS.find((b) => b.id === band);
    const lo = minMax.min !== '' ? +minMax.min : (activeBand ? activeBand.min : 0);
    const hi = minMax.max !== '' ? +minMax.max : (activeBand ? activeBand.max : Infinity);
    res = res.filter((p) => p.price >= lo && p.price <= hi);

    if (sort === 'price') res = [...res].sort((a, b) => priceAsc ? a.price - b.price : b.price - a.price);
    else if (sort === 'hot') res = [...res].sort((a, b) => parseSold(b.sold) - parseSold(a.sold));
    else if (sort === 'new') res = [...res].reverse();

    const toggleCat = (c) => setCats((s) => s.includes(c) ? s.filter((x) => x !== c) : [...s, c]);
    const clearAll = () => { setCats([]); setBand(null); setMinMax({ min: '', max: '' }); setMallOnly(false); setFreeOnly(false); setRating(0); };
    const activeChips = [
      ...cats.map((c) => ({ k: 'cat:' + c, label: c, clear: () => toggleCat(c) })),
      ...(activeBand ? [{ k: 'band', label: activeBand.label, clear: () => setBand(null) }] : []),
      ...(mallOnly ? [{ k: 'mall', label: 'Lazadee Mall', clear: () => setMallOnly(false) }] : []),
      ...(freeOnly ? [{ k: 'free', label: 'Freeship', clear: () => setFreeOnly(false) }] : []),
      ...(rating ? [{ k: 'rate', label: `${rating}★ trở lên`, clear: () => setRating(0) }] : []),
    ];

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 56px' }}>
        {/* ---- Scope switch ---- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>
            Kết quả cho <b style={{ color: 'var(--text-strong)' }}>"{query || 'Tất cả'}"</b>
          </span>
          <div style={{ display: 'flex', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: 3 }}>
            <ScopeBtn on={!inShop} icon="layout-grid" onClick={() => onScope('all')}>Toàn sàn</ScopeBtn>
            <ScopeBtn on={!!inShop} icon="store" disabled={!shopId} onClick={() => shopId && onScope('shop')}>{v ? `Trong ${v.name}` : 'Trong Shop'}</ScopeBtn>
          </div>
          <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>
            <b style={{ color: 'var(--color-primary)' }}>{res.length}</b> sản phẩm
          </span>
        </div>

        {/* in-shop banner */}
        {inShop && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 14, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: v.logoBg, color: '#fff', display: 'grid', placeItems: 'center', font: '800 19px var(--font-sans)', flex: 'none' }}>{v.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{v.name}</span>{v.mall && <Badge variant="solid">MALL</Badge>}</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Đang lọc trong shop này · {v.rating}★ · {v.followers} theo dõi</div>
            </div>
            <Button size="sm" variant="outline" iconLeft="store" onClick={() => onShop && onShop(shopId)}>Vào shop</Button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '232px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
          {/* ---- Filters ---- */}
          <aside style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '16px 16px 20px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 96 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}><Icon name="sliders-horizontal" size={17} style={{ color: 'var(--color-primary)' }} /><span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Bộ lọc tìm kiếm</span></div>

            {!inShop && <FilterGroup title="Theo danh mục">
              {CATEGORIES.slice(0, 8).map((c) => (
                <label key={c.name} style={fRow}><Checkbox checked={cats.includes(c.name)} onChange={() => toggleCat(c.name)} /><span>{c.name}</span></label>
              ))}
            </FilterGroup>}

            <FilterGroup title="Khoảng giá">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <input value={minMax.min} onChange={(e) => { setMinMax((s) => ({ ...s, min: e.target.value.replace(/\D/g, '') })); setBand(null); }} placeholder="TỪ" style={priceInput} />
                <span style={{ color: 'var(--text-subtle)' }}>—</span>
                <input value={minMax.max} onChange={(e) => { setMinMax((s) => ({ ...s, max: e.target.value.replace(/\D/g, '') })); setBand(null); }} placeholder="ĐẾN" style={priceInput} />
              </div>
              {PRICE_BANDS.map((b) => (
                <label key={b.id} style={fRow}><input type="radio" name="band" checked={band === b.id} onChange={() => { setBand(b.id); setMinMax({ min: '', max: '' }); }} style={{ accentColor: 'var(--color-primary)' }} /><span>{b.label}</span></label>
              ))}
            </FilterGroup>

            <FilterGroup title="Đánh giá">
              {[5, 4, 3].map((r) => (
                <label key={r} style={fRow}><input type="radio" name="rate" checked={rating === r} onChange={() => setRating(r)} style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={13} style={{ color: i < r ? 'var(--gold-500)' : 'var(--gray-300)', fill: i < r ? 'var(--gold-500)' : 'none' }} />)}<span style={{ marginLeft: 4 }}>trở lên</span></span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Dịch vụ & khác">
              <label style={fRow}><Checkbox checked={mallOnly} onChange={() => setMallOnly(!mallOnly)} /><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Badge variant="solid">MALL</Badge> Chính hãng</span></label>
              <label style={fRow}><Checkbox checked={freeOnly} onChange={() => setFreeOnly(!freeOnly)} /><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="truck" size={14} style={{ color: 'var(--mint-600)' }} /> Miễn phí vận chuyển</span></label>
            </FilterGroup>

            <Button block variant="outline" iconLeft="refresh-cw" onClick={clearAll} style={{ marginTop: 6 }}>Xoá tất cả</Button>
          </aside>

          {/* ---- Results ---- */}
          <div style={{ minWidth: 0 }}>
            {/* sort bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '9px 14px', marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Sắp xếp theo</span>
              {SORTS.map((s) => {
                const on = sort === s.id;
                return (
                  <button key={s.id} onClick={() => { if (s.id === 'price' && on) setPriceAsc(!priceAsc); setSort(s.id); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 34, padding: '0 14px', borderRadius: 'var(--radius-sm)', border: 0, cursor: 'pointer', font: on ? 'var(--weight-semibold) var(--text-sm) var(--font-sans)' : 'var(--type-body-sm)', background: on ? 'var(--color-primary)' : '#fff', color: on ? '#fff' : 'var(--text-body)', boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--border-default)' }}>
                    {s.label}{s.id === 'price' && <Icon name={priceAsc ? 'chevron-up' : 'chevron-down'} size={14} />}
                  </button>
                );
              })}
            </div>

            {/* active filter chips */}
            {activeChips.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {activeChips.map((c) => (
                  <span key={c.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 6px 0 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-primary-tint)', color: 'var(--orange-700)', font: '600 12px var(--font-sans)' }}>
                    {c.label}<button onClick={c.clear} style={{ width: 20, height: 20, border: 0, background: 'transparent', color: 'var(--orange-600)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="x" size={13} /></button>
                  </span>
                ))}
                <button onClick={clearAll} style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>Xoá lọc</button>
              </div>
            )}

            {/* grid / empty */}
            {res.length === 0 ? (
              <div style={{ display: 'grid', placeItems: 'center', gap: 12, padding: '70px 0', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', color: 'var(--text-subtle)' }}>
                <Icon name="package" size={46} />
                <div style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>Không tìm thấy sản phẩm nào khớp bộ lọc{inShop ? ' trong shop này' : ''}.</div>
                {inShop && <Button variant="outline" iconLeft="layout-grid" onClick={() => onScope('all')}>Mở rộng tìm toàn sàn</Button>}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
                {res.map((p) => (
                  <div key={p.id} style={{ position: 'relative' }}>
                    <ProductCard {...window.LZ.card(p)} onClick={() => onOpen(p.id)} />
                    {!inShop && (
                      <button onClick={() => onShop && onShop(p.v)} title={V[p.v].name}
                        style={{ position: 'absolute', left: 8, bottom: 8, display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 'calc(100% - 16px)', height: 24, padding: '0 9px', borderRadius: 'var(--radius-pill)', border: 0, background: 'rgba(20,23,31,.78)', color: '#fff', font: '600 11px var(--font-sans)', cursor: 'pointer', backdropFilter: 'blur(2px)' }}>
                        <Icon name="store" size={11} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{V[p.v].name}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function ScopeBtn({ on, icon, children, disabled, onClick }) {
    return (
      <button onClick={onClick} disabled={disabled}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 16px', borderRadius: 'var(--radius-pill)', border: 0, cursor: disabled ? 'not-allowed' : 'pointer', font: on ? 'var(--weight-semibold) var(--text-sm) var(--font-sans)' : 'var(--type-body-sm)', background: on ? 'var(--color-primary)' : 'transparent', color: on ? '#fff' : disabled ? 'var(--text-disabled)' : 'var(--text-body)', maxWidth: 240, opacity: disabled ? 0.6 : 1 }}>
        <Icon name={icon} size={15} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
      </button>
    );
  }

  function FilterGroup({ title, children }) {
    return (
      <div style={{ paddingTop: 12, marginTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 9 }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{children}</div>
      </div>
    );
  }

  const fRow = { display: 'flex', alignItems: 'center', gap: 9, font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer' };
  const priceInput = { width: '100%', minWidth: 0, height: 34, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 8px', font: 'var(--type-body-sm)', textAlign: 'center', outline: 'none', background: 'var(--surface-sunken)' };

  window.LZSearch = Search;
})();
