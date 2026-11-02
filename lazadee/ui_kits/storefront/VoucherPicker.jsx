/* Genie voucher picker: scrollable list of every saved voucher, grouped by type.
   Enter a code or pick from the list; vouchers that do not apply stay visible, greyed,
   with the reason. Used by Cart (Genie + per-shop) and Checkout. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Modal, Money } = DS;
  const formatVND = Money.format;
  const LZ = window.LZ;

  const toast = (message, type) => window.dispatchEvent(new CustomEvent('show_toast', { detail: { message, type } }));

  function Ticket({ v, on, ok, reason, onPick }) {
    const color = v.kind === 'freeship' ? 'var(--mint-500)' : v.kind === 'shop' ? 'var(--flash-500)' : 'var(--brand-500)';
    return (
      <div role="button" tabIndex={0} onKeyDown={window.LZKey} onClick={() => ok && onPick(v)} style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-subtle)'), boxShadow: on ? '0 0 0 3px var(--color-primary-tint)' : 'none', cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.72 }}>
        <div style={{ display: 'flex', minHeight: 92 }}>
          <div style={{ width: 96, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#fff', background: ok ? color : 'var(--gray-400)' }}>
            <Icon name={v.kind === 'freeship' ? 'truck' : v.kind === 'shop' ? 'store' : 'ticket'} size={22} />
            <span style={{ font: '800 17px var(--font-sans)' }}>{v.amount}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: '10px 14px' }}>
            <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{v.label}</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{v.cond} · {v.scope}</div>
            {v.categories && <div style={{ display: 'inline-block', marginTop: 5, padding: '1px 7px', borderRadius: 'var(--radius-sm)', background: 'var(--mint-50)', color: 'var(--mint-600)', font: '600 11px var(--font-sans)' }}>Chỉ áp dụng: {v.categories.join(', ')}</div>}
            {v.excluded && <div style={{ display: 'inline-block', marginTop: 5, padding: '1px 7px', borderRadius: 'var(--radius-sm)', background: 'var(--brand-50)', color: 'var(--brand-600)', font: '600 11px var(--font-sans)' }}>Ngoại trừ: {v.excluded.join(', ')}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span className="code" style={{ font: '600 11px var(--font-mono)', color: 'var(--text-body)', background: 'var(--gray-100)', padding: '1px 6px', borderRadius: 'var(--radius-sm)' }}>{v.code}</span>
              <span style={{ font: 'var(--type-caption)', color: 'var(--flash-600)' }}>HSD: {v.expiry}</span>
            </div>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', padding: '0 14px', flex: 'none' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'grid', placeItems: 'center', border: on ? 'none' : '1.5px solid var(--border-strong)', background: on ? 'var(--color-primary)' : ok ? '#fff' : 'var(--gray-100)', color: '#fff' }}>{on && <Icon name="check" size={14} />}</span>
          </div>
        </div>
        {!ok && <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--amber-50)', color: 'var(--amber-600)', padding: '6px 12px', font: 'var(--type-caption)' }}><Icon name="info" size={13} />{reason}</div>}
      </div>
    );
  }

  /* mode 'platform': one platform + one freeship voucher. mode 'shop': one voucher of vendorId. */
  function VoucherPicker({ open, onClose, title, mode = 'platform', vendorId, lines = [], selected = {}, onConfirm }) {
    const [platform, setPlatform] = React.useState(null);
    const [freeship, setFreeship] = React.useState(null);
    const [shop, setShop] = React.useState(null);
    const [code, setCode] = React.useState('');

    React.useEffect(() => {
      if (!open) return;
      setPlatform(selected.platform || null); setFreeship(selected.freeship || null);
      setShop(selected.shop || null); setCode('');
    }, [open]);

    const pool = LZ.VOUCHERS.filter((v) => v.saved && v.status === 'active' && (mode === 'shop' ? v.kind === 'shop' && v.vendorId === vendorId : v.kind !== 'shop'));
    const query = code.trim().toLowerCase();
    const shown = query ? pool.filter((v) => (v.code + ' ' + v.label).toLowerCase().includes(query)) : pool;

    const isOn = (v) => (v.kind === 'freeship' ? freeship === v.id : v.kind === 'shop' ? shop === v.id : platform === v.id);
    const pick = (v) => {
      if (v.kind === 'freeship') setFreeship(isOn(v) ? null : v.id);
      else if (v.kind === 'shop') setShop(isOn(v) ? null : v.id);
      else setPlatform(isOn(v) ? null : v.id);
    };
    const apply = () => {
      const c = code.trim().toUpperCase();
      if (!c) return;
      const v = LZ.VOUCHERS.find((x) => x.code === c && (mode === 'shop' ? x.vendorId === vendorId : x.kind !== 'shop'));
      if (!v || v.status !== 'active') { toast('Mã voucher không tồn tại hoặc đã hết hạn.', 'error'); return; }
      if (!LZ.voucherCheck(v, lines, selected).ok) { toast('Mã voucher chưa đủ điều kiện áp dụng cho đơn hàng này.', 'error'); return; }
      if (!isOn(v)) pick(v);
      setCode('');
      toast('Áp dụng mã voucher thành công!');
    };

    const chosen = [platform, freeship, shop].filter(Boolean).map((id) => LZ.VOUCHERS.find((v) => v.id === id)).filter(Boolean);
    const saving = chosen.filter((v) => v.kind !== 'freeship').reduce((n, v) => n + LZ.voucherDiscount(v, lines, selected), 0);
    const hasFreeship = chosen.some((v) => v.kind === 'freeship');

    const Section = ({ head, list }) => list.length === 0 ? null : (
      <div style={{ marginBottom: 20 }}>
        <div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 }}>{head}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((v) => { const c = LZ.voucherCheck(v, lines, selected); return <Ticket key={v.id} v={v} on={isOn(v)} ok={c.ok} reason={c.reason} onPick={pick} />; })}
        </div>
      </div>
    );

    return (
      <Modal open={open} onClose={onClose} width={620} title={title || 'Chọn Voucher'}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '68vh', maxHeight: 640, margin: '-18px -20px' }}>
          <div style={{ display: 'flex', gap: 10, padding: '14px 20px', background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Mã Voucher</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Nhập mã voucher" style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', height: 40, font: 'var(--type-body)', background: 'transparent' }} />
            </div>
            <Button variant="secondary" disabled={!code.trim()} onClick={apply}>Áp dụng</Button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {shown.length === 0
              ? <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '48px 0', color: 'var(--text-subtle)' }}><Icon name="ticket" size={40} /><span style={{ font: 'var(--type-body)' }}>Chưa có mã giảm giá nào phù hợp</span></div>
              : mode === 'shop'
                ? <Section head="Voucher của Shop" list={shown} />
                : <>
                    <Section head="Mã Giảm Giá" list={shown.filter((v) => v.kind === 'platform')} />
                    <Section head="Miễn Phí Vận Chuyển" list={shown.filter((v) => v.kind === 'freeship')} />
                  </>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>
              {chosen.length === 0 ? 'Chưa chọn Voucher nào' : <>Đã chọn {chosen.length} Voucher. <b style={{ color: 'var(--color-primary)' }}>Tiết kiệm {saving > 0 ? formatVND(saving) : ''}{saving > 0 && hasFreeship ? ' + ' : ''}{hasFreeship ? 'Phí vận chuyển' : ''}</b></>}
            </div>
            <Button variant="ghost" onClick={onClose}>Trở lại</Button>
            <Button onClick={() => { onConfirm(mode === 'shop' ? { shop } : { platform, freeship }); onClose(); }}>Đồng ý</Button>
          </div>
        </div>
      </Modal>
    );
  }

  window.LZVoucherPicker = VoucherPicker;
})();
