/* Storefront pieces used on several screens: the product card with wishlist heart and
   sale labels, plus the payment dialogs (VNPay redirect, VietQR with a mock SePay event). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Modal, ProductCard, Radio } = DS;
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
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        <ProductCard {...LZ.card(p)} onClick={onClick} />
        <button onClick={heart} aria-label={liked ? 'Bỏ yêu thích' : 'Yêu thích'} aria-pressed={liked} style={{ position: 'absolute', top: 40, right: 8, width: 30, height: 30, borderRadius: '50%', border: 0, background: 'rgba(255,255,255,.92)', boxShadow: 'var(--shadow-sm)', color: liked ? 'var(--flash-500)' : 'var(--text-muted)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <Icon name="heart" size={16} style={{ fill: liked ? 'currentColor' : 'none' }} />
        </button>
        {(vacation || p.preOrderDays) && <span style={{ position: 'absolute', top: 76, right: 8, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: vacation ? 'var(--ink-900)' : 'var(--blue-600)', color: '#fff', font: '600 11px/16px var(--font-sans)' }}>{vacation ? 'Shop đang tạm nghỉ' : 'Đặt trước'}</span>}
        {flashBar && p.flashTotal && <FlashBar p={p} />}
      </div>
    );
  }

  function FlashBar({ p }) {
    const pct = Math.min(100, Math.round(p.flashSold / p.flashTotal * 100));
    const out = p.flashSold >= p.flashTotal;
    return (
      <div style={{ position: 'relative', height: 18, borderRadius: 9, background: 'var(--flash-50)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: 'var(--flash-500)' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', font: '700 10.5px var(--font-sans)', color: pct > 50 ? '#fff' : 'var(--flash-600)' }}>{out ? 'Đã hết suất' : 'Đã bán ' + p.flashSold + '/' + p.flashTotal}</span>
      </div>
    );
  }

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
        {can && <button onClick={() => copy(v)} aria-label={'Sao chép ' + k} style={{ border: 0, background: 'transparent', color: 'var(--orange-600)', cursor: 'pointer', display: 'flex' }}><Icon name="copy" size={15} /></button>}
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
        <Row k="Chủ tài khoản" v="LAZADEE ESCROW" />
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
      setBusy(true);
      setTimeout(() => { setBusy(false); onPaid(method); }, 700);
    };
    return (
      <Modal open onClose={onClose} width={480} title={stage === 'qr' ? 'Thanh toán VietQR' : 'Chọn phương thức thanh toán'}
        footer={stage === 'pick' ? <><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button disabled={busy} onClick={next}>{busy ? 'Đang chuyển tới VNPAY...' : 'Thanh toán ' + fmt(amount)}</Button></> : null}>
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

  window.LZCardX = CardX;
  window.LZFlashBar = FlashBar;
  window.LZFakeQr = FakeQr;
  window.LZPayModal = PayModal;
})();
