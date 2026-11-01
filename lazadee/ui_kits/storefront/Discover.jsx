/* Lazadee "Gợi ý hôm nay" — full paginated discover page. Reached from the home
   "Xem thêm" button; opens on PAGE 2 by default (per request). 30 products/page,
   classic numbered pagination (Prev · 1 2 3 … · Next). Each page scrolls to top. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, ProductCard } = DS;
  const { PRODUCTS } = window.LZ;

  const PER_PAGE = 30;
  const TOTAL_PAGES = 8;
  const TOTAL = PER_PAGE * TOTAL_PAGES;

  function pageItems(page) {
    const start = (page - 1) * PER_PAGE;
    return Array.from({ length: PER_PAGE }, (_, i) => {
      const idx = start + i;
      return { ...PRODUCTS[idx % PRODUCTS.length], _k: idx };
    });
  }

  // numbered list with ellipses: 1 … (p-1) p (p+1) … last
  function pageList(page, total) {
    const out = [];
    const push = (v) => out.push(v);
    push(1);
    if (page > 3) push('…');
    for (let p = Math.max(2, page - 1); p <= Math.min(total - 1, page + 1); p++) push(p);
    if (page < total - 2) push('…');
    if (total > 1) push(total);
    return out;
  }

  function Discover({ initialPage = 2, onOpen, onHome }) {
    const [page, setPage] = React.useState(initialPage);
    const items = pageItems(page);
    const go = (p) => { if (p < 1 || p > TOTAL_PAGES || p === page) return; setPage(p); window.scrollTo(0, 0); };

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 56px' }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 14 }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-link)' }} onClick={onHome}>Trang chủ</span>
          <Icon name="chevron-right" size={14} />
          <span style={{ color: 'var(--text-body)' }}>Gợi ý hôm nay</span>
        </div>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, borderLeft: '4px solid var(--color-primary)', paddingLeft: 14 }}>
          <div>
            <h1 style={{ font: 'var(--type-h2)', color: 'var(--text-strong)', margin: 0 }}>Gợi ý hôm nay</h1>
            <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', margin: '4px 0 0' }}>Sản phẩm được cá nhân hoá dành riêng cho bạn · {TOTAL.toLocaleString('vi-VN')} sản phẩm</p>
          </div>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-subtle)' }}>Trang {page}/{TOTAL_PAGES}</span>
        </div>

        {/* grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
          {items.map((p) => <ProductCard key={p._k} {...window.LZ.card(p)} onClick={() => onOpen(p.id)} />)}
        </div>

        {/* pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 32 }}>
          <button onClick={() => go(page - 1)} disabled={page === 1} style={{ ...pageBtn, opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer', width: 'auto', padding: '0 12px', gap: 4 }}>
            <Icon name="chevron-left" size={16} /> Trước
          </button>
          {pageList(page, TOTAL_PAGES).map((p, i) =>
            p === '…'
              ? <span key={'e' + i} style={{ width: 24, textAlign: 'center', color: 'var(--text-subtle)' }}>…</span>
              : <button key={p} onClick={() => go(p)} style={{ ...pageBtn, ...(p === page ? pageActive : null) }}>{p}</button>
          )}
          <button onClick={() => go(page + 1)} disabled={page === TOTAL_PAGES} style={{ ...pageBtn, opacity: page === TOTAL_PAGES ? 0.4 : 1, cursor: page === TOTAL_PAGES ? 'not-allowed' : 'pointer', width: 'auto', padding: '0 12px', gap: 4 }}>
            Sau <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
    );
  }

  const pageBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, height: 40, padding: 0, border: '1.5px solid var(--border-default)', background: '#fff', borderRadius: 'var(--radius-md)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer' };
  const pageActive = { background: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff' };

  window.LZDiscover = Discover;
})();
