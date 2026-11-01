/* Lazadee storefront header: utility bar, logo + search + cart, category strip. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, IconButton, Badge, Modal, Button } = DS;
  const { CATEGORIES, USER, NOTIFICATIONS } = window.LZ;
  const { Avatar } = DS;

  function Header({ cart = [], cartCount = 0, loggedIn = true, onNav, onOpen, onOrders, onNotifications, onOpenNotif, query, onSearch, onCategory, onShop, onRequireLogin, onLogin, onLogout }) {
    const [q, setQ] = React.useState(query || '');
    const [notifOpen, setNotifOpen] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const [userOpen, setUserOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const notifCount = loggedIn ? NOTIFICATIONS.filter((n) => n.unread).length : 0;
    const [sug, setSug] = React.useState([]);
    const [sugOpen, setSugOpen] = React.useState(false);
    React.useEffect(() => {
      const t = q.trim().toLowerCase();
      if (t.length < 2) { setSug([]); return undefined; }
      const h = setTimeout(() => {
        const LZ = window.LZ, hit = (s) => s.toLowerCase().includes(t);
        setSug([
          ...CATEGORIES.filter((c) => hit(c.name)).slice(0, 2).map((c) => ({ key: 'c' + c.name, icon: c.icon, label: c.name, hint: 'Danh mục', go: () => onCategory(c.name) })),
          ...LZ.vendorList().filter((v) => hit(v.name)).slice(0, 2).map((v) => ({ key: 'v' + v.id, icon: 'store', label: v.name, hint: 'Shop', go: () => onShop && onShop(v.id) })),
          ...LZ.PRODUCTS.filter((p) => hit(p.title)).slice(0, 5).map((p) => ({ key: p.id, img: p.img, label: p.title, go: () => onOpen(p.id) })),
        ]);
      }, 250);
      return () => clearTimeout(h);
    }, [q]);
    const submit = () => { setSugOpen(false); onSearch && onSearch(q); };
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        {/* utility bar */}
        <div style={{ background: 'var(--ink-900)', color: 'rgba(255,255,255,.72)' }}>
          <div style={bar}>
            <div style={{ display: 'flex', gap: 18, fontSize: 12 }}>
              <span style={ut} onClick={() => { window.location.href = '../vendor/index.html'; }}>Kênh người bán</span>
              <span style={ut} onClick={() => onNav && onNav('seller')}>Trở thành Người bán</span>
              <span style={ut} onClick={() => window.dispatchEvent(new CustomEvent('show_toast', { detail: { message: 'Ứng dụng di động sẽ ra mắt ở giai đoạn sau' } }))}>Tải ứng dụng</span>
            </div>
            <div style={{ display: 'flex', gap: 18, fontSize: 12, alignItems: 'center' }}>
              <span style={ut} onClick={() => (loggedIn ? onOrders() : onRequireLogin())}><Icon name="package" size={14} /> Đơn mua</span>
              <span style={ut} onClick={() => onNav('page', 'help-center')}><Icon name="circle-help" size={14} /> Hỗ trợ</span>
              <LangSelect />
              <span style={{ ...ut, color: '#fff', fontWeight: 600 }} onClick={() => (loggedIn ? onNav('account') : onLogin())}>{loggedIn ? 'Tài khoản của tôi' : 'Đăng nhập'}</span>
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
              <div style={{ position: 'relative', display: 'flex', background: '#fff', borderRadius: 'var(--radius-sm)', padding: 3, alignItems: 'center' }}>
                {sugOpen && sug.length > 0 && (
                  <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', padding: 4, zIndex: 120 }}>
                    {sug.map((s) => (
                      <div key={s.key} role="option" aria-selected="false" onMouseDown={(e) => { e.preventDefault(); setSugOpen(false); s.go(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-body)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        {s.img ? <img src={s.img} alt="" width="32" height="32" style={{ borderRadius: 4, objectFit: 'cover', flex: 'none' }} /> : <Icon name={s.icon} size={18} style={{ color: 'var(--text-muted)', flex: 'none' }} />}
                        <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                        {s.hint && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{s.hint}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <input value={q} aria-label="Tìm kiếm" onChange={(e) => { setQ(e.target.value); setSugOpen(true); }} onFocus={() => setSugOpen(true)} onBlur={() => setSugOpen(false)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setSugOpen(false); }}
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
              <div style={{ position: 'relative' }} onMouseEnter={() => loggedIn && setNotifOpen(true)} onMouseLeave={() => setNotifOpen(false)}>
                <button onClick={() => (loggedIn ? onNotifications() : onRequireLogin())} style={cartBtn} aria-label="Thông báo"><Icon name="bell" size={24} /></button>
                {notifCount > 0 && <span style={cartBadge}>{notifCount > 99 ? '99+' : notifCount}</span>}
                {notifOpen && <NotifPanel onItem={(n) => { setNotifOpen(false); onOpenNotif(n); }} onSeeAll={() => { setNotifOpen(false); onNotifications(); }} />}
              </div>
              <div style={{ position: 'relative' }} onMouseEnter={() => loggedIn && setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
                <button onClick={() => (loggedIn ? onNav('cart') : onRequireLogin())} style={cartBtn} aria-label="Giỏ hàng"><Icon name="shopping-cart" size={26} /></button>
                {loggedIn && cartCount > 0 && <span style={cartBadge}>{cartCount}</span>}
                {cartOpen && <MiniCart cart={cart} onOpen={(id) => { setCartOpen(false); onOpen(id); }} onGoCart={() => { setCartOpen(false); onNav('cart'); }} />}
              </div>
              <div style={{ position: 'relative', marginLeft: 8 }}>
                {loggedIn
                  ? <button onClick={() => setUserOpen((o) => !o)} aria-label="Tài khoản" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42, padding: '4px 16px 4px 6px', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 10, color: '#fff', font: '600 14px var(--font-sans)', cursor: 'pointer' }}><Avatar name={USER.name} src={USER.avatarUrl} size={30} /><span style={{ whiteSpace: 'nowrap' }}>{USER.name}</span></button>
                  : <Button variant="secondary" onClick={onLogin} style={{ background: '#fff', color: 'var(--color-primary)', border: 0, height: 36, padding: '0 16px' }}>Đăng nhập</Button>}
                {loggedIn && userOpen && <UserMenu onClose={() => setUserOpen(false)} onNav={onNav} onOrders={onOrders} onLogout={() => setLogoutOpen(true)} />}
              </div>
            </div>
          </div>
        </div>
        {/* category strip */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ ...bar, height: 48, gap: 4, overflowX: 'auto' }}>
            {CATEGORIES.map((c) => (
              <button key={c.name} onClick={() => (onCategory ? onCategory(c.name) : onSearch(c.name))} style={catBtn}>
                <Icon name={c.icon} size={16} /> {c.name}
              </button>
            ))}
          </div>
        </div>

        <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Đăng xuất"
          footer={<><Button variant="ghost" onClick={() => setLogoutOpen(false)}>Huỷ</Button><Button variant="danger" iconLeft="log-out" onClick={() => { setLogoutOpen(false); onLogout && onLogout(); }}>Đăng xuất</Button></>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 'min(420px, 80vw)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="log-out" size={20} /></div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc muốn đăng xuất khỏi tài khoản <b>{USER ? USER.name : ''}</b>?</div>
          </div>
        </Modal>
      </header>
    );
  }

  function MiniCart({ cart, onOpen, onGoCart }) {
    const recent = [...cart].reverse().slice(0, 5);
    return (
      <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 8, width: 360, zIndex: 95, cursor: 'default' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', color: 'var(--text-body)', border: '1px solid var(--border-subtle)' }}>
          {cart.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gray-50)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><Icon name="shopping-cart" size={36} /></div>
              <div style={{ font: 'var(--weight-semibold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 6 }}>Giỏ hàng của bạn đang trống</div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</div>
            </div>
          ) : (
            <>
              <div style={{ padding: '12px 16px', font: 'var(--type-body-sm)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>Sản phẩm mới thêm</div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {recent.map((l) => (
                  <div key={l.key} onClick={() => onOpen(l.productId)} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <img src={l.img} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', flex: 'none' }} />
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ font: 'var(--weight-medium) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{l.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.variant}</span>
                        <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--color-primary)', flex: 'none' }}>{DS.Money.format(l.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gray-50)' }}>
                <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{cart.length > 5 ? `Còn ${cart.length - 5} sản phẩm trong giỏ` : ''}</span>
                <Button size="sm" onClick={onGoCart} style={{ padding: '0 20px' }}>Xem Giỏ Hàng</Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function UserMenu({ onClose, onNav, onOrders, onLogout }) {
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
          {item('package', 'Đơn mua', () => onOrders())}
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
          <div onClick={() => { onClose(); window.location.href = '../vendor/index.html'; }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <Avatar name="TechZone Official" size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TechZone Official</div>
              <div style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>Chuyển đổi tài khoản</div>
            </div>
            <Icon name="refresh-cw" size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
          {item('log-out', 'Đăng xuất', () => onLogout(), true)}
        </div>
      </>
    );
  }

  function LangSelect() {
    const LANGS = [{ id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }, { id: 'en', label: 'English', flag: '🇬🇧' }];
    const [open, setOpen] = React.useState(false);
    const [lang, setLangState] = React.useState(window.LZI18n.lang);
    const setLang = (next) => { setLangState(next); window.LZI18n.set(next); };
    React.useEffect(() => { const on = (e) => setLangState(e.detail); window.addEventListener('lz_lang', on); return () => window.removeEventListener('lz_lang', on); }, []);
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

  function NotifPanel({ onItem, onSeeAll }) {
    const [, force] = React.useState(0);
    const items = NOTIFICATIONS.slice(0, 5);
    const markAll = () => { NOTIFICATIONS.forEach((n) => { n.unread = false; }); force((x) => x + 1); };
    return (
      <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 8, width: 360, zIndex: 95, cursor: 'default' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', color: 'var(--text-body)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Thông báo</span>
            <span onClick={markAll} style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 }}>Đánh dấu đã đọc</span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {items.map((n) => (
              <div key={n.id} onClick={() => onItem(n)} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: n.unread ? 'var(--orange-50)' : '#fff', cursor: 'pointer' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: n.icon === 'lazadee' ? 'transparent' : n.bg, color: n.tint, display: 'grid', placeItems: 'center', flex: 'none' }}>{n.icon === 'lazadee' ? <img src="../../assets/logomark.svg" alt="" width="26" height="26" /> : <Icon name={n.icon} size={19} />}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{n.title}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 1, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.body}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 3 }}>{n.date}</div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có thông báo nào</div>}
          </div>
          <div onClick={onSeeAll} style={{ padding: '11px 16px', textAlign: 'center', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--orange-600)', cursor: 'pointer' }}>Xem tất cả thông báo</div>
        </div>
      </div>
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
