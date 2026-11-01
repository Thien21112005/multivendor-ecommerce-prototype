/* Admin: returns/refunds arbitration + review moderation. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Modal, Rating, Money, Tabs } = DS;
  const { REFUNDS, REVIEWS } = window.LZA;
  const formatVND = Money.format;

  /* ---------- Returns & refunds arbitration ---------- */
  const GW_STATUS = { PENDING: { label: 'PENDING', variant: 'warning' }, SUCCESS: { label: 'SUCCESS', variant: 'success' }, FAILED: { label: 'FAILED', variant: 'danger' } };
  // gateway derived from the order's payment method (mocked per shop)
  const GW_OF = { 'TechZone Official': 'VNPAY', 'Beauty Box': 'MoMo', 'Shoe Republic': 'ZaloPay' };

  function GatewayCard({ r }) {
    // existing record on already-refunded rows, else a freshly-created one on approve
    const gw = r.gateway || { name: GW_OF[r.shop] || 'VNPAY', txnId: 'TXN-' + (8800 + (r.id.charCodeAt(6) || 40)), gatewayRefundId: (GW_OF[r.shop] || 'VNP').slice(0, 3).toUpperCase() + '-RF-20260622-00' + (r.id.slice(-1)), amount: r.amount, status: 'PENDING', createdAt: 'Vừa tạo' };
    const [status, setStatus] = React.useState(gw.status);
    const [syncing, setSyncing] = React.useState(false);
    const st = GW_STATUS[status];
    const sync = () => { setSyncing(true); setTimeout(() => { setSyncing(false); setStatus(status === 'PENDING' ? 'SUCCESS' : status); }, 1100); };
    const retry = () => { setStatus('PENDING'); setSyncing(true); setTimeout(() => { setSyncing(false); setStatus('SUCCESS'); }, 1300); };
    return (
      <div style={{ marginTop: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'var(--gray-25)', borderBottom: '1px solid var(--border-subtle)' }}>
          <Icon name="credit-card" size={16} style={{ color: 'var(--color-primary)' }} />
          <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Trạng thái hoàn tiền Gateway</span>
          <span style={{ marginLeft: 'auto' }}><StatusBadge status={status === 'SUCCESS' ? 'COMPLETED' : status === 'FAILED' ? 'ERROR' : 'PENDING'} label={st.label} /></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 18px', padding: '14px' }}>
          <Field k="Cổng thanh toán" v={gw.name} />
          <Field k="Mã GD gốc" v={gw.txnId} mono />
          <Field k="Mã hoàn tiền GW" v={gw.gatewayRefundId} mono />
          <Field k="Số tiền hoàn" v={formatVND(gw.amount)} price />
          <Field k="Thời gian tạo" v={gw.createdAt} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="sm" iconLeft="refresh-cw" onClick={sync} disabled={syncing}>{syncing ? 'Đang đồng bộ…' : 'Đồng bộ trạng thái'}</Button>
          </div>
        </div>
        {status === 'FAILED' && (
          <div style={{ margin: '0 14px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--red-50, #FDECEA)', border: '1px solid var(--red-200, #F3B0A8)', borderRadius: 'var(--radius-md)', padding: '11px 14px' }}>
              <Icon name="triangle-alert" size={18} style={{ color: 'var(--red-600)', flex: 'none', marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--red-600)' }}>Hoàn tiền thất bại</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-body)', marginTop: 2 }}>Vui lòng kiểm tra trên dashboard gateway hoặc thử lại.</div>
              </div>
              <Button variant="danger" size="sm" iconLeft="refresh-cw" onClick={retry} disabled={syncing}>Thử lại hoàn tiền</Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  function Field({ k, v, mono, price }) {
    return (
      <div>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{k}</div>
        <div className={mono ? 'code' : undefined} style={{ font: (mono ? '13px var(--font-mono)' : 'var(--weight-semibold) var(--text-sm) var(--font-sans)'), color: price ? 'var(--text-price)' : 'var(--text-strong)', marginTop: 3, fontWeight: price ? 700 : undefined }}>{v}</div>
      </div>
    );
  }

  function Refunds() {
    const [decided, setDecided] = React.useState({});
    const [modal, setModal] = React.useState(null); // {row, action}
    const state = (r) => decided[r.id] || r.state;

    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['OPEN', 'Đang mở', 'warning'], ['REFUNDED', 'Đã hoàn', 'success'], ['DENIED', 'Từ chối', 'danger']].map(([k, l, v]) => (
            <Badge key={k} variant={v}>{REFUNDS.filter((r) => state(r) === k).length} {l}</Badge>
          ))}
        </div>
        {REFUNDS.map((r) => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="code" style={{ font: '13px var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{r.id}</span>
              <span className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-muted)', background: 'var(--gray-100)', padding: '2px 7px', borderRadius: 'var(--radius-sm)' }}>{r.order}</span>
              {state(r) === 'OPEN' && <StatusBadge status="PENDING" label="ĐANG TRANH CHẤP" />}
              {state(r) === 'REFUNDED' && <Badge variant="success" icon="circle-check">Đã hoàn tiền</Badge>}
              {state(r) === 'DENIED' && <Badge variant="danger" icon="ban">Đã từ chối</Badge>}
              <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Mở {r.opened}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 18, alignItems: 'center' }}>
              <div>
                <div style={info}>Người mua</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}><Avatar name={r.buyer} size={28} /><span style={val}>{r.buyer}</span></div>
                <div style={{ ...info, marginTop: 10 }}>Lý do</div>
                <div style={{ ...val, marginTop: 3 }}>{r.reason}</div>
              </div>
              <div>
                <div style={info}>Người bán</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}><Avatar name={r.shop} size={28} square /><span style={val}>{r.shop}</span></div>
                <div style={{ ...info, marginTop: 10 }}>Bằng chứng ({r.media.length})</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                  {r.media.map((m) => <img key={m} src={'../../assets/img/' + m + '.jpg'} style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={info}>Số tiền tranh chấp</div>
                <div style={{ font: '800 22px var(--font-sans)', color: 'var(--text-price)', fontVariantNumeric: 'tabular-nums', margin: '4px 0 12px' }}>{formatVND(r.amount)}</div>
                {state(r) === 'OPEN' ? (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button variant="secondary" size="sm" onClick={() => setModal({ row: r, action: 'deny' })}>Từ chối</Button>
                    <Button size="sm" iconLeft="hand-coins" onClick={() => setModal({ row: r, action: 'refund' })}>Hoàn tiền</Button>
                  </div>
                ) : <Button variant="ghost" size="sm" onClick={() => setDecided((d) => { const n = { ...d }; delete n[r.id]; return n; })}>Mở lại</Button>}
              </div>
            </div>
            {state(r) === 'REFUNDED' && <GatewayCard key={r.id + '-gw'} r={r} />}
          </div>
        ))}
        <Modal open={!!modal} onClose={() => setModal(null)} title={modal && modal.action === 'refund' ? 'Duyệt hoàn tiền' : 'Từ chối yêu cầu'}
          footer={modal && <>
            <Button variant="ghost" onClick={() => setModal(null)}>Huỷ</Button>
            <Button variant={modal.action === 'refund' ? 'primary' : 'danger'}
              onClick={() => { setDecided((d) => ({ ...d, [modal.row.id]: modal.action === 'refund' ? 'REFUNDED' : 'DENIED' })); setModal(null); }}>
              {modal.action === 'refund' ? 'Xác nhận hoàn ' + formatVND(modal.row.amount) : 'Xác nhận từ chối'}
            </Button>
          </>}>
          {modal && <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>
            {modal.action === 'refund'
              ? <>Hoàn <b style={{ color: 'var(--text-price)' }}>{formatVND(modal.row.amount)}</b> từ escrow về người mua. Khoản này sẽ được ghi vào sổ cái với mã <span className="code">{modal.row.id}</span>.</>
              : <>Từ chối yêu cầu hoàn tiền <span className="code">{modal.row.id}</span>. Tiền vẫn được giữ trong escrow của người bán.</>}
          </p>}
        </Modal>
      </div>
    );
  }

  /* ---------- Review moderation ---------- */
  function Reviews() {
    const [acted, setActed] = React.useState({});
    const state = (r) => acted[r.id] || r.state;
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', gap: 8, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '10px 14px', font: 'var(--type-body-sm)', marginBottom: 16 }}>
          <Icon name="info" size={16} /> Ẩn đánh giá vi phạm tiêu chuẩn cộng đồng. Thao tác được ghi log và có thể hoàn tác.
        </div>
        {REVIEWS.map((r) => {
          const hidden = state(r) === 'HIDDEN';
          return (
            <div key={r.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 18, marginBottom: 14, opacity: hidden ? 0.7 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Avatar name={r.user} size={32} />
                <div>
                  <div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)' }}>{r.user}</div>
                  <Rating value={r.rating} size={12} showNumber={false} />
                </div>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge variant="danger" icon="triangle-alert">{r.flags} báo cáo</Badge>
                  {hidden ? <Badge variant="neutral" icon="eye-off">Đã ẩn</Badge> : <StatusBadge status="PENDING" label="CHỜ DUYỆT" />}
                </span>
              </div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginBottom: 4 }}>Sản phẩm: {r.product} · <span className="code">{r.id}</span></div>
              <p style={{ font: 'var(--type-body)', color: hidden ? 'var(--text-muted)' : 'var(--text-body)', padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--red-500)' }}>{r.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Cờ: {r.reason}</span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  {hidden
                    ? <Button variant="ghost" size="sm" iconLeft="eye" onClick={() => setActed((a) => ({ ...a, [r.id]: 'VISIBLE' }))}>Hiện lại</Button>
                    : <>
                        <Button variant="secondary" size="sm" onClick={() => setActed((a) => ({ ...a, [r.id]: 'VISIBLE' }))}>Giữ hiển thị</Button>
                        <Button variant="danger" size="sm" iconLeft="eye-off" onClick={() => setActed((a) => ({ ...a, [r.id]: 'HIDDEN' }))}>Ẩn đánh giá</Button>
                      </>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const info = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
  const val = { font: 'var(--weight-medium) var(--text-sm) var(--font-sans)', color: 'var(--text-body)' };

  window.LZARefunds = Refunds;
  window.LZAReviews = Reviews;
})();
