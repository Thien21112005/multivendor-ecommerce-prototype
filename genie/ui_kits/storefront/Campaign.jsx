/* Campaign page: the banner, what the campaign is, its voucher to save now, and the
   products taking part. Reached from banners whose link is a campaign path. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button } = DS;

  function Campaign({ slug, onOpen, onHome }) {
    const c = window.LZ.CAMPAIGNS[slug];
    if (!c) {
      return (
        <div className="tr-section" style={{ paddingBottom: 56, textAlign: 'center' }}>
          <h1 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: '24px 0 8px' }}>Chiến dịch không tồn tại hoặc đã kết thúc</h1>
          <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: '0 0 20px' }}>Đường dẫn "/{slug}" không khớp chiến dịch nào đang chạy.</p>
          <Button onClick={onHome}>Về trang chủ</Button>
        </div>
      );
    }
    const products = window.LZ.PRODUCTS.filter(c.pick);
    return (
      <div className="tr-section tr-camp" style={{ paddingBottom: 56 }}>
        <nav className="tr-camp__crumb" aria-label="Đường dẫn">
          <button onClick={onHome}>Trang chủ</button><Icon name="chevron-right" size={14} /><span>{c.title}</span>
        </nav>
        <header className="tr-camp__head" style={{ background: c.colour }}>
          <div className="tr-camp__text">
            <h1>{c.title}</h1>
            <p>{c.intro}</p>
            <window.LZSaveVoucher {...c.voucher} />
          </div>
          <div className="tr-camp__pics" aria-hidden="true">
            {c.pics.map((n) => <img key={n} src={'../../assets/img/' + n + '.jpg'} alt="" />)}
          </div>
        </header>
        <div className="tr-section__head"><h2>{products.length} sản phẩm tham gia</h2></div>
        <div className="tr-grid">
          {products.map((p) => <window.LZCardX key={p.id} p={p} onClick={() => onOpen(p.id)} />)}
        </div>
      </div>
    );
  }

  window.LZCampaign = Campaign;
})();
