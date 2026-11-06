/* Genie product detail: gallery, SKU variants, vendor, reviews. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, IconButton, Badge, PriceVND, Rating, VendorChip, QuantityStepper, StatusBadge, Money, Modal, Select } = DS;
  const formatVND = Money.format;
  const { byId, V, PRODUCTS } = window.LZ;

  const COLORS = [
    { label: 'Đen', swatch: '#1A1815', delta: 0, stock: 38 },
    { label: 'Trắng', swatch: '#F1EFEC', delta: 0, stock: 12 },
    { label: 'Xanh navy', swatch: '#2A3550', delta: 30000, stock: 5 },
    { label: 'Hồng', swatch: '#FF7FA3', delta: 20000, stock: 0 },
  ];
  const SIZES = [{ label: 'Tiêu chuẩn', delta: 0 }, { label: 'Bản Pro', delta: 150000 }];

  const toast = (message, type) => window.dispatchEvent(new CustomEvent('show_toast', { detail: { message, type } }));

  const REVIEWS = [
    { id: 'r1', name: 'Nguyễn Minh', when: '2026-05-28', rating: 5, variant: 'Đen / Bản Pro', text: 'Sản phẩm đúng mô tả, chất lượng tốt, đóng gói cẩn thận. Giao hàng nhanh trong 2 ngày. Sẽ ủng hộ shop lần sau!', imgs: ['headphones', 'banner-tech'], reply: 'Cảm ơn bạn đã tin tưởng TechZone! Shop rất vui khi sản phẩm làm bạn hài lòng 🧡' },
    { id: 'r2', name: 'Trần Thu Hà', when: '2026-05-21', rating: 4, variant: 'Trắng / Tiêu chuẩn', text: 'Pin trâu, âm thanh ổn trong tầm giá. Trừ 1 sao vì hộp hơi móp khi nhận nhưng sản phẩm vẫn nguyên vẹn.' },
    { id: 'r3', name: 'Lê Hoàng', when: '2026-05-15', rating: 5, variant: 'Đen / Tiêu chuẩn', text: 'Chống ồn tốt, đeo êm tai. Đáng tiền!', imgs: ['speaker'], anon: true },
    { id: 'r4', name: 'Phạm An', when: '2026-05-02', rating: 3, variant: 'Trắng / Tiêu chuẩn', text: 'Dùng tạm ổn, kết nối đôi lúc chập chờn. Shop hỗ trợ đổi hàng nhanh.' },
  ];
  const REPORT_REASONS = ['Spam / chuyển hướng giao dịch', 'Ngôn từ thô tục, xúc phạm', 'Mua giả, không phải người mua thật'];
  const R_FILTERS = [
    { id: 'all', label: 'Tất cả', test: () => true },
    { id: '5', label: '5 Sao', test: (r) => r.rating === 5 },
    { id: '4', label: '4 Sao', test: (r) => r.rating === 4 },
    { id: '3', label: '3 Sao', test: (r) => r.rating === 3 },
    { id: 'img', label: 'Có hình ảnh', test: (r) => r.imgs && r.imgs.length > 0 },
    { id: 'buy', label: 'Đã mua hàng', test: () => true },
  ];

  function Lightbox({ images, start, onClose }) {
    const [i, setI] = React.useState(start);
    const step = (d) => setI((x) => (x + d + images.length) % images.length);
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,23,31,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <button aria-label="Ảnh trước" onClick={(e) => { e.stopPropagation(); step(-1); }} style={lbBtn}><Icon name="chevron-left" size={26} /></button>
        <img src={images[i]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '76vw', maxHeight: '84vh', borderRadius: 'var(--radius-lg)', objectFit: 'contain', background: '#fff' }} />
        <button aria-label="Ảnh sau" onClick={(e) => { e.stopPropagation(); step(1); }} style={lbBtn}><Icon name="chevron-right" size={26} /></button>
        <button aria-label="Đóng" onClick={onClose} style={{ ...lbBtn, position: 'absolute', top: 18, right: 18 }}><Icon name="x" size={22} /></button>
      </div>
    );
  }

  function Review({ name, when, rating, variant, text, imgs, reply, anon }) {
    const [helpful, setHelpful] = React.useState(false);
    const [reportOpen, setReportOpen] = React.useState(false);
    const [reported, setReported] = React.useState(false);
    const [why, setWhy] = React.useState(REPORT_REASONS[0]);
    const shown = anon ? name[0] + '***' + name[name.length - 1] : name;
    const report = () => { if (!window.LZ.loggedIn) { window.dispatchEvent(new CustomEvent('lz_require_login')); return; } setReportOpen(true); };
    return (
      <div className="tr-review" style={{ display: 'flex', gap: 12, padding: '18px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gray-200)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontWeight: 700, flex: 'none' }}>{shown[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{shown}{anon && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginLeft: 6 }}>Đánh giá ẩn tên</span>}</div>
          <div style={{ margin: '3px 0 6px' }}><Rating value={rating} size={13} showNumber={false} /></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <Badge variant="success" icon="badge-check">Đã mua hàng</Badge>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{when} · Phân loại: {variant}</span>
          </div>
          <p style={{ font: 'var(--type-body)', color: 'var(--text-body)', marginBottom: imgs ? 10 : 0 }}>{text}</p>
          {imgs && <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>{imgs.map((m, i) => <img key={m} alt={'Ảnh khách hàng chụp ' + (i + 1)} src={'../../assets/img/' + m + '.jpg'} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />)}</div>}
          {reply && (
            <div style={{ marginTop: 10, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Icon name="store" size={13} style={{ color: 'var(--color-primary)' }} />
                <span style={{ font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)', color: 'var(--color-primary)' }}>Phản hồi của Người bán</span>
              </div>
              <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{reply}</p>
            </div>
          )}
        </div>
        <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flex: 'none' }}>
          <button onClick={() => setHelpful((h) => !h)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent', color: helpful ? 'var(--color-primary)' : 'var(--text-muted)', font: 'var(--type-caption)', cursor: 'pointer' }}><Icon name="thumbs-up" size={14} /> Hữu ích ({12 + (name.length * 7) % 31 + (helpful ? 1 : 0)})</button>
          <button disabled={reported} onClick={report} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent', color: 'var(--text-subtle)', font: 'var(--type-caption)', cursor: reported ? 'default' : 'pointer' }}><Icon name="triangle-alert" size={13} />{reported ? 'Đã báo cáo' : 'Báo cáo'}</button>
        </div>
        <Modal open={reportOpen} onClose={() => setReportOpen(false)} width={440} title="Báo cáo đánh giá"
          footer={<><Button variant="ghost" onClick={() => setReportOpen(false)}>Huỷ</Button><Button variant="danger" onClick={() => { setReported(true); setReportOpen(false); toast('Đã gửi báo cáo tới bộ phận kiểm duyệt'); }}>Gửi báo cáo</Button></>}>
          <Select label="Lý do" value={why} onChange={(e) => setWhy(e.target.value)}>{REPORT_REASONS.map((x) => <option key={x}>{x}</option>)}</Select>
          <textarea aria-label="Ghi chú" placeholder="Ghi chú thêm (không bắt buộc)" rows={2} style={{ width: '100%', marginTop: 10, padding: '8px 12px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </Modal>
      </div>
    );
  }

  function ProductGone({ onOpen, onHome }) {
    const picks = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 6);
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ display: 'grid', placeItems: 'center', gap: 12, padding: '48px 0', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
          <Icon name="package" size={46} style={{ color: 'var(--text-subtle)' }} />
          <h1 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: 0 }}>Sản phẩm không còn bán</h1>
          <Button variant="outline" iconLeft="house" onClick={onHome}>Về trang chủ</Button>
        </div>
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', marginBottom: 14 }}>Sản phẩm tương tự</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '12px 10px' }}>{picks.map((x) => <window.LZCardX key={x.id} p={x} onClick={() => onOpen(x.id)} />)}</div>
      </div>
    );
  }

  function ProductDetailInner({ id, onOpen, onAdd, onGoCart, onShop, onCategory, onHome, onChat, onRequireLogin, loggedIn = true }) {
    const p = byId(id) || PRODUCTS[0];
    const vendor = V[p.v];
    const gallery = [p.img, '../../assets/img/banner-tech.jpg', '../../assets/img/keyboard.jpg', '../../assets/img/speaker.jpg'].filter(Boolean);
    const [active, setActive] = React.useState(0);
    const [color, setColor] = React.useState(null);
    const [size, setSize] = React.useState(null);
    const [qty, setQty] = React.useState(1);
    const [follow, setFollow] = React.useState(() => window.LZ.FOLLOWS.includes(p.v));
    const [unfollowOpen, setUnfollowOpen] = React.useState(false);
    const requireThen = (fn) => () => { if (!loggedIn) { onRequireLogin(); return; } fn(); };
    const [lightbox, setLightbox] = React.useState(false);
    const [rFilter, setRFilter] = React.useState('all');
    const [, forceWish] = React.useState(0);
    React.useEffect(() => window.LZ.wishlist.subscribe(() => forceWish((x) => x + 1)), []);
    const liked = window.LZ.wishlist.has(p.id);
    const vacation = vendor.vacation;
    const flashOut = p.flash && p.flashTotal && p.flashSold >= p.flashTotal;
    const toggleLike = () => { if (!loggedIn) { onRequireLogin(); return; } window.LZ.wishlist.toggle(p.id); toast(liked ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích'); };
    const share = async () => {
      const u = new URL(location.href);
      u.search = '?screen=product&product=' + p.id + (color !== null || size !== null ? '&v=' + (color === null ? '' : color) + '-' + (size === null ? '' : size) : '') + '&src=share';
      if (navigator.share) { try { await navigator.share({ title: p.title, url: u.href }); } catch (e) {} return; }
      try { await navigator.clipboard.writeText(u.href); } catch (e) {}
      toast('Đã sao chép liên kết sản phẩm');
    };
    const c = color === null ? null : COLORS[color], s = size === null ? null : SIZES[size];
    const price = p.price + (c ? c.delta : 0) + (s ? s.delta : 0);
    const stock = c ? c.stock : COLORS.reduce((n, x) => n + x.stock, 0);
    const soldOut = stock === 0;
    const similar = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 6);
    const rShown = REVIEWS.filter(R_FILTERS.find((f) => f.id === rFilter).test);

    React.useEffect(() => { setQty(1); }, [color, size]);
    React.useEffect(() => {
      setActive(0); setColor(null); setSize(null); setRFilter('all'); window.scrollTo(0, 0);
      // a shared link can pre-select the variant, then the parameters leave the URL
      const u = new URL(location.href), shared = u.searchParams.get('v');
      if (shared) {
        const [ci, si] = shared.split('-');
        if (COLORS[ci] && COLORS[ci].stock > 0) setColor(Number(ci));
        if (SIZES[si]) setSize(Number(si));
      }
      if (shared || u.searchParams.get('src')) { u.searchParams.delete('v'); u.searchParams.delete('src'); history.replaceState({}, '', u); }
    }, [id]);

    // returns the cart line, or null after warning when a variant group is still open
    const line = () => {
      const showVariants = () => { if (window.innerWidth <= 768) document.getElementById('tr-variants').scrollIntoView({ block: 'start' }); };
      if (!c && !s) { toast('Vui lòng chọn Phân loại hàng', 'error'); showVariants(); return null; }
      if (!c || !s) { toast('Vui lòng chọn đầy đủ Phân loại hàng', 'error'); showVariants(); return null; }
      return { key: p.id + '|' + c.label + '/' + s.label, productId: p.id, vendorId: p.v, title: p.title, img: p.img, price, original: p.original, variant: c.label + ' / ' + s.label, qty, stock };
    };
    const add = () => {
      if (flashOut) { toast('Sản phẩm này đã hết suất Flash Sale', 'error'); return null; }
      const l = line(); if (l) onAdd(l); return l;
    };

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 60px' }}>
        <div className="tr-crumbs" style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span role="button" tabIndex={0} onKeyDown={window.LZKey} style={{ cursor: 'pointer' }} onClick={onHome}>Trang chủ</span><Icon name="chevron-right" size={13} /><span role="button" tabIndex={0} onKeyDown={window.LZKey} style={{ cursor: 'pointer' }} onClick={() => onCategory && onCategory(p.cat)}>{p.cat}</span><span className="tr-wide-only" style={{ display: 'contents' }}><Icon name="chevron-right" size={13} /><span style={{ color: 'var(--text-body)' }}>{p.title.slice(0, 30)}…</span></span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 24, background: '#fff', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
          {/* gallery */}
          <div>
            <div role="button" tabIndex={0} onKeyDown={window.LZKey} className="tr-gallery" onClick={() => setLightbox(true)} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--gray-100)', cursor: 'zoom-in' }}>
              <img src={gallery[active]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {gallery.map((g, i) => (
                <button key={i} aria-label={'Ảnh ' + (i + 1)} aria-pressed={i === active} onClick={() => setActive(i)} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid ' + (i === active ? 'var(--color-primary)' : 'transparent'), padding: 0, cursor: 'pointer', background: 'none' }}>
                  <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button style={{ ...shareBtn, color: liked ? 'var(--color-primary)' : 'var(--text-muted)' }} aria-pressed={liked} onClick={toggleLike}><Icon name="heart" size={16} style={{ fill: liked ? 'currentColor' : 'none' }} /> {liked ? 'Đã yêu thích' : 'Yêu thích'}</button>
              <button style={shareBtn} onClick={share}><Icon name="share-2" size={16} /> Chia sẻ</button>
            </div>
          </div>

          {/* info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {p.mall && <Badge variant="primary">Chính hãng</Badge>}
              {p.flash && <Badge variant="flash" icon="zap">FLASH SALE</Badge>}
              {p.preOrderDays && <Badge variant="primary" icon="clock">Đặt trước</Badge>}
              {!p.mall && <Badge variant="outline">Chính hãng 100%</Badge>}
            </div>
            <h1 style={{ font: 'var(--weight-semibold) 22px/1.3 var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 }}>{p.title}</h1>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <Rating value={p.rating} count={p.sold} />
              <span style={{ color: 'var(--border-default)' }}>|</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Đã bán <b style={{ color: 'var(--text-body)' }}>{p.sold}</b></span>
            </div>

            {/* price block */}
            <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <PriceVND amount={price} original={p.original} size="lg" />
              <Badge variant="flash">-{p.discountPct}%</Badge>
            </div>

            {p.flash && p.flashTotal && (
              <div style={{ marginBottom: 18 }}>
                <window.LZFlashBar p={p} />
                <div style={{ font: 'var(--type-caption)', color: flashOut ? 'var(--red-600)' : 'var(--text-muted)', marginTop: 5 }}>{flashOut ? 'Đã hết suất Flash Sale' : 'Giá Flash Sale áp dụng tối đa 1 suất cho mỗi tài khoản'}</div>
              </div>
            )}
            {p.preOrderDays && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--blue-50)', borderRadius: 'var(--radius-md)', padding: '8px 12px', font: 'var(--type-body-sm)', color: 'var(--text-body)', marginBottom: 18 }}><Icon name="clock" size={15} style={{ color: 'var(--blue-600)' }} />Hàng đặt trước, shop chuẩn bị trong {p.preOrderDays} ngày trước khi giao.</div>}
            {vacation && <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', padding: '10px 12px', font: 'var(--type-body-sm)', color: 'var(--text-body)', marginBottom: 18 }}><Icon name="clock" size={15} />Shop đang tạm nghỉ đến {vacation.until}. Bạn chưa thể đặt mua sản phẩm này.</div>}

            {/* variants */}
            <div id="tr-variants" style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '14px 16px', alignItems: 'center', marginBottom: 18, scrollMarginTop: 130 }}>
              <span style={vLabel}>Màu sắc</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map((o, i) => (
                  <button key={o.label} disabled={o.stock === 0} onClick={() => setColor(i)} style={chip(i === color, o.stock === 0)}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: o.swatch, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)' }} /> {o.label}
                  </button>
                ))}
              </div>
              <span style={vLabel}>Phiên bản</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SIZES.map((o, i) => (
                  <button key={o.label} onClick={() => setSize(i)} style={chip(i === size, false)}>{o.label}{o.delta ? ' (+' + formatVND(o.delta) + ')' : ''}</button>
                ))}
              </div>
              <span style={vLabel}>Số lượng</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <QuantityStepper value={qty} max={p.flash && p.flashTotal ? 1 : Math.max(1, stock)} onChange={setQty} />
                {soldOut
                  ? <StatusBadge status="ERROR" label="Hết hàng" dot={false} />
                  : <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Còn <b style={{ color: stock <= 5 ? 'var(--red-600)' : 'var(--text-body)' }}>{stock}</b> sản phẩm</span>}
                {stock > 0 && stock <= 5 && <Badge variant="warning"><Icon name="clock" size={11} /> Sắp hết</Badge>}
              </div>
            </div>

            {/* soft-lock note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '8px 12px', font: 'var(--type-body-sm)', marginBottom: 18 }}>
              <Icon name="lock" size={15} /> Khi đặt hàng, Genie giữ chỗ sản phẩm trong <b style={{ margin: '0 3px' }}>15 phút</b> để bạn thanh toán.
            </div>

            {/* actions */}
            <div className="tr-buybar">
              <Button variant="secondary" size="lg" iconLeft="shopping-cart" disabled={soldOut || !!vacation} onClick={add}>Thêm vào giỏ</Button>
              <Button size="lg" disabled={soldOut || !!vacation} onClick={() => { const l = add(); if (l) onGoCart(l.key); }}>{p.preOrderDays ? 'Đặt trước' : 'Mua ngay'}</Button>
            </div>
            <window.LZHoldNote style={{ marginTop: 16 }}>Khi trả trước qua VNPay hoặc VietQR, Genie giữ tiền của bạn và chỉ chuyển cho <b>{vendor.name}</b> sau khi bạn nhận hàng.</window.LZHoldNote>
          </div>
        </div>

        {/* vendor strip */}
        <div className="tr-vstrip" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 20px', margin: '16px 0', boxShadow: 'var(--shadow-sm)' }}>
          <button onClick={() => onShop && onShop(p.v)} aria-label={'Xem shop ' + vendor.name} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%', flex: 'none' }}><window.LZSeal id={p.v} name={vendor.name} size={56} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span role="button" tabIndex={0} onKeyDown={window.LZKey} style={{ font: 'var(--weight-bold) var(--text-lg) var(--font-sans)', color: 'var(--text-strong)', cursor: 'pointer' }} onClick={() => onShop && onShop(p.v)}>{vendor.name}</span>
              {vendor.mall && <Badge variant="primary">Chính hãng</Badge>}
              {vendor.favorite && <Badge variant="primary">Shop Yêu Thích</Badge>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: vacation ? 'var(--text-muted)' : 'var(--mint-600)', font: 'var(--type-caption)' }}>{vacation ? 'Đang tạm nghỉ' : 'Online'}</span>
            </div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{vendor.followers} người theo dõi · {vendor.location} · Đánh giá shop {vendor.rating} sao</div>
          </div>
          <div className="tr-vstrip__act">
            <Button variant={follow ? 'subtle' : 'secondary'} iconLeft={follow ? 'check' : 'plus'} onClick={requireThen(() => (follow ? setUnfollowOpen(true) : setFollow(true)))}>{follow ? 'Đang theo dõi' : 'Theo dõi'}</Button>
            <Button variant="ghost" iconLeft="message-circle" onClick={() => onChat && onChat(p.v, p)}>Chat ngay</Button>
            <Button variant="ghost" iconLeft="store" onClick={() => onShop && onShop(p.v)}>Xem shop</Button>
          </div>
        </div>

        {/* Chi tiết sản phẩm + Mô tả */}
        <section className="tr-promise" aria-label="Khi mua ở Genie">
          <div><Icon name="shield-check" size={22} /><span><b>Genie giữ tiền đến khi bạn nhận hàng</b>Trả trước qua VNPay hoặc VietQR, tiền chưa đến shop cho tới khi bạn xác nhận.</span></div>
          <div><Icon name="undo-2" size={22} /><span><b>7 ngày để yêu cầu trả hàng</b>Hàng lỗi hoặc sai mô tả, gửi ảnh và video bằng chứng ngay trong đơn.</span></div>
          <div><Icon name="badge-check" size={22} /><span><b>{vendor.name} đã xác minh danh tính</b>Bán trên Genie từ {vendor.joined}, đánh giá shop {vendor.rating} sao.</span></div>
        </section>
        <SpecsTable p={p} vendor={vendor} onShop={onShop} onCategory={onCategory} />
        <ProductDescription vendor={vendor} />

        {/* reviews */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8 }}>
            <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)' }}>Đánh giá sản phẩm</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ font: '800 32px var(--font-sans)', color: 'var(--gold-600)' }}>{p.rating}</span>
              <span style={{ color: 'var(--text-muted)' }}>/ 5 · {p.sold} đánh giá</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            {R_FILTERS.map((f) => {
              const on = f.id === rFilter;
              return <button key={f.id} onClick={() => setRFilter(f.id)} style={{ height: 32, padding: '0 14px', borderRadius: 'var(--radius-sm)', border: '1px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary-tint)' : '#fff', color: on ? 'var(--brand-700)' : 'var(--text-body)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>{f.label} ({REVIEWS.filter(f.test).length})</button>;
            })}
          </div>
          {rShown.map((r) => <Review key={r.id} {...r} />)}
          {rShown.length === 0 && <div style={{ padding: '32px 0', textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Chưa có đánh giá nào ở mục này</div>}
        </div>

        {/* related */}
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: '24px 0 14px' }}>Sản phẩm tương tự</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '12px 10px' }}>
          {similar.map((x) => (
            <window.LZCardX key={x.id} p={x} onClick={() => onOpen(x.id)} />
          ))}
        </div>
        {similar.length === 0 && <div style={{ padding: '24px 0', textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Không có sản phẩm tương tự.</div>}
        <Modal open={unfollowOpen} onClose={() => setUnfollowOpen(false)} title="Hủy theo dõi Shop?"
          footer={<><Button variant="ghost" onClick={() => setUnfollowOpen(false)}>Không</Button><Button variant="danger" onClick={() => { setFollow(false); setUnfollowOpen(false); }}>Hủy theo dõi</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>Bạn sẽ không nhận được khuyến mãi từ <b>{vendor.name}</b> nữa.</div>
        </Modal>
        {lightbox && <Lightbox images={gallery} start={active} onClose={() => setLightbox(false)} />}
      </div>
    );
  }

  function SpecsTable({ p, vendor, onShop, onCategory }) {
    const LZ = window.LZ;
    const sub = LZ.subCategoriesOf(p.cat).find((s) => LZ.productsOfCategory(p.cat, s).some((x) => x.id === p.id));
    const SPECS = [
      { key: 'Danh Mục', type: 'breadcrumb', crumbs: sub ? [p.cat, sub] : [p.cat] },
      { key: 'Thương hiệu', value: p.brand },
      { key: 'Shop', value: vendor.name, type: 'link', onClick: () => onShop && onShop(p.v) },
      { key: 'Chất liệu', value: 'Nhựa ABS + Polycarbonate' },
      { key: 'Loại kết nối', value: 'Bluetooth 5.3, USB-C' },
      { key: 'Tính năng', value: 'Chống ồn chủ động (ANC), Xuyên âm' },
      { key: 'Thời lượng pin', value: '40 giờ (ANC tắt), 30 giờ (ANC bật)' },
      { key: 'Trọng lượng', value: '250g' },
      { key: 'Bảo hành', value: '12 tháng chính hãng' },
      { key: 'Tình trạng', value: 'Mới' },
      { key: 'Xuất xứ', value: 'Trung Quốc' },
      { key: 'Gửi từ', value: vendor.location || 'TP. Hồ Chí Minh' },
    ];
    const link = { color: 'var(--blue-600)', textDecoration: 'none', cursor: 'pointer' };
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', marginBottom: 16 }}>Chi tiết sản phẩm</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {SPECS.map((sp, i) => (
              <tr key={i} style={{ borderBottom: i < SPECS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ width: 180, padding: '12px 16px 12px 0', font: 'var(--type-body-sm)', color: 'var(--text-muted)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{sp.key}</td>
                <td style={{ padding: '12px 0', font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  {sp.type === 'breadcrumb'
                    ? <span>{sp.crumbs.map((c, j) => <React.Fragment key={j}>{j > 0 && <span style={{ color: 'var(--text-subtle)' }}> › </span>}<a role="button" tabIndex={0} onKeyDown={window.LZKey} style={link} onClick={() => onCategory && onCategory(c)}>{c}</a></React.Fragment>)}</span>
                    : sp.type === 'link'
                      ? <a role="button" tabIndex={0} onKeyDown={window.LZKey} style={link} onClick={sp.onClick}>{sp.value}</a>
                      : sp.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function ProductDescription({ vendor }) {
    const [expanded, setExpanded] = React.useState(false);
    const MAX_H = 480;
    const hd = { font: 'var(--weight-semibold) 14px var(--font-sans)', color: 'var(--text-strong)', margin: '16px 0 8px' };
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 16, boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', marginBottom: 16 }}>Mô tả sản phẩm</h2>
        <div style={{ maxHeight: expanded ? 'none' : MAX_H, overflow: 'hidden', lineHeight: 1.8, font: 'var(--type-body)', color: 'var(--text-body)' }}>
          <p style={{ font: 'var(--weight-bold) 15px var(--font-sans)', color: 'var(--text-strong)', marginBottom: 6 }}>{vendor.name} — Tai nghe Bluetooth chính hãng</p>
          <p style={{ marginBottom: 16 }}>Tai Nghe Bluetooth ANC Pro 5 — Chống Ồn Chủ Động, Pin 40 Giờ, Bluetooth 5.3, Driver 40mm Titanium.</p>
          <p style={hd}>Thông tin sản phẩm:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li>Kết nối: Bluetooth 5.3 + USB-C (chế độ có dây)</li>
            <li>Driver: 40mm Titanium — âm trầm sâu, treble trong</li>
            <li>Chống ồn: ANC chủ động, chế độ Xuyên âm (Ambient)</li>
            <li>Pin: 40 giờ (ANC tắt), 30 giờ (ANC bật)</li>
            <li>Sạc nhanh: 10 phút sạc = 3 giờ nghe</li>
            <li>Trọng lượng: 250g, đệm tai Memory Foam</li>
          </ul>
          <div style={{ width: '100%', maxWidth: 600, height: 300, margin: '16px auto', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'linear-gradient(135deg, var(--gray-100), var(--gray-200))', display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)' }}><Icon name="image" size={48} /><div style={{ font: 'var(--type-caption)', marginTop: 8 }}>Ảnh minh hoạ sản phẩm</div></div>
          </div>
          <p style={hd}>Cam kết từ {vendor.name}:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <span>✅ Hàng chính hãng 100%</span>
            <span>✅ Đổi trả miễn phí trong 7 ngày</span>
            <span>✅ Bảo hành 12 tháng tại trung tâm bảo hành</span>
            <span>✅ Giao hàng toàn quốc</span>
          </div>
          <p style={hd}>Lưu ý khi sử dụng:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li>Tránh để tai nghe tiếp xúc với nước</li>
            <li>Sạc đầy pin trước khi sử dụng lần đầu</li>
            <li>Không vặn âm lượng quá lớn để bảo vệ thính giác</li>
          </ul>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '16px 0' }} />
          <p style={hd}>📦 Bộ sản phẩm bao gồm:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>1× Tai nghe ANC Pro 5</span>
            <span>1× Cáp sạc USB-C (1m)</span>
            <span>1× Bao đựng cứng (hardcase)</span>
            <span>1× Sách hướng dẫn sử dụng</span>
          </div>
        </div>
        {!expanded && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #fff)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16 }}>
            <Button variant="outline" size="sm" iconRight="chevron-down" onClick={() => setExpanded(true)}>Xem thêm</Button>
          </div>
        )}
        {expanded && <div style={{ textAlign: 'center', marginTop: 16 }}><Button variant="ghost" size="sm" iconRight="chevron-up" onClick={() => setExpanded(false)}>Thu gọn</Button></div>}
      </div>
    );
  }

  const lbBtn = { width: 46, height: 46, borderRadius: '50%', border: 0, background: 'rgba(255,255,255,.14)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', flex: 'none' };
  const vLabel = { font: 'var(--type-body-sm)', color: 'var(--text-muted)' };
  const shareBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer', padding: '6px 0' };
  function chip(on, disabled) {
    return { display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 38, padding: '0 14px', borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer', font: 'var(--weight-medium) var(--text-sm) var(--font-sans)', background: '#fff', color: disabled ? 'var(--text-disabled)' : 'var(--text-body)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), boxShadow: on ? 'inset 0 0 0 1px var(--color-primary)' : 'none', opacity: disabled ? 0.55 : 1, position: 'relative' };
  }

  window.LZProductDetail = (props) => (byId(props.id) ? <ProductDetailInner {...props} /> : <ProductGone onOpen={props.onOpen} onHome={props.onHome} />);
})();
