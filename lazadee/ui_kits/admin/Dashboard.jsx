/* Admin overview: the queues first, then the reporting month (one period control for every
   money figure), money the platform is holding, and the rankings. Finance figures need the
   VIEW_FINANCE permission; every count comes from the source lists in data.jsx. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Avatar, Button, Select } = DS;
  const { DASHBOARD, CURRENT_USER, downloadCsv } = window.LZA;
  const { vnd, short, Delta, StatTile, WorkQueue, Segmented, BarList, StackBar, Pipeline, TimeChart, SegBar } = window.TRDash;

  // Order statuses split into orders still moving and how finished orders ended.
  const MOVING = { 'Chờ thanh toán': 'held', 'Đã thanh toán': 'info', 'Đang chuẩn bị': 'info', 'Đang giao': 'ship', 'Đã giao': 'ok' };
  const ENDED = { 'Hoàn thành': 'ok', 'Đã huỷ': 'wait', 'Trả hàng, hoàn tiền': 'bad' };

  const RANGES = [['week', '7 ngày'], ['month', 'Theo tuần'], ['year', '6 tháng']];
  const PAGE = 5;

  function Dashboard({ onNav, perms = CURRENT_USER.perms }) {
    const D = DASHBOARD;
    const [month, setMonth] = React.useState(D.months[0]);
    const [range, setRange] = React.useState('year');
    const [q, setQ] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [cat, setCat] = React.useState('Tất cả ngành hàng');
    const go = (id) => () => onNav && onNav(id);
    const can = (p) => perms.includes(p);
    const seeMoney = can('VIEW_FINANCE');

    const prev = D.months[D.months.indexOf(month) + 1];
    const against = prev ? 'so với ' + prev : 'kỳ trước';
    const net = (m) => D.commission[m] - D.voucherCost[m] - D.xuCost[m] - D.gatewayFee[m];

    const jobs = [
      { id: 'kyc', perm: 'REVIEW_KYC', count: D.pendingKyc, label: 'Hồ sơ KYC', hint: 'Chờ duyệt', go: go('kyc') },
      { id: 'product_moderation', perm: 'MANAGE_CATALOG', count: D.pendingProducts, label: 'Sản phẩm', hint: 'Chờ kiểm duyệt', go: go('product_moderation') },
      { id: 'refunds', perm: 'HANDLE_DISPUTE', count: D.openDisputes, label: 'Trả hàng, khiếu nại', hint: 'Đang mở', go: go('refunds') },
      { id: 'withdrawals', perm: 'PROCESS_PAYOUT', count: D.pendingWithdrawals, label: 'Lệnh rút tiền', hint: D.blockedWithdrawals + ' lệnh bị chặn chờ hồ sơ KYC', go: go('withdrawals') },
      { id: 'cod', perm: 'PROCESS_PAYOUT', count: D.pendingCod, label: 'Phiên đối soát COD', hint: 'Chờ đối chiếu', go: go('cod') },
    ].filter((j) => can(j.perm));

    const cats = ['Tất cả ngành hàng', ...Array.from(new Set(D.vendors.map((v) => v.cat)))];
    const vendors = D.vendors.filter((v) => cat === 'Tất cả ngành hàng' || v.cat === cat).filter((v) => v.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => b.growth - a.growth);
    const pages = Math.max(1, Math.ceil(vendors.length / PAGE));
    const shown = vendors.slice((page - 1) * PAGE, page * PAGE);
    const chart = D.chart[range];
    const exportCsv = () => downloadCsv('bao-cao-' + month.replace('/', '-') + '.csv', [
      ['Kỳ báo cáo', month], ['GMV', D.gmv[month]], ['Hoa hồng', D.commission[month]], ['Chi phí voucher', D.voucherCost[month]], ['Chi phí điểm thưởng', D.xuCost[month]], ['Phí cổng thanh toán', D.gatewayFee[month]], ['Lợi nhuận ròng', net(month)], [],
      [chart.title, 'GMV'], ...chart.points.map((p) => [p.label, p.value]), [],
      ['Shop', 'Ngành hàng', 'Sản phẩm bán ra', 'Đánh giá', 'Tăng trưởng %', 'GMV'], ...vendors.map((v) => [v.name, v.cat, v.sold, v.rating, v.growth, v.rev]), [],
      ['Trạng thái đơn', 'Số đơn'], ...D.orderStatus, [],
      ['Sản phẩm bán chạy', 'Đã bán'], ...D.topProducts,
    ]);

    return (
      <div className="dash">
        <WorkQueue title="Việc cần xử lý" jobs={jobs} doneText="Không còn hàng đợi nào tồn" />

        {seeMoney && <>
          <div className="dash-toolbar">
            <label>Kỳ báo cáo
              <select value={month} onChange={(e) => setMonth(e.target.value)}>{D.months.map((m) => <option key={m}>{m}</option>)}</select>
            </label>
            <div className="dash-end"><Button size="sm" variant="ghost" iconLeft="download" onClick={exportCsv}>Xuất báo cáo CSV</Button></div>
          </div>

          <div className="dash-tiles">
            <StatTile label="GMV toàn sàn" value={vnd(D.gmv[month])} note={<Delta cur={D.gmv[month]} prev={prev && D.gmv[prev]} against={against} />} />
            <StatTile label="Hoa hồng" value={vnd(D.commission[month])} note={<Delta cur={D.commission[month]} prev={prev && D.commission[prev]} against={against} />} onClick={go('commission')} />
            <StatTile label="Chi phí voucher và freeship" value={vnd(D.voucherCost[month])} note={<Delta cur={D.voucherCost[month]} prev={prev && D.voucherCost[prev]} against={against} downIsGood />} onClick={go('vouchers')} />
            <StatTile label="Lợi nhuận ròng" value={vnd(net(month))} note="Hoa hồng trừ voucher, điểm thưởng, phí cổng" onClick={go('ledger')} />
          </div>

          {/* UC-ADM-06: lợi nhuận ròng = hoa hồng − chi phí sàn tài trợ − Xu − phí cổng. */}
          <section className="dash-sheet">
            <div className="dash-head">
              <div>
                <h2 className="dash-title">Hoa hồng {month} đi về đâu</h2>
                <div className="dash-sub">Sàn chỉ thu hoa hồng; voucher sàn, điểm thưởng và phí cổng thanh toán do sàn tự chịu, phần còn lại là lợi nhuận ròng.</div>
              </div>
            </div>
            <div className="dash-sub">Tổng hoa hồng sàn thu trong kỳ (5% trên GMV)</div>
            <div className="dash-figure" style={{ marginBottom: 14 }}>{vnd(D.commission[month])}</div>
            <SegBar label={'Hoa hồng ' + month} format={vnd} parts={[
              { label: 'Lợi nhuận ròng', value: net(month), tone: 'ok' },
              { label: 'Voucher sàn và freeship', value: D.voucherCost[month], tone: 'held' },
              { label: 'Điểm thưởng (Xu)', value: D.xuCost[month], tone: 'info' },
              { label: 'Phí cổng thanh toán', value: D.gatewayFee[month], tone: 'wait' },
            ]} />
          </section>

          <section className="dash-sheet">
            <div className="dash-head">
              <div>
                <h2 className="dash-title">GMV toàn sàn</h2>
                <div className="dash-sub">{chart.title}</div>
              </div>
              <div className="dash-end"><Segmented label="Khoảng biểu đồ" value={range} onChange={setRange} items={RANGES} /></div>
            </div>
            <TimeChart data={chart.points} kind="line" name="GMV" height={260} />
          </section>

          <div className="dash-cols dash-cols--even">
            <section className="dash-sheet">
              <div className="dash-head"><h2 className="dash-title">Tiền sàn đang giữ cho shop</h2><span className="dash-sub dash-end">Số dư hiện tại, không theo kỳ</span></div>
              <div className="dash-figure" style={{ marginBottom: 12 }}>{vnd(D.liabilities)}</div>
              <StackBar label="Tiền sàn đang giữ cho shop" parts={[
                { label: 'Giữ đến khi khách nhận hàng', note: 'Chưa shop nào rút được', value: D.escrow, tone: 'held', go: go('ledger') },
                { label: 'Đã về ví shop', note: 'Shop có thể rút', value: D.walletBalances, tone: 'ok', go: go('ledger') },
              ]} />
            </section>
            <section className="dash-sheet">
              <div className="dash-head"><h2 className="dash-title">Tiền đang chờ xử lý</h2></div>
              <div className="dash-figure" style={{ marginBottom: 12 }}>{vnd(D.payablePayouts + D.blockedPayouts + D.codPending + D.refunds)}</div>
              <StackBar label="Tiền đang chờ xử lý" parts={[
                { label: 'Lệnh rút chờ chi', note: 'Shop đã xác minh', value: D.payablePayouts, tone: 'info', go: go('withdrawals') },
                { label: 'Lệnh rút bị chặn', note: 'Chờ hồ sơ KYC', value: D.blockedPayouts, tone: 'wait', go: go('withdrawals') },
                { label: 'COD chờ đối soát', note: 'Hãng vận chuyển đã chuyển', value: D.codPending, tone: 'held', go: go('cod') },
                { label: 'Tiền chờ hoàn cho khách', note: D.openDisputes + ' yêu cầu đang mở', value: D.refunds, tone: 'bad', go: go('refunds') },
              ]} />
            </section>
          </div>
        </>}

        <section className="dash-sheet">
          <div className="dash-head">
            <h2 className="dash-title">Đơn đang chạy</h2>
            <span className="dash-sub">{D.orderStatus.filter(([k]) => MOVING[k]).reduce((n, r) => n + r[1], 0).toLocaleString('vi-VN')} đơn chưa xong, theo thứ tự xử lý</span>
          </div>
          <Pipeline steps={D.orderStatus.filter(([k]) => MOVING[k]).map(([k, v]) => [k, v, MOVING[k]])} outcomes={D.orderStatus.filter(([k]) => ENDED[k]).map(([k, v]) => [k, v, ENDED[k]])} />
        </section>

        <div className={seeMoney ? 'dash-cols dash-cols--even' : 'dash'}>
          {seeMoney && <section className="dash-sheet">
            <div className="dash-head"><h2 className="dash-title">Shop có GMV cao nhất</h2></div>
            <BarList rows={[...D.vendors].sort((a, b) => b.rev - a.rev).slice(0, 8).map((v) => [v.name, v.rev])} format={short} />
          </section>}
          <section className="dash-sheet">
            <div className="dash-head"><h2 className="dash-title">Sản phẩm bán chạy</h2></div>
            <BarList rows={D.topProducts.slice(0, 8)} />
          </section>
        </div>

        <section className="dash-sheet dash-sheet--flush">
          <div className="dash-head">
            <h2 className="dash-title">Shop tăng trưởng nhanh</h2>
            <div className="dash-end" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ width: 190 }}><Select aria-label="Ngành hàng" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>{cats.map((x) => <option key={x}>{x}</option>)}</Select></div>
              <div style={{ position: 'relative', width: 220 }}>
                <span style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
                <input aria-label="Tìm shop" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Nhập tên shop" style={{ width: '100%', height: 44, paddingLeft: 34, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
          {vendors.length === 0
            ? <div className="dash-empty">Không tìm thấy shop phù hợp. Thử đổi ngành hàng hoặc từ khoá.</div>
            : <div className="dash-tablewrap">
                <table className="dash-table">
                  <thead><tr><th>Shop</th><th>Ngành hàng</th><th className="num">Sản phẩm bán ra</th><th>Đánh giá</th><th className="num">Tăng trưởng</th>{seeMoney && <th className="num">GMV</th>}</tr></thead>
                  <tbody>
                    {shown.map((v) => (
                      <tr key={v.name}>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600, color: 'var(--text-strong)' }}><Avatar name={v.name} size={30} />{v.name}</span></td>
                        <td>{v.cat}</td>
                        <td className="num">{v.sold.toLocaleString('vi-VN')}</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="star" size={14} style={{ color: 'var(--gold-500)', fill: 'var(--gold-500)' }} />{v.rating}</span></td>
                        <td className="num" style={{ fontWeight: 600 }}>{v.growth > 0 ? '+' : ''}{v.growth}%</td>
                        {seeMoney && <td className="num" style={{ fontWeight: 600 }}>{vnd(v.rev)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <span>Hiển thị {vendors.length ? (page - 1) * PAGE + 1 : 0} - {Math.min(page * PAGE, vendors.length)} trong tổng số {vendors.length} shop</span>
            <Button size="sm" variant="outline" disabled={page === 1} style={{ marginLeft: 'auto' }} onClick={() => setPage((p) => p - 1)}>Trước</Button>
            <span>Trang {page} / {pages}</span>
            <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Sau</Button>
          </div>
        </section>
      </div>
    );
  }

  window.LZADashboard = Dashboard;
})();
