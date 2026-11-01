/* Shared real-time chat: conversation list + thread with text, image, and
   product-card messages. Reused by vendor & customer surfaces. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Avatar, Badge, Button, Money } = DS;
  const formatVND = Money.format;

  const THREADS = [
    { id: 't1', name: 'Trần Thị Mai', last: 'Sản phẩm còn màu đen không shop?', unread: 2, online: true, time: '14:32' },
    { id: 't2', name: 'Nguyễn Văn An', last: 'Đã nhận hàng, cảm ơn shop!', unread: 0, online: false, time: '12:10' },
    { id: 't3', name: 'Lê Hoàng Phúc', last: '[Hình ảnh]', unread: 0, online: true, time: 'Hôm qua' },
  ];

  const ORDERS_OF = { t1: ['ORD-2412-0041', 'ORD-2412-0046'], t2: ['ORD-2412-0040'], t3: ['ORD-2412-0038'] };
  const SEED_OTHER = { t2: [{ from: 'them', kind: 'text', text: 'Đã nhận hàng, cảm ơn shop!', st: 'seen' }], t3: [{ from: 'them', kind: 'image', img: 'keyboard' }, { from: 'me', kind: 'text', text: 'Dạ shop xem rồi ạ, để shop kiểm tra giúp bạn.', st: 'seen' }] };
  const MSGS = [
    { from: 'them', kind: 'text', text: 'Chào shop, tai nghe ANC Pro 5 còn hàng màu đen không ạ?' },
    { from: 'them', kind: 'product', title: 'Tai nghe Bluetooth ANC Pro 5', img: 'headphones', price: 389000 },
    { from: 'me', kind: 'text', text: 'Dạ chào bạn, sản phẩm còn đủ màu đen nhé. Bên mình freeship đơn từ 199k ạ.' },
    { from: 'them', kind: 'text', text: 'Mình muốn xem thực tế sản phẩm được không shop?' },
    { from: 'me', kind: 'image', img: 'headphones' },
    { from: 'me', kind: 'text', text: 'Đây là ảnh thật bên mình chụp ạ. Bạn đặt mình gói cẩn thận gửi liền trong hôm nay nhé!' },
    { from: 'them', kind: 'text', text: 'Ok shop, mình đặt luôn đây 🧡' },
  ];

  function Bubble({ m, name }) {
    const mine = m.from === 'me';
    const base = { maxWidth: 300, borderRadius: 'var(--radius-lg)', padding: '9px 13px', font: 'var(--type-body)', lineHeight: 1.45 };
    return (
      <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        {!mine && <Avatar name={name} size={28} style={{ marginRight: 8, alignSelf: 'flex-end' }} />}
        {m.kind === 'text' && <div style={{ ...base, background: mine ? 'var(--color-primary)' : '#fff', color: mine ? '#fff' : 'var(--text-body)', border: mine ? 'none' : '1px solid var(--border-subtle)' }}>{m.text}</div>}
        {m.kind === 'image' && <img src={m.src || '../../assets/img/' + m.img + '.jpg'} alt="Ảnh trong tin nhắn" style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }} />}
        {m.kind === 'order' && <div style={{ width: 230, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 12 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}><Icon name="package" size={15} style={{ color: 'var(--color-primary)' }} />Thẻ đơn hàng</div><div className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-muted)', marginTop: 4 }}>{m.order}</div></div>}
        {m.kind === 'product' && (
          <div style={{ width: 230, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 10, padding: 10 }}>
              <img src={'../../assets/img/' + m.img + '.jpg'} style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none' }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.title}</div>
                <div style={{ font: '700 14px var(--font-sans)', color: 'var(--text-price)', marginTop: 3 }}>{formatVND(m.price)}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '7px 10px', font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)', color: 'var(--text-link)', textAlign: 'center' }}>Xem sản phẩm</div>
          </div>
        )}
      </div>
    );
  }

  function Chat() {
    const [active, setActive] = React.useState('t1');
    const [draft, setDraft] = React.useState('');
    const [threads, setThreads] = React.useState({ t1: MSGS, ...SEED_OTHER });
    const [unread, setUnread] = React.useState(() => Object.fromEntries(THREADS.map((t) => [t.id, t.unread])));
    const [orderMenu, setOrderMenu] = React.useState(false);
    const imgRef = React.useRef(null);
    const fileRef = React.useRef(null);
    const bodyRef = React.useRef(null);
    const cur = THREADS.find((t) => t.id === active);
    React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [threads, active]);
    const open = (id) => { setActive(id); setOrderMenu(false); setUnread((u) => ({ ...u, [id]: 0 })); };
    const push = (m) => {
      const msg = { from: 'me', st: 'sent', ...m };
      setThreads((th) => ({ ...th, [active]: [...th[active], msg] }));
      const id = active;
      setTimeout(() => setThreads((th) => ({ ...th, [id]: th[id].map((x) => (x === msg ? { ...x, st: 'seen' } : x)) })), 1200);
    };
    const send = () => { const t = draft.trim(); if (!t) return; push({ kind: 'text', text: t }); setDraft(''); };
    const pick = (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) push({ kind: 'image', src: URL.createObjectURL(f) }); };
    const pickFile = (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) push({ kind: 'text', text: '📎 ' + f.name }); };
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gridTemplateRows: '100%', height: 620, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {/* threads */}
        <div style={{ borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border-subtle)', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Tin nhắn</div>
          {THREADS.map((t) => (
            <button key={t.id} onClick={() => open(t.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', border: 0, borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', textAlign: 'left', background: active === t.id ? 'var(--color-primary-tint)' : '#fff' }}>
              <Avatar name={t.name} size={42} online={t.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span><span style={{ font: '11px var(--font-sans)', color: 'var(--text-subtle)' }}>{t.time}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.last}</span>
                  {unread[t.id] > 0 && <span style={{ background: 'var(--flash-500)', color: '#fff', font: '700 10px var(--font-sans)', minWidth: 16, height: 16, borderRadius: 8, display: 'grid', placeItems: 'center', padding: '0 4px' }}>{unread[t.id]}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* thread */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
            <Avatar name={cur.name} size={36} online={cur.online} />
            <div><div style={{ font: '600 14px var(--font-sans)', color: 'var(--text-strong)' }}>{cur.name}</div><div style={{ font: '11px var(--font-sans)', color: cur.online ? 'var(--mint-600)' : 'var(--text-subtle)' }}>{cur.online ? '● Đang hoạt động' : 'Ngoại tuyến'}</div></div>
            <div style={{ position: 'relative', marginLeft: 'auto' }}>
              <Button variant="ghost" size="sm" iconLeft="package" onClick={() => setOrderMenu((o) => !o)}>Đơn hàng</Button>
              {orderMenu && <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', width: 200, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 5, padding: 4 }}>
                {ORDERS_OF[active].map((id) => <div key={id} onClick={() => { push({ kind: 'order', order: id }); setOrderMenu(false); }} className="code" style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', font: '12px var(--font-mono)', color: 'var(--text-body)', cursor: 'pointer' }}>Gửi thẻ {id}</div>)}
              </div>}
            </div>
          </div>
          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: 18, background: 'var(--gray-50)' }}>
            {threads[active].map((m, i, all) => <React.Fragment key={i}><Bubble m={m} name={cur.name} />{m.from === 'me' && m.st && i === all.length - 1 && <div style={{ textAlign: 'right', font: '11px var(--font-sans)', color: 'var(--text-subtle)', marginTop: -6, marginBottom: 8 }}>{m.st === 'seen' ? 'Đã xem' : 'Đã nhận'}</div>}</React.Fragment>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderTop: '1px solid var(--border-default)' }}>
            <input ref={imgRef} type="file" hidden accept="image/*" onChange={pick} />
            <input ref={fileRef} type="file" hidden onChange={pickFile} />
            <button style={iconBtn} aria-label="Gửi ảnh" onClick={() => imgRef.current.click()}><Icon name="image" size={20} /></button>
            <button style={iconBtn} aria-label="Đính kèm tệp" onClick={() => fileRef.current.click()}><Icon name="paperclip" size={20} /></button>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Nhập tin nhắn…" style={{ flex: 1, height: 42, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '0 16px', font: 'var(--type-body)', outline: 'none' }} />
            <button style={{ ...iconBtn, background: 'var(--color-primary)', color: '#fff' }} aria-label="Gửi" onClick={send}><Icon name="send" size={20} /></button>
          </div>
        </div>
      </div>
    );
  }
  const iconBtn = { width: 42, height: 42, borderRadius: '50%', border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center', flex: 'none' };
  window.LZVChat = Chat;
})();
