/* Mock data for the Genie vendor dashboard (escrow wallet focus). */
(function () {
  const SHOP = { name: 'TechZone Official', kyc: 'VERIFIED', mall: true, rating: 4.9, commissionRate: 0.05 };


  // Append-only ledger (newest first). gross − commission = net.
  const LEDGER = [
    { date: '08/06/2026 14:22', ref: 'TR-20260608-000141', type: 'SALE',       label: 'Bán hàng — vào escrow',        gross: 778000,  commission: 38900,  net: 739100,  bucket: 'HELD' },
    { date: '08/06/2026 09:10', ref: 'TR-20260608-000140', type: 'SALE',       label: 'Bán hàng — vào escrow',        gross: 690000,  commission: 34500,  net: 655500,  bucket: 'HELD' },
    { date: '08/06/2026 09:00', ref: 'PAYOUT-0012',   type: 'PAYOUT',     label: 'Rút tiền về ngân hàng (chờ duyệt)', gross: -5000000,commission: 0,      net: -5000000,bucket: 'PAYOUT' },
    { date: '07/06/2026 18:46', ref: 'TR-20260608-000139', type: 'RELEASE',    label: 'Giải ngân — đơn hoàn tất',     gross: 1245000, commission: 0,      net: 1245000, bucket: 'AVAILABLE' },
    { date: '07/06/2026 11:03', ref: 'TR-20260608-000137', type: 'RELEASE',    label: 'Giải ngân — đơn hoàn tất',     gross: 459000,  commission: 0,      net: 459000,  bucket: 'AVAILABLE' },
    { date: '06/06/2026 08:15', ref: 'TR-20260608-000135', type: 'REFUND',     label: 'Hoàn tiền — khách trả hàng',   gross: -178000, commission: -8900,  net: -169100, bucket: 'REFUND' },
    { date: '05/06/2026 20:01', ref: 'TR-20260608-000134', type: 'SALE',       label: 'Bán hàng — vào escrow',        gross: 540000,  commission: 27000,  net: 513000,  bucket: 'HELD' },
    { date: '05/06/2026 13:27', ref: 'TR-20260608-000131', type: 'RELEASE',    label: 'Giải ngân — đơn hoàn tất',     gross: 320000,  commission: 0,      net: 320000,  bucket: 'AVAILABLE' },
  ];

  // Everything below is derived from these series, so the screens cannot disagree.
  const AS_OF = '08/06/2026';
  const M = 1000000;
  // Revenue per day (₫, before commission): the 30 days ending AS_OF, then the 30 days before them.
  const DAILY = [1.0, 1.3, 1.0, 1.4, 1.2, 1.5, 1.6, 1.2, 1.4, 1.1, 1.3, 1.6, 1.7, 1.5, 1.3, 1.4, 1.5, 1.2, 1.6, 1.8, 1.7, 1.6, 1.6, 1.7, 1.4, 1.6, 1.9, 2.2, 2.0, 2.5].map((v) => Math.round(v * M));
  const PREV_30_DAYS = 38680000;
  const HOURS_TODAY = [['6h', 0.1], ['9h', 0.3], ['12h', 0.6], ['15h', 0.4], ['18h', 0.5], ['21h', 0.6]].map(([label, v]) => ({ label, value: Math.round(v * M) }));
  // Closed calendar months only: 06/2025 to 05/2026.
  const MONTHS = [18, 21, 19, 24, 23, 27, 29, 34, 26, 31, 35, 41].map((v, i) => ({ label: 'T' + (((i + 5) % 12) + 1), value: v * M }));
  const sum = (a) => a.reduce((n, v) => n + v, 0);
  const dayLabel = (back) => { const d = new Date(2026, 5, 8 - back); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); };
  const dayPoints = (n) => DAILY.slice(-n).map((value, i) => ({ label: dayLabel(n - 1 - i), value }));
  const REVENUE = {
    week: { title: '7 ngày qua', points: dayPoints(7), prev: sum(DAILY.slice(-14, -7)), against: 'so với 7 ngày trước' },
    month: { title: '30 ngày qua', points: dayPoints(30), prev: PREV_30_DAYS, against: 'so với 30 ngày trước' },
    year: { title: '12 tháng đã chốt', points: MONTHS, prev: null, against: 'Từ 06/2025 đến 05/2026' },
  };
  const PERF = {
    'Hôm nay': { sub: 'hôm nay', against: 'so với hôm qua', rev: DAILY[29], prevRev: DAILY[28], orders: 5, prevOrders: 4, visits: 140, prevVisits: 120, points: HOURS_TODAY, title: 'Doanh thu theo khung giờ', shopVoucher: 52000, out: [0, 0, 0, 0, 5] },
    '7 ngày qua': { sub: 'trong 7 ngày qua', against: 'so với 7 ngày trước', rev: sum(DAILY.slice(-7)), prevRev: REVENUE.week.prev, orders: 29, prevOrders: 24, visits: 860, prevVisits: 760, points: dayPoints(7), title: 'Doanh thu theo ngày', shopVoucher: 296000, out: [17, 1, 1, 0, 10] },
    '30 ngày qua': { sub: 'trong 30 ngày qua', against: 'so với 30 ngày trước', rev: sum(DAILY), prevRev: PREV_30_DAYS, orders: 100, prevOrders: 92, visits: 3120, prevVisits: 2786, points: dayPoints(30), title: 'Doanh thu theo ngày', shopVoucher: 1284000, out: [81, 4, 2, 2, 11] },
  };
  // How each period's orders ended, in the order of PERF[x].out (UC-VND-08: hoàn tất, hủy, trả hàng).
  const OUTCOMES = [['Hoàn tất', 'ok'], ['Khách hủy', 'wait'], ['Shop từ chối', 'bad'], ['Trả hàng, hoàn tiền', 'held'], ['Đang xử lý', 'info']];
  // Commission falls back shop → category → 5% (FR-PAY-03); this shop pays the 5% default.
  const COMMISSION_RATE = 0.05;
  // Shop health over 30 days: complaints the shop lost (UC-SUP-03) and orders the cron had
  // to confirm after 24 hours (FR-LOG-01).
  const HEALTH = { lostDisputes: 1, lateConfirms: 2 };
  const WALLET = {
    available: 12450000,
    held: sum(LEDGER.filter((r) => r.bucket === 'HELD').map((r) => r.net)), // in escrow, not yet released
    revenue30: sum(DAILY),
    prevRevenue30: PREV_30_DAYS,
    pendingPayout: 5000000, // PAYOUT-0012, waiting in Admin → Xử lý rút tiền
    codPending: 1950000,  // COD not yet reconciled with the carrier
  };
  const CHAT_UNREAD = 5;

  // GHN carrier status -> label + StatusBadge color
  const GHN_STATUS = {
    ready_to_pick: { label: 'Chờ lấy hàng', color: 'PENDING' }, picking: { label: 'Đang lấy hàng', color: 'PENDING' }, picked: { label: 'Đã lấy hàng', color: 'PAID' },
    storing: { label: 'Đang lưu kho', color: 'PAID' }, transporting: { label: 'Đang trung chuyển', color: 'SHIPPED' }, sorting: { label: 'Đang phân loại', color: 'SHIPPED' },
    delivering: { label: 'Đang giao hàng', color: 'SHIPPED' }, money_collect_picking: { label: 'Đang thu tiền COD', color: 'SHIPPED' }, delivered: { label: 'Giao thành công', color: 'DELIVERED' },
    delivery_fail: { label: 'Giao thất bại', color: 'ERROR' }, waiting_to_return: { label: 'Chờ trả hàng', color: 'CANCELLED' }, return: { label: 'Đang trả hàng', color: 'CANCELLED' },
    return_transporting: { label: 'Đang vận chuyển trả', color: 'CANCELLED' }, returned: { label: 'Đã trả hàng', color: 'CANCELLED' }, cancel: { label: 'Đã hủy', color: 'CANCELLED' }, exception: { label: 'Đơn gặp sự cố', color: 'ERROR' },
  };
  const ghnStatus = (s) => GHN_STATUS[s] || { label: s, color: 'PENDING' };

  const NOTIFICATIONS = [
    { id: 'vn1', title: 'Sản phẩm đã được duyệt', body: '"Tai nghe Bluetooth ANC Pro 5" đã được duyệt và hiển thị trên sàn.', date: '08/06/2026 15:02', unread: true, icon: 'badge-check' },
    { id: 'vn2', title: 'Có đơn hàng mới cần chuẩn bị', body: 'Đơn TR-20260608-000141 vừa được thanh toán. Hãy chuẩn bị hàng trong 24 giờ.', date: '08/06/2026 14:22', unread: true, icon: 'package' },
    { id: 'vn3', title: 'Genie nâng cấp hệ thống 02:00 – 04:00', body: 'Thông báo toàn sàn: Seller Center có thể gián đoạn trong khung giờ bảo trì. Đơn hàng và ví Escrow không bị ảnh hưởng.', date: '07/06/2026 09:00', unread: true, icon: 'genie' },
    { id: 'vn4', title: 'Sản phẩm bị từ chối', body: '"Camera Mirrorless X-100" thiếu giấy tờ chứng thực. Vui lòng bổ sung và gửi duyệt lại.', date: '05/06/2026 11:40', unread: false, icon: 'triangle-alert' },
  ];

  // Payout account, shared between Cài đặt and the withdrawal form (UC-VND-07 → UC-ADM-04).
  const BANK = { bank: 'Vietcombank', holder: 'DANG QUOC HUY', number: '0071000006712', verified: true };
  const KYC_NAME = 'Đặng Quốc Huy';

  const downloadCsv = (name, rows) => {
    const text = rows.map((r) => r.map((v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const ORDERS = [
    { id: 'TR-20260608-000146', customer: 'Trần Thị Mai', addr: 'Q1, TP.HCM', items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000]], total: 414000, status: 'NEW', pay: 'VNPay', note: 'Giao giờ hành chính giúp mình nhé.', at: 46 },
    { id: 'TR-20260608-000145', customer: 'Đinh Gia Bảo', addr: 'Thủ Đức, TP.HCM', items: [['Bàn phím cơ RGB', 'Blue switch', 1, 459000]], total: 484000, status: 'NEW', pay: 'COD', note: '', at: 45 },
    { id: 'TR-20260608-000141', customer: 'Trần Thị Mai', addr: 'Q1, TP.HCM', items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000], ['Serum Vitamin C', '30ml', 1, 178000]], total: 778000, status: 'CONFIRMED', pay: 'VNPay', note: 'Gói kỹ giúp mình, đồ làm quà.', at: 41 },
    { id: 'TR-20260608-000140', customer: 'Nguyễn Văn An', addr: 'Cầu Giấy, Hà Nội', items: [['Đồng hồ Watch S2', 'Navy', 1, 690000]], total: 690000, status: 'PREPARING', pay: 'VietQR', note: '', at: 40 },
    { id: 'TR-20260608-000138', customer: 'Lê Hoàng Phúc', addr: 'Hải Châu, Đà Nẵng', items: [['Bàn phím cơ RGB', 'Đen/Blue', 1, 459000]], total: 459000, status: 'DELIVERING', pay: 'VNPay', ghn: 'transporting', waybill: 'VN931042771', carrier: 'J&T Express', note: '', at: 38 },
    { id: 'TR-20260608-000136', customer: 'Đỗ Minh Khang', addr: 'Biên Hòa, Đồng Nai', items: [['Loa bluetooth mini IPX7', 'Đen', 2, 320000]], total: 640000, status: 'DELIVERING', pay: 'COD', ghn: 'delivering', waybill: 'VN931042698', carrier: 'GHN', note: '', at: 36 },
    { id: 'TR-20260608-000134', customer: 'Bùi Thu Hằng', addr: 'Ninh Kiều, Cần Thơ', items: [['Webcam Full HD', 'Đen', 1, 540000]], total: 540000, status: 'DELIVERING', pay: 'VNPay', ghn: 'delivery_fail', waybill: 'VN931042544', carrier: 'GHTK', note: '', at: 34 },
    { id: 'TR-20260608-000139', customer: 'Phạm Thu Hà', addr: 'Q7, TP.HCM', items: [['Máy ảnh Mirrorless X-100', 'Kit 15-45', 1, 1245000]], total: 1245000, status: 'DELIVERED', pay: 'VNPay', ghn: 'delivered', waybill: 'VN931042500', carrier: 'GHN', note: '', at: 39 },
    { id: 'TR-20260608-000135', customer: 'Vũ Minh Quân', addr: 'Long Biên, Hà Nội', items: [['Sạc nhanh 65W', 'Trắng', 1, 178000]], total: 178000, status: 'CANCELLED', pay: 'VNPay', ghn: 'cancel', note: '', at: 35 },
  ];
  const WHEN = { 46: '15:05 hôm nay', 45: '14:48 hôm nay', 41: '14:22 hôm nay', 40: '09:10 hôm nay', 38: 'Hôm qua', 36: 'Hôm qua', 34: '2 ngày trước', 39: '2 ngày trước', 35: '3 ngày trước' };
  ORDERS.forEach((o) => { o.when = WHEN[o.at] || ''; });
  const is = (...s) => ORDERS.filter((o) => s.includes(o.status)).length;
  const ORDER_COUNTS = { toConfirm: is('NEW'), toPack: is('CONFIRMED', 'PREPARING'), shipping: is('DELIVERING'), failed: ORDERS.filter((o) => o.ghn === 'delivery_fail').length };
  const ORDER_BADGE = { NEW: ['PENDING', 'Chờ xác nhận'], CONFIRMED: ['PAID', 'Đã xác nhận'], PREPARING: ['PAID', 'Đang chuẩn bị'] };
  const orderBadge = (o) => ORDER_BADGE[o.status] || [ghnStatus(o.ghn).color, ghnStatus(o.ghn).label];

  const NAV = [
    { id: 'overview', name: 'Tổng quan', icon: 'layout-dashboard' },
    { id: 'orders',   name: 'Đơn hàng', icon: 'package', badge: ORDER_COUNTS.toConfirm },
    { id: 'products', name: 'Sản phẩm', icon: 'boxes' },
    { id: 'wallet',   name: 'Ví & Escrow', icon: 'wallet' },
    { id: 'kyc',      name: 'Hồ sơ KYC', icon: 'shield-check' },
    { id: 'catalog',  name: 'Danh mục toàn sàn', icon: 'layers' },
    { id: 'promo',    name: 'Khuyến mãi', icon: 'megaphone' },
    { id: 'chat',     name: 'Chat', icon: 'message-circle', badge: CHAT_UNREAD },
    { id: 'reviews',  name: 'Đánh giá', icon: 'star' },
    { id: 'stats',    name: 'Phân tích', icon: 'chart-column' },
    { id: 'settings', name: 'Cài đặt', icon: 'settings' },
  ];

  window.LZV = { OUTCOMES, COMMISSION_RATE, HEALTH, SHOP, WALLET, LEDGER, REVENUE, PERF, AS_OF, CHAT_UNREAD, ORDERS, NAV, NOTIFICATIONS, ORDER_COUNTS, orderBadge, ghnStatus, BANK, KYC_NAME, downloadCsv };
})();
