/* Shared mock data for the Lazadee storefront kit. Exposed on window. */
(function () {
  const V = {
    techzone: { id: 'techzone', name: 'TechZone Official', mall: true, rating: 4.9, followers: '128k', location: 'TP. HCM', ship: 25000, logoBg: '#1E232E', cover: 'banner-tech', joined: '2021', responseRate: 98, responseTime: 'trong vài phút', desc: 'Thiết bị công nghệ chính hãng — bảo hành 12 tháng.' },
    shoe:     { id: 'shoe', name: 'Shoe Republic', mall: false, rating: 4.7, followers: '42,1k', location: 'Bình Dương', ship: 18000, logoBg: '#B53109', cover: 'sneakers', joined: '2022', responseRate: 95, responseTime: 'trong 1 giờ', desc: 'Giày sneaker & thời trang chính hãng.' },
    boutique: { id: 'boutique', name: 'Boutique Sài Gòn', mall: true, rating: 4.8, followers: '67k', location: 'TP. HCM', ship: 20000, logoBg: '#FF2E63', cover: 'jacket', joined: '2020', responseRate: 96, responseTime: 'trong vài phút', desc: 'Thời trang nam nữ phong cách Hàn Quốc.' },
    home:     { id: 'home', name: 'Home & Living', mall: false, rating: 4.6, followers: '19,8k', location: 'Hà Nội', ship: 30000, logoBg: '#14B86E', cover: 'lamp', joined: '2023', responseRate: 91, responseTime: 'trong vài giờ', desc: 'Đồ gia dụng & trang trí nhà cửa.' },
    beauty:   { id: 'beauty', name: 'Beauty Box', mall: true, rating: 4.9, followers: '203k', location: 'TP. HCM', ship: 16000, logoBg: '#6C2BD9', cover: 'cosmetics', joined: '2019', responseRate: 99, responseTime: 'trong vài phút', desc: 'Mỹ phẩm & chăm sóc da chính hãng.' },
    travel:   { id: 'travel', name: 'TravelGear', mall: false, rating: 4.5, followers: '8,4k', location: 'Đà Nẵng', ship: 22000, logoBg: '#2563EB', cover: 'backpack', joined: '2023', responseRate: 88, responseTime: 'trong 1 giờ', desc: 'Balo, vali & phụ kiện du lịch.' },
  };
  const img = (n) => '../../assets/img/' + n + '.jpg';
  let _id = 0;
  const P = (o) => { const src = img(o.img); return ({ id: 'p' + (++_id), sold: o.sold || '1k', rating: o.rating || 4.7, location: V[o.v].location, ...o, img: src, image: src }); };

  const PRODUCTS = [
    P({ title: 'Tai nghe Bluetooth chống ồn ANC Pro 5 — Pin 40 giờ', img: 'headphones', price: 389000, original: 799000, discountPct: 51, rating: 4.8, sold: '2,1k', v: 'techzone', cat: 'Điện tử', flash: true, freeship: true }),
    P({ title: 'Đồng hồ thông minh Watch S2 màn AMOLED, đo SpO2', img: 'watch', price: 690000, original: 1290000, discountPct: 47, rating: 4.7, sold: '986', v: 'techzone', cat: 'Điện tử', mall: true, freeship: true }),
    P({ title: 'Giày sneaker thể thao Air Run nam nữ êm chân', img: 'sneakers', price: 259000, original: 450000, discountPct: 42, rating: 4.6, sold: '5,4k', v: 'shoe', cat: 'Thời trang', flash: true }),
    P({ title: 'Máy ảnh Mirrorless X-100 kèm lens kit 15-45mm', img: 'camera', price: 12990000, original: 15490000, discountPct: 16, rating: 4.9, sold: '214', v: 'techzone', cat: 'Điện tử', mall: true }),
    P({ title: 'Kính mát thời trang UV400 chống tia cực tím', img: 'sunglasses', price: 99000, original: 249000, discountPct: 60, rating: 4.5, sold: '8,9k', v: 'boutique', cat: 'Thời trang', freeship: true }),
    P({ title: 'Balo laptop chống nước 25L ngăn chống sốc', img: 'backpack', price: 189000, original: 320000, discountPct: 41, rating: 4.7, sold: '3,2k', v: 'travel', cat: 'Phụ kiện' }),
    P({ title: 'Laptop UltraBook 14" Core i5, 16GB RAM, SSD 512GB', img: 'laptop', price: 15490000, original: 17990000, discountPct: 14, rating: 4.8, sold: '432', v: 'techzone', cat: 'Điện tử', mall: true, freeship: true }),
    P({ title: 'Điện thoại Galaxy A-series 8GB/256GB chính hãng', img: 'phone', price: 5290000, original: 6490000, discountPct: 18, rating: 4.7, sold: '1,7k', v: 'techzone', cat: 'Điện tử', mall: true }),
    P({ title: 'Cốc sứ cao cấp phong cách tối giản 350ml', img: 'mug', price: 59000, original: 120000, discountPct: 51, rating: 4.6, sold: '6,1k', v: 'home', cat: 'Nhà cửa', flash: true, freeship: true }),
    P({ title: 'Đèn bàn LED cảm ứng 3 chế độ sáng, sạc USB', img: 'lamp', price: 149000, original: 299000, discountPct: 50, rating: 4.8, sold: '4,5k', v: 'home', cat: 'Nhà cửa', freeship: true }),
    P({ title: 'Ghế sofa đơn bọc nỉ chân gỗ phong cách Bắc Âu', img: 'chair', price: 1290000, original: 1990000, discountPct: 35, rating: 4.7, sold: '198', v: 'home', cat: 'Nhà cửa' }),
    P({ title: 'Bộ mỹ phẩm trang điểm 12 món đầy đủ cho người mới', img: 'cosmetics', price: 235000, original: 520000, discountPct: 55, rating: 4.9, sold: '12k', v: 'beauty', cat: 'Làm đẹp', flash: true, freeship: true }),
    P({ title: 'Serum dưỡng da Vitamin C 30ml làm sáng da', img: 'skincare', price: 178000, original: 350000, discountPct: 49, rating: 4.8, sold: '9,3k', v: 'beauty', cat: 'Làm đẹp', mall: true, freeship: true }),
    P({ title: 'Giày cao gót da mũi nhọn 7cm thanh lịch', img: 'heels', price: 320000, original: 590000, discountPct: 46, rating: 4.6, sold: '1,2k', v: 'shoe', cat: 'Thời trang' }),
    P({ title: 'Áo khoác denim unisex form rộng phong cách Hàn', img: 'jacket', price: 245000, original: 420000, discountPct: 42, rating: 4.7, sold: '3,8k', v: 'boutique', cat: 'Thời trang', freeship: true }),
    P({ title: 'Áo thun cotton basic 100% co giãn nhiều màu', img: 'tshirt', price: 89000, original: 150000, discountPct: 41, rating: 4.5, sold: '15k', v: 'boutique', cat: 'Thời trang', flash: true }),
    P({ title: 'Loa bluetooth mini chống nước IPX7 bass mạnh', img: 'speaker', price: 320000, original: 650000, discountPct: 51, rating: 4.7, sold: '2,6k', v: 'techzone', cat: 'Điện tử', freeship: true }),
    P({ title: 'Bàn phím cơ RGB switch blue gaming chống ồn', img: 'keyboard', price: 459000, original: 890000, discountPct: 48, rating: 4.8, sold: '1,9k', v: 'techzone', cat: 'Điện tử', mall: true }),
    P({ title: 'Nước hoa nữ Eau de Parfum hương hoa cỏ 50ml', img: 'perfume', price: 420000, original: 850000, discountPct: 51, rating: 4.9, sold: '4,1k', v: 'beauty', cat: 'Làm đẹp', mall: true, freeship: true }),
    P({ title: 'Đồng hồ cổ điển dây da nâu mặt tròn tối giản', img: 'watch2', price: 199000, original: 399000, discountPct: 50, rating: 4.6, sold: '2,3k', v: 'boutique', cat: 'Phụ kiện', flash: true }),
  ];

  const CATEGORIES = [
    { name: 'Điện tử', icon: 'zap' }, { name: 'Thời trang', icon: 'shopping-bag' },
    { name: 'Làm đẹp', icon: 'star' }, { name: 'Nhà cửa', icon: 'house' },
    { name: 'Phụ kiện', icon: 'tag' }, { name: 'Mẹ & Bé', icon: 'gift' },
    { name: 'Thể thao', icon: 'package' }, { name: 'Sách', icon: 'file-text' },
    { name: 'Bách hoá', icon: 'shopping-cart' }, { name: 'Voucher', icon: 'ticket' },
  ];

  /* ---- Customer account (customer_profiles + addresses + shop_follows) ---- */
  const USER = {
    name: 'Trần Thị Mai', email: 'mai.tran@gmail.com', phone: '0901 234 567',
    gender: 'Nữ', bio: 'Thích săn deal đồ công nghệ & mỹ phẩm 🧡', lang: 'vi',
    joined: '03/2024', walletBalance: 480000, coins: 1250, vouchers: 4,
    authProvider: 'google', hasPassword: false, avatarUrl: null,
  };
  const ADDRESSES = [
    { id: 'A1', recipient: 'Trần Thị Mai', phone: '0901 234 567', line: '25 Nguyễn Huệ, Căn hộ 12A', ward: 'P. Bến Nghé', district: 'Q.1', city: 'TP. Hồ Chí Minh', default: true, label: 'Nhà riêng' },
    { id: 'A2', recipient: 'Trần Thị Mai (Cơ quan)', phone: '0902 888 222', line: 'Tầng 9, Toà nhà Bitexco, 2 Hải Triều', ward: 'P. Bến Nghé', district: 'Q.1', city: 'TP. Hồ Chí Minh', default: false, label: 'Văn phòng' },
  ];
  const FOLLOWS = ['techzone', 'beauty', 'boutique'];

  /* ---- Login sessions / devices (account security) ---- */
  const DEVICES = [
    { id: 'd1', kind: 'desktop', name: 'Windows PC · Chrome 126', where: 'TP. Hồ Chí Minh, VN', ip: '113.161.40.12', last: 'Đang hoạt động', current: true },
    { id: 'd2', kind: 'mobile', name: 'iPhone 15 · Lazadee App', where: 'TP. Hồ Chí Minh, VN', ip: '171.244.10.5', last: '2 giờ trước', current: false },
    { id: 'd3', kind: 'mobile', name: 'Samsung Galaxy · Chrome Mobile', where: 'Biên Hòa, Đồng Nai', ip: '116.97.220.31', last: 'Hôm qua, 21:40', current: false },
    { id: 'd4', kind: 'tablet', name: 'iPad Air · Safari', where: 'Hà Nội, VN', ip: '14.165.88.7', last: '20/06/2026', current: false },
  ];

  /* ---- Voucher wallet + Lazadee Xu history ---- */
  const VOUCHERS = [
    { id: 'v1', kind: 'platform', amount: '-30k', label: 'Giảm 30.000₫', cond: 'Đơn từ 199.000₫', expiry: '30/06/2026', scope: 'Toàn sàn' },
    { id: 'v2', kind: 'freeship', amount: '0₫', label: 'Miễn phí vận chuyển', cond: 'Đơn từ 99.000₫', expiry: '15/06/2026', scope: 'Toàn sàn' },
    { id: 'v3', kind: 'shop', amount: '-15%', label: 'Giảm 15% tối đa 50k', cond: 'Đơn từ 250.000₫', expiry: '20/06/2026', scope: 'TechZone Official' },
    { id: 'v4', kind: 'platform', amount: '-50k', label: 'Hoàn 50.000₫ Xu', cond: 'Đơn từ 500.000₫', expiry: '28/06/2026', scope: 'Toàn sàn' },
  ];
  const COIN_LOG = [
    { type: 'earn', label: 'Hoàn xu đơn ORD-2412-0041', amount: 120, at: '08/06/2026' },
    { type: 'earn', label: 'Đánh giá sản phẩm có ảnh', amount: 50, at: '06/06/2026' },
    { type: 'spend', label: 'Dùng Xu giảm giá đơn ORD-2412-0033', amount: -200, at: '28/05/2026' },
    { type: 'earn', label: 'Điểm danh hằng ngày', amount: 5, at: '27/05/2026' },
    { type: 'earn', label: 'Hoàn xu đơn ORD-2412-0021', amount: 80, at: '20/05/2026' },
  ];

  /* ---- Orders (status ENUM: PENDING_PAYMENT, PAID, PROCESSING, SHIPPED,
     DELIVERED, COMPLETED, CANCELLED, REFUNDED). Each order = one vendor
     (multi-vendor cart split). tracking mirrors shipment_trackings +
     append-only shipment_events for the timeline. ---- */
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const oi = (pid, variant, qty, price) => { const p = byId(pid); return { productId: pid, title: p.title, img: p.image, variant, qty, price }; };
  const ev = (status, label, location, at) => ({ status, label, location, at });

  const ORDERS = [
    {
      id: 'ORD-2412-0044', vendorId: 'techzone', status: 'SHIPPED', placedAt: '08/06/2026 14:22',
      items: [oi('p1', 'Đen', 1, 389000), oi('p18', 'Đen RGB', 1, 459000)],
      subtotal: 848000, shipping: 25000, discount: 60000, total: 813000,
      tracking: {
        carrier: 'JT_EXPRESS', code: 'JT0931042771', eta: '11/06/2026', deliveredAt: null, shipStatus: 'IN_TRANSIT',
        events: [
          ev('IN_TRANSIT', 'Đang trung chuyển đến kho phân loại HCM', 'Kho Sorting HCM', '10/06 08:12'),
          ev('PICKED_UP', 'ĐVVC đã lấy hàng từ người bán', 'TP. HCM', '09/06 17:40'),
          ev('AWAITING_PICKUP', 'Người bán đã giao cho ĐVVC, chờ lấy hàng', 'Kho TechZone, Q.7', '09/06 10:05'),
          ev('PROCESSING', 'Người bán đang chuẩn bị hàng', 'TechZone Official', '08/06 15:01'),
          ev('PAID', 'Đơn hàng đã thanh toán — tiền vào escrow', 'Lazadee', '08/06 14:22'),
        ],
      },
      address: ADDRESSES[0],
    },
    {
      id: 'ORD-2412-0041', vendorId: 'beauty', status: 'DELIVERED', placedAt: '06/06/2026 09:10',
      items: [oi('p13', '30ml', 1, 178000), oi('p12', 'Full set', 1, 235000)],
      subtotal: 413000, shipping: 16000, discount: 30000, total: 399000,
      tracking: {
        carrier: 'GHTK', code: 'GHTK8841200', eta: '08/06/2026', deliveredAt: '08/06/2026 11:32', releaseAt: '11/06/2026 11:32', shipStatus: 'DELIVERED',
        events: [
          ev('DELIVERED', 'Giao hàng thành công — người nhận đã ký nhận', 'Q.1, TP. HCM', '08/06 11:32'),
          ev('OUT_FOR_DELIVERY', 'Đang giao đến bạn', 'Bưu cục Q.1', '08/06 07:50'),
          ev('IN_TRANSIT', 'Đến kho phân loại', 'Kho Sorting HCM', '07/06 19:20'),
          ev('PICKED_UP', 'ĐVVC đã lấy hàng', 'TP. HCM', '06/06 16:00'),
          ev('PAID', 'Đơn hàng đã thanh toán — tiền vào escrow', 'Lazadee', '06/06 09:10'),
        ],
      },
      address: ADDRESSES[0],
    },
    {
      id: 'ORD-2412-0033', vendorId: 'shoe', status: 'COMPLETED', placedAt: '28/05/2026 20:01',
      items: [oi('p3', 'Trắng / 42', 2, 259000)],
      subtotal: 518000, shipping: 18000, discount: 0, total: 536000, reviewed: false,
      tracking: { carrier: 'ViettelPost', code: 'VTP771903', eta: '31/05/2026', deliveredAt: '30/05/2026 15:10', shipStatus: 'DELIVERED', events: [
        ev('DELIVERED', 'Giao hàng thành công', 'Q.1, TP. HCM', '30/05 15:10'),
        ev('PAID', 'Đơn hàng đã thanh toán', 'Lazadee', '28/05 20:01'),
      ] },
      address: ADDRESSES[0], completedAt: '02/06/2026 15:10',
    },
    {
      id: 'ORD-2412-0029', vendorId: 'home', status: 'PENDING_PAYMENT', placedAt: '10/06/2026 09:40',
      items: [oi('p9', 'Trắng', 2, 59000)],
      subtotal: 118000, shipping: 30000, discount: 0, total: 148000,
      tracking: null, address: ADDRESSES[0], expireAt: '10/06/2026 09:55',
    },
    {
      id: 'ORD-2412-0021', vendorId: 'boutique', status: 'REFUNDED', placedAt: '20/05/2026 13:27',
      items: [oi('p15', 'Xanh / L', 1, 245000)],
      subtotal: 245000, shipping: 20000, discount: 0, total: 265000,
      tracking: { carrier: 'GHN', code: 'VN880012345', shipStatus: 'RETURNED', events: [] },
      address: ADDRESSES[0], refund: { id: 'RFN-0212', reason: 'Hàng không đúng mô tả', amount: 265000, resolvedAt: '24/05/2026' },
    },
  ];

  /* ---- Notifications (reuses the 4 from the header bell dropdown, typed for the
     Notification Center page). type ∈ order | promo | system | chat. ---- */
  const NOTIFICATIONS = [
    { id: 'n1', type: 'order', icon: 'truck', tint: 'var(--mint-600)', bg: 'var(--mint-50)', title: 'Đơn ORD-2412-0044 đang giao', body: 'GHN đang trung chuyển đến kho HCM, dự kiến giao 11/06.', date: '22/06/2026', unread: true, link: { action: 'track', orderId: 'ORD-2412-0044' } },
    { id: 'n2', type: 'promo', icon: 'ticket', tint: 'var(--flash-600)', bg: 'var(--flash-50)', title: 'Voucher Freeship sắp hết hạn', body: 'Mã miễn phí vận chuyển của bạn hết hạn 23:59 hôm nay — dùng ngay kẻo lỡ.', date: '22/06/2026', unread: true, link: { action: 'view', view: 'vouchers' } },
    { id: 'n3', type: 'order', icon: 'badge-check', tint: 'var(--orange-600)', bg: 'var(--orange-50)', title: 'Đơn ORD-2412-0041 đã giao thành công', body: 'Bấm "Đã nhận hàng" để hoàn tất đơn và giải ngân cho người bán.', date: '21/06/2026', unread: true, link: { action: 'track', orderId: 'ORD-2412-0041' } },
    { id: 'n4', type: 'promo', icon: 'zap', tint: 'var(--gold-700)', bg: 'var(--gold-50)', title: 'FLASH SALE 12.12 bắt đầu!', body: 'Giảm tới 50% hàng nghìn sản phẩm — săn deal ngay trên trang chủ.', date: '20/06/2026', unread: false, link: { action: 'home' } },
    { id: 'n5', type: 'system', icon: 'shield-check', tint: 'var(--blue-600)', bg: 'var(--blue-50)', title: 'Đăng nhập mới trên thiết bị lạ', body: 'Tài khoản vừa đăng nhập trên Chrome · TP. HCM. Nếu không phải bạn, hãy đổi mật khẩu ngay.', date: '20/06/2026', unread: false, link: { action: 'view', view: 'password' } },
    { id: 'n6', type: 'chat', icon: 'message-circle', tint: 'var(--orange-600)', bg: 'var(--orange-50)', title: 'TechZone Official đã trả lời', body: '"Dạ còn đủ màu đen bạn nhé! Freeship cho đơn từ 199k ạ."', date: '19/06/2026', unread: false, link: { action: 'home' } },
  ];

  const PROVINCES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Đồng Nai', 'Hải Phòng', 'Cần Thơ'];
  const DISTRICTS = { 'TP. Hồ Chí Minh': ['Q.1', 'Q.3', 'Q.5', 'Q.7', 'Q. Bình Thạnh', 'Q. Phú Nhuận', 'TP. Thủ Đức'], 'Hà Nội': ['Q. Hoàn Kiếm', 'Q. Ba Đình', 'Q. Cầu Giấy', 'Q. Đống Đa'] };

  window.LZ = {
    V, PRODUCTS, CATEGORIES, USER, ADDRESSES, FOLLOWS, ORDERS, PROVINCES, DISTRICTS, VOUCHERS, COIN_LOG, NOTIFICATIONS, DEVICES,
    byId,
    orderById: (id) => ORDERS.find((o) => o.id === id),
    vendorList: () => Object.values(V),
    productsOfVendor: (vid) => PRODUCTS.filter((p) => p.v === vid),
    // simple marketplace search: matches title or category, optional vendor scope
    search: (q, vid) => {
      const t = (q || '').trim().toLowerCase();
      let res = PRODUCTS;
      if (vid) res = res.filter((p) => p.v === vid);
      if (t) res = res.filter((p) => (p.title + ' ' + p.cat).toLowerCase().includes(t));
      return res;
    },
    // only the props ProductCard understands (avoids leaking img/v/cat onto the DOM)
    card: (p) => ({ title: p.title, image: p.image, price: p.price, original: p.original, discountPct: p.discountPct, rating: p.rating, sold: p.sold, location: p.location, flash: p.flash, mall: p.mall, freeship: p.freeship }),
  };
})();
