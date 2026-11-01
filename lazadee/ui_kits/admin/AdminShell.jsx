/* Admin panel shell: ink sidebar with a teal accent rail to distinguish it from
   the vendor (tangerine) Seller Center. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Avatar, Badge } = DS;
  const { NAV, CURRENT_USER, ROLE_PERMS } = window.LZA;
  const PREVIEW_ROLES = ['Super Admin', 'Moderator', 'Finance Staff', 'CS Staff'];

  function AdminShell({ active, onNav, children }) {
    // Role preview (demo): switch the effective role to see nav gate.
    const [role, setRole] = React.useState(CURRENT_USER.role);
    const perms = role === CURRENT_USER.role ? CURRENT_USER.perms : (ROLE_PERMS[role] || []);
    const can = (n) => !n.perm || perms.includes(n.perm);
    const visibleNav = NAV.filter(can);
    const activeNav = NAV.find((n) => n.id === active) || {};
    const denied = activeNav.perm && !perms.includes(activeNav.perm);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '236px 1fr', minHeight: '100vh', background: 'var(--surface-page)' }}>
        <aside style={{ background: 'var(--ink-950)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '18px 18px 14px' }}>
            <img src="../../assets/logomark.svg" width="30" height="30" alt="" />
            <div style={{ lineHeight: 1.05 }}>
              <div style={{ font: '800 17px var(--font-sans)', letterSpacing: '-0.02em', color: '#fff' }}>lazadee</div>
              <div style={{ font: '600 9px var(--font-sans)', letterSpacing: '.14em', color: 'var(--blue-500)', textTransform: 'uppercase' }}>Admin Console</div>
            </div>
          </div>
          <div style={{ margin: '0 12px 12px', padding: '8px 12px', background: 'rgba(37,99,235,.14)', border: '1px solid rgba(37,99,235,.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="shield-check" size={15} style={{ color: 'var(--blue-500)' }} />
            <span style={{ font: '600 11px var(--font-sans)', color: 'rgba(255,255,255,.82)' }}>Quyền: {role}</span>
          </div>
          <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
            {visibleNav.map((n) => {
              const on = n.id === active;
              return (
                <button key={n.id} onClick={() => onNav(n.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 11, padding: '0 12px', height: 44, borderRadius: 'var(--radius-md)', border: 0, cursor: 'pointer', textAlign: 'left',
                  background: on ? 'var(--blue-500)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,.62)',
                  font: (on ? '600' : '500') + ' 13.5px var(--font-sans)',
                }}>
                  <Icon name={n.icon} size={18} />
                  <span style={{ flex: 1 }}>{n.name}</span>
                  {n.badge && <span style={{ background: on ? 'rgba(255,255,255,.25)' : 'var(--flash-500)', color: '#fff', font: '700 11px var(--font-sans)', minWidth: 18, height: 18, borderRadius: 9, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{n.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div onClick={() => onNav('account')} style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <Avatar name={CURRENT_USER.name} size={34} />
            <div style={{ minWidth: 0 }}>
              <div style={{ font: '600 12px var(--font-sans)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{CURRENT_USER.name}</div>
              <div style={{ font: '11px var(--font-sans)', color: 'rgba(255,255,255,.5)' }}>{CURRENT_USER.role}</div>
            </div>
            <Icon name="settings" size={17} style={{ color: 'rgba(255,255,255,.5)', marginLeft: 'auto' }} />
          </div>
        </aside>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header style={{ height: 64, background: '#fff', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
            <h1 style={{ font: 'var(--weight-bold) var(--text-2xl) var(--font-sans)', color: 'var(--text-strong)' }}>{activeNav.name}</h1>
            <Badge variant="outline" style={{ marginLeft: 4 }}>Staff RBAC</Badge>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-sunken)' }} title="Demo: xem sidebar với vai trò khác">
                <Icon name="eye" size={15} style={{ color: 'var(--text-muted)' }} />
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Xem với vai trò:</span>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ border: 0, background: 'transparent', font: '600 13px var(--font-sans)', color: 'var(--blue-600)', cursor: 'pointer', outline: 'none' }}>
                  {PREVIEW_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button style={ico}><Icon name="bell" size={20} /></button>
              <button style={ico}><Icon name="settings" size={20} /></button>
            </div>
          </header>
          <main style={{ flex: 1, padding: '24px 28px 60px', minWidth: 0 }}>
            {denied
              ? <div style={{ display: 'grid', placeItems: 'center', minHeight: 420, textAlign: 'center' }}>
                  <div>
                    <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--red-50, #FDECEA)', color: 'var(--red-600)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}><Icon name="lock" size={42} /></div>
                    <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', marginBottom: 10 }}>Bạn không có quyền truy cập</h2>
                    <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto' }}>Màn “{activeNav.name}” yêu cầu quyền <span className="code" style={{ color: 'var(--text-body)' }}>{activeNav.perm}</span>. Liên hệ Super Admin để được cấp quyền.</p>
                  </div>
                </div>
              : children}
          </main>
        </div>
      </div>
    );
  }
  const ico = { width: 40, height: 40, borderRadius: 'var(--radius-md)', border: 0, background: 'transparent', color: 'var(--text-body)', cursor: 'pointer', display: 'grid', placeItems: 'center' };

  window.LZAShell = AdminShell;
})();
