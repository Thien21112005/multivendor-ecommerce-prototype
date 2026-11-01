/* Lazadee multi-vendor cart: grouped by vendor, per-vendor subtotals & shipping,
   bulk delete, stock-limit warning, change-variant popup, voucher pickers and Xu toggle.
   Discounts come from LZ.priceCart, shared with Checkout. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Checkbox, Badge, PriceVND, QuantityStepper, Money, Modal, Switch } = DS;
  const formatVND = Money.format;
  const { V } = window.LZ;

  function Cart({ cart, setCart, onCheckout, onContinue, onOpen, onShop, onChat, voucherSel, setVoucherSel, useXu, setUseXu, buyNowKey, clearBuyNow }) {
    const LZ = window.LZ;
    const [selected, setSelected] = React.useState(() => new Set(buyNowKey ? [buyNowKey] : cart.map((l) => l.key)));
    const [confirm, setConfirm] = React.useState(null); // { title, message, danger, onYes }
    const [variantItem, setVariantItem] = React.useState(null);
    const [lazOpen, setLazOpen] = React.useState(false);
    const [shopPicker, setShopPicker] = React.useState(null); // vendorId
    React.useEffect(() => { if (buyNowKey && clearBuyNow) clearBuyNow(); }, []);

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
    const dropKeys = (keys) => {
      setCart((c) => c.filter((l) => !keys.includes(l.key)));
      setSelected((s) => { const n = new Set(s); keys.forEach((k) => n.delete(k)); return n; });
    };
    const askRemove = (k) => setConfirm({ title: 'Xóa sản phẩm', message: 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?', danger: true, onYes: () => dropKeys([k]) });
    const askRemoveSelected = () => setConfirm({ title: 'Xóa sản phẩm', message: `Bạn có chắc muốn xóa ${selected.size} sản phẩm đã chọn khỏi giỏ hàng?`, danger: true, onYes: () => dropKeys([...selected]) });
    const setQty = (l, q) => {
      if (q <= 0) { setConfirm({ title: 'Xóa sản phẩm', message: 'Bạn có muốn xóa sản phẩm này ra khỏi giỏ hàng không?', danger: true, onYes: () => dropKeys([l.key]) }); return; }
      if (l.stock && q > l.stock) { setConfirm({ title: 'Số lượng vượt giới hạn', message: `Sản phẩm này chỉ còn ${l.stock} sản phẩm trong kho.`, onYes: () => {} }); return; }
      setCart((c) => c.map((x) => (x.key === l.key ? { ...x, qty: q } : x)));
    };

    const selLines = cart.filter((l) => selected.has(l.key));
    const price = LZ.priceCart(selLines, voucherSel, useXu);
    const allSelected = cart.length > 0 && selected.size === cart.length;
    const xuUsable = Math.min(LZ.USER.coins || 0, price.xuCap);

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
          const shopCut = price.shopByVendor[vid] || 0;
          const lineCut = vSel.reduce((n, l) => n + (price.perLine[l.key] || 0), 0);
          return (
            <div key={vid} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                <Checkbox checked={lines.every((l) => selected.has(l.key))} onChange={() => toggleVendor(vid, lines)} />
                <Icon name="store" size={16} style={{ color: 'var(--color-primary)' }} />
                <span onClick={() => onShop && onShop(vid)} style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', cursor: 'pointer' }}>{vendor.name}</span>
                {vendor.mall && <Badge variant="solid">MALL</Badge>}
                <button style={chatBtn} onClick={() => onChat && onChat(vid, lines[0])}><Icon name="message-circle" size={14} /> Chat</button>
                <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Một đơn riêng · Phí ship {formatVND(vendor.ship)}</span>
              </div>
              {lines.map((l) => (
                <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <Checkbox checked={selected.has(l.key)} onChange={() => toggle(l.key)} />
                  <img src={l.img} onClick={() => onOpen(l.productId)} style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', objectFit: 'cover', cursor: 'pointer', flex: 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div onClick={() => onOpen(l.productId)} style={{ font: 'var(--type-body)', color: 'var(--text-body)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', cursor: 'pointer' }}>{l.title}</div>
                    {l.snapshot && l.snapshot !== l.price && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '3px 9px', borderRadius: 'var(--radius-pill)', background: l.price > l.snapshot ? 'var(--red-50, #FDECEA)' : 'var(--mint-50)', color: l.price > l.snapshot ? 'var(--red-600)' : 'var(--mint-600)', font: '600 12px var(--font-sans)' }}>
                        <Icon name={l.price > l.snapshot ? 'triangle-alert' : 'arrow-up-right'} size={13} style={{ transform: l.price > l.snapshot ? 'none' : 'rotate(90deg)' }} />
                        Giá đã {l.price > l.snapshot ? 'tăng' : 'giảm'} so với lúc thêm vào giỏ
                      </div>
                    )}
                    <div onClick={() => setVariantItem(l)} style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: 4, marginTop: 6, font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--gray-50)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Phân loại: {l.variant} <Icon name="chevron-down" size={12} /></div>
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
                  <QuantityStepper value={l.qty} min={0} max={(l.stock || 99) + 1} onChange={(q) => setQty(l, q)} />
                  <div style={{ width: 120, textAlign: 'right' }}>
                    <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-price)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(l.price * l.qty)}</div>
                    {selected.has(l.key) && price.perLine[l.key] > 0 && <div style={{ font: 'var(--type-caption)', color: 'var(--mint-600)', marginTop: 3 }}>−{formatVND(price.perLine[l.key])}</div>}
                  </div>
                  <button onClick={() => askRemove(l.key)} style={{ border: 0, background: 'transparent', color: 'var(--text-subtle)', cursor: 'pointer', padding: 8 }} aria-label="Xoá"><Icon name="trash-2" size={18} /></button>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', background: 'var(--gray-25)' }}>
                <Icon name="ticket" size={16} style={{ color: 'var(--color-primary)' }} />
                <span onClick={() => setShopPicker(vid)} style={{ font: 'var(--type-body-sm)', color: 'var(--text-link)', cursor: 'pointer', fontWeight: 600 }}>Thêm voucher của Shop {shopCut > 0 && <span style={{ color: 'var(--color-primary)' }}>(−{formatVND(shopCut)})</span>}</span>
                <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tạm tính ({vSel.length}): <b style={{ color: 'var(--text-price)' }}>{formatVND(Math.max(0, vSub - shopCut - lineCut))}</b></span>
              </div>
            </div>
          );
        })}

        {/* sticky summary — pins to viewport bottom while the cart is long,
            then rests above the footer when scrolled to the end (no overlap) */}
        <div style={{ position: 'sticky', bottom: 0, zIndex: 90, marginTop: 16, marginLeft: -24, marginRight: -24, background: '#fff', borderTop: '1px solid var(--border-default)', boxShadow: '0 -4px 16px rgba(26,24,21,.06)' }}>
          <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <Checkbox checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(cart.map((l) => l.key)))}>Chọn tất cả ({cart.length})</Checkbox>
            {selected.size > 0 && <button onClick={askRemoveSelected} style={{ border: 0, background: 'transparent', color: 'var(--red-600)', font: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', padding: '4px 0' }}>Xóa {selected.size} sản phẩm</button>}
            <div onClick={() => setLazOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-link)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>
              <Icon name="ticket" size={15} /> Lazadee Voucher {price.platformDisc > 0 && <b style={{ color: 'var(--color-primary)' }}>(−{formatVND(price.platformDisc)})</b>}{price.freeshipDisc > 0 && <b style={{ color: 'var(--mint-600)' }}>+ Freeship</b>}
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-link)', font: 'var(--type-body-sm)', opacity: xuUsable > 0 ? 1 : 0.4, whiteSpace: 'nowrap' }}>
              <Icon name="star" size={15} style={{ color: 'var(--gold-500)' }} /> Dùng {xuUsable.toLocaleString('vi-VN')} Xu
              <Switch checked={useXu && xuUsable > 0} disabled={xuUsable <= 0} onChange={() => setUseXu(!useXu)} />
            </label>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{groups.filter(([vid, ls]) => ls.some((l) => selected.has(l.key))).length} đơn · gồm phí ship {formatVND(price.shipping)}{price.discountTotal > 0 ? ` · giảm ${formatVND(price.discountTotal)}` : ''}</div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Tổng thanh toán ({selLines.length} sản phẩm): <span style={{ font: '800 26px var(--font-sans)', color: 'var(--text-price)', verticalAlign: 'middle', marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>{formatVND(price.total)}</span></div>
            </div>
            <Button size="lg" disabled={selLines.length === 0} onClick={() => onCheckout(selLines.map((l) => l.key))} style={{ minWidth: 200 }}>Mua hàng ({selLines.length})</Button>
            </div>
          </div>
        </div>

        <Modal open={!!confirm} onClose={() => setConfirm(null)} width={400} title={confirm && confirm.title}
          footer={<><Button variant="ghost" onClick={() => setConfirm(null)}>Hủy</Button><Button variant={confirm && confirm.danger ? 'danger' : 'primary'} onClick={() => { confirm.onYes(); setConfirm(null); }}>{confirm && confirm.danger ? 'Xóa' : 'Đồng ý'}</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{confirm && confirm.message}</div>
        </Modal>

        <window.LZVoucherPicker open={lazOpen} onClose={() => setLazOpen(false)} title="Chọn Lazadee Voucher" lines={selLines} selected={voucherSel}
          onConfirm={(r) => setVoucherSel((s) => ({ ...s, ...r }))} />
        <window.LZVoucherPicker open={!!shopPicker} onClose={() => setShopPicker(null)} title="Chọn Voucher của Shop" mode="shop" vendorId={shopPicker}
          lines={selLines.filter((l) => l.vendorId === shopPicker)} selected={{ shop: shopPicker && (voucherSel.shop || {})[shopPicker] }}
          onConfirm={(r) => setVoucherSel((s) => ({ ...s, shop: { ...(s.shop || {}), [shopPicker]: r.shop } }))} />
        {variantItem && <VariantModal item={variantItem} onClose={() => setVariantItem(null)} onConfirm={(variant, stock) => {
          const key = variantItem.productId + '|' + variant;
          setCart((c) => {
            const twin = c.find((x) => x.key === key && x.key !== variantItem.key);
            if (twin) return c.filter((x) => x.key !== variantItem.key).map((x) => (x.key === key ? { ...x, qty: x.qty + variantItem.qty } : x));
            return c.map((x) => (x.key === variantItem.key ? { ...x, key, variant, stock } : x));
          });
          setSelected((s) => { const n = new Set(s); if (n.delete(variantItem.key)) n.add(key); return n; });
          setVariantItem(null);
        }} />}
      </div>
    );
  }

  function VariantModal({ item, onClose, onConfirm }) {
    const groups = window.LZ.variantOptions(window.LZ.byId(item.productId));
    const parts = String(item.variant).split(' / ');
    const [pick, setPick] = React.useState(() => Object.fromEntries(groups.map((g, i) => [g.key, g.values.includes(parts[i]) ? parts[i] : null])));
    const done = groups.every((g) => pick[g.key]);
    const label = groups.map((g) => pick[g.key]).join(' / ');
    const stock = done ? 20 + label.length : item.stock;
    return (
      <Modal open onClose={onClose} title="Chọn phân loại" width={460}
        footer={<><Button variant="ghost" onClick={onClose}>Trở lại</Button><Button disabled={!done} onClick={() => onConfirm(label, stock)}>Xác nhận</Button></>}>
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <img src={item.img} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            <div>
              <div style={{ font: '600 18px var(--font-sans)', color: 'var(--text-price)' }}>{formatVND(item.price)}</div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Kho: {stock}</div>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.key} style={{ marginBottom: 16 }}>
              <div style={{ font: '500 14px var(--font-sans)', marginBottom: 8, color: 'var(--text-body)' }}>{g.key}:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {g.values.map((v) => {
                  const on = pick[g.key] === v;
                  return <button key={v} onClick={() => setPick((p) => ({ ...p, [g.key]: on ? null : v }))} style={{ padding: '6px 12px', background: on ? 'var(--color-primary-tint)' : 'var(--gray-50)', border: '1px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), color: on ? 'var(--color-primary)' : 'var(--text-body)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', font: 'var(--type-body-sm)' }}>{v}</button>;
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }

  const chatBtn = { display: 'inline-flex', alignItems: 'center', gap: 4, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-caption)', cursor: 'pointer' };

  window.LZCart = Cart;
})();
