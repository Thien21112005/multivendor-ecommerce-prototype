/* Lazadee customer account hub. The left sidebar switches the main panel:
   Hồ sơ · Địa chỉ · Đổi mật khẩu · Đơn mua (orders by status ENUM) · Kho Voucher
   · Lazadee Xu · Shop đang theo dõi. Mirrors customer_profiles, addresses,
   shop_follows, vouchers, loyalty-coin ledger. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Avatar, StatusBadge, VendorChip, Tabs, Input, Radio, Checkbox, VoucherTag, Badge, Modal } = DS;
  const { USER, ADDRESSES, FOLLOWS, ORDERS, V, VOUCHERS, COIN_LOG, NOTIFICATIONS, DEVICES } = window.LZ;
  const fmt = (n) => (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('vi-VN') + '₫';
  const PW_COLORS = ['var(--red-500)', 'var(--red-500)', 'var(--gold-500)', 'var(--mint-500)', 'var(--mint-600)'];
  const PW_LABELS = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const pwStrength = (p) => { let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s; };
  const maskEmail = (e) => (e || '').replace(/^(.{2}).*(@.*)$/, '$1****$2');

  const STATUS_VI = {
    PENDING_PAYMENT: 'Chờ thanh toán', PAID: 'Đã thanh toán', PROCESSING: 'Đang chuẩn bị',
    SHIPPED: 'Đang giao', DELIVERED: 'Đã giao', COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã huỷ', REFUNDED: 'Đã hoàn tiền',
  };
  const TABS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pay', label: 'Chờ thanh toán', match: ['PENDING_PAYMENT'] },
    { value: 'ship', label: 'Vận chuyển', match: ['PAID', 'PROCESSING', 'SHIPPED'] },
    { value: 'deliver', label: 'Chờ giao hàng', match: ['DELIVERED'] },
    { value: 'done', label: 'Hoàn thành', match: ['COMPLETED'] },
    { value: 'cancel', label: 'Đã huỷ', match: ['CANCELLED', 'REFUNDED'] },
  ];

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
      { id: 'vouchers', name: 'Kho Voucher', icon: 'ticket', badge: USER.vouchers },
      { id: 'coins', name: 'Lazadee Xu', icon: 'star' },
      { id: 'follow', name: 'Shop đang theo dõi', icon: 'store', badge: FOLLOWS.length },
    ] },
  ];

  function Account({ initialView, onTrack, onOpen, onChat, onReview, onShop, onGo }) {
    const [view, setView] = React.useState(initialView || new URLSearchParams(location.search).get('view') || 'orders');
    const [orders, setOrders] = React.useState(ORDERS);
    const [addrOpen, setAddrOpen] = React.useState(false);
    const [notifs, setNotifs] = React.useState(NOTIFICATIONS);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const [provider, setProvider] = React.useState(USER.authProvider || 'email'); // demo: 'email' | 'google'
    const hasPassword = provider === 'email';
    const notifUnread = notifs.filter((n) => n.unread).length;
    React.useEffect(() => { if (initialView) setView(initialView); }, [initialView]);
    const confirmReceipt = (id) =>
      setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: 'COMPLETED', completedAt: 'vừa xong' } : o)));

    // Mark a notification read, then route to its target.
    const openNotif = (n) => {
      setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
      const lk = n.link || {};
      if (lk.action === 'track' && onTrack) onTrack(lk.orderId);
      else if (lk.action === 'view') setView(lk.view);
      else if (lk.action === 'home' && onGo) onGo('home');
    };
    const markAllRead = () => setNotifs((ns) => ns.map((x) => ({ ...x, unread: false })));

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
                  const badge = m.id === 'notifications' ? notifUnread : m.badge;
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
            {view === 'orders' && <OrdersPanel orders={orders} onTrack={onTrack} onChat={onChat} onReview={onReview} onConfirm={confirmReceipt} />}
            {view === 'notifications' && <NotificationsPanel notifs={notifs} unread={notifUnread} onOpen={openNotif} onMarkAll={markAllRead} />}
            {view === 'profile' && <ProfilePanel key={provider} provider={provider} onSetPassword={() => setView('password')} />}
            {view === 'address' && <AddressPanel onAdd={() => setAddrOpen(true)} />}
            {view === 'password' && <PasswordPanel key={provider} provider={provider} />}
            {view === 'devices' && <DevicesPanel />}
            {view === 'vouchers' && <VouchersPanel />}
            {view === 'coins' && <CoinsPanel />}
            {view === 'follow' && <FollowsPanel onShop={onShop} />}
          </div>
        </div>

        {window.LZAddressModal && <window.LZAddressModal open={addrOpen} onClose={() => setAddrOpen(false)} selectedId={(ADDRESSES.find((a) => a.default) || {}).id} onSelect={() => setAddrOpen(false)} />}

        <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Đăng xuất"
          footer={<><Button variant="ghost" onClick={() => setLogoutOpen(false)}>Huỷ</Button><Button variant="danger" iconLeft="log-out" onClick={() => setLogoutOpen(false)}>Đăng xuất</Button></>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 'min(420px, 80vw)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="log-out" size={20} /></div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc muốn đăng xuất khỏi tài khoản <b>{USER.name}</b> trên thiết bị này?</div>
          </div>
        </Modal>
      </div>
    );
  }

  /* ============================== ORDERS ============================== */
  function OrdersPanel({ orders, onTrack, onChat, onReview, onConfirm }) {
    const [tab, setTab] = React.useState('all');
    const active = TABS.find((t) => t.value === tab);
    const list = tab === 'all' ? orders : orders.filter((o) => active.match.includes(o.status));
    return (
      <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px 0' }}>
          <PanelHead icon="package" title="Đơn mua" />
          <Tabs value={tab} onChange={setTab} items={TABS.map((t) => ({ id: t.value, label: t.label }))} />
        </div>
        <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--surface-sunken)' }}>
          {list.length === 0 ? <Empty icon="package" text="Chưa có đơn hàng nào ở mục này" />
            : list.map((o) => <OrderCard key={o.id} o={o} onTrack={onTrack} onChat={onChat} onReview={onReview} onConfirm={onConfirm} />)}
        </div>
      </section>
    );
  }

  function OrderCard({ o, onTrack, onChat, onReview, onConfirm }) {
    const v = V[o.vendorId];
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <VendorChip name={v.name} mall={v.mall} />
          <span className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-subtle)' }}>{o.id}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {o.tracking && o.tracking.shipStatus === 'DELIVERED' && o.status === 'DELIVERED' &&
              <span style={{ font: 'var(--type-caption)', color: 'var(--mint-600)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="truck" size={14} />Giao thành công</span>}
            <StatusBadge status={o.status} label={STATUS_VI[o.status]} />
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
            <Actions o={o} onTrack={onTrack} onChat={onChat} onReview={onReview} onConfirm={onConfirm} />
          </div>
        </div>
      </div>
    );
  }
  function Actions({ o, onTrack, onChat, onReview, onConfirm }) {
    const t = (fn, a) => () => fn && fn(a);
    const track = <Button size="sm" variant="outline" iconLeft="truck" onClick={t(onTrack, o.id)}>Theo dõi đơn</Button>;
    const chat = <Button size="sm" variant="ghost" iconLeft="message-circle" onClick={t(onChat, o.id)}>Liên hệ Shop</Button>;
    if (o.status === 'PENDING_PAYMENT') return <><Button size="sm">Thanh toán ngay</Button><Button size="sm" variant="ghost">Huỷ đơn</Button></>;
    if (o.status === 'PAID' || o.status === 'PROCESSING') return <>{track}{chat}</>;
    if (o.status === 'SHIPPED') return <><Button size="sm" iconLeft="truck" onClick={t(onTrack, o.id)}>Theo dõi đơn</Button>{chat}</>;
    if (o.status === 'DELIVERED') return <><Button size="sm" iconLeft="check" onClick={t(onConfirm, o.id)}>Đã nhận hàng</Button><Button size="sm" variant="outline" iconLeft="undo-2" onClick={t(onTrack, o.id)}>Trả hàng</Button>{track}</>;
    if (o.status === 'COMPLETED') return <><Button size="sm" iconLeft="star" onClick={t(onReview, o.id)}>Đánh giá</Button><Button size="sm" variant="outline">Mua lại</Button>{chat}</>;
    return <><Button size="sm" variant="outline">Mua lại</Button>{chat}</>;
  }

  /* ============================== PROFILE ============================== */
  function ProfilePanel({ provider, onSetPassword }) {
    const prov = provider || USER.authProvider || 'email';
    const isSSO = prov !== 'email';
    const provName = prov === 'apple' ? 'Apple' : 'Google';
    const ProvIcon = prov === 'apple' ? AppleLogo : GoogleG;
    // SSO accounts come with no phone / birthday filled in (like Shopee).
    const [f, setF] = React.useState({ name: USER.name, email: USER.email, phone: isSSO ? '' : USER.phone, gender: isSSO ? '' : USER.gender, dob: isSSO ? '' : '1996-08-12', bio: isSSO ? '' : USER.bio, lang: 'vi' });
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
                {['Nam', 'Nữ', 'Khác'].map((g) => (
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
                    <button key={l.id} type="button" onClick={() => set('lang', l.id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary-tint)' : '#fff', color: on ? 'var(--orange-700)' : 'var(--text-body)', font: (on ? '600 ' : '500 ') + '14px var(--font-sans)', cursor: 'pointer' }}>
                      <span style={{ fontSize: 17 }}>{l.flag}</span>{l.label}
                      {on && <Icon name="check" size={16} style={{ marginLeft: 2 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <Button iconLeft="check" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Lưu thay đổi</Button>
              {saved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--mint-600)', font: 'var(--type-body-sm)' }}><Icon name="circle-check" size={16} />Đã lưu hồ sơ</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 28 }}>
            <Avatar name={USER.name} src={isSSO ? USER.avatarUrl : null} size={104} />
            <Button variant="outline" iconLeft="upload">Chọn ảnh</Button>
            <p style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>Định dạng JPG, PNG.<br />Tối đa 1 MB.</p>
          </div>
        </div>
      </section>
    );
  }

  /* ============================== ADDRESS ============================== */
  function AddressPanel({ onAdd }) {
    const [list, setList] = React.useState(ADDRESSES);
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
                  {!a.default && <span style={{ ...linkS, color: 'var(--red-600)' }}>Xoá</span>}
                </div>
                <Button size="sm" variant="outline" disabled={a.default} onClick={() => makeDefault(a.id)}>Thiết lập mặc định</Button>
              </div>
            </div>
          ))}
        </div>
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

    React.useEffect(() => {
      if (stage !== 'otp' || resend <= 0) return;
      const t = setInterval(() => setResend((s) => (s > 0 ? s - 1 : 0)), 1000);
      return () => clearInterval(t);
    }, [stage, resend]);

    const submit = () => {
      const e = {};
      if (hasPw && !f.cur) e.cur = 'Nhập mật khẩu hiện tại';
      if (f.nw.length < 8) e.nw = 'Tối thiểu 8 ký tự';
      else if (!/[0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ số';
      else if (!/[^A-Za-z0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 ký tự đặc biệt';
      if (f.cf !== f.nw) e.cf = 'Mật khẩu nhập lại không khớp';
      setErr(e);
      if (Object.keys(e).length === 0) { setStage('otp'); setResend(60); setOtp(''); }
    };
    const confirm = () => { setStage('done'); setF({ cur: '', nw: '', cf: '' }); setTimeout(() => setStage('form'), 2800); };

    return (
      <section style={card}>
        <PanelHead icon="shield-check" title={hasPw ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'} sub={hasPw ? 'Bảo mật tài khoản bằng mật khẩu mạnh' : 'Tạo mật khẩu để đăng nhập bằng email bên cạnh Google SSO'} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 28, marginTop: 18, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {hasPw && <PwField label="Mật khẩu hiện tại" value={f.cur} onChange={(v) => set('cur', v)} err={err.cur} />}
            <div>
              <PwField label="Mật khẩu mới" value={f.nw} onChange={(v) => set('nw', v)} err={err.nw} hint="Tối thiểu 8 ký tự, cần chữ hoa, số và ký tự đặc biệt" />
              {f.nw && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (strength / 4 * 100) + '%', height: '100%', borderRadius: 3, background: PW_COLORS[strength], transition: 'all .3s' }} /></div>
                  <span style={{ font: '600 12px var(--font-sans)', color: PW_COLORS[strength], minWidth: 64 }}>{PW_LABELS[strength]}</span>
                </div>
              )}
            </div>
            <PwField label="Nhập lại mật khẩu mới" value={f.cf} onChange={(v) => set('cf', v)} err={err.cf} />

            {stage === 'form' && <div><Button iconLeft="check" onClick={submit}>{hasPw ? 'Cập nhật mật khẩu' : 'Thiết lập mật khẩu'}</Button></div>}

            {stage === 'otp' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, animation: 'lzSlideDown .25s var(--ease-out)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="mail" size={16} style={{ color: 'var(--orange-500)' }} />
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Mã xác nhận đã gửi đến <b>{maskEmail(USER.email)}</b></span>
                </div>
                <OtpBoxes onChange={setOtp} />
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
  function VouchersPanel() {
    const [tab, setTab] = React.useState('all');
    const KINDS = { all: null, platform: 'platform', shop: 'shop', freeship: 'freeship' };
    const list = tab === 'all' ? VOUCHERS : VOUCHERS.filter((v) => v.kind === KINDS[tab]);
    return (
      <section style={card}>
        <PanelHead icon="ticket" title="Kho Voucher" sub={`Bạn đang có ${VOUCHERS.length} voucher khả dụng`} />
        <div style={{ marginTop: 4 }}>
          <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Tất cả' }, { id: 'platform', label: 'Voucher Sàn' }, { id: 'shop', label: 'Voucher Shop' }, { id: 'freeship', label: 'Freeship' }]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginTop: 16 }}>
          {list.map((v) => (
            <div key={v.id} style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#fff' }}>
              <div style={{ width: 96, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#fff', background: v.kind === 'freeship' ? 'var(--mint-500)' : v.kind === 'shop' ? 'var(--flash-500)' : 'var(--orange-500)' }}>
                <Icon name={v.kind === 'freeship' ? 'truck' : v.kind === 'shop' ? 'store' : 'ticket'} size={22} />
                <span style={{ font: '800 17px var(--font-sans)' }}>{v.amount}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0, padding: '12px 14px' }}>
                <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{v.label}</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{v.cond} · {v.scope}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 9 }}>
                  <span style={{ font: 'var(--type-caption)', color: 'var(--flash-600)' }}>HSD: {v.expiry}</span>
                  <Button size="sm" style={{ marginLeft: 'auto' }}>Dùng ngay</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ============================== COINS ============================== */
  function CoinsPanel() {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ ...card, background: 'linear-gradient(120deg, var(--gold-600, #E09600), var(--gold-500, #FFB100))', color: '#fff', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="star" size={34} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--type-body-sm)', color: 'rgba(255,255,255,.9)' }}>Số dư Lazadee Xu</div>
            <div style={{ font: '800 34px var(--font-sans)', lineHeight: 1.1 }}>{USER.coins.toLocaleString('vi-VN')} <span style={{ fontSize: 18, fontWeight: 600 }}>Xu</span></div>
            <div style={{ font: 'var(--type-caption)', color: 'rgba(255,255,255,.85)', marginTop: 2 }}>1 Xu = 1₫ khi thanh toán · Xu hết hạn sau 12 tháng</div>
          </div>
          <Button variant="secondary" iconLeft="gift">Đổi quà</Button>
        </div>
        <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px 12px' }}><PanelHead icon="clock" title="Lịch sử Xu" /></div>
          <div>
            {COIN_LOG.map((c, i) => (
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
      </section>
    );
  }

  /* ============================== FOLLOWS ============================== */
  function FollowsPanel({ onShop }) {
    const [following, setFollowing] = React.useState(FOLLOWS);
    const toggle = (vid) => setFollowing((f) => (f.includes(vid) ? f.filter((x) => x !== vid) : [...f, vid]));
    return (
      <section style={card}>
        <PanelHead icon="store" title={`Shop đang theo dõi (${following.length})`} sub="Nhận thông báo khuyến mãi từ các shop yêu thích" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginTop: 16 }}>
          {FOLLOWS.map((vid) => {
            const v = V[vid]; const on = following.includes(vid);
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
    const list = tab === 'all' ? notifs : notifs.filter((n) => n.type === tab);
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
              <div style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', background: n.bg, color: n.tint }}><Icon name={n.icon} size={19} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: (n.unread ? 'var(--weight-bold)' : 'var(--weight-medium)') + ' var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{n.title}</div>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.45 }}>{n.body}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 4 }}><Icon name="clock" size={12} />{n.date}</div>
              </div>
              {n.unread && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--orange-500)', flex: 'none' }} />}
            </div>
          ))}
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
