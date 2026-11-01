/* Vendor: order fulfillment — tabs by order state, search + sort, GHN carrier status,
   confirm 3PL pickup, generate + print waybill with tracking code. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Modal, Money, Tabs, Select } = DS;
  const formatVND = Money.format;
  const { ghnStatus } = window.LZV;

  const ORDERS = [
    { id: 'ORD-2412-0041', customer: 'Trần Thị Mai', addr: 'Q1, TP.HCM', items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000], ['Serum Vitamin C', '30ml', 1, 178000]], total: 778000, status: 'PAID', ghn: 'ready_to_pick', at: 41 },
    { id: 'ORD-2412-0040', customer: 'Nguyễn Văn An', addr: 'Cầu Giấy, Hà Nội', items: [['Đồng hồ Watch S2', 'Navy', 1, 690000]], total: 690000, status: 'PAID', ghn: 'ready_to_pick', at: 40 },
    { id: 'ORD-2412-0038', customer: 'Lê Hoàng Phúc', addr: 'Hải Châu, Đà Nẵng', items: [['Bàn phím cơ RGB', 'Đen/Blue', 1, 459000]], total: 459000, status: 'SHIPPED', ghn: 'transporting', waybill: 'VN931042771', carrier: 'Lazadee Express', at: 38 },
    { id: 'ORD-2412-0036', customer: 'Đỗ Minh Khang', addr: 'Biên Hòa, Đồng Nai', items: [['Loa bluetooth mini IPX7', 'Đen', 2, 320000]], total: 640000, status: 'SHIPPED', ghn: 'delivering', waybill: 'VN931042698', carrier: 'GHN', at: 36 },
    { id: 'ORD-2412-0034', customer: 'Bùi Thu Hằng', addr: 'Ninh Kiều, Cần Thơ', items: [['Webcam Full HD', 'Đen', 1, 540000]], total: 540000, status: 'SHIPPED', ghn: 'delivery_fail', waybill: 'VN931042544', carrier: 'GHN', at: 34 },
    { id: 'ORD-2412-0039', customer: 'Phạm Thu Hà', addr: 'Q7, TP.HCM', items: [['Máy ảnh Mirrorless X-100', 'Kit 15-45', 1, 1245000]], total: 1245000, status: 'DELIVERED', ghn: 'delivered', waybill: 'VN931042500', carrier: 'GHN', at: 39 },
    { id: 'ORD-2412-0031', customer: 'Hoàng Thu Trang', addr: 'Thanh Xuân, Hà Nội', items: [['Tai nghe ANC Pro 5', 'Trắng / Tiêu chuẩn', 1, 389000]], total: 389000, status: 'RETURNING', ghn: 'return', waybill: 'VN931042311', carrier: 'GHN', at: 31 },
    { id: 'ORD-2412-0035', customer: 'Vũ Minh Quân', addr: 'Long Biên, Hà Nội', items: [['Sạc nhanh 65W', 'Trắng', 1, 178000]], total: 178000, status: 'CANCELLED', ghn: 'cancel', at: 35 },
  ];
  const TABS = [
    { id: 'PAID', label: 'Chờ chuẩn bị', match: ['PAID'] },
    { id: 'SHIPPED', label: 'Đang giao', match: ['SHIPPED'] },
    { id: 'DELIVERED', label: 'Đã giao', match: ['DELIVERED'] },
    { id: 'RETURNING', label: 'Trả hàng', match: ['RETURNING'] },
    { id: 'CANCELLED', label: 'Đã hủy', match: ['CANCELLED'] },
    { id: 'ALL', label: 'Tất cả' },
  ];

  function Fulfillment() {
    const [tab, setTab] = React.useState('PAID');
    const [waybill, setWaybill] = React.useState(null); // order being shipped
    const [pickup, setPickup] = React.useState(null); // order waiting for 3PL confirm
    const [placing, setPlacing] = React.useState(false);
    const [orders, setOrders] = React.useState(ORDERS);
    const [q, setQ] = React.useState('');
    const [sort, setSort] = React.useState('Mới nhất');

    const inTab = (o, id) => { const t = TABS.find((x) => x.id === id); return !t.match || t.match.includes(o.status); };
    const list = orders
      .filter((o) => inTab(o, tab))
      .filter((o) => (o.id + ' ' + o.customer).toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => (sort === 'Mới nhất' ? b.at - a.at : a.at - b.at));

    const confirmPickup = () => {
      setPlacing(true);
      setTimeout(() => {
        const wb = 'VN' + (931042800 + pickup.at);
        const next = { ...pickup, status: 'SHIPPED', ghn: 'picking', waybill: wb, carrier: 'GHN' };
        setOrders((os) => os.map((o) => (o.id === pickup.id ? next : o)));
        setPlacing(false); setPickup(null); setWaybill(next);
      }, 500);
    };

    return (
      <div style={{ maxWidth: 1180 }}>
        <Tabs value={tab} onChange={setTab} items={TABS.map((t) => ({ id: t.id, label: t.label, badge: t.id === 'PAID' ? orders.filter((o) => o.status === 'PAID').length : undefined }))} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã đơn, KH..." style={{ width: '100%', height: 40, paddingLeft: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ width: 150, marginLeft: 'auto' }}><Select value={sort} onChange={(e) => setSort(e.target.value)}><option>Mới nhất</option><option>Cũ nhất</option></Select></div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.length === 0 && <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '56px 0', background: '#fff', borderRadius: 'var(--radius-lg)', color: 'var(--text-subtle)' }}><Icon name="package" size={40} /><span style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>Không tìm thấy đơn hàng nào.</span></div>}
          {list.map((o) => {
            const g = ghnStatus(o.ghn);
            const hasBill = !!o.waybill;
            return (
              <div key={o.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--gray-25)' }}>
                  <span className="code" style={{ font: '13px var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{o.id}</span>
                  <StatusBadge status={g.color} label={g.label} />
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={o.customer} size={26} /><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{o.customer} · {o.addr}</span>
                  </span>
                </div>
                <div style={{ padding: '14px 18px' }}>
                  {o.items.map(([n, v, q2, p], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                      <Icon name="package" size={15} style={{ color: 'var(--text-subtle)' }} />
                      <span style={{ flex: 1 }}>{n} <span style={{ color: 'var(--text-muted)' }}>· {v}</span></span>
                      <span style={{ color: 'var(--text-muted)' }}>x{q2}</span>
                      <span style={{ width: 110, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{formatVND(p)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
                  {hasBill ? (
                    <>
                      <Badge variant="mint" icon="truck">{o.carrier}</Badge>
                      <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-body)' }}>Mã VĐ: {o.waybill}</span>
                      <Button variant="ghost" size="sm" iconLeft="printer" style={{ marginLeft: 'auto' }} onClick={() => setWaybill(o)}>In lại vận đơn</Button>
                    </>
                  ) : o.status === 'PAID' ? (
                    <>
                      <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng đơn: <b style={{ color: 'var(--text-price)' }}>{formatVND(o.total)}</b></span>
                      <Button size="sm" iconLeft="truck" style={{ marginLeft: 'auto' }} onClick={() => setPickup(o)}>Yêu cầu lấy hàng (3PL)</Button>
                    </>
                  ) : (
                    <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng đơn: <b style={{ color: 'var(--text-price)' }}>{formatVND(o.total)}</b></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* confirm 3PL pickup */}
        <Modal open={!!pickup} onClose={() => !placing && setPickup(null)} width={440} title="Xác nhận lấy hàng"
          footer={<><Button variant="ghost" disabled={placing} onClick={() => setPickup(null)}>Huỷ</Button><Button iconLeft="truck" disabled={placing} onClick={confirmPickup}>{placing ? 'Đang xử lý...' : 'Xác nhận lấy hàng (3PL)'}</Button></>}>
          {pickup && <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.55 }}>Tạo vận đơn GHN cho đơn <b className="code">{pickup.id}</b> và yêu cầu đơn vị vận chuyển đến lấy hàng tại địa chỉ kho của Shop?</div>}
        </Modal>

        {/* waybill modal */}
        <Modal open={!!waybill} onClose={() => setWaybill(null)} width={420} title="Vận đơn 3PL"
          footer={waybill && <>
            <Button variant="ghost" onClick={() => setWaybill(null)}>Đóng</Button>
            <Button iconLeft="printer" onClick={() => setWaybill(null)}>In vận đơn</Button>
          </>}>
          {waybill && (
            <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--border-default)' }}>
                <img src="../../assets/logomark.svg" width="28" height="28" alt="" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ font: '800 16px var(--font-sans)', color: 'var(--text-strong)' }}>{waybill.carrier}</span>
                  <span style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>Đối tác vận chuyển của Lazadee</span>
                </div>
                <Badge variant="mint" icon="shield-check" style={{ marginLeft: 'auto' }}>Đã thanh toán</Badge>
              </div>
              {/* fake barcode */}
              <div style={{ display: 'flex', gap: 1.5, height: 54, margin: '14px 0 6px', alignItems: 'stretch' }}>
                {Array.from({ length: 48 }).map((_, i) => <span key={i} style={{ flex: (i * 7) % 3 + 1, background: i % 2 ? '#fff' : 'var(--ink-900)' }} />)}
              </div>
              <div className="code" style={{ textAlign: 'center', font: '700 16px var(--font-mono)', letterSpacing: '.12em', color: 'var(--text-strong)', marginBottom: 14 }}>{waybill.waybill}</div>
              <Row k="Người nhận" v={waybill.customer} />
              <Row k="Địa chỉ" v={waybill.addr} />
              <Row k="Kiện hàng" v={waybill.items.length + ' sản phẩm'} />
              <Row k="Giá trị đơn (đã thanh toán)" v={formatVND(waybill.total)} strong />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', font: 'var(--type-body-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Thu hộ</span>
                <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>0 ₫ · Đã thanh toán trước</span>
              </div>
            </div>
          )}
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
