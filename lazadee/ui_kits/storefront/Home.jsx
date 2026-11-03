/* Genie storefront home: the money promise on a shelf of real products, the Admin banners,
   then picks, flash sale, vouchers and verified shops. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button } = DS;
  const { PRODUCTS } = window.LZ;
  const fmt = DS.Money.format;

  // Today's flash sale ends at midnight, so a reload never restarts the clock.
  const untilMidnight = () => { const d = new Date(); const end = new Date(d); end.setHours(24, 0, 0, 0); return Math.max(0, Math.floor((end - d) / 1000)); };
  function Countdown() {
    const [t, setT] = React.useState(untilMidnight);
    React.useEffect(() => { const i = setInterval(() => setT(untilMidnight()), 1000); return () => clearInterval(i); }, []);
    const p = (n) => String(n).padStart(2, '0');
    return <span className="tr-clock" role="timer" aria-label="Kết thúc lúc 24:00 hôm nay"><small>Kết thúc sau</small>{p(Math.floor(t / 3600))}:{p(Math.floor((t % 3600) / 60))}:{p(t % 60)}</span>;
  }

  const KIND = { platform: 'Voucher Genie', shop: 'Voucher của shop', freeship: 'Freeship' };
  // A paper ticket: the amount on a colored stub, the save action inside the ticket.
  function SaveVoucher({ kind, amount, label, code }) {
    const v = window.LZ.VOUCHERS.find((x) => x.code === code);
    const [saved, setSaved] = React.useState(!!(v && v.saved));
    const save = () => {
      if (saved) return;
      if (v) v.saved = true;
      setSaved(true);
      window.dispatchEvent(new CustomEvent('show_toast', { detail: { message: 'Đã lưu voucher thành công' } }));
    };
    return (
      <div className={'tr-ticket tr-ticket--' + kind}>
        <span className="tr-ticket__amt">{amount}</span>
        <span className="tr-ticket__body"><small>{KIND[kind]}</small><b>{label}</b></span>
        <button className="tr-ticket__save" disabled={saved} onClick={save} title={saved ? 'Đã lưu vào Kho Voucher' : undefined} aria-label={saved ? 'Đã lưu ' + label + ' vào Kho Voucher' : 'Lưu voucher ' + label}>
          {saved ? <Icon name="check" size={16} strokeWidth={2.8} /> : 'Lưu'}
        </button>
      </div>
    );
  }


  function Home({ onOpen, onMore, onShop }) {
    const stage = React.useRef(null);
    React.useEffect(() => { if (location.hash === '#flash-sale') document.getElementById('flash-sale').scrollIntoView(); }, []);
    // The blue field ends partway down the product shelf, wherever the headline wrapped to.
    React.useLayoutEffect(() => {
      const root = stage.current.closest('.tr-root');
      const fit = () => { const r = stage.current.getBoundingClientRect(); root.style.setProperty('--sky-h', Math.round(r.top + window.scrollY + r.height * 0.6) + 'px'); };
      fit();
      window.addEventListener('resize', fit);
      return () => { window.removeEventListener('resize', fit); root.style.removeProperty('--sky-h'); };
    }, []);
    // Admin → Banner: every position the storefront home shows.
    const live = window.LZ.banners.live;
    const top = live('HOME_TOP_CAROUSEL');
    // Every live banner of each position shows; two-slot positions deal them alternately.
    const side = live('HOME_TOP_SIDE');
    const middle = live('HOME_MIDDLE');
    const flashTop = live('FLASH_SALE_TOP');
    const shelf = PRODUCTS.slice(0, 6);
    const picks = Array.from({ length: 36 }, (_, i) => ({ ...PRODUCTS[(i + 6) % PRODUCTS.length], _k: i }));
    const flash = PRODUCTS.filter((p) => p.flash).slice(0, 6);
    const shops = window.LZ.vendorList().slice(0, 6);

    return (
      <div>
        <section className="tr-hero">
          <div className="tr-motif" aria-hidden="true"><i /><i /><i /></div>
          <h1><span className="tr-h1a">Nhận hàng rồi, </span><mark>tiền mới đến shop.</mark></h1>
          <p>Genie giữ tiền của bạn cho đến khi bạn nhận hàng. Mọi shop đều phải xác minh danh tính mới được bán.</p>
          <div className="tr-stage" ref={stage}>
            <div className="tr-shelf">
              {shelf.map((p, i) => <button key={p.id} style={{ '--i': i }} onClick={() => onOpen(p.id)} aria-label={p.title + ', ' + fmt(p.price)}><img src={p.image} alt="" /><span className="tr-shelf__tag">{fmt(p.price)}</span></button>)}
            </div>
            <window.LZMoneyRail interactive amount={389000} shop="TechZone Official" />
          </div>
        </section>

        {(top.length > 0 || side.length > 0) && (
          <div className="tr-section tr-section--banner">
            <div className={'tr-heroban' + (side.length && top.length ? '' : ' tr-heroban--solo')}>
              {top.length > 0 && <window.LZBannerCarousel items={top} />}
              {side.length > 0 && <window.LZBannerPair items={side} className="tr-heroban__side" />}
            </div>
          </div>
        )}
        <window.LZBannerPopup />

        <section className="tr-section">
          <div className="tr-section__head">
            <h2>Gợi ý cho bạn</h2>
            <button className="tr-more" onClick={onMore}>Xem thêm <Icon name="chevron-right" size={16} /></button>
          </div>
          <div className="tr-grid">
            {picks.map((p) => <window.LZCardX key={p._k} p={p} onClick={() => onOpen(p.id)} />)}
          </div>
        </section>

        {middle.length > 0 && <div className="tr-section tr-section--banner"><window.LZBannerPair items={middle} className="tr-duo" /></div>}

        <section id="flash-sale" className="tr-section tr-flash">
          <div className="tr-flash__in">
            <div className="tr-section__head tr-flash__head">
              <h2>Flash Sale</h2>
              <Countdown />
              <button className="tr-more" onClick={onMore}>Xem tất cả <Icon name="chevron-right" size={16} /></button>
            </div>
            {flashTop.length > 0 && <div className="tr-flash__banner">{flashTop.length === 1 ? <window.LZBanner b={flashTop[0]} /> : <window.LZBannerCarousel items={flashTop} compact />}</div>}
            <div className="tr-grid">
              {flash.map((p) => <window.LZCardX key={p.id} p={p} flashBar onClick={() => onOpen(p.id)} />)}
            </div>
            <h3 className="tr-vouchers__title">Lưu voucher, dùng khi thanh toán</h3>
            <div className="tr-vouchers">
              <SaveVoucher kind="platform" amount="-30k" label="Đơn từ 199.000₫" code="GENIE30K" />
              <SaveVoucher kind="shop" amount="-15%" label="Tối đa 50.000₫" code="TECH15" />
              <SaveVoucher kind="freeship" amount="0₫" label="Miễn phí vận chuyển" code="FREESHIP30" />
              <SaveVoucher kind="platform" amount="-12%" label="Siêu sale 12.12" code="SALE1212" />
            </div>
          </div>
        </section>

        <section className="tr-section">
          <div className="tr-section__head"><h2>Shop đã xác minh</h2></div>
          <div className="tr-shops">
            {shops.map((v) => (
              <button key={v.id} className="tr-shop" onClick={() => onShop && onShop(v.id)}>
                <window.LZSeal id={v.id} name={v.name} size={40} />
                <span><b>{v.name}</b><small>{v.rating} sao · {v.followers} người theo dõi · {v.location}</small></span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
            <Button size="lg" variant="outline" iconRight="chevron-down" onClick={onMore}>Xem thêm sản phẩm</Button>
          </div>
        </section>
      </div>
    );
  }

  window.LZHome = Home;
  window.LZSaveVoucher = SaveVoucher;
})();
