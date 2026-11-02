/* Storefront pieces used on several screens: the product card, shop seal, money rail and
   hold note, plus the payment dialogs (VNPay redirect, VietQR with a mock SePay event). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Modal, Radio } = DS;
  const fmt = DS.Money.format;
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

  function CardX({ p, onClick, flashBar }) {
    const LZ = window.LZ;
    const [, force] = React.useState(0);
    React.useEffect(() => LZ.wishlist.subscribe(() => force((x) => x + 1)), []);
    const liked = LZ.wishlist.has(p.id);
    const vacation = LZ.V[p.v].vacation;
    const heart = (e) => {
      e.stopPropagation();
      if (!LZ.loggedIn) { emit('lz_require_login'); return; }
      LZ.wishlist.toggle(p.id);
      emit('show_toast', { message: liked ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích' });
    };
    const fp = p.image || p.img;
    return (
      <div className="tr-card">
        <button className="tr-card__main" onClick={onClick}>
          <span className="tr-card__media" style={{ display: 'block' }}>
            <img src={fp} alt="" loading="lazy" />
            {(vacation || p.preOrderDays) && <span className="tr-card__flag">{vacation ? 'Shop đang tạm nghỉ' : 'Đặt trước'}</span>}
            {p.discountPct > 0 && <span className="tr-card__off">-{p.discountPct}%</span>}
          </span>
          <span className="tr-card__body">
            <span className="tr-card__title">{p.title}</span>
            <span className="tr-card__price">
              <span className="tr-card__now">{fmt(p.price)}</span>
              {p.original > p.price && <span className="tr-card__was">{fmt(p.original)}</span>}
            </span>
            <span className="tr-card__meta">
              <window.LZSeal id={p.v} name={LZ.V[p.v].name} size={16} />
              <span className="tr-card__shop">{LZ.V[p.v].name}</span>
              <span className="tr-card__rate"><Icon name="star" size={12} style={{ color: 'var(--gold-500)', fill: 'currentColor' }} />{p.rating}</span>
            </span>
            {p.freeship && <span className="tr-card__meta tr-card__ship">Miễn phí vận chuyển</span>}
          </span>
        </button>
        <button className="tr-card__heart" onClick={heart} aria-label={liked ? 'Bỏ yêu thích' : 'Yêu thích'} aria-pressed={liked}>
          <Icon name="heart" size={17} style={{ fill: liked ? 'currentColor' : 'none' }} />
        </button>
        {flashBar && p.flashTotal && <FlashBar p={p} />}
      </div>
    );
  }

  function FlashBar({ p }) {
    const pct = Math.min(100, Math.round(p.flashSold / p.flashTotal * 100));
    const out = p.flashSold >= p.flashTotal;
    return <div className="tr-bar"><i style={{ width: pct + '%' }} /><span>{out ? 'Đã hết suất' : 'Đã bán ' + p.flashSold + '/' + p.flashTotal}</span></div>;
  }

  // A verified shop's seal: a fine-line rosette drawn from the shop id, so no two shops share one.
  function Seal({ id, name, size = 40 }) {
    const curves = React.useMemo(() => {
      let h = 7; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 9973;
      const k = 5 + (h % 7), turn = (h % 90) * Math.PI / 180, out = [];
      [1, 0.8, 0.62].forEach((scale, n) => {
        let d = '';
        for (let i = 0; i <= 180; i++) {
          const t = (i / 180) * 2 * Math.PI, r = 44 * scale * (0.72 + 0.28 * Math.cos(k * t + n * 0.9));
          d += (i ? 'L' : 'M') + (50 + r * Math.cos(t + turn)).toFixed(1) + ' ' + (50 + r * Math.sin(t + turn)).toFixed(1);
        }
        out.push(d + 'Z');
      });
      return out;
    }, [id]);
    const small = size < 28;
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={'Con dấu xác minh của ' + name} style={{ flex: 'none' }}>
        <circle cx="50" cy="50" r="49" fill="#fff" stroke="var(--brand-500)" strokeWidth={small ? 5 : 2} />
        {curves.slice(0, small ? 1 : 3).map((d) => <path key={d} d={d} fill="none" stroke="var(--brand-500)" strokeWidth={small ? 5 : 1.2} />)}
        {!small && <><circle cx="50" cy="50" r="19" fill="var(--brand-500)" /><text x="50" y="58" textAnchor="middle" fontSize="23" fontWeight="800" fill="#fff" fontFamily="var(--font-sans)">{name[0]}</text></>}
      </svg>
    );
  }

  const MONEY_STEPS = [
    { label: 'Bạn thanh toán', note: 'Trả qua VNPay hoặc VietQR. Chọn COD thì bạn trả tiền khi nhận hàng.' },
    { label: 'Genie giữ tiền', note: 'Tiền nằm ở sàn, shop chưa nhận được đồng nào.' },
    { label: 'Bạn nhận hàng', note: 'Bạn có 7 ngày kiểm tra và yêu cầu trả hàng nếu có lỗi.' },
    { label: 'Shop nhận tiền', note: 'Bạn xác nhận hoặc hết 7 ngày thì sàn mới chuyển tiền cho shop.' },
  ];
  // Where the buyer's money is right now. Interactive on home, a fixed state elsewhere.
  function MoneyRail({ amount, shop, start = 1, step: at, interactive, flat, onUser }) {
    const [step, setStep] = React.useState(start);
    const [moving, setMoving] = React.useState(false);
    const [auto, setAuto] = React.useState(!!interactive);
    const go = (i) => { setMoving(true); setStep(i); setTimeout(() => setMoving(false), 700); };
    React.useEffect(() => { if (typeof at === 'number' && at !== step) go(at); }, [at]);
    React.useEffect(() => {
      if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
      // One pass to "Shop nhận tiền", then the rail holds still until the buyer clicks.
      const t = setInterval(() => setStep((s) => {
        const next = Math.min(s + 1, MONEY_STEPS.length - 1);
        if (next === MONEY_STEPS.length - 1) setAuto(false);
        if (next !== s) { setMoving(true); setTimeout(() => setMoving(false), 700); }
        return next;
      }), 3600);
      return () => clearInterval(t);
    }, [auto]);
    return (
      <div className={'tr-rail ' + (flat ? 'tr-rail--flat' : 'tr-glass')}>
        <div className="tr-rail__head">
          <span>{interactive ? 'Ví dụ: ' : 'Đơn của bạn: '}<b>{fmt(amount)}</b>{shop ? ' tại ' + shop : ''}</span>
          {interactive && <span>Bấm từng bước để xem tiền đi đâu</span>}
        </div>
        <div className="tr-rail__track">
          <div className="tr-rail__line"><div className="tr-rail__fill" style={{ width: (step / (MONEY_STEPS.length - 1)) * 100 + '%' }} /></div>
          <span className="tr-rail__drop" data-moving={moving ? 1 : 0} style={{ left: (step + 0.5) * 25 + '%' }} aria-hidden="true">
            <svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="19.5" fill="var(--coin, #FFC02E)" stroke="#fff" strokeWidth="2" /><circle cx="21" cy="21" r="14.5" fill="none" stroke="var(--coin-ring, #8A6100)" strokeOpacity=".35" strokeWidth="1.5" /></svg>
            <Icon name="lock" size={16} strokeWidth={2.4} />
          </span>
          {MONEY_STEPS.map((s, i) => (
            <button key={s.label} className="tr-rail__stop" disabled={!interactive} data-done={i <= step ? 1 : 0} aria-current={i === step ? 'step' : undefined} onClick={() => { setAuto(false); go(i); }}>
              <span className="tr-rail__dot"><i /></span>{s.label}
            </button>
          ))}
        </div>
        <p className="tr-rail__note" aria-live="polite">{MONEY_STEPS[step].note}</p>
      </div>
    );
  }

  // Where the buyer's money is for one order: the promise, order by order.
  function MoneyChip({ o }) {
    const s = o.status;
    const [tone, text] = s === 'PENDING_PAYMENT' || s === 'CANCELLED' ? [null, null]
      : o.pay === 'COD' && s !== 'COMPLETED' ? ['muted', 'Trả tiền khi nhận hàng']
      : s === 'COMPLETED' ? ['done', 'Genie đã chuyển tiền cho shop']
      : s === 'RETURN_REQUESTED' ? ['hold', 'Genie giữ tiền trong lúc xử lý trả hàng']
      : ['hold', 'Genie đang giữ tiền'];
    if (!text) return null;
    return <span className={'tr-moneychip tr-moneychip--' + tone}><Icon name={tone === 'done' ? 'circle-check' : 'shield-check'} size={13} />{text}</span>;
  }

  const HoldNote = ({ children, style }) => <div className="tr-hold" style={style}><Icon name="shield-check" size={18} /><span>{children}</span></div>;

  // Looks like a QR but carries no data: the prototype takes no real money.
  function FakeQr({ seed, size = 188 }) {
    const n = 29;
    const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    const ring = (x, y) => { const a = x % (n - 7), b = y % (n - 7); const u = x >= n - 7 ? x - n + 7 : a, v = y >= n - 7 ? y - n + 7 : b; return u === 0 || u === 6 || v === 0 || v === 6 || (u >= 2 && u <= 4 && v >= 2 && v <= 4); };
    let h = 7; for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) % 9973;
    const cells = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const on = finder(x, y) ? ring(x, y) : ((x * 17 + y * 29 + h + x * y * 3) % 7) < 3;
      if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
    }
    return <svg role="img" aria-label="Mã QR mô phỏng" viewBox={'0 0 ' + n + ' ' + n} width={size} height={size} shapeRendering="crispEdges" fill="#14171F">{cells}</svg>;
  }

  function VietQrPanel({ amount, code, onPaid, onBack }) {
    const [left, setLeft] = React.useState(15 * 60);
    React.useEffect(() => { const i = setInterval(() => setLeft((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(i); }, []);
    const expired = left === 0;
    const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} emit('show_toast', { message: 'Đã sao chép' }); };
    const Row = ({ k, v, mono, can }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border-subtle)', font: 'var(--type-body-sm)' }}>
        <span style={{ color: 'var(--text-muted)', width: 112, flex: 'none' }}>{k}</span>
        <b className={mono ? 'code' : undefined} style={{ flex: 1, minWidth: 0, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{v}</b>
        {can && <button onClick={() => copy(v)} aria-label={'Sao chép ' + k} style={{ border: 0, background: 'transparent', color: 'var(--brand-600)', cursor: 'pointer', display: 'flex' }}><Icon name="copy" size={15} /></button>}
      </div>
    );
    return (
      <div>
        <div style={{ display: 'grid', placeItems: 'center', padding: 12, opacity: expired ? 0.25 : 1 }}><FakeQr seed={code} /></div>
        <div style={{ textAlign: 'center', font: 'var(--type-body-sm)', color: expired ? 'var(--red-600)' : 'var(--text-muted)', marginBottom: 10 }}>
          {expired ? 'Mã QR đã hết hạn, đơn hàng được huỷ và tồn kho được trả lại.' : <>Mã có hiệu lực trong <b className="code" style={{ color: 'var(--amber-600)' }}>{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</b></>}
        </div>
        <Row k="Ngân hàng" v="MB Bank (mô phỏng)" />
        <Row k="Số tài khoản" v="0000 8866 2024" mono can />
        <Row k="Chủ tài khoản" v="GENIE GIU TIEN" />
        <Row k="Số tiền" v={fmt(amount)} />
        <Row k="Nội dung CK" v={code} mono can />
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.5, margin: '10px 0 14px' }}>Chuyển đúng số tiền và nội dung để hệ thống tự xác nhận qua SePay. Sai nội dung sẽ cần đối soát thủ công.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button block iconLeft="circle-check" disabled={expired} onClick={onPaid}>Mô phỏng: SePay báo đã nhận tiền</Button>
          <Button block variant="ghost" onClick={onBack}>{expired ? 'Đóng' : 'Đổi phương thức'}</Button>
        </div>
      </div>
    );
  }

  const METHODS = [
    { id: 'vnpay', name: 'Cổng VNPAY', meta: 'Thẻ ATM / QR Code' },
    { id: 'vietqr', name: 'Chuyển khoản VietQR', meta: 'Tự xác nhận qua SePay' },
    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', meta: 'Chờ shop xác nhận' },
  ];
  // Pay again for a waiting order: choose a method, then finish in that method's flow.
  function PayModal({ open, amount, code, initial, onClose, onPaid }) {
    const [method, setMethod] = React.useState(initial || 'vnpay');
    const [stage, setStage] = React.useState(initial === 'vietqr' ? 'qr' : 'pick');
    const [busy, setBusy] = React.useState(false);
    React.useEffect(() => { if (open) { setMethod(initial || 'vnpay'); setStage(initial === 'vietqr' ? 'qr' : 'pick'); setBusy(false); } }, [open]);
    if (!open) return null;
    const next = () => {
      if (method === 'vietqr') { setStage('qr'); return; }
      if (method === 'cod') { onPaid(method); return; }
      setBusy(true);
      setTimeout(() => { setBusy(false); onPaid(method); }, 700);
    };
    return (
      <Modal open onClose={onClose} width={480} title={stage === 'qr' ? 'Thanh toán VietQR' : 'Chọn phương thức thanh toán'}
        footer={stage === 'pick' ? <><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button disabled={busy} onClick={next}>{busy ? 'Đang chuyển tới VNPAY...' : method === 'cod' ? 'Xác nhận COD ' + fmt(amount) : 'Thanh toán ' + fmt(amount)}</Button></> : null}>
        {stage === 'qr'
          ? <VietQrPanel amount={amount} code={code} onPaid={() => onPaid('vietqr')} onBack={() => (initial === 'vietqr' ? onClose() : setStage('pick'))} />
          : METHODS.map((m) => (
            <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1.5px solid ' + (method === m.id ? 'var(--color-primary)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', marginBottom: 8, cursor: 'pointer', background: method === m.id ? 'var(--color-primary-tint)' : '#fff' }}>
              <Radio name="repay" checked={method === m.id} onChange={() => setMethod(m.id)} />
              <span style={{ font: 'var(--weight-medium) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{m.name}</span>
              <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{m.meta}</span>
            </label>
          ))}
      </Modal>
    );
  }

  // Simulation controls for the thesis demo. Kept apart from real actions and closed by default.
  function DemoBox({ title, children, style }) {
    return (
      <details className="tr-demo" style={style}>
        <summary>Mô phỏng cho buổi demo: {title}</summary>
        <div className="tr-demo__body">{children}</div>
      </details>
    );
  }
  // ---- Banners from Admin → Banner -----------------------------------------------------
  // Links are relative to the site root, which in this kit is the storefront page itself.
  const followBanner = (b) => {
    if (!b || !b.link) return;
    window.LZ.banners.count(b.id, 'clicks');
    const u = new URL(b.link, location.origin);
    window.location.href = location.pathname + u.search + u.hash;
  };
  const useCountView = (b) => React.useEffect(() => { if (b) window.LZ.banners.count(b.id, 'views'); }, [b && b.id]);
  // Phones get the mobile image when Admin uploaded one; both crop from the center.
  const BannerPicture = ({ b }) => (
    <picture>
      {b.imageMobile && <source media="(max-width: 768px)" srcSet={b.imageMobile} />}
      <img src={b.image} alt={b.title} />
    </picture>
  );
  function Banner({ b }) {
    useCountView(b);
    if (!b) return null;
    return <button className="tr-banner" onClick={() => followBanner(b)}><BannerPicture b={b} /></button>;
  }
  // Every live banner of one position, in Admin order. Advances every 6 seconds, pauses while
  // hovered or focused, and stays still under reduced motion.
  function BannerCarousel({ items }) {
    const [i, setI] = React.useState(0);
    const [hold, setHold] = React.useState(false);
    const n = items.length;
    const b = items[i % Math.max(n, 1)];
    useCountView(b);
    React.useEffect(() => {
      if (n < 2 || hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
      const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
      return () => clearInterval(t);
    }, [n, hold]);
    if (!n) return null;
    return (
      <div className="tr-carousel" role="region" aria-roledescription="băng chuyền" aria-label="Banner trang chủ"
        onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
        <div className="tr-carousel__track" style={{ transform: 'translateX(' + (-100 * (i % n)) + '%)' }}>
          {items.map((x, k) => (
            <button key={x.id} className="tr-banner" tabIndex={k === i % n ? 0 : -1} aria-hidden={k !== i % n} onClick={() => followBanner(x)}
              aria-label={x.title + ' (' + (k + 1) + '/' + n + ')'}><BannerPicture b={x} /></button>
          ))}
        </div>
        {n > 1 && <>
          <button className="tr-carousel__nav tr-carousel__nav--prev" aria-label="Banner trước" onClick={() => setI((x) => (x - 1 + n) % n)}><Icon name="chevron-left" size={20} /></button>
          <button className="tr-carousel__nav tr-carousel__nav--next" aria-label="Banner sau" onClick={() => setI((x) => (x + 1) % n)}><Icon name="chevron-right" size={20} /></button>
          <div className="tr-carousel__dots">
            {items.map((x, k) => <button key={x.id} aria-label={'Banner ' + (k + 1)} aria-current={k === i % n ? 'true' : undefined} onClick={() => setI(k)} />)}
          </div>
        </>}
      </div>
    );
  }
  // Popup position: once per browser session, closes on Esc, the backdrop or the close button.
  function BannerPopup() {
    const b = React.useMemo(() => {
      try { if (sessionStorage.getItem('lz_popup_seen')) return null; } catch (e) {}
      return window.LZ.banners.live('POPUP')[0] || null;
    }, []);
    const [open, setOpen] = React.useState(!!b);
    const close = () => { setOpen(false); try { sessionStorage.setItem('lz_popup_seen', '1'); } catch (e) {} };
    React.useEffect(() => {
      if (!open) return undefined;
      const k = (e) => { if (e.key === 'Escape') close(); };
      window.addEventListener('keydown', k);
      return () => window.removeEventListener('keydown', k);
    }, [open]);
    if (!open) return null;
    return (
      <div className="tr-popup" onClick={close}>
        <div className="tr-popup__card" role="dialog" aria-modal="true" aria-label={b.title} onClick={(e) => e.stopPropagation()}>
          <Banner b={b} />
          <button className="tr-popup__close" onClick={close} aria-label="Đóng" autoFocus><Icon name="x" size={20} /></button>
        </div>
      </div>
    );
  }

  window.LZDemoBox = DemoBox;

  // Simulated VNPay gateway: the one moment the buyer's money moves, shown on the rail.
  function PayGateway({ amount, orders, onPaid, onCancel }) {
    const [stage, setStage] = React.useState(0);
    const pay = () => { setStage(1); setTimeout(() => onPaid(), 1300); };
    return (
      <Modal open onClose={stage ? () => {} : onCancel} width={520} title="Cổng thanh toán VNPAY (mô phỏng)"
        footer={<><Button variant="ghost" disabled={!!stage} onClick={onCancel}>Quay lại đơn hàng</Button><Button iconLeft="lock" disabled={!!stage} onClick={pay}>{stage ? 'Đang chuyển tiền...' : 'Thanh toán ' + fmt(amount)}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>
            <span>Đơn vị nhận: <b style={{ color: 'var(--text-strong)' }}>Genie, tài khoản giữ tiền</b></span><span>{orders} đơn</span>
          </div>
          <div style={{ font: '800 30px/1.2 var(--font-sans)', color: 'var(--text-price)' }}>{fmt(amount)}</div>
          <MoneyRail flat amount={amount} start={0} step={stage ? 1 : 0} />
          <p style={{ margin: 0, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Tiền chuyển vào tài khoản giữ tiền của Genie, chưa đến shop. Không có giao dịch thật nào xảy ra trong bản mẫu.</p>
        </div>
      </Modal>
    );
  }
  window.LZPayGateway = PayGateway;
  window.LZCardX = CardX;
  window.LZFlashBar = FlashBar;
  window.LZSeal = Seal;
  window.LZMoneyRail = MoneyRail;
  window.LZHoldNote = HoldNote;
  window.LZMoneyChip = MoneyChip;
  window.LZFakeQr = FakeQr;
  window.LZPayModal = PayModal;
  window.LZBanner = Banner;
  window.LZBannerCarousel = BannerCarousel;
  window.LZBannerPopup = BannerPopup;
})();
