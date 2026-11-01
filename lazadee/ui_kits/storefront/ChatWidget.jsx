/* Lazadee customer↔shop floating chat. Sticky launcher pinned bottom-right on
   every storefront page; opens an inbox of shop conversations → per-shop thread.
   Customer can switch between shops, each with its own history, unread count and
   online state. Text + product-card + image messages, quick replies, simulated
   shop auto-reply. Mounted once at App level so it survives screen changes. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Money } = DS;
  const fmtVND = Money.format;
  const V = (window.LZ && window.LZ.V) || {};
  const shop = (id) => V[id] || { id, name: id, logoBg: '#1E232E', mall: false };

  /* Per-shop conversation seeds. */
  const SEED = {
    techzone: [
      { from: 'shop', kind: 'text', text: 'Chào bạn 🧡 TechZone có thể giúp gì cho bạn hôm nay ạ?', time: '14:20' },
      { from: 'shop', kind: 'product', title: 'Tai nghe Bluetooth ANC Pro 5', img: 'headphones', price: 389000, time: '14:20' },
      { from: 'me', kind: 'text', text: 'Sản phẩm còn màu đen không shop?', time: '14:31' },
      { from: 'shop', kind: 'text', text: 'Dạ còn đủ màu đen bạn nhé! Freeship cho đơn từ 199k ạ.', time: '14:32' },
    ],
    beauty: [
      { from: 'shop', kind: 'text', text: 'Beauty Box chào bạn ạ! Bạn cần tư vấn sản phẩm nào ạ?', time: '10:02' },
      { from: 'me', kind: 'text', text: 'Serum Vitamin C còn hàng không shop?', time: '10:05' },
      { from: 'shop', kind: 'text', text: 'Dạ còn nha, bên mình đang có deal hoàn 50k xu cho đơn từ 300k ạ 🧡', time: '10:06' },
    ],
    shoe: [
      { from: 'shop', kind: 'text', text: 'Shoe Republic xin chào! Bạn đi size bao nhiêu để mình tư vấn ạ?', time: 'Hôm qua' },
      { from: 'me', kind: 'text', text: 'Mình mang size 42, đôi Air Run còn không ạ?', time: 'Hôm qua' },
      { from: 'shop', kind: 'text', text: 'Còn size 42 nha bạn, ship trong 2-3 ngày ạ.', time: 'Hôm qua' },
    ],
    boutique: [
      { from: 'shop', kind: 'text', text: 'Boutique Sài Gòn chào bạn 🧡', time: 'T2' },
      { from: 'shop', kind: 'image', img: 'jacket', time: 'T2' },
      { from: 'shop', kind: 'text', text: 'Áo khoác denim mẫu mới về bạn nhé, form rộng phong cách Hàn ạ.', time: 'T2' },
    ],
  };
  const ORDER = ['techzone', 'beauty', 'shoe', 'boutique'];
  const META = {
    techzone: { unread: 1, online: true, time: '14:32' },
    beauty: { unread: 2, online: true, time: '10:06' },
    shoe: { unread: 0, online: false, time: 'Hôm qua' },
    boutique: { unread: 0, online: true, time: 'T2' },
  };
  const QUICK = ['Sản phẩm còn hàng không?', 'Khi nào giao tới?', 'Có giảm thêm không ạ?', 'Cho mình xem ảnh thật'];
  const REPLIES = [
    'Dạ shop hỗ trợ bạn ngay ạ 🧡',
    'Sản phẩm còn hàng, bên mình đóng gói gửi liền trong hôm nay nhé!',
    'Đơn của bạn dự kiến giao trong 2–3 ngày, freeship toàn quốc ạ.',
    'Bạn để lại số điện thoại, shop tư vấn kỹ hơn nha!',
  ];
  const lastText = (m) => { if (!m) return ''; return m.kind === 'text' ? m.text : m.kind === 'image' ? '[Hình ảnh]' : '[Sản phẩm]'; };
  function now() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  function ShopMark({ id, size }) {
    const s = shop(id);
    return <div style={{ width: size, height: size, borderRadius: 'var(--radius-md)', background: s.logoBg || '#1E232E', color: '#fff', display: 'grid', placeItems: 'center', font: '800 ' + Math.round(size * 0.42) + 'px var(--font-sans)', flex: 'none' }}>{s.name[0]}</div>;
  }

  function Bubble({ m, shopId }) {
    const mine = m.from === 'me';
    const base = { maxWidth: 232, borderRadius: 'var(--radius-lg)', padding: '8px 12px', font: 'var(--type-body-sm)', lineHeight: 1.45 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, flexDirection: mine ? 'row-reverse' : 'row' }}>
          {!mine && <ShopMark id={shopId} size={26} />}
          {m.kind === 'text' && <div style={{ ...base, background: mine ? 'var(--color-primary)' : '#fff', color: mine ? '#fff' : 'var(--text-body)', border: mine ? 'none' : '1px solid var(--border-subtle)' }}>{m.text}</div>}
          {m.kind === 'image' && <img src={'../../assets/img/' + m.img + '.jpg'} alt="" style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }} />}
          {m.kind === 'product' && (
            <div style={{ width: 210, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 9, padding: 9 }}>
                <img src={'../../assets/img/' + m.img + '.jpg'} alt="" style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.title}</div>
                  <div style={{ font: '700 13px var(--font-sans)', color: 'var(--text-price)', marginTop: 2 }}>{fmtVND(m.price)}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '6px 10px', font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)', color: 'var(--text-link)', textAlign: 'center', cursor: 'pointer' }}>Xem sản phẩm</div>
            </div>
          )}
        </div>
        <span style={{ font: '10px var(--font-sans)', color: 'var(--text-subtle)', margin: mine ? '3px 33px 0 0' : '3px 0 0 33px' }}>{m.time}</span>
      </div>
    );
  }

  function ChatWidget() {
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState('list');          // list | thread
    const [activeShop, setActiveShop] = React.useState(null);
    const [threads, setThreads] = React.useState(SEED);
    const [meta, setMeta] = React.useState(META);
    const [draft, setDraft] = React.useState('');
    const [typing, setTyping] = React.useState(false);
    const bodyRef = React.useRef(null);
    const replyIdx = React.useRef(0);

    const totalUnread = ORDER.reduce((n, id) => n + (meta[id] ? meta[id].unread : 0), 0);

    React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [threads, typing, view, activeShop]);

    const openThread = (id) => {
      setActiveShop(id); setView('thread');
      setMeta((mt) => ({ ...mt, [id]: { ...mt[id], unread: 0 } }));
    };

    const send = (text) => {
      const t = (text != null ? text : draft).trim();
      if (!t || !activeShop) return;
      const id = activeShop, stamp = now();
      setThreads((th) => ({ ...th, [id]: [...th[id], { from: 'me', kind: 'text', text: t, time: stamp }] }));
      setMeta((mt) => ({ ...mt, [id]: { ...mt[id], time: stamp } }));
      setDraft('');
      setTyping(true);
      setTimeout(() => {
        const r = REPLIES[replyIdx.current % REPLIES.length]; replyIdx.current++;
        const rt = now();
        setTyping(false);
        setThreads((th) => ({ ...th, [id]: [...th[id], { from: 'shop', kind: 'text', text: r, time: rt }] }));
        setMeta((mt) => ({ ...mt, [id]: { ...mt[id], time: rt } }));
      }, 1100);
    };

    const s = activeShop ? shop(activeShop) : null;

    return (
      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 4000, fontFamily: 'var(--font-sans)' }}>
        {open && (
          <div style={{ position: 'absolute', right: 0, bottom: 76, width: 348, height: 496, background: 'var(--surface-page)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>

            {view === 'list' ? (
              <React.Fragment>
                {/* inbox header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', background: 'var(--color-primary)', color: '#fff', flex: 'none' }}>
                  <Icon name="message-circle" size={20} />
                  <span style={{ font: '700 15px var(--font-sans)', flex: 1 }}>Tin nhắn</span>
                  <button onClick={() => setOpen(false)} style={hdrBtn} aria-label="Đóng"><Icon name="x" size={18} /></button>
                </div>
                {/* conversation list */}
                <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
                  {ORDER.map((id) => {
                    const sh = shop(id); const mt = meta[id]; const msgs = threads[id];
                    return (
                      <button key={id} onClick={() => openThread(id)} style={{ display: 'flex', gap: 11, alignItems: 'center', width: '100%', padding: '11px 14px', border: 0, borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', textAlign: 'left', background: '#fff' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
                        <div style={{ position: 'relative', flex: 'none' }}>
                          <ShopMark id={id} size={44} />
                          {mt.online && <span style={{ position: 'absolute', right: -1, bottom: -1, width: 11, height: 11, borderRadius: '50%', background: 'var(--mint-500)', border: '2px solid #fff' }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sh.name}</span>
                            {sh.mall && <span style={{ font: '700 8px var(--font-sans)', background: 'var(--color-primary)', color: '#fff', borderRadius: 3, padding: '1px 4px', letterSpacing: '.04em' }}>MALL</span>}
                            <span style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>{mt.time}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <span style={{ font: '12px var(--font-sans)', color: mt.unread ? 'var(--text-body)' : 'var(--text-muted)', fontWeight: mt.unread ? 600 : 400, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastText(msgs[msgs.length - 1])}</span>
                            {mt.unread > 0 && <span style={{ background: 'var(--flash-500)', color: '#fff', font: '700 10px var(--font-sans)', minWidth: 16, height: 16, borderRadius: 8, display: 'grid', placeItems: 'center', padding: '0 4px', flex: 'none' }}>{mt.unread}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* thread header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', background: 'var(--color-primary)', color: '#fff', flex: 'none' }}>
                  <button onClick={() => setView('list')} style={hdrBtn} aria-label="Quay lại"><Icon name="arrow-left" size={19} /></button>
                  <div style={{ position: 'relative', flex: 'none' }}>
                    <ShopMark id={activeShop} size={36} />
                    {meta[activeShop].online && <span style={{ position: 'absolute', right: -1, bottom: -1, width: 10, height: 10, borderRadius: '50%', background: 'var(--mint-500)', border: '2px solid var(--color-primary)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ font: '700 14px var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                      {s.mall && <span style={{ font: '700 9px var(--font-sans)', background: '#fff', color: 'var(--color-primary)', borderRadius: 3, padding: '1px 5px', letterSpacing: '.04em' }}>MALL</span>}
                    </div>
                    <div style={{ font: '11px var(--font-sans)', color: 'rgba(255,255,255,.85)' }}>{meta[activeShop].online ? '● Đang hoạt động' : 'Hoạt động ' + meta[activeShop].time}</div>
                  </div>
                  <button onClick={() => setOpen(false)} style={hdrBtn} aria-label="Đóng"><Icon name="x" size={18} /></button>
                </div>

                {/* messages */}
                <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', background: 'var(--gray-50)' }}>
                  <div style={{ textAlign: 'center', font: '11px var(--font-sans)', color: 'var(--text-subtle)', margin: '0 0 12px' }}>Phản hồi {s.responseRate ? s.responseRate + '% · ' + s.responseTime : 'nhanh'}</div>
                  {threads[activeShop].map((m, i) => <Bubble key={i} m={m} shopId={activeShop} />)}
                  {typing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                      <ShopMark id={activeShop} size={26} />
                      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '10px 14px', display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map((n) => <span key={n} className="lz-typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animationDelay: (n * 0.15) + 's' }} />)}
                      </div>
                    </div>
                  )}
                </div>

                {/* quick replies */}
                <div style={{ display: 'flex', gap: 7, padding: '8px 12px 0', overflowX: 'auto', flex: 'none' }}>
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => send(q)} style={{ flex: 'none', font: '12px var(--font-sans)', color: 'var(--color-primary)', background: '#fff', border: '1px solid var(--orange-200)', borderRadius: 'var(--radius-pill)', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{q}</button>
                  ))}
                </div>

                {/* composer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--surface-page)', flex: 'none' }}>
                  <button style={iconBtn} aria-label="Gửi ảnh"><Icon name="image" size={19} /></button>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Nhập tin nhắn…" style={{ flex: 1, height: 40, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '0 15px', font: 'var(--type-body-sm)', outline: 'none', background: '#fff' }} />
                  <button onClick={() => send()} style={{ ...iconBtn, background: 'var(--color-primary)', color: '#fff' }} aria-label="Gửi"><Icon name="send" size={18} /></button>
                </div>
              </React.Fragment>
            )}
          </div>
        )}

        {/* launcher */}
        <button onClick={() => setOpen((o) => !o)} aria-label="Chat với shop"
          style={{ position: 'relative', width: 58, height: 58, borderRadius: '50%', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', boxShadow: 'var(--shadow-lg)', display: 'grid', placeItems: 'center', transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-fast)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--orange-600)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}>
          <Icon name={open ? 'chevron-down' : 'message-circle'} size={26} />
          {!open && totalUnread > 0 && <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, background: 'var(--flash-500)', color: '#fff', font: '700 11px var(--font-sans)', display: 'grid', placeItems: 'center', padding: '0 5px', border: '2px solid var(--surface-page)' }}>{totalUnread}</span>}
        </button>
      </div>
    );
  }

  const hdrBtn = { width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', flex: 'none' };
  const iconBtn = { width: 40, height: 40, borderRadius: '50%', border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center', flex: 'none' };

  window.LZChatWidget = ChatWidget;
})();
