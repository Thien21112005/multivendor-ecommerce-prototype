/* Vendor dashboard shell: dark sidebar nav + topbar. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Badge, StatusBadge, Avatar, Button, Modal } = DS;
  const { NAV, SHOP, NOTIFICATIONS } = window.LZV;

  function NotifBell() {
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState(NOTIFICATIONS);
    const [detail, setDetail] = React.useState(null);
    const timer = React.useRef(null);
    const unread = items.filter((n) => n.unread).length;
    const hoverIn = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), 150); };
    const hoverOut = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 250); };
    const read = (n) => { setItems((xs) => xs.map((x) => (x.id === n.id ? { ...x, unread: false } : x))); setDetail(n); setOpen(false); };
    return (
      <div style={{ position: 'relative' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
        <button style={{ ...ico, position: 'relative' }} aria-label="Thông báo" onClick={() => setOpen((o) => !o)}>
          <Icon name="bell" size={20} />
          {unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, background: 'var(--red-500)', color: '#fff', font: '700 10px var(--font-sans)', minWidth: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{unread}</span>}
        </button>
        {open && (
          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 340, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', zIndex: 100, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--surface-sunken)' }}>
              <b style={{ font: '600 14px var(--font-sans)', color: 'var(--text-strong)' }}>Thông báo</b>
              {unread > 0 && <button onClick={() => setItems((xs) => xs.map((x) => ({ ...x, unread: false })))} style={{ border: 0, background: 'none', padding: 0, color: 'var(--blue-600)', font: '500 12px var(--font-sans)', cursor: 'pointer' }}>Đánh dấu đã đọc</button>}
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {items.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', font: '500 13px var(--font-sans)' }}>Không có thông báo nào.</div>}
              {items.map((n) => (
                <div key={n.id} onClick={() => read(n)} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-default)', cursor: 'pointer', background: n.unread ? 'var(--blue-50)' : '#fff' }}>
                  <div style={{ position: 'relative', width: 44, height: 44, flex: 'none', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                    {n.icon === 'lazadee' ? <img src="../../assets/logomark.svg" width="28" height="28" alt="" /> : <Icon name={n.icon} size={20} />}
                    {n.unread && <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: 'var(--blue-500)', border: '2px solid #fff' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                    <div style={{ font: '13px/1.4 var(--font-sans)', color: 'var(--text-body)', margin: '3px 0 5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.body}</div>
                    <div style={{ font: '11px var(--font-sans)', color: 'var(--text-muted)' }}>{n.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Modal open={!!detail} onClose={() => setDetail(null)} width={500} title="Chi tiết thông báo" footer={<Button onClick={() => setDetail(null)}>Đã hiểu</Button>}>
          {detail && <div>
            <div style={{ font: '600 18px var(--font-sans)', color: 'var(--text-strong)' }}>{detail.title}</div>
            <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)', margin: '6px 0 14px' }}>{detail.date}</div>
            <div style={{ font: '14px/1.6 var(--font-sans)', color: 'var(--text-body)' }}>{detail.body}</div>
          </div>}
        </Modal>
      </div>
    );
  }

  function AccountMenu({ onNav }) {
    const [open, setOpen] = React.useState(false);
    const row = { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-body)' };
    const hover = { onMouseEnter: (e) => (e.currentTarget.style.background = 'var(--gray-50)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent') };
    return (
      <div style={{ position: 'relative' }}>
        <div onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}><Avatar name={SHOP.name} size={36} /></div>
        {open && <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 260, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', zIndex: 95, padding: 4 }}>
            <div {...hover} style={row} onClick={() => { setOpen(false); onNav('settings'); }}>
              <Avatar name={SHOP.name} size={36} />
              <div style={{ minWidth: 0 }}><div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{SHOP.name}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Quản lý cửa hàng</div></div>
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            <div {...hover} style={row} onClick={() => { window.location.href = '../storefront/index.html'; }}>
              <Avatar name="Kênh người mua" size={32} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)' }}>Kênh người mua</div><div style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>Trở về Lazadee</div></div>
              <Icon name="refresh-cw" size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            <div {...hover} style={{ ...row, color: 'var(--red-600)', font: '600 13px var(--font-sans)' }} onClick={() => { window.location.href = '../storefront/index.html?guest=1'; }}>
              <span style={{ width: 32, display: 'flex', justifyContent: 'center' }}><Icon name="log-out" size={18} /></span>Đăng xuất
            </div>
          </div>
        </>}
      </div>
    );
  }

  function VendorShell({ active, onNav, children, kyc = 'VERIFIED', setKyc }) {
    const [toast, setToast] = React.useState('');
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };
    const allow = (id) => kyc === 'VERIFIED' || id === 'kyc' || id === 'settings';
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '232px 1fr', minHeight: '100vh', background: 'var(--surface-page)' }}>
        {/* sidebar */}
        <aside style={{ background: 'var(--ink-900)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '18px 18px 16px' }}>
            <img src="../../assets/logomark.svg" width="32" height="32" alt="" />
            <div style={{ lineHeight: 1.05 }}>
              <div style={{ font: '800 18px var(--font-sans)', letterSpacing: '-0.02em', color: '#fff' }}>lazadee</div>
              <div style={{ font: '600 9px var(--font-sans)', letterSpacing: '.14em', color: 'var(--orange-400)', textTransform: 'uppercase' }}>Seller Center</div>
            </div>
          </div>
          {/* shop chip */}
          <div style={{ margin: '0 12px 12px', padding: '10px 12px', background: 'rgba(255,255,255,.06)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: '#fff', display: 'grid', placeItems: 'center', font: '800 15px var(--font-sans)', flex: 'none' }}>T</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: '600 13px var(--font-sans)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{SHOP.name}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '11px var(--font-sans)', color: kyc === 'VERIFIED' ? 'var(--mint-500)' : kyc === 'REJECTED' ? 'var(--flash-500)' : 'var(--gold-500)' }}><Icon name={kyc === 'VERIFIED' ? 'badge-check' : kyc === 'REJECTED' ? 'triangle-alert' : 'clock'} size={12} /> {kyc === 'VERIFIED' ? 'Đã xác minh' : kyc === 'REJECTED' ? 'KYC bị từ chối' : kyc === 'NOT_SUBMITTED' ? 'Chưa nộp KYC' : 'KYC đang chờ'}</div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
            {NAV.map((n) => {
              const on = n.id === active;
              const ok = allow(n.id);
              return (
                <button key={n.id} onClick={() => (ok ? onNav(n.id) : showToast('Hoàn tất xác minh KYC để sử dụng tính năng này'))} style={{
                  display: 'flex', alignItems: 'center', gap: 11, padding: '0 12px', height: 44, borderRadius: 'var(--radius-md)', border: 0, cursor: ok ? 'pointer' : 'not-allowed', textAlign: 'left',
                  background: on ? 'var(--color-primary)' : 'transparent',
                  color: on ? '#fff' : ok ? 'rgba(255,255,255,.66)' : 'rgba(255,255,255,.3)',
                  font: (on ? '600' : '500') + ' 14px var(--font-sans)',
                }}>
                  <Icon name={n.icon} size={19} />
                  <span style={{ flex: 1 }}>{n.name}</span>
                  {!ok && <Icon name="lock" size={14} style={{ opacity: .7 }} />}
                  {ok && n.badge && <span style={{ background: on ? 'rgba(255,255,255,.25)' : 'var(--flash-500)', color: '#fff', font: '700 11px var(--font-sans)', minWidth: 18, height: 18, borderRadius: 9, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{n.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: 12 }}>
            <button onClick={() => { window.location.href = '../storefront/index.html?guest=1'; }} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 12px', height: 44, width: '100%', borderRadius: 'var(--radius-md)', border: 0, cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,.5)', font: '500 14px var(--font-sans)' }}>
              <Icon name="log-out" size={19} /> Đăng xuất
            </button>
          </div>
        </aside>

        {/* main */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header style={{ height: 64, background: '#fff', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
            <h1 style={{ font: 'var(--weight-bold) var(--text-2xl) var(--font-sans)', color: 'var(--text-strong)' }}>{(NAV.find((n) => n.id === active) || {}).name}</h1>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4, padding: '4px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)' }} title="Demo: chuyển trạng thái KYC để xem cổng khoá">
                <span style={{ font: '600 10px var(--font-sans)', color: 'var(--text-subtle)', letterSpacing: '.04em' }}>KYC</span>
                {['NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED'].map((s) => (
                  <button key={s} onClick={() => setKyc && setKyc(s)} style={{ height: 24, padding: '0 8px', borderRadius: 'var(--radius-pill)', border: 0, cursor: 'pointer', background: kyc === s ? 'var(--color-primary)' : 'transparent', color: kyc === s ? '#fff' : 'var(--text-muted)', font: '600 10px var(--font-sans)' }}>{s}</button>
                ))}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: 12, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
                <input placeholder="Tìm đơn, sản phẩm…" style={{ width: 260, height: 40, paddingLeft: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none' }} />
              </div>
              <NotifBell />
              <button style={ico} aria-label="Trợ giúp" onClick={() => { window.location.href = '../storefront/index.html?screen=page&id=help-center'; }}><Icon name="circle-help" size={20} /></button>
              <div style={{ width: 1, height: 28, background: 'var(--border-default)', margin: '0 4px' }} />
              <AccountMenu onNav={onNav} />
            </div>
          </header>
          <main style={{ flex: 1, padding: '24px 28px 60px', minWidth: 0 }}>{children}</main>
        </div>
        {toast && <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink-900)', color: '#fff', padding: '11px 18px', borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', boxShadow: 'var(--shadow-lg)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="lock" size={15} />{toast}</div>}
      </div>
    );
  }

  const ico = { width: 40, height: 40, borderRadius: 'var(--radius-md)', border: 0, background: 'transparent', color: 'var(--text-body)', cursor: 'pointer', display: 'grid', placeItems: 'center' };

  window.LZVShell = VendorShell;
})();
