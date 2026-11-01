/* Lazadee storefront home: hero, categories, flash sale, daily discover grid. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Badge, Button, VoucherTag, ProductCard } = DS;
  const { PRODUCTS, CATEGORIES } = window.LZ;

  function Countdown() {
    const [t, setT] = React.useState(2 * 3600 + 47 * 60 + 12);
    React.useEffect(() => { const i = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(i); }, []);
    const p = (n) => String(n).padStart(2, '0');
    const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    return (
      <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        {[h, m, s].map((n, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--ink-900)', fontWeight: 700 }}>:</span>}
            <span style={cd}>{p(n)}</span>
          </React.Fragment>
        ))}
      </span>
    );
  }

  function SectionHead({ title, action }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)' }}>{title}</h2>
        {action}
      </div>
    );
  }

  function Home({ onOpen, onMore }) {
    // Fixed teaser grid (12 = 2 rows of 6). "Xem thêm" → full paginated discover page.
    const feed = Array.from({ length: 12 }, (_, i) => ({ ...PRODUCTS[i % PRODUCTS.length], _k: i }));
    const flash = PRODUCTS.filter((p) => p.flash).slice(0, 6);

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 60px' }}>
        {/* hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 14, marginBottom: 22 }}>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <img src="../../assets/img/banner-sale.jpg" alt="" style={{ width: '100%', height: 320, objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,23,31,.82) 0%, rgba(20,23,31,.25) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px', color: '#fff' }}>
              <Badge variant="flash" icon="zap" style={{ alignSelf: 'flex-start', fontSize: 13 }}>SIÊU SALE 12.12</Badge>
              <h1 style={{ font: '800 44px/1.05 var(--font-sans)', letterSpacing: '-0.02em', margin: '14px 0 8px', maxWidth: 460 }}>Giảm đến 60% toàn sàn</h1>
              <p style={{ font: 'var(--text-lg)/1.4 var(--font-sans)', color: 'rgba(255,255,255,.85)', maxWidth: 380, marginBottom: 22 }}>Freeship 0₫ · Voucher tích luỹ · Hoàn xu tới 200k cho đơn đầu tiên.</p>
              <Button size="lg" iconRight="arrow-right" style={{ alignSelf: 'flex-start' }} onClick={() => onOpen(flash[0].id)}>Săn deal ngay</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 14 }}>
            {[{ img: 'banner-tech', t: 'Công nghệ chính hãng', s: 'Trả góp 0%' }, { img: 'cosmetics', t: 'Làm đẹp cùng Beauty Box', s: 'Mua 1 tặng 1' }].map((b) => (
              <div key={b.img} style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <img src={'../../assets/img/' + b.img + '.jpg'} alt="" style={{ width: '100%', height: 153, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(20,23,31,.7), transparent 70%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16, color: '#fff' }}>
                  <div style={{ font: '700 16px var(--font-sans)' }}>{b.t}</div>
                  <div style={{ font: '12px var(--font-sans)', color: 'rgba(255,255,255,.85)' }}>{b.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* categories */}
        <div className="lz-card" style={{ padding: '18px 20px', marginBottom: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0, 1fr))', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button key={c.name} style={catTile}>
                <span style={catIcon}><Icon name={c.icon} size={22} /></span>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-body)', textAlign: 'center' }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* voucher row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <VoucherTag kind="platform" amount="-30k" label="Đơn từ 199.000₫" />
          <VoucherTag kind="shop" amount="-15%" label="Tối đa 50.000₫" />
          <VoucherTag kind="freeship" amount="0₫" label="Miễn phí vận chuyển" />
          <VoucherTag kind="platform" amount="-100k" label="Đơn từ 1.000.000₫" />
        </div>

        {/* flash sale */}
        <div className="lz-card" style={{ padding: '18px 20px', marginBottom: 28, borderTop: '3px solid var(--flash-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="zap" size={26} style={{ color: 'var(--flash-500)' }} strokeWidth={2.4} />
              <span style={{ font: '800 22px var(--font-sans)', color: 'var(--flash-500)', letterSpacing: '-0.01em' }}>FLASH SALE</span>
            </div>
            <Countdown />
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-link)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', cursor: 'pointer' }}>Xem tất cả <Icon name="chevron-right" size={16} /></span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
            {flash.map((p) => <ProductCard key={p.id} {...window.LZ.card(p)} onClick={() => onOpen(p.id)} />)}
          </div>
        </div>

        {/* daily discover */}
        <SectionHead title="Gợi ý hôm nay" action={<span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-link)', cursor: 'pointer' }} onClick={onMore}>Xem thêm</span>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
          {feed.map((p) => <ProductCard key={p._k} {...window.LZ.card(p)} onClick={() => onOpen(p.id)} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 4px' }}>
          <Button size="lg" variant="outline" iconRight="chevron-down" onClick={onMore}>Xem thêm sản phẩm</Button>
        </div>
      </div>
    );
  }

  const cd = { background: 'var(--ink-900)', color: '#fff', font: '700 14px/1 var(--font-mono)', padding: '4px 5px', borderRadius: 'var(--radius-xs)', minWidth: 24, textAlign: 'center' };
  const catTile = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 4px', border: 0, background: 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer' };
  const catIcon = { width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-tint)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  window.LZHome = Home;
})();
