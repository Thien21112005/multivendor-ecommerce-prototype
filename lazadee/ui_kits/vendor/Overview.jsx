/* Vendor overview: what needs doing first, then revenue and the shop's money, then recent
   orders, performance and catalogue. Every figure comes from data.jsx. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, StatusBadge } = DS;
  const { vnd, Delta, StatTile, WorkQueue, Segmented, BarList, StackBar, TimeChart, SegBar } = window.TRDash;
  const { WALLET, REVENUE, PERF, ORDERS, ORDER_COUNTS, CHAT_UNREAD, orderBadge, AS_OF, OUTCOMES } = window.LZV;

  const RANGES = [['week', '7 ngày'], ['month', '30 ngày'], ['year', '12 tháng']];

  function Revenue() {
    const [range, setRange] = React.useState('month');
    const r = REVENUE[range];
    const total = r.points.reduce((n, p) => n + p.value, 0);
    return (
      <section className="dash-sheet">
        <div className="dash-head">
          <h2 className="dash-title">Doanh thu {r.title}</h2>
          <div className="dash-end"><Segmented label="Khoảng thời gian" value={range} onChange={setRange} items={RANGES} /></div>
        </div>
        <div className="dash-figure">{vnd(total)}</div>
        <div className="dash-sub">{r.prev ? <Delta cur={total} prev={r.prev} against={r.against} /> : r.against}</div>
        <TimeChart data={r.points} kind="bar" name="Doanh thu" />
      </section>
    );
  }

  function ShopMoney({ onNav }) {
    return (
      <section className="dash-sheet">
        <h2 className="dash-title">Tiền của shop</h2>
        <div className="dash-money">
          <div className="dash-sub" style={{ marginTop: 10 }}>Số dư có thể rút</div>
          <div className="dash-figure">{vnd(WALLET.available)}</div>
        </div>
        <Button block iconLeft="hand-coins" onClick={() => onNav('wallet')}>Rút tiền</Button>
        <div style={{ marginTop: 16 }}>
          <StackBar label="Tiền của shop" parts={[
            { label: 'Có thể rút', value: WALLET.available, tone: 'ok' },
            { label: 'Sàn đang giữ', note: 'Về ví khi khách nhận hàng', value: WALLET.held, tone: 'held' },
            { label: 'Lệnh rút chờ duyệt', value: WALLET.pendingPayout, tone: 'info' },
            { label: 'COD chờ chuyển về', note: 'Hãng vận chuyển đang giữ', value: WALLET.codPending, tone: 'wait' },
          ]} />
        </div>
      </section>
    );
  }

  function KycBanner({ kyc, onNav }) {
    const B = {
      PENDING: { bg: 'var(--amber-50)', icon: 'clock', c: 'var(--amber-600)', t: 'Hồ sơ KYC đang chờ duyệt', s: 'Đội ngũ sẽ xét duyệt trong 1-3 ngày làm việc.', btn: 'Xem tiến độ' },
      REJECTED: { bg: 'var(--red-50)', icon: 'triangle-alert', c: 'var(--red-600)', t: 'KYC bị từ chối', s: 'Vui lòng cập nhật hồ sơ và nộp lại.', btn: 'Nộp lại' },
    }[kyc];
    if (!B) return null;
    return (
      <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: B.bg, borderRadius: 'var(--radius-lg)', padding: '12px 16px' }}>
        <Icon name={B.icon} size={20} style={{ color: B.c, flex: 'none' }} />
        <span style={{ flex: 1, minWidth: 200, font: 'var(--type-body)', color: 'var(--text-body)' }}><b>{B.t}.</b> {B.s}</span>
        <Button variant="ghost" size="sm" iconRight="chevron-right" onClick={() => onNav('kyc')}>{B.btn}</Button>
      </div>
    );
  }

  function Overview({ onNav }) {
    const kyc = window.LZ_KYC_STATUS || 'VERIFIED';
    const orders = (tab) => () => { window.LZV.orderTab = tab; onNav('orders'); };
    const returns = (window.LZV.RETURNS || []).filter((r) => r.state === 'REQUESTED');
    const products = window.LZV.PRODUCTS || [];
    const count = (s) => products.filter((p) => p.state === s).length;
    const rejected = count('REJECTED');
    const jobs = [
      { id: 'new', count: ORDER_COUNTS.toConfirm, label: 'Đơn chờ xác nhận', hint: 'Xác nhận hoặc từ chối đơn', go: orders('NEW') },
      { id: 'prep', count: ORDER_COUNTS.toPack, label: 'Đơn cần chuẩn bị', hint: 'Đóng gói và giao hãng vận chuyển', go: orders('PREP') },
      { id: 'fail', count: ORDER_COUNTS.failed, label: 'Đơn giao thất bại', hint: 'Kiểm tra và xử lý lại', go: orders('DELIVERING') },
      { id: 'return', count: returns.length, label: 'Yêu cầu trả hàng', hint: returns.length ? 'Gần nhất ' + returns.map((r) => r.due).sort()[0] : '', go: orders('RETURN') },
      { id: 'chat', count: CHAT_UNREAD, label: 'Tin nhắn chưa đọc', hint: 'Trả lời khách hàng', go: () => onNav('chat') },
    ];
    const P = PERF['30 ngày qua'];
    return (
      <div className="dash">
        <KycBanner kyc={kyc} onNav={onNav} />
        <WorkQueue title="Việc cần làm" jobs={jobs} doneText="Bạn đã xử lý hết việc tồn" />

        <div className="dash-cols">
          <Revenue />
          <ShopMoney onNav={onNav} />
        </div>

        <section className="dash-sheet dash-sheet--flush">
          <div className="dash-head">
            <h2 className="dash-title">Đơn hàng gần đây</h2>
            <div className="dash-end"><Button variant="ghost" size="sm" iconRight="chevron-right" onClick={orders('ALL')}>Xem tất cả</Button></div>
          </div>
          <div className="dash-tablewrap">
            <table className="dash-table">
              <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Số SP</th><th className="num">Giá trị</th><th>Thời gian</th><th>Trạng thái</th><th className="num">Thao tác</th></tr></thead>
              <tbody>
                {ORDERS.slice(0, 5).map((o) => {
                  const b = orderBadge(o);
                  return (
                    <tr key={o.id}>
                      <td><span className="code" style={{ fontSize: 12 }}>{o.id}</span></td>
                      <td>{o.customer}</td>
                      <td>{o.items.reduce((n, i) => n + i[2], 0)}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{vnd(o.total)}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{o.when}</td>
                      <td><StatusBadge status={b[0]} label={b[1]} /></td>
                      <td className="num">{o.status === 'NEW' ? <Button size="sm" onClick={orders('NEW')}>Xác nhận</Button> : <Button variant="ghost" size="sm" onClick={orders('ALL')}>Chi tiết</Button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dash-cols">
          <section className="dash-sheet">
            <div className="dash-head">
              <h2 className="dash-title">Đơn 30 ngày qua</h2><span className="dash-sub">Đến {AS_OF}</span>
              <div className="dash-end"><Button variant="ghost" size="sm" iconRight="chevron-right" onClick={() => onNav('stats')}>Phân tích</Button></div>
            </div>
            <div className="dash-figure">{P.orders.toLocaleString('vi-VN')} đơn</div>
            <div className="dash-sub" style={{ marginBottom: 14 }}><Delta cur={P.orders} prev={P.prevOrders} against={P.against} /></div>
            <SegBar label="Kết quả đơn 30 ngày qua" parts={OUTCOMES.map(([k, tone], i) => ({ label: k, tone, value: P.out[i] }))} />
            <div className="dash-rows" style={{ marginTop: 14 }}>
              <div className="dash-row"><span>Lượt truy cập</span><b>{P.visits.toLocaleString('vi-VN')} <Delta cur={P.visits} prev={P.prevVisits} /></b></div>
              <div className="dash-row"><span>Tỉ lệ chuyển đổi (đơn trên lượt truy cập)</span><b>{((P.orders / P.visits) * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%</b></div>
            </div>
          </section>
          <section className="dash-sheet">
            <div className="dash-head">
              <h2 className="dash-title">Sản phẩm</h2>
              <div className="dash-end"><Button variant="ghost" size="sm" iconRight="chevron-right" onClick={() => onNav('products')}>Quản lý</Button></div>
            </div>
            <BarList rows={[['Đang bán', count('PUBLISHED')], ['Chờ duyệt', count('PENDING_APPROVAL')], ['Nháp', count('DRAFT')], ['Bị từ chối', rejected]]} />
          </section>
        </div>
      </div>
    );
  }

  window.LZVOverview = Overview;
})();
