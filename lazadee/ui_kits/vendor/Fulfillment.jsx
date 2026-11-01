/* Vendor: order fulfillment — prepare PAID orders, request 3PL pickup,
   generate + print waybill with tracking code. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Modal, Money, Tabs } = DS;
  const formatVND = Money.format;

  const ORDERS = [
    { id: 'ORD-2412-0041', customer: 'Trần Thị Mai', addr: 'Q1, TP.HCM', items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000], ['Serum Vitamin C', '30ml', 1, 178000]], total: 778000, status: 'PAID' },
    { id: 'ORD-2412-0040', customer: 'Nguyễn Văn An', addr: 'Cầu Giấy, Hà Nội', items: [['Đồng hồ Watch S2', 'Navy', 1, 690000]], total: 690000, status: 'PAID' },
    { id: 'ORD-2412-0038', customer: 'Lê Hoàng Phúc', addr: 'Hải Châu, Đà Nẵng', items: [['Bàn phím cơ RGB', 'Đen/Blue', 1, 459000]], total: 459000, status: 'SHIPPED', waybill: 'VN931042771', carrier: 'Lazadee Express' },
  ];

  function Fulfillment() {
    const [tab, setTab] = React.useState('PAID');
    const [waybill, setWaybill] = React.useState(null); // order being shipped
    const [shipped, setShipped] = React.useState({});
    const list = ORDERS.filter((o) => (tab === 'PAID' ? (o.status === 'PAID' && !shipped[o.id]) : tab === 'SHIPPED' ? (o.status === 'SHIPPED' || shipped[o.id]) : true));

    return (
      <div style={{ maxWidth: 1180 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { id: 'PAID', label: 'Chờ chuẩn bị', badge: ORDERS.filter((o) => o.status === 'PAID' && !shipped[o.id]).length },
          { id: 'SHIPPED', label: 'Đang giao' }, { id: 'ALL', label: 'Tất cả' },
        ]} />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((o) => {
            const isShipped = o.status === 'SHIPPED' || shipped[o.id];
            return (
              <div key={o.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--gray-25)' }}>
                  <span className="code" style={{ font: '13px var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{o.id}</span>
                  <StatusBadge status={isShipped ? 'SHIPPED' : 'PAID'} />
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={o.customer} size={26} /><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{o.customer} · {o.addr}</span>
                  </span>
                </div>
                <div style={{ padding: '14px 18px' }}>
                  {o.items.map(([n, v, q, p], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                      <Icon name="package" size={15} style={{ color: 'var(--text-subtle)' }} />
                      <span style={{ flex: 1 }}>{n} <span style={{ color: 'var(--text-muted)' }}>· {v}</span></span>
                      <span style={{ color: 'var(--text-muted)' }}>x{q}</span>
                      <span style={{ width: 110, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{formatVND(p)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
                  {isShipped ? (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Badge variant="mint" icon="truck">{o.carrier || 'Lazadee Express'}</Badge>
                        <span style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)', paddingLeft: 2 }}>Dịch vụ vận chuyển nội bộ Lazadee</span>
                      </div>
                      <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-body)' }}>Mã VĐ: {o.waybill || 'VN' + Math.floor(900000000 + Math.random() * 99999999)}</span>
                      <Button variant="ghost" size="sm" iconLeft="printer" style={{ marginLeft: 'auto' }} onClick={() => setWaybill(o)}>In lại vận đơn</Button>
                    </>
                  ) : (
                    <>
                      <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng đơn: <b style={{ color: 'var(--text-price)' }}>{formatVND(o.total)}</b></span>
                      <Button size="sm" iconLeft="truck" style={{ marginLeft: 'auto' }} onClick={() => setWaybill(o)}>Yêu cầu lấy hàng (3PL)</Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* waybill modal */}
        <Modal open={!!waybill} onClose={() => setWaybill(null)} width={420} title="Vận đơn 3PL"
          footer={waybill && <>
            <Button variant="ghost" onClick={() => setWaybill(null)}>Đóng</Button>
            <Button iconLeft="printer" onClick={() => { setShipped((s) => ({ ...s, [waybill.id]: true })); setWaybill(null); }}>In & xác nhận giao</Button>
          </>}>
          {waybill && (() => { const wb = waybill.waybill || 'VN931042771'; return (
            <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--border-default)' }}>
                <img src="../../assets/logomark.svg" width="28" height="28" alt="" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ font: '800 16px var(--font-sans)', color: 'var(--text-strong)' }}>Lazadee Express</span>
                  <span style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>Dịch vụ vận chuyển nội bộ Lazadee</span>
                </div>
                <Badge variant="mint" icon="shield-check" style={{ marginLeft: 'auto' }}>Đã thanh toán</Badge>
              </div>
              {/* fake barcode */}
              <div style={{ display: 'flex', gap: 1.5, height: 54, margin: '14px 0 6px', alignItems: 'stretch' }}>
                {Array.from({ length: 48 }).map((_, i) => <span key={i} style={{ flex: (i * 7) % 3 + 1, background: i % 2 ? '#fff' : 'var(--ink-900)' }} />)}
              </div>
              <div className="code" style={{ textAlign: 'center', font: '700 16px var(--font-mono)', letterSpacing: '.12em', color: 'var(--text-strong)', marginBottom: 14 }}>{wb}</div>
              <Row k="Người nhận" v={waybill.customer} />
              <Row k="Địa chỉ" v={waybill.addr} />
              <Row k="Kiện hàng" v={waybill.items.length + ' sản phẩm'} />
              <Row k="Giá trị đơn (đã thanh toán)" v={formatVND(waybill.total)} strong />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', font: 'var(--type-body-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Thu hộ</span>
                <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>0 ₫ · Đã thanh toán trước</span>
              </div>
            </div>
          ); })()}
        </Modal>
      </div>
    );
  }

  function Row({ k, v, strong }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', font: 'var(--type-body-sm)' }}>
        <span style={{ color: 'var(--text-muted)' }}>{k}</span>
        <span style={{ color: strong ? 'var(--text-price)' : 'var(--text-body)', fontWeight: strong ? 700 : 500, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
      </div>
    );
  }
  window.LZVFulfillment = Fulfillment;
})();
