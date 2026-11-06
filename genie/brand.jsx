/* Genie brand pieces shared by every surface (storefront, Seller Center, Admin Console, sign-in):
   the coin logo, the script wordmark and the theme picker. Needs themes.js (GENIE_THEMES,
   GENIE_SET_THEME) and assets/brand/genie-coin.js (GENIE_COIN_TEXT) loaded first. */
(function () {
  const { Icon } = window.LazadeeDesignSystem_0477b7;

  // The Genie coin (logo/Webicon.svg), drawn inline so each theme recolours it: three rings
  // and the band take --mark-1..3, the lettering takes --mark-ink. The embossed GENIE behind
  // the band is a white matte, so it lightens whatever metal the theme picks.
  function GenieMark({ size = 32 }) {
    return (
      <svg className="tr-mark" width={size} height={size} viewBox="0 0 1080 1080" aria-hidden="true">
        <circle cx="540" cy="540" r="540" fill="var(--mark-1)" />
        <circle cx="540" cy="540" r="486" fill="var(--mark-2)" />
        <circle cx="540" cy="540" r="437.4" fill="var(--mark-3)" />
        {size >= 48 && <image href="../../assets/brand/coin-backdrop.png" x="99.12" y="109.74" width="873.36" height="860.4" preserveAspectRatio="none" opacity=".44" />}
        <path fill="var(--mark-3)" d="M113.35 436.17H966.65A437.4 471.17 0 0 1 966.65 643.83H113.35A437.4 471.17 0 0 1 113.35 436.17Z" />
        <path fill="var(--mark-ink)" d={window.GENIE_COIN_TEXT} />
      </svg>
    );
  }


  // Lets the buyer pick the storefront's look. Each choice previews itself: the option's
  // coin sits inside its own data-theme scope, so it shows that theme's metal and ink.
  function ThemePicker({ className = 'tr-iconbtn', style }) {
    const themes = window.GENIE_THEMES || [];
    const [open, setOpen] = React.useState(false);
    const [cur, setCur] = React.useState(() => document.documentElement.getAttribute('data-theme'));
    const btn = React.useRef(null);
    const list = React.useRef(null);
    React.useEffect(() => {
      const sync = () => setCur(document.documentElement.getAttribute('data-theme'));
      const mo = new MutationObserver(sync);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => mo.disconnect();
    }, []);
    React.useEffect(() => {
      if (!open) return undefined;
      const el = list.current && list.current.querySelector('[aria-checked="true"]');
      if (el) el.focus();
      const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current && btn.current.focus(); } };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [open]);
    const pick = (id) => { window.GENIE_SET_THEME(id); setCur(id); };
    const onListKey = (e) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const items = [...list.current.querySelectorAll('[role="radio"]')];
      const i = items.indexOf(document.activeElement);
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[n].focus();
    };
    // The panel is portalled to <body>: the glass bar's backdrop-filter would otherwise
    // trap it (and the phone sheet) inside the bar. On wide screens it hangs from the button.
    const [pos, setPos] = React.useState(null);
    React.useLayoutEffect(() => {
      if (!open) return undefined;
      const place = () => {
        const r = btn.current.getBoundingClientRect();
        setPos({ top: r.bottom + 10, right: Math.max(8, window.innerWidth - r.right - 6) });
      };
      place();
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, { passive: true });
      return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place); };
    }, [open]);
    const now = themes.find((t) => t.id === cur);
    if (!themes.length) return null;
    return (
      <div className="tr-theme">
        <button ref={btn} className={className} style={style} onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open} aria-label={'Giao diện: ' + (now ? now.name : '')} title="Đổi giao diện">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3.5-4 3.5h-1.8a1.7 1.7 0 0 0-1.3 2.8c.4.5.6 1 .6 1.6 0 1.2-1.4 2.1-3.5 2.1Z" />
            <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" /><circle cx="10.5" cy="6.8" r="1.1" fill="currentColor" /><circle cx="15.2" cy="7.3" r="1.1" fill="currentColor" />
          </svg>
        </button>
        {open && ReactDOM.createPortal(
          <>
            <span className="tr-theme__scrim" onClick={() => setOpen(false)} />
            <div className="tr-theme__pop" role="dialog" aria-label="Chọn giao diện" style={pos ? { '--pop-top': pos.top + 'px', '--pop-right': pos.right + 'px' } : undefined}>
              <div className="tr-theme__head">
                <b>Giao diện</b>
                <span>Lưu trên trình duyệt này</span>
              </div>
              <div ref={list} role="radiogroup" aria-label="Giao diện" className="tr-theme__list" onKeyDown={onListKey}>
                {themes.map((t) => (
                  <button key={t.id} role="radio" aria-checked={t.id === cur} tabIndex={t.id === cur ? 0 : -1} className="tr-theme__opt" onClick={() => pick(t.id)}>
                    <span className="tr-theme__coin" data-theme={t.id}><GenieMark size={36} /></span>
                    <span className="tr-theme__txt"><b>{t.name}{t.id === cur && <Icon name="check" size={14} strokeWidth={2.6} />}</b><small>{t.note}</small></span>
                    <span className="tr-theme__sw" aria-hidden="true">{t.swatch.map((c) => <i key={c} style={{ background: c }} />)}</span>
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body,
        )}
      </div>
    );
  }

  // The coin plus "Genie" in the logo's own script. tone="light" for dark grounds.
  function GenieLogo({ size = 32, sub, tone }) {
    return (
      <span className="gn-logo" data-tone={tone}>
        <GenieMark size={size} />
        <span className="gn-logo__txt"><span className="gn-logo__word">Genie</span>{sub && <small>{sub}</small>}</span>
      </span>
    );
  }


  window.GenieMark = GenieMark;
  window.GenieLogo = GenieLogo;
  window.GenieThemePicker = ThemePicker;
})();
