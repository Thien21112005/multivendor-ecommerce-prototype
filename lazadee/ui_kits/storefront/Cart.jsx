/* Lazadee multi-vendor cart: grouped by vendor, per-vendor subtotals & shipping. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Checkbox, Badge, PriceVND, QuantityStepper, VendorChip, Money } = DS;
  const formatVND = Money.format;
  const { V } = window.LZ;

  function Cart({ cart, setCart, onCheckout, onContinue, onOpen }) {
    const [selected, setSelected] = React.useState(() => new Set(cart.map((l) => l.key)));
    const groups = React.useMemo(() => {
      const m = {};
      cart.forEach((l) => { (m[l.vendorId] = m[l.vendorId] || []).push(l); });
      return Object.entries(m);
    }, [cart]);

    const toggle = (k) => setSelected((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
    const toggleVendor = (vid, lines) => setSelected((s) => {
      const n = new Set(s); const all = lines.every((l) => n.has(l.key));
      lines.forEach((l) => all ? n.delete(l.key) : n.add(l.key)); return n;
    });
    const setQty = (k, q) => setCart((c) => c.map((l) => (l.key === k ? { ...l, qty: q } : l)));
    const remove = (k) => { setCart((c) => c.filter((l) => l.key !== k)); setSelected((s) => { const n = new Set(s); n.delete(k); return n; }); };

    const selLines = cart.filter((l) => selected.has(l.key));
    const subtotal = selLines.reduce((n, l) => n + l.price * l.qty, 0);
    const shipping = groups.reduce((n, [vid, lines]) => (lines.some((l) => selected.has(l.key)) ? n + V[vid].ship : n), 0);
    const total = subtotal + shipping;
    const allSelected = cart.length > 0 && selected.size === cart.length;

    if (cart.length === 0) return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '90px 24px', textAlign: 'center' }}>
        <Icon name="shopping-cart" size={56} style={{ color: 'var(--text-subtle)', margin: '0 auto 16px' }} />
        <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', marginBottom: 8 }}>Giỏ hàng trống</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 22 }}>Hãy khám phá hàng triệu sản phẩm với giá tốt nhất.</p>
        <Button onClick={onContinue} iconLeft="house">Tiếp tục mua sắm</Button>
      </div>
    );

    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px 0' }}>
        <h1 style={{ font: 'var(--type-h2)', color: 'var(--text-strong)', marginBottom: 16 }}>Giỏ hàng <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 18 }}>({cart.length} sản phẩm)</span></h1>

        {groups.map(([vid, lines]) => {
          const vendor = V[vid];
          const vSel = lines.filter((l) => selected.has(l.key));
          const vSub = vSel.reduce((n, l) => n + l.price * l.qty, 0);
          return (
            <div key={vid} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                <Checkbox checked={lines.every((l) => selected.has(l.key))} onChange={() => toggleVendor(vid, lines)} />
                <Icon name="store" size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{vendor.name}</span>
                {vendor.mall && <Badge variant="solid">MALL</Badge>}
                <button style={chatBtn}><Icon name="message-circle" size={14} /> Chat</button>
                <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Một đơn riêng · Phí ship {formatVND(vendor.ship)}</span>
              </div>
              {lines.map((l) => (
                <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <Checkbox checked={selected.has(l.key)} onChange={() => toggle(l.key)} />
                  <img src={l.img} onClick={() => onOpen(l.productId)} style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', objectFit: 'cover', cursor: 'pointer', flex: 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{l.title}</div>
                    {l.snapshot && l.snapshot !== l.price && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '3px 9px', borderRadius: 'var(--radius-pill)', background: l.price > l.snapshot ? 'var(--red-50, #FDECEA)' : 'var(--mint-50)', color: l.price > l.snapshot ? 'var(--red-600)' : 'var(--mint-600)', font: '600 12px var(--font-sans)' }}>
                        <Icon name={l.price > l.snapshot ? 'triangle-alert' : 'arrow-up-right'} size={13} style={{ transform: l.price > l.snapshot ? 'none' : 'rotate(90deg)' }} />
                        Giá đã {l.price > l.snapshot ? 'tăng' : 'giảm'} so với lúc thêm vào giỏ
                      </div>
                    )}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--gray-50)', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>Phân loại: {l.variant} <Icon name="chevron-down" size={12} /></div>
                  </div>
                  <div style={{ width: 138, textAlign: 'right' }}>
                    {l.snapshot && l.snapshot !== l.price
                      ? <div>
                          <PriceVND amount={l.price} size="sm" />
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textDecoration: 'line-through', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{formatVND(l.snapshot)}</div>
                          <div style={{ font: '600 11px var(--font-sans)', color: 'var(--text-subtle)' }}>Giá lúc thêm</div>
                        </div>
                      : <PriceVND amount={l.price} original={l.original} size="sm" />}
                  </div>
                  <QuantityStepper value={l.qty} min={1} max={l.stock} onChange={(q) => setQty(l.key, q)} />
                  <div style={{ width: 120, textAlign: 'right', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-price)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(l.price * l.qty)}</div>
                  <button onClick={() => remove(l.key)} style={{ border: 0, background: 'transparent', color: 'var(--text-subtle)', cursor: 'pointer', padding: 8 }} aria-label="Xoá"><Icon name="trash-2" size={18} /></button>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', background: 'var(--gray-25)' }}>
                <Icon name="ticket" size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-link)', cursor: 'pointer', fontWeight: 600 }}>Thêm voucher của Shop</span>
                <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tạm tính ({vSel.length}): <b style={{ color: 'var(--text-price)' }}>{formatVND(vSub)}</b></span>
              </div>
            </div>
          );
        })}

        {/* sticky summary — pins to viewport bottom while the cart is long,
            then rests above the footer when scrolled to the end (no overlap) */}
        <div style={{ position: 'sticky', bottom: 0, zIndex: 90, marginTop: 16, marginLeft: -24, marginRight: -24, background: '#fff', borderTop: '1px solid var(--border-default)', boxShadow: '0 -4px 16px rgba(26,24,21,.06)' }}>
          <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <Checkbox checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(cart.map((l) => l.key)))}>Chọn tất cả ({cart.length})</Checkbox>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-link)', font: 'var(--type-body-sm)', cursor: 'pointer' }}><Icon name="ticket" size={15} /> Lazadee Voucher</div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{groups.filter(([vid, ls]) => ls.some((l) => selected.has(l.key))).length} đơn · gồm phí ship {formatVND(shipping)}</div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Tổng thanh toán ({selLines.length} sản phẩm): <span style={{ font: '800 26px var(--font-sans)', color: 'var(--text-price)', verticalAlign: 'middle', marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>{formatVND(total)}</span></div>
            </div>
            <Button size="lg" disabled={selLines.length === 0} onClick={onCheckout} style={{ minWidth: 200 }}>Mua hàng ({selLines.length})</Button>
          </div>
        </div>
      </div>
    );
  }

  const chatBtn = { display: 'inline-flex', alignItems: 'center', gap: 4, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-caption)', cursor: 'pointer' };

  window.LZCart = Cart;
})();
