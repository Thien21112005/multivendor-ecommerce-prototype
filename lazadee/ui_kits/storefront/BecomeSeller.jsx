/* Lazadee — "Trở thành Người bán" gate. The current account is a buyer (not yet
   a seller), so this landing pitches Seller Center and routes to either login or
   a quick shop-registration form. Submitting starts KYC (status PENDING). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Input, Select, Checkbox, Badge } = DS;
  const { USER } = window.LZ;

  const BENEFITS = [
    { icon: 'shield-check', tint: 'var(--mint-600)', bg: 'var(--mint-50)', title: 'Thanh toán bảo chứng (Escrow)', desc: 'Tiền được giữ tạm an toàn và giải ngân về ví khi đơn hoàn tất.' },
    { icon: 'truck', tint: 'var(--blue-600)', bg: 'var(--blue-50)', title: 'Đối tác vận chuyển 3PL', desc: 'Tích hợp sẵn GHN, GHTK, ViettelPost, J&T Express — in vận đơn trong vài giây. Hỗ trợ thêm Lazadee Express (FBL) cho đơn nội thành.' },
    { icon: 'megaphone', tint: 'var(--flash-600)', bg: 'var(--flash-50)', title: 'Công cụ marketing', desc: 'Tạo voucher Shop, tham gia Flash Sale & chiến dịch của sàn.' },
    { icon: 'chart-column', tint: 'var(--orange-600)', bg: 'var(--orange-50)', title: 'Báo cáo & phân tích', desc: 'Theo dõi doanh thu, đơn hàng, tỉ lệ chuyển đổi theo thời gian thực.' },
  ];
  const STEPS = [
    { n: 1, title: 'Đăng ký thông tin Shop', desc: 'Điền tên shop, ngành hàng và thông tin liên hệ.' },
    { n: 2, title: 'Xác minh KYC', desc: 'Tải CCCD / ĐKKD. Lazadee duyệt trong 1–2 ngày làm việc.' },
    { n: 3, title: 'Đăng bán & nhận đơn', desc: 'Sau khi VERIFIED, đăng sản phẩm và bắt đầu bán ngay.' },
  ];
  const CATS = ['Điện tử', 'Thời trang', 'Làm đẹp', 'Nhà cửa & Đời sống', 'Mẹ & Bé', 'Thể thao', 'Bách hoá', 'Khác'];

  function BecomeSeller({ onLogin, onRegistered }) {
    const isLoggedIn = !!USER;
    const [f, setF] = React.useState({ shop: '', owner: isLoggedIn ? USER.name : '', email: isLoggedIn ? USER.email : '', phone: isLoggedIn ? USER.phone : '', cat: CATS[0], type: 'Cá nhân', agree: false });
    const [err, setErr] = React.useState({});
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const submit = () => {
      const e = {};
      if (!f.shop.trim()) e.shop = 'Nhập tên Shop';
      if (!f.owner.trim()) e.owner = 'Nhập họ tên chủ shop';
      if (!/.+@.+\..+/.test(f.email)) e.email = 'Email không hợp lệ';
      if (!/^0\d{8,10}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
      if (!f.agree) e.agree = true;
      setErr(e);
      if (Object.keys(e).length === 0) onRegistered && onRegistered(f);
    };

    return (
      <div style={{ background: 'var(--surface-page)', minHeight: '100%' }}>
        {/* hero */}
        <div style={{ background: 'linear-gradient(120deg, var(--orange-600), var(--orange-500) 60%, var(--flash-500))', color: '#fff' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 480px)', gap: 40, alignItems: 'center' }}>
            <div>
              <Badge variant="solid" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>LAZADEE SELLER CENTER</Badge>
              <h1 style={{ font: '800 38px/1.12 var(--font-sans)', letterSpacing: '-0.02em', margin: '14px 0 12px', maxWidth: 520 }}>Bắt đầu kinh doanh cùng hàng triệu khách hàng</h1>
              <p style={{ font: 'var(--text-lg)/1.5 var(--font-sans)', color: 'rgba(255,255,255,.9)', maxWidth: 460, marginBottom: 22 }}>Mở Shop miễn phí, quản lý đơn hàng, ví Escrow và rút tiền — tất cả trong một nơi.</p>
              <div style={{ display: 'flex', gap: 26 }}>
                {[['0₫', 'Phí mở Shop'], ['2,8tr+', 'Người bán'], ['5%', 'Hoa hồng từ']].map(([a, b]) => (
                  <div key={b}><div style={{ font: '800 26px var(--font-sans)' }}>{a}</div><div style={{ font: 'var(--type-body-sm)', color: 'rgba(255,255,255,.82)' }}>{b}</div></div>
                ))}
              </div>
            </div>

            {/* registration card */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: 24, color: 'var(--text-body)' }}>
              {!isLoggedIn && (
                <div style={{ display: 'flex', gap: 9, alignItems: 'center', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginBottom: 16 }}>
                  <Icon name="info" size={16} style={{ color: 'var(--blue-600)', flex: 'none' }} />
                  <span style={{ font: 'var(--type-caption)', color: 'var(--text-body)' }}>Bạn cần <b style={{ color: 'var(--blue-600)', cursor: 'pointer' }} onClick={onLogin}>đăng nhập</b> trước khi mở Shop.</span>
                </div>
              )}
              <h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', marginBottom: 4 }}>Đăng ký mở Shop</h2>
              <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>Chỉ mất 2 phút để bắt đầu.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Tên Shop" value={f.shop} onChange={(e) => set('shop', e.target.value)} error={err.shop} placeholder="VD: TechZone Official" iconLeft="store" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Input label="Họ tên chủ Shop" value={f.owner} onChange={(e) => set('owner', e.target.value)} error={err.owner} placeholder="Nguyễn Văn A" />
                  <Input label="Số điện thoại" value={f.phone} onChange={(e) => set('phone', e.target.value)} error={err.phone} placeholder="0901 234 567" />
                </div>
                <Input label="Email" value={f.email} onChange={(e) => set('email', e.target.value)} error={err.email} placeholder="shop@email.com" iconLeft="mail" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><label style={lab}>Ngành hàng</label><div style={{ marginTop: 6 }}><Select value={f.cat} onChange={(e) => set('cat', e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></div></div>
                  <div><label style={lab}>Loại hình</label><div style={{ marginTop: 6 }}><Select value={f.type} onChange={(e) => set('type', e.target.value)}><option>Cá nhân</option><option>Hộ kinh doanh</option><option>Doanh nghiệp</option></Select></div></div>
                </div>
                <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', cursor: 'pointer' }}>
                  <Checkbox checked={f.agree} onChange={() => set('agree', !f.agree)} />
                  <span style={{ font: 'var(--type-caption)', color: err.agree ? 'var(--red-600)' : 'var(--text-muted)', lineHeight: 1.5 }}>Tôi đồng ý với <a style={{ color: 'var(--orange-600)' }}>Điều khoản Người bán</a> và <a style={{ color: 'var(--orange-600)' }}>Chính sách hoa hồng</a> của Lazadee.</span>
                </label>
                <Button block size="lg" iconLeft={isLoggedIn ? 'store' : 'log-in'} onClick={isLoggedIn ? submit : onLogin}>
                  {isLoggedIn ? 'Đăng ký mở Shop' : 'Đăng nhập để mở Shop'}
                </Button>
                <p style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center' }}>Đã là Người bán? <a style={{ color: 'var(--orange-600)', cursor: 'pointer' }} onClick={onLogin}>Đăng nhập Seller Center</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* benefits + steps */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 56px' }}>
          <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', textAlign: 'center', marginBottom: 6 }}>Vì sao chọn bán trên Lazadee?</h2>
          <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 28 }}>Hệ sinh thái đầy đủ để bạn vận hành Shop hiệu quả.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 40 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={card}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: b.bg, color: b.tint, display: 'grid', placeItems: 'center', marginBottom: 12 }}><Icon name={b.icon} size={24} /></div>
                <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 5 }}>{b.title}</div>
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', padding: '28px 28px' }}>
            <h3 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', marginBottom: 22, textAlign: 'center' }}>3 bước để bắt đầu bán hàng</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--orange-500)', color: '#fff', font: '800 18px var(--font-sans)', display: 'grid', placeItems: 'center', flex: 'none' }}>{s.n}</div>
                  <div>
                    <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                  {i < STEPS.length - 1 && <Icon name="arrow-right" size={20} style={{ position: 'absolute', right: -14, top: 10, color: 'var(--border-strong)' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', padding: 20 };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' };

  window.LZBecomeSeller = BecomeSeller;
})();
