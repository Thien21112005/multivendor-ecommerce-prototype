/* Lazadee consolidated checkout: cart splits into N sub-orders (one Order ID per
   vendor); stackable Platform + Shop + Freeship vouchers, prorated; soft-lock. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Checkbox, Radio, Switch, StatusBadge, Money } = DS;
  const formatVND = Money.format;
  const { V } = window.LZ;

  function Countdown({ secs }) {
    const [t, setT] = React.useState(secs);
    React.useEffect(() => { const i = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(i); }, []);
    const m = Math.floor(t / 60), s = t % 60;
    return <b className="code" style={{ color: 'var(--amber-600)' }}>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</b>;
  }

  function Checkout({ cart, onPlaced, onFailed, onBack }) {
    const { ADDRESSES } = window.LZ;
    const [addr, setAddr] = React.useState(ADDRESSES.find((a) => a.default) || ADDRESSES[0]);
    const [addrOpen, setAddrOpen] = React.useState(new URLSearchParams(location.search).get('addr') === '1');
    const [simFail, setSimFail] = React.useState(false);
    const [usePlatform, setUsePlatform] = React.useState(true);
    const [useFreeship, setUseFreeship] = React.useState(true);
    const [useShop, setUseShop] = React.useState(true);
    const [pay, setPay] = React.useState('vnpay');
    const [useXu, setUseXu] = React.useState(false); // 1 Xu = 1₫, capped at 50% of subtotal
    const [oos, setOos] = React.useState(new URLSearchParams(location.search).get('oos') === '1'); // simulate ERR_STOCK_UNAVAILABLE

    const groups = React.useMemo(() => {
      const m = {}; cart.forEach((l) => { (m[l.vendorId] = m[l.vendorId] || []).push(l); });
      return Object.entries(m);
    }, [cart]);

    const oosKey = cart[0] && cart[0].key;
    const liveLines = (lines) => oos ? lines.filter((l) => l.key !== oosKey) : lines;

    const subtotal = cart.reduce((n, l) => n + ((oos && l.key === oosKey) ? 0 : l.price * l.qty), 0);
    const shipping = groups.reduce((n, [vid, lines]) => (liveLines(lines).length ? n + V[vid].ship : n), 0);

    // stackable vouchers
    const platformDisc = usePlatform && subtotal >= 199000 ? 30000 : 0;
    const freeshipDisc = useFreeship ? Math.min(shipping, 30000) : 0;
    const shopDiscByVendor = {};
    groups.forEach(([vid, lines]) => {
      const sub = liveLines(lines).reduce((n, l) => n + l.price * l.qty, 0);
      shopDiscByVendor[vid] = useShop && sub > 0 ? Math.min(Math.round(sub * 0.15), 50000) : 0;
    });
    const shopDisc = Object.values(shopDiscByVendor).reduce((a, b) => a + b, 0);

    // Lazadee Xu: 1 Xu = 1₫, usable up to min(balance, 50% of subtotal). Applied after vouchers.
    const coins = (window.LZ.USER && window.LZ.USER.coins) || 0;
    const xuCap = Math.floor(subtotal * 0.5);
    const xuDiscount = useXu ? Math.min(coins, xuCap) : 0;
    const total = Math.max(0, subtotal + shipping - platformDisc - freeshipDisc - shopDisc - xuDiscount);

    // prorate platform voucher across sub-orders by subtotal weight
    const prorate = (vSub) => (subtotal > 0 ? Math.round(platformDisc * (vSub / subtotal)) : 0);

    let orderSeq = 40;
    const canPlace = cart.length > (oos ? 1 : 0);

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 60px' }}>
        <h1 style={{ font: 'var(--type-h2)', color: 'var(--text-strong)', marginBottom: 16 }}>Thanh toán</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20, alignItems: 'start' }}>
          <div>
            {/* address */}
            <div style={card}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Icon name="map-pin" size={20} style={{ color: 'var(--color-primary)', marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{addr.recipient}</span>
                    <span className="code" style={{ color: 'var(--text-muted)' }}>{addr.phone}</span>
                    {addr.label && <Badge variant="neutral">{addr.label}</Badge>}
                    {addr.default && <Badge variant="primary">Mặc định</Badge>}
                  </div>
                  <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{addr.line}, {addr.ward}, {addr.district}, {addr.city}</div>
                </div>
                <Button variant="ghost" iconLeft="pencil" onClick={() => setAddrOpen(true)}>Thay đổi</Button>
              </div>
            </div>

            {/* sub-orders */}
            {groups.map(([vid, lines]) => {
              const vendor = V[vid];
              const live = liveLines(lines);
              const vSub = live.reduce((n, l) => n + l.price * l.qty, 0);
              const oid = 'ORD-2412-00' + (orderSeq++);
              const vTotal = vSub + (live.length ? vendor.ship : 0) - (useShop ? shopDiscByVendor[vid] : 0) - (useFreeship ? Math.min(vendor.ship, 30000) : 0) - prorate(vSub);
              return (
                <div key={vid} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                    <Icon name="store" size={16} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{vendor.name}</span>
                    {vendor.mall && <Badge variant="solid">MALL</Badge>}
                    <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Đơn riêng</span>
                      <span className="code" style={{ font: '600 12px var(--font-mono)', color: 'var(--text-body)', background: 'var(--gray-100)', padding: '2px 7px', borderRadius: 'var(--radius-sm)' }}>{oid}</span>
                    </span>
                  </div>
                  {lines.map((l) => {
                    const dead = oos && l.key === oosKey;
                    return (
                      <div key={l.key} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', opacity: dead ? 0.7 : 1 }}>
                        <img src={l.img} style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover', flex: 'none', filter: dead ? 'grayscale(1)' : 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{l.title}</div>
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>Phân loại: {l.variant}</div>
                          {dead && <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}><StatusBadge status="ERROR" label="ERR_STOCK_UNAVAILABLE" dot={false} /><span style={{ font: 'var(--type-caption)', color: 'var(--red-600)' }}>Sản phẩm vừa hết hàng — đã gỡ khỏi đơn.</span></div>}
                        </div>
                        <div style={{ textAlign: 'right', flex: 'none' }}>
                          <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: dead ? 'var(--text-disabled)' : 'var(--text-body)', textDecoration: dead ? 'line-through' : 'none', fontVariantNumeric: 'tabular-nums' }}>{formatVND(l.price)}</div>
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>x{l.qty}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={voucherRow}><Icon name="ticket" size={15} style={{ color: 'var(--flash-500)' }} /><span>Voucher Shop {useShop && shopDiscByVendor[vid] ? '−' + formatVND(shopDiscByVendor[vid]) : 'Chọn'}</span><Icon name="chevron-right" size={14} style={{ marginLeft: 'auto', color: 'var(--text-subtle)' }} /></div>
                    <div style={voucherRow}><Icon name="message-square" size={15} style={{ color: 'var(--text-muted)' }} /><input placeholder="Lời nhắn cho Shop…" style={{ border: 0, outline: 'none', font: 'var(--type-body-sm)', flex: 1, background: 'transparent' }} /></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12 }}>
                    <Icon name="truck" size={16} style={{ color: 'var(--mint-600)' }} />
                    <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Giao nhanh · {formatVND(vendor.ship)}{useFreeship && <span style={{ color: 'var(--mint-600)', marginLeft: 6 }}>(Freeship áp dụng)</span>}</span>
                    <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng đơn ({live.length} SP): <b style={{ color: 'var(--text-price)', fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{formatVND(Math.max(0, vTotal))}</b></span>
                  </div>
                </div>
              );
            })}

            {/* platform vouchers */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon name="ticket" size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Lazadee Voucher</span>
                <Badge variant="neutral">Tối đa 1 mỗi loại</Badge>
              </div>
              <label style={vchk}><Checkbox checked={usePlatform} onChange={() => setUsePlatform(!usePlatform)} /><span style={{ flex: 1 }}><b>Giảm 30.000₫</b> · Đơn từ 199.000₫ · Voucher Sàn</span><Badge variant="primary">Platform</Badge></label>
              <label style={vchk}><Checkbox checked={useFreeship} onChange={() => setUseFreeship(!useFreeship)} /><span style={{ flex: 1 }}><b>Miễn phí vận chuyển</b> · Giảm tối đa 30.000₫ phí ship</span><Badge variant="mint">Freeship</Badge></label>
              <label style={{ ...vchk, borderBottom: 0 }}><Checkbox checked={useShop} onChange={() => setUseShop(!useShop)} /><span style={{ flex: 1 }}><b>Voucher Shop −15%</b> · Áp dụng cho từng người bán (tối đa 50k/shop)</span><Badge variant="flash">Shop</Badge></label>
            </div>

            {/* Lazadee Xu */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gold-50)', color: 'var(--gold-600, #E09600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="star" size={22} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Sử dụng Lazadee Xu</span>
                    <Badge variant="neutral">1 Xu = 1₫</Badge>
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>
                    Đang có <b className="code" style={{ color: 'var(--gold-700, #B57A00)' }}>{coins.toLocaleString('vi-VN')}</b> Xu · Dùng tối đa 50% tiền hàng ({formatVND(xuCap)})
                  </div>
                </div>
                <Switch checked={useXu} onChange={() => setUseXu(!useXu)} disabled={subtotal <= 0} />
              </div>
              {useXu && xuDiscount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 12px', background: 'var(--gold-50)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                  <Icon name="circle-check" size={16} style={{ color: 'var(--gold-600, #E09600)' }} />
                  Đã áp dụng <b>{xuDiscount.toLocaleString('vi-VN')} Xu</b>, giảm <b style={{ color: 'var(--text-price)' }}>{formatVND(xuDiscount)}</b> vào đơn hàng.
                </div>
              )}
            </div>

            {/* payment */}
            <div style={card}>
              <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 4 }}>Phương thức thanh toán</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 12 }}><Icon name="shield-check" size={14} style={{ color: 'var(--mint-600)' }} />Thanh toán qua cổng để giữ tiền bảo chứng (Escrow) · không hỗ trợ COD</div>
              {[['vnpay', 'Cổng VNPAY', 'layout-grid', 'Thẻ ATM / QR Code'], ['momo', 'Ví điện tử MoMo', 'wallet', ''], ['zalopay', 'Ví ZaloPay', 'phone', ''], ['card', 'Thẻ Tín dụng / Ghi nợ Quốc tế', 'credit-card', 'Visa / Mastercard']].map(([id, name, icon, meta]) => (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1.5px solid ' + (pay === id ? 'var(--color-primary)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', marginBottom: 8, cursor: 'pointer', background: pay === id ? 'var(--color-primary-tint)' : '#fff' }}>
                  <Radio name="pay" checked={pay === id} onChange={() => setPay(id)} />
                  <Icon name={icon} size={20} style={{ color: 'var(--text-body)' }} />
                  <span style={{ font: 'var(--weight-medium) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{name}</span>
                  {meta && <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{meta}</span>}
                </label>
              ))}
            </div>
          </div>

          {/* summary */}
          <div style={{ position: 'sticky', top: 180 }}>
            <div style={{ ...card, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '9px 12px', font: 'var(--type-body-sm)', marginBottom: 16 }}>
                <Icon name="lock" size={16} /> <span>Tồn kho được giữ trong <Countdown secs={14 * 60 + 38} /></span>
              </div>
              <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 12 }}>Chi tiết thanh toán</div>
              {[['Tổng tiền hàng', formatVND(subtotal)], ['Tổng phí vận chuyển', formatVND(shipping)]].map(([k, v]) => (
                <div key={k} style={sumRow}><span>{k}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span></div>
              ))}
              {platformDisc > 0 && <div style={sumRow}><span>Voucher Sàn</span><span style={disc}>−{formatVND(platformDisc)}</span></div>}
              {freeshipDisc > 0 && <div style={sumRow}><span>Giảm phí vận chuyển</span><span style={disc}>−{formatVND(freeshipDisc)}</span></div>}
              {shopDisc > 0 && <div style={sumRow}><span>Voucher Shop</span><span style={disc}>−{formatVND(shopDisc)}</span></div>}
              {xuDiscount > 0 && <div style={sumRow}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="star" size={13} style={{ color: 'var(--gold-500)' }} />Sử dụng Lazadee Xu</span><span style={disc}>−{formatVND(xuDiscount)}</span></div>}
              <div style={{ borderTop: '1px dashed var(--border-default)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: 'var(--weight-semibold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Tổng thanh toán</span>
                <span style={{ font: '800 26px var(--font-sans)', color: 'var(--text-price)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(total)}</span>
              </div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>{groups.length} đơn · {cart.length} sản phẩm</div>
              <Button block size="lg" style={{ marginTop: 16 }} disabled={!canPlace} onClick={() => (simFail ? onFailed && onFailed() : onPlaced && onPlaced())}>Đặt hàng</Button>
              <p style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', marginTop: 10 }}>Nhấn "Đặt hàng" đồng nghĩa bạn đồng ý với <a>Điều khoản Lazadee</a></p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => setOos(!oos)} style={{ width: '100%', border: '1px dashed var(--border-strong)', background: '#fff', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', padding: '10px', font: 'var(--type-caption)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="refresh-cw" size={13} /> {oos ? 'Khôi phục tồn kho (demo)' : 'Mô phỏng: sản phẩm hết hàng giữa lúc thanh toán'}
              </button>
              <button onClick={() => setSimFail(!simFail)} style={{ width: '100%', border: '1px dashed ' + (simFail ? 'var(--red-300, #F3B0A8)' : 'var(--border-strong)'), background: simFail ? 'var(--red-50, #FDECEA)' : '#fff', color: simFail ? 'var(--red-600)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', padding: '10px', font: 'var(--type-caption)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="triangle-alert" size={13} /> {simFail ? 'Thanh toán sẽ thất bại (demo đang bật)' : 'Mô phỏng: thanh toán thất bại (PAYMENT_FAILED)'}
              </button>
            </div>
          </div>
        </div>

        {window.LZAddressModal && <window.LZAddressModal open={addrOpen} onClose={() => setAddrOpen(false)} selectedId={addr.id} onSelect={setAddr} />}
      </div>
    );
  }

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 14, boxShadow: 'var(--shadow-sm)' };
  const voucherRow = { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-25)', borderRadius: 'var(--radius-md)', padding: '9px 12px', font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer' };
  const vchk = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', font: 'var(--type-body-sm)', color: 'var(--text-body)' };
  const sumRow = { display: 'flex', justifyContent: 'space-between', font: 'var(--type-body-sm)', color: 'var(--text-muted)', padding: '4px 0' };
  const disc = { color: 'var(--mint-600)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 };

  window.LZCheckout = Checkout;
})();
