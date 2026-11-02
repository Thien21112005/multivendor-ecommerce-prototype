/* Genie consolidated checkout: cart splits into N sub-orders (one Order ID per
   vendor); stackable Platform + Shop + Freeship vouchers chosen from the voucher
   picker, prorated per line; soft-lock. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Radio, Switch, StatusBadge, Money } = DS;
  const formatVND = Money.format;
  const { V } = window.LZ;

  function Countdown({ secs }) {
    const [t, setT] = React.useState(secs);
    React.useEffect(() => { const i = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(i); }, []);
    const m = Math.floor(t / 60), s = t % 60;
    return <b className="code" style={{ color: 'var(--amber-600)' }}>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</b>;
  }

  const CodLogo = () => (
    <svg viewBox="0 0 100 100" width="30" height="30" aria-hidden="true">
      <rect x="10" y="25" width="80" height="50" rx="6" fill="#fff" stroke="#10b981" strokeWidth="4" />
      <circle cx="50" cy="50" r="14" fill="#d1fae5" stroke="#10b981" strokeWidth="3" />
      <text x="50" y="55" fontFamily="var(--font-sans)" fontWeight="bold" fontSize="16" fill="#047857" textAnchor="middle">$</text>
    </svg>
  );
  const PAYMENTS = [
    { id: 'vnpay', name: 'Cổng VNPAY', logo: 'vnpay.png', meta: 'Thẻ ATM / QR Code' },
    { id: 'vietqr', name: 'Chuyển khoản VietQR', icon: 'qr-code', meta: 'Tự xác nhận qua SePay' },
    { id: 'cod', name: 'Thanh toán tiền mặt (COD)', meta: 'Nhận hàng rồi thanh toán' },
  ];

  function Checkout({ cart, voucherSel, setVoucherSel, useXu, setUseXu, onPlaced, onFailed, onBack }) {
    const LZ = window.LZ;
    const { ADDRESSES } = LZ;
    const [addr, setAddr] = React.useState(ADDRESSES.find((a) => a.default) || ADDRESSES[0]);
    const [addrOpen, setAddrOpen] = React.useState(new URLSearchParams(location.search).get('addr') === '1');
    const [openShops, setOpenShops] = React.useState({});
    const [simFail, setSimFail] = React.useState(false);
    const [pay, setPay] = React.useState('vnpay');
    const [placing, setPlacing] = React.useState(false);
    const [gateway, setGateway] = React.useState(null);
    const [qrResult, setQrResult] = React.useState(null);
    const [lazOpen, setLazOpen] = React.useState(false);
    const [shopPicker, setShopPicker] = React.useState(null); // vendorId
    const [notes, setNotes] = React.useState({});
    const [oos, setOos] = React.useState(new URLSearchParams(location.search).get('oos') === '1'); // simulate TR-INV-4090

    const groups = React.useMemo(() => {
      const m = {}; cart.forEach((l) => { (m[l.vendorId] = m[l.vendorId] || []).push(l); });
      return Object.entries(m);
    }, [cart]);

    const oosKey = cart[0] && cart[0].key;
    const liveLines = (lines) => (oos ? lines.filter((l) => l.key !== oosKey) : lines);
    const live = liveLines(cart);
    const price = LZ.priceCart(live, voucherSel, useXu);
    const { subtotal, shipping, platformDisc, freeshipDisc, shopDisc, xuCap, xuDiscount, total, platformVoucher, freeshipVoucher } = price;
    const coins = (LZ.USER && LZ.USER.coins) || 0;

    const best = LZ.bestVouchers(live);
    const extra = LZ.priceCart(live, best, false).discountTotal - LZ.priceCart(live, voucherSel, false).discountTotal;
    let orderSeq = 40;
    const canPlace = cart.length > (oos ? 1 : 0) && !placing;

    const place = () => {
      if (simFail) { onFailed && onFailed(); return; }
      setPlacing(true);
      setTimeout(() => {
        let seq = 40;
        const orders = groups.filter(([, ls]) => liveLines(ls).length).map(([vid, ls]) => {
          const lines = liveLines(ls);
          const sub = lines.reduce((n, l) => n + l.price * l.qty, 0);
          const grand = Math.max(0, sub + LZ.shipFee(vid, lines) - (price.shopByVendor[vid] || 0) - (price.shipCutByVendor[vid] || 0) - lines.reduce((n, l) => n + (price.perLine[l.key] || 0), 0));
          return { id: 'TR-20260608-' + String(200 + seq++).padStart(6, '0'), vendorId: vid, grandTotal: grand };
        });
        const result = { sessionId: 'CS-' + Date.now().toString(36).toUpperCase(), orders, price, keys: live.map((l) => l.key), pay };
        setPlacing(false);
        if (pay === 'vietqr') setQrResult(result);
        else if (pay === 'vnpay') setGateway(result);
        else onPlaced && onPlaced(result);
      }, 700);
    };

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
              const liveV = liveLines(lines);
              const vSub = liveV.reduce((n, l) => n + l.price * l.qty, 0);
              const oid = 'TR-20260608-' + String(200 + orderSeq++).padStart(6, '0');
              const platformCut = liveV.reduce((n, l) => n + (price.perLine[l.key] || 0), 0);
              const shopCut = price.shopByVendor[vid] || 0;
              const shipCut = price.shipCutByVendor[vid] || 0;
              const vFee = liveV.length ? LZ.shipFee(vid, liveV) : 0;
              const vTotal = vSub + vFee - shopCut - shipCut - platformCut;
              return (
                <div key={vid} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                    <window.LZSeal id={vid} name={window.LZ.V[vid].name} size={28} />
                    <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{vendor.name}</span>
                    {vendor.mall && <Badge variant="primary">Chính hãng</Badge>}
                    <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Đơn riêng</span>
                      <span className="code" style={{ font: '600 12px var(--font-mono)', color: 'var(--text-body)', background: 'var(--gray-100)', padding: '2px 7px', borderRadius: 'var(--radius-sm)' }}>{oid}</span>
                    </span>
                  </div>
                  <div className="tr-lines" data-open={openShops[vid] ? 1 : 0}>
                  {lines.map((l) => {
                    const dead = oos && l.key === oosKey;
                    return (
                      <div key={l.key} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', opacity: dead ? 0.7 : 1 }}>
                        <img src={l.img} alt="" style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover', flex: 'none', filter: dead ? 'grayscale(1)' : 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{l.title}</div>
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>Phân loại: {l.variant}</div>
                          {dead && <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}><StatusBadge status="ERROR" label="Hết hàng" dot={false} /><span style={{ font: 'var(--type-caption)', color: 'var(--red-600)' }}>Sản phẩm vừa hết hàng — đã gỡ khỏi đơn.</span></div>}
                        </div>
                        <div style={{ textAlign: 'right', flex: 'none' }}>
                          <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: dead ? 'var(--text-disabled)' : 'var(--text-body)', textDecoration: dead ? 'line-through' : 'none', fontVariantNumeric: 'tabular-nums' }}>{formatVND(l.price)}</div>
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>x{l.qty}</div>
                          {!dead && price.perLine[l.key] > 0 && <div style={{ font: 'var(--type-caption)', color: 'var(--mint-600)', marginTop: 2 }}>−{formatVND(price.perLine[l.key])}</div>}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                  {lines.length > 1 && !openShops[vid] && <button className="tr-lines__more" onClick={() => setOpenShops((o) => ({ ...o, [vid]: true }))}>Xem thêm {lines.length - 1} sản phẩm <Icon name="chevron-down" size={15} /></button>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div role="button" tabIndex={0} onKeyDown={window.LZKey} style={voucherRow} onClick={() => setShopPicker(vid)}><Icon name="ticket" size={15} style={{ color: 'var(--flash-500)' }} /><span>{shopCut ? 'Voucher Shop −' + formatVND(shopCut) : 'Chọn Voucher của Shop'}</span><Icon name="chevron-right" size={14} style={{ marginLeft: 'auto', color: 'var(--text-subtle)' }} /></div>
                    <div style={{ ...voucherRow, cursor: 'text' }}><Icon name="message-square" size={15} style={{ color: 'var(--text-muted)' }} /><input value={notes[vid] || ''} maxLength={500} onChange={(e) => setNotes((n) => ({ ...n, [vid]: e.target.value }))} placeholder="Lời nhắn cho Shop…" style={{ border: 0, outline: 'none', font: 'var(--type-body-sm)', flex: 1, minWidth: 0, background: 'transparent' }} /></div>
                  </div>
                  {platformCut > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="ticket" size={14} style={{ color: 'var(--blue-600)' }} /> Voucher Sàn phân bổ:</span>
                      <span style={{ color: 'var(--blue-600)', fontWeight: 600 }}>−{formatVND(platformCut)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12 }}>
                    <Icon name="truck" size={16} style={{ color: 'var(--mint-600)' }} />
                    <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Giao nhanh · {vFee === 0 ? 'Shop miễn phí vận chuyển' : formatVND(vFee)}{shipCut > 0 && <span style={{ color: 'var(--mint-600)', marginLeft: 6 }}>(Freeship −{formatVND(shipCut)})</span>}</span>
                    <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng đơn ({liveV.length} SP): <b style={{ color: 'var(--text-price)', fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{formatVND(Math.max(0, vTotal))}</b></span>
                  </div>
                </div>
              );
            })}

            {/* platform vouchers */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon name="ticket" size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Voucher Genie</span>
                <Badge variant="neutral">Tối đa 1 mỗi loại</Badge>
              </div>
              <div role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={() => setLazOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', background: 'var(--gray-25)', cursor: 'pointer' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: platformVoucher || freeshipVoucher ? 8 : 0 }}>{platformVoucher || freeshipVoucher ? 'Đã chọn Voucher Genie' : 'Chọn mã giảm giá'}</div>
                  {(platformVoucher || freeshipVoucher) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {platformVoucher && <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><Badge variant="primary">Platform</Badge><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span className="code">{platformVoucher.code}</span>: giảm {formatVND(platformDisc)}</span></div>}
                      {freeshipVoucher && <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><Badge variant="mint">Freeship</Badge><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span className="code">{freeshipVoucher.code}</span>: giảm {formatVND(freeshipDisc)} phí ship</span></div>}
                    </div>
                  )}
                </div>
                <Icon name="chevron-right" size={20} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                {extra > 0
                  ? <><Icon name="zap" size={14} style={{ color: 'var(--color-primary)' }} /><span>Có bộ mã tiết kiệm thêm {formatVND(extra)}</span><Button size="sm" variant="outline" style={{ marginLeft: 'auto' }} onClick={() => setVoucherSel(best)}>Áp bộ mã tốt nhất</Button></>
                  : <><Icon name="circle-check" size={14} style={{ color: 'var(--mint-600)' }} /><span>Đang dùng bộ mã giảm nhiều nhất</span></>}
              </div>
            </div>

            {/* Điểm Genie */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gold-50)', color: 'var(--gold-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="star" size={22} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Sử dụng Điểm Genie</span>
                    <Badge variant="neutral">1 Điểm = 1₫</Badge>
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>
                    Đang có <b className="code" style={{ color: 'var(--gold-700)' }}>{coins.toLocaleString('vi-VN')}</b> Điểm · Dùng tối đa 50% tiền hàng ({formatVND(xuCap)})
                  </div>
                </div>
                <Switch aria-label="Dùng Điểm Genie" checked={useXu} onChange={() => setUseXu(!useXu)} disabled={subtotal <= 0} />
              </div>
              {useXu && xuDiscount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 12px', background: 'var(--gold-50)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                  <Icon name="circle-check" size={16} style={{ color: 'var(--gold-600)' }} />
                  Đã áp dụng <b>{xuDiscount.toLocaleString('vi-VN')} Điểm</b>, giảm <b style={{ color: 'var(--text-price)' }}>{formatVND(xuDiscount)}</b> vào đơn hàng.
                </div>
              )}
            </div>

            {/* payment */}
            <div style={card}>
              <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 4 }}>Phương thức thanh toán</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 12 }}><Icon name="shield-check" size={14} style={{ color: 'var(--mint-600)' }} />Với VNPAY và VietQR, Genie giữ tiền đến khi bạn nhận hàng rồi mới chuyển cho shop. Với COD, bạn trả tiền cho nhân viên giao hàng.</div>
              {PAYMENTS.map((m) => (
                <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1.5px solid ' + (pay === m.id ? 'var(--color-primary)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', marginBottom: 8, cursor: m.off ? 'not-allowed' : 'pointer', background: pay === m.id ? 'var(--color-primary-tint)' : '#fff', opacity: m.off ? 0.55 : 1 }}>
                  <Radio name="pay" checked={pay === m.id} disabled={!!m.off} onChange={() => !m.off && setPay(m.id)} />
                  <span style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', flex: 'none' }}>{m.logo ? <img src={'../../assets/payments/' + m.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /> : m.icon ? <Icon name={m.icon} size={26} style={{ color: 'var(--blue-600)' }} /> : <CodLogo />}</span>
                  <span style={{ font: 'var(--weight-medium) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{m.name}{m.off && <span style={{ font: 'var(--type-caption)', color: 'var(--red-600)', marginLeft: 6 }}>{m.off}</span>}</span>
                  {m.meta && <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{m.meta}</span>}
                </label>
              ))}
            </div>
            <window.LZDemoBox title="lỗi thanh toán và hết hàng">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => setOos(!oos)} style={{ width: '100%', border: '1px dashed var(--border-strong)', background: '#fff', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', padding: '10px', font: 'var(--type-caption)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Icon name="refresh-cw" size={13} /> {oos ? 'Khôi phục tồn kho (demo)' : 'Mô phỏng: sản phẩm hết hàng giữa lúc thanh toán'}
                </button>
                <button onClick={() => setSimFail(!simFail)} style={{ width: '100%', border: '1px dashed ' + (simFail ? 'var(--red-300, #F3B0A8)' : 'var(--border-strong)'), background: simFail ? 'var(--red-50)' : '#fff', color: simFail ? 'var(--red-600)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', padding: '10px', font: 'var(--type-caption)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Icon name="triangle-alert" size={13} /> {simFail ? 'Thanh toán sẽ thất bại (demo đang bật)' : 'Mô phỏng: thanh toán thất bại (PAYMENT_FAILED)'}
                </button>
              </div>
            </window.LZDemoBox>
          </div>

          {/* summary */}
          <div style={{ position: 'sticky', top: 96 }}>
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
              {xuDiscount > 0 && <div style={sumRow}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="star" size={13} style={{ color: 'var(--gold-500)' }} />Sử dụng Điểm Genie</span><span style={disc}>−{formatVND(xuDiscount)}</span></div>}
              <div style={{ borderTop: '1px dashed var(--border-default)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: 'var(--weight-semibold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Tổng thanh toán</span>
                <span style={{ font: '800 26px var(--font-sans)', color: 'var(--text-price)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(total)}</span>
              </div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>{groups.length} đơn · {cart.length} sản phẩm</div>
              {pay !== 'cod' && <window.LZHoldNote style={{ marginTop: 14 }}>Genie giữ <b>{formatVND(total)}</b> đến khi bạn nhận hàng.</window.LZHoldNote>}
              <div className="tr-inline-cta"><Button block size="lg" style={{ marginTop: 14 }} disabled={!canPlace} onClick={place}>{placing ? 'Đang xử lý...' : pay === 'cod' ? 'Đặt hàng' : pay === 'vietqr' ? 'Đặt hàng & lấy mã QR' : 'Đặt hàng & thanh toán VNPAY'}</Button></div>
              <p style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', marginTop: 10 }}>Nhấn "Đặt hàng" đồng nghĩa bạn đồng ý với <a href="?screen=page&id=terms" target="_blank" rel="noreferrer">Điều khoản Genie</a></p>
            </div>
          </div>
        </div>

        <div className="tr-paybar">
          <div><small>Tổng thanh toán</small><b>{formatVND(total)}</b></div>
          <Button size="lg" disabled={!canPlace} onClick={place}>{placing ? 'Đang xử lý...' : 'Đặt hàng'}</Button>
        </div>

        {gateway && <window.LZPayGateway amount={total} orders={gateway.orders.length} onCancel={() => setGateway(null)} onPaid={() => { const r = gateway; setGateway(null); onPlaced && onPlaced(r); }} />}
        <window.LZPayModal open={!!qrResult} amount={total} initial="vietqr" code={qrResult ? 'TR' + qrResult.orders[0].id.replace(/\D/g, '') : ''} onClose={() => setQrResult(null)} onPaid={() => onPlaced && onPlaced(qrResult)} />
        {window.LZAddressModal && <window.LZAddressModal open={addrOpen} onClose={() => setAddrOpen(false)} selectedId={addr.id} onSelect={setAddr} />}
        <window.LZVoucherPicker open={lazOpen} onClose={() => setLazOpen(false)} title="Chọn Voucher Genie" lines={live} selected={voucherSel}
          onConfirm={(r) => setVoucherSel((s) => ({ ...s, ...r }))} />
        <window.LZVoucherPicker open={!!shopPicker} onClose={() => setShopPicker(null)} title="Chọn Voucher của Shop" mode="shop" vendorId={shopPicker}
          lines={live.filter((l) => l.vendorId === shopPicker)} selected={{ shop: shopPicker && (voucherSel.shop || {})[shopPicker] }}
          onConfirm={(r) => setVoucherSel((s) => ({ ...s, shop: { ...(s.shop || {}), [shopPicker]: r.shop } }))} />
      </div>
    );
  }

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 14, boxShadow: 'var(--shadow-sm)' };
  const voucherRow = { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-25)', borderRadius: 'var(--radius-md)', padding: '9px 12px', font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer' };
  const sumRow = { display: 'flex', justifyContent: 'space-between', font: 'var(--type-body-sm)', color: 'var(--text-muted)', padding: '4px 0' };
  const disc = { color: 'var(--mint-600)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 };

  window.LZCheckout = Checkout;
})();
