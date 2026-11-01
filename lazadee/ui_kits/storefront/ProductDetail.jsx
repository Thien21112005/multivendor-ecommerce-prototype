/* Lazadee product detail: gallery, SKU variants, vendor, reviews. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, IconButton, Badge, PriceVND, Rating, VendorChip, QuantityStepper, StatusBadge, Money } = DS;
  const formatVND = Money.format;
  const { byId, V, PRODUCTS } = window.LZ;

  const COLORS = [
    { label: 'Đen', swatch: '#1A1815', delta: 0, stock: 38 },
    { label: 'Trắng', swatch: '#F1EFEC', delta: 0, stock: 12 },
    { label: 'Xanh navy', swatch: '#2A3550', delta: 30000, stock: 5 },
    { label: 'Hồng', swatch: '#FF7FA3', delta: 20000, stock: 0 },
  ];
  const SIZES = [{ label: 'Tiêu chuẩn', delta: 0 }, { label: 'Bản Pro', delta: 150000 }];

  function Review({ name, when, rating, variant, text, imgs, reply }) {
    return (
      <div style={{ display: 'flex', gap: 12, padding: '18px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gray-200)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontWeight: 700, flex: 'none' }}>{name[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{name}</div>
          <div style={{ margin: '3px 0 6px' }}><Rating value={rating} size={13} showNumber={false} /></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <Badge variant="success" icon="badge-check">Đã mua hàng</Badge>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{when} · Phân loại: {variant}</span>
          </div>
          <p style={{ font: 'var(--type-body)', color: 'var(--text-body)', marginBottom: imgs ? 10 : 0 }}>{text}</p>
          {imgs && <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>{imgs.map((m) => <img key={m} src={'../../assets/img/' + m + '.jpg'} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />)}</div>}
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
        <button style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-caption)', cursor: 'pointer' }}><Icon name="thumbs-up" size={14} /> Hữu ích (24)</button>
      </div>
    );
  }

  function ProductDetail({ id, onOpen, onAdd, onGoCart, onShop }) {
    const p = byId(id) || PRODUCTS[0];
    const vendor = V[p.v];
    const gallery = [p.img, '../../assets/img/banner-tech.jpg', '../../assets/img/keyboard.jpg', '../../assets/img/speaker.jpg'].filter(Boolean);
    const [active, setActive] = React.useState(0);
    const [color, setColor] = React.useState(0);
    const [size, setSize] = React.useState(0);
    const [qty, setQty] = React.useState(1);
    const [follow, setFollow] = React.useState(false);
    const c = COLORS[color], s = SIZES[size];
    const price = p.price + c.delta + s.delta;
    const stock = c.stock;
    const soldOut = stock === 0;

    React.useEffect(() => { setQty(1); }, [color, size]);

    const add = () => onAdd({ key: p.id + '|' + c.label + '/' + s.label, productId: p.id, vendorId: p.v, title: p.title, img: p.img, price, original: p.original, variant: c.label + ' / ' + s.label, qty, stock });

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 60px' }}>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ cursor: 'pointer' }}>Trang chủ</span><Icon name="chevron-right" size={13} /><span style={{ cursor: 'pointer' }}>{p.cat}</span><Icon name="chevron-right" size={13} /><span style={{ color: 'var(--text-body)' }}>{p.title.slice(0, 30)}…</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 24, background: '#fff', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
          {/* gallery */}
          <div>
            <div style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--gray-100)' }}>
              <img src={gallery[active]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid ' + (i === active ? 'var(--color-primary)' : 'transparent'), padding: 0, cursor: 'pointer', background: 'none' }}>
                  <img src={g} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button style={shareBtn}><Icon name="heart" size={16} /> Yêu thích</button>
              <button style={shareBtn}><Icon name="message-circle" size={16} /> Chia sẻ</button>
            </div>
          </div>

          {/* info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {p.mall && <Badge variant="solid">MALL</Badge>}
              {p.flash && <Badge variant="flash" icon="zap">FLASH SALE</Badge>}
              <Badge variant="outline">Chính hãng 100%</Badge>
            </div>
            <h1 style={{ font: 'var(--weight-semibold) 22px/1.3 var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 }}>{p.title}</h1>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <Rating value={p.rating} count={p.sold} />
              <span style={{ color: 'var(--border-default)' }}>|</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Đã bán <b style={{ color: 'var(--text-body)' }}>{p.sold}</b></span>
            </div>

            {/* price block */}
            <div style={{ background: 'var(--color-primary-tint)', borderRadius: 'var(--radius-md)', padding: '16px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <PriceVND amount={price} original={p.original} size="lg" />
              <Badge variant="flash">-{p.discountPct}%</Badge>
            </div>

            {/* variants */}
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '14px 16px', alignItems: 'center', marginBottom: 18 }}>
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
                <QuantityStepper value={qty} max={Math.max(1, stock)} onChange={setQty} />
                {soldOut
                  ? <StatusBadge status="ERROR" label="Hết hàng" dot={false} />
                  : <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Còn <b style={{ color: stock <= 5 ? 'var(--red-600)' : 'var(--text-body)' }}>{stock}</b> sản phẩm</span>}
                {stock > 0 && stock <= 5 && <Badge variant="warning"><Icon name="clock" size={11} /> Sắp hết</Badge>}
              </div>
            </div>

            {/* soft-lock note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '8px 12px', font: 'var(--type-body-sm)', marginBottom: 18 }}>
              <Icon name="lock" size={15} /> Đặt hàng sẽ giữ chỗ tồn kho trong <b style={{ margin: '0 3px' }}>15:00</b> phút để bạn hoàn tất thanh toán.
            </div>

            {/* actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" size="lg" iconLeft="shopping-cart" disabled={soldOut} onClick={add}>Thêm vào giỏ</Button>
              <Button size="lg" disabled={soldOut} onClick={() => { add(); onGoCart(); }}>Mua ngay</Button>
            </div>
          </div>
        </div>

        {/* vendor strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 20px', margin: '16px 0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: vendor.logoBg, color: '#fff', display: 'grid', placeItems: 'center', font: '800 22px var(--font-sans)', flex: 'none', cursor: 'pointer' }} onClick={() => onShop && onShop(p.v)}>{vendor.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ font: 'var(--weight-bold) var(--text-lg) var(--font-sans)', color: 'var(--text-strong)', cursor: 'pointer' }} onClick={() => onShop && onShop(p.v)}>{vendor.name}</span>
              {vendor.mall && <Badge variant="solid">MALL</Badge>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--mint-600)', font: 'var(--type-caption)' }}>● Online</span>
            </div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{vendor.followers} người theo dõi · {vendor.location} · Đánh giá shop {vendor.rating}★</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant={follow ? 'subtle' : 'secondary'} iconLeft={follow ? 'check' : 'plus'} onClick={() => setFollow(!follow)}>{follow ? 'Đang theo dõi' : 'Theo dõi'}</Button>
            <Button variant="ghost" iconLeft="message-circle">Chat ngay</Button>
            <Button variant="ghost" iconLeft="store" onClick={() => onShop && onShop(p.v)}>Xem shop</Button>
          </div>
        </div>

        {/* Chi tiết sản phẩm + Mô tả */}
        <SpecsTable p={p} vendor={vendor} onShop={onShop} />
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
            {['Tất cả', '5 Sao', '4 Sao', '3 Sao', 'Có hình ảnh', 'Đã mua hàng'].map((f, i) => (
              <button key={f} style={{ height: 32, padding: '0 14px', borderRadius: 'var(--radius-sm)', border: '1px solid ' + (i === 0 ? 'var(--color-primary)' : 'var(--border-default)'), background: i === 0 ? 'var(--color-primary-tint)' : '#fff', color: i === 0 ? 'var(--orange-700)' : 'var(--text-body)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
          <Review name="Nguyễn Minh" when="2026-05-28" rating={5} variant="Đen / Bản Pro" text="Sản phẩm đúng mô tả, chất lượng tốt, đóng gói cẩn thận. Giao hàng nhanh trong 2 ngày. Sẽ ủng hộ shop lần sau!" imgs={['headphones', 'banner-tech']} reply="Cảm ơn bạn đã tin tưởng TechZone! Shop rất vui khi sản phẩm làm bạn hài lòng 🧡" />
          <Review name="Trần Thu Hà" when="2026-05-21" rating={4} variant="Trắng / Tiêu chuẩn" text="Pin trâu, âm thanh ổn trong tầm giá. Trừ 1 sao vì hộp hơi móp khi nhận nhưng sản phẩm vẫn nguyên vẹn." />
          <Review name="Lê Hoàng" when="2026-05-15" rating={5} variant="Đen / Tiêu chuẩn" text="Chống ồn tốt, đeo êm tai. Đáng tiền!" imgs={['speaker']} />
        </div>

        {/* related */}
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: '24px 0 14px' }}>Sản phẩm tương tự</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
          {PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 6).map((x) => (
            <DS.ProductCard key={x.id} {...window.LZ.card(x)} onClick={() => onOpen(x.id)} />
          ))}
        </div>
      </div>
    );
  }

  function SpecsTable({ p, vendor, onShop }) {
    const SPECS = [
      { key: 'Danh Mục', type: 'breadcrumb', crumbs: ['Điện tử', 'Tai nghe & Loa', 'Tai nghe Bluetooth'] },
      { key: 'Thương hiệu', value: vendor.name, type: 'link', onClick: () => onShop && onShop(p.v) },
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
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 16 }}>Chi tiết sản phẩm</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {SPECS.map((sp, i) => (
              <tr key={i} style={{ borderBottom: i < SPECS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ width: 180, padding: '12px 16px 12px 0', font: 'var(--type-body-sm)', color: 'var(--text-muted)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{sp.key}</td>
                <td style={{ padding: '12px 0', font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  {sp.type === 'breadcrumb'
                    ? <span>{sp.crumbs.map((c, j) => <React.Fragment key={j}>{j > 0 && <span style={{ color: 'var(--text-subtle)' }}> › </span>}<a style={link}>{c}</a></React.Fragment>)}</span>
                    : sp.type === 'link'
                      ? <a style={link} onClick={sp.onClick}>{sp.value}</a>
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
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 16 }}>Mô tả sản phẩm</h2>
        <div style={{ maxHeight: expanded ? 'none' : MAX_H, overflow: 'hidden', lineHeight: 1.8, font: 'var(--type-body)', color: 'var(--text-body)' }}>
          <p style={{ font: 'var(--weight-bold) 15px var(--font-sans)', color: 'var(--text-strong)', marginBottom: 6, textTransform: 'uppercase' }}>{vendor.name} — Tai nghe Bluetooth chính hãng</p>
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

  const vLabel = { font: 'var(--type-body-sm)', color: 'var(--text-muted)' };
  const shareBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer', padding: '6px 0' };
  function chip(on, disabled) {
    return { display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 38, padding: '0 14px', borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer', font: 'var(--weight-medium) var(--text-sm) var(--font-sans)', background: '#fff', color: disabled ? 'var(--text-disabled)' : 'var(--text-body)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), boxShadow: on ? 'inset 0 0 0 1px var(--color-primary)' : 'none', opacity: disabled ? 0.55 : 1, position: 'relative' };
  }

  window.LZProductDetail = ProductDetail;
})();
