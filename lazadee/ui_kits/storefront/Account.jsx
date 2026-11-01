/* Lazadee customer account hub. The left sidebar switches the main panel:
   Hồ sơ · Địa chỉ · Đổi mật khẩu · Đơn mua (orders by status ENUM) · Kho Voucher
   · Lazadee Xu · Shop đang theo dõi. Mirrors customer_profiles, addresses,
   shop_follows, vouchers, loyalty-coin ledger. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Avatar, StatusBadge, VendorChip, Tabs, Input, Radio, Checkbox, VoucherTag, Badge, Modal, Select } = DS;
  const { USER, ADDRESSES, FOLLOWS, ORDERS, V, VOUCHERS, COIN_LOG, NOTIFICATIONS, DEVICES } = window.LZ;
  const fmt = (n) => (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('vi-VN') + '₫';
  const PW_COLORS = ['var(--red-500)', 'var(--red-500)', 'var(--gold-500)', 'var(--mint-500)', 'var(--mint-600)'];
  const PW_LABELS = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const pwStrength = (p) => { let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s; };
  const OTP_DEMO = '123456';
  const maskEmail = (e) => (e || '').replace(/^(.{2}).*(@.*)$/, '$1****$2');

  const STATUS_VI = {
    PENDING_PAYMENT: 'Chờ thanh toán', PAID: 'Đã thanh toán', CONFIRMED: 'Đã xác nhận', PREPARING: 'Đang chuẩn bị', READY_FOR_PICKUP: 'Chờ lấy hàng',
    RETURN_REQUESTED: 'Đang trả hàng / hoàn tiền',
    DELIVERING: 'Đang giao', DELIVERED: 'Đã giao', COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã huỷ', CANCELLED_BY_VENDOR: 'Shop đã huỷ', AUTO_CANCELLED: 'Tự huỷ do quá hạn', REFUNDED: 'Đã hoàn tiền',
  };
  const TABS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pay', label: 'Chờ thanh toán', match: ['PENDING_PAYMENT'] },
    { value: 'ship', label: 'Vận chuyển', match: ['PAID', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'DELIVERING'] },
    { value: 'deliver', label: 'Chờ giao hàng', match: ['DELIVERED'] },
    { value: 'done', label: 'Hoàn thành', match: ['COMPLETED'] },
    { value: 'return', label: 'Trả hàng / Hoàn tiền', match: ['RETURN_REQUESTED', 'REFUNDED'] },
    { value: 'cancel', label: 'Đã huỷ', match: ['CANCELLED', 'CANCELLED_BY_VENDOR', 'AUTO_CANCELLED'] },
  ];
  const CANCEL_REASONS = ['Đổi ý, không muốn mua nữa', 'Muốn đổi địa chỉ nhận hàng', 'Muốn đổi sản phẩm / phân loại', 'Tìm được giá tốt hơn', 'Lý do khác'];
  const ACTIVE_STATUSES = ['PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'DELIVERING', 'DELIVERED', 'RETURN_REQUESTED'];

  const MENU = [
    { group: 'Tài khoản của tôi', items: [
      { id: 'profile', name: 'Hồ sơ', icon: 'user' },
      { id: 'address', name: 'Địa chỉ', icon: 'map-pin' },
      { id: 'password', name: USER.hasPassword === false ? 'Thiết lập mật khẩu' : 'Đổi mật khẩu', icon: 'shield-check' },
      { id: 'devices', name: 'Thiết bị đăng nhập', icon: 'lock' },
    ] },
    { group: '', items: [
      { id: 'orders', name: 'Đơn mua', icon: 'package' },
      { id: 'notifications', name: 'Thông báo', icon: 'bell' },
      { id: 'vouchers', name: 'Kho Voucher', icon: 'ticket' },
      { id: 'coins', name: 'Lazadee Xu', icon: 'star' },
      { id: 'wishlist', name: 'Sản phẩm yêu thích', icon: 'heart' },
      { id: 'follow', name: 'Shop đang theo dõi', icon: 'store', badge: FOLLOWS.length },
    ] },
  ];

  const toast = (message, type) => window.dispatchEvent(new CustomEvent('show_toast', { detail: { message, type } }));

  function Account({ initialView, pendingNotif, onClearPendingNotif, onTrack, onOpen, onChat, onReview, onBuyAgain, onShop, onGo, onViewChange, onLogout, reviewedIds = [] }) {
    const [view, setView] = React.useState(initialView || new URLSearchParams(location.search).get('view') || 'orders');
    const [orders, setOrders] = React.useState(ORDERS);
    const [addrOpen, setAddrOpen] = React.useState(false);
    const [notifs, setNotifs] = React.useState(NOTIFICATIONS);
    const [notifDetail, setNotifDetail] = React.useState(null);
    const [cancelIds, setCancelIds] = React.useState(null);
    const [cancelWhy, setCancelWhy] = React.useState(CANCEL_REASONS[0]);
    const [payIds, setPayIds] = React.useState(null);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const [provider, setProvider] = React.useState(USER.authProvider || 'email'); // demo: 'email' | 'google'
    const hasPassword = provider === 'email';
    const notifUnread = notifs.filter((n) => n.unread).length;
    React.useEffect(() => { if (initialView) setView(initialView); }, [initialView]);
    React.useEffect(() => { if (onViewChange) onViewChange(view); }, [view]);
    React.useEffect(() => { if (pendingNotif) { openNotif(pendingNotif); onClearPendingNotif && onClearPendingNotif(); } }, [pendingNotif]);
    const confirmReceipt = (id) =>
      setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: 'COMPLETED', completedAt: 'vừa xong' } : o)));

    // Mark a notification read, then route to its target.
    const payOrders = (method) => {
      const ids = payIds;
      if (method === 'cod') {
        setOrders((os) => os.map((o) => (ids.includes(o.id) ? { ...o, pay: 'COD' } : o)));
        setPayIds(null);
        toast('Đã đổi sang COD. Đơn đang chờ shop xác nhận');
        return;
      }
      setOrders((os) => os.map((o) => (ids.includes(o.id) ? { ...o, status: 'PAID', pay: method === 'vietqr' ? 'VietQR' : 'VNPay' } : o)));
      setPayIds(null);
      toast(ids.length > 1 ? 'Đã thanh toán nhóm đơn hàng (mô phỏng)' : 'Đã thanh toán đơn hàng (mô phỏng)');
    };
    const payTotal = (payIds || []).reduce((n, id) => n + orders.find((o) => o.id === id).total, 0);
    const cancelPaid = (cancelIds || []).some((id) => { const o = orders.find((x) => x.id === id); return o.status !== 'PENDING_PAYMENT' && o.pay !== 'COD'; });
    const doCancel = () => {
      setOrders((os) => os.map((o) => (cancelIds.includes(o.id) ? { ...o, status: 'CANCELLED', cancelReason: cancelWhy } : o)));
      toast((cancelIds.length > 1 ? 'Huỷ nhóm đơn hàng thành công' : 'Huỷ đơn hàng thành công') + (cancelPaid ? '. Tiền được hoàn về phương thức đã thanh toán.' : ''));
      setCancelIds(null);
    };

    const openNotif = (n) => {
      n.unread = false;
      setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
      if (n.platform) { setView('notifications'); setNotifDetail(n); return; }
      const lk = n.link || {};
      if (lk.action === 'track' && onTrack) onTrack(lk.orderId);
      else if (lk.action === 'view') setView(lk.view);
      else if (lk.action === 'home' && onGo) onGo('home');
    };
    const markAllRead = () => { NOTIFICATIONS.forEach((x) => { x.unread = false; }); setNotifs((ns) => ns.map((x) => ({ ...x, unread: false }))); };

    return (
      <div style={{ background: 'var(--surface-page)', minHeight: '100%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 24px 56px', display: 'grid', gridTemplateColumns: '232px minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>

          {/* ---- Sidebar ---- */}
          <aside style={{ position: 'sticky', top: 96 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 16 }}>
              <Avatar name={USER.name} src={provider !== 'email' ? USER.avatarUrl : null} size={48} />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER.name}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 1 }}>
                  {provider === 'google' ? <><GoogleG size={11} /> Tài khoản Google</> : provider === 'apple' ? <><AppleLogo size={11} /> Tài khoản Apple</> : <><Icon name="mail" size={12} /> Tài khoản Email</>}
                </div>
              </div>
            </div>

            {/* demo: switch account type to see how the nav/profile differs */}
            <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '9px 11px', marginBottom: 14 }}>
              <div style={{ font: '600 10px var(--font-sans)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 7 }}>Demo · loại tài khoản</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['email', 'Email'], ['google', 'Google'], ['apple', 'Apple']].map(([id, label]) => {
                  const on = provider === id;
                  return (
                    <button key={id} onClick={() => { setProvider(id); }} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 32, borderRadius: 'var(--radius-sm)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary-tint)' : '#fff', color: on ? 'var(--orange-700)' : 'var(--text-body)', font: '600 11.5px var(--font-sans)', cursor: 'pointer' }}>
                      {id === 'google' ? <GoogleG size={12} /> : id === 'apple' ? <AppleLogo size={12} /> : <Icon name="mail" size={12} />}{label}
                    </button>
                  );
                })}
              </div>
            </div>
            {MENU.map((sec, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                {sec.group && <div style={{ font: '700 11px var(--font-sans)', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '0 8px 8px' }}>{sec.group}</div>}
                {sec.items.map((m) => {
                  const on = m.id === view;
                  const badge = m.id === 'notifications' ? notifUnread : m.id === 'vouchers' ? VOUCHERS.filter((x) => x.saved && x.status === 'active').length : m.badge;
                  const name = m.id === 'password' ? (hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu') : m.name;
                  return (
                    <div key={m.id} onClick={() => setView(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: on ? 'var(--orange-600)' : 'var(--text-body)', background: on ? 'var(--orange-50)' : 'transparent', font: on ? 'var(--weight-semibold) var(--text-sm) var(--font-sans)' : 'var(--type-body-sm)' }}>
                      <Icon name={m.icon} size={17} />
                      <span style={{ flex: 1 }}>{name}</span>
                      {badge ? <span style={{ font: '700 11px var(--font-sans)', color: '#fff', background: 'var(--flash-500)', borderRadius: 9, minWidth: 18, height: 18, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{badge}</span> : null}
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 6, paddingTop: 10 }}>
              <div onClick={() => setLogoutOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--red-600)', font: 'var(--type-body-sm)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--red-50, #FDECEA)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <Icon name="log-out" size={17} /><span style={{ flex: 1 }}>Đăng xuất</span>
              </div>
            </div>
          </aside>

          {/* ---- Main panel ---- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
            {view === 'orders' && <OrdersPanel orders={orders} reviewedIds={reviewedIds} onTrack={onTrack} onChat={onChat} onReview={onReview} onConfirm={confirmReceipt} onBuyAgain={onBuyAgain} onPay={setPayIds} onCancel={(ids) => { setCancelWhy(CANCEL_REASONS[0]); setCancelIds(ids); }} />}
            {view === 'notifications' && <NotificationsPanel notifs={notifs} unread={notifUnread} onOpen={openNotif} onMarkAll={markAllRead} />}
            {view === 'profile' && <ProfilePanel key={provider} provider={provider} onSetPassword={() => setView('password')} onDeleted={onLogout} />}
            {view === 'address' && <AddressPanel onAdd={() => setAddrOpen(true)} />}
            {view === 'password' && <PasswordPanel key={provider} provider={provider} />}
            {view === 'devices' && <DevicesPanel />}
            {view === 'vouchers' && <VouchersPanel onUse={() => onGo && onGo('cart')} />}
            {view === 'coins' && <CoinsPanel />}
            {view === 'wishlist' && <WishlistPanel onOpen={onOpen} onBuyAgain={onBuyAgain} />}
            {view === 'follow' && <FollowsPanel onShop={onShop} />}
          </div>
        </div>

        {window.LZAddressModal && <window.LZAddressModal open={addrOpen} onClose={() => setAddrOpen(false)} selectedId={(ADDRESSES.find((a) => a.default) || {}).id} onSelect={() => setAddrOpen(false)} />}

        <Modal open={!!notifDetail} onClose={() => setNotifDetail(null)} title="Chi tiết thông báo" footer={<Button onClick={() => setNotifDetail(null)}>Đã hiểu</Button>}>
          {notifDetail && (
            <div>
              <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{notifDetail.title}</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', margin: '4px 0 12px' }}>{notifDetail.date}</div>
              <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.6 }}>{notifDetail.body}</div>
            </div>
          )}
        </Modal>

        <Modal open={!!cancelIds} onClose={() => setCancelIds(null)} title="Xác nhận huỷ đơn hàng"
          footer={<><Button variant="ghost" onClick={() => setCancelIds(null)}>Không</Button><Button variant="danger" onClick={doCancel}>Xác nhận huỷ</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: 12 }}>Bạn có chắc muốn huỷ {cancelIds && cancelIds.length > 1 ? 'nhóm ' + cancelIds.length + ' đơn hàng' : 'đơn hàng'} này không? Quá trình này không thể hoàn tác, xu và voucher (nếu có) sẽ được hoàn lại.{cancelPaid && ' Số tiền đã thanh toán được hoàn về phương thức gốc.'}</div>
          <Select label="Lý do huỷ đơn" value={cancelWhy} onChange={(e) => setCancelWhy(e.target.value)}>{CANCEL_REASONS.map((r) => <option key={r}>{r}</option>)}</Select>
        </Modal>

        <window.LZPayModal open={!!payIds} amount={payTotal} code={payIds ? 'LZD' + payIds[0].replace(/\D/g, '') : ''} onClose={() => setPayIds(null)} onPaid={payOrders} />

        <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Đăng xuất"
          footer={<><Button variant="ghost" onClick={() => setLogoutOpen(false)}>Huỷ</Button><Button variant="danger" iconLeft="log-out" onClick={() => { setLogoutOpen(false); onLogout && onLogout(); }}>Đăng xuất</Button></>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 'min(420px, 80vw)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="log-out" size={20} /></div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc muốn đăng xuất khỏi tài khoản <b>{USER.name}</b> trên thiết bị này?</div>
          </div>
        </Modal>
      </div>
    );
  }

  /* ============================== ORDERS ============================== */
  function OrdersPanel({ orders, reviewedIds, onTrack, onChat, onReview, onConfirm, onBuyAgain, onPay, onCancel }) {
    const [tab, setTab] = React.useState('all');
    const active = TABS.find((t) => t.value === tab);
    const list = tab === 'all' ? orders : orders.filter((o) => active.match.includes(o.status));
    // orders paid together (same checkout session, not yet shipped) show as one group
    const rows = [];
    list.forEach((o) => {
      const grouped = o.sessionId && o.pay !== 'COD' && ['PENDING_PAYMENT', 'CANCELLED'].includes(o.status);
      const hit = grouped && rows.find((r) => r.sessionId === o.sessionId && r.orders[0].status === o.status);
      if (hit) hit.orders.push(o); else rows.push({ key: o.id, sessionId: grouped ? o.sessionId : null, orders: [o] });
    });
    const handlers = { onTrack, onChat, onReview, onConfirm, onBuyAgain, onPay, onCancel };
    return (
      <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px 0' }}>
          <PanelHead icon="package" title="Đơn mua" />
          <Tabs value={tab} onChange={setTab} items={TABS.map((t) => ({ id: t.value, label: t.label }))} />
        </div>
        <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--surface-sunken)' }}>
          {list.length === 0 ? <Empty icon="package" text="Chưa có đơn hàng nào ở mục này" />
            : rows.map((r) => (r.orders.length > 1
              ? <OrderGroup key={r.key} orders={r.orders} {...handlers} />
              : <OrderCard key={r.key} o={r.orders[0]} reviewed={reviewedIds.includes(r.orders[0].id)} {...handlers} />))}
        </div>
      </section>
    );
  }

  function OrderGroup({ orders, onTrack, onBuyAgain, onPay, onCancel }) {
    const cancelled = orders[0].status === 'CANCELLED';
    const sum = (k) => orders.reduce((n, o) => n + (o[k] || 0), 0);
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
          <Icon name="package" size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{cancelled ? 'Nhóm đơn hàng đã hủy' : 'Nhóm đơn hàng chờ thanh toán'}</span>
          <span style={{ marginLeft: 'auto' }}><StatusBadge status={orders[0].status} label={cancelled ? 'Đã hủy' : 'Chờ thanh toán'} /></span>
        </div>
        {orders.map((o, i) => (
          <div key={o.id} style={{ borderBottom: i < orders.length - 1 ? '1px dashed var(--border-subtle)' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px' }}>
              <VendorChip name={V[o.vendorId].name} mall={V[o.vendorId].mall} />
              <span className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-subtle)', marginLeft: 'auto' }}>{o.id}</span>
            </div>
            <div style={{ padding: '0 16px 12px' }}>
              {o.items.map((it, j) => (
                <div key={j} onClick={() => onTrack && onTrack(o.id)} style={{ display: 'flex', gap: 12, padding: '8px 0', cursor: 'pointer' }}>
                  <img src={it.img} alt="" width="50" height="50" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none', border: '1px solid var(--border-subtle)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Phân loại: {it.variant}</div>
                  </div>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-price)', flex: 'none' }}>{fmt(it.price)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!cancelled && (
          <div style={{ padding: '8px 16px', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 3, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tiền hàng</span><span>{fmt(sum('subtotal'))}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Phí vận chuyển</span><span>+{fmt(sum('shipping'))}</span></div>
            {sum('discount') > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mint-600)' }}><span>Giảm giá (Voucher + Xu)</span><span>-{fmt(sum('discount'))}</span></div>}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px 12px', padding: '12px 16px', background: 'var(--orange-50)' }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Tổng thanh toán ({orders.length} đơn):</span>
          <span style={{ font: '800 20px var(--font-sans)', color: 'var(--text-price)', marginRight: 'auto' }}>{fmt(sum('total'))}</span>
          {cancelled
            ? <Button size="sm" onClick={() => onBuyAgain && onBuyAgain(orders.flatMap((o) => o.items))}>Mua lại tất cả</Button>
            : <><Button size="sm" onClick={() => onPay(orders.map((o) => o.id))}>Thanh toán ngay</Button><Button size="sm" variant="ghost" onClick={() => onCancel(orders.map((o) => o.id))}>Huỷ nhóm đơn</Button></>}
        </div>
      </div>
    );
  }

  function OrderCard({ o, reviewed, onTrack, onChat, onReview, onConfirm, onBuyAgain, onPay, onCancel }) {
    const v = V[o.vendorId];
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <VendorChip name={v.name} mall={v.mall} />
          <span className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-subtle)' }}>{o.id}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {o.tracking && o.tracking.shipStatus === 'DELIVERED' && o.status === 'DELIVERED' &&
              <span style={{ font: 'var(--type-caption)', color: 'var(--mint-600)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="truck" size={14} />Giao thành công</span>}
            <Badge variant="neutral">{o.pay}</Badge>
            <StatusBadge status={window.LZ.badgeStatus(o.status)} label={STATUS_VI[o.status]} />
          </span>
        </div>
        <div style={{ padding: '6px 16px' }}>
          {o.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < o.items.length - 1 ? '1px solid var(--border-subtle)' : 0 }}>
              <img src={it.img} alt="" width="60" height="60" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none', border: '1px solid var(--border-subtle)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>Phân loại: {it.variant}</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>x{it.qty}</div>
              </div>
              <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-price)', flex: 'none' }}>{fmt(it.price)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px 12px', padding: '12px 16px', background: 'var(--orange-50)' }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Thành tiền:</span>
          <span style={{ font: '800 20px var(--font-sans)', color: 'var(--text-price)', marginRight: 'auto' }}>{fmt(o.total)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Actions o={o} reviewed={reviewed} onTrack={onTrack} onChat={onChat} onReview={onReview} onConfirm={onConfirm} onBuyAgain={onBuyAgain} onPay={onPay} onCancel={onCancel} />
          </div>
        </div>
      </div>
    );
  }
  function Actions({ o, reviewed, onTrack, onChat, onReview, onConfirm, onBuyAgain, onPay, onCancel }) {
    const t = (fn, a) => () => fn && fn(a);
    const track = <Button size="sm" variant="outline" iconLeft="truck" onClick={t(onTrack, o.id)}>Theo dõi đơn</Button>;
    const chat = <Button size="sm" variant="ghost" iconLeft="message-circle" onClick={t(onChat, o.vendorId)}>Liên hệ Shop</Button>;
    const again = <Button size="sm" variant="outline" onClick={() => onBuyAgain && onBuyAgain(o.items)}>Mua lại</Button>;
    if (o.status === 'PENDING_PAYMENT' && o.pay === 'COD') return <><Button size="sm" variant="outline" iconLeft="clock" disabled>Chờ shop xác nhận</Button><Button size="sm" variant="ghost" onClick={() => onCancel([o.id])}>Huỷ đơn</Button></>;
    if (o.status === 'PENDING_PAYMENT') return <><Button size="sm" onClick={() => onPay([o.id])}>Thanh toán ngay</Button><Button size="sm" variant="ghost" onClick={() => onCancel([o.id])}>Huỷ đơn</Button></>;
    if (o.status === 'PAID' || o.status === 'CONFIRMED' || o.status === 'PREPARING') return <>{track}{chat}<Button size="sm" variant="ghost" style={{ color: 'var(--red-600)' }} onClick={() => onCancel([o.id])}>Huỷ đơn</Button></>;
    if (o.status === 'RETURN_REQUESTED') return <><Button size="sm" iconLeft="undo-2" onClick={t(onTrack, o.id)}>Xem yêu cầu trả hàng</Button>{chat}</>;
    if (o.status === 'READY_FOR_PICKUP' || o.status === 'DELIVERING') return <><Button size="sm" iconLeft="truck" onClick={t(onTrack, o.id)}>Theo dõi đơn</Button>{chat}</>;
    if (o.status === 'DELIVERED') return <><Button size="sm" iconLeft="check" onClick={t(onConfirm, o.id)}>Đã nhận hàng</Button><Button size="sm" variant="outline" iconLeft="undo-2" onClick={t(onTrack, o.id)}>Trả hàng</Button>{track}</>;
    if (o.status === 'COMPLETED') return <>{reviewed ? <Button size="sm" iconLeft="star" disabled>Đã đánh giá</Button> : <Button size="sm" iconLeft="star" onClick={t(onReview, o.id)}>Đánh giá</Button>}{again}{chat}</>;
    return <>{again}{chat}</>;
  }

  /* ============================== PROFILE ============================== */
  function ProfilePanel({ provider, onSetPassword, onDeleted }) {
    const [delOpen, setDelOpen] = React.useState(false);
    const [delOtp, setDelOtp] = React.useState(false);
    const [delCode, setDelCode] = React.useState('');
    const [delTries, setDelTries] = React.useState(0);
    const closeDel = () => { setDelOpen(false); setDelOtp(false); setDelCode(''); setDelTries(0); };
    const confirmDelete = () => {
      if (delCode === OTP_DEMO) { closeDel(); USER.deleteRequested = true; setDelPending(true); toast('Đã ghi nhận yêu cầu xóa tài khoản. Email xác nhận kèm hạn 30 ngày đã được gửi'); return; }
      if (delTries + 1 >= 5) { closeDel(); toast('Sai OTP quá 5 lần, tài khoản được giữ nguyên', 'error'); return; }
      setDelTries(delTries + 1);
    };
    const [delPending, setDelPending] = React.useState(!!USER.deleteRequested);
    const [activeOrders, setActiveOrders] = React.useState(() => ORDERS.filter((o) => ACTIVE_STATUSES.includes(o.status)).map((o) => o.id));
    const [avatar, setAvatar] = React.useState(null);
    const fileRef = React.useRef(null);
    const pickAvatar = (e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (f.size > 1024 * 1024) { toast('Ảnh vượt quá dung lượng 1MB. Vui lòng chọn ảnh nhỏ hơn.', 'error'); return; }
      setAvatar(URL.createObjectURL(f));
    };
    const prov = provider || USER.authProvider || 'email';
    const isSSO = prov !== 'email';
    const provName = prov === 'apple' ? 'Apple' : 'Google';
    const ProvIcon = prov === 'apple' ? AppleLogo : GoogleG;
    // SSO accounts come with no phone / birthday filled in (like Shopee).
    const [f, setF] = React.useState({ name: USER.name, email: USER.email, phone: isSSO ? '' : USER.phone, gender: isSSO ? '' : USER.gender, dob: isSSO ? '' : '1996-08-12', bio: isSSO ? '' : USER.bio, lang: window.LZI18n.lang });
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const [saved, setSaved] = React.useState(false);
    const [emailHint, setEmailHint] = React.useState(false);
    return (
      <section style={card}>
        <PanelHead icon="user" title="Hồ sơ của tôi" sub="Quản lý thông tin để bảo mật tài khoản" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 28, marginTop: 18, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Họ và tên" value={f.name} onChange={(e) => set('name', e.target.value)} />
            <div>
              <label style={lab}>Email</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{f.email}</span>
                <Badge variant="mint" icon="badge-check">Đã xác minh</Badge>
                {isSSO && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 12px var(--font-sans)', color: 'var(--text-body)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '3px 10px' }}><ProvIcon size={13} /> Liên kết {provName}</span>}
                <span style={linkS} onClick={() => setEmailHint((v) => !v)}>Thay đổi</span>
              </div>
              {isSSO && emailHint && (
                <div style={{ display: 'flex', gap: 9, marginTop: 8, padding: '11px 13px', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)' }}>
                  <Icon name="info" size={16} style={{ color: 'var(--blue-600)', flex: 'none', marginTop: 1 }} />
                  <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>
                    Đổi sang email khác yêu cầu <b style={{ color: 'var(--blue-600)', cursor: 'pointer' }} onClick={onSetPassword}>thiết lập mật khẩu</b> trước. Sau đó bạn có thể đăng nhập bằng <b>{provName}</b> (email cũ) hoặc <b>Email + mật khẩu</b> (email mới).
                  </div>
                </div>
              )}
            </div>
            <div>
              <label style={lab}>Số điện thoại</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                {f.phone
                  ? <><span className="code" style={{ font: '14px var(--font-mono)', color: 'var(--text-body)' }}>{f.phone}</span><span style={linkS}>Thay đổi</span></>
                  : <><span style={{ font: 'var(--type-body)', color: 'var(--text-subtle)' }}>Chưa có số điện thoại</span><span style={{ ...linkS, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => set('phone', '0900 000 000')}><Icon name="plus" size={13} />Thêm</span></>}
              </div>
            </div>
            <div>
              <label style={lab}>Giới tính</label>
              <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                {['Nam', 'Nữ', 'Khác', 'Không muốn nói'].map((g) => (
                  <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', font: 'var(--type-body)', color: 'var(--text-body)' }}>
                    <Radio name="gender" checked={f.gender === g} onChange={() => set('gender', g)} />{g}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lab}>Ngày sinh</label>
                <input type="date" value={f.dob} onChange={(e) => set('dob', e.target.value)} style={{ width: '100%', height: 44, marginTop: 6, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: f.dob ? 'var(--text-strong)' : 'var(--text-subtle)' }} />
                {!f.dob && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 5 }}>Chưa thiết lập — chọn ngày để cập nhật.</div>}
              </div>
            </div>
            <Input label="Giới thiệu" value={f.bio} onChange={(e) => set('bio', e.target.value)} />
            <div>
              <label style={lab}>Ngôn ngữ</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {[{ id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }, { id: 'en', label: 'English', flag: '🇬🇧' }].map((l) => {
                  const on = f.lang === l.id;
                  return (
                    <button key={l.id} type="button" onClick={() => { set('lang', l.id); window.LZI18n.set(l.id); }} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary-tint)' : '#fff', color: on ? 'var(--orange-700)' : 'var(--text-body)', font: (on ? '600 ' : '500 ') + '14px var(--font-sans)', cursor: 'pointer' }}>
                      <span style={{ fontSize: 17 }}>{l.flag}</span>{l.label}
                      {on && <Icon name="check" size={16} style={{ marginLeft: 2 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            {delPending && <div role="status" style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', borderRadius: 'var(--radius-md)', padding: '10px 12px', font: 'var(--type-body-sm)' }}><Icon name="clock" size={16} style={{ flex: 'none' }} />Tài khoản sẽ được ẩn danh sau 30 ngày. Bạn có thể hủy yêu cầu trong thời gian này.</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <Button iconLeft="check" onClick={() => { if (!f.name.trim()) { toast('Vui lòng nhập Họ và tên trước khi lưu.', 'error'); return; } setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Lưu thay đổi</Button>
              {delPending
                ? <Button variant="outline" iconLeft="undo-2" onClick={() => { USER.deleteRequested = false; setDelPending(false); toast('Đã hủy yêu cầu xóa, tài khoản trở lại bình thường'); }}>Hủy yêu cầu xóa</Button>
                : <Button variant="danger" iconLeft="trash-2" onClick={() => setDelOpen(true)}>Xóa tài khoản</Button>}
              {saved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--mint-600)', font: 'var(--type-body-sm)' }}><Icon name="circle-check" size={16} />Đã lưu hồ sơ</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 28 }}>
            <Avatar name={USER.name} src={avatar || (isSSO ? USER.avatarUrl : null)} size={104} />
            <input ref={fileRef} type="file" hidden accept="image/jpeg, image/png" onChange={pickAvatar} />
            <Button variant="outline" iconLeft="upload" onClick={() => fileRef.current.click()}>Chọn ảnh</Button>
            <p style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>Định dạng JPG, PNG.<br />Tối đa 1 MB.</p>
          </div>
        </div>
        <Modal open={delOpen} onClose={closeDel} title="Xóa tài khoản"
          footer={activeOrders.length
            ? <><Button variant="ghost" onClick={closeDel}>Đóng</Button><Button variant="secondary" onClick={() => setActiveOrders([])}>Mô phỏng: đã hoàn tất các đơn</Button></>
            : delOtp
              ? <><Button variant="ghost" onClick={closeDel}>Huỷ</Button><Button variant="danger" iconLeft="trash-2" disabled={delCode.length < 6} onClick={confirmDelete}>Xác nhận xóa</Button></>
              : <><Button variant="ghost" onClick={closeDel}>Huỷ</Button><Button variant="danger" iconLeft="mail" onClick={() => setDelOtp(true)}>Gửi mã OTP</Button></>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 'min(420px, 80vw)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="triangle-alert" size={20} /></div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>{activeOrders.length
              ? <>Bạn còn đơn đang xử lý, cần hoàn tất trước khi xóa tài khoản:<ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>{activeOrders.map((id) => <li key={id} className="code">{id}</li>)}</ul></>
              : <>Hành động này không thể hoàn tác sau 30 ngày. Hồ sơ của <b>{USER.name}</b> sẽ được ẩn danh, voucher và Xu bị hủy. Trong 30 ngày, đăng nhập lại và bấm "Hủy yêu cầu xóa" để giữ tài khoản.</>}</div>
          </div>
          {delOtp && !activeOrders.length && <div style={{ marginTop: 14 }}>
            <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', marginBottom: 10 }}>Nhập mã OTP gửi tới <b>{maskEmail(USER.email)}</b> (demo: <span className="code">{OTP_DEMO}</span>)</div>
            <OtpBoxes onChange={setDelCode} />
            {delTries > 0 && <div style={{ color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 8 }}>Mã không đúng. Còn {5 - delTries} lần thử.</div>}
          </div>}
        </Modal>
      </section>
    );
  }

  /* ============================== ADDRESS ============================== */
  function AddressPanel({ onAdd }) {
    const [list, setList] = React.useState(ADDRESSES);
    const [delAddr, setDelAddr] = React.useState(null);
    const makeDefault = (id) => setList((l) => l.map((x) => ({ ...x, default: x.id === id })));
    return (
      <section style={card}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PanelHead icon="map-pin" title="Sổ địa chỉ" sub="Quản lý địa chỉ nhận hàng của bạn" />
          <Button iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={onAdd}>Thêm địa chỉ mới</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {list.map((a) => (
            <div key={a.id} style={{ display: 'flex', gap: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <Icon name="map-pin" size={18} style={{ color: 'var(--text-subtle)', marginTop: 2, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{a.recipient}</span>
                  <span style={{ width: 1, height: 12, background: 'var(--border-strong)' }} />
                  <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-muted)' }}>{a.phone}</span>
                  {a.label && <span style={{ font: '600 11px var(--font-sans)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: '2px 9px' }}>{a.label}</span>}
                  {a.default && <span style={{ font: '600 11px var(--font-sans)', color: 'var(--orange-600)', border: '1px solid var(--orange-200)', borderRadius: 4, padding: '1px 7px' }}>Mặc định</span>}
                </div>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>{a.line}, {a.ward}, {a.district}, {a.city}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={linkS} onClick={onAdd}>Sửa</span>
                  {!a.default && <span style={{ ...linkS, color: 'var(--red-600)' }} onClick={() => setDelAddr(a)}>Xoá</span>}
                </div>
                <Button size="sm" variant="outline" disabled={a.default} onClick={() => makeDefault(a.id)}>Thiết lập mặc định</Button>
              </div>
            </div>
          ))}
        </div>
        <Modal open={!!delAddr} onClose={() => setDelAddr(null)} title="Xoá địa chỉ"
          footer={<><Button variant="ghost" onClick={() => setDelAddr(null)}>Huỷ</Button><Button variant="danger" onClick={() => { setList((l) => l.filter((x) => x.id !== delAddr.id)); setDelAddr(null); }}>Xoá</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>Bạn có chắc muốn xoá địa chỉ này?</div>
        </Modal>
      </section>
    );
  }

  /* ============================== PASSWORD ============================== */
  function PasswordPanel({ provider }) {
    const hasPw = (provider || USER.authProvider) === 'email';
    const [f, setF] = React.useState({ cur: '', nw: '', cf: '' });
    const [err, setErr] = React.useState({});
    const [stage, setStage] = React.useState('form'); // form | otp | done
    const [otp, setOtp] = React.useState('');
    const [resend, setResend] = React.useState(0);
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const strength = pwStrength(f.nw);
    // current password is checked as you type (mock: anything of 6+ characters passes)
    const [curCheck, setCurCheck] = React.useState(null); // null | 'checking' | 'ok' | 'bad'
    React.useEffect(() => {
      if (!f.cur) { setCurCheck(null); return undefined; }
      setCurCheck('checking');
      const t = setTimeout(() => setCurCheck(f.cur.length >= 6 ? 'ok' : 'bad'), 500);
      return () => clearTimeout(t);
    }, [f.cur]);

    React.useEffect(() => {
      if (stage !== 'otp' || resend <= 0) return;
      const t = setInterval(() => setResend((s) => (s > 0 ? s - 1 : 0)), 1000);
      return () => clearInterval(t);
    }, [stage, resend]);

    const submit = () => {
      const e = {};
      if (hasPw && !f.cur) e.cur = 'Nhập mật khẩu hiện tại';
      if (f.nw.length < 8) e.nw = 'Tối thiểu 8 ký tự';
      else if (!/[A-Z]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ hoa';
      else if (!/[a-z]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ thường';
      else if (!/[0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ số';
      else if (!/[^A-Za-z0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 ký tự đặc biệt';
      else if (hasPw && f.nw === f.cur) e.nw = 'Mật khẩu mới phải khác mật khẩu hiện tại';
      if (f.cf !== f.nw) e.cf = 'Mật khẩu nhập lại không khớp';
      setErr(e);
      if (Object.keys(e).length === 0) { setStage('otp'); setResend(60); setOtp(''); }
    };
    const [otpErr, setOtpErr] = React.useState('');
    const confirm = () => {
      if (otp !== OTP_DEMO) { setOtpErr('Mã OTP không đúng'); return; }
      setOtpErr(''); setStage('done'); setF({ cur: '', nw: '', cf: '' }); setTimeout(() => setStage('form'), 2800);
    };

    return (
      <section style={card}>
        <PanelHead icon="shield-check" title={hasPw ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'} sub={hasPw ? 'Bảo mật tài khoản bằng mật khẩu mạnh' : 'Tạo mật khẩu để đăng nhập bằng email bên cạnh Google SSO'} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 28, marginTop: 18, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {hasPw && <div>
              <PwField label="Mật khẩu hiện tại" value={f.cur} onChange={(v) => set('cur', v)} err={err.cur} />
              {curCheck && <div style={{ font: 'var(--type-caption)', marginTop: 5, color: curCheck === 'ok' ? 'var(--mint-600)' : curCheck === 'bad' ? 'var(--red-600)' : 'var(--text-subtle)' }}>{curCheck === 'ok' ? 'Chính xác' : curCheck === 'bad' ? 'Không chính xác' : 'Đang kiểm tra...'}</div>}
            </div>}
            <div>
              <PwField label="Mật khẩu mới" value={f.nw} onChange={(v) => set('nw', v)} err={err.nw} hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt" />
              {f.nw && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (strength / 4 * 100) + '%', height: '100%', borderRadius: 3, background: PW_COLORS[strength], transition: 'all .3s' }} /></div>
                  <span style={{ font: '600 12px var(--font-sans)', color: PW_COLORS[strength], minWidth: 64 }}>{PW_LABELS[strength]}</span>
                </div>
              )}
            </div>
            <div>
              <PwField label="Nhập lại mật khẩu mới" value={f.cf} onChange={(v) => set('cf', v)} err={err.cf} />
              {f.cf && !err.cf && <div style={{ font: 'var(--type-caption)', marginTop: 5, color: f.cf === f.nw ? 'var(--mint-600)' : 'var(--red-600)' }}>{f.cf === f.nw ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}</div>}
            </div>

            {stage === 'form' && <div><Button iconLeft="check" onClick={submit}>{hasPw ? 'Cập nhật mật khẩu' : 'Thiết lập mật khẩu'}</Button></div>}

            {stage === 'otp' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, animation: 'lzSlideDown .25s var(--ease-out)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="mail" size={16} style={{ color: 'var(--orange-500)' }} />
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Mã xác nhận đã gửi đến <b>{maskEmail(USER.email)}</b> (demo: <span className="code">{OTP_DEMO}</span>)</span>
                </div>
                <OtpBoxes onChange={setOtp} />
                {otpErr && <div style={{ color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 8 }}>{otpErr}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  <Button iconLeft="check" disabled={otp.length < 6} onClick={confirm}>Xác nhận đổi mật khẩu</Button>
                  <Button variant="ghost" onClick={() => setStage('form')}>Huỷ</Button>
                  <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{resend > 0 ? `Gửi lại mã sau ${resend}s` : <a style={{ color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setResend(60)}>Gửi lại mã</a>}</span>
                </div>
              </div>
            )}

            {stage === 'done' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--mint-600)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', background: 'var(--mint-50)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}><Icon name="circle-check" size={18} />{hasPw ? 'Đổi mật khẩu thành công' : 'Thiết lập mật khẩu thành công'}</div>}
          </div>

          {/* security tips */}
          <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}><Icon name="shield-check" size={18} style={{ color: 'var(--mint-600)' }} /><span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Mẹo bảo mật</span></div>
            {['Không dùng mật khẩu giống nhau cho nhiều trang', 'Kết hợp chữ hoa, số và ký tự đặc biệt', 'Không dùng thông tin cá nhân (tên, ngày sinh)', 'Đổi mật khẩu định kỳ 3–6 tháng'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 9 }}>
                <Icon name="check" size={15} style={{ color: 'var(--mint-600)', flex: 'none', marginTop: 2 }} />
                <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  function PwField({ label, value, onChange, err, hint }) {
    const [show, setShow] = React.useState(false);
    return (
      <div>
        <label style={lab}>{label}</label>
        <div style={{ position: 'relative', marginTop: 6 }}>
          <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', height: 44, border: '1.5px solid ' + (err ? 'var(--red-500)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', padding: '0 42px 0 14px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' }} />
          <button onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 6, top: 6, width: 32, height: 32, border: 0, background: 'transparent', color: 'var(--text-subtle)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name={show ? 'eye-off' : 'eye'} size={18} /></button>
        </div>
        {err ? <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{err}</div>
          : hint ? <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 5 }}>{hint}</div> : null}
      </div>
    );
  }

  /* ============================== VOUCHERS ============================== */
  function VouchersPanel({ onUse }) {
    const [mode, setMode] = React.useState('active'); // active | history
    const [tab, setTab] = React.useState('all');
    const [histTab, setHistTab] = React.useState('expired');
    const [rows, setRows] = React.useState(VOUCHERS);
    const [code, setCode] = React.useState('');
    const [detail, setDetail] = React.useState(null);
    const [del, setDel] = React.useState(null);
    const isLive = (v) => v.status === 'active' || v.status === 'upcoming';
    const live = rows.filter(isLive);
    const count = (k) => live.filter((v) => v.kind === k).length;
    const list = mode === 'history'
      ? rows.filter((v) => v.status === (histTab === 'used' ? 'used' : 'expired'))
      : tab === 'all' ? live : live.filter((v) => v.kind === tab);

    const setSaved = (id, saved) => {
      const v = VOUCHERS.find((x) => x.id === id); if (v) v.saved = saved;
      setRows((rs) => rs.map((x) => (x.id === id ? { ...x, saved } : x)));
    };
    const saveCode = () => {
      const v = rows.find((x) => x.code === code.trim().toUpperCase() && isLive(x));
      if (!v) { toast('Mã voucher không tồn tại hoặc đã hết hạn.', 'error'); return; }
      if (v.saved) { toast('Voucher đã được lưu trước đó', 'error'); return; }
      setSaved(v.id, true); setCode(''); toast('Lưu voucher thành công!');
    };
    const bar = (pct) => (pct >= 100 ? 'var(--text-subtle)' : pct >= 80 ? 'var(--red-500)' : pct >= 55 ? 'var(--amber-500)' : 'var(--mint-500)');
    const rule = (v) => (v.categories ? { text: 'Chỉ áp dụng danh mục ' + v.categories.join(', '), color: 'var(--mint-600)' } : v.excluded ? { text: 'Ngoại trừ danh mục ' + v.excluded.join(', '), color: 'var(--red-600)' } : null);

    return (
      <section style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {mode === 'history' && <button onClick={() => setMode('active')} aria-label="Quay lại" style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 4, marginRight: 6, color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><Icon name="arrow-left" size={20} /></button>}
          <PanelHead icon="ticket" title={mode === 'history' ? 'Lịch sử voucher' : 'Kho Voucher'} sub={mode === 'history' ? 'Voucher đã dùng hoặc đã hết hạn' : `Bạn đang có ${live.filter((v) => v.saved).length} voucher khả dụng`} />
          {mode === 'active' && <span style={{ ...linkS, marginLeft: 'auto' }} onClick={() => setMode('history')}>Xem lịch sử voucher</span>}
        </div>
        {mode === 'active' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 14px', margin: '14px 0 4px' }}>
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Mã Voucher</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveCode()} placeholder="Nhập mã voucher tại đây" style={{ flex: 1, minWidth: 0, height: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 10px', font: 'var(--type-body-sm)', outline: 'none', background: '#fff' }} />
            <Button size="sm" disabled={!code.trim()} onClick={saveCode}>Lưu</Button>
          </div>
        )}
        <div style={{ marginTop: 4 }}>
          {mode === 'active'
            ? <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: `Tất cả (${live.length})` }, { id: 'platform', label: `Voucher Sàn (${count('platform')})` }, { id: 'shop', label: `Voucher Shop (${count('shop')})` }, { id: 'freeship', label: `Freeship (${count('freeship')})` }]} />
            : <Tabs value={histTab} onChange={setHistTab} items={[{ id: 'expired', label: 'Hết hiệu lực' }, { id: 'used', label: 'Đã sử dụng' }]} />}
        </div>
        {list.length === 0 && <Empty icon="ticket" text="Chưa có voucher nào trong mục này" />}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginTop: 16 }}>
          {list.map((v) => {
            const pct = v.limit ? Math.min(100, Math.round(v.used / v.limit * 100)) : 0;
            const old = mode === 'history';
            const r = rule(v);
            return (
              <div key={v.id} onClick={() => setDetail(v)} style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#fff', cursor: 'pointer', opacity: old ? 0.72 : 1 }}>
                <div style={{ position: 'relative', width: 96, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#fff', background: old ? 'var(--gray-400)' : v.kind === 'freeship' ? 'var(--mint-500)' : v.kind === 'shop' ? 'var(--flash-500)' : 'var(--orange-500)' }}>
                  {old && <span style={{ position: 'absolute', top: 4, left: 4, padding: '2px 4px', borderRadius: 4, background: 'rgba(0,0,0,.3)', font: '600 10px var(--font-sans)' }}>{v.status === 'used' ? 'Đã dùng' : 'Hết hạn'}</span>}
                  <Icon name={v.kind === 'freeship' ? 'truck' : v.kind === 'shop' ? 'store' : 'ticket'} size={22} />
                  <span style={{ font: '800 17px var(--font-sans)' }}>{v.amount}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0, padding: '12px 14px' }}>
                  <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{v.label}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{v.cond} · {v.scope}</div>
                  {r && <div style={{ font: '600 11px var(--font-sans)', color: r.color, marginTop: 2 }}>{r.text}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
                    <span style={{ font: 'var(--type-caption)', color: v.status === 'upcoming' ? 'var(--amber-600)' : old ? 'var(--text-muted)' : 'var(--flash-600)' }}>{v.status === 'upcoming' ? 'Có hiệu lực: ' + v.validFrom : 'HSD: ' + v.expiry}</span>
                    {!old && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {v.saved && <button aria-label="Xoá voucher" onClick={(e) => { e.stopPropagation(); setDel(v); }} style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="trash-2" size={16} /></button>}
                      {!v.saved ? <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSaved(v.id, true); toast('Lưu voucher thành công!'); }}>Lưu</Button>
                        : v.status === 'upcoming' ? <Button size="sm" disabled>Chưa tới giờ</Button>
                          : <Button size="sm" onClick={(e) => { e.stopPropagation(); onUse && onUse(); }}>Dùng ngay</Button>}
                    </span>}
                  </div>
                  {!old && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ height: 4, borderRadius: 999, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: pct + '%', height: '100%', background: bar(pct) }} /></div>
                      <div style={{ marginTop: 3, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{v.used.toLocaleString('vi-VN')}/{v.limit ? v.limit.toLocaleString('vi-VN') : '∞'} lượt đã dùng</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Modal open={!!detail} onClose={() => setDetail(null)} title="Chi tiết voucher" footer={<Button onClick={() => setDetail(null)}>Đã hiểu</Button>}>
          {detail && (
            <div style={{ display: 'grid', gap: 12 }}>
              {[['Mã voucher', detail.code], ['Ưu đãi', detail.label], ['Nhà tài trợ', detail.sponsor], ['Điều kiện', detail.cond], ['Phạm vi', rule(detail) ? rule(detail).text : detail.scope], ['Hạn sử dụng', detail.validFrom + ' - ' + detail.expiry]].map(([k, val]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, font: 'var(--type-body-sm)' }}><span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{val}</span></div>
              ))}
              <div style={{ display: 'grid', gap: 6, font: 'var(--type-body-sm)' }}><span style={{ color: 'var(--text-muted)' }}>Nội dung voucher</span><div style={{ color: 'var(--text-strong)', lineHeight: 1.6 }}>{detail.content}</div></div>
            </div>
          )}
        </Modal>
        <Modal open={!!del} onClose={() => setDel(null)} title="Xác nhận xoá"
          footer={<><Button variant="ghost" onClick={() => setDel(null)}>Huỷ</Button><Button variant="danger" onClick={() => { setSaved(del.id, false); setDel(null); toast('Đã xoá voucher khỏi kho'); }}>Xoá</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-strong)' }}>Bạn có chắc chắn muốn xoá voucher <b>{del && del.label}</b> khỏi kho không?</div>
        </Modal>
      </section>
    );
  }

  /* ============================== COINS ============================== */
  const XU_REWARDS = [{ xu: 500, value: 5000 }, { xu: 1000, value: 10000 }, { xu: 2000, value: 20000 }];
  function UntilMidnight() {
    const secs = () => { const n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); return Math.floor((m - n) / 1000); };
    const [t, setT] = React.useState(secs);
    React.useEffect(() => { const i = setInterval(() => setT(secs()), 1000); return () => clearInterval(i); }, []);
    const p = (x) => String(x).padStart(2, '0');
    return <span className="code">{p(Math.floor(t / 3600))}:{p(Math.floor(t / 60) % 60)}:{p(t % 60)}</span>;
  }
  function CoinsPanel() {
    const [redeem, setRedeem] = React.useState(false);
    const [streak, setStreak] = React.useState(3);
    const [checked, setChecked] = React.useState(false);
    const [balance, setBalance] = React.useState(USER.coins);
    const [log, setLog] = React.useState(COIN_LOG);
    const checkin = () => {
      const reward = streak + 1 === 7 ? 1000 : 100;
      setChecked(true); setStreak((s) => s + 1); setBalance((b) => b + reward); USER.coins += reward;
      setLog((l) => [{ type: 'earn', label: 'Điểm danh hằng ngày', amount: reward, at: 'Hôm nay' }, ...l]);
      toast('Điểm danh thành công! +' + reward.toLocaleString('vi-VN') + ' Xu');
    };
    const redeemXu = (r) => {
      setBalance((b) => b - r.xu); USER.coins -= r.xu;
      const code = 'XU' + r.value / 1000 + 'K' + (VOUCHERS.length + 1);
      VOUCHERS.push({ id: 'x' + (VOUCHERS.length + 1), code, kind: 'platform', amount: '-' + r.value / 1000 + 'k', label: 'Giảm ' + fmt(r.value), cond: 'Đơn từ 50.000₫', expiry: '31/12/2026', validFrom: 'Hôm nay', scope: 'Toàn sàn', type: 'FIXED', value: r.value, min: 50000, saved: true, status: 'active', used: 0, limit: 1, sponsor: 'Đổi từ Lazadee Xu', content: 'Đổi từ ' + r.xu + ' Xu, dùng 1 lần.' });
      setLog((l) => [{ type: 'spend', label: 'Đổi voucher ' + code, amount: -r.xu, at: 'Hôm nay' }, ...l]);
      setRedeem(false); toast('Đã đổi voucher ' + code + ', xem trong Kho Voucher');
    };
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ ...card, background: 'linear-gradient(120deg, var(--gold-600, #E09600), var(--gold-500, #FFB100))', color: '#fff', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="star" size={34} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--type-body-sm)', color: 'rgba(255,255,255,.9)' }}>Số dư Lazadee Xu</div>
            <div style={{ font: '800 34px var(--font-sans)', lineHeight: 1.1 }}>{balance.toLocaleString('vi-VN')} <span style={{ fontSize: 18, fontWeight: 600 }}>Xu</span></div>
            <div style={{ font: 'var(--type-caption)', color: 'rgba(255,255,255,.85)', marginTop: 2 }}>1 Xu = 1₫ khi thanh toán · Xu hết hạn sau 12 tháng · <b>150 Xu</b> sắp hết hạn trong 30 ngày tới</div>
          </div>
          <Button variant="secondary" iconLeft="gift" onClick={() => setRedeem(true)}>Đổi quà</Button>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <PanelHead icon="calendar" title="Điểm danh nhận Xu" />
            {checked && <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Điểm danh lại sau <UntilMidnight /></span>}
            <Button style={{ marginLeft: checked ? 12 : 'auto' }} variant={checked ? 'outline' : 'primary'} iconLeft={checked ? 'check' : 'calendar'} disabled={checked} onClick={checkin}>{checked ? 'Đã điểm danh' : 'Điểm danh nhận Xu'}</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => {
              const state = d <= streak ? 'done' : !checked && d === streak + 1 ? 'today' : 'next';
              return (
                <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', font: '700 12px var(--font-sans)', background: state === 'done' ? 'var(--gold-500)' : state === 'today' ? 'var(--gold-50)' : 'var(--gray-100)', color: state === 'done' ? '#fff' : state === 'today' ? 'var(--gold-700)' : 'var(--text-subtle)', border: '2px solid ' + (state === 'today' ? 'var(--gold-500)' : 'transparent') }}>{state === 'done' ? <Icon name="check" size={20} /> : d === 7 ? '+1k' : '+100'}</div>
                  <span style={{ font: 'var(--type-caption)', color: state === 'today' ? 'var(--gold-700)' : 'var(--text-muted)', fontWeight: state === 'today' ? 600 : 400 }}>Ngày {d}</span>
                </div>
              );
            })}
          </div>
        </div>
        <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px 12px' }}><PanelHead icon="clock" title="Lịch sử Xu" /></div>
          <div>
            {log.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', background: c.type === 'earn' ? 'var(--mint-50)' : 'var(--surface-sunken)', color: c.type === 'earn' ? 'var(--mint-600)' : 'var(--text-muted)' }}><Icon name={c.type === 'earn' ? 'plus' : 'minus'} size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{c.label}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{c.at}</div>
                </div>
                <span style={{ font: '800 16px var(--font-sans)', color: c.amount > 0 ? 'var(--mint-600)' : 'var(--text-muted)' }}>{c.amount > 0 ? '+' : ''}{c.amount} Xu</span>
              </div>
            ))}
          </div>
        </section>
        <Modal open={redeem} onClose={() => setRedeem(false)} width={440} title="Đổi Xu lấy voucher" footer={<Button variant="ghost" onClick={() => setRedeem(false)}>Đóng</Button>}>
          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 10 }}>Số dư: <b style={{ color: 'var(--text-strong)' }}>{balance.toLocaleString('vi-VN')} Xu</b></div>
          {XU_REWARDS.map((r) => (
            <div key={r.xu} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
              <Icon name="ticket" size={20} style={{ color: 'var(--color-primary)' }} />
              <div style={{ flex: 1 }}><div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Voucher giảm {fmt(r.value)}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{r.xu.toLocaleString('vi-VN')} Xu · Đơn từ 50.000₫</div></div>
              <Button size="sm" disabled={balance < r.xu} onClick={() => redeemXu(r)}>{balance < r.xu ? 'Chưa đủ Xu' : 'Đổi'}</Button>
            </div>
          ))}
        </Modal>
      </section>
    );
  }

  /* ============================== WISHLIST ============================== */
  function WishlistPanel({ onOpen, onBuyAgain }) {
    const LZ = window.LZ;
    const [ids, setIds] = React.useState(LZ.wishlist.list());
    React.useEffect(() => LZ.wishlist.subscribe(() => setIds(LZ.wishlist.list())), []);
    const addCart = (p) => onBuyAgain && onBuyAgain([{ productId: p.id, title: p.title, img: p.img, price: p.price, qty: 1, variant: LZ.variantOptions(p).map((g) => g.values[0]).join(' / ') }]);
    return (
      <section style={card}>
        <PanelHead icon="heart" title={'Sản phẩm yêu thích (' + ids.length + ')'} sub="Bấm tim trên sản phẩm để lưu lại xem sau" />
        {ids.length === 0 && <Empty icon="heart" text="Bạn chưa có sản phẩm yêu thích nào." />}
        <div style={{ marginTop: 12 }}>
          {ids.map((id) => {
            const p = LZ.byId(id);
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
                <img src={p.img} alt="" width="64" height="64" onClick={() => onOpen(id)} style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', cursor: 'pointer', flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div onClick={() => onOpen(id)} style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-price)', marginTop: 3 }}>{fmt(p.price)}</div>
                </div>
                <Button size="sm" variant="ghost" iconLeft="heart" onClick={() => LZ.wishlist.toggle(id)}>Bỏ thích</Button>
                <Button size="sm" iconLeft="shopping-cart" disabled={!!V[p.v].vacation} onClick={() => addCart(p)}>Thêm vào giỏ</Button>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  /* ============================== FOLLOWS ============================== */
  function FollowsPanel({ onShop }) {
    const [following, setFollowing] = React.useState(FOLLOWS);
    const [unfollow, setUnfollow] = React.useState(null);
    const toggle = (vid) => { if (following.includes(vid)) setUnfollow(vid); else setFollowing((f) => [...f, vid]); };
    return (
      <section style={card}>
        <PanelHead icon="store" title={`Shop đang theo dõi (${following.length})`} sub="Nhận thông báo khuyến mãi từ các shop yêu thích" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginTop: 16 }}>
          {following.map((vid) => {
            const v = V[vid]; const on = true;
            return (
              <div key={vid} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: v.logoBg, color: '#fff', display: 'grid', placeItems: 'center', font: '800 22px var(--font-sans)', flex: 'none', cursor: 'pointer' }} onClick={() => onShop && onShop(vid)}>{v.name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', cursor: 'pointer' }} onClick={() => onShop && onShop(vid)}>{v.name}</span>
                      {v.mall && <Badge variant="solid">MALL</Badge>}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}><Icon name="star" size={12} style={{ color: 'var(--gold-500)' }} />{v.rating} · {v.followers} theo dõi</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button size="sm" variant={on ? 'outline' : 'secondary'} iconLeft={on ? 'check' : 'plus'} onClick={() => toggle(vid)} style={{ flex: 1 }}>{on ? 'Đang theo dõi' : 'Theo dõi'}</Button>
                  <Button size="sm" variant="ghost" iconLeft="store" onClick={() => onShop && onShop(vid)} style={{ flex: 1 }}>Vào shop</Button>
                </div>
              </div>
            );
          })}
        </div>
        {following.length === 0 && <Empty icon="store" text="Bạn chưa theo dõi shop nào." />}
        <Modal open={!!unfollow} onClose={() => setUnfollow(null)} title="Hủy theo dõi Shop?"
          footer={<><Button variant="ghost" onClick={() => setUnfollow(null)}>Không</Button><Button variant="danger" onClick={() => { setFollowing((f) => f.filter((x) => x !== unfollow)); setUnfollow(null); }}>Hủy theo dõi</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>Bạn sẽ không nhận được khuyến mãi từ <b>{unfollow && V[unfollow].name}</b> nữa.</div>
        </Modal>
      </section>
    );
  }

  /* ============================== NOTIFICATIONS ============================== */
  const N_TABS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'order', label: 'Đơn hàng' },
    { id: 'promo', label: 'Khuyến mãi' },
    { id: 'system', label: 'Hệ thống' },
    { id: 'chat', label: 'Chat' },
  ];
  function NotificationsPanel({ notifs, unread, onOpen, onMarkAll }) {
    const [tab, setTab] = React.useState('all');
    const [limit, setLimit] = React.useState(5);
    const all = tab === 'all' ? notifs : notifs.filter((n) => n.type === tab);
    const list = all.slice(0, limit);
    return (
      <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 22px 0' }}>
          <PanelHead icon="bell" title="Thông báo" sub={unread > 0 ? `Bạn có ${unread} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'} />
          <Button size="sm" variant="outline" iconLeft="check-check" style={{ marginLeft: 'auto' }} disabled={unread === 0} onClick={onMarkAll}>Đánh dấu tất cả đã đọc</Button>
        </div>
        <div style={{ padding: '4px 22px 0' }}>
          <Tabs value={tab} onChange={setTab} items={N_TABS} />
        </div>
        {list.length === 0 ? <Empty icon="bell" text="Không có thông báo nào ở mục này" />
          : list.map((n, i) => (
            <div key={n.id} onClick={() => onOpen(n)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', background: n.unread ? 'var(--orange-50)' : '#fff', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = n.unread ? 'var(--orange-100, #FFE6D9)' : 'var(--gray-50)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? 'var(--orange-50)' : '#fff')}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', background: n.bg, color: n.tint }}>{n.icon === 'lazadee' ? <img src="../../assets/logomark.svg" alt="" width="24" height="24" /> : <Icon name={n.icon} size={19} />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: (n.unread ? 'var(--weight-bold)' : 'var(--weight-medium)') + ' var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{n.title}</div>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.45 }}>{n.body}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 4 }}><Icon name="clock" size={12} />{n.date}</div>
              </div>
              {n.unread && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--orange-500)', flex: 'none' }} />}
            </div>
          ))}
        {all.length > limit && <div style={{ padding: 14, textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}><Button size="sm" variant="ghost" onClick={() => setLimit((l) => l + 5)}>Xem thêm thông báo</Button></div>}
      </section>
    );
  }

  /* ============================== DEVICES / SESSIONS ============================== */
  function DevicesPanel() {
    const [devices, setDevices] = React.useState(DEVICES);
    const logout = (id) => setDevices((ds) => ds.filter((d) => d.id !== id));
    const logoutOthers = () => setDevices((ds) => ds.filter((d) => d.current));
    const others = devices.filter((d) => !d.current).length;
    const ICON = { desktop: 'layout-dashboard', mobile: 'phone', tablet: 'package' };
    return (
      <section style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <PanelHead icon="lock" title="Thiết bị đăng nhập" sub="Các phiên đang đăng nhập vào tài khoản của bạn" />
          <Button size="sm" variant="outline" iconLeft="log-out" style={{ marginLeft: 'auto' }} disabled={others === 0} onClick={logoutOthers}>Đăng xuất tất cả thiết bị khác</Button>
        </div>

        <div style={{ display: 'flex', gap: 9, alignItems: 'center', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)', padding: '11px 14px', margin: '16px 0' }}>
          <Icon name="shield-check" size={18} style={{ color: 'var(--blue-600)', flex: 'none' }} />
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Nếu thấy thiết bị lạ, hãy đăng xuất ngay và <b style={{ color: 'var(--blue-600)' }}>đổi mật khẩu</b>. Bạn đang đăng nhập trên <b>{devices.length}</b> thiết bị.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {devices.map((d) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid ' + (d.current ? 'var(--mint-300, #BCEDD8)' : 'var(--border-subtle)'), background: d.current ? 'var(--mint-50)' : '#fff', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: d.current ? 'var(--mint-500)' : 'var(--surface-sunken)', color: d.current ? '#fff' : 'var(--text-muted)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ICON[d.kind] || 'lock'} size={22} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{d.name}</span>
                  {d.current && <Badge variant="mint" icon="badge-check">Thiết bị hiện tại</Badge>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginTop: 4, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12} />{d.where}</span>
                  <span className="code" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>IP {d.ip}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="clock" size={12} />{d.last}</span>
                </div>
              </div>
              {d.current
                ? <span style={{ font: 'var(--type-caption)', color: 'var(--mint-600)', fontWeight: 600 }}>Phiên này</span>
                : <Button size="sm" variant="ghost" iconLeft="log-out" onClick={() => logout(d.id)}>Đăng xuất</Button>}
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ============================== SHARED ============================== */
  function PanelHead({ icon, title, sub }) {
    return (
      <div style={{ paddingBottom: sub ? 12 : 0, marginBottom: sub ? 4 : 0, borderBottom: sub ? '1px solid var(--border-subtle)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name={icon} size={20} style={{ color: 'var(--orange-500)' }} />
          <h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
        </div>
        {sub && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', margin: '4px 0 0 28px' }}>{sub}</p>}
      </div>
    );
  }
  function Empty({ icon, text }) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '48px 0', color: 'var(--text-subtle)' }}>
        <Icon name={icon} size={40} />
        <div style={{ font: 'var(--type-body)' }}>{text}</div>
      </div>
    );
  }

  // 6-box OTP input with auto-advance + backspace-to-previous.
  function OtpBoxes({ onChange }) {
    const [d, setD] = React.useState(['', '', '', '', '', '']);
    const refs = React.useRef([]);
    const set = (i, val) => {
      const v = val.replace(/\D/g, '').slice(-1);
      const nd = d.slice(); nd[i] = v; setD(nd);
      onChange && onChange(nd.join(''));
      if (v && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
    };
    const key = (i, e) => { if (e.key === 'Backspace' && !d[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus(); };
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {d.map((x, i) => (
          <input key={i} ref={(el) => (refs.current[i] = el)} inputMode="numeric" maxLength={1} value={x}
            onChange={(e) => set(i, e.target.value)} onKeyDown={(e) => key(i, e)}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
            style={{ width: 44, height: 52, textAlign: 'center', font: '800 22px var(--font-sans)', color: 'var(--text-strong)', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' }} />
        ))}
      </div>
    );
  }

  function GoogleG({ size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" /><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3-2.33z" /><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3 2.33C4.68 5.16 6.66 3.58 9 3.58z" /></svg>
    );
  }

  function AppleLogo({ size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 17 18" aria-hidden="true"><path fill="currentColor" d="M14.07 13.9c-.26.6-.57 1.16-.93 1.67-.5.7-.9 1.18-1.22 1.45-.49.45-1.02.68-1.59.7-.4 0-.9-.12-1.46-.35-.57-.23-1.1-.34-1.58-.34-.5 0-1.04.11-1.63.34-.59.24-1.06.36-1.42.37-.55.02-1.09-.22-1.62-.71-.34-.29-.76-.79-1.27-1.5-.54-.76-.99-1.64-1.34-2.64C.92 13.05.7 11.98.7 10.95c0-1.18.26-2.2.77-3.05a4.5 4.5 0 0 1 1.6-1.62 4.32 4.32 0 0 1 2.17-.61c.42 0 .98.13 1.67.39.69.26 1.13.39 1.32.39.14 0 .63-.15 1.46-.46.78-.28 1.45-.4 1.99-.36 1.47.12 2.58.7 3.31 1.75-1.32.8-1.97 1.92-1.96 3.35.01 1.12.42 2.05 1.22 2.79.36.34.77.61 1.22.8-.1.29-.2.56-.32.83zM11.6 1.4c0 .88-.32 1.7-.96 2.46-.78.9-1.72 1.42-2.74 1.34a2.76 2.76 0 0 1-.02-.33c0-.84.37-1.74 1.02-2.48.33-.37.74-.68 1.24-.93.5-.24.97-.38 1.42-.4.02.11.04.23.04.34z" /></svg>
    );
  }

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', padding: 22 };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };
  const linkS = { font: 'var(--type-body-sm)', color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 };

  window.LZAccount = Account;
})();
