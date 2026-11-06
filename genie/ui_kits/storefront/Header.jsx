/* Genie storefront header: floating glass bar (logo, search, cart, account) and the category row. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, IconButton, Badge, Modal, Button } = DS;
  const { CATEGORIES, USER, NOTIFICATIONS } = window.LZ;
  const { Avatar } = DS;
  const ThemePicker = window.GenieThemePicker;

  function Header({ cart = [], cartCount = 0, loggedIn = true, onNav, onOpen, onOrders, onNotifications, onOpenNotif, query, onSearch, onCategory, onShop, onRequireLogin, onLogin, onLogout }) {
    const [q, setQ] = React.useState(query || '');
    const [notifOpen, setNotifOpen] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const [userOpen, setUserOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const notifCount = loggedIn ? NOTIFICATIONS.filter((n) => n.unread).length : 0;
    const [sug, setSug] = React.useState([]);
    const [sugOpen, setSugOpen] = React.useState(false);
    const [act, setAct] = React.useState(-1);
    React.useEffect(() => setAct(-1), [sug]);
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
    // The bar and the category row stick together. Once the page moves they take the
    // theme's solid band, so nothing scrolls through the gap above the bar; their
    // height is published as --top-h for the sticky side panels below.
    const top = React.useRef(null);
    const [stuck, setStuck] = React.useState(false);
    React.useEffect(() => {
      const onScroll = () => setStuck(window.scrollY > 4);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      const ro = new ResizeObserver(() => document.documentElement.style.setProperty('--top-h', Math.round(top.current.getBoundingClientRect().height) + 'px'));
      ro.observe(top.current);
      return () => { window.removeEventListener('scroll', onScroll); ro.disconnect(); };
    }, []);
    return (
      <>
      <div ref={top} className="tr-top" data-stuck={stuck ? 1 : 0}>
      <header className="tr-pillwrap">
        <div className="tr-pill tr-glass">
          <button className="tr-logo" onClick={() => onNav('home')} aria-label="Genie, về trang chủ">
            <window.GenieMark size={34} />
            <span>Genie</span>
          </button>
          <div className="tr-search">
            {sugOpen && sug.length > 0 && (
              <div role="listbox" id="tr-sug" aria-label="Gợi ý tìm kiếm" className="tr-sug">
                {sug.map((s, i) => (
                  <div key={s.key} id={'tr-sug-' + i} role="option" aria-selected={i === act} onMouseDown={(e) => { e.preventDefault(); setSugOpen(false); s.go(); }} style={{ background: i === act ? 'var(--brand-50)' : undefined, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-body)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    {s.img ? <img src={s.img} alt="" width="32" height="32" style={{ borderRadius: 6, objectFit: 'cover', flex: 'none' }} /> : <Icon name={s.icon} size={18} style={{ color: 'var(--text-muted)', flex: 'none' }} />}
                    <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                    {s.hint && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{s.hint}</span>}
                  </div>
                ))}
              </div>
            )}
            <input value={q} aria-label="Tìm kiếm" role="combobox" aria-autocomplete="list" aria-controls="tr-sug" aria-expanded={sugOpen && sug.length > 0} aria-activedescendant={act >= 0 ? 'tr-sug-' + act : undefined} onChange={(e) => { setQ(e.target.value); setSugOpen(true); }} onFocus={() => setSugOpen(true)} onBlur={() => setSugOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault(); setSugOpen(true);
                  const step = e.key === 'ArrowDown' ? 1 : -1;
                  setAct((a) => { if (!sug.length) return -1; const n = a + step; return n < 0 ? sug.length - 1 : n >= sug.length ? 0 : n; });
                }
                if (e.key === 'Enter') { if (sugOpen && act >= 0 && sug[act]) { e.preventDefault(); setSugOpen(false); sug[act].go(); } else submit(); }
                if (e.key === 'Escape') setSugOpen(false);
              }}
              placeholder="Tìm sản phẩm, thương hiệu, shop đã xác minh…" />
            <button className="tr-search__go" onClick={submit} aria-label="Tìm"><Icon name="search" size={18} strokeWidth={2.4} /></button>
          </div>
          <div className="tr-actions">
            <button className="tr-textbtn tr-textbtn--wide" onClick={() => onNav('seller')}>Bán hàng</button>
            <span className="tr-textbtn--wide" style={{ display: 'inline-flex' }}><LangSelect /></span>
            <button className="tr-iconbtn tr-textbtn--wide" onClick={() => onNav('page', 'help-center')} aria-label="Hỗ trợ"><Icon name="circle-help" size={22} /></button>
            <ThemePicker />
            <div style={{ position: 'relative' }} onMouseEnter={() => loggedIn && setNotifOpen(true)} onMouseLeave={() => setNotifOpen(false)}>
              <button className="tr-iconbtn" onClick={() => (loggedIn ? onNotifications() : onRequireLogin())} aria-label={notifCount > 0 ? 'Thông báo, ' + notifCount + ' chưa đọc' : 'Thông báo'}><Icon name="bell" size={22} />{notifCount > 0 && <span className="tr-badge">{notifCount > 99 ? '99+' : notifCount}</span>}</button>
              {notifOpen && <NotifPanel onItem={(n) => { setNotifOpen(false); onOpenNotif(n); }} onSeeAll={() => { setNotifOpen(false); onNotifications(); }} />}
            </div>
            <div style={{ position: 'relative' }} onMouseEnter={() => loggedIn && setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
              <button className="tr-iconbtn" onClick={() => (loggedIn ? onNav('cart') : onRequireLogin())} aria-label={loggedIn && cartCount > 0 ? 'Giỏ hàng, ' + cartCount + ' sản phẩm' : 'Giỏ hàng'}><Icon name="shopping-cart" size={22} />{loggedIn && cartCount > 0 && <span className="tr-badge">{cartCount}</span>}</button>
              {cartOpen && <MiniCart cart={cart} onOpen={(id) => { setCartOpen(false); onOpen(id); }} onGoCart={() => { setCartOpen(false); onNav('cart'); }} />}
            </div>
            <div style={{ position: 'relative', marginLeft: 4 }}>
              {loggedIn
                ? <button className="tr-user" onClick={() => setUserOpen((o) => !o)} aria-haspopup="menu" aria-expanded={userOpen}><Avatar name={USER.name} src={USER.avatarUrl} size={30} /><span style={{ whiteSpace: 'nowrap' }}>{USER.name}</span></button>
                : <Button onClick={onLogin}>Đăng nhập</Button>}
              {loggedIn && userOpen && <UserMenu onClose={() => setUserOpen(false)} onNav={onNav} onOrders={onOrders} onLogout={() => setLogoutOpen(true)} />}
            </div>
          </div>
        </div>
      </header>
      <nav className="tr-cats" aria-label="Danh mục">
        {CATEGORIES.map((c, i) => (
          <button key={c.name} className="tr-cat" style={{ '--i': i }} onClick={() => (onCategory ? onCategory(c.name) : onSearch(c.name))}>
            <Icon name={c.icon} size={15} /> {c.name}
          </button>
        ))}
      </nav>
      </div>


        <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Đăng xuất"
          footer={<><Button variant="ghost" onClick={() => setLogoutOpen(false)}>Huỷ</Button><Button variant="danger" iconLeft="log-out" onClick={() => { setLogoutOpen(false); onLogout && onLogout(); }}>Đăng xuất</Button></>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 'min(420px, 80vw)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-50)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="log-out" size={20} /></div>
            <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc muốn đăng xuất khỏi tài khoản <b>{USER ? USER.name : ''}</b>?</div>
          </div>
        </Modal>
      </>
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
                  <div role="button" tabIndex={0} onKeyDown={window.LZKey} key={l.key} onClick={() => onOpen(l.productId)} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
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
      <div role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={() => { onClose(); onClick(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: danger ? 'var(--red-600)' : 'var(--text-body)', font: 'var(--type-body-sm)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = danger ? 'var(--red-50)' : 'var(--gray-50)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
        <Icon name={icon} size={17} /><span style={{ flex: 1 }}>{label}</span>
      </div>
    );
    return (
      <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 208, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', zIndex: 95, padding: 4, color: 'var(--text-body)', cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-100)', color: 'var(--brand-600)', display: 'grid', placeItems: 'center', font: '700 15px var(--font-sans)', flex: 'none' }}>{USER ? USER.name.trim().split(' ').pop()[0] : 'K'}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER ? USER.name : 'Khách'}</div>
              <div role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={() => { onClose(); onNav('account'); }} style={{ font: 'var(--type-caption)', color: 'var(--brand-600)', cursor: 'pointer', fontWeight: 600 }}>Xem hồ sơ</div>
            </div>
          </div>
          {item('user', 'Tài khoản của tôi', () => onNav('account'))}
          {item('package', 'Đơn mua', () => onOrders())}
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
          <div role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={() => { onClose(); window.location.href = '../vendor/index.html'; }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
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
    const LANGS = [{ id: 'vi', label: 'Tiếng Việt' }, { id: 'en', label: 'English' }];
    const [open, setOpen] = React.useState(false);
    const [lang, setLangState] = React.useState(window.LZI18n.lang);
    const setLang = (next) => { setLangState(next); window.LZI18n.set(next); };
    React.useEffect(() => { const on = (e) => setLangState(e.detail); window.addEventListener('lz_lang', on); return () => window.removeEventListener('lz_lang', on); }, []);
    const cur = LANGS.find((l) => l.id === lang);
    return (
      <span style={{ position: 'relative' }}>
        <button className="tr-textbtn" aria-expanded={open} aria-label={'Ngôn ngữ: ' + cur.label} onClick={() => setOpen((o) => !o)}>
          <span className="tr-lang-full">{cur.label}</span><span className="tr-lang-code">{cur.id.toUpperCase()}</span>
          <Icon name="chevron-down" size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
        </button>
        {open && (
          <>
            <span onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 110 }} />
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 168, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', zIndex: 115, overflow: 'hidden', padding: 4 }}>
              {LANGS.map((l) => (
                <div role="button" tabIndex={0} onKeyDown={window.LZKey} key={l.id} onClick={() => { setLang(l.id); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: l.id === lang ? 'var(--brand-50)' : 'transparent', color: l.id === lang ? 'var(--brand-600)' : 'var(--text-body)', font: (l.id === lang ? '600 ' : '500 ') + '13px var(--font-sans)' }}>
                  <span style={{ flex: 1 }}>{l.label}</span>{l.id === lang && <Icon name="check" size={15} />}
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
            <span role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={markAll} style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--brand-600)', cursor: 'pointer', fontWeight: 600 }}>Đánh dấu đã đọc</span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {items.map((n) => (
              <div role="button" tabIndex={0} onKeyDown={window.LZKey} key={n.id} onClick={() => onItem(n)} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: n.unread ? 'var(--brand-50)' : '#fff', cursor: 'pointer' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: n.icon === 'genie' ? 'transparent' : n.bg, color: n.tint, display: 'grid', placeItems: 'center', flex: 'none' }}>{n.icon === 'genie' ? <img src="../../assets/logomark.svg" alt="" width="26" height="26" /> : <Icon name={n.icon} size={19} />}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{n.title}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 1, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.body}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 3 }}>{n.date}</div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có thông báo nào</div>}
          </div>
          <div role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={onSeeAll} style={{ padding: '11px 16px', textAlign: 'center', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--brand-600)', cursor: 'pointer' }}>Xem tất cả thông báo</div>
        </div>
      </div>
    );
  }

  const ut = { display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' };

  window.LZHeader = Header;
})();
