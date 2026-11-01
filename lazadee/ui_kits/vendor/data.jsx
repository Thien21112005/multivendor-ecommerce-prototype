/* Mock data for the Lazadee vendor dashboard (escrow wallet focus). */
(function () {
  const SHOP = { name: 'TechZone Official', kyc: 'VERIFIED', mall: true, rating: 4.9, commissionRate: 0.05 };

  const WALLET = {
    available: 12450000,
    held: 8230000,        // in escrow, not yet released
    monthRevenue: 45800000,
    monthGrowth: 18.4,
    pendingPayout: 5000000,
  };

  // Append-only ledger (newest first). gross − commission = net.
  const LEDGER = [
    { date: '08/06/2026 14:22', ref: 'ORD-2412-0041', type: 'SALE',       label: 'Bán hàng — vào escrow',        gross: 778000,  commission: 38900,  net: 739100,  bucket: 'HELD' },
    { date: '08/06/2026 09:10', ref: 'ORD-2412-0040', type: 'SALE',       label: 'Bán hàng — vào escrow',        gross: 690000,  commission: 34500,  net: 655500,  bucket: 'HELD' },
    { date: '07/06/2026 18:46', ref: 'ORD-2412-0039', type: 'RELEASE',    label: 'Giải ngân — đơn hoàn tất',     gross: 1245000, commission: 0,      net: 1245000, bucket: 'AVAILABLE' },
    { date: '07/06/2026 11:03', ref: 'ORD-2412-0037', type: 'RELEASE',    label: 'Giải ngân — đơn hoàn tất',     gross: 459000,  commission: 0,      net: 459000,  bucket: 'AVAILABLE' },
    { date: '06/06/2026 16:30', ref: 'PAYOUT-0008',   type: 'PAYOUT',     label: 'Rút tiền về ngân hàng',        gross: -5000000,commission: 0,      net: -5000000,bucket: 'PAYOUT' },
    { date: '06/06/2026 08:15', ref: 'ORD-2412-0035', type: 'REFUND',     label: 'Hoàn tiền — khách trả hàng',   gross: -178000, commission: -8900,  net: -169100, bucket: 'REFUND' },
    { date: '05/06/2026 20:01', ref: 'ORD-2412-0034', type: 'SALE',       label: 'Bán hàng — vào escrow',        gross: 12990000,commission: 649500, net: 12340500,bucket: 'HELD' },
    { date: '05/06/2026 13:27', ref: 'ORD-2412-0031', type: 'RELEASE',    label: 'Giải ngân — đơn hoàn tất',     gross: 320000,  commission: 0,      net: 320000,  bucket: 'AVAILABLE' },
  ];

  const SALES_7D = [
    { d: 'T2', v: 4.2 }, { d: 'T3', v: 5.8 }, { d: 'T4', v: 5.1 }, { d: 'T5', v: 7.4 },
    { d: 'T6', v: 9.2 }, { d: 'T7', v: 11.6 }, { d: 'CN', v: 8.9 },
  ];

  const ORDERS = [
    { id: 'ORD-2412-0041', customer: 'Trần T. Mai',  items: 2, total: 778000,   status: 'PAID',      when: '14:22 hôm nay' },
    { id: 'ORD-2412-0040', customer: 'Nguyễn V. An', items: 1, total: 690000,   status: 'PAID',      when: '09:10 hôm nay' },
    { id: 'ORD-2412-0038', customer: 'Lê H. Phúc',   items: 3, total: 1459000,  status: 'SHIPPED',   when: 'Hôm qua' },
    { id: 'ORD-2412-0039', customer: 'Phạm T. Hà',   items: 1, total: 1245000,  status: 'COMPLETED', when: '2 ngày trước' },
    { id: 'ORD-2412-0035', customer: 'Vũ M. Quân',   items: 1, total: 178000,   status: 'CANCELLED', when: '3 ngày trước' },
  ];

  const NAV = [
    { id: 'overview', name: 'Tổng quan', icon: 'layout-dashboard' },
    { id: 'orders',   name: 'Đơn hàng', icon: 'package', badge: 2 },
    { id: 'products', name: 'Sản phẩm', icon: 'boxes' },
    { id: 'wallet',   name: 'Ví & Escrow', icon: 'wallet' },
    { id: 'kyc',      name: 'Hồ sơ KYC', icon: 'shield-check' },
    { id: 'promo',    name: 'Khuyến mãi', icon: 'megaphone' },
    { id: 'chat',     name: 'Chat', icon: 'message-circle', badge: 5 },
    { id: 'reviews',  name: 'Đánh giá', icon: 'star' },
    { id: 'stats',    name: 'Phân tích', icon: 'chart-column' },
    { id: 'settings', name: 'Cài đặt', icon: 'settings' },
  ];

  window.LZV = { SHOP, WALLET, LEDGER, SALES_7D, ORDERS, NAV };
})();
