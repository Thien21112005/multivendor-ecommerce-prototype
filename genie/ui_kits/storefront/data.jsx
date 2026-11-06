/* Shared mock data for the Genie storefront kit. Exposed on window. */
(function () {
  // Lets a clickable span/div work from the keyboard like a button.
  window.LZKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } };
  const V = {
    techzone: { id: 'techzone', name: 'TechZone Official', mall: true, rating: 4.9, followers: '128k', location: 'TP. HCM', ship: 25000, freeFrom: 199000, logoBg: 'var(--ink-800)', cover: 'banner-tech', joined: '2021', responseRate: 98, responseTime: 'trong vài phút', desc: 'Thiết bị công nghệ chính hãng — bảo hành 12 tháng.' },
    shoe:     { id: 'shoe', name: 'Shoe Republic', mall: false, rating: 4.7, followers: '42,1k', location: 'Bình Dương', ship: 18000, logoBg: '#0F766E', cover: 'sneakers', joined: '2022', responseRate: 95, responseTime: 'trong 1 giờ', desc: 'Giày sneaker & thời trang chính hãng.' },
    boutique: { id: 'boutique', name: 'Boutique Sài Gòn', mall: true, rating: 4.8, followers: '67k', location: 'TP. HCM', ship: 20000, logoBg: '#FF2E63', cover: 'jacket', joined: '2020', responseRate: 96, responseTime: 'trong vài phút', desc: 'Thời trang nam nữ phong cách Hàn Quốc.' },
    home:     { id: 'home', name: 'Home & Living', mall: false, rating: 4.6, followers: '19,8k', location: 'Hà Nội', ship: 30000, logoBg: '#14B86E', cover: 'lamp', joined: '2023', responseRate: 91, responseTime: 'trong vài giờ', desc: 'Đồ gia dụng & trang trí nhà cửa.' },
    beauty:   { id: 'beauty', name: 'Beauty Box', mall: true, rating: 4.9, followers: '203k', location: 'TP. HCM', ship: 16000, freeFrom: 300000, logoBg: '#6C2BD9', cover: 'cosmetics', joined: '2019', responseRate: 99, responseTime: 'trong vài phút', desc: 'Mỹ phẩm & chăm sóc da chính hãng.' },
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

  // Brand, verification and one filterable attribute per category (UC-CAT-05, UC-CAT-15).
  const BRANDS = { p1: 'Sony', p2: 'Samsung', p3: 'Biti\'s', p4: 'Sony', p5: 'No Brand', p6: 'Xiaomi', p7: 'Asus', p8: 'Samsung', p9: 'No Brand', p10: 'Xiaomi', p11: 'No Brand', p12: 'Maybelline', p13: 'La Roche-Posay', p14: 'No Brand', p15: 'No Brand', p16: 'No Brand', p17: 'JBL', p18: 'Logitech', p19: 'Chanel', p20: 'No Brand' };
  const VERIFIED_BRANDS = ['Sony', 'Samsung', 'Biti\'s', 'Xiaomi', 'Asus', 'Maybelline', 'La Roche-Posay', 'JBL', 'Logitech', 'Chanel'];
  const ATTR_FILTERS = {
    'Điện tử': { name: 'Bảo hành', values: ['12 tháng', '24 tháng'] },
    'Thời trang': { name: 'Chất liệu', values: ['Cotton', 'Da', 'Denim'] },
    'Làm đẹp': { name: 'Loại da', values: ['Mọi loại da', 'Da dầu', 'Da khô'] },
    'Nhà cửa': { name: 'Chất liệu', values: ['Sứ', 'Gỗ', 'Nhựa'] },
    'Phụ kiện': { name: 'Chất liệu', values: ['Da', 'Vải'] },
  };
  PRODUCTS.forEach((p, i) => {
    p.brand = BRANDS[p.id];
    p.brandVerified = VERIFIED_BRANDS.includes(p.brand);
    const a = ATTR_FILTERS[p.cat];
    if (a) p.attr = a.values[i % a.values.length];
  });

  // Mock sale state: Flash Sale slots, pre-order lead time, shops on vacation, favourite shops.
  const FLASH_SLOTS = { p1: [45, 50], p3: [120, 200], p9: [18, 60], p12: [76, 100], p16: [50, 50], p20: [9, 30] };
  PRODUCTS.forEach((p) => { const f = FLASH_SLOTS[p.id]; if (f) { p.flashSold = f[0]; p.flashTotal = f[1]; } });
  PRODUCTS.find((p) => p.id === 'p11').preOrderDays = 14;
  V.shoe.favorite = true; V.home.favorite = true;
  V.travel.vacation = { until: '15/07/2026', message: 'Shop đang tạm nghỉ, sẽ trả lời bạn khi mở lại nhé!' };

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

  /* ---- Category meta + sub-categories (category landing pages) ---- */
  const CATEGORY_META = {"Điện tử":{"icon":"zap","desc":"Smartphone, laptop, tai nghe, camera và phụ kiện công nghệ chính hãng."},"Thời trang":{"icon":"shopping-bag","desc":"Thời trang nam nữ, giày dép, túi xách và phụ kiện theo xu hướng mới nhất."},"Làm đẹp":{"icon":"star","desc":"Mỹ phẩm, chăm sóc da, trang điểm và nước hoa từ các thương hiệu uy tín."},"Nhà cửa":{"icon":"house","desc":"Nội thất, đồ dùng nhà bếp, trang trí và đồ gia dụng thông minh."},"Phụ kiện":{"icon":"tag","desc":"Đồng hồ, trang sức, balo, túi xách và phụ kiện thời trang."},"Mẹ & Bé":{"icon":"gift","desc":"Tã bỉm, sữa, đồ chơi, thời trang mẹ và bé đầy đủ."},"Thể thao":{"icon":"dumbbell","desc":"Dụng cụ thể thao, quần áo tập luyện và phụ kiện outdoor."},"Sách":{"icon":"file-text","desc":"Sách văn học, sách kỹ năng, truyện tranh và sách thiếu nhi."},"Bách hoá":{"icon":"shopping-cart","desc":"Thực phẩm, đồ uống, gia vị và đồ dùng hằng ngày."},"Voucher":{"icon":"ticket","desc":"Voucher giảm giá, thẻ quà tặng và dịch vụ số."},"Điện thoại & Phụ kiện":{"icon":"smartphone","desc":"Điện thoại smartphone, ốp lưng, sạc cáp và phụ kiện chính hãng."},"Máy tính & Laptop":{"icon":"laptop","desc":"Laptop, PC, linh kiện và phụ kiện máy tính."},"Thiết bị âm thanh":{"icon":"headphones","desc":"Tai nghe, loa Bluetooth và thiết bị âm thanh chất lượng cao."},"Thời trang Nam":{"icon":"shopping-bag","desc":"Áo thun, quần jeans, giày và phụ kiện thời trang nam."},"Giày dép":{"icon":"footprints","desc":"Giày sneaker, dép, sandal và giày thể thao."},"Đồng hồ & Trang sức":{"icon":"watch","desc":"Đồng hồ nam nữ, trang sức và phụ kiện thời trang."},"Túi xách & Balo":{"icon":"briefcase","desc":"Balo, túi đeo chéo, túi xách thời trang và du lịch."},"Thiết bị gia dụng":{"icon":"house","desc":"Máy lọc không khí, robot hút bụi và đồ gia dụng thông minh."},"Mỹ phẩm & Chăm sóc":{"icon":"star","desc":"Kem chống nắng, serum, trang điểm và chăm sóc da."},"Phụ kiện điện tử":{"icon":"plug","desc":"Sạc, cáp, chuột, bàn phím và phụ kiện công nghệ."},"Thời trang Nữ":{"icon":"shopping-bag","desc":"Đầm, váy, quần áo và phụ kiện thời trang nữ."}};
  const SUBCATEGORIES = {
    'Điện tử': { 'Điện thoại & Phụ kiện': ['phone'], 'Máy tính & Laptop': ['laptop', 'keyboard'], 'Thiết bị âm thanh': ['headphones', 'speaker'], 'Phụ kiện điện tử': ['watch', 'camera'] },
    'Thời trang': { 'Thời trang Nam': ['tshirt', 'jacket'], 'Thời trang Nữ': ['sunglasses', 'jacket'], 'Giày dép': ['sneakers', 'heels'] },
    'Làm đẹp': { 'Mỹ phẩm & Chăm sóc': ['cosmetics', 'skincare', 'perfume'] },
    'Nhà cửa': { 'Thiết bị gia dụng': ['lamp'], 'Nội thất': ['chair'], 'Nhà bếp': ['mug'] },
    'Phụ kiện': { 'Đồng hồ & Trang sức': ['watch2'], 'Túi xách & Balo': ['backpack'] },
  };

  /* ---- Login sessions / devices (account security) ---- */
  const DEVICES = [
    { id: 'd1', kind: 'desktop', name: 'Windows PC · Chrome 126', where: 'TP. Hồ Chí Minh, VN', ip: '113.161.40.12', last: 'Đang hoạt động', current: true },
    { id: 'd2', kind: 'mobile', name: 'iPhone 15 · Genie App', where: 'TP. Hồ Chí Minh, VN', ip: '171.244.10.5', last: '2 giờ trước', current: false },
    { id: 'd3', kind: 'mobile', name: 'Samsung Galaxy · Chrome Mobile', where: 'Biên Hòa, Đồng Nai', ip: '116.97.220.31', last: 'Hôm qua, 21:40', current: false },
    { id: 'd4', kind: 'tablet', name: 'iPad Air · Safari', where: 'Hà Nội, VN', ip: '14.165.88.7', last: '20/06/2026', current: false },
  ];

  /* ---- Voucher wallet + Điểm Genie history ---- */
  const VOUCHERS = [
    { id: 'v1', code: 'GENIE30K', kind: 'platform', amount: '-30k', label: 'Giảm 30.000₫', cond: 'Đơn từ 199.000₫', expiry: '30/06/2026', validFrom: '01/06/2026', scope: 'Toàn sàn', type: 'FIXED', value: 30000, min: 199000, saved: true, status: 'active', used: 1840, limit: 5000, sponsor: 'Genie tài trợ', content: 'Áp dụng 1 lần cho mỗi tài khoản, không giới hạn ngành hàng.' },
    { id: 'v2', code: 'FREESHIP30', kind: 'freeship', amount: '0₫', label: 'Miễn phí vận chuyển', cond: 'Đơn từ 99.000₫', expiry: '15/06/2026', validFrom: '01/06/2026', scope: 'Toàn sàn', type: 'FREESHIP', value: 0, cap: 30000, min: 99000, saved: true, status: 'active', used: 3120, limit: 4000, sponsor: 'Genie tài trợ', content: 'Giảm tối đa 30.000₫ phí vận chuyển cho mỗi lần thanh toán.' },
    { id: 'v3', code: 'TECH15', kind: 'shop', vendorId: 'techzone', amount: '-15%', label: 'Giảm 15% tối đa 50k', cond: 'Đơn từ 250.000₫', expiry: '20/06/2026', validFrom: '01/06/2026', scope: 'TechZone Official', type: 'PERCENT', value: 15, cap: 50000, min: 250000, saved: true, status: 'active', used: 412, limit: 800, sponsor: 'TechZone Official tài trợ', content: 'Chỉ áp dụng cho sản phẩm của TechZone Official.' },
    { id: 'v4', code: 'XU50K', kind: 'platform', amount: '-50k', label: 'Hoàn 50.000₫ Điểm', cond: 'Đơn từ 500.000₫', expiry: '28/06/2026', validFrom: '05/06/2026', scope: 'Toàn sàn', type: 'FIXED', value: 50000, min: 500000, saved: true, status: 'active', used: 960, limit: 1000, sponsor: 'Genie tài trợ', content: 'Điểm hoàn vào ví sau khi đơn hoàn tất, điểm có hạn 12 tháng.' },
    { id: 'v5', code: 'GENIE100K', kind: 'platform', amount: '-100k', label: 'Giảm 100.000₫', cond: 'Đơn từ 1.000.000₫', expiry: '30/06/2026', validFrom: '01/06/2026', scope: 'Toàn sàn', type: 'FIXED', value: 100000, min: 1000000, saved: true, status: 'active', used: 250, limit: 2000, sponsor: 'Genie tài trợ', content: 'Áp dụng cho đơn có giá trị từ 1.000.000₫.' },
    { id: 'v6', code: 'TECH10', kind: 'platform', amount: '-10%', label: 'Giảm 10% đồ điện tử', cond: 'Đơn từ 500.000₫', expiry: '25/06/2026', validFrom: '01/06/2026', scope: 'Danh mục cụ thể', type: 'PERCENT', value: 10, cap: 200000, min: 500000, categories: ['Điện tử'], saved: true, status: 'active', used: 680, limit: 1500, sponsor: 'Đồng tài trợ với Shop', content: 'Chỉ tính trên các sản phẩm thuộc ngành hàng Điện tử.' },
    { id: 'v7', code: 'STYLE20K', kind: 'platform', amount: '-20k', label: 'Giảm 20.000₫ mọi ngành hàng', cond: 'Đơn từ 150.000₫', expiry: '24/06/2026', validFrom: '01/06/2026', scope: 'Toàn sàn', type: 'FIXED', value: 20000, min: 150000, excluded: ['Điện tử'], saved: true, status: 'active', used: 142, limit: 1000, sponsor: 'Genie tài trợ', content: 'Không áp dụng cho ngành hàng Điện tử.' },
    { id: 'v8', code: 'SHIPMAX', kind: 'freeship', amount: '0₫', label: 'Freeship Xtra tối đa 50k', cond: 'Đơn từ 299.000₫', expiry: '22/06/2026', validFrom: '01/06/2026', scope: 'Toàn sàn', type: 'FREESHIP', value: 0, cap: 50000, min: 299000, saved: true, status: 'active', used: 510, limit: 1000, sponsor: 'Genie tài trợ', content: 'Giảm tối đa 50.000₫ phí vận chuyển.' },
    { id: 'v9', code: 'BEAUTY50', kind: 'shop', vendorId: 'beauty', amount: '-50k', label: 'Giảm 50.000₫', cond: 'Đơn từ 300.000₫', expiry: '27/06/2026', validFrom: '01/06/2026', scope: 'Beauty Box', type: 'FIXED', value: 50000, min: 300000, saved: true, status: 'active', used: 88, limit: 300, sponsor: 'Beauty Box tài trợ', content: 'Chỉ áp dụng cho sản phẩm của Beauty Box.' },
    { id: 'v10', code: 'SHOE10', kind: 'shop', vendorId: 'shoe', amount: '-10%', label: 'Giảm 10% tối đa 30k', cond: 'Đơn từ 200.000₫', expiry: '26/06/2026', validFrom: '01/06/2026', scope: 'Shoe Republic', type: 'PERCENT', value: 10, cap: 30000, min: 200000, saved: true, status: 'active', used: 73, limit: 500, sponsor: 'Shoe Republic tài trợ', content: 'Chỉ áp dụng cho sản phẩm của Shoe Republic.' },
    { id: 'v11', code: 'BTQ20K', kind: 'shop', vendorId: 'boutique', amount: '-20k', label: 'Giảm 20.000₫', cond: 'Đơn từ 150.000₫', expiry: '26/06/2026', validFrom: '01/06/2026', scope: 'Boutique Sài Gòn', type: 'FIXED', value: 20000, min: 150000, saved: true, status: 'active', used: 49, limit: 400, sponsor: 'Boutique Sài Gòn tài trợ', content: 'Chỉ áp dụng cho sản phẩm của Boutique Sài Gòn.' },
    { id: 'v12', code: 'HOME15K', kind: 'shop', vendorId: 'home', amount: '-15k', label: 'Giảm 15.000₫', cond: 'Đơn từ 100.000₫', expiry: '26/06/2026', validFrom: '01/06/2026', scope: 'Home & Living', type: 'FIXED', value: 15000, min: 100000, saved: true, status: 'active', used: 31, limit: 400, sponsor: 'Home & Living tài trợ', content: 'Chỉ áp dụng cho sản phẩm của Home & Living.' },
    { id: 'v13', code: 'SALE1212', kind: 'platform', amount: '-12%', label: 'Siêu sale 12.12 giảm 12%', cond: 'Đơn từ 300.000₫', expiry: '12/12/2026', validFrom: '12/12/2026', scope: 'Toàn sàn', type: 'PERCENT', value: 12, cap: 120000, min: 300000, saved: false, status: 'upcoming', used: 0, limit: 10000, sponsor: 'Genie tài trợ', content: 'Lưu trước để dùng khi chương trình bắt đầu.' },
    { id: 'v14', code: 'WELCOME20', kind: 'platform', amount: '-20k', label: 'Chào bạn mới giảm 20.000₫', cond: 'Đơn từ 100.000₫', expiry: '31/05/2026', validFrom: '01/03/2026', scope: 'Toàn sàn', type: 'FIXED', value: 20000, min: 100000, saved: true, status: 'used', used: 7400, limit: 10000, sponsor: 'Genie tài trợ', content: 'Đã dùng cho đơn TR-20260608-000033.' },
    { id: 'v15', code: 'MAY15', kind: 'freeship', amount: '0₫', label: 'Freeship tháng 5', cond: 'Đơn từ 50.000₫', expiry: '31/05/2026', validFrom: '01/05/2026', scope: 'Toàn sàn', type: 'FREESHIP', value: 0, cap: 15000, min: 50000, saved: true, status: 'expired', used: 2300, limit: 3000, sponsor: 'Genie tài trợ', content: 'Voucher đã hết hạn.' },
  ];
  const COIN_LOG = [
    { type: 'earn', label: 'Hoàn điểm đơn TR-20260608-000041', amount: 120, at: '08/06/2026' },
    { type: 'earn', label: 'Đánh giá sản phẩm có ảnh', amount: 50, at: '06/06/2026' },
    { type: 'spend', label: 'Dùng Điểm giảm giá đơn TR-20260608-000033', amount: -200, at: '28/05/2026' },
    { type: 'earn', label: 'Điểm danh hằng ngày', amount: 100, at: '27/05/2026' },
    { type: 'earn', label: 'Hoàn điểm đơn TR-20260608-000021', amount: 80, at: '20/05/2026' },
  ];

  /* ---- Orders (status ENUM: PENDING_PAYMENT, PAID, CONFIRMED, PREPARING, READY_FOR_PICKUP,
     DELIVERING, DELIVERED, COMPLETED, RETURN_REQUESTED, CANCELLED, CANCELLED_BY_VENDOR,
     AUTO_CANCELLED, REFUNDED). Each order = one vendor
     (multi-vendor cart split). tracking mirrors shipment_trackings +
     append-only shipment_events for the timeline. ---- */
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const oi = (pid, variant, qty, price) => { const p = byId(pid); return { productId: pid, title: p.title, img: p.image, variant, qty, price }; };
  const ev = (status, label, location, at) => ({ status, label, location, at });

  const ORDERS = [
    {
      id: 'TR-20260608-000044', vendorId: 'techzone', status: 'DELIVERING', placedAt: '08/06/2026 14:22',
      items: [oi('p1', 'Đen', 1, 389000), oi('p18', 'Đen RGB', 1, 459000)],
      subtotal: 848000, shipping: 25000, discount: 60000, total: 813000,
      tracking: {
        carrier: 'JT_EXPRESS', code: 'JT0931042771', eta: '11/06/2026', deliveredAt: null, shipStatus: 'IN_TRANSIT',
        events: [
          ev('IN_TRANSIT', 'Đang trung chuyển đến kho phân loại HCM', 'Kho Sorting HCM', '10/06 08:12'),
          ev('PICKED_UP', 'ĐVVC đã lấy hàng từ người bán', 'TP. HCM', '09/06 17:40'),
          ev('AWAITING_PICKUP', 'Người bán đã giao cho ĐVVC, chờ lấy hàng', 'Kho TechZone, Q.7', '09/06 10:05'),
          ev('PREPARING', 'Người bán đang chuẩn bị hàng', 'TechZone Official', '08/06 15:01'),
          ev('PAID', 'Đơn hàng đã thanh toán, Genie đang giữ tiền', 'Genie', '08/06 14:22'),
        ],
      },
      address: ADDRESSES[0],
    },
    {
      id: 'TR-20260608-000041', vendorId: 'beauty', status: 'DELIVERED', placedAt: '06/06/2026 09:10',
      items: [oi('p13', '30ml', 1, 178000), oi('p12', 'Full set', 1, 235000)],
      subtotal: 413000, shipping: 16000, discount: 30000, total: 399000,
      tracking: {
        carrier: 'GHTK', code: 'GHTK8841200', eta: '08/06/2026', deliveredAt: '08/06/2026 11:32', releaseAt: '15/06/2026 11:32', shipStatus: 'DELIVERED',
        events: [
          ev('DELIVERED', 'Giao hàng thành công — người nhận đã ký nhận', 'Q.1, TP. HCM', '08/06 11:32'),
          ev('OUT_FOR_DELIVERY', 'Đang giao đến bạn', 'Bưu cục Q.1', '08/06 07:50'),
          ev('IN_TRANSIT', 'Đến kho phân loại', 'Kho Sorting HCM', '07/06 19:20'),
          ev('PICKED_UP', 'ĐVVC đã lấy hàng', 'TP. HCM', '06/06 16:00'),
          ev('PAID', 'Đơn hàng đã thanh toán, Genie đang giữ tiền', 'Genie', '06/06 09:10'),
        ],
      },
      address: ADDRESSES[0],
    },
    {
      id: 'TR-20260608-000033', vendorId: 'shoe', status: 'COMPLETED', placedAt: '28/05/2026 20:01',
      items: [oi('p3', 'Trắng / 42', 2, 259000)],
      subtotal: 518000, shipping: 18000, discount: 0, total: 536000, reviewed: false,
      tracking: { carrier: 'ViettelPost', code: 'VTP771903', eta: '31/05/2026', deliveredAt: '30/05/2026 15:10', shipStatus: 'DELIVERED', events: [
        ev('DELIVERED', 'Giao hàng thành công', 'Q.1, TP. HCM', '30/05 15:10'),
        ev('PAID', 'Đơn hàng đã thanh toán', 'Genie', '28/05 20:01'),
      ] },
      address: ADDRESSES[0], completedAt: '02/06/2026 15:10', returnClosed: true,
    },
    {
      id: 'TR-20260608-000047', vendorId: 'techzone', status: 'CONFIRMED', pay: 'VietQR', placedAt: '11/06/2026 08:15',
      items: [oi('p17', 'Đen', 1, 320000)],
      subtotal: 320000, shipping: 25000, discount: 0, total: 345000,
      tracking: null, address: ADDRESSES[0],
    },
    {
      id: 'TR-20260608-000046', vendorId: 'beauty', status: 'PREPARING', pay: 'COD', placedAt: '10/06/2026 19:42',
      items: [oi('p19', '50ml', 1, 420000)],
      subtotal: 420000, shipping: 16000, discount: 0, total: 436000,
      tracking: null, address: ADDRESSES[0],
    },
    {
      id: 'TR-20260608-000028', vendorId: 'techzone', status: 'RETURN_REQUESTED', pay: 'COD', placedAt: '01/06/2026 10:30',
      items: [oi('p18', 'Blue switch', 1, 459000)],
      subtotal: 459000, shipping: 25000, discount: 0, total: 484000,
      tracking: { carrier: 'GHN', code: 'VN880077120', eta: '04/06/2026', deliveredAt: '04/06/2026 16:02', shipStatus: 'DELIVERED', events: [ev('DELIVERED', 'Giao hàng thành công', 'Q.1, TP. HCM', '04/06 16:02')] },
      address: ADDRESSES[0], refund: { id: 'RFN-0233', state: 'REQUESTED', type: 'RETURN_AND_REFUND', reason: 'Sản phẩm lỗi', amount: 459000 },
    },
    {
      id: 'TR-20260608-000029', sessionId: 'CS-8F21A', vendorId: 'home', status: 'PENDING_PAYMENT', placedAt: '10/06/2026 09:40',
      items: [oi('p9', 'Trắng', 2, 59000)],
      subtotal: 118000, shipping: 30000, discount: 0, total: 148000,
      tracking: null, address: ADDRESSES[0], expireAt: '10/06/2026 09:55',
    },
    {
      id: 'TR-20260608-000030', sessionId: 'CS-8F21A', vendorId: 'travel', status: 'PENDING_PAYMENT', placedAt: '10/06/2026 09:40',
      items: [oi('p6', 'Đen / 25L', 1, 189000)],
      subtotal: 189000, shipping: 22000, discount: 20000, total: 191000,
      tracking: null, address: ADDRESSES[0], expireAt: '10/06/2026 09:55',
    },
    {
      id: 'TR-20260608-000018', vendorId: 'shoe', status: 'CANCELLED', placedAt: '12/05/2026 10:02',
      items: [oi('p14', 'Đen / 37', 1, 320000)],
      subtotal: 320000, shipping: 18000, discount: 0, total: 338000,
      tracking: null, address: ADDRESSES[0],
    },
    {
      id: 'TR-20260608-000017', vendorId: 'home', status: 'AUTO_CANCELLED', placedAt: '11/05/2026 08:20',
      items: [oi('p10', 'Trắng', 1, 149000)],
      subtotal: 149000, shipping: 30000, discount: 0, total: 179000,
      tracking: null, address: ADDRESSES[0], cancelReason: 'Quá hạn thanh toán 15 phút',
    },
    {
      id: 'TR-20260608-000021', vendorId: 'boutique', status: 'REFUNDED', placedAt: '20/05/2026 13:27',
      items: [oi('p15', 'Xanh / L', 1, 245000)],
      subtotal: 245000, shipping: 20000, discount: 0, total: 265000,
      tracking: { carrier: 'GHN', code: 'VN880012345', shipStatus: 'RETURNED', events: [] },
      address: ADDRESSES[0], refund: { id: 'RFN-0212', reason: 'Hàng không đúng mô tả', amount: 265000, resolvedAt: '24/05/2026' },
    },
  ];

  ORDERS.forEach((o) => { if (!o.pay) o.pay = o.id === 'TR-20260608-000041' ? 'VietQR' : 'VNPay'; });

  /* ---- Notifications (reuses the 4 from the header bell dropdown, typed for the
     Notification Center page). type ∈ order | promo | system | chat. ---- */
  const NOTIFICATIONS = [
    { id: 'n1', type: 'order', icon: 'truck', tint: 'var(--mint-600)', bg: 'var(--mint-50)', title: 'Đơn TR-20260608-000044 đang giao', body: 'GHN đang trung chuyển đến kho HCM, dự kiến giao 11/06.', date: '22/06/2026', unread: true, link: { action: 'track', orderId: 'TR-20260608-000044' } },
    { id: 'n2', type: 'promo', icon: 'ticket', tint: 'var(--flash-600)', bg: 'var(--flash-50)', title: 'Voucher Freeship sắp hết hạn', body: 'Mã miễn phí vận chuyển của bạn hết hạn 23:59 hôm nay — dùng ngay kẻo lỡ.', date: '22/06/2026', unread: true, link: { action: 'view', view: 'vouchers' } },
    { id: 'n3', type: 'order', icon: 'badge-check', tint: 'var(--brand-600)', bg: 'var(--brand-50)', title: 'Đơn TR-20260608-000041 đã giao thành công', body: 'Bấm "Đã nhận hàng" để hoàn tất đơn và giải ngân cho người bán.', date: '21/06/2026', unread: true, link: { action: 'track', orderId: 'TR-20260608-000041' } },
    { id: 'n4', type: 'promo', icon: 'zap', tint: 'var(--gold-700)', bg: 'var(--gold-50)', title: 'FLASH SALE 12.12 bắt đầu!', body: 'Giảm tới 50% hàng nghìn sản phẩm — săn deal ngay trên trang chủ.', date: '20/06/2026', unread: false, link: { action: 'home' } },
    { id: 'n5', type: 'system', icon: 'shield-check', tint: 'var(--blue-600)', bg: 'var(--blue-50)', title: 'Đăng nhập mới trên thiết bị lạ', body: 'Tài khoản vừa đăng nhập trên Chrome · TP. HCM. Nếu không phải bạn, hãy đổi mật khẩu ngay.', date: '20/06/2026', unread: false, link: { action: 'view', view: 'password' } },
    { id: 'n7', type: 'system', icon: 'genie', tint: 'var(--brand-600)', bg: 'var(--brand-50)', title: 'Genie nâng cấp hệ thống 02:00 – 04:00', body: 'Thông báo toàn sàn: một số dịch vụ có thể gián đoạn trong khung giờ bảo trì, đơn hàng của bạn không bị ảnh hưởng.', date: '18/06/2026', unread: false, platform: true },
    { id: 'n6', type: 'chat', icon: 'message-circle', tint: 'var(--brand-600)', bg: 'var(--brand-50)', title: 'TechZone Official đã trả lời', body: '"Dạ còn đủ màu đen bạn nhé! Freeship cho đơn từ 199k ạ."', date: '19/06/2026', unread: false, link: { action: 'home' } },
  ];

  const PROVINCES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Đồng Nai', 'Hải Phòng', 'Cần Thơ'];
  const DISTRICTS = { 'TP. Hồ Chí Minh': ['Q.1', 'Q.3', 'Q.5', 'Q.7', 'Q. Bình Thạnh', 'Q. Phú Nhuận', 'TP. Thủ Đức'], 'Hà Nội': ['Q. Hoàn Kiếm', 'Q. Ba Đình', 'Q. Cầu Giấy', 'Q. Đống Đa'] };

  /* ---- Voucher rules, shared by VoucherPicker, Cart and Checkout ---- */
  const lineTotal = (lines) => lines.reduce((n, l) => n + l.price * l.qty, 0);
  const lineCat = (l) => { const p = byId(l.productId); return p ? p.cat : null; };
  const voucherLines = (v, lines) => lines.filter((l) => {
    if (v.vendorId && l.vendorId !== v.vendorId) return false;
    if (v.excluded && v.excluded.includes(lineCat(l))) return false;
    if (v.categories && !v.categories.includes(lineCat(l))) return false;
    return true;
  });
  const fmtVND = (n) => Number(n).toLocaleString('vi-VN') + '₫';
  // Tier 2: a platform voucher's minimum and value use the amount left after each shop's voucher.
  const eligibleBase = (v, lines, sel) => {
    const hit = voucherLines(v, lines);
    let base = lineTotal(hit);
    if (v.kind === 'platform' && sel && sel.shop) {
      [...new Set(hit.map((l) => l.vendorId))].forEach((vid) => {
        const sv = VOUCHERS.find((x) => x.id === sel.shop[vid]);
        if (!sv) return;
        const shopLines = lines.filter((l) => l.vendorId === vid);
        base -= Math.round(voucherDiscount(sv, shopLines) * lineTotal(hit.filter((l) => l.vendorId === vid)) / lineTotal(shopLines));
      });
    }
    return base;
  };
  const voucherCheck = (v, lines, sel) => {
    const base = eligibleBase(v, lines, sel);
    if (lineTotal(voucherLines(v, lines)) === 0) return { ok: false, base, reason: 'Giỏ hàng chưa có sản phẩm phù hợp' };
    if (base < v.min) return { ok: false, base, reason: 'Chưa đạt giá trị tối thiểu ' + fmtVND(v.min) };
    return { ok: true, base };
  };
  // A shop's own free-shipping threshold zeroes its fee (the shop bears it), separate from the Freeship voucher.
  const shipFee = (vid, lines) => { const sub = lineTotal(lines.filter((l) => l.vendorId === vid)); return V[vid].freeFrom && sub >= V[vid].freeFrom ? 0 : V[vid].ship; };
  const shipOf = (lines, all) => [...new Set(lines.map((l) => l.vendorId))].reduce((n, vid) => n + shipFee(vid, all || lines), 0);
  const voucherDiscount = (v, lines, sel) => {
    const c = voucherCheck(v, lines, sel);
    if (!c.ok) return 0;
    if (v.type === 'FREESHIP') return Math.min(v.cap, shipOf(voucherLines(v, lines), lines));
    if (v.type === 'PERCENT') return Math.min(Math.round(c.base * v.value / 100), v.cap || Infinity);
    return Math.min(v.value, c.base);
  };
  // sel = { platform, freeship, shop: { [vendorId]: voucherId } }. Order: Shop → Platform → Freeship → Điểm.
  // Platform voucher is prorated per line; Điểm = 1₫, capped at 50% of the goods amount left after vouchers.
  const priceCart = (lines, sel, useXu) => {
    const find = (id) => VOUCHERS.find((v) => v.id === id);
    const subtotal = lineTotal(lines);
    const vendors = [...new Set(lines.map((l) => l.vendorId))];
    const shipping = vendors.reduce((n, vid) => n + shipFee(vid, lines), 0);
    const s = sel || {};
    const pv = s.platform ? find(s.platform) : null, fv = s.freeship ? find(s.freeship) : null;
    const platformDisc = pv ? voucherDiscount(pv, lines, s) : 0;
    const freeshipDisc = fv ? voucherDiscount(fv, lines) : 0;
    const perLine = {};
    if (platformDisc > 0) {
      const hit = voucherLines(pv, lines), base = lineTotal(hit);
      let left = platformDisc;
      hit.forEach((l, i) => { const cut = i === hit.length - 1 ? left : Math.round(platformDisc * l.price * l.qty / base); perLine[l.key] = cut; left -= cut; });
    }
    const shipCutByVendor = {};
    if (freeshipDisc > 0) {
      const hit = [...new Set(voucherLines(fv, lines).map((l) => l.vendorId))], base = hit.reduce((n, vid) => n + shipFee(vid, lines), 0);
      let left = freeshipDisc;
      hit.forEach((vid, i) => { const cut = i === hit.length - 1 ? left : Math.round(freeshipDisc * shipFee(vid, lines) / base); shipCutByVendor[vid] = cut; left -= cut; });
    }
    const shopByVendor = {};
    vendors.forEach((vid) => {
      const id = (s.shop || {})[vid], v = id && find(id);
      shopByVendor[vid] = v ? voucherDiscount(v, lines.filter((l) => l.vendorId === vid)) : 0;
    });
    const shopDisc = Object.values(shopByVendor).reduce((a, b) => a + b, 0);
    const afterVouchers = Math.max(0, subtotal + shipping - platformDisc - freeshipDisc - shopDisc);
    const xuCap = Math.floor(Math.max(0, subtotal - platformDisc - shopDisc) * 0.5);
    const xuDiscount = useXu ? Math.min(USER.coins || 0, xuCap) : 0;
    return {
      subtotal, shipping, platformDisc, freeshipDisc, shopDisc, shopByVendor, shipCutByVendor, perLine, xuCap, xuDiscount,
      discountTotal: platformDisc + freeshipDisc + shopDisc + xuDiscount, total: afterVouchers - xuDiscount,
      platformVoucher: platformDisc > 0 ? pv : null, freeshipVoucher: freeshipDisc > 0 ? fv : null,
    };
  };

  // Suggests the set with the largest total discount: best shop voucher per shop, then platform and freeship.
  const bestVouchers = (lines) => {
    const pool = VOUCHERS.filter((v) => v.saved && v.status === 'active');
    const top = (list, sel, ls) => list.map((v) => ({ v, d: voucherDiscount(v, ls, sel) })).sort((a, b) => b.d - a.d).slice(0, 5).find((x) => x.d > 0);
    const sel = { platform: null, freeship: null, shop: {} };
    [...new Set(lines.map((l) => l.vendorId))].forEach((vid) => {
      const best = top(pool.filter((v) => v.kind === 'shop' && v.vendorId === vid), null, lines.filter((l) => l.vendorId === vid));
      if (best) sel.shop[vid] = best.v.id;
    });
    const p = top(pool.filter((v) => v.kind === 'platform'), sel, lines);
    const f = top(pool.filter((v) => v.kind === 'freeship'), sel, lines);
    if (p) sel.platform = p.v.id;
    if (f) sel.freeship = f.v.id;
    return sel;
  };

  // Maps order statuses to the design system's badge colours.
  const BADGE = { CONFIRMED: 'PROCESSING', PREPARING: 'PROCESSING', READY_FOR_PICKUP: 'PROCESSING', DELIVERING: 'SHIPPED', CANCELLED_BY_VENDOR: 'CANCELLED', AUTO_CANCELLED: 'CANCELLED' };
  const badgeStatus = (s) => BADGE[s] || s;

  const VARIANT_GROUPS = {
    'Điện tử': [{ key: 'Màu sắc', values: ['Đen', 'Trắng', 'Xanh navy'] }],
    'Thời trang': [{ key: 'Màu sắc', values: ['Đen', 'Trắng', 'Xanh'] }, { key: 'Kích cỡ', values: ['S', 'M', 'L', '37', '42'] }],
    'Làm đẹp': [{ key: 'Dung tích', values: ['30ml', '50ml', 'Full set'] }],
    'Nhà cửa': [{ key: 'Màu sắc', values: ['Trắng', 'Đen', 'Gỗ tự nhiên'] }],
    'Phụ kiện': [{ key: 'Màu sắc', values: ['Đen', 'Nâu'] }, { key: 'Dung tích', values: ['25L', '30L'] }],
  };

  // Banners: one store shared by Admin → Banner and the storefront slots. The seed counts as
  // saved until Admin edits it, so a fresh browser already shows the live banners.
  // v4: every position seeded, popups dealt as a stack of three; older sets are left behind.
  const BANNER_KEY = 'lz_home_banners_v4';
  const BANNER_SEED = [
    { id: 'BN-101', title: 'Nhận hàng rồi, tiền mới đến shop', image: '../../assets/img/banners/home-trust.jpg', imageMobile: '', link: '/?screen=discover', position: 'HOME_TOP_CAROUSEL', category: '', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 182400, clicks: 9860 },
    { id: 'BN-105', title: 'Công nghệ chính hãng', image: '../../assets/img/banners/home-tech.jpg', imageMobile: '', link: '/?screen=category&cat=Điện tử', position: 'HOME_TOP_CAROUSEL', category: '', order: 2, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 64100, clicks: 2870 },
    { id: 'BN-106', title: 'Làm đẹp mỗi ngày', image: '../../assets/img/banners/home-beauty.jpg', imageMobile: '', link: '/?screen=category&cat=Làm đẹp', position: 'HOME_TOP_CAROUSEL', category: '', order: 3, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 51800, clicks: 2240 },
    { id: 'BN-107', title: 'Thời trang mới về', image: '../../assets/img/banners/home-fashion.jpg', imageMobile: '', link: '/?screen=category&cat=Thời trang', position: 'HOME_TOP_CAROUSEL', category: '', order: 4, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 47300, clicks: 1910 },
    { id: 'BN-115', title: 'Siêu sale 12.12', image: '../../assets/img/banners/camp-1212.jpg', imageMobile: '', link: '/sieu-sale-12-12', position: 'HOME_TOP_CAROUSEL', category: '', order: 5, startsAt: '2026-11-01', endsAt: '2026-12-12', on: true, views: 12800, clicks: 940 },
    { id: 'BN-108', title: 'Freeship đơn từ 99.000₫', image: '../../assets/img/banners/side-freeship.jpg', imageMobile: '', link: '/?screen=home#flash-sale', position: 'HOME_TOP_SIDE', category: '', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 88200, clicks: 4410 },
    { id: 'BN-109', title: 'Mở shop 0₫ trên Genie', image: '../../assets/img/banners/side-seller.jpg', imageMobile: '', link: '/?screen=seller', position: 'HOME_TOP_SIDE', category: '', order: 2, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 39700, clicks: 1260 },
    { id: 'BN-102', title: 'Nhà cửa và đời sống', image: '../../assets/img/banners/mid-home.jpg', imageMobile: '', link: '/?screen=category&cat=Nhà cửa', position: 'HOME_MIDDLE', category: '', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 96300, clicks: 3120 },
    { id: 'BN-110', title: 'Phụ kiện công nghệ', image: '../../assets/img/banners/mid-acc.jpg', imageMobile: '', link: '/?screen=category&cat=Phụ kiện', position: 'HOME_MIDDLE', category: '', order: 2, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 42600, clicks: 1530 },
    { id: 'BN-103', title: 'Shop nổi bật: Beauty Box', image: '../../assets/img/banners/cat-beauty.jpg', imageMobile: '', link: '/?screen=shop&shop=beauty', position: 'CATEGORY_TOP', category: 'Làm đẹp', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 41200, clicks: 1980 },
    { id: 'BN-111', title: 'Shop nổi bật: TechZone Official', image: '../../assets/img/banners/cat-tech.jpg', imageMobile: '', link: '/?screen=shop&shop=techzone', position: 'CATEGORY_TOP', category: 'Điện tử', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 30500, clicks: 1220 },
    { id: 'BN-112', title: 'Shop nổi bật: Boutique Sài Gòn', image: '../../assets/img/banners/cat-fashion.jpg', imageMobile: '', link: '/?screen=shop&shop=boutique', position: 'CATEGORY_TOP', category: 'Thời trang', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 27800, clicks: 990 },
    { id: 'BN-113', title: 'Shop nổi bật: Home & Living', image: '../../assets/img/banners/cat-home.jpg', imageMobile: '', link: '/?screen=shop&shop=home', position: 'CATEGORY_TOP', category: 'Nhà cửa', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 19400, clicks: 610 },
    { id: 'BN-114', title: 'Shop nổi bật: TravelGear', image: '../../assets/img/banners/cat-acc.jpg', imageMobile: '', link: '/?screen=shop&shop=travel', position: 'CATEGORY_TOP', category: 'Phụ kiện', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 15100, clicks: 470 },
    { id: 'BN-116', title: 'Tai nghe ANC Pro 5 chỉ 389.000₫', image: '../../assets/img/banners/flash-anc.jpg', imageMobile: '', link: '/?screen=product&product=p1', position: 'FLASH_SALE_TOP', category: '', order: 1, startsAt: '2026-01-01', endsAt: '2030-12-31', on: true, views: 23600, clicks: 2050 },
    { id: 'BN-104', title: 'Siêu sale 12.12', image: '../../assets/img/banners/camp-1212.jpg', imageMobile: '', link: '/sieu-sale-12-12', position: 'POPUP', category: '', order: 1, startsAt: '2026-11-01', endsAt: '2026-12-12', on: true, views: 31000, clicks: 2480 },
    { id: 'BN-118', title: 'Freeship đơn từ 99.000₫', image: '../../assets/img/banners/side-freeship.jpg', imageMobile: '', link: '/?screen=home#flash-sale', position: 'POPUP', category: '', order: 2, startsAt: '2026-11-01', endsAt: '2030-12-31', on: true, views: 18200, clicks: 1310 },
    { id: 'BN-119', title: 'Mở shop 0₫ trên Genie', image: '../../assets/img/banners/side-seller.jpg', imageMobile: '', link: '/?screen=seller', position: 'POPUP', category: '', order: 3, startsAt: '2026-11-01', endsAt: '2030-12-31', on: true, views: 9400, clicks: 520 },
    { id: 'BN-117', title: 'Tết 2026 giảm sâu', image: '../../assets/img/banner-sale.jpg', imageMobile: '', link: '/?screen=discover', position: 'POPUP', category: '', order: 4, startsAt: '2026-01-01', endsAt: '2026-02-15', on: true, views: 310000, clicks: 12400 },
  ];
  // Dates are compared as local YYYY-MM-DD strings, the same way on both sides.
  const localDay = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const banners = {
    KEY: BANNER_KEY,
    all: () => { try { const r = JSON.parse(localStorage.getItem(BANNER_KEY)); if (Array.isArray(r)) return r; } catch (e) {} return BANNER_SEED.map((b) => ({ ...b })); },
    save: (rows) => { try { localStorage.setItem(BANNER_KEY, JSON.stringify(rows)); } catch (e) { /* preview only */ } },
    stateOf: (b) => (!b.on ? 'OFF' : b.endsAt && b.endsAt < localDay() ? 'ENDED' : b.startsAt && b.startsAt > localDay() ? 'SCHEDULED' : 'LIVE'),
    live: (position, category) => banners.all().filter((b) => b.position === position && banners.stateOf(b) === 'LIVE' && (!category || b.category === category)).sort((a, b) => a.order - b.order),
    count: (id, field) => banners.save(banners.all().map((b) => (b.id === id ? { ...b, [field]: (b[field] || 0) + 1 } : b))),
    today: localDay,
  };

  // Campaign pages, reached from a banner whose link is a path such as /sieu-sale-12-12.
  const CAMPAIGNS = {
    'sieu-sale-12-12': {
      title: 'Siêu sale 12.12',
      colour: '#B3202E',
      pics: ['sneakers', 'perfume', 'speaker'],
      intro: 'Từ 00:00 ngày 12/12 các shop đã xác minh giảm sâu. Lưu mã SALE1212 hôm nay để dùng khi chiến dịch mở; Genie vẫn giữ tiền đến khi bạn nhận hàng.',
      voucher: { kind: 'platform', amount: '-12%', label: 'Đơn từ 300.000₫, dùng từ 12/12', code: 'SALE1212' },
      pick: (p) => p.discountPct >= 45,
      endsAt: '2026-12-12',
    },
  };

  // Wishlist survives reloads and notifies every card that shows the heart.
  const WISH_KEY = 'lz_wishlist';
  const readWish = () => { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || ['p2', 'p13']; } catch (e) { return ['p2', 'p13']; } };
  let wish = readWish();
  const wishSubs = new Set();
  const wishlist = {
    list: () => wish.slice(),
    has: (id) => wish.includes(id),
    toggle: (id) => {
      wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
      try { localStorage.setItem(WISH_KEY, JSON.stringify(wish)); } catch (e) {}
      wishSubs.forEach((f) => f());
    },
    subscribe: (f) => { wishSubs.add(f); return () => wishSubs.delete(f); },
  };

  window.LZ = {
    wishlist, banners, CAMPAIGNS, loggedIn: true, ATTR_FILTERS,
    V, PRODUCTS, CATEGORIES, USER, ADDRESSES, FOLLOWS, ORDERS, PROVINCES, DISTRICTS, VOUCHERS, COIN_LOG, NOTIFICATIONS, DEVICES, CATEGORY_META,
    byId, voucherCheck, voucherDiscount, priceCart, bestVouchers, shipFee, badgeStatus,
    variantOptions: (p) => (p && VARIANT_GROUPS[p.cat]) || [{ key: 'Phân loại', values: ['Tiêu chuẩn'] }],
    subCategoriesOf: (name) => Object.keys(SUBCATEGORIES[name] || {}),
    // a top-level name matches by cat; a sub-category name matches by product image group
    productsOfCategory: (name, sub) => {
      const parent = Object.keys(SUBCATEGORIES).find((k) => SUBCATEGORIES[k][name]);
      const pick = sub || (parent ? name : null);
      const groups = SUBCATEGORIES[parent || name] || {};
      const base = PRODUCTS.filter((p) => p.cat === (parent || name));
      if (!pick || !groups[pick]) return base;
      return base.filter((p) => groups[pick].some((g) => p.img.endsWith('/' + g + '.jpg')));
    },
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
  };
})();
