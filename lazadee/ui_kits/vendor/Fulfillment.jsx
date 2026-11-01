/* Vendor: order fulfillment — confirm or reject new orders, prepare, hand over to the
   carrier the system picks, print waybills, follow GHN status, and answer return
   requests within 48 hours. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Modal, Money, Tabs, Select } = DS;
  const formatVND = Money.format;
  const { ghnStatus } = window.LZV;

  const ORDERS = [
    { id: 'LZD-20260608-000046', customer: 'Trần Thị Mai', addr: 'Q1, TP.HCM', items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000]], total: 414000, status: 'NEW', pay: 'VNPay', note: 'Giao giờ hành chính giúp mình nhé.', at: 46 },
    { id: 'LZD-20260608-000045', customer: 'Đinh Gia Bảo', addr: 'Thủ Đức, TP.HCM', items: [['Bàn phím cơ RGB', 'Blue switch', 1, 459000]], total: 484000, status: 'NEW', pay: 'COD', note: '', at: 45 },
    { id: 'LZD-20260608-000041', customer: 'Trần Thị Mai', addr: 'Q1, TP.HCM', items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000], ['Serum Vitamin C', '30ml', 1, 178000]], total: 778000, status: 'CONFIRMED', pay: 'VNPay', note: 'Gói kỹ giúp mình, đồ làm quà.', at: 41 },
    { id: 'LZD-20260608-000040', customer: 'Nguyễn Văn An', addr: 'Cầu Giấy, Hà Nội', items: [['Đồng hồ Watch S2', 'Navy', 1, 690000]], total: 690000, status: 'PREPARING', pay: 'VietQR', note: '', at: 40 },
    { id: 'LZD-20260608-000038', customer: 'Lê Hoàng Phúc', addr: 'Hải Châu, Đà Nẵng', items: [['Bàn phím cơ RGB', 'Đen/Blue', 1, 459000]], total: 459000, status: 'DELIVERING', pay: 'VNPay', ghn: 'transporting', waybill: 'VN931042771', carrier: 'J&T Express', note: '', at: 38 },
    { id: 'LZD-20260608-000036', customer: 'Đỗ Minh Khang', addr: 'Biên Hòa, Đồng Nai', items: [['Loa bluetooth mini IPX7', 'Đen', 2, 320000]], total: 640000, status: 'DELIVERING', pay: 'COD', ghn: 'delivering', waybill: 'VN931042698', carrier: 'GHN', note: '', at: 36 },
    { id: 'LZD-20260608-000034', customer: 'Bùi Thu Hằng', addr: 'Ninh Kiều, Cần Thơ', items: [['Webcam Full HD', 'Đen', 1, 540000]], total: 540000, status: 'DELIVERING', pay: 'VNPay', ghn: 'delivery_fail', waybill: 'VN931042544', carrier: 'GHTK', note: '', at: 34 },
    { id: 'LZD-20260608-000039', customer: 'Phạm Thu Hà', addr: 'Q7, TP.HCM', items: [['Máy ảnh Mirrorless X-100', 'Kit 15-45', 1, 1245000]], total: 1245000, status: 'DELIVERED', pay: 'VNPay', ghn: 'delivered', waybill: 'VN931042500', carrier: 'GHN', note: '', at: 39 },
    { id: 'LZD-20260608-000035', customer: 'Vũ Minh Quân', addr: 'Long Biên, Hà Nội', items: [['Sạc nhanh 65W', 'Trắng', 1, 178000]], total: 178000, status: 'CANCELLED', pay: 'VNPay', ghn: 'cancel', note: '', at: 35 },
  ];
  const TABS = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'NEW', label: 'Mới', match: ['NEW'] },
    { id: 'PREP', label: 'Chờ chuẩn bị', match: ['CONFIRMED', 'PREPARING'] },
    { id: 'DELIVERING', label: 'Đang giao', match: ['DELIVERING'] },
    { id: 'DELIVERED', label: 'Đã giao', match: ['DELIVERED'] },
    { id: 'RETURN', label: 'Trả hàng' },
    { id: 'CANCELLED', label: 'Đã hủy', match: ['CANCELLED'] },
  ];
  const STATUS_BADGE = { NEW: ['PENDING', 'Chờ xác nhận'], CONFIRMED: ['PAID', 'Đã xác nhận'], PREPARING: ['PAID', 'Đang chuẩn bị'] };
  const REJECT_REASONS = ['Hết hàng thực tế', 'Sai giá niêm yết', 'Không giao tới khu vực này', 'Lý do khác'];
  // Carrier quotes shown when the system routes a parcel (cheapest among the fast ones, shop-enabled only).
  const QUOTES = [{ carrier: 'GHN', fee: 24000, eta: '2 ngày' }, { carrier: 'GHTK', fee: 22000, eta: '3 ngày' }];

  const RETURNS = [
    { id: 'RFN-0231', order: 'LZD-20260608-000029', buyer: 'Hoàng Thu Trang', item: 'Tai nghe ANC Pro 5 · Trắng', amount: 389000, type: 'RETURN_AND_REFUND', reason: 'Hàng sai kích thước/màu sắc', evidence: ['headphones', 'keyboard'], video: 'mo-hop.mp4', due: 'còn 31 giờ', state: 'REQUESTED' },
    { id: 'RFN-0232', order: 'LZD-20260608-000027', buyer: 'Mai Anh Tuấn', item: 'Sạc nhanh 65W · Trắng', amount: 178000, type: 'REFUND_ONLY', reason: 'Hàng bể vỡ do vận chuyển', evidence: ['phone'], video: 'mo-hop.mp4', due: 'còn 12 giờ', state: 'REQUESTED' },
    { id: 'RFN-0229', order: 'LZD-20260608-000021', buyer: 'Bùi Đức Anh', item: 'Loa bluetooth mini IPX7 · Đen', amount: 320000, type: 'RETURN_AND_REFUND', reason: 'Sản phẩm lỗi', evidence: ['speaker'], video: 'mo-hop.mp4', due: 'hàng đang về kho', state: 'AWAITING_RETURN_SHIPMENT' },
  ];
  const R_STATE = {
    REQUESTED: ['warning', 'Chờ shop phản hồi'], AWAITING_EVIDENCE: ['neutral', 'Chờ khách bổ sung'], AWAITING_RETURN_SHIPMENT: ['primary', 'Chờ hàng hoàn về'],
    APPROVED: ['success', 'Đã hoàn tiền'], SHOP_REJECTED: ['danger', 'Shop đã từ chối'], DISPUTED: ['danger', 'Sàn đang phân xử'],
  };

  function Returns({ say }) {
    const [rows, setRows] = React.useState(RETURNS);
    const [act, setAct] = React.useState(null); // { row, kind }
    const [text, setText] = React.useState('');
    const set = (id, state) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, state, due: state === 'AWAITING_RETURN_SHIPMENT' ? 'khách có 7 ngày gửi hàng' : r.due } : r)));
    const COPY = {
      evidence: { title: 'Yêu cầu bổ sung bằng chứng', btn: 'Gửi yêu cầu', ask: 'Cần khách bổ sung gì?', note: 'Chỉ yêu cầu được 1 lần. Đồng hồ 48 giờ của shop tạm dừng, khách có 48 giờ để nộp.', state: 'AWAITING_EVIDENCE', msg: 'Đã gửi yêu cầu bổ sung cho khách' },
      refund: { title: 'Đồng ý hoàn tiền', btn: 'Đồng ý hoàn tiền', note: 'Hoàn tiền ngay, không thu hồi hàng. Tiền được trừ từ escrow của đơn.', state: 'APPROVED', msg: 'Đã đồng ý hoàn tiền' },
      take: { title: 'Đồng ý nhận lại hàng', btn: 'Đồng ý nhận lại hàng', note: 'Hệ thống tạo vận đơn chiều về. Quá 7 ngày khách chưa giao hàng cho ĐVVC thì yêu cầu tự đóng và tiền giải ngân cho shop.', state: 'AWAITING_RETURN_SHIPMENT', msg: 'Đã tạo vận đơn chiều về' },
      reject: { title: 'Từ chối yêu cầu', btn: 'Từ chối', ask: 'Lý do từ chối', note: 'Khách có 48 giờ để chấp nhận hoặc khiếu nại lên Sàn.', state: 'SHOP_REJECTED', msg: 'Đã từ chối yêu cầu' },
    };
    const c = act && COPY[act.kind];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--blue-50)', borderRadius: 'var(--radius-md)', padding: '10px 14px', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><Icon name="info" size={16} style={{ color: 'var(--blue-600)', flex: 'none' }} />Shop có 48 giờ để phản hồi. Quá hạn, hệ thống tự đồng ý theo phương án khách đã chọn.</div>
        {rows.map((r) => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'var(--gray-25)', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              <span className="code" style={{ font: '13px var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{r.id}</span>
              <span className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-muted)' }}>{r.order}</span>
              <Badge variant={R_STATE[r.state][0]}>{R_STATE[r.state][1]}</Badge>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--type-caption)', color: 'var(--amber-600)' }}><Icon name="clock" size={13} />{r.due}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 18, padding: '14px 18px' }}>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.7 }}>
                <div><b>{r.buyer}</b> · {r.item}</div>
                <div>Phương án: <b>{r.type === 'REFUND_ONLY' ? 'Hoàn tiền ngay, không trả hàng' : 'Trả hàng và hoàn tiền'}</b></div>
                <div>Lý do: {r.reason}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  {r.evidence.map((m) => <img key={m} src={'../../assets/img/' + m + '.jpg'} alt="Bằng chứng" width="52" height="52" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />)}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--type-caption)', color: 'var(--text-muted)' }}><Icon name="file-text" size={14} />{r.video}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Số tiền yêu cầu</div>
                <div style={{ font: '800 20px var(--font-sans)', color: 'var(--text-price)', fontVariantNumeric: 'tabular-nums' }}>{formatVND(r.amount)}</div>
              </div>
            </div>
            {r.state === 'REQUESTED' && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '0 18px 14px', flexWrap: 'wrap' }}>
                <Button size="sm" variant="ghost" onClick={() => { setText(''); setAct({ row: r, kind: 'evidence' }); }}>Yêu cầu bổ sung</Button>
                <Button size="sm" variant="outline" style={{ color: 'var(--red-600)' }} onClick={() => { setText(''); setAct({ row: r, kind: 'reject' }); }}>Từ chối</Button>
                {r.type === 'RETURN_AND_REFUND' && <Button size="sm" variant="secondary" onClick={() => setAct({ row: r, kind: 'take' })}>Đồng ý nhận lại hàng</Button>}
                <Button size="sm" iconLeft="hand-coins" onClick={() => setAct({ row: r, kind: 'refund' })}>Đồng ý hoàn tiền</Button>
              </div>
            )}
            {r.state === 'AWAITING_RETURN_SHIPMENT' && <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 18px 14px' }}><Button size="sm" iconLeft="check" onClick={() => { set(r.id, 'APPROVED'); say('Đã nhận hàng hoàn, tiền được hoàn cho khách'); }}>Đã nhận hàng hoàn</Button></div>}
            {r.state === 'SHOP_REJECTED' && <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 18px 14px' }}><Button size="sm" variant="outline" onClick={() => { set(r.id, 'DISPUTED'); say('Đã chuyển sang Sàn phân xử'); }}>Nhờ Sàn phân xử</Button></div>}
          </div>
        ))}
        <Modal open={!!act} onClose={() => setAct(null)} width={460} title={c && c.title}
          footer={c && <><Button variant="ghost" onClick={() => setAct(null)}>Huỷ</Button><Button variant={act.kind === 'reject' ? 'danger' : 'primary'} disabled={c.ask && !text.trim()} onClick={() => { set(act.row.id, c.state); say(c.msg); setAct(null); }}>{c.btn}</Button></>}>
          {c && <div>
            <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>{c.note}</p>
            {c.ask && <><label style={lab}>{c.ask}</label><textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} style={area} /></>}
          </div>}
        </Modal>
      </div>
    );
  }

  function Fulfillment() {
    const [tab, setTab] = React.useState('NEW');
    const [orders, setOrders] = React.useState(ORDERS);
    const [waybill, setWaybill] = React.useState(null);
    const [route, setRoute] = React.useState(null); // order being routed to a carrier
    const [reject, setReject] = React.useState(null);
    const [why, setWhy] = React.useState(REJECT_REASONS[0]);
    const [whyNote, setWhyNote] = React.useState('');
    const [placing, setPlacing] = React.useState(false);
    const [q, setQ] = React.useState('');
    const [sort, setSort] = React.useState('Mới nhất');
    const [toast, setToast] = React.useState('');
    const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };
    const setOrder = (id, patch) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));

    const inTab = (o, id) => { const t = TABS.find((x) => x.id === id); return !t.match || t.match.includes(o.status); };
    const list = orders
      .filter((o) => inTab(o, tab))
      .filter((o) => (o.id + ' ' + o.customer).toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => (sort === 'Mới nhất' ? b.at - a.at : a.at - b.at));

    const best = QUOTES.reduce((a, b) => (b.fee < a.fee ? b : a));
    const handOver = () => {
      setPlacing(true);
      setTimeout(() => {
        const next = { ...route, status: 'DELIVERING', ghn: 'ready_to_pick', waybill: 'VN' + (931042800 + route.at), carrier: best.carrier };
        setOrder(route.id, next);
        setPlacing(false); setRoute(null); setWaybill(next);
      }, 500);
    };
    const doReject = () => {
      setOrder(reject.id, { status: 'CANCELLED', ghn: 'cancel', rejectReason: why === 'Lý do khác' ? whyNote : why });
      setReject(null); say('Đã từ chối đơn. Tồn kho, Xu và voucher được hoàn cho khách' + (reject.pay === 'COD' ? '' : ', tiền tự hoàn'));
    };

    const badge = (o) => { const s = STATUS_BADGE[o.status]; if (s) return { color: s[0], label: s[1] }; const g = ghnStatus(o.ghn); return { color: g.color, label: g.label }; };

    return (
      <div style={{ maxWidth: 1180 }}>
        <Tabs value={tab} onChange={setTab} items={TABS.map((t) => ({ id: t.id, label: t.label, badge: t.id === 'NEW' ? orders.filter((o) => o.status === 'NEW').length || undefined : t.id === 'PREP' ? orders.filter((o) => inTab(o, 'PREP')).length || undefined : undefined }))} />
        {tab === 'RETURN' ? <div style={{ marginTop: 16 }}><Returns say={say} /></div> : <>
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
              const b = badge(o);
              return (
                <div key={o.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--gray-25)', flexWrap: 'wrap' }}>
                    <span className="code" style={{ font: '13px var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{o.id}</span>
                    <StatusBadge status={b.color} label={b.label} />
                    <Badge variant="neutral">{o.pay}</Badge>
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
                    {o.note && <div style={{ display: 'flex', gap: 8, marginTop: 8, padding: '8px 12px', background: 'var(--amber-50)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><Icon name="message-square" size={15} style={{ color: 'var(--amber-600)', flex: 'none', marginTop: 2 }} /><span><b>Lời nhắn của khách:</b> {o.note}</span></div>}
                    {o.rejectReason && <div style={{ marginTop: 8, font: 'var(--type-caption)', color: 'var(--red-600)' }}>Shop đã từ chối: {o.rejectReason}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                    {o.waybill ? (
                      <>
                        <Badge variant="mint" icon="truck">{o.carrier}</Badge>
                        <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-body)' }}>Mã VĐ: {o.waybill}</span>
                        <Button variant="ghost" size="sm" iconLeft="printer" style={{ marginLeft: 'auto' }} onClick={() => setWaybill(o)}>In lại vận đơn</Button>
                      </>
                    ) : (
                      <>
                        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng đơn: <b style={{ color: 'var(--text-price)' }}>{formatVND(o.total)}</b></span>
                        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                          {o.status === 'NEW' && <>
                            <Button size="sm" variant="ghost" style={{ color: 'var(--red-600)' }} onClick={() => { setWhy(REJECT_REASONS[0]); setWhyNote(''); setReject(o); }}>Từ chối</Button>
                            <Button size="sm" iconLeft="check" onClick={() => { setOrder(o.id, { status: 'CONFIRMED' }); say('Đã xác nhận đơn. Khách nhận thông báo "Shop đã xác nhận đơn"'); }}>Xác nhận</Button>
                          </>}
                          {o.status === 'CONFIRMED' && <Button size="sm" iconLeft="package" onClick={() => setOrder(o.id, { status: 'PREPARING' })}>Chuẩn bị hàng</Button>}
                          {o.status === 'PREPARING' && <Button size="sm" iconLeft="truck" onClick={() => setRoute(o)}>Sẵn sàng giao cho ĐVVC</Button>}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        <Modal open={!!reject} onClose={() => setReject(null)} width={460} title={reject && 'Từ chối đơn ' + reject.id}
          footer={<><Button variant="ghost" onClick={() => setReject(null)}>Huỷ</Button><Button variant="danger" disabled={why === 'Lý do khác' && !whyNote.trim()} onClick={doReject}>Từ chối đơn</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Select label="Lý do từ chối" value={why} onChange={(e) => setWhy(e.target.value)}>{REJECT_REASONS.map((r) => <option key={r}>{r}</option>)}</Select>
            {why === 'Lý do khác' && <textarea aria-label="Mô tả lý do" value={whyNote} onChange={(e) => setWhyNote(e.target.value)} rows={3} placeholder="Mô tả lý do..." style={area} />}
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.5 }}>Từ chối đơn ảnh hưởng tỷ lệ hủy của shop. Đơn không xác nhận sau 24 giờ sẽ được tự xác nhận và ghi điểm chậm xác nhận.</div>
          </div>
        </Modal>

        {/* carrier routing */}
        <Modal open={!!route} onClose={() => !placing && setRoute(null)} width={460} title="Yêu cầu lấy hàng (3PL)"
          footer={<><Button variant="ghost" disabled={placing} onClick={() => setRoute(null)}>Huỷ</Button><Button iconLeft="truck" disabled={placing} onClick={handOver}>{placing ? 'Đang xử lý...' : 'Xác nhận lấy hàng (3PL)'}</Button></>}>
          {route && <div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', marginBottom: 12 }}>Hệ thống so sánh các hãng shop đã bật và chọn hãng tốt nhất cho đơn <b className="code">{route.id}</b>:</div>
            {QUOTES.map((c) => (
              <div key={c.carrier} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 8, border: '1.5px solid ' + (c === best ? 'var(--color-primary)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', background: c === best ? 'var(--color-primary-tint)' : '#fff' }}>
                <Icon name="truck" size={17} style={{ color: 'var(--text-muted)' }} />
                <b style={{ flex: 1, font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{c.carrier}</b>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{c.eta}</span>
                <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)' }}>{formatVND(c.fee)}</span>
                {c === best && <Badge variant="primary">Đã chọn</Badge>}
              </div>
            ))}
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Bật hoặc tắt hãng ở Cài đặt → Vận chuyển.</div>
          </div>}
        </Modal>

        {/* waybill */}
        <Modal open={!!waybill} onClose={() => setWaybill(null)} width={420} title="Phiếu gửi hàng"
          footer={waybill && <>
            <Button variant="ghost" onClick={() => setWaybill(null)}>Đóng</Button>
            <Button iconLeft="printer" onClick={() => window.print()}>In phiếu gửi hàng</Button>
          </>}>
          {waybill && (
            <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--border-default)' }}>
                <img src="../../assets/logomark.svg" width="28" height="28" alt="" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ font: '800 16px var(--font-sans)', color: 'var(--text-strong)' }}>{waybill.carrier}</span>
                  <span style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>Đối tác vận chuyển của Lazadee</span>
                </div>
                <Badge variant="mint" icon="shield-check" style={{ marginLeft: 'auto' }}>{waybill.pay === 'COD' ? 'Thu hộ COD' : 'Đã thanh toán'}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 1.5, height: 54, margin: '14px 0 6px', alignItems: 'stretch' }}>
                {Array.from({ length: 48 }).map((_, i) => <span key={i} style={{ flex: (i * 7) % 3 + 1, background: i % 2 ? '#fff' : 'var(--ink-900)' }} />)}
              </div>
              <div className="code" style={{ textAlign: 'center', font: '700 16px var(--font-mono)', letterSpacing: '.12em', color: 'var(--text-strong)', marginBottom: 14 }}>{waybill.waybill}</div>
              <Row k="Người nhận" v={waybill.customer} />
              <Row k="Địa chỉ" v={waybill.addr} />
              <Row k="Kiện hàng" v={waybill.items.length + ' sản phẩm'} />
              <Row k="Thu hộ" v={waybill.pay === 'COD' ? formatVND(waybill.total) : '0 ₫ · Đã thanh toán trước'} strong={waybill.pay === 'COD'} />
            </div>
          )}
        </Modal>
        {toast && <div role="status" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink-900)', color: '#fff', padding: '11px 18px', borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', boxShadow: 'var(--shadow-lg)', zIndex: 1000 }}>{toast}</div>}
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
  const lab = { display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 6 };
  const area = { width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' };
  window.LZVFulfillment = Fulfillment;
})();
