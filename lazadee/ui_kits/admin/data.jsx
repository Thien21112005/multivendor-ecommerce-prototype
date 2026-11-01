/* Mock data for the Lazadee Staff/Admin panel. */
(function () {
  const NAV = [
    { id: 'overview', name: 'Tổng quan', icon: 'layout-dashboard', perm: 'dashboard.view' },
    { id: 'kyc', name: 'Duyệt KYC', icon: 'user-check', badge: 3, perm: 'kyc.review' },
    { id: 'refunds', name: 'Trả hàng & Hoàn tiền', icon: 'undo-2', badge: 2, perm: 'refund.arbitrate' },
    { id: 'reviews', name: 'Kiểm duyệt đánh giá', icon: 'star', perm: 'review.moderate' },
    { id: 'withdrawals', name: 'Xử lý rút tiền', icon: 'hand-coins', badge: 4, perm: 'payout.process' },
    { id: 'commission', name: 'Cấu hình hoa hồng', icon: 'percent', perm: 'commission.update' },
    { id: 'ledger', name: 'Sổ cái tài chính', icon: 'scale', perm: 'finance.view' },
    { id: 'audit', name: 'Nhật ký hệ thống', icon: 'file-text', perm: 'audit.view' },
    { id: 'catalog', name: 'Danh mục toàn sàn', icon: 'boxes', perm: 'catalog.manage' },
    { id: 'product_moderation', name: 'Duyệt Sản phẩm', icon: 'clipboard-check', badge: 3, perm: 'catalog.manage' },
    { id: 'vouchers', name: 'Voucher sàn', icon: 'ticket', badge: 2, perm: 'voucher.manage' },
    { id: 'notifications', name: 'Thông báo sàn', icon: 'bell', perm: 'notif.manage' },
    { id: 'rbac', name: 'Phân quyền nhân viên', icon: 'shield-check', perm: 'rbac.manage' },
    { id: 'account', name: 'Tài khoản', icon: 'settings' },
  ];

  // Permission catalog (code → mô tả) used by RBAC editor + nav gating.
  const PERMS = [
    { code: 'dashboard.view', desc: 'Xem trang Tổng quan (Dashboard)' },
    { code: 'notif.manage', desc: 'Quản lý và gửi thông báo toàn sàn' },
    { code: 'kyc.review', desc: 'Duyệt / từ chối hồ sơ KYC người bán' },
    { code: 'refund.arbitrate', desc: 'Xem và phân xử yêu cầu hoàn tiền' },
    { code: 'payout.process', desc: 'Duyệt yêu cầu rút tiền vendor' },
    { code: 'catalog.manage', desc: 'Quản lý danh mục sản phẩm toàn sàn' },
    { code: 'review.moderate', desc: 'Ẩn/hiện đánh giá vi phạm' },
    { code: 'commission.update', desc: 'Thay đổi tỉ lệ hoa hồng' },
    { code: 'voucher.manage', desc: 'Tạo & quản lý voucher sàn' },
    { code: 'rbac.manage', desc: 'Quản lý vai trò & quyền nhân viên' },
    { code: 'finance.view', desc: 'Xem sổ cái & báo cáo tài chính' },
    { code: 'audit.view', desc: 'Xem nhật ký hoạt động hệ thống' },
  ];
  const ALL_PERMS = PERMS.map((p) => p.code);
  const PERM_DESC = PERMS.reduce((m, p) => { m[p.code] = p.desc; return m; }, {});
  // Default permission preset per role.
  const ROLE_PERMS = {
    'Super Admin': ALL_PERMS.slice(),
    'Moderator': ['kyc.review', 'refund.arbitrate', 'review.moderate', 'catalog.manage', 'notif.manage'],
    'Finance Staff': ['dashboard.view', 'payout.process', 'commission.update', 'voucher.manage', 'finance.view'],
    'CS Staff': ['refund.arbitrate', 'review.moderate'],
  };

  const KYC = [
    { id: 'KYC-1042', shop: 'Boutique Sài Gòn', owner: 'Phạm Thị Lan', type: 'Hộ kinh doanh', submitted: '08/06 10:24', status: 'PENDING', docs: ['CCCD mặt trước', 'CCCD mặt sau', 'Giấy phép KD'], risk: 'low' },
    { id: 'KYC-1041', shop: 'GadgetHub VN', owner: 'Trần Quốc Bảo', type: 'Doanh nghiệp', submitted: '08/06 08:51', status: 'PENDING', docs: ['CCCD mặt trước', 'CCCD mặt sau', 'ĐKKD doanh nghiệp', 'Thông báo thuế'], risk: 'medium' },
    { id: 'KYC-1039', shop: 'Mẹ & Bé Happy', owner: 'Nguyễn Thị Hoa', type: 'Cá nhân', submitted: '07/06 19:03', status: 'PENDING', docs: ['CCCD mặt trước', 'CCCD mặt sau'], risk: 'low' },
    { id: 'KYC-1037', shop: 'TravelGear', owner: 'Đỗ Minh Khang', type: 'Hộ kinh doanh', submitted: '07/06 14:18', status: 'VERIFIED', docs: ['CCCD', 'Giấy phép KD'], risk: 'low' },
    { id: 'KYC-1033', shop: 'Cheap Electronics', owner: 'Lý Văn Tèo', type: 'Cá nhân', submitted: '06/06 11:42', status: 'REJECTED', reason: 'Ảnh giấy tờ mờ, không đọc được số CCCD', docs: ['CCCD mặt trước'], risk: 'high' },
  ];

  const REFUNDS = [
    { id: 'RFN-0231', order: 'ORD-2412-0035', buyer: 'Vũ Minh Quân', shop: 'Beauty Box', amount: 178000, reason: 'Hàng không đúng mô tả', state: 'OPEN', opened: '2 giờ trước', media: ['skincare', 'cosmetics'] },
    { id: 'RFN-0230', order: 'ORD-2412-0028', buyer: 'Hoàng Thu Trang', shop: 'Shoe Republic', amount: 320000, reason: 'Giao sai size', state: 'OPEN', opened: '5 giờ trước', media: ['heels'] },
    { id: 'RFN-0229', order: 'ORD-2412-0021', buyer: 'Bùi Đức Anh', shop: 'TechZone Official', amount: 389000, reason: 'Sản phẩm lỗi', state: 'REFUNDED', opened: 'Hôm qua', media: ['headphones'],
      gateway: { name: 'VNPAY', txnId: 'TXN-8847', gatewayRefundId: 'VNP-RF-20260620-001', amount: 389000, status: 'SUCCESS', createdAt: '20/06/2026 14:32:10' } },
  ];

  const REVIEWS = [
    { id: 'RV-9921', product: 'Tai nghe ANC Pro 5', user: 'kh***92', rating: 1, text: 'Sản phẩm rác, shop lừa đảo, đừng ai mua *** số điện thoại 09xx để mua ngoài rẻ hơn', flags: 3, reason: 'Spam / chuyển hướng giao dịch', state: 'PENDING' },
    { id: 'RV-9918', product: 'Serum Vitamin C', user: 'an***le', rating: 2, text: 'Đóng gói tệ, giao chậm 3 ngày so với hẹn.', flags: 1, reason: 'Báo cáo bởi người bán', state: 'PENDING' },
    { id: 'RV-9910', product: 'Giày sneaker Air Run', user: 'min***', rating: 5, text: 'Ngôn từ thô tục ***', flags: 5, reason: 'Ngôn từ phản cảm', state: 'HIDDEN' },
  ];

  const WITHDRAWALS = [
    { id: 'PAYOUT-0012', shop: 'TechZone Official', amount: 5000000, bank: 'Vietcombank ••6712', requested: '08/06 09:00', state: 'PENDING', kyc: 'VERIFIED' },
    { id: 'PAYOUT-0011', shop: 'Beauty Box', amount: 2300000, bank: 'Techcombank ••0098', requested: '08/06 07:30', state: 'PENDING', kyc: 'VERIFIED' },
    { id: 'PAYOUT-0010', shop: 'Home & Living', amount: 850000, bank: 'MB Bank ••4521', requested: '07/06 22:15', state: 'PENDING', kyc: 'VERIFIED' },
    { id: 'PAYOUT-0009', shop: 'TravelGear', amount: 1200000, bank: 'ACB ••7733', requested: '07/06 18:40', state: 'PENDING', kyc: 'PENDING' },
    { id: 'PAYOUT-0008', shop: 'Shoe Republic', amount: 3400000, bank: 'BIDV ••1190', requested: '06/06 16:30', state: 'PAID', kyc: 'VERIFIED' },
  ];

  // Append-only platform ledger (immutable). Every money movement, newest first.
  const LEDGER = [
    { seq: 100482, ts: '08/06/2026 14:22:07', event: 'ESCROW_IN',      ref: 'ORD-2412-0041', debit: '', credit: 778000, account: 'Escrow Liability' },
    { seq: 100481, ts: '08/06/2026 14:22:07', event: 'COMMISSION',     ref: 'ORD-2412-0041', debit: 38900, credit: '', account: 'Platform Revenue' },
    { seq: 100480, ts: '08/06/2026 09:10:55', event: 'ESCROW_IN',      ref: 'ORD-2412-0040', debit: '', credit: 690000, account: 'Escrow Liability' },
    { seq: 100479, ts: '07/06/2026 18:46:12', event: 'ESCROW_RELEASE', ref: 'ORD-2412-0039', debit: 1245000, credit: '', account: 'Escrow Liability' },
    { seq: 100478, ts: '07/06/2026 18:46:12', event: 'PAYOUT_ACCRUE',  ref: 'WALLET·techzone', debit: '', credit: 1245000, account: 'Seller Payable' },
    { seq: 100477, ts: '06/06/2026 16:30:41', event: 'PAYOUT_SETTLE',  ref: 'PAYOUT-0008', debit: 3400000, credit: '', account: 'Seller Payable' },
    { seq: 100476, ts: '06/06/2026 08:15:33', event: 'REFUND',         ref: 'RFN-0229', debit: 389000, credit: '', account: 'Escrow Liability' },
  ];

  const STAFF = [
    { name: 'Đặng Hải Yến', email: 'yen.dh@lazadee.vn', role: 'Super Admin', perms: ['all'], active: true },
    { name: 'Ngô Tấn Phát', email: 'phat.nt@lazadee.vn', role: 'KYC Reviewer', perms: ['kyc.review', 'catalog.read'], active: true },
    { name: 'Trịnh Mỹ Linh', email: 'linh.tm@lazadee.vn', role: 'Finance', perms: ['payout.process', 'ledger.read', 'commission.config'], active: true },
    { name: 'Vương Đại Nghĩa', email: 'nghia.vd@lazadee.vn', role: 'Moderator', perms: ['review.moderate', 'refund.arbitrate'], active: false },
  ];

  const ROLES = ['Super Admin', 'KYC Reviewer', 'Finance', 'Moderator', 'Support'];

  // The signed-in admin (demo). Drives nav gating + role preview.
  const CURRENT_USER = { name: 'Đặng Hải Yến', email: 'yen.dh@lazadee.vn', role: 'Super Admin', perms: ALL_PERMS.slice() };

  // Platform-wide vouchers (sàn-sponsored). type: percent | fixed | freeship.
  const PLATFORM_VOUCHERS = [
    { code: 'LAZADEE50', type: 'percent', value: 50, maxDiscount: 100000, minOrder: 500000, used: 3420, total: 10000, perUser: 1, start: '01/06/2026', end: '30/06/2026', status: 'ACTIVE', scope: 'platform', sponsor: 'Lazadee' },
    { code: 'FREESHIP30', type: 'freeship', value: 0, maxDiscount: 30000, minOrder: 99000, used: 8900, total: 20000, perUser: 3, start: '01/06/2026', end: '31/07/2026', status: 'ACTIVE', scope: 'platform', sponsor: 'Lazadee' },
    { code: 'NEWUSER80', type: 'fixed', value: 80000, maxDiscount: 80000, minOrder: 300000, used: 0, total: 5000, perUser: 1, start: '01/07/2026', end: '31/07/2026', status: 'SCHEDULED', scope: 'platform', sponsor: 'Lazadee' },
    { code: 'TET2026', type: 'percent', value: 20, maxDiscount: 50000, minOrder: 200000, used: 15000, total: 15000, perUser: 2, start: '01/01/2026', end: '15/02/2026', status: 'ENDED', scope: 'platform', sponsor: 'Co-sponsor' },
  ];

  // Append-only audit trail of sensitive actions (immutable). Newest first.
  const AUDIT = [
    { ts: '22/06/2026 09:42:11', actor: 'phat.nt@lazadee.vn', role: 'KYC Reviewer', action: 'KYC_APPROVED', cat: 'kyc', target: 'KYC-1037 · TravelGear', ip: '113.161.40.12', result: 'OK' },
    { ts: '22/06/2026 09:15:03', actor: 'system', role: 'System', action: 'ESCROW_RELEASED', cat: 'finance', target: 'ORD-2412-0039 · 1.245.000₫', ip: '10.0.2.7', result: 'OK' },
    { ts: '22/06/2026 08:51:46', actor: 'linh.tm@lazadee.vn', role: 'Finance', action: 'PAYOUT_APPROVED', cat: 'finance', target: 'PAYOUT-0012 · 5.000.000₫', ip: '113.161.40.88', result: 'OK' },
    { ts: '22/06/2026 08:33:20', actor: 'unknown', role: '—', action: 'LOGIN_FAILED', cat: 'auth', target: 'yen.dh@lazadee.vn (sai mật khẩu ×3)', ip: '45.119.82.201', result: 'DENIED' },
    { ts: '21/06/2026 22:07:55', actor: 'nghia.vd@lazadee.vn', role: 'Moderator', action: 'REVIEW_HIDDEN', cat: 'moderation', target: 'RV-9910 · ngôn từ phản cảm', ip: '171.244.10.5', result: 'OK' },
    { ts: '21/06/2026 18:46:12', actor: 'linh.tm@lazadee.vn', role: 'Finance', action: 'COMMISSION_UPDATED', cat: 'config', target: 'Làm đẹp: 9% → 10%', ip: '113.161.40.88', result: 'OK' },
    { ts: '21/06/2026 16:30:41', actor: 'system', role: 'System', action: 'REFUND_PROCESSED', cat: 'finance', target: 'RFN-0229 · 389.000₫', ip: '10.0.2.7', result: 'OK' },
    { ts: '21/06/2026 14:02:09', actor: 'yen.dh@lazadee.vn', role: 'Super Admin', action: 'RBAC_ROLE_CHANGED', cat: 'security', target: 'phat.nt → KYC Reviewer', ip: '113.161.40.12', result: 'OK' },
    { ts: '20/06/2026 10:30:18', actor: 'yen.dh@lazadee.vn', role: 'Super Admin', action: 'PERMISSION_REVOKED', cat: 'security', target: 'nghia.vd — thu hồi quyền refund.arbitrate', ip: '113.161.40.12', result: 'OK' },
    { ts: '21/06/2026 11:18:33', actor: 'unknown', role: '—', action: 'LOGIN_FAILED', cat: 'auth', target: 'admin@lazadee.vn (tài khoản không tồn tại)', ip: '193.32.126.44', result: 'DENIED' },
    { ts: '21/06/2026 09:00:00', actor: 'yen.dh@lazadee.vn', role: 'Super Admin', action: 'STAFF_INVITED', cat: 'security', target: 'support1@lazadee.vn', ip: '113.161.40.12', result: 'OK' },
    { ts: '20/06/2026 20:44:17', actor: 'phat.nt@lazadee.vn', role: 'KYC Reviewer', action: 'KYC_REJECTED', cat: 'kyc', target: 'KYC-1033 · ảnh giấy tờ mờ', ip: '171.244.10.5', result: 'OK' },
    { ts: '20/06/2026 15:12:50', actor: 'system', role: 'System', action: 'ESCROW_RELEASED', cat: 'finance', target: 'ORD-2412-0033 · 536.000₫', ip: '10.0.2.7', result: 'OK' },
  ];

  const DASHBOARD = {
    gmv: 18426500000, gmvGrowth: 12.6, escrow: 3264800000, liabilities: 1187300000, refunds: 42650000, refundCount: 12, pendingKyc: 3, pendingProducts: 3,
    months: ['06/2026', '05/2026', '04/2026'],
    commission: { '06/2026': 921325000, '05/2026': 843800000, '04/2026': 790450000 },
    voucherCost: { '06/2026': 456800000, '05/2026': 398200000, '04/2026': 372100000 },
    chart: {
      week: [['T2', 412], ['T3', 468], ['T4', 439], ['T5', 521], ['T6', 604], ['T7', 742], ['CN', 688]].map(([d, m]) => ({ d, v: m * 1e6 })),
      month: [['01/06', 412], ['05/06', 455], ['10/06', 498], ['15/06', 622], ['20/06', 580], ['25/06', 690], ['30/06', 745]].map(([d, m]) => ({ d, v: m * 1e6 })),
      year: [8.2, 9.1, 10.4, 11.8, 12.6, 18.4].map((b, i) => ({ d: 'T' + (i + 1), v: b * 1e9 })),
    },
    vendors: [
      { name: 'TechZone Official', cat: 'Điện tử', sold: 18420, rating: 4.9, growth: 42, rev: 512400000 },
      { name: 'Beauty Box', cat: 'Làm đẹp', sold: 26310, rating: 4.9, growth: 38, rev: 318900000 },
      { name: 'Boutique Sài Gòn', cat: 'Thời trang', sold: 15280, rating: 4.8, growth: 31, rev: 204500000 },
      { name: 'Shoe Republic', cat: 'Thời trang', sold: 9640, rating: 4.7, growth: 27, rev: 176200000 },
      { name: 'Home & Living', cat: 'Nhà cửa', sold: 7120, rating: 4.6, growth: 24, rev: 121800000 },
      { name: 'TravelGear', cat: 'Phụ kiện', sold: 4890, rating: 4.5, growth: 21, rev: 84300000 },
      { name: 'GadgetHub VN', cat: 'Điện tử', sold: 3510, rating: 4.6, growth: 18, rev: 76900000 },
    ],
  };

  const MODERATORS = [{ name: 'Lê Minh Tú', active: true }, { name: 'Nguyễn Thảo Vy', active: true }, { name: 'Trần Quốc Đạt', active: false }];
  const MODERATION = [
    { id: 1284, name: 'Đèn bàn LED cảm ứng 3 chế độ sáng', img: 'lamp', vendor: 'Home & Living', state: 'PENDING_APPROVAL', moderator: 'Lê Minh Tú', created: '08/06/2026 15:20', category: 'Nhà cửa > Nội thất > Đèn', brand: 'No Brand', condition: 'Mới', origin: 'Việt Nam', desc: 'Đèn bàn LED cảm ứng, 3 mức sáng, sạc USB-C, pin 8 giờ.', weight: 450, size: '18 × 18 × 40 cm', shipsFrom: 'Hà Nội', payer: 'Người mua', docs: ['hoa-don-nhap-hang.pdf'], skus: [['LAMP-WHT', 'Trắng', 149000, 60], ['LAMP-BLK', 'Đen', 149000, 42]] },
    { id: 1283, name: 'Nước hoa mini chính hãng 10ml', img: 'perfume', vendor: 'Beauty Box', state: 'FLAGGED', moderator: 'Nguyễn Thảo Vy', aiReason: 'Ảnh sản phẩm trùng logo thương hiệu lớn nhưng giấy ủy quyền chưa khớp tên shop. Cần người kiểm tra.', created: '08/06/2026 11:05', category: 'Làm đẹp > Nước hoa', brand: 'Eau de Parfum', condition: 'Mới', origin: 'Pháp', desc: 'Nước hoa mini 10ml, hương hoa cỏ, lưu hương 6 giờ.', weight: 80, size: '4 × 4 × 10 cm', shipsFrom: 'TP. HCM', payer: 'Shop', docs: ['giay-uy-quyen.pdf', 'phieu-cong-bo-my-pham.pdf'], skus: [['PF-10', '10ml', 129000, 300]] },
    { id: 1279, name: 'Tai nghe Bluetooth ANC Pro 5 (cập nhật ảnh)', img: 'headphones', vendor: 'TechZone Official', state: 'REQUEUED', moderator: 'Lê Minh Tú', created: '07/06/2026 19:12', category: 'Điện tử > Tai nghe & Loa > Tai nghe Bluetooth', brand: 'Sony', condition: 'Mới', origin: 'Trung Quốc', desc: 'Shop đổi ảnh và tên sản phẩm nên cần duyệt lại. Giá và tồn kho không đổi.', weight: 250, size: '20 × 18 × 8 cm', shipsFrom: 'TP. HCM', payer: 'Người mua', docs: ['ce-certificate.pdf'], skus: [['ANC5-BLK', 'Đen', 389000, 38], ['ANC5-WHT', 'Trắng', 389000, 12]] },
    { id: 1270, name: 'Bàn phím cơ RGB switch blue', img: 'keyboard', vendor: 'TechZone Official', state: 'PUBLISHED', moderator: 'Lê Minh Tú', created: '05/06/2026 09:30', category: 'Điện tử > Máy tính & Laptop > Bàn phím', brand: 'Logitech', condition: 'Mới', origin: 'Trung Quốc', desc: 'Bàn phím cơ 87 phím, switch blue, LED RGB.', weight: 900, size: '36 × 14 × 4 cm', shipsFrom: 'TP. HCM', payer: 'Người mua', docs: ['hoa-don-nhap-hang.pdf'], skus: [['KB-BLUE', 'Blue switch', 459000, 54]] },
    { id: 1266, name: 'Sạc nhanh 65W không rõ nguồn gốc', img: 'phone', vendor: 'Cheap Electronics', state: 'REJECTED', moderator: null, aiReason: 'Không có giấy tờ chứng nhận hợp quy cho thiết bị sạc; ảnh có dấu hiệu lấy từ website khác.', created: '04/06/2026 14:45', category: 'Điện tử > Điện thoại & Phụ kiện > Sạc & Cáp', brand: 'No Brand', condition: 'Mới', origin: 'Đang cập nhật', desc: 'Sạc nhanh 65W GaN.', weight: 120, size: '6 × 6 × 3 cm', shipsFrom: 'Bình Dương', payer: 'Người mua', docs: [], skus: [['CHG-65', 'Trắng', 89000, 500]] },
  ];

  const PLATFORM_NOTIFS = [
    { id: 'PN-1048', title: 'Siêu sale 12.12 giảm tới 50%', content: 'Chương trình Siêu sale 12.12 bắt đầu từ 00:00. Lưu voucher ngay để không bỏ lỡ ưu đãi lớn nhất năm.', target: 'BUYER', by: 'Admin (1)', at: '08/06/2026 09:00', reads: 48210, reach: 120400, image: '../../assets/img/banner-sale.jpg' },
    { id: 'PN-1047', title: 'Nâng cấp hệ thống 02:00 – 04:00', content: 'Một số dịch vụ có thể gián đoạn trong khung giờ bảo trì. Đơn hàng và ví Escrow không bị ảnh hưởng.', target: 'ALL', by: 'Admin (1)', at: '07/06/2026 09:00', reads: 73560, reach: 248300, image: '' },
    { id: 'PN-1046', title: 'Cập nhật biểu phí hoa hồng từ 01/07', content: 'Phí hoa hồng ngành Làm đẹp điều chỉnh từ 6% lên 7%. Xem chi tiết tại Bảng hoa hồng & Phí dịch vụ.', target: 'SELLER', by: 'Admin (2)', at: '05/06/2026 16:30', reads: 2140, reach: 3120, image: '' },
    { id: 'PN-1045', title: 'Đăng ký Flash Sale khung giờ vàng', content: 'Người bán đăng ký tối đa 20 sản phẩm tham gia Flash Sale trước ngày 10/06.', target: 'SELLER', by: 'Admin (2)', at: '03/06/2026 10:00', reads: 1860, reach: 3120, image: '../../assets/img/banner-tech.jpg' },
    { id: 'PN-1044', title: 'Điểm danh nhận Xu mỗi ngày', content: 'Điểm danh 7 ngày liên tiếp để nhận tới 700 Lazadee Xu.', target: 'BUYER', by: 'Admin (1)', at: '01/06/2026 08:00', reads: 35420, reach: 118900, image: '' },
    { id: 'PN-1043', title: 'Chính sách đổi trả mới', content: 'Lazadee cập nhật chính sách đổi trả và hoàn tiền áp dụng cho toàn sàn.', target: 'ALL', by: 'Admin (1)', at: '28/05/2026 14:00', reads: 61200, reach: 240100, image: '' },
  ];

  const NOTIFS = [
    { id: 'an1', title: 'Hồ sơ KYC mới cần duyệt', body: 'Boutique Sài Gòn vừa nộp hồ sơ KYC (Hộ kinh doanh).', date: '08/06/2026 10:24', unread: true, icon: 'user-check', nav: 'kyc' },
    { id: 'an2', title: 'Sản phẩm AI nghi ngờ', body: '"Nước hoa mini chính hãng 10ml" cần người kiểm tra giấy ủy quyền.', date: '08/06/2026 11:05', unread: true, icon: 'triangle-alert', nav: 'product_moderation' },
    { id: 'an3', title: 'Yêu cầu rút tiền mới', body: 'TechZone Official yêu cầu rút 5.000.000₫.', date: '07/06/2026 16:40', unread: false, icon: 'hand-coins', nav: 'withdrawals' },
  ];

  window.LZA = { DASHBOARD, MODERATION, MODERATORS, PLATFORM_NOTIFS, NOTIFS, NAV, KYC, REFUNDS, REVIEWS, WITHDRAWALS, LEDGER, STAFF, ROLES, AUDIT, PERMS, ALL_PERMS, PERM_DESC, ROLE_PERMS, CURRENT_USER, PLATFORM_VOUCHERS };
})();
