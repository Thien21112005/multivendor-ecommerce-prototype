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

  const SALES = {
    week: [{ d: 'T2', v: 4.2 }, { d: 'T3', v: 5.8 }, { d: 'T4', v: 5.1 }, { d: 'T5', v: 7.4 }, { d: 'T6', v: 9.2 }, { d: 'T7', v: 11.6 }, { d: 'CN', v: 8.9 }],
    month: [{ d: 'T1', v: 28.4 }, { d: 'T2', v: 34.1 }, { d: 'T3', v: 31.7 }, { d: 'T4', v: 45.8 }],
    year: [3, 4, 3.5, 5, 4.6, 6, 7.2, 6.8, 8, 9.4, 12, 15].map((v, i) => ({ d: 'T' + (i + 1), v: v * 10 })),
  };
  const PRODUCT_COUNTS = { published: 38, draft: 6, hidden: 3 };
  const ORDER_COUNTS = { toConfirm: 2, toPack: 4, shipping: 7, returned: 1 };

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
    { id: 'vn2', title: 'Có đơn hàng mới cần chuẩn bị', body: 'Đơn ORD-2412-0041 vừa được thanh toán. Hãy chuẩn bị hàng trong 24 giờ.', date: '08/06/2026 14:22', unread: true, icon: 'package' },
    { id: 'vn3', title: 'Lazadee nâng cấp hệ thống 02:00 – 04:00', body: 'Thông báo toàn sàn: Seller Center có thể gián đoạn trong khung giờ bảo trì. Đơn hàng và ví Escrow không bị ảnh hưởng.', date: '07/06/2026 09:00', unread: true, icon: 'lazadee' },
    { id: 'vn4', title: 'Sản phẩm bị từ chối', body: '"Camera Mirrorless X-100" thiếu giấy tờ chứng thực. Vui lòng bổ sung và gửi duyệt lại.', date: '05/06/2026 11:40', unread: false, icon: 'triangle-alert' },
  ];

  const SALES_7D = [
    { d: 'T2', v: 4.2 }, { d: 'T3', v: 5.8 }, { d: 'T4', v: 5.1 }, { d: 'T5', v: 7.4 },
    { d: 'T6', v: 9.2 }, { d: 'T7', v: 11.6 }, { d: 'CN', v: 8.9 },
  ];

  const ORDERS = [
    { id: 'ORD-2412-0041', customer: 'Trần T. Mai',  items: 2, total: 778000,   status: 'PAID',      ghn: 'ready_to_pick', when: '14:22 hôm nay' },
    { id: 'ORD-2412-0040', customer: 'Nguyễn V. An', items: 1, total: 690000,   status: 'PAID',      ghn: 'ready_to_pick', when: '09:10 hôm nay' },
    { id: 'ORD-2412-0038', customer: 'Lê H. Phúc',   items: 3, total: 1459000,  status: 'SHIPPED',   ghn: 'transporting',  when: 'Hôm qua' },
    { id: 'ORD-2412-0039', customer: 'Phạm T. Hà',   items: 1, total: 1245000,  status: 'COMPLETED', ghn: 'delivered',     when: '2 ngày trước' },
    { id: 'ORD-2412-0035', customer: 'Vũ M. Quân',   items: 1, total: 178000,   status: 'CANCELLED', ghn: 'cancel',        when: '3 ngày trước' },
  ];

  const NAV = [
    { id: 'overview', name: 'Tổng quan', icon: 'layout-dashboard' },
    { id: 'orders',   name: 'Đơn hàng', icon: 'package', badge: 2 },
    { id: 'products', name: 'Sản phẩm', icon: 'boxes' },
    { id: 'wallet',   name: 'Ví & Escrow', icon: 'wallet' },
    { id: 'kyc',      name: 'Hồ sơ KYC', icon: 'shield-check' },
    { id: 'catalog',  name: 'Danh mục toàn sàn', icon: 'layers' },
    { id: 'promo',    name: 'Khuyến mãi', icon: 'megaphone' },
    { id: 'chat',     name: 'Chat', icon: 'message-circle', badge: 5 },
    { id: 'reviews',  name: 'Đánh giá', icon: 'star' },
    { id: 'stats',    name: 'Phân tích', icon: 'chart-column' },
    { id: 'settings', name: 'Cài đặt', icon: 'settings' },
  ];

  window.LZV = { SHOP, WALLET, LEDGER, SALES_7D, SALES, ORDERS, NAV, NOTIFICATIONS, PRODUCT_COUNTS, ORDER_COUNTS, ghnStatus };
})();
