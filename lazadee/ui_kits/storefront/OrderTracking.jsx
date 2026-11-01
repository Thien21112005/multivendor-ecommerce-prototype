/* Lazadee order tracking — lifecycle stepper (order status ENUM), 3PL carrier +
   tracking_code, escrow release note (+72h), append-only shipment_events timeline,
   address snapshot, and the return/refund request flow with proof media (UC-9). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, StatusBadge, VendorChip, Modal, Checkbox, Select } = DS;
  const { ORDERS, V } = window.LZ;
  const fmt = (n) => (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('vi-VN') + '₫';

  const STEPS = [
    { key: 'placed', label: 'Đặt hàng', icon: 'file-text' },
    { key: 'paid', label: 'Đã thanh toán', icon: 'wallet' },
    { key: 'prep', label: 'Chờ lấy hàng', icon: 'package' },
    { key: 'ship', label: 'Đang vận chuyển', icon: 'truck' },
    { key: 'delivered', label: 'Đã giao', icon: 'house' },
    { key: 'completed', label: 'Hoàn thành', icon: 'badge-check' },
  ];
  const STEP_OF = { PENDING_PAYMENT: 0, PAID: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4, COMPLETED: 5, CANCELLED: 1, REFUNDED: 1 };
  const STATUS_VI = { PAID: 'Đã thanh toán', PROCESSING: 'Đang chuẩn bị', SHIPPED: 'Đang giao', DELIVERED: 'Đã giao', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã huỷ', REFUNDED: 'Đã hoàn tiền' };
  const EV_ICON = { PAID: 'wallet', PROCESSING: 'package', AWAITING_PICKUP: 'package', PICKED_UP: 'truck', IN_TRANSIT: 'truck', OUT_FOR_DELIVERY: 'truck', DELIVERED: 'circle-check' };
  const CARRIER_LABEL = {
    GHN: 'Giao Hàng Nhanh',
    GHTK: 'Giao Hàng Tiết Kiệm',
    ViettelPost: 'ViettelPost',
    JT_EXPRESS: 'J&T Express',
    LAZADEE_EXPRESS: 'Lazadee Express (FBL)',
  };

  function OrderTracking({ orderId, onBack, onChat, onReview }) {
    const order = (ORDERS.find((o) => o.id === orderId)) || ORDERS.find((o) => o.status === 'SHIPPED') || ORDERS[0];
    const [status, setStatus] = React.useState(order.status);
    const [returnOpen, setReturnOpen] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const v = V[order.vendorId];
    const tr = order.tracking;
    const step = STEP_OF[status];

    const copy = () => { try { navigator.clipboard.writeText(tr.code); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 1500); };

    return (
      <div style={{ background: 'var(--surface-page)', minHeight: '100%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 56px' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer', padding: 0 }}><Icon name="arrow-left" size={18} /> Đơn mua</button>
            <span style={{ width: 1, height: 16, background: 'var(--border-strong)' }} />
            <span style={{ font: 'var(--weight-semibold) var(--text-md) var(--font-sans)', color: 'var(--text-strong)' }}>Mã đơn</span>
            <span className="code" style={{ font: '14px var(--font-mono)', color: 'var(--text-body)' }}>{order.id}</span>
            <span style={{ marginLeft: 'auto' }}><StatusBadge status={status} label={STATUS_VI[status]} /></span>
          </div>

          {/* stepper */}
          <section style={{ ...card, padding: '28px 28px 24px' }}>
            <div style={{ display: 'flex', position: 'relative' }}>
              {STEPS.map((s, i) => {
                const done = i < step, cur = i === step;
                const color = done ? 'var(--mint-500)' : cur ? 'var(--orange-500)' : 'var(--gray-300)';
                return (
                  <div key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {i < STEPS.length - 1 && <div style={{ position: 'absolute', top: 22, left: '50%', width: '100%', height: 3, background: i < step ? 'var(--mint-500)' : 'var(--gray-200)' }} />}
                    <div style={{ width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center', background: done ? 'var(--mint-500)' : cur ? 'var(--orange-500)' : '#fff', color: done || cur ? '#fff' : 'var(--text-subtle)', border: done || cur ? 'none' : '2px solid var(--gray-200)', position: 'relative', zIndex: 2, boxShadow: cur ? 'var(--shadow-sm)' : 'none' }}>
                      <Icon name={done ? 'check' : s.icon} size={done ? 20 : 19} strokeWidth={done ? 3 : 2} />
                    </div>
                    <div style={{ font: cur ? 'var(--weight-bold) var(--text-sm) var(--font-sans)' : 'var(--type-body-sm)', color: cur ? 'var(--text-strong)' : done ? 'var(--text-body)' : 'var(--text-subtle)', marginTop: 10, textAlign: 'center' }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 18, marginTop: 18, alignItems: 'start' }}>

            {/* ---- Left: carrier + escrow + timeline ---- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
              {tr && (
                <section style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--ink-900)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="truck" size={22} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: 'var(--weight-bold) var(--text-md) var(--font-sans)', color: 'var(--text-strong)' }}>{CARRIER_LABEL[tr.carrier] || tr.carrier}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Mã vận đơn:</span>
                        <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-body)' }}>{tr.code}</span>
                        <button onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 0, background: 'transparent', color: 'var(--orange-600)', font: '600 12px var(--font-sans)', cursor: 'pointer' }}><Icon name={copied ? 'check' : 'copy'} size={13} />{copied ? 'Đã chép' : 'Sao chép'}</button>
                      </div>
                    </div>
                    {tr.eta && <div style={{ textAlign: 'right' }}><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{tr.deliveredAt ? 'Đã giao lúc' : 'Dự kiến giao'}</div><div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: tr.deliveredAt ? 'var(--mint-600)' : 'var(--text-strong)' }}>{tr.deliveredAt || tr.eta}</div></div>}
                  </div>
                </section>
              )}

              {/* escrow note */}
              <div style={{ display: 'flex', gap: 11, padding: '14px 16px', background: status === 'COMPLETED' ? 'var(--mint-50)' : 'var(--blue-50)', border: `1px solid ${status === 'COMPLETED' ? 'var(--mint-200)' : 'var(--blue-200)'}`, borderRadius: 'var(--radius-md)' }}>
                <Icon name={status === 'COMPLETED' ? 'badge-check' : 'shield-check'} size={20} style={{ color: status === 'COMPLETED' ? 'var(--mint-600)' : 'var(--blue-600)', flex: 'none', marginTop: 1 }} />
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  {status === 'COMPLETED'
                    ? <>Đơn đã <b>hoàn thành</b>. Tiền trong escrow đã được giải ngân cho người bán (sau khi trừ hoa hồng sàn).</>
                    : status === 'DELIVERED'
                      ? <>Tiền đang được <b>giữ tạm (escrow)</b>. Bấm <b>"Đã nhận hàng"</b> để giải ngân cho người bán, hoặc hệ thống tự hoàn tất sau <b>72 giờ</b> (vào {tr && tr.releaseAt ? tr.releaseAt : 'sau 3 ngày'}) nếu không có yêu cầu trả hàng.</>
                      : <>Thanh toán của bạn đang được <b>giữ tạm trong escrow</b> và chỉ chuyển cho người bán sau khi bạn xác nhận đã nhận hàng — đảm bảo an toàn cho giao dịch.</>}
                </div>
              </div>

              {/* timeline */}
              {tr && tr.events && tr.events.length > 0 && (
                <section style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Icon name="map-pin" size={19} style={{ color: 'var(--orange-500)' }} />
                    <h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: 0 }}>Hành trình đơn hàng</h2>
                  </div>
                  <div>
                    {tr.events.map((e, i) => {
                      const first = i === 0;
                      return (
                        <div key={i} style={{ display: 'flex', gap: 14 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', background: first ? 'var(--mint-50)' : 'var(--surface-sunken)', color: first ? 'var(--mint-600)' : 'var(--text-subtle)', border: first ? '2px solid var(--mint-500)' : '2px solid var(--border-default)' }}><Icon name={EV_ICON[e.status] || 'package'} size={15} /></div>
                            {i < tr.events.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 26, background: 'var(--border-default)' }} />}
                          </div>
                          <div style={{ paddingBottom: 20, flex: 1 }}>
                            <div style={{ font: first ? 'var(--weight-semibold) var(--text-sm) var(--font-sans)' : 'var(--type-body-sm)', color: first ? 'var(--text-strong)' : 'var(--text-body)' }}>{e.label}</div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 2, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="clock" size={12} />{e.at}</span>
                              {e.location && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12} />{e.location}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* ---- Right: address, items, summary, actions ---- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <section style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Icon name="map-pin" size={18} style={{ color: 'var(--orange-500)' }} /><span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Địa chỉ nhận hàng</span></div>
                <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{order.address.recipient} · {order.address.phone}</div>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{order.address.line}, {order.address.ward}, {order.address.district}, {order.address.city}</div>
              </section>

              <section style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 4, borderBottom: '1px solid var(--border-subtle)' }}>
                  <VendorChip name={v.name} mall={v.mall} />
                  <Button size="sm" variant="ghost" iconLeft="message-circle" style={{ marginLeft: 'auto' }} onClick={() => onChat && onChat(order.id)}>Chat</Button>
                </div>
                {order.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border-subtle)' : 0 }}>
                    <img src={it.img} alt="" width="52" height="52" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none', border: '1px solid var(--border-subtle)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{it.variant} · x{it.qty}</div>
                    </div>
                    <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-price)', flex: 'none' }}>{fmt(it.price)}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 12 }}>
                  <Row label="Tổng tiền hàng" value={fmt(order.subtotal)} />
                  <Row label="Phí vận chuyển" value={fmt(order.shipping)} />
                  {order.discount > 0 && <Row label="Giảm giá voucher" value={'-' + fmt(order.discount)} green />}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 8, marginTop: 4, borderTop: '1px dashed var(--border-strong)' }}>
                    <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Thành tiền</span>
                    <span style={{ font: '800 22px var(--font-sans)', color: 'var(--text-price)' }}>{fmt(order.total)}</span>
                  </div>
                </div>
              </section>

              {/* actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {status === 'DELIVERED' && <>
                  <Button block size="lg" iconLeft="check" onClick={() => setStatus('COMPLETED')}>Đã nhận hàng</Button>
                  <Button block variant="outline" iconLeft="undo-2" onClick={() => setReturnOpen(true)}>Yêu cầu Trả hàng / Hoàn tiền</Button>
                </>}
                {status === 'SHIPPED' && <Button block variant="outline" iconLeft="map-pin" disabled>Đang trên đường giao đến bạn</Button>}
                {(status === 'PAID' || status === 'PROCESSING') && <Button block variant="outline" iconLeft="clock" disabled>Người bán đang chuẩn bị hàng</Button>}
                {status === 'COMPLETED' && <>
                  <Button block size="lg" iconLeft="star" onClick={() => onReview && onReview(order.id)}>Đánh giá sản phẩm</Button>
                  <Button block variant="outline" iconLeft="shopping-cart">Mua lại</Button>
                </>}
                {status === 'REFUNDED' && order.refund && <div style={{ ...card, padding: '14px 16px' }}><div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Đã hoàn tiền {fmt(order.refund.amount)}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>Lý do: {order.refund.reason} · {order.refund.resolvedAt}</div></div>}
              </div>
            </div>
          </div>
        </div>

        <ReturnModal open={returnOpen} onClose={() => setReturnOpen(false)} order={order} onSubmit={() => { setReturnOpen(false); setStatus('REFUNDED'); }} />
      </div>
    );
  }

  function ReturnModal({ open, onClose, order, onSubmit }) {
    const [sel, setSel] = React.useState(() => order.items.map((_, i) => i));
    const toggle = (i) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
    const refundAmt = order.items.reduce((n, it, i) => (sel.includes(i) ? n + it.price * it.qty : n), 0);
    return (
      <Modal open={open} onClose={onClose} title="Yêu cầu Trả hàng / Hoàn tiền"
        footer={<><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="undo-2" disabled={sel.length === 0} onClick={onSubmit}>Gửi yêu cầu</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 'min(560px, 80vw)' }}>
          <div>
            <label style={lab}>Chọn sản phẩm cần trả</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {order.items.map((it, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer' }}>
                  <Checkbox checked={sel.includes(i)} onChange={() => toggle(i)} />
                  <img src={it.img} alt="" width="40" height="40" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />
                  <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</span>
                  <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-price)' }}>{fmt(it.price)}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label style={lab}>Lý do trả hàng</label>
            <div style={{ marginTop: 6 }}>
              <Select>
                <option>Hàng không đúng mô tả</option>
                <option>Hàng bị lỗi / hư hỏng</option>
                <option>Giao sai sản phẩm / sai phân loại</option>
                <option>Thiếu sản phẩm / phụ kiện</option>
                <option>Khác</option>
              </Select>
            </div>
          </div>
          <div>
            <label style={lab}>Bằng chứng (ảnh / video)</label>
            <div style={{ marginTop: 6, border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '22px 16px', textAlign: 'center', background: 'var(--surface-sunken)' }}>
              <Icon name="upload" size={26} style={{ color: 'var(--text-subtle)' }} />
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 6 }}>Kéo thả hoặc bấm để tải lên · tối đa 10MB / tệp (JPG, PNG, MP4)</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--orange-50)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Số tiền hoàn dự kiến</span>
            <span style={{ font: '800 20px var(--font-sans)', color: 'var(--text-price)' }}>{fmt(refundAmt)}</span>
          </div>
          <div style={{ display: 'flex', gap: 9, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <Icon name="shield-check" size={16} style={{ color: 'var(--blue-600)', flex: 'none', marginTop: 1 }} />
            Yêu cầu sẽ được Bộ phận hỗ trợ Lazadee xem xét. Trong thời gian này, tiền vẫn được giữ trong escrow và chưa giải ngân cho người bán.
          </div>
        </div>
      </Modal>
    );
  }

  function Row({ label, value, green }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-body-sm)' }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color: green ? 'var(--mint-600)' : 'var(--text-body)', fontWeight: 500 }}>{value}</span>
      </div>
    );
  }

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', padding: 20 };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' };

  window.LZOrderTracking = OrderTracking;
})();
