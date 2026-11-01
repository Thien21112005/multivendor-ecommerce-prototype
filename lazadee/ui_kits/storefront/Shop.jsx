/* Lazadee shop page — a seller's storefront inside the marketplace.
   Cover + identity (Mall, rating, followers, response), follow/chat,
   in-shop search (routes to Search scoped to this vendor), shop vouchers,
   category tabs + the vendor's product grid. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, VoucherTag, ProductCard, Tabs } = DS;
  const { V, productsOfVendor, CATEGORIES } = window.LZ;

  function Stat({ value, label, gold }) {
    return (
      <div style={{ textAlign: 'center', minWidth: 78 }}>
        <div style={{ font: '800 17px var(--font-sans)', color: gold ? 'var(--gold-600)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{value}</div>
        <div style={{ font: 'var(--type-caption)', color: 'rgba(255,255,255,.7)', marginTop: 2 }}>{label}</div>
      </div>
    );
  }

  function Shop({ vendorId, onOpen, onSearch, onChat }) {
    const vid = vendorId && V[vendorId] ? vendorId : 'techzone';
    const v = V[vid];
    const products = productsOfVendor(vid);
    const [follow, setFollow] = React.useState(false);
    const [q, setQ] = React.useState('');
    const [tab, setTab] = React.useState('all');

    // shop sub-categories from the vendor's own catalog
    const cats = Array.from(new Set(products.map((p) => p.cat)));
    const tabs = [{ id: 'all', label: 'Tất cả sản phẩm' }, { id: 'new', label: 'Mới nhất' }, { id: 'hot', label: 'Bán chạy' }, ...cats.map((c) => ({ id: c, label: c }))];
    let shown = products;
    if (tab === 'hot') shown = [...products].sort((a, b) => parseSold(b.sold) - parseSold(a.sold));
    else if (tab === 'new') shown = [...products].reverse();
    else if (tab !== 'all') shown = products.filter((p) => p.cat === tab);

    return (
      <div style={{ background: 'var(--surface-page)', minHeight: '100%' }}>
        {/* ---- Shop hero: full cover banner + overlapping identity card ---- */}
        <div style={{ position: 'relative' }}>
          {/* cover image */}
          <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: v.logoBg }}>
            <img src={'../../assets/img/' + v.cover + '.jpg'} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${v.logoBg}40 0%, ${v.logoBg}D9 100%)` }} />
            {/* stats float top-right over the banner */}
            <div style={{ position: 'absolute', right: 0, top: 0, maxWidth: 1280, margin: '0 auto', left: 0, padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: 26, flexWrap: 'wrap' }}>
              <Stat value={<><Icon name="star" size={15} style={{ color: 'var(--gold-500)' }} />{v.rating}</>} label="Đánh giá" gold />
              <Stat value={v.followers} label="Người theo dõi" />
              <Stat value={products.length} label="Sản phẩm" />
              <Stat value={v.responseRate + '%'} label="Phản hồi chat" />
            </div>
          </div>
          {/* identity card overlapping the banner bottom edge */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ position: 'relative', marginTop: -56, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ width: 88, height: 88, borderRadius: 'var(--radius-lg)', background: v.logoBg, display: 'grid', placeItems: 'center', flex: 'none', marginTop: -44, border: '4px solid #fff', boxShadow: 'var(--shadow-md)' }}>
                <span style={{ font: '800 38px var(--font-sans)', color: '#fff' }}>{v.name[0]}</span>
              </div>
              <div style={{ minWidth: 220, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h1 style={{ font: '800 24px var(--font-sans)', letterSpacing: '-0.01em', margin: 0, color: 'var(--text-strong)' }}>{v.name}</h1>
                  {v.mall && <Badge variant="solid">MALL</Badge>}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 5 }}>
                  <span style={{ color: 'var(--mint-500)' }}>●</span> Online · Tham gia từ {v.joined} · Phản hồi {v.responseTime}
                </div>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 3 }}>{v.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: 11 }}>
                <Button variant={follow ? 'outline' : 'secondary'} iconLeft={follow ? 'check' : 'plus'} onClick={() => setFollow(!follow)}>{follow ? 'Đang theo dõi' : 'Theo dõi'}</Button>
                <Button variant="outline" iconLeft="message-circle" onClick={() => onChat && onChat(vid)}>Chat ngay</Button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 56px' }}>
          {/* ---- In-shop search ---- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 'var(--radius-lg)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)', marginBottom: 14, flexWrap: 'wrap' }}>
            <Icon name="store" size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Tìm trong Shop</span>
            <div style={{ flex: 1, minWidth: 240, display: 'flex', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch(q, vid)}
                placeholder={`Tìm sản phẩm trong ${v.name}…`} style={{ flex: 1, border: 0, outline: 'none', height: 40, padding: '0 14px', font: 'var(--type-body)', background: 'transparent' }} />
              <button onClick={() => onSearch(q, vid)} style={{ width: 52, border: 0, background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="search" size={18} /></button>
            </div>
            <button onClick={() => onSearch(q, null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>
              Tìm toàn sàn <Icon name="arrow-right" size={14} />
            </button>
          </div>

          {/* ---- Shop vouchers ---- */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <VoucherTag kind="shop" amount="-15%" label={`Voucher ${v.name} · tối đa 50k`} />
            <VoucherTag kind="shop" amount="-30k" label="Đơn từ 250.000₫" />
            <VoucherTag kind="freeship" amount="0₫" label="Miễn phí ship đơn từ 99k" />
          </div>

          {/* ---- Category tabs ---- */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '4px 16px 0', boxShadow: 'var(--shadow-sm)' }}>
            <Tabs value={tab} onChange={setTab} items={tabs} />
          </div>

          {/* ---- Product grid ---- */}
          <div style={{ background: '#fff', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', padding: '18px 16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
              {shown.map((p) => <ProductCard key={p.id} {...window.LZ.card(p)} onClick={() => onOpen(p.id)} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function parseSold(s) { const n = parseFloat(String(s).replace(',', '.')); return /k/i.test(String(s)) ? n * 1000 : n; }

  window.LZShop = Shop;
})();
