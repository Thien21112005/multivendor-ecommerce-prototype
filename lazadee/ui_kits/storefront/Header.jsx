/* Lazadee storefront header: utility bar, logo + search + cart, category strip. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, IconButton, Badge, Modal, Button } = DS;
  const { CATEGORIES, USER } = window.LZ;

  function Header({ cartCount = 0, notifCount = 3, onNav, onNotifications, query, onQuery, onSearch }) {
    const [q, setQ] = React.useState(query || '');
    const [notifOpen, setNotifOpen] = React.useState(false);
    const [userOpen, setUserOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const submit = () => onSearch && onSearch(q);
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        {/* utility bar */}
        <div style={{ background: 'var(--ink-900)', color: 'rgba(255,255,255,.72)' }}>
          <div style={bar}>
            <div style={{ display: 'flex', gap: 18, fontSize: 12 }}>
              <span style={ut} onClick={() => onNav && onNav('seller')}>Kênh người bán</span>
              <span style={ut} onClick={() => onNav && onNav('seller')}>Trở thành Người bán</span>
              <span style={ut}>Tải ứng dụng</span>
            </div>
            <div style={{ display: 'flex', gap: 18, fontSize: 12, alignItems: 'center' }}>
              <span style={ut} onClick={() => onNav && onNav('account')}><Icon name="package" size={14} /> Đơn mua</span>
              <span style={ut}><Icon name="circle-help" size={14} /> Hỗ trợ</span>
              <LangSelect />
              <span style={{ ...ut, color: '#fff', fontWeight: 600 }} onClick={() => onNav && onNav('account')}>{USER ? USER.name : 'Đăng nhập'}</span>
            </div>
          </div>
        </div>
        {/* main bar */}
        <div style={{ background: 'var(--color-primary)' }}>
          <div style={{ ...bar, height: 76, gap: 28, alignItems: 'center' }}>
            <a onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none' }}>
              <img src="../../assets/logomark.svg" width="40" height="40" alt="" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.18))' }} />
              <span style={{ font: '800 26px/1 var(--font-sans)', letterSpacing: '-0.02em', color: '#fff' }}>lazadee</span>
            </a>
            <div style={{ flex: 1, maxWidth: 720 }}>
              <div style={{ display: 'flex', background: '#fff', borderRadius: 'var(--radius-sm)', padding: 3, alignItems: 'center' }}>
                <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu, shop…"
                  style={{ flex: 1, border: 0, outline: 'none', height: 38, padding: '0 12px', font: 'var(--type-body)', background: 'transparent' }} />
                <button onClick={submit} style={searchBtn}><Icon name="search" size={18} strokeWidth={2.4} /></button>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 11, color: 'rgba(255,255,255,.82)' }}>
                {['Smartphone', 'Áo thun', 'Serum', 'Tai nghe', 'Giày sneaker'].map((t) => (
                  <span key={t} style={{ cursor: 'pointer' }} onClick={() => { setQ(t); onSearch && onSearch(t); }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setNotifOpen((o) => !o)} style={cartBtn} aria-label="Thông báo"><Icon name="bell" size={24} /></button>
                {notifCount > 0 && <span style={cartBadge}>{notifCount}</span>}
                {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} onSeeAll={() => { setNotifOpen(false); onNotifications && onNotifications(); }} />}
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={() => onNav('cart')} style={cartBtn} aria-label="Giỏ hàng"><Icon name="shopping-cart" size={26} /></button>
                {cartCount > 0 && <span style={cartBadge}>{cartCount}</span>}
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserOpen((o) => !o)} style={cartBtn} aria-label="Tài khoản"><Icon name="user" size={24} /></button>
                {userOpen && <UserMenu onClose={() => setUserOpen(false)} onNav={onNav} onLogout={() => setLogoutOpen(true)} />}
              </div>
            </div>
          </div>
        </div>
        {/* category strip */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ ...bar, height: 48, gap: 4, overflowX: 'auto' }}>
            {CATEGORIES.map((c) => (
              <button key={c.name} onClick={() => onSearch && onSearch(c.name)} style={catBtn}>
                <Icon name={c.icon} size={16} /> {c.name}
              </button>
            ))}
          </div>
        </div>

        <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Đăng xuất"
          footer={<><Button variant="ghost" onClick={() => setLogoutOpen(false)}>Huỷ</Button><Button variant="danger" iconLeft="log-out" onClick={() => setLogoutOpen(false)}>Đăng xuất</Button></>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 'min(420px, 80vw)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="log-out" size={20} /></div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc muốn đăng xuất khỏi tài khoản <b>{USER ? USER.name : ''}</b>?</div>
          </div>
        </Modal>
      </header>
    );
  }

  function UserMenu({ onClose, onNav, onLogout }) {
    const item = (icon, label, onClick, danger) => (
      <div onClick={() => { onClose(); onClick(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: danger ? 'var(--red-600)' : 'var(--text-body)', font: 'var(--type-body-sm)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = danger ? 'var(--red-50, #FDECEA)' : 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
        <Icon name={icon} size={17} /><span style={{ flex: 1 }}>{label}</span>
      </div>
    );
    return (
      <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 208, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', zIndex: 95, padding: 4, color: 'var(--text-body)', cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--orange-100, #FFE6D9)', color: 'var(--orange-600)', display: 'grid', placeItems: 'center', font: '700 15px var(--font-sans)', flex: 'none' }}>{USER ? USER.name.trim().split(' ').pop()[0] : 'K'}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER ? USER.name : 'Khách'}</div>
              <div onClick={() => { onClose(); onNav('account'); }} style={{ font: 'var(--type-caption)', color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 }}>Xem hồ sơ</div>
            </div>
          </div>
          {item('user', 'Tài khoản của tôi', () => onNav('account'))}
          {item('package', 'Đơn mua', () => onNav('account'))}
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
          {item('log-out', 'Đăng xuất', () => onLogout(), true)}
        </div>
      </>
    );
  }

  function LangSelect() {
    const LANGS = [{ id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }, { id: 'en', label: 'English', flag: '🇬🇧' }];
    const [open, setOpen] = React.useState(false);
    const [lang, setLang] = React.useState('vi');
    const cur = LANGS.find((l) => l.id === lang);
    return (
      <span style={{ position: 'relative' }}>
        <span style={{ ...ut, gap: 5 }} onClick={() => setOpen((o) => !o)}>
          <span style={{ fontSize: 13 }}>{cur.flag}</span>{cur.label}
          <Icon name="chevron-down" size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
        </span>
        {open && (
          <>
            <span onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 110 }} />
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 168, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', zIndex: 115, overflow: 'hidden', padding: 4 }}>
              {LANGS.map((l) => (
                <div key={l.id} onClick={() => { setLang(l.id); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: l.id === lang ? 'var(--orange-50)' : 'transparent', color: l.id === lang ? 'var(--orange-600)' : 'var(--text-body)', font: (l.id === lang ? '600 ' : '500 ') + '13px var(--font-sans)' }}>
                  <span style={{ fontSize: 16 }}>{l.flag}</span><span style={{ flex: 1 }}>{l.label}</span>{l.id === lang && <Icon name="check" size={15} />}
                </div>
              ))}
            </div>
          </>
        )}
      </span>
    );
  }

  function NotifPanel({ onClose, onSeeAll }) {
    const items = [
      { icon: 'truck', tint: 'var(--mint-600)', bg: 'var(--mint-50)', title: 'Đơn ORD-2412-0044 đang giao', desc: 'GHN đang trung chuyển đến kho HCM', time: '2 giờ trước', unread: true },
      { icon: 'ticket', tint: 'var(--flash-600)', bg: 'var(--flash-50)', title: 'Voucher Freeship sắp hết hạn', desc: 'Dùng trước 23:59 hôm nay', time: '5 giờ trước', unread: true },
      { icon: 'badge-check', tint: 'var(--orange-600)', bg: 'var(--orange-50)', title: 'Đơn ORD-2412-0041 đã giao thành công', desc: 'Bấm "Đã nhận hàng" để hoàn tất', time: 'Hôm qua', unread: true },
      { icon: 'zap', tint: 'var(--gold-700)', bg: 'var(--gold-50)', title: 'FLASH SALE 12.12 bắt đầu!', desc: 'Giảm tới 50% — săn deal ngay', time: '2 ngày trước', unread: false },
    ];
    return (
      <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 360, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', zIndex: 95, overflow: 'hidden', color: 'var(--text-body)', cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Thông báo</span>
            <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 }}>Đánh dấu đã đọc</span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {items.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: n.unread ? 'var(--orange-50)' : '#fff', cursor: 'pointer' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: n.bg, color: n.tint, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={n.icon} size={19} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{n.title}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 1 }}>{n.desc}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div onClick={onSeeAll} style={{ padding: '11px 16px', textAlign: 'center', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--orange-600)', cursor: 'pointer' }}>Xem tất cả thông báo</div>
        </div>
      </>
    );
  }

  const bar = { maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const ut = { display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' };
  const searchBtn = { width: 60, height: 38, border: 0, borderRadius: 'var(--radius-xs)', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const cartBtn = { width: 44, height: 44, borderRadius: 'var(--radius-md)', border: 0, background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const cartBadge = { position: 'absolute', top: 2, right: 0, background: '#fff', color: 'var(--color-primary)', font: '700 11px/1 var(--font-sans)', minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', border: '1.5px solid var(--color-primary)' };
  const catBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', border: 0, background: 'transparent', whiteSpace: 'nowrap', font: 'var(--weight-medium) var(--text-sm) var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer', borderRadius: 'var(--radius-md)' };

  window.LZHeader = Header;
})();
