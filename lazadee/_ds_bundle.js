/* @ds-bundle: {"format":3,"namespace":"LazadeeDesignSystem_0477b7","components":[{"name":"PriceVND","sourcePath":"components/commerce/PriceVND.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"QuantityStepper","sourcePath":"components/commerce/QuantityStepper.jsx"},{"name":"Rating","sourcePath":"components/commerce/Rating.jsx"},{"name":"VendorChip","sourcePath":"components/commerce/VendorChip.jsx"},{"name":"VoucherTag","sourcePath":"components/commerce/VoucherTag.jsx"},{"name":"Money","sourcePath":"components/commerce/format.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"ICONS","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Modal","sourcePath":"components/core/Modal.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/commerce/PriceVND.jsx":"03b74cf21b8a","components/commerce/ProductCard.jsx":"fa741dc604be","components/commerce/QuantityStepper.jsx":"78c93924f327","components/commerce/Rating.jsx":"1cf9ec3d9d74","components/commerce/VendorChip.jsx":"3ca9b868c9a9","components/commerce/VoucherTag.jsx":"b757d95e66a0","components/commerce/format.jsx":"af1bb29dc9ac","components/core/Avatar.jsx":"aab12a37587a","components/core/Icon.jsx":"db0d839983ec","components/core/Modal.jsx":"240115ab760e","components/feedback/Badge.jsx":"9eb94bf6279b","components/feedback/StatusBadge.jsx":"3fc21296986b","components/feedback/Tag.jsx":"1cfdb4064774","components/forms/Button.jsx":"dd2ba31ca141","components/forms/Checkbox.jsx":"f66906ca5161","components/forms/IconButton.jsx":"3672fd1e6aa4","components/forms/Input.jsx":"b58f6e5af8aa","components/forms/Radio.jsx":"656221859c8d","components/forms/Select.jsx":"263d3df9de24","components/forms/Switch.jsx":"df6e84a35016","components/navigation/Tabs.jsx":"1d519d6a705e","ui_kits/admin/AdminShell.jsx":"64b722a1f1ee","ui_kits/admin/Disputes.jsx":"fc9c000ea292","ui_kits/admin/Finance.jsx":"2781c3558c6b","ui_kits/admin/KYCReview.jsx":"f4d9a566d563","ui_kits/admin/data.jsx":"dbbe7eb05ba8","ui_kits/storefront/Cart.jsx":"28956a0be9fc","ui_kits/storefront/Checkout.jsx":"9300cbcdff15","ui_kits/storefront/Header.jsx":"c1c2fec9783d","ui_kits/storefront/Home.jsx":"9d68f69527e9","ui_kits/storefront/ProductDetail.jsx":"d093ffad7cd0","ui_kits/storefront/data.jsx":"b22344294253","ui_kits/vendor/Chat.jsx":"3cae52db0a46","ui_kits/vendor/Fulfillment.jsx":"08e0d6544317","ui_kits/vendor/Onboarding.jsx":"5a9902a0cfb4","ui_kits/vendor/Overview.jsx":"fa5a371f92a7","ui_kits/vendor/Products.jsx":"2d62056f42ab","ui_kits/vendor/VendorShell.jsx":"a813ceaa472f","ui_kits/vendor/Wallet.jsx":"8e6e8e215296","ui_kits/vendor/data.jsx":"4abdf33d28df"},"inlinedExternals":[],"unexposedExports":[{"name":"formatVND","sourcePath":"components/commerce/format.jsx"},{"name":"partsVND","sourcePath":"components/commerce/format.jsx"}]} */

(() => {

const __ds_ns = (window.LazadeeDesignSystem_0477b7 = window.LazadeeDesignSystem_0477b7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/VoucherTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KIND_LABEL = {
  platform: 'Lazadee',
  shop: 'Shop',
  freeship: 'Freeship'
};

/** Perforated voucher ticket. One of each kind (platform/shop/freeship) is
 *  stackable at checkout. `amount` is pre-formatted display text. */
function VoucherTag({
  kind = 'platform',
  amount,
  label,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `lz-voucher lz-voucher--${kind}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "lz-voucher__amt"
  }, amount), /*#__PURE__*/React.createElement("span", {
    className: "lz-voucher__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-voucher__kind"
  }, KIND_LABEL[kind] || kind), /*#__PURE__*/React.createElement("span", null, label)));
}
Object.assign(__ds_scope, { VoucherTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/VoucherTag.jsx", error: String((e && e.message) || e) }); }

// components/commerce/format.jsx
try { (() => {
/* VND money helpers. vi-VN uses '.' as the thousands separator and a trailing ₫.
   formatVND(150000) -> "150.000₫" */
function formatVND(amount, {
  symbol = true,
  locale = 'vi-VN'
} = {}) {
  const n = Math.round(Number(amount) || 0);
  const grouped = new Intl.NumberFormat(locale === 'en-US' ? 'en-US' : 'vi-VN').format(n);
  return symbol ? grouped + '\u20AB' : grouped;
}

/* Split into [grouped, symbol] so a component can style the ₫ separately. */
function partsVND(amount, {
  locale = 'vi-VN'
} = {}) {
  return [formatVND(amount, {
    symbol: false,
    locale
  }), '\u20AB'];
}

/* Capitalized so the compiler exposes it on window.<Namespace>.
   (lowercase exports are not surfaced.) Use Money.format / Money.parts. */
const Money = {
  format: formatVND,
  parts: partsVND
};
Object.assign(__ds_scope, { formatVND, partsVND, Money });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/format.jsx", error: String((e && e.message) || e) }); }

// components/commerce/PriceVND.jsx
try { (() => {
/** VND price with optional strikethrough original. ₫ is rendered superscript. */
function PriceVND({
  amount,
  original,
  size = 'md',
  className = '',
  locale = 'vi-VN'
}) {
  const [now, sym] = __ds_scope.partsVND(amount, {
    locale
  });
  const [was] = original != null ? __ds_scope.partsVND(original, {
    locale
  }) : [null];
  return /*#__PURE__*/React.createElement("span", {
    className: `lz-price lz-price--${size} ${className}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-price__now"
  }, now, /*#__PURE__*/React.createElement("span", {
    className: "sym"
  }, sym)), was != null && /*#__PURE__*/React.createElement("span", {
    className: "lz-price__was"
  }, was, sym));
}
Object.assign(__ds_scope, { PriceVND });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/PriceVND.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
/** Round avatar with image or initials fallback; optional online dot. */
function Avatar({
  src,
  name = '?',
  size = 36,
  online,
  square
}) {
  const initials = name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  const palette = ['#F5511E', '#2563EB', '#6C2BD9', '#14B86E', '#E0142B', '#D98A0B'];
  const bg = palette[(name.charCodeAt(0) || 0) % palette.length];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: square ? 'var(--radius-md)' : '50%',
      background: src ? 'var(--gray-200)' : bg,
      color: '#fff',
      overflow: 'hidden',
      display: 'grid',
      placeItems: 'center',
      font: '700 ' + Math.round(size * 0.4) + 'px var(--font-sans)'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials), online != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: size * 0.28,
      height: size * 0.28,
      borderRadius: '50%',
      background: online ? 'var(--mint-500)' : 'var(--gray-400)',
      boxShadow: '0 0 0 2px #fff'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lazadee icon set — Lucide geometry (ISC), vendored inline so the component
   is self-contained and recolors via currentColor. 24x24 grid, 2px stroke.
   Source SVGs also live in assets/icons/. */
const ICONS = {
  "search": "<path d=\"m21 21-4.34-4.34\" /><circle cx=\"11\" cy=\"11\" r=\"8\" />",
  "shopping-cart": "<circle cx=\"8\" cy=\"21\" r=\"1\" /><circle cx=\"19\" cy=\"21\" r=\"1\" /><path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\" />",
  "shopping-bag": "<path d=\"M16 10a4 4 0 0 1-8 0\" /><path d=\"M3.103 6.034h17.794\" /><path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\" />",
  "heart": "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\" />",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "menu": "<path d=\"M4 5h16\" /><path d=\"M4 12h16\" /><path d=\"M4 19h16\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-up": "<path d=\"m18 15-6-6-6 6\" />",
  "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
  "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "check-check": "<path d=\"M18 6 7 17l-5-5\" /><path d=\"m22 10-7.5 7.5L13 16\" />",
  "filter": "<path d=\"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z\" />",
  "sliders-horizontal": "<path d=\"M10 5H3\" /><path d=\"M12 19H3\" /><path d=\"M14 3v4\" /><path d=\"M16 17v4\" /><path d=\"M21 12h-9\" /><path d=\"M21 19h-5\" /><path d=\"M21 5h-7\" /><path d=\"M8 10v4\" /><path d=\"M8 12H3\" />",
  "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
  "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />",
  "bell": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
  "message-circle": "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\" />",
  "message-square": "<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\" />",
  "store": "<path d=\"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5\" /><path d=\"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244\" /><path d=\"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05\" />",
  "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" /><path d=\"M12 22V12\" /><polyline points=\"3.29 7 12 12 20.71 7\" /><path d=\"m7.5 4.27 9 5.15\" />",
  "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\" /><path d=\"M15 18H9\" /><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\" /><circle cx=\"17\" cy=\"18\" r=\"2\" /><circle cx=\"7\" cy=\"18\" r=\"2\" />",
  "wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" /><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />",
  "badge-check": "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\" /><path d=\"m9 12 2 2 4-4\" />",
  "upload": "<path d=\"M12 3v12\" /><path d=\"m17 8-5-5-5 5\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" />",
  "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /><circle cx=\"9\" cy=\"9\" r=\"2\" /><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />",
  "trash-2": "<path d=\"M10 11v6\" /><path d=\"M14 11v6\" /><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\" /><path d=\"M3 6h18\" /><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /><path d=\"m15 5 4 4\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "eye-off": "<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\" /><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\" /><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\" /><path d=\"m2 2 20 20\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 6v6l4 2\" />",
  "tag": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "ticket": "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /><path d=\"M13 5v2\" /><path d=\"M13 17v2\" /><path d=\"M13 11v2\" />",
  "circle-alert": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" /><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
  "credit-card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\" /><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\" />",
  "banknote": "<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\" /><circle cx=\"12\" cy=\"12\" r=\"2\" /><path d=\"M6 12h.01M18 12h.01\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "log-out": "<path d=\"m16 17 5-5-5-5\" /><path d=\"M21 12H9\" /><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" />",
  "settings": "<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />",
  "list": "<path d=\"M3 5h.01\" /><path d=\"M3 12h.01\" /><path d=\"M3 19h.01\" /><path d=\"M8 5h13\" /><path d=\"M8 12h13\" /><path d=\"M8 19h13\" />",
  "camera": "<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\" /><circle cx=\"12\" cy=\"13\" r=\"3\" />",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /><path d=\"m21.854 2.147-10.94 10.939\" />",
  "paperclip": "<path d=\"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551\" />",
  "thumbs-up": "<path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\" /><path d=\"M7 10v12\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "printer": "<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\" /><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\" /><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\" />",
  "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /><path d=\"M21 3v5h-5\" /><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /><path d=\"M8 16H3v5\" />",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
  "gift": "<path d=\"M12 7v14\" /><path d=\"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\" /><path d=\"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5\" /><rect x=\"3\" y=\"7\" width=\"18\" height=\"4\" rx=\"1\" />",
  "percent": "<line x1=\"19\" x2=\"5\" y1=\"5\" y2=\"19\" /><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\" /><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\" />",
  "flame": "<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\" />",
  "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />",
  "layout-dashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\" /><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" />",
  "chart-column": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M18 17V9\" /><path d=\"M13 17V5\" /><path d=\"M8 17v-3\" />",
  "receipt": "<path d=\"M12 17V7\" /><path d=\"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8\" /><path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\" />",
  "file-text": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\" /><path d=\"M14 2v5a1 1 0 0 0 1 1h5\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
  "scale": "<path d=\"M12 3v18\" /><path d=\"m19 8 3 8a5 5 0 0 1-6 0zV7\" /><path d=\"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1\" /><path d=\"m5 8 3 8a5 5 0 0 1-6 0zV7\" /><path d=\"M7 21h10\" />",
  "plus-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M8 12h8\" /><path d=\"M12 8v8\" />",
  "minus-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M8 12h8\" />",
  "phone": "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\" />",
  "mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" /><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />",
  "calendar": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  "chevron-right-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m10 8 4 4-4 4\" />",
  "star-half": "<path d=\"M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2\" />",
  "circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /><path d=\"M12 17h.01\" />",
  "external-link": "<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
  "more-vertical": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"12\" cy=\"5\" r=\"1\" /><circle cx=\"12\" cy=\"19\" r=\"1\" />",
  "grip-vertical": "<circle cx=\"9\" cy=\"12\" r=\"1\" /><circle cx=\"9\" cy=\"5\" r=\"1\" /><circle cx=\"9\" cy=\"19\" r=\"1\" /><circle cx=\"15\" cy=\"12\" r=\"1\" /><circle cx=\"15\" cy=\"5\" r=\"1\" /><circle cx=\"15\" cy=\"19\" r=\"1\" />",
  "arrow-up-right": "<path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" />",
  "wallet-cards": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2\" /><path d=\"M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21\" />",
  "hand-coins": "<path d=\"M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17\" /><path d=\"m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9\" /><path d=\"m2 16 6 6\" /><circle cx=\"16\" cy=\"9\" r=\"2.9\" /><circle cx=\"6\" cy=\"5\" r=\"3\" />",
  "megaphone": "<path d=\"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z\" /><path d=\"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14\" /><path d=\"M8 6v8\" />",
  "boxes": "<path d=\"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z\" /><path d=\"m7 16.5-4.74-2.85\" /><path d=\"m7 16.5 5-3\" /><path d=\"M7 16.5v5.17\" /><path d=\"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z\" /><path d=\"m17 16.5-5-3\" /><path d=\"m17 16.5 4.74-2.85\" /><path d=\"M17 16.5v5.17\" /><path d=\"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z\" /><path d=\"M12 8 7.26 5.15\" /><path d=\"m12 8 4.74-2.85\" /><path d=\"M12 13.5V8\" />",
  "clipboard-check": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /><path d=\"m9 14 2 2 4-4\" />",
  "user-check": "<path d=\"m16 11 2 2 4-4\" /><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><circle cx=\"9\" cy=\"7\" r=\"4\" />",
  "ban": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M4.929 4.929 19.07 19.071\" />",
  "undo-2": "<path d=\"M9 14 4 9l5-5\" /><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\" />",
  "download": "<path d=\"M12 15V3\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><path d=\"m7 10 5 5 5-5\" />"
};
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
  style,
  title,
  ...rest
}) {
  const inner = ICONS[name];
  if (!inner) {
    if (typeof console !== 'undefined') console.warn('Lazadee Icon: unknown name', name);
    return null;
  }
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      display: 'block',
      flex: 'none',
      ...style
    },
    "aria-hidden": title ? undefined : true,
    role: title ? 'img' : undefined
  }, rest, {
    dangerouslySetInnerHTML: {
      __html: (title ? '<title>' + title + '</title>' : '') + inner
    }
  }));
}
Object.assign(__ds_scope, { ICONS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/commerce/QuantityStepper.jsx
try { (() => {
/** Quantity selector with min/max clamping (e.g. stock cap). */
function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange = () => {}
}) {
  const set = v => onChange(Math.max(min, Math.min(max, v)));
  return /*#__PURE__*/React.createElement("div", {
    className: "lz-qty"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Gi\u1EA3m",
    disabled: value <= min,
    onClick: () => set(value - 1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    inputMode: "numeric",
    value: value,
    onChange: e => set(parseInt(e.target.value.replace(/\D/g, ''), 10) || min),
    "aria-label": "S\u1ED1 l\u01B0\u1EE3ng"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "T\u0103ng",
    disabled: value >= max,
    onClick: () => set(value + 1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  })));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/commerce/Rating.jsx
try { (() => {
/** Star rating. Shows numeric score and optional sold/review count. */
function Rating({
  value = 0,
  count,
  sold,
  showNumber = true,
  size = 14
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return /*#__PURE__*/React.createElement("span", {
    className: "lz-rating"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-rating__stars"
  }, [0, 1, 2, 3, 4].map(i => {
    const filled = i < full;
    const isHalf = i === full && half;
    return /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      key: i,
      name: isHalf ? 'star-half' : 'star',
      size: size,
      strokeWidth: 1.5,
      style: {
        fill: filled || isHalf ? 'var(--gold-500)' : 'var(--gray-200)',
        stroke: 'none'
      }
    });
  })), showNumber && /*#__PURE__*/React.createElement("span", {
    className: "lz-rating__num"
  }, value.toFixed(1)), count != null && /*#__PURE__*/React.createElement("span", {
    className: "lz-rating__count"
  }, "(", count, ")"), sold != null && /*#__PURE__*/React.createElement("span", {
    className: "lz-rating__count"
  }, "\xB7 \u0110\xE3 b\xE1n ", sold));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/Rating.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Storefront product card: image, flags, title, price, rating, sold, location. */
function ProductCard({
  title,
  image,
  price,
  original,
  discountPct,
  rating,
  sold,
  location,
  flash,
  mall,
  freeship,
  onClick,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("a", _extends({
    className: "lz-pcard",
    onClick: onClick
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "lz-pcard__media"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-subtle)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "image",
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "lz-pcard__flags"
  }, flash && /*#__PURE__*/React.createElement("span", {
    className: "lz-badge lz-badge--flash",
    style: {
      borderRadius: 0,
      padding: '3px 7px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "zap",
    size: 11,
    strokeWidth: 2.6
  }), "FLASH SALE"), mall && /*#__PURE__*/React.createElement("span", {
    className: "lz-badge lz-badge--solid",
    style: {
      borderRadius: 0,
      padding: '3px 7px'
    }
  }, "MALL")), discountPct != null && /*#__PURE__*/React.createElement("div", {
    className: "lz-pcard__disc"
  }, /*#__PURE__*/React.createElement("b", null, "-", discountPct, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "lz-pcard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-pcard__title"
  }, title), /*#__PURE__*/React.createElement(__ds_scope.PriceVND, {
    amount: price,
    original: original,
    size: "sm"
  }), freeship && /*#__PURE__*/React.createElement("span", {
    className: "lz-badge lz-badge--mint",
    style: {
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "truck",
    size: 12
  }), "Freeship"), /*#__PURE__*/React.createElement("div", {
    className: "lz-pcard__foot"
  }, rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    sold: sold,
    size: 12,
    showNumber: true
  }), location && /*#__PURE__*/React.createElement("span", {
    className: "lz-pcard__loc"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 11
  }), location))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/VendorChip.jsx
try { (() => {
/** Vendor identity: logo (or initial), name with optional Mall/verified badge, meta line. */
function VendorChip({
  name,
  logo,
  initial,
  mall,
  online,
  meta,
  size = 'md'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "lz-vendor"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-vendor__logo",
    style: size === 'lg' ? {
      width: 40,
      height: 40
    } : undefined
  }, logo ? /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 'inherit'
    }
  }) : initial || (name || '?')[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-vendor__name"
  }, name, mall && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "badge-check",
    size: 14,
    style: {
      color: 'var(--color-primary)'
    }
  })), meta && /*#__PURE__*/React.createElement("span", {
    className: "lz-vendor__meta"
  }, online && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--mint-600)'
    }
  }, "\u25CF Online \xB7 "), meta)));
}
Object.assign(__ds_scope, { VendorChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/VendorChip.jsx", error: String((e && e.message) || e) }); }

// components/core/Modal.jsx
try { (() => {
/** Centered modal dialog with scrim. Render conditionally on `open`. */
function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 460
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-overlay)',
      zIndex: 900,
      display: 'grid',
      placeItems: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      maxHeight: '88vh',
      overflow: 'auto',
      background: '#fff',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) var(--text-lg) var(--font-sans)',
      color: 'var(--text-strong)',
      flex: 1
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "\u0110\xF3ng",
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      flex: 1
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '14px 20px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small label for counts, flags, and metadata. */
function Badge({
  variant = 'neutral',
  icon,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `lz-badge lz-badge--${variant} ${className}`
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12,
    strokeWidth: 2.4
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Maps lifecycle / KYC / escrow states to their token colors. */
const MAP = {
  PENDING: ['var(--status-pending-fg)', 'var(--status-pending-bg)'],
  PAID: ['var(--status-paid-fg)', 'var(--status-paid-bg)'],
  SHIPPED: ['var(--status-shipped-fg)', 'var(--status-shipped-bg)'],
  DELIVERED: ['var(--status-delivered-fg)', 'var(--status-delivered-bg)'],
  COMPLETED: ['var(--status-completed-fg)', 'var(--status-completed-bg)'],
  CANCELLED: ['var(--status-cancelled-fg)', 'var(--status-cancelled-bg)'],
  ERROR: ['var(--status-error-fg)', 'var(--status-error-bg)'],
  VERIFIED: ['var(--kyc-verified-fg)', 'var(--kyc-verified-bg)'],
  REJECTED: ['var(--kyc-rejected-fg)', 'var(--kyc-rejected-bg)'],
  HELD: ['var(--escrow-held-fg)', 'var(--escrow-held-bg)'],
  AVAILABLE: ['var(--escrow-available-fg)', 'var(--escrow-available-bg)']
};

/** Pill that reflects an order / KYC / escrow status with the right semantics. */
function StatusBadge({
  status = 'PENDING',
  label,
  dot = true,
  ...rest
}) {
  const key = String(status).toUpperCase();
  const [fg, bg] = MAP[key] || MAP.PENDING;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "lz-status",
    style: {
      color: fg,
      background: bg
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "lz-status__dot"
  }), label || key);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Removable chip for active filters / selected facets. */
function Tag({
  brand,
  onRemove,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: 'lz-tag' + (brand ? ' lz-tag--brand' : '')
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "lz-tag__x",
    role: "button",
    "aria-label": "Remove",
    onClick: onRemove
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 13,
    strokeWidth: 2.5
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lazadee primary action button. Variants map to brand intent; all sizes keep a
 * 44px minimum hit target.
 */
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  iconLeft,
  iconRight,
  disabled,
  children,
  className = '',
  ...rest
}) {
  const cls = ['lz-btn', variant !== 'primary' && `lz-btn--${variant}`, size !== 'md' && `lz-btn--${size}`, block && 'lz-btn--block', className].filter(Boolean).join(' ');
  const isz = size === 'lg' ? 20 : 18;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: isz
  }), children && /*#__PURE__*/React.createElement("span", null, children), iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: isz
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with brand fill. Wrap label text as children. */
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "lz-check"
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "lz-check__box"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 3
  })), children && /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square icon-only button. 44x44 hit target. Pair with an aria-label. */
function IconButton({
  icon,
  variant = 'plain',
  size = 'md',
  label,
  className = '',
  ...rest
}) {
  const cls = ['lz-iconbtn', variant !== 'plain' && `lz-iconbtn--${variant}`, size !== 'md' && `lz-iconbtn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input with optional label, leading/trailing icon, hint and error. */
function Input({
  label,
  hint,
  error,
  required,
  iconLeft,
  iconRight,
  id,
  className = '',
  invalid,
  ...rest
}) {
  const fid = id || (label ? 'f-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const bad = invalid || !!error;
  const wrapCls = ['lz-inputwrap', iconLeft && 'lz-inputwrap--icon', iconRight && 'lz-inputwrap--icon-right'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: 'lz-field ' + className
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "lz-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: wrapCls
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "lz-inputwrap__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 18
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: 'lz-input' + (bad ? ' lz-input--invalid' : ''),
    "aria-invalid": bad || undefined
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    className: "lz-inputwrap__icon lz-inputwrap__icon--right"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: 18
  }))), error ? /*#__PURE__*/React.createElement("span", {
    className: "lz-field__error"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 13
  }), error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "lz-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Radio with brand fill. Group by shared `name`. */
function Radio({
  checked,
  defaultChecked,
  onChange,
  name,
  value,
  disabled,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "lz-radio"
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "lz-radio__box"
  }, /*#__PURE__*/React.createElement("i", null)), children && /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select styled to match Input, with chevron affordance. */
function Select({
  label,
  hint,
  required,
  id,
  children,
  className = '',
  ...rest
}) {
  const fid = id || (label ? 's-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: 'lz-field ' + className
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "lz-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: "lz-select"
  }, rest), children), hint && /*#__PURE__*/React.createElement("span", {
    className: "lz-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** On/off switch for settings (e.g. publish, freeship toggle). */
function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "lz-switch"
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "lz-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-switch__thumb"
  })), children && /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Underline tab bar. Controlled via `value`/`onChange`; items: {id,label,badge?}. */
function Tabs({
  items = [],
  value,
  onChange = () => {},
  size = 'md'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: size === 'sm' ? 18 : 26,
      borderBottom: '1px solid var(--border-default)'
    }
  }, items.map(it => {
    const on = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange(it.id),
      style: {
        position: 'relative',
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        padding: size === 'sm' ? '8px 0' : '12px 0',
        font: (on ? '600' : '500') + ' ' + (size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)') + ' var(--font-sans)',
        color: on ? 'var(--color-primary)' : 'var(--text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7
      }
    }, it.label, it.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        background: on ? 'var(--color-primary)' : 'var(--gray-200)',
        color: on ? '#fff' : 'var(--text-muted)',
        font: '700 11px var(--font-sans)',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        display: 'grid',
        placeItems: 'center',
        padding: '0 5px'
      }
    }, it.badge), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 2.5,
        borderRadius: 2,
        background: on ? 'var(--color-primary)' : 'transparent'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminShell.jsx
try { (() => {
/* Admin panel shell: ink sidebar with a teal accent rail to distinguish it from
   the vendor (tangerine) Seller Center. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Avatar,
    Badge
  } = DS;
  const {
    NAV
  } = window.LZA;
  function AdminShell({
    active,
    onNav,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '236px 1fr',
        minHeight: '100vh',
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("aside", {
      style: {
        background: 'var(--ink-950)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '18px 18px 14px'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      width: "30",
      height: "30",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.05
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 17px var(--font-sans)',
        letterSpacing: '-0.02em',
        color: '#fff'
      }
    }, "lazadee"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 9px var(--font-sans)',
        letterSpacing: '.14em',
        color: 'var(--blue-500)',
        textTransform: 'uppercase'
      }
    }, "Admin Console"))), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '0 12px 12px',
        padding: '8px 12px',
        background: 'rgba(37,99,235,.14)',
        border: '1px solid rgba(37,99,235,.3)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check",
      size: 15,
      style: {
        color: 'var(--blue-500)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 11px var(--font-sans)',
        color: 'rgba(255,255,255,.82)'
      }
    }, "Quy\u1EC1n: Super Admin")), /*#__PURE__*/React.createElement("nav", {
      style: {
        flex: 1,
        padding: '4px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
      }
    }, NAV.map(n => {
      const on = n.id === active;
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        onClick: () => onNav(n.id),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 12px',
          height: 44,
          borderRadius: 'var(--radius-md)',
          border: 0,
          cursor: 'pointer',
          textAlign: 'left',
          background: on ? 'var(--blue-500)' : 'transparent',
          color: on ? '#fff' : 'rgba(255,255,255,.62)',
          font: (on ? '600' : '500') + ' 13.5px var(--font-sans)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: n.icon,
        size: 18
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, n.name), n.badge && /*#__PURE__*/React.createElement("span", {
        style: {
          background: on ? 'rgba(255,255,255,.25)' : 'var(--flash-500)',
          color: '#fff',
          font: '700 11px var(--font-sans)',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          display: 'grid',
          placeItems: 'center',
          padding: '0 5px'
        }
      }, n.badge));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        borderTop: '1px solid rgba(255,255,255,.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "\u0110\u1EB7ng H\u1EA3i Y\u1EBFn",
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 12px var(--font-sans)',
        color: '#fff',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, "\u0110\u1EB7ng H\u1EA3i Y\u1EBFn"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '11px var(--font-sans)',
        color: 'rgba(255,255,255,.5)'
      }
    }, "Super Admin")), /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 17,
      style: {
        color: 'rgba(255,255,255,.5)',
        marginLeft: 'auto',
        cursor: 'pointer'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        height: 64,
        background: '#fff',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--weight-bold) var(--text-2xl) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, (NAV.find(n => n.id === active) || {}).name), /*#__PURE__*/React.createElement(Badge, {
      variant: "outline",
      style: {
        marginLeft: 4
      }
    }, "Staff RBAC"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: ico
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      style: ico
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "settings",
      size: 20
    })))), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        padding: '24px 28px 60px',
        minWidth: 0
      }
    }, children)));
  }
  const ico = {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    border: 0,
    background: 'transparent',
    color: 'var(--text-body)',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center'
  };
  window.LZAShell = AdminShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Disputes.jsx
try { (() => {
/* Admin: returns/refunds arbitration + review moderation. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Avatar,
    Modal,
    Rating,
    Money,
    Tabs
  } = DS;
  const {
    REFUNDS,
    REVIEWS
  } = window.LZA;
  const formatVND = Money.format;

  /* ---------- Returns & refunds arbitration ---------- */
  function Refunds() {
    const [decided, setDecided] = React.useState({});
    const [modal, setModal] = React.useState(null); // {row, action}
    const state = r => decided[r.id] || r.state;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1000
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 16
      }
    }, [['OPEN', 'Đang mở', 'warning'], ['REFUNDED', 'Đã hoàn', 'success'], ['DENIED', 'Từ chối', 'danger']].map(([k, l, v]) => /*#__PURE__*/React.createElement(Badge, {
      key: k,
      variant: v
    }, REFUNDS.filter(r => state(r) === k).length, " ", l))), REFUNDS.map(r => /*#__PURE__*/React.createElement("div", {
      key: r.id,
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 18,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        font: '13px var(--font-mono)',
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, r.id), /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        font: '12px var(--font-mono)',
        color: 'var(--text-muted)',
        background: 'var(--gray-100)',
        padding: '2px 7px',
        borderRadius: 'var(--radius-sm)'
      }
    }, r.order), state(r) === 'OPEN' && /*#__PURE__*/React.createElement(StatusBadge, {
      status: "PENDING",
      label: "\u0110ANG TRANH CH\u1EA4P"
    }), state(r) === 'REFUNDED' && /*#__PURE__*/React.createElement(Badge, {
      variant: "success",
      icon: "circle-check"
    }, "\u0110\xE3 ho\xE0n ti\u1EC1n"), state(r) === 'DENIED' && /*#__PURE__*/React.createElement(Badge, {
      variant: "danger",
      icon: "ban"
    }, "\u0110\xE3 t\u1EEB ch\u1ED1i"), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        font: 'var(--type-caption)',
        color: 'var(--text-subtle)'
      }
    }, "M\u1EDF ", r.opened)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: 18,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: info
    }, "Ng\u01B0\u1EDDi mua"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.buyer,
      size: 28
    }), /*#__PURE__*/React.createElement("span", {
      style: val
    }, r.buyer)), /*#__PURE__*/React.createElement("div", {
      style: {
        ...info,
        marginTop: 10
      }
    }, "L\xFD do"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...val,
        marginTop: 3
      }
    }, r.reason)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: info
    }, "Ng\u01B0\u1EDDi b\xE1n"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.shop,
      size: 28,
      square: true
    }), /*#__PURE__*/React.createElement("span", {
      style: val
    }, r.shop)), /*#__PURE__*/React.createElement("div", {
      style: {
        ...info,
        marginTop: 10
      }
    }, "B\u1EB1ng ch\u1EE9ng (", r.media.length, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 5
      }
    }, r.media.map(m => /*#__PURE__*/React.createElement("img", {
      key: m,
      src: '../../assets/img/' + m + '.jpg',
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-sm)',
        objectFit: 'cover'
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: info
    }, "S\u1ED1 ti\u1EC1n tranh ch\u1EA5p"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 22px var(--font-sans)',
        color: 'var(--text-price)',
        fontVariantNumeric: 'tabular-nums',
        margin: '4px 0 12px'
      }
    }, formatVND(r.amount)), state(r) === 'OPEN' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => setModal({
        row: r,
        action: 'deny'
      })
    }, "T\u1EEB ch\u1ED1i"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "hand-coins",
      onClick: () => setModal({
        row: r,
        action: 'refund'
      })
    }, "Ho\xE0n ti\u1EC1n")) : /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setDecided(d => {
        const n = {
          ...d
        };
        delete n[r.id];
        return n;
      })
    }, "M\u1EDF l\u1EA1i"))))), /*#__PURE__*/React.createElement(Modal, {
      open: !!modal,
      onClose: () => setModal(null),
      title: modal && modal.action === 'refund' ? 'Duyệt hoàn tiền' : 'Từ chối yêu cầu',
      footer: modal && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setModal(null)
      }, "Hu\u1EF7"), /*#__PURE__*/React.createElement(Button, {
        variant: modal.action === 'refund' ? 'primary' : 'danger',
        onClick: () => {
          setDecided(d => ({
            ...d,
            [modal.row.id]: modal.action === 'refund' ? 'REFUNDED' : 'DENIED'
          }));
          setModal(null);
        }
      }, modal.action === 'refund' ? 'Xác nhận hoàn ' + formatVND(modal.row.amount) : 'Xác nhận từ chối'))
    }, modal && /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-muted)'
      }
    }, modal.action === 'refund' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Ho\xE0n ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-price)'
      }
    }, formatVND(modal.row.amount)), " t\u1EEB escrow v\u1EC1 ng\u01B0\u1EDDi mua. Kho\u1EA3n n\xE0y s\u1EBD \u0111\u01B0\u1EE3c ghi v\xE0o s\u1ED5 c\xE1i v\u1EDBi m\xE3 ", /*#__PURE__*/React.createElement("span", {
      className: "code"
    }, modal.row.id), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "T\u1EEB ch\u1ED1i y\xEAu c\u1EA7u ho\xE0n ti\u1EC1n ", /*#__PURE__*/React.createElement("span", {
      className: "code"
    }, modal.row.id), ". Ti\u1EC1n v\u1EABn \u0111\u01B0\u1EE3c gi\u1EEF trong escrow c\u1EE7a ng\u01B0\u1EDDi b\xE1n."))));
  }

  /* ---------- Review moderation ---------- */
  function Reviews() {
    const [acted, setActed] = React.useState({});
    const state = r => acted[r.id] || r.state;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 900
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        background: 'var(--amber-50)',
        color: 'var(--amber-600)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        font: 'var(--type-body-sm)',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 16
    }), " \u1EA8n \u0111\xE1nh gi\xE1 vi ph\u1EA1m ti\xEAu chu\u1EA9n c\u1ED9ng \u0111\u1ED3ng. Thao t\xE1c \u0111\u01B0\u1EE3c ghi log v\xE0 c\xF3 th\u1EC3 ho\xE0n t\xE1c."), REVIEWS.map(r => {
      const hidden = state(r) === 'HIDDEN';
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        style: {
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 18,
          marginBottom: 14,
          opacity: hidden ? 0.7 : 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: r.user,
        size: 32
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          font: '600 13px var(--font-sans)',
          color: 'var(--text-strong)'
        }
      }, r.user), /*#__PURE__*/React.createElement(Rating, {
        value: r.rating,
        size: 12,
        showNumber: false
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        variant: "danger",
        icon: "triangle-alert"
      }, r.flags, " b\xE1o c\xE1o"), hidden ? /*#__PURE__*/React.createElement(Badge, {
        variant: "neutral",
        icon: "eye-off"
      }, "\u0110\xE3 \u1EA9n") : /*#__PURE__*/React.createElement(StatusBadge, {
        status: "PENDING",
        label: "CH\u1EDC DUY\u1EC6T"
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--type-caption)',
          color: 'var(--text-subtle)',
          marginBottom: 4
        }
      }, "S\u1EA3n ph\u1EA9m: ", r.product, " \xB7 ", /*#__PURE__*/React.createElement("span", {
        className: "code"
      }, r.id)), /*#__PURE__*/React.createElement("p", {
        style: {
          font: 'var(--type-body)',
          color: hidden ? 'var(--text-muted)' : 'var(--text-body)',
          padding: '8px 12px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--red-500)'
        }
      }, r.text), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 12
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-caption)',
          color: 'var(--text-muted)'
        }
      }, "C\u1EDD: ", r.reason), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          display: 'flex',
          gap: 8
        }
      }, hidden ? /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconLeft: "eye",
        onClick: () => setActed(a => ({
          ...a,
          [r.id]: 'VISIBLE'
        }))
      }, "Hi\u1EC7n l\u1EA1i") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setActed(a => ({
          ...a,
          [r.id]: 'VISIBLE'
        }))
      }, "Gi\u1EEF hi\u1EC3n th\u1ECB"), /*#__PURE__*/React.createElement(Button, {
        variant: "danger",
        size: "sm",
        iconLeft: "eye-off",
        onClick: () => setActed(a => ({
          ...a,
          [r.id]: 'HIDDEN'
        }))
      }, "\u1EA8n \u0111\xE1nh gi\xE1")))));
    }));
  }
  const info = {
    font: 'var(--type-caption)',
    color: 'var(--text-muted)'
  };
  const val = {
    font: 'var(--weight-medium) var(--text-sm) var(--font-sans)',
    color: 'var(--text-body)'
  };
  window.LZARefunds = Refunds;
  window.LZAReviews = Reviews;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Disputes.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Finance.jsx
try { (() => {
/* Admin finance & governance: withdrawal processing, commission config,
   append-only ledger, staff RBAC. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Avatar,
    Switch,
    Input,
    Money
  } = DS;
  const {
    WITHDRAWALS,
    LEDGER,
    STAFF,
    ROLES
  } = window.LZA;
  const formatVND = Money.format;

  /* ---------- Withdrawals ---------- */
  function Withdrawals() {
    const [done, setDone] = React.useState({});
    const st = w => done[w.id] || w.state;
    const queue = WITHDRAWALS.filter(w => st(w) === 'PENDING');
    const totalPending = queue.reduce((n, w) => n + w.amount, 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1000
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Kpi, {
      icon: "hand-coins",
      label: "Ch\u1EDD x\u1EED l\xFD",
      value: queue.length + ' yêu cầu',
      tone: {
        bg: 'var(--amber-50)',
        fg: 'var(--amber-600)'
      }
    }), /*#__PURE__*/React.createElement(Kpi, {
      icon: "banknote",
      label: "T\u1ED5ng ti\u1EC1n ch\u1EDD chi",
      value: formatVND(totalPending),
      tone: {
        bg: 'var(--blue-50)',
        fg: 'var(--blue-600)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: hrow
    }, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "M\xE3"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Ng\u01B0\u1EDDi b\xE1n"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "T\xE0i kho\u1EA3n nh\u1EADn"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "S\u1ED1 ti\u1EC1n"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "KYC"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Y\xEAu c\u1EA7u"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Thao t\xE1c"))), /*#__PURE__*/React.createElement("tbody", null, WITHDRAWALS.map(w => {
      const blocked = w.kyc !== 'VERIFIED';
      return /*#__PURE__*/React.createElement("tr", {
        key: w.id,
        style: brow
      }, /*#__PURE__*/React.createElement("td", {
        style: td
      }, /*#__PURE__*/React.createElement("span", {
        className: "code",
        style: {
          fontSize: 12
        }
      }, w.id)), /*#__PURE__*/React.createElement("td", {
        style: td
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: w.shop,
        size: 26,
        square: true
      }), w.shop)), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          color: 'var(--text-muted)'
        },
        className: "code"
      }, w.bank), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          textAlign: 'right',
          fontWeight: 700
        }
      }, formatVND(w.amount)), /*#__PURE__*/React.createElement("td", {
        style: td
      }, /*#__PURE__*/React.createElement(StatusBadge, {
        status: w.kyc === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
        label: w.kyc,
        dot: false
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          color: 'var(--text-muted)',
          fontSize: 12
        }
      }, w.requested), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          textAlign: 'right'
        }
      }, st(w) === 'PAID' ? /*#__PURE__*/React.createElement(Badge, {
        variant: "success",
        icon: "circle-check"
      }, "\u0110\xE3 chi") : st(w) === 'DONE' ? /*#__PURE__*/React.createElement(Badge, {
        variant: "success",
        icon: "circle-check"
      }, "\u0110\xE3 duy\u1EC7t chi") : blocked ? /*#__PURE__*/React.createElement(Badge, {
        variant: "danger",
        icon: "lock"
      }, "Ch\u1EB7n \u2014 KYC ch\u01B0a duy\u1EC7t") : /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => setDone(d => ({
          ...d,
          [w.id]: 'REJECTED'
        }))
      }, "T\u1EEB ch\u1ED1i"), /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        iconLeft: "check",
        onClick: () => setDone(d => ({
          ...d,
          [w.id]: 'DONE'
        }))
      }, "Duy\u1EC7t chi"))));
    })))));
  }

  /* ---------- Commission config ---------- */
  function Commission() {
    const cats = [['Điện tử', 5], ['Thời trang', 8], ['Làm đẹp', 10], ['Nhà cửa', 6], ['Phụ kiện', 7], ['Bách hoá', 4]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 720
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 22,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 4
      }
    }, "Ph\xED hoa h\u1ED3ng m\u1EB7c \u0111\u1ECBnh"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)',
        marginBottom: 16
      }
    }, "\xC1p d\u1EE5ng cho m\u1ECDi giao d\u1ECBch ch\u01B0a c\xF3 c\u1EA5u h\xECnh ri\xEAng theo ng\xE0nh h\xE0ng."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 140
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Ph\xED s\xE0n (%)",
      defaultValue: "5",
      iconRight: "percent"
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "L\u01B0u m\u1EB7c \u0111\u1ECBnh"))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Hoa h\u1ED3ng theo ng\xE0nh h\xE0ng"), cats.map(([c, v]) => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--type-body)',
        color: 'var(--text-body)'
      }
    }, c), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 90
      }
    }, /*#__PURE__*/React.createElement(Input, {
      defaultValue: String(v),
      iconRight: "percent"
    })), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: true
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Button, null, "L\u01B0u c\u1EA5u h\xECnh"))));
  }

  /* ---------- Append-only ledger ---------- */
  function Ledger() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1040
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 11
    }), " Append-only \xB7 b\u1EA5t bi\u1EBFn"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, "M\u1ED7i d\xF2ng l\xE0 m\u1ED9t b\xFAt to\xE1n kh\xF4ng th\u1EC3 s\u1EEDa/xo\xE1. \u0110i\u1EC1u ch\u1EC9nh = th\xEAm b\xFAt to\xE1n \u0111\u1EA3o."), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: "download",
      style: {
        marginLeft: 'auto'
      }
    }, "Xu\u1EA5t s\u1ED5 c\xE1i")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: hrow
    }, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Seq"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Th\u1EDDi gian"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "S\u1EF1 ki\u1EC7n"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Tham chi\u1EBFu"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "T\xE0i kho\u1EA3n"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "N\u1EE3"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "C\xF3"))), /*#__PURE__*/React.createElement("tbody", null, LEDGER.map(r => /*#__PURE__*/React.createElement("tr", {
      key: r.seq,
      style: brow
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-subtle)'
      },
      className: "code"
    }, "#", r.seq), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-muted)',
        fontSize: 12
      },
      className: "code"
    }, r.ts), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: EVENT[r.event] || 'neutral'
    }, r.event)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        fontSize: 12
      }
    }, r.ref)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-body)'
      }
    }, r.account), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        color: r.debit ? 'var(--red-600)' : 'var(--text-disabled)',
        fontWeight: r.debit ? 600 : 400
      }
    }, r.debit ? formatVND(r.debit) : '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        color: r.credit ? 'var(--green-600)' : 'var(--text-disabled)',
        fontWeight: r.credit ? 600 : 400
      }
    }, r.credit ? formatVND(r.credit) : '—')))))));
  }

  /* ---------- RBAC ---------- */
  function Rbac() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 900
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, "Ph\xE2n quy\u1EC1n theo vai tr\xF2 (RBAC). ", STAFF.length, " nh\xE2n vi\xEAn \xB7 ", ROLES.length, " vai tr\xF2."), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus-circle",
      style: {
        marginLeft: 'auto'
      }
    }, "M\u1EDDi nh\xE2n vi\xEAn")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: hrow
    }, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Nh\xE2n vi\xEAn"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Vai tr\xF2"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Quy\u1EC1n"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Tr\u1EA1ng th\xE1i"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }))), /*#__PURE__*/React.createElement("tbody", null, STAFF.map(s => /*#__PURE__*/React.createElement("tr", {
      key: s.email,
      style: brow
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: s.name,
      size: 34
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      className: "code",
      style: {
        font: '11px var(--font-mono)',
        color: 'var(--text-muted)'
      }
    }, s.email)))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: s.role === 'Super Admin' ? 'primary' : 'outline'
    }, s.role)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        maxWidth: 280
      }
    }, s.perms.map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      className: "code",
      style: {
        font: '11px var(--font-mono)',
        background: 'var(--gray-100)',
        color: 'var(--text-body)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-xs)'
      }
    }, p)))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, s.active ? /*#__PURE__*/React.createElement(Badge, {
      variant: "success"
    }, "Ho\u1EA1t \u0111\u1ED9ng") : /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, "T\u1EA1m kho\xE1")), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: "pencil"
    }, "S\u1EEDa"))))))));
  }
  function Kpi({
    icon,
    label,
    value,
    tone
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '16px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        background: tone.bg,
        color: tone.fg,
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 17
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 13px var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, label)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 24px var(--font-sans)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value));
  }
  const EVENT = {
    ESCROW_IN: 'warning',
    COMMISSION: 'primary',
    ESCROW_RELEASE: 'success',
    PAYOUT_ACCRUE: 'mint',
    PAYOUT_SETTLE: 'neutral',
    REFUND: 'danger'
  };
  const hrow = {
    font: '600 12px var(--font-sans)',
    color: 'var(--text-muted)',
    textAlign: 'left',
    background: 'var(--gray-25)'
  };
  const brow = {
    borderTop: '1px solid var(--border-subtle)',
    font: '13px var(--font-sans)',
    color: 'var(--text-body)'
  };
  const th = {
    padding: '11px 16px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '12px 16px',
    whiteSpace: 'nowrap'
  };
  window.LZAWithdrawals = Withdrawals;
  window.LZACommission = Commission;
  window.LZALedger = Ledger;
  window.LZARbac = Rbac;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Finance.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/KYCReview.jsx
try { (() => {
/* Admin: KYC review queue. List + detail with document thumbnails, approve /
   reject-with-reason. Products can't publish until VERIFIED. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Avatar,
    Modal,
    Select,
    Tabs
  } = DS;
  const {
    KYC
  } = window.LZA;
  const RISK = {
    low: ['success', 'Rủi ro thấp'],
    medium: ['warning', 'Rủi ro trung bình'],
    high: ['danger', 'Rủi ro cao']
  };
  const REASONS = ['Ảnh giấy tờ mờ / không đọc được', 'Thông tin không khớp', 'Giấy tờ hết hạn', 'Nghi ngờ giả mạo', 'Thiếu giấy phép kinh doanh'];
  function KYCReview() {
    const [tab, setTab] = React.useState('PENDING');
    const list = KYC.filter(k => tab === 'ALL' || k.status === tab);
    const [sel, setSel] = React.useState(KYC[0]);
    const [reject, setReject] = React.useState(false);
    const [reason, setReason] = React.useState(REASONS[0]);
    const [decided, setDecided] = React.useState({});
    const status = k => decided[k.id] || k.status;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      size: "sm",
      items: [{
        id: 'PENDING',
        label: 'Chờ duyệt',
        badge: KYC.filter(k => status(k) === 'PENDING').length
      }, {
        id: 'VERIFIED',
        label: 'Đã duyệt'
      }, {
        id: 'REJECTED',
        label: 'Từ chối'
      }, {
        id: 'ALL',
        label: 'Tất cả'
      }]
    })), /*#__PURE__*/React.createElement("div", null, list.map(k => {
      const on = sel.id === k.id;
      return /*#__PURE__*/React.createElement("button", {
        key: k.id,
        onClick: () => setSel(k),
        style: {
          display: 'flex',
          gap: 12,
          width: '100%',
          textAlign: 'left',
          border: 0,
          cursor: 'pointer',
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          borderLeft: '3px solid ' + (on ? 'var(--blue-500)' : 'transparent'),
          background: on ? 'var(--blue-50)' : '#fff'
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: k.shop,
        size: 40,
        square: true
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: '600 14px var(--font-sans)',
          color: 'var(--text-strong)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, k.shop)), /*#__PURE__*/React.createElement("div", {
        style: {
          font: '12px var(--font-sans)',
          color: 'var(--text-muted)',
          marginTop: 2
        }
      }, k.owner, " \xB7 ", k.type), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 7
        }
      }, /*#__PURE__*/React.createElement(StatusBadge, {
        status: status(k),
        label: status(k) === 'PENDING' ? 'PENDING' : status(k)
      }), /*#__PURE__*/React.createElement("span", {
        className: "code",
        style: {
          font: '11px var(--font-mono)',
          color: 'var(--text-subtle)'
        }
      }, k.id))));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        paddingBottom: 18,
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: sel.shop,
      size: 56,
      square: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-xl) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, sel.shop), (() => {
      const [v, l] = RISK[sel.risk];
      return /*#__PURE__*/React.createElement(Badge, {
        variant: v
      }, l);
    })()), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)',
        marginTop: 4
      }
    }, "Ch\u1EE7 s\u1EDF h\u1EEFu: ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-body)'
      }
    }, sel.owner), " \xB7 Lo\u1EA1i h\xECnh: ", sel.type, " \xB7 N\u1ED9p l\xFAc ", sel.submitted), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: status(sel)
    }))), /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        font: '12px var(--font-mono)',
        color: 'var(--text-muted)',
        background: 'var(--gray-100)',
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)'
      }
    }, sel.id)), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '18px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 10
      }
    }, "H\u1ED3 s\u01A1 \u0111\xE3 t\u1EA3i l\xEAn (", sel.docs.length, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }
    }, sel.docs.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 150
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 96,
        borderRadius: 'var(--radius-md)',
        background: 'var(--gray-100)',
        border: '1px solid var(--border-default)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--text-subtle)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 28
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        background: '#fff',
        borderRadius: 'var(--radius-xs)',
        padding: '1px 5px',
        font: '10px var(--font-mono)',
        color: 'var(--text-muted)',
        boxShadow: 'var(--shadow-xs)'
      }
    }, i % 2 ? 'PDF' : 'JPG')), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'var(--text-body)',
        marginTop: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 13
    }), " ", d))))), sel.reason && status(sel) === 'REJECTED' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        background: 'var(--red-50)',
        color: 'var(--red-600)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        font: 'var(--type-body-sm)',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "triangle-alert",
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "L\xFD do t\u1EEB ch\u1ED1i:"), " ", sel.reason)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        background: 'var(--amber-50)',
        color: 'var(--amber-600)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        font: 'var(--type-body-sm)',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", null, "Ng\u01B0\u1EDDi b\xE1n ", /*#__PURE__*/React.createElement("b", null, "kh\xF4ng th\u1EC3 \u0111\u0103ng b\xE1n s\u1EA3n ph\u1EA9m"), " cho \u0111\u1EBFn khi h\u1ED3 s\u01A1 \u0111\u01B0\u1EE3c duy\u1EC7t ", /*#__PURE__*/React.createElement("b", null, "VERIFIED"), ".")), status(sel) === 'PENDING' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      iconLeft: "ban",
      onClick: () => setReject(true)
    }, "T\u1EEB ch\u1ED1i"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: "badge-check",
      onClick: () => setDecided(d => ({
        ...d,
        [sel.id]: 'VERIFIED'
      }))
    }, "Ph\xEA duy\u1EC7t KYC"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconLeft: "message-circle"
    }, "Y\xEAu c\u1EA7u b\u1ED5 sung")), status(sel) !== 'PENDING' && /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: "undo-2",
      onClick: () => setDecided(d => {
        const n = {
          ...d
        };
        delete n[sel.id];
        return n;
      })
    }, "\u0110\u01B0a l\u1EA1i v\xE0o h\xE0ng ch\u1EDD")), /*#__PURE__*/React.createElement(Modal, {
      open: reject,
      onClose: () => setReject(false),
      title: 'Từ chối hồ sơ ' + sel.id,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setReject(false)
      }, "Hu\u1EF7"), /*#__PURE__*/React.createElement(Button, {
        variant: "danger",
        onClick: () => {
          setDecided(d => ({
            ...d,
            [sel.id]: 'REJECTED'
          }));
          setReject(false);
        }
      }, "X\xE1c nh\u1EADn t\u1EEB ch\u1ED1i"))
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-muted)',
        marginBottom: 16
      }
    }, "Ng\u01B0\u1EDDi b\xE1n ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-body)'
      }
    }, sel.shop), " s\u1EBD nh\u1EADn th\xF4ng b\xE1o k\xE8m l\xFD do v\xE0 c\xF3 th\u1EC3 n\u1ED9p l\u1EA1i h\u1ED3 s\u01A1."), /*#__PURE__*/React.createElement(Select, {
      label: "L\xFD do t\u1EEB ch\u1ED1i",
      value: reason,
      onChange: e => setReason(e.target.value)
    }, REASONS.map(r => /*#__PURE__*/React.createElement("option", {
      key: r
    }, r)))));
  }
  window.LZAKyc = KYCReview;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/KYCReview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/data.jsx
try { (() => {
/* Mock data for the Lazadee Staff/Admin panel. */
(function () {
  const NAV = [{
    id: 'kyc',
    name: 'Duyệt KYC',
    icon: 'user-check',
    badge: 3
  }, {
    id: 'refunds',
    name: 'Trả hàng & Hoàn tiền',
    icon: 'undo-2',
    badge: 2
  }, {
    id: 'reviews',
    name: 'Kiểm duyệt đánh giá',
    icon: 'star'
  }, {
    id: 'withdrawals',
    name: 'Xử lý rút tiền',
    icon: 'hand-coins',
    badge: 4
  }, {
    id: 'commission',
    name: 'Cấu hình hoa hồng',
    icon: 'percent'
  }, {
    id: 'ledger',
    name: 'Sổ cái tài chính',
    icon: 'scale'
  }, {
    id: 'catalog',
    name: 'Danh mục toàn sàn',
    icon: 'boxes'
  }, {
    id: 'rbac',
    name: 'Phân quyền nhân viên',
    icon: 'shield-check'
  }];
  const KYC = [{
    id: 'KYC-1042',
    shop: 'Boutique Sài Gòn',
    owner: 'Phạm Thị Lan',
    type: 'Hộ kinh doanh',
    submitted: '08/06 10:24',
    status: 'PENDING',
    docs: ['CCCD mặt trước', 'CCCD mặt sau', 'Giấy phép KD'],
    risk: 'low'
  }, {
    id: 'KYC-1041',
    shop: 'GadgetHub VN',
    owner: 'Trần Quốc Bảo',
    type: 'Doanh nghiệp',
    submitted: '08/06 08:51',
    status: 'PENDING',
    docs: ['CCCD mặt trước', 'CCCD mặt sau', 'ĐKKD doanh nghiệp', 'Thông báo thuế'],
    risk: 'medium'
  }, {
    id: 'KYC-1039',
    shop: 'Mẹ & Bé Happy',
    owner: 'Nguyễn Thị Hoa',
    type: 'Cá nhân',
    submitted: '07/06 19:03',
    status: 'PENDING',
    docs: ['CCCD mặt trước', 'CCCD mặt sau'],
    risk: 'low'
  }, {
    id: 'KYC-1037',
    shop: 'TravelGear',
    owner: 'Đỗ Minh Khang',
    type: 'Hộ kinh doanh',
    submitted: '07/06 14:18',
    status: 'VERIFIED',
    docs: ['CCCD', 'Giấy phép KD'],
    risk: 'low'
  }, {
    id: 'KYC-1033',
    shop: 'Cheap Electronics',
    owner: 'Lý Văn Tèo',
    type: 'Cá nhân',
    submitted: '06/06 11:42',
    status: 'REJECTED',
    reason: 'Ảnh giấy tờ mờ, không đọc được số CCCD',
    docs: ['CCCD mặt trước'],
    risk: 'high'
  }];
  const REFUNDS = [{
    id: 'RFN-0231',
    order: 'ORD-2412-0035',
    buyer: 'Vũ Minh Quân',
    shop: 'Beauty Box',
    amount: 178000,
    reason: 'Hàng không đúng mô tả',
    state: 'OPEN',
    opened: '2 giờ trước',
    media: ['skincare', 'cosmetics']
  }, {
    id: 'RFN-0230',
    order: 'ORD-2412-0028',
    buyer: 'Hoàng Thu Trang',
    shop: 'Shoe Republic',
    amount: 320000,
    reason: 'Giao sai size',
    state: 'OPEN',
    opened: '5 giờ trước',
    media: ['heels']
  }, {
    id: 'RFN-0229',
    order: 'ORD-2412-0021',
    buyer: 'Bùi Đức Anh',
    shop: 'TechZone Official',
    amount: 389000,
    reason: 'Sản phẩm lỗi',
    state: 'REFUNDED',
    opened: 'Hôm qua',
    media: ['headphones']
  }];
  const REVIEWS = [{
    id: 'RV-9921',
    product: 'Tai nghe ANC Pro 5',
    user: 'kh***92',
    rating: 1,
    text: 'Sản phẩm rác, shop lừa đảo, đừng ai mua *** số điện thoại 09xx để mua ngoài rẻ hơn',
    flags: 3,
    reason: 'Spam / chuyển hướng giao dịch',
    state: 'PENDING'
  }, {
    id: 'RV-9918',
    product: 'Serum Vitamin C',
    user: 'an***le',
    rating: 2,
    text: 'Đóng gói tệ, giao chậm 3 ngày so với hẹn.',
    flags: 1,
    reason: 'Báo cáo bởi người bán',
    state: 'PENDING'
  }, {
    id: 'RV-9910',
    product: 'Giày sneaker Air Run',
    user: 'min***',
    rating: 5,
    text: 'Ngôn từ thô tục ***',
    flags: 5,
    reason: 'Ngôn từ phản cảm',
    state: 'HIDDEN'
  }];
  const WITHDRAWALS = [{
    id: 'PAYOUT-0012',
    shop: 'TechZone Official',
    amount: 5000000,
    bank: 'Vietcombank ••6712',
    requested: '08/06 09:00',
    state: 'PENDING',
    kyc: 'VERIFIED'
  }, {
    id: 'PAYOUT-0011',
    shop: 'Beauty Box',
    amount: 2300000,
    bank: 'Techcombank ••0098',
    requested: '08/06 07:30',
    state: 'PENDING',
    kyc: 'VERIFIED'
  }, {
    id: 'PAYOUT-0010',
    shop: 'Home & Living',
    amount: 850000,
    bank: 'MB Bank ••4521',
    requested: '07/06 22:15',
    state: 'PENDING',
    kyc: 'VERIFIED'
  }, {
    id: 'PAYOUT-0009',
    shop: 'TravelGear',
    amount: 1200000,
    bank: 'ACB ••7733',
    requested: '07/06 18:40',
    state: 'PENDING',
    kyc: 'PENDING'
  }, {
    id: 'PAYOUT-0008',
    shop: 'Shoe Republic',
    amount: 3400000,
    bank: 'BIDV ••1190',
    requested: '06/06 16:30',
    state: 'PAID',
    kyc: 'VERIFIED'
  }];

  // Append-only platform ledger (immutable). Every money movement, newest first.
  const LEDGER = [{
    seq: 100482,
    ts: '08/06/2026 14:22:07',
    event: 'ESCROW_IN',
    ref: 'ORD-2412-0041',
    debit: '',
    credit: 778000,
    account: 'Escrow Liability'
  }, {
    seq: 100481,
    ts: '08/06/2026 14:22:07',
    event: 'COMMISSION',
    ref: 'ORD-2412-0041',
    debit: 38900,
    credit: '',
    account: 'Platform Revenue'
  }, {
    seq: 100480,
    ts: '08/06/2026 09:10:55',
    event: 'ESCROW_IN',
    ref: 'ORD-2412-0040',
    debit: '',
    credit: 690000,
    account: 'Escrow Liability'
  }, {
    seq: 100479,
    ts: '07/06/2026 18:46:12',
    event: 'ESCROW_RELEASE',
    ref: 'ORD-2412-0039',
    debit: 1245000,
    credit: '',
    account: 'Escrow Liability'
  }, {
    seq: 100478,
    ts: '07/06/2026 18:46:12',
    event: 'PAYOUT_ACCRUE',
    ref: 'WALLET·techzone',
    debit: '',
    credit: 1245000,
    account: 'Seller Payable'
  }, {
    seq: 100477,
    ts: '06/06/2026 16:30:41',
    event: 'PAYOUT_SETTLE',
    ref: 'PAYOUT-0008',
    debit: 3400000,
    credit: '',
    account: 'Seller Payable'
  }, {
    seq: 100476,
    ts: '06/06/2026 08:15:33',
    event: 'REFUND',
    ref: 'RFN-0229',
    debit: 389000,
    credit: '',
    account: 'Escrow Liability'
  }];
  const STAFF = [{
    name: 'Đặng Hải Yến',
    email: 'yen.dh@lazadee.vn',
    role: 'Super Admin',
    perms: ['all'],
    active: true
  }, {
    name: 'Ngô Tấn Phát',
    email: 'phat.nt@lazadee.vn',
    role: 'KYC Reviewer',
    perms: ['kyc.review', 'catalog.read'],
    active: true
  }, {
    name: 'Trịnh Mỹ Linh',
    email: 'linh.tm@lazadee.vn',
    role: 'Finance',
    perms: ['payout.process', 'ledger.read', 'commission.config'],
    active: true
  }, {
    name: 'Vương Đại Nghĩa',
    email: 'nghia.vd@lazadee.vn',
    role: 'Moderator',
    perms: ['review.moderate', 'refund.arbitrate'],
    active: false
  }];
  const ROLES = ['Super Admin', 'KYC Reviewer', 'Finance', 'Moderator', 'Support'];
  window.LZA = {
    NAV,
    KYC,
    REFUNDS,
    REVIEWS,
    WITHDRAWALS,
    LEDGER,
    STAFF,
    ROLES
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Cart.jsx
try { (() => {
/* Lazadee multi-vendor cart: grouped by vendor, per-vendor subtotals & shipping. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Checkbox,
    Badge,
    PriceVND,
    QuantityStepper,
    VendorChip,
    Money
  } = DS;
  const formatVND = Money.format;
  const {
    V
  } = window.LZ;
  function Cart({
    cart,
    setCart,
    onCheckout,
    onContinue,
    onOpen
  }) {
    const [selected, setSelected] = React.useState(() => new Set(cart.map(l => l.key)));
    const groups = React.useMemo(() => {
      const m = {};
      cart.forEach(l => {
        (m[l.vendorId] = m[l.vendorId] || []).push(l);
      });
      return Object.entries(m);
    }, [cart]);
    const toggle = k => setSelected(s => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
    const toggleVendor = (vid, lines) => setSelected(s => {
      const n = new Set(s);
      const all = lines.every(l => n.has(l.key));
      lines.forEach(l => all ? n.delete(l.key) : n.add(l.key));
      return n;
    });
    const setQty = (k, q) => setCart(c => c.map(l => l.key === k ? {
      ...l,
      qty: q
    } : l));
    const remove = k => {
      setCart(c => c.filter(l => l.key !== k));
      setSelected(s => {
        const n = new Set(s);
        n.delete(k);
        return n;
      });
    };
    const selLines = cart.filter(l => selected.has(l.key));
    const subtotal = selLines.reduce((n, l) => n + l.price * l.qty, 0);
    const shipping = groups.reduce((n, [vid, lines]) => lines.some(l => selected.has(l.key)) ? n + V[vid].ship : n, 0);
    const total = subtotal + shipping;
    const allSelected = cart.length > 0 && selected.size === cart.length;
    if (cart.length === 0) return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 600,
        margin: '0 auto',
        padding: '90px 24px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-cart",
      size: 56,
      style: {
        color: 'var(--text-subtle)',
        margin: '0 auto 16px'
      }
    }), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-h3)',
        color: 'var(--text-strong)',
        marginBottom: 8
      }
    }, "Gi\u1ECF h\xE0ng tr\u1ED1ng"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        marginBottom: 22
      }
    }, "H\xE3y kh\xE1m ph\xE1 h\xE0ng tri\u1EC7u s\u1EA3n ph\u1EA9m v\u1EDBi gi\xE1 t\u1ED1t nh\u1EA5t."), /*#__PURE__*/React.createElement(Button, {
      onClick: onContinue,
      iconLeft: "house"
    }, "Ti\u1EBFp t\u1EE5c mua s\u1EAFm"));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: '18px 24px 120px'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-h2)',
        color: 'var(--text-strong)',
        marginBottom: 16
      }
    }, "Gi\u1ECF h\xE0ng ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontWeight: 400,
        fontSize: 18
      }
    }, "(", cart.length, " s\u1EA3n ph\u1EA9m)")), groups.map(([vid, lines]) => {
      const vendor = V[vid];
      const vSel = lines.filter(l => selected.has(l.key));
      const vSub = vSel.reduce((n, l) => n + l.price * l.qty, 0);
      return /*#__PURE__*/React.createElement("div", {
        key: vid,
        style: {
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 16,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement(Checkbox, {
        checked: lines.every(l => selected.has(l.key)),
        onChange: () => toggleVendor(vid, lines)
      }), /*#__PURE__*/React.createElement(Icon, {
        name: "store",
        size: 16,
        style: {
          color: 'var(--color-primary)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
          color: 'var(--text-strong)'
        }
      }, vendor.name), vendor.mall && /*#__PURE__*/React.createElement(Badge, {
        variant: "solid"
      }, "MALL"), /*#__PURE__*/React.createElement("button", {
        style: chatBtn
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "message-circle",
        size: 14
      }), " Chat"), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          font: 'var(--type-caption)',
          color: 'var(--text-muted)'
        }
      }, "M\u1ED9t \u0111\u01A1n ri\xEAng \xB7 Ph\xED ship ", formatVND(vendor.ship))), lines.map(l => /*#__PURE__*/React.createElement("div", {
        key: l.key,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 18px',
          borderBottom: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement(Checkbox, {
        checked: selected.has(l.key),
        onChange: () => toggle(l.key)
      }), /*#__PURE__*/React.createElement("img", {
        src: l.img,
        onClick: () => onOpen(l.productId),
        style: {
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-md)',
          objectFit: 'cover',
          cursor: 'pointer',
          flex: 'none'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--type-body)',
          color: 'var(--text-body)',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }
      }, l.title), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 6,
          font: 'var(--type-caption)',
          color: 'var(--text-muted)',
          background: 'var(--gray-50)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)'
        }
      }, "Ph\xE2n lo\u1EA1i: ", l.variant, " ", /*#__PURE__*/React.createElement(Icon, {
        name: "chevron-down",
        size: 12
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 130,
          textAlign: 'right'
        }
      }, /*#__PURE__*/React.createElement(PriceVND, {
        amount: l.price,
        original: l.original,
        size: "sm"
      })), /*#__PURE__*/React.createElement(QuantityStepper, {
        value: l.qty,
        min: 1,
        max: l.stock,
        onChange: q => setQty(l.key, q)
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 120,
          textAlign: 'right',
          font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
          color: 'var(--text-price)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, formatVND(l.price * l.qty)), /*#__PURE__*/React.createElement("button", {
        onClick: () => remove(l.key),
        style: {
          border: 0,
          background: 'transparent',
          color: 'var(--text-subtle)',
          cursor: 'pointer',
          padding: 8
        },
        "aria-label": "Xo\xE1"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "trash-2",
        size: 18
      })))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 18px',
          background: 'var(--gray-25)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "ticket",
        size: 16,
        style: {
          color: 'var(--color-primary)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-body-sm)',
          color: 'var(--text-link)',
          cursor: 'pointer',
          fontWeight: 600
        }
      }, "Th\xEAm voucher c\u1EE7a Shop"), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          font: 'var(--type-body-sm)',
          color: 'var(--text-muted)'
        }
      }, "T\u1EA1m t\xEDnh (", vSel.length, "): ", /*#__PURE__*/React.createElement("b", {
        style: {
          color: 'var(--text-price)'
        }
      }, formatVND(vSub)))));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff',
        borderTop: '1px solid var(--border-default)',
        boxShadow: '0 -4px 16px rgba(26,24,21,.06)',
        zIndex: 90
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: allSelected,
      onChange: () => setSelected(allSelected ? new Set() : new Set(cart.map(l => l.key)))
    }, "Ch\u1ECDn t\u1EA5t c\u1EA3 (", cart.length, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--text-link)',
        font: 'var(--type-body-sm)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ticket",
      size: 15
    }), " Lazadee Voucher"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-muted)'
      }
    }, groups.filter(([vid, ls]) => ls.some(l => selected.has(l.key))).length, " \u0111\u01A1n \xB7 g\u1ED3m ph\xED ship ", formatVND(shipping)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-body)'
      }
    }, "T\u1ED5ng thanh to\xE1n (", selLines.length, " s\u1EA3n ph\u1EA9m): ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: '800 26px var(--font-sans)',
        color: 'var(--text-price)',
        verticalAlign: 'middle',
        marginLeft: 6,
        fontVariantNumeric: 'tabular-nums'
      }
    }, formatVND(total)))), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      disabled: selLines.length === 0,
      onClick: onCheckout,
      style: {
        minWidth: 200
      }
    }, "Mua h\xE0ng (", selLines.length, ")"))));
  }
  const chatBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    border: 0,
    background: 'transparent',
    color: 'var(--text-muted)',
    font: 'var(--type-caption)',
    cursor: 'pointer'
  };
  window.LZCart = Cart;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Checkout.jsx
try { (() => {
/* Lazadee consolidated checkout: cart splits into N sub-orders (one Order ID per
   vendor); stackable Platform + Shop + Freeship vouchers, prorated; soft-lock. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    Checkbox,
    Radio,
    StatusBadge,
    Money
  } = DS;
  const formatVND = Money.format;
  const {
    V
  } = window.LZ;
  function Countdown({
    secs
  }) {
    const [t, setT] = React.useState(secs);
    React.useEffect(() => {
      const i = setInterval(() => setT(x => x > 0 ? x - 1 : 0), 1000);
      return () => clearInterval(i);
    }, []);
    const m = Math.floor(t / 60),
      s = t % 60;
    return /*#__PURE__*/React.createElement("b", {
      className: "code",
      style: {
        color: 'var(--amber-600)'
      }
    }, String(m).padStart(2, '0'), ":", String(s).padStart(2, '0'));
  }
  function Checkout({
    cart,
    onPlaced,
    onBack
  }) {
    const [usePlatform, setUsePlatform] = React.useState(true);
    const [useFreeship, setUseFreeship] = React.useState(true);
    const [useShop, setUseShop] = React.useState(true);
    const [pay, setPay] = React.useState('wallet');
    const [oos, setOos] = React.useState(false); // simulate ERR_STOCK_UNAVAILABLE

    const groups = React.useMemo(() => {
      const m = {};
      cart.forEach(l => {
        (m[l.vendorId] = m[l.vendorId] || []).push(l);
      });
      return Object.entries(m);
    }, [cart]);
    const oosKey = cart[0] && cart[0].key;
    const liveLines = lines => oos ? lines.filter(l => l.key !== oosKey) : lines;
    const subtotal = cart.reduce((n, l) => n + (oos && l.key === oosKey ? 0 : l.price * l.qty), 0);
    const shipping = groups.reduce((n, [vid, lines]) => liveLines(lines).length ? n + V[vid].ship : n, 0);

    // stackable vouchers
    const platformDisc = usePlatform && subtotal >= 199000 ? 30000 : 0;
    const freeshipDisc = useFreeship ? Math.min(shipping, 30000) : 0;
    const shopDiscByVendor = {};
    groups.forEach(([vid, lines]) => {
      const sub = liveLines(lines).reduce((n, l) => n + l.price * l.qty, 0);
      shopDiscByVendor[vid] = useShop && sub > 0 ? Math.min(Math.round(sub * 0.15), 50000) : 0;
    });
    const shopDisc = Object.values(shopDiscByVendor).reduce((a, b) => a + b, 0);
    const total = Math.max(0, subtotal + shipping - platformDisc - freeshipDisc - shopDisc);

    // prorate platform voucher across sub-orders by subtotal weight
    const prorate = vSub => subtotal > 0 ? Math.round(platformDisc * (vSub / subtotal)) : 0;
    let orderSeq = 40;
    const canPlace = cart.length > (oos ? 1 : 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: '18px 24px 60px'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-h2)',
        color: 'var(--text-strong)',
        marginBottom: 16
      }
    }, "Thanh to\xE1n"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: card
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 20,
      style: {
        color: 'var(--color-primary)',
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Tr\u1EA7n Th\u1ECB Mai"), /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        color: 'var(--text-muted)'
      }
    }, "(+84) 912 345 678"), /*#__PURE__*/React.createElement(Badge, {
      variant: "primary"
    }, "M\u1EB7c \u0111\u1ECBnh")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-body)'
      }
    }, "123 Nguy\u1EC5n Hu\u1EC7, Ph\u01B0\u1EDDng B\u1EBFn Ngh\xE9, Qu\u1EADn 1, TP. H\u1ED3 Ch\xED Minh")), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconLeft: "pencil"
    }, "Thay \u0111\u1ED5i"))), groups.map(([vid, lines]) => {
      const vendor = V[vid];
      const live = liveLines(lines);
      const vSub = live.reduce((n, l) => n + l.price * l.qty, 0);
      const oid = 'ORD-2412-00' + orderSeq++;
      const vTotal = vSub + (live.length ? vendor.ship : 0) - (useShop ? shopDiscByVendor[vid] : 0) - (useFreeship ? Math.min(vendor.ship, 30000) : 0) - prorate(vSub);
      return /*#__PURE__*/React.createElement("div", {
        key: vid,
        style: card
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingBottom: 12,
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 4
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "store",
        size: 16,
        style: {
          color: 'var(--color-primary)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
          color: 'var(--text-strong)'
        }
      }, vendor.name), vendor.mall && /*#__PURE__*/React.createElement(Badge, {
        variant: "solid"
      }, "MALL"), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-caption)',
          color: 'var(--text-muted)'
        }
      }, "\u0110\u01A1n ri\xEAng"), /*#__PURE__*/React.createElement("span", {
        className: "code",
        style: {
          font: '600 12px var(--font-mono)',
          color: 'var(--text-body)',
          background: 'var(--gray-100)',
          padding: '2px 7px',
          borderRadius: 'var(--radius-sm)'
        }
      }, oid))), lines.map(l => {
        const dead = oos && l.key === oosKey;
        return /*#__PURE__*/React.createElement("div", {
          key: l.key,
          style: {
            display: 'flex',
            gap: 12,
            padding: '12px 0',
            borderBottom: '1px solid var(--border-subtle)',
            opacity: dead ? 0.7 : 1
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: l.img,
          style: {
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
            flex: 'none',
            filter: dead ? 'grayscale(1)' : 'none'
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body-sm)',
            color: 'var(--text-body)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }
        }, l.title), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-muted)',
            marginTop: 3
          }
        }, "Ph\xE2n lo\u1EA1i: ", l.variant), dead && /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }
        }, /*#__PURE__*/React.createElement(StatusBadge, {
          status: "ERROR",
          label: "ERR_STOCK_UNAVAILABLE",
          dot: false
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--red-600)'
          }
        }, "S\u1EA3n ph\u1EA9m v\u1EEBa h\u1EBFt h\xE0ng \u2014 \u0111\xE3 g\u1EE1 kh\u1ECFi \u0111\u01A1n."))), /*#__PURE__*/React.createElement("div", {
          style: {
            textAlign: 'right',
            flex: 'none'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)',
            color: dead ? 'var(--text-disabled)' : 'var(--text-body)',
            textDecoration: dead ? 'line-through' : 'none',
            fontVariantNumeric: 'tabular-nums'
          }
        }, formatVND(l.price)), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-muted)'
          }
        }, "x", l.qty)));
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '12px 0',
          borderBottom: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: voucherRow
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "ticket",
        size: 15,
        style: {
          color: 'var(--flash-500)'
        }
      }), /*#__PURE__*/React.createElement("span", null, "Voucher Shop ", useShop && shopDiscByVendor[vid] ? '−' + formatVND(shopDiscByVendor[vid]) : 'Chọn'), /*#__PURE__*/React.createElement(Icon, {
        name: "chevron-right",
        size: 14,
        style: {
          marginLeft: 'auto',
          color: 'var(--text-subtle)'
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: voucherRow
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "message-square",
        size: 15,
        style: {
          color: 'var(--text-muted)'
        }
      }), /*#__PURE__*/React.createElement("input", {
        placeholder: "L\u1EDDi nh\u1EAFn cho Shop\u2026",
        style: {
          border: 0,
          outline: 'none',
          font: 'var(--type-body-sm)',
          flex: 1,
          background: 'transparent'
        }
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingTop: 12
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "truck",
        size: 16,
        style: {
          color: 'var(--mint-600)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-body-sm)',
          color: 'var(--text-body)'
        }
      }, "Giao nhanh \xB7 ", formatVND(vendor.ship), useFreeship && /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--mint-600)',
          marginLeft: 6
        }
      }, "(Freeship \xE1p d\u1EE5ng)")), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          font: 'var(--type-body-sm)',
          color: 'var(--text-muted)'
        }
      }, "T\u1ED5ng \u0111\u01A1n (", live.length, " SP): ", /*#__PURE__*/React.createElement("b", {
        style: {
          color: 'var(--text-price)',
          fontSize: 16,
          fontVariantNumeric: 'tabular-nums'
        }
      }, formatVND(Math.max(0, vTotal))))));
    }), /*#__PURE__*/React.createElement("div", {
      style: card
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ticket",
      size: 18,
      style: {
        color: 'var(--color-primary)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Lazadee Voucher"), /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, "T\u1ED1i \u0111a 1 m\u1ED7i lo\u1EA1i")), /*#__PURE__*/React.createElement("label", {
      style: vchk
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: usePlatform,
      onChange: () => setUsePlatform(!usePlatform)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("b", null, "Gi\u1EA3m 30.000\u20AB"), " \xB7 \u0110\u01A1n t\u1EEB 199.000\u20AB \xB7 Voucher S\xE0n"), /*#__PURE__*/React.createElement(Badge, {
      variant: "primary"
    }, "Platform")), /*#__PURE__*/React.createElement("label", {
      style: vchk
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: useFreeship,
      onChange: () => setUseFreeship(!useFreeship)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("b", null, "Mi\u1EC5n ph\xED v\u1EADn chuy\u1EC3n"), " \xB7 Gi\u1EA3m t\u1ED1i \u0111a 30.000\u20AB ph\xED ship"), /*#__PURE__*/React.createElement(Badge, {
      variant: "mint"
    }, "Freeship")), /*#__PURE__*/React.createElement("label", {
      style: {
        ...vchk,
        borderBottom: 0
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: useShop,
      onChange: () => setUseShop(!useShop)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("b", null, "Voucher Shop \u221215%"), " \xB7 \xC1p d\u1EE5ng cho t\u1EEBng ng\u01B0\u1EDDi b\xE1n (t\u1ED1i \u0111a 50k/shop)"), /*#__PURE__*/React.createElement(Badge, {
      variant: "flash"
    }, "Shop"))), /*#__PURE__*/React.createElement("div", {
      style: card
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 12
      }
    }, "Ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n"), [['wallet', 'Ví Lazadee', 'wallet', 'Số dư 2.450.000₫'], ['cod', 'Thanh toán khi nhận hàng (COD)', 'banknote', ''], ['card', 'Thẻ tín dụng / Ghi nợ', 'credit-card', 'Visa •••• 4242']].map(([id, name, icon, meta]) => /*#__PURE__*/React.createElement("label", {
      key: id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        border: '1.5px solid ' + (pay === id ? 'var(--color-primary)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-md)',
        marginBottom: 8,
        cursor: 'pointer',
        background: pay === id ? 'var(--color-primary-tint)' : '#fff'
      }
    }, /*#__PURE__*/React.createElement(Radio, {
      name: "pay",
      checked: pay === id,
      onChange: () => setPay(id)
    }), /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 20,
      style: {
        color: 'var(--text-body)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, name), meta && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        font: 'var(--type-caption)',
        color: 'var(--text-muted)'
      }
    }, meta))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 180
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...card,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--amber-50)',
        color: 'var(--amber-600)',
        borderRadius: 'var(--radius-md)',
        padding: '9px 12px',
        font: 'var(--type-body-sm)',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", null, "T\u1ED3n kho \u0111\u01B0\u1EE3c gi\u1EEF trong ", /*#__PURE__*/React.createElement(Countdown, {
      secs: 14 * 60 + 38
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 12
      }
    }, "Chi ti\u1EBFt thanh to\xE1n"), [['Tổng tiền hàng', formatVND(subtotal)], ['Tổng phí vận chuyển', formatVND(shipping)]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: sumRow
    }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontVariantNumeric: 'tabular-nums'
      }
    }, v))), platformDisc > 0 && /*#__PURE__*/React.createElement("div", {
      style: sumRow
    }, /*#__PURE__*/React.createElement("span", null, "Voucher S\xE0n"), /*#__PURE__*/React.createElement("span", {
      style: disc
    }, "\u2212", formatVND(platformDisc))), freeshipDisc > 0 && /*#__PURE__*/React.createElement("div", {
      style: sumRow
    }, /*#__PURE__*/React.createElement("span", null, "Gi\u1EA3m ph\xED v\u1EADn chuy\u1EC3n"), /*#__PURE__*/React.createElement("span", {
      style: disc
    }, "\u2212", formatVND(freeshipDisc))), shopDisc > 0 && /*#__PURE__*/React.createElement("div", {
      style: sumRow
    }, /*#__PURE__*/React.createElement("span", null, "Voucher Shop"), /*#__PURE__*/React.createElement("span", {
      style: disc
    }, "\u2212", formatVND(shopDisc))), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px dashed var(--border-default)',
        margin: '10px 0'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "T\u1ED5ng thanh to\xE1n"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '800 26px var(--font-sans)',
        color: 'var(--text-price)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, formatVND(total))), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-muted)',
        textAlign: 'right',
        marginTop: 2
      }
    }, groups.length, " \u0111\u01A1n \xB7 ", cart.length, " s\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement(Button, {
      block: true,
      size: "lg",
      style: {
        marginTop: 16
      },
      disabled: !canPlace,
      onClick: onPlaced
    }, "\u0110\u1EB7t h\xE0ng"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-subtle)',
        textAlign: 'center',
        marginTop: 10
      }
    }, "Nh\u1EA5n \"\u0110\u1EB7t h\xE0ng\" \u0111\u1ED3ng ngh\u0129a b\u1EA1n \u0111\u1ED3ng \xFD v\u1EDBi ", /*#__PURE__*/React.createElement("a", null, "\u0110i\u1EC1u kho\u1EA3n Lazadee"))), /*#__PURE__*/React.createElement("button", {
      onClick: () => setOos(!oos),
      style: {
        width: '100%',
        border: '1px dashed var(--border-strong)',
        background: '#fff',
        color: 'var(--text-muted)',
        borderRadius: 'var(--radius-md)',
        padding: '10px',
        font: 'var(--type-caption)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      size: 13
    }), " ", oos ? 'Khôi phục tồn kho (demo)' : 'Mô phỏng: sản phẩm hết hàng giữa lúc thanh toán'))));
  }
  const card = {
    background: '#fff',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 18px',
    marginBottom: 14,
    boxShadow: 'var(--shadow-sm)'
  };
  const voucherRow = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--gray-25)',
    borderRadius: 'var(--radius-md)',
    padding: '9px 12px',
    font: 'var(--type-body-sm)',
    color: 'var(--text-body)',
    cursor: 'pointer'
  };
  const vchk = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid var(--border-subtle)',
    font: 'var(--type-body-sm)',
    color: 'var(--text-body)'
  };
  const sumRow = {
    display: 'flex',
    justifyContent: 'space-between',
    font: 'var(--type-body-sm)',
    color: 'var(--text-muted)',
    padding: '4px 0'
  };
  const disc = {
    color: 'var(--mint-600)',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600
  };
  window.LZCheckout = Checkout;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Checkout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Header.jsx
try { (() => {
/* Lazadee storefront header: utility bar, logo + search + cart, category strip. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    IconButton,
    Badge
  } = DS;
  const {
    CATEGORIES
  } = window.LZ;
  function Header({
    cartCount = 0,
    onNav,
    query,
    onQuery,
    onSearch
  }) {
    const [q, setQ] = React.useState(query || '');
    const submit = () => onSearch && onSearch(q);
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 100
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--ink-900)',
        color: 'rgba(255,255,255,.72)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: bar
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: ut
    }, "K\xEAnh ng\u01B0\u1EDDi b\xE1n"), /*#__PURE__*/React.createElement("span", {
      style: ut
    }, "Tr\u1EDF th\xE0nh Ng\u01B0\u1EDDi b\xE1n"), /*#__PURE__*/React.createElement("span", {
      style: ut
    }, "T\u1EA3i \u1EE9ng d\u1EE5ng")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        fontSize: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: ut
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 14
    }), " Th\xF4ng b\xE1o"), /*#__PURE__*/React.createElement("span", {
      style: ut
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-help",
      size: 14
    }), " H\u1ED7 tr\u1EE3"), /*#__PURE__*/React.createElement("span", {
      style: ut
    }, "vi-VN"), /*#__PURE__*/React.createElement("span", {
      style: {
        ...ut,
        color: '#fff',
        fontWeight: 600
      }
    }, "\u0110\u0103ng nh\u1EADp")))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-primary)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...bar,
        height: 76,
        gap: 28,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("a", {
      onClick: () => onNav('home'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      width: "40",
      height: "40",
      alt: "",
      style: {
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.18))'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '800 26px/1 var(--font-sans)',
        letterSpacing: '-0.02em',
        color: '#fff'
      }
    }, "lazadee")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        maxWidth: 720
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        background: '#fff',
        borderRadius: 'var(--radius-sm)',
        padding: 3,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      onKeyDown: e => e.key === 'Enter' && submit(),
      placeholder: "T\xECm ki\u1EBFm s\u1EA3n ph\u1EA9m, th\u01B0\u01A1ng hi\u1EC7u, shop\u2026",
      style: {
        flex: 1,
        border: 0,
        outline: 'none',
        height: 38,
        padding: '0 12px',
        font: 'var(--type-body)',
        background: 'transparent'
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: submit,
      style: searchBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18,
      strokeWidth: 2.4
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        marginTop: 5,
        fontSize: 11,
        color: 'rgba(255,255,255,.82)'
      }
    }, ['Smartphone', 'Áo thun', 'Serum', 'Tai nghe', 'Giày sneaker'].map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        cursor: 'pointer'
      },
      onClick: () => {
        setQ(t);
        onSearch && onSearch(t);
      }
    }, t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNav('cart'),
      style: cartBtn,
      "aria-label": "Gi\u1ECF h\xE0ng"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-cart",
      size: 26
    })), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
      style: cartBadge
    }, cartCount)), /*#__PURE__*/React.createElement("button", {
      style: cartBtn,
      "aria-label": "T\xE0i kho\u1EA3n"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 24
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderBottom: '1px solid var(--border-default)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...bar,
        height: 48,
        gap: 4,
        overflowX: 'auto'
      }
    }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.name,
      onClick: () => onSearch && onSearch(c.name),
      style: catBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16
    }), " ", c.name)))));
  }
  const bar = {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  const ut = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer'
  };
  const searchBtn = {
    width: 60,
    height: 38,
    border: 0,
    borderRadius: 'var(--radius-xs)',
    background: 'var(--color-primary)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const cartBtn = {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    border: 0,
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const cartBadge = {
    position: 'absolute',
    top: 2,
    right: 0,
    background: '#fff',
    color: 'var(--color-primary)',
    font: '700 11px/1 var(--font-sans)',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
    border: '1.5px solid var(--color-primary)'
  };
  const catBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 36,
    padding: '0 14px',
    border: 0,
    background: 'transparent',
    whiteSpace: 'nowrap',
    font: 'var(--weight-medium) var(--text-sm) var(--font-sans)',
    color: 'var(--text-body)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)'
  };
  window.LZHeader = Header;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lazadee storefront home: hero, categories, flash sale, daily discover grid. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Badge,
    Button,
    VoucherTag,
    ProductCard
  } = DS;
  const {
    PRODUCTS,
    CATEGORIES
  } = window.LZ;
  function Countdown() {
    const [t, setT] = React.useState(2 * 3600 + 47 * 60 + 12);
    React.useEffect(() => {
      const i = setInterval(() => setT(x => x > 0 ? x - 1 : 0), 1000);
      return () => clearInterval(i);
    }, []);
    const p = n => String(n).padStart(2, '0');
    const h = Math.floor(t / 3600),
      m = Math.floor(t % 3600 / 60),
      s = t % 60;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 4,
        alignItems: 'center'
      }
    }, [h, m, s].map((n, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-900)',
        fontWeight: 700
      }
    }, ":"), /*#__PURE__*/React.createElement("span", {
      style: cd
    }, p(n)))));
  }
  function SectionHead({
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-h3)',
        color: 'var(--text-strong)'
      }
    }, title), action);
  }
  function Home({
    onOpen
  }) {
    const [count, setCount] = React.useState(15);
    const sentinel = React.useRef(null);
    React.useEffect(() => {
      const el = sentinel.current;
      if (!el) return;
      const io = new IntersectionObserver(es => {
        if (es[0].isIntersecting) setCount(c => Math.min(c + 10, 60));
      }, {
        rootMargin: '300px'
      });
      io.observe(el);
      return () => io.disconnect();
    }, []);
    // build the discover feed (cycle base products, unique keys — simulates cursor batches)
    const feed = Array.from({
      length: count
    }, (_, i) => ({
      ...PRODUCTS[i % PRODUCTS.length],
      _k: i
    }));
    const flash = PRODUCTS.filter(p => p.flash).slice(0, 6);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: '18px 24px 60px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 14,
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/img/banner-sale.jpg",
      alt: "",
      style: {
        width: '100%',
        height: 320,
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(20,23,31,.82) 0%, rgba(20,23,31,.25) 60%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 48px',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "flash",
      icon: "zap",
      style: {
        alignSelf: 'flex-start',
        fontSize: 13
      }
    }, "SI\xCAU SALE 12.12"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '800 44px/1.05 var(--font-sans)',
        letterSpacing: '-0.02em',
        margin: '14px 0 8px',
        maxWidth: 460
      }
    }, "Gi\u1EA3m \u0111\u1EBFn 60% to\xE0n s\xE0n"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--text-lg)/1.4 var(--font-sans)',
        color: 'rgba(255,255,255,.85)',
        maxWidth: 380,
        marginBottom: 22
      }
    }, "Freeship 0\u20AB \xB7 Voucher t\xEDch lu\u1EF9 \xB7 Ho\xE0n xu t\u1EDBi 200k cho \u0111\u01A1n \u0111\u1EA7u ti\xEAn."), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      iconRight: "arrow-right",
      style: {
        alignSelf: 'flex-start'
      },
      onClick: () => onOpen(flash[0].id)
    }, "S\u0103n deal ngay"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: 14
      }
    }, [{
      img: 'banner-tech',
      t: 'Công nghệ chính hãng',
      s: 'Trả góp 0%'
    }, {
      img: 'cosmetics',
      t: 'Làm đẹp cùng Beauty Box',
      s: 'Mua 1 tặng 1'
    }].map(b => /*#__PURE__*/React.createElement("div", {
      key: b.img,
      style: {
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: '../../assets/img/' + b.img + '.jpg',
      alt: "",
      style: {
        width: '100%',
        height: 153,
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(0deg, rgba(20,23,31,.7), transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 16,
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 16px var(--font-sans)'
      }
    }, b.t), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'rgba(255,255,255,.85)'
      }
    }, b.s)))))), /*#__PURE__*/React.createElement("div", {
      className: "lz-card",
      style: {
        padding: '18px 20px',
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: 8
      }
    }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.name,
      style: catTile
    }, /*#__PURE__*/React.createElement("span", {
      style: catIcon
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-body)',
        textAlign: 'center'
      }
    }, c.name))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(VoucherTag, {
      kind: "platform",
      amount: "-30k",
      label: "\u0110\u01A1n t\u1EEB 199.000\u20AB"
    }), /*#__PURE__*/React.createElement(VoucherTag, {
      kind: "shop",
      amount: "-15%",
      label: "T\u1ED1i \u0111a 50.000\u20AB"
    }), /*#__PURE__*/React.createElement(VoucherTag, {
      kind: "freeship",
      amount: "0\u20AB",
      label: "Mi\u1EC5n ph\xED v\u1EADn chuy\u1EC3n"
    }), /*#__PURE__*/React.createElement(VoucherTag, {
      kind: "platform",
      amount: "-100k",
      label: "\u0110\u01A1n t\u1EEB 1.000.000\u20AB"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lz-card",
      style: {
        padding: '18px 20px',
        marginBottom: 28,
        borderTop: '3px solid var(--flash-500)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "zap",
      size: 26,
      style: {
        color: 'var(--flash-500)'
      },
      strokeWidth: 2.4
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '800 22px var(--font-sans)',
        color: 'var(--flash-500)',
        letterSpacing: '-0.01em'
      }
    }, "FLASH SALE")), /*#__PURE__*/React.createElement(Countdown, null), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--text-link)',
        font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)',
        cursor: 'pointer'
      }
    }, "Xem t\u1EA5t c\u1EA3 ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12
      }
    }, flash.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
      key: p.id
    }, window.LZ.card(p), {
      onClick: () => onOpen(p.id)
    }))))), /*#__PURE__*/React.createElement(SectionHead, {
      title: "G\u1EE3i \xFD h\xF4m nay",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)',
          color: 'var(--text-link)',
          cursor: 'pointer'
        }
      }, "Xem th\xEAm")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12
      }
    }, feed.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
      key: p._k
    }, window.LZ.card(p), {
      onClick: () => onOpen(p.id)
    })))), /*#__PURE__*/React.createElement("div", {
      ref: sentinel,
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '28px 0',
        color: 'var(--text-muted)',
        font: 'var(--type-body-sm)',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      size: 16
    }), " \u0110ang t\u1EA3i th\xEAm s\u1EA3n ph\u1EA9m\u2026"));
  }
  const cd = {
    background: 'var(--ink-900)',
    color: '#fff',
    font: '700 14px/1 var(--font-mono)',
    padding: '4px 5px',
    borderRadius: 'var(--radius-xs)',
    minWidth: 24,
    textAlign: 'center'
  };
  const catTile = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '12px 4px',
    border: 0,
    background: 'transparent',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer'
  };
  const catIcon = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'var(--color-primary-tint)',
    color: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  window.LZHome = Home;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductDetail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lazadee product detail: gallery, SKU variants, vendor, reviews. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    IconButton,
    Badge,
    PriceVND,
    Rating,
    VendorChip,
    QuantityStepper,
    StatusBadge,
    Money
  } = DS;
  const formatVND = Money.format;
  const {
    byId,
    V,
    PRODUCTS
  } = window.LZ;
  const COLORS = [{
    label: 'Đen',
    swatch: '#1A1815',
    delta: 0,
    stock: 38
  }, {
    label: 'Trắng',
    swatch: '#F1EFEC',
    delta: 0,
    stock: 12
  }, {
    label: 'Xanh navy',
    swatch: '#2A3550',
    delta: 30000,
    stock: 5
  }, {
    label: 'Hồng',
    swatch: '#FF7FA3',
    delta: 20000,
    stock: 0
  }];
  const SIZES = [{
    label: 'Tiêu chuẩn',
    delta: 0
  }, {
    label: 'Bản Pro',
    delta: 150000
  }];
  function Review({
    name,
    when,
    rating,
    variant,
    text,
    imgs,
    reply
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        padding: '18px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'var(--gray-200)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--text-muted)',
        fontWeight: 700,
        flex: 'none'
      }
    }, name[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '3px 0 6px'
      }
    }, /*#__PURE__*/React.createElement(Rating, {
      value: rating,
      size: 13,
      showNumber: false
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "success",
      icon: "badge-check"
    }, "\u0110\xE3 mua h\xE0ng"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-subtle)'
      }
    }, when, " \xB7 Ph\xE2n lo\u1EA1i: ", variant)), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-body)',
        marginBottom: imgs ? 10 : 0
      }
    }, text), imgs && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 4
      }
    }, imgs.map(m => /*#__PURE__*/React.createElement("img", {
      key: m,
      src: '../../assets/img/' + m + '.jpg',
      style: {
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-sm)',
        objectFit: 'cover'
      }
    }))), reply && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        background: 'var(--gray-50)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "store",
      size: 13,
      style: {
        color: 'var(--color-primary)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)',
        color: 'var(--color-primary)'
      }
    }, "Ph\u1EA3n h\u1ED3i c\u1EE7a Ng\u01B0\u1EDDi b\xE1n")), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, reply))), /*#__PURE__*/React.createElement("button", {
      style: {
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        border: 0,
        background: 'transparent',
        color: 'var(--text-muted)',
        font: 'var(--type-caption)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "thumbs-up",
      size: 14
    }), " H\u1EEFu \xEDch (24)"));
  }
  function ProductDetail({
    id,
    onOpen,
    onAdd,
    onGoCart
  }) {
    const p = byId(id) || PRODUCTS[0];
    const vendor = V[p.v];
    const gallery = [p.img, '../../assets/img/banner-tech.jpg', '../../assets/img/keyboard.jpg', '../../assets/img/speaker.jpg'].filter(Boolean);
    const [active, setActive] = React.useState(0);
    const [color, setColor] = React.useState(0);
    const [size, setSize] = React.useState(0);
    const [qty, setQty] = React.useState(1);
    const [follow, setFollow] = React.useState(false);
    const c = COLORS[color],
      s = SIZES[size];
    const price = p.price + c.delta + s.delta;
    const stock = c.stock;
    const soldOut = stock === 0;
    React.useEffect(() => {
      setQty(1);
    }, [color, size]);
    const add = () => onAdd({
      key: p.id + '|' + c.label + '/' + s.label,
      productId: p.id,
      vendorId: p.v,
      title: p.title,
      img: p.img,
      price,
      original: p.original,
      variant: c.label + ' / ' + s.label,
      qty,
      stock
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px 60px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-muted)',
        marginBottom: 14,
        display: 'flex',
        gap: 6,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: 'pointer'
      }
    }, "Trang ch\u1EE7"), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: 'pointer'
      }
    }, p.cat), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-body)'
      }
    }, p.title.slice(0, 30), "\u2026")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '440px 1fr',
        gap: 24,
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '1',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--gray-100)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: gallery[active],
      alt: p.title,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 10
      }
    }, gallery.map((g, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setActive(i),
      style: {
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        border: '2px solid ' + (i === active ? 'var(--color-primary)' : 'transparent'),
        padding: 0,
        cursor: 'pointer',
        background: 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: g,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: shareBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 16
    }), " Y\xEAu th\xEDch"), /*#__PURE__*/React.createElement("button", {
      style: shareBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 16
    }), " Chia s\u1EBB"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 8
      }
    }, p.mall && /*#__PURE__*/React.createElement(Badge, {
      variant: "solid"
    }, "MALL"), p.flash && /*#__PURE__*/React.createElement(Badge, {
      variant: "flash",
      icon: "zap"
    }, "FLASH SALE"), /*#__PURE__*/React.createElement(Badge, {
      variant: "outline"
    }, "Ch\xEDnh h\xE3ng 100%")), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--weight-semibold) 22px/1.3 var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 10
      }
    }, p.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Rating, {
      value: p.rating,
      count: p.sold
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--border-default)'
      }
    }, "|"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, "\u0110\xE3 b\xE1n ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-body)'
      }
    }, p.sold))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-primary-tint)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(PriceVND, {
      amount: price,
      original: p.original,
      size: "lg"
    }), /*#__PURE__*/React.createElement(Badge, {
      variant: "flash"
    }, "-", p.discountPct, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '90px 1fr',
        gap: '14px 16px',
        alignItems: 'center',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: vLabel
    }, "M\xE0u s\u1EAFc"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, COLORS.map((o, i) => /*#__PURE__*/React.createElement("button", {
      key: o.label,
      disabled: o.stock === 0,
      onClick: () => setColor(i),
      style: chip(i === color, o.stock === 0)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: o.swatch,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)'
      }
    }), " ", o.label))), /*#__PURE__*/React.createElement("span", {
      style: vLabel
    }, "Phi\xEAn b\u1EA3n"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, SIZES.map((o, i) => /*#__PURE__*/React.createElement("button", {
      key: o.label,
      onClick: () => setSize(i),
      style: chip(i === size, false)
    }, o.label, o.delta ? ' (+' + formatVND(o.delta) + ')' : ''))), /*#__PURE__*/React.createElement("span", {
      style: vLabel
    }, "S\u1ED1 l\u01B0\u1EE3ng"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(QuantityStepper, {
      value: qty,
      max: Math.max(1, stock),
      onChange: setQty
    }), soldOut ? /*#__PURE__*/React.createElement(StatusBadge, {
      status: "ERROR",
      label: "H\u1EBFt h\xE0ng",
      dot: false
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, "C\xF2n ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: stock <= 5 ? 'var(--red-600)' : 'var(--text-body)'
      }
    }, stock), " s\u1EA3n ph\u1EA9m"), stock > 0 && stock <= 5 && /*#__PURE__*/React.createElement(Badge, {
      variant: "warning"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 11
    }), " S\u1EAFp h\u1EBFt"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--amber-50)',
        color: 'var(--amber-600)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        font: 'var(--type-body-sm)',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 15
    }), " \u0110\u1EB7t h\xE0ng s\u1EBD gi\u1EEF ch\u1ED7 t\u1ED3n kho trong ", /*#__PURE__*/React.createElement("b", {
      style: {
        margin: '0 3px'
      }
    }, "15:00"), " ph\xFAt \u0111\u1EC3 b\u1EA1n ho\xE0n t\u1EA5t thanh to\xE1n."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      iconLeft: "shopping-cart",
      disabled: soldOut,
      onClick: add
    }, "Th\xEAm v\xE0o gi\u1ECF"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      disabled: soldOut,
      onClick: () => {
        add();
        onGoCart();
      }
    }, "Mua ngay")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        margin: '16px 0',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-md)',
        background: vendor.logoBg,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        font: '800 22px var(--font-sans)',
        flex: 'none'
      }
    }, vendor.name[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-lg) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, vendor.name), vendor.mall && /*#__PURE__*/React.createElement(Badge, {
      variant: "solid"
    }, "MALL"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--mint-600)',
        font: 'var(--type-caption)'
      }
    }, "\u25CF Online")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-muted)',
        marginTop: 3
      }
    }, vendor.followers, " ng\u01B0\u1EDDi theo d\xF5i \xB7 ", vendor.location, " \xB7 \u0110\xE1nh gi\xE1 shop ", vendor.rating, "\u2605")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: follow ? 'subtle' : 'secondary',
      iconLeft: follow ? 'check' : 'plus',
      onClick: () => setFollow(!follow)
    }, follow ? 'Đang theo dõi' : 'Theo dõi'), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconLeft: "message-circle"
    }, "Chat ngay"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconLeft: "store"
    }, "Xem shop"))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: 16,
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-h3)',
        color: 'var(--text-strong)'
      }
    }, "\u0110\xE1nh gi\xE1 s\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '800 32px var(--font-sans)',
        color: 'var(--gold-600)'
      }
    }, p.rating), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)'
      }
    }, "/ 5 \xB7 ", p.sold, " \u0111\xE1nh gi\xE1"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 6,
        flexWrap: 'wrap'
      }
    }, ['Tất cả', '5 Sao', '4 Sao', '3 Sao', 'Có hình ảnh', 'Đã mua hàng'].map((f, i) => /*#__PURE__*/React.createElement("button", {
      key: f,
      style: {
        height: 32,
        padding: '0 14px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid ' + (i === 0 ? 'var(--color-primary)' : 'var(--border-default)'),
        background: i === 0 ? 'var(--color-primary-tint)' : '#fff',
        color: i === 0 ? 'var(--orange-700)' : 'var(--text-body)',
        font: 'var(--type-body-sm)',
        cursor: 'pointer'
      }
    }, f))), /*#__PURE__*/React.createElement(Review, {
      name: "Nguy\u1EC5n Minh",
      when: "2026-05-28",
      rating: 5,
      variant: "\u0110en / B\u1EA3n Pro",
      text: "S\u1EA3n ph\u1EA9m \u0111\xFAng m\xF4 t\u1EA3, ch\u1EA5t l\u01B0\u1EE3ng t\u1ED1t, \u0111\xF3ng g\xF3i c\u1EA9n th\u1EADn. Giao h\xE0ng nhanh trong 2 ng\xE0y. S\u1EBD \u1EE7ng h\u1ED9 shop l\u1EA7n sau!",
      imgs: ['headphones', 'banner-tech'],
      reply: "C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng TechZone! Shop r\u1EA5t vui khi s\u1EA3n ph\u1EA9m l\xE0m b\u1EA1n h\xE0i l\xF2ng \uD83E\uDDE1"
    }), /*#__PURE__*/React.createElement(Review, {
      name: "Tr\u1EA7n Thu H\xE0",
      when: "2026-05-21",
      rating: 4,
      variant: "Tr\u1EAFng / Ti\xEAu chu\u1EA9n",
      text: "Pin tr\xE2u, \xE2m thanh \u1ED5n trong t\u1EA7m gi\xE1. Tr\u1EEB 1 sao v\xEC h\u1ED9p h\u01A1i m\xF3p khi nh\u1EADn nh\u01B0ng s\u1EA3n ph\u1EA9m v\u1EABn nguy\xEAn v\u1EB9n."
    }), /*#__PURE__*/React.createElement(Review, {
      name: "L\xEA Ho\xE0ng",
      when: "2026-05-15",
      rating: 5,
      variant: "\u0110en / Ti\xEAu chu\u1EA9n",
      text: "Ch\u1ED1ng \u1ED3n t\u1ED1t, \u0111eo \xEAm tai. \u0110\xE1ng ti\u1EC1n!",
      imgs: ['speaker']
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-h3)',
        color: 'var(--text-strong)',
        margin: '24px 0 14px'
      }
    }, "S\u1EA3n ph\u1EA9m t\u01B0\u01A1ng t\u1EF1"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12
      }
    }, PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 6).map(x => /*#__PURE__*/React.createElement(DS.ProductCard, _extends({
      key: x.id
    }, window.LZ.card(x), {
      onClick: () => onOpen(x.id)
    })))));
  }
  const vLabel = {
    font: 'var(--type-body-sm)',
    color: 'var(--text-muted)'
  };
  const shareBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    border: 0,
    background: 'transparent',
    color: 'var(--text-muted)',
    font: 'var(--type-body-sm)',
    cursor: 'pointer',
    padding: '6px 0'
  };
  function chip(on, disabled) {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      minHeight: 38,
      padding: '0 14px',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--weight-medium) var(--text-sm) var(--font-sans)',
      background: '#fff',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
      border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'),
      boxShadow: on ? 'inset 0 0 0 1px var(--color-primary)' : 'none',
      opacity: disabled ? 0.55 : 1,
      position: 'relative'
    };
  }
  window.LZProductDetail = ProductDetail;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.jsx
try { (() => {
/* Shared mock data for the Lazadee storefront kit. Exposed on window. */
(function () {
  const V = {
    techzone: {
      id: 'techzone',
      name: 'TechZone Official',
      mall: true,
      rating: 4.9,
      followers: '128k',
      location: 'TP. HCM',
      ship: 25000,
      logoBg: '#1E232E'
    },
    shoe: {
      id: 'shoe',
      name: 'Shoe Republic',
      mall: false,
      rating: 4.7,
      followers: '42,1k',
      location: 'Bình Dương',
      ship: 18000,
      logoBg: '#B53109'
    },
    boutique: {
      id: 'boutique',
      name: 'Boutique Sài Gòn',
      mall: true,
      rating: 4.8,
      followers: '67k',
      location: 'TP. HCM',
      ship: 20000,
      logoBg: '#FF2E63'
    },
    home: {
      id: 'home',
      name: 'Home & Living',
      mall: false,
      rating: 4.6,
      followers: '19,8k',
      location: 'Hà Nội',
      ship: 30000,
      logoBg: '#14B86E'
    },
    beauty: {
      id: 'beauty',
      name: 'Beauty Box',
      mall: true,
      rating: 4.9,
      followers: '203k',
      location: 'TP. HCM',
      ship: 16000,
      logoBg: '#6C2BD9'
    },
    travel: {
      id: 'travel',
      name: 'TravelGear',
      mall: false,
      rating: 4.5,
      followers: '8,4k',
      location: 'Đà Nẵng',
      ship: 22000,
      logoBg: '#2563EB'
    }
  };
  const img = n => '../../assets/img/' + n + '.jpg';
  let _id = 0;
  const P = o => {
    const src = img(o.img);
    return {
      id: 'p' + ++_id,
      sold: o.sold || '1k',
      rating: o.rating || 4.7,
      location: V[o.v].location,
      ...o,
      img: src,
      image: src
    };
  };
  const PRODUCTS = [P({
    title: 'Tai nghe Bluetooth chống ồn ANC Pro 5 — Pin 40 giờ',
    img: 'headphones',
    price: 389000,
    original: 799000,
    discountPct: 51,
    rating: 4.8,
    sold: '2,1k',
    v: 'techzone',
    cat: 'Điện tử',
    flash: true,
    freeship: true
  }), P({
    title: 'Đồng hồ thông minh Watch S2 màn AMOLED, đo SpO2',
    img: 'watch',
    price: 690000,
    original: 1290000,
    discountPct: 47,
    rating: 4.7,
    sold: '986',
    v: 'techzone',
    cat: 'Điện tử',
    mall: true,
    freeship: true
  }), P({
    title: 'Giày sneaker thể thao Air Run nam nữ êm chân',
    img: 'sneakers',
    price: 259000,
    original: 450000,
    discountPct: 42,
    rating: 4.6,
    sold: '5,4k',
    v: 'shoe',
    cat: 'Thời trang',
    flash: true
  }), P({
    title: 'Máy ảnh Mirrorless X-100 kèm lens kit 15-45mm',
    img: 'camera',
    price: 12990000,
    original: 15490000,
    discountPct: 16,
    rating: 4.9,
    sold: '214',
    v: 'techzone',
    cat: 'Điện tử',
    mall: true
  }), P({
    title: 'Kính mát thời trang UV400 chống tia cực tím',
    img: 'sunglasses',
    price: 99000,
    original: 249000,
    discountPct: 60,
    rating: 4.5,
    sold: '8,9k',
    v: 'boutique',
    cat: 'Thời trang',
    freeship: true
  }), P({
    title: 'Balo laptop chống nước 25L ngăn chống sốc',
    img: 'backpack',
    price: 189000,
    original: 320000,
    discountPct: 41,
    rating: 4.7,
    sold: '3,2k',
    v: 'travel',
    cat: 'Phụ kiện'
  }), P({
    title: 'Laptop UltraBook 14" Core i5, 16GB RAM, SSD 512GB',
    img: 'laptop',
    price: 15490000,
    original: 17990000,
    discountPct: 14,
    rating: 4.8,
    sold: '432',
    v: 'techzone',
    cat: 'Điện tử',
    mall: true,
    freeship: true
  }), P({
    title: 'Điện thoại Galaxy A-series 8GB/256GB chính hãng',
    img: 'phone',
    price: 5290000,
    original: 6490000,
    discountPct: 18,
    rating: 4.7,
    sold: '1,7k',
    v: 'techzone',
    cat: 'Điện tử',
    mall: true
  }), P({
    title: 'Cốc sứ cao cấp phong cách tối giản 350ml',
    img: 'mug',
    price: 59000,
    original: 120000,
    discountPct: 51,
    rating: 4.6,
    sold: '6,1k',
    v: 'home',
    cat: 'Nhà cửa',
    flash: true,
    freeship: true
  }), P({
    title: 'Đèn bàn LED cảm ứng 3 chế độ sáng, sạc USB',
    img: 'lamp',
    price: 149000,
    original: 299000,
    discountPct: 50,
    rating: 4.8,
    sold: '4,5k',
    v: 'home',
    cat: 'Nhà cửa',
    freeship: true
  }), P({
    title: 'Ghế sofa đơn bọc nỉ chân gỗ phong cách Bắc Âu',
    img: 'chair',
    price: 1290000,
    original: 1990000,
    discountPct: 35,
    rating: 4.7,
    sold: '198',
    v: 'home',
    cat: 'Nhà cửa'
  }), P({
    title: 'Bộ mỹ phẩm trang điểm 12 món đầy đủ cho người mới',
    img: 'cosmetics',
    price: 235000,
    original: 520000,
    discountPct: 55,
    rating: 4.9,
    sold: '12k',
    v: 'beauty',
    cat: 'Làm đẹp',
    flash: true,
    freeship: true
  }), P({
    title: 'Serum dưỡng da Vitamin C 30ml làm sáng da',
    img: 'skincare',
    price: 178000,
    original: 350000,
    discountPct: 49,
    rating: 4.8,
    sold: '9,3k',
    v: 'beauty',
    cat: 'Làm đẹp',
    mall: true,
    freeship: true
  }), P({
    title: 'Giày cao gót da mũi nhọn 7cm thanh lịch',
    img: 'heels',
    price: 320000,
    original: 590000,
    discountPct: 46,
    rating: 4.6,
    sold: '1,2k',
    v: 'shoe',
    cat: 'Thời trang'
  }), P({
    title: 'Áo khoác denim unisex form rộng phong cách Hàn',
    img: 'jacket',
    price: 245000,
    original: 420000,
    discountPct: 42,
    rating: 4.7,
    sold: '3,8k',
    v: 'boutique',
    cat: 'Thời trang',
    freeship: true
  }), P({
    title: 'Áo thun cotton basic 100% co giãn nhiều màu',
    img: 'tshirt',
    price: 89000,
    original: 150000,
    discountPct: 41,
    rating: 4.5,
    sold: '15k',
    v: 'boutique',
    cat: 'Thời trang',
    flash: true
  }), P({
    title: 'Loa bluetooth mini chống nước IPX7 bass mạnh',
    img: 'speaker',
    price: 320000,
    original: 650000,
    discountPct: 51,
    rating: 4.7,
    sold: '2,6k',
    v: 'techzone',
    cat: 'Điện tử',
    freeship: true
  }), P({
    title: 'Bàn phím cơ RGB switch blue gaming chống ồn',
    img: 'keyboard',
    price: 459000,
    original: 890000,
    discountPct: 48,
    rating: 4.8,
    sold: '1,9k',
    v: 'techzone',
    cat: 'Điện tử',
    mall: true
  }), P({
    title: 'Nước hoa nữ Eau de Parfum hương hoa cỏ 50ml',
    img: 'perfume',
    price: 420000,
    original: 850000,
    discountPct: 51,
    rating: 4.9,
    sold: '4,1k',
    v: 'beauty',
    cat: 'Làm đẹp',
    mall: true,
    freeship: true
  }), P({
    title: 'Đồng hồ cổ điển dây da nâu mặt tròn tối giản',
    img: 'watch2',
    price: 199000,
    original: 399000,
    discountPct: 50,
    rating: 4.6,
    sold: '2,3k',
    v: 'boutique',
    cat: 'Phụ kiện',
    flash: true
  })];
  const CATEGORIES = [{
    name: 'Điện tử',
    icon: 'zap'
  }, {
    name: 'Thời trang',
    icon: 'shopping-bag'
  }, {
    name: 'Làm đẹp',
    icon: 'star'
  }, {
    name: 'Nhà cửa',
    icon: 'house'
  }, {
    name: 'Phụ kiện',
    icon: 'tag'
  }, {
    name: 'Mẹ & Bé',
    icon: 'gift'
  }, {
    name: 'Thể thao',
    icon: 'package'
  }, {
    name: 'Sách',
    icon: 'file-text'
  }, {
    name: 'Bách hoá',
    icon: 'shopping-cart'
  }, {
    name: 'Voucher',
    icon: 'ticket'
  }];
  window.LZ = {
    V,
    PRODUCTS,
    CATEGORIES,
    byId: id => PRODUCTS.find(p => p.id === id),
    // only the props ProductCard understands (avoids leaking img/v/cat onto the DOM)
    card: p => ({
      title: p.title,
      image: p.image,
      price: p.price,
      original: p.original,
      discountPct: p.discountPct,
      rating: p.rating,
      sold: p.sold,
      location: p.location,
      flash: p.flash,
      mall: p.mall,
      freeship: p.freeship
    })
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/Chat.jsx
try { (() => {
/* Shared real-time chat: conversation list + thread with text, image, and
   product-card messages. Reused by vendor & customer surfaces. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Avatar,
    Badge,
    Button,
    Money
  } = DS;
  const formatVND = Money.format;
  const THREADS = [{
    id: 't1',
    name: 'Trần Thị Mai',
    last: 'Sản phẩm còn màu đen không shop?',
    unread: 2,
    online: true,
    time: '14:32'
  }, {
    id: 't2',
    name: 'Nguyễn Văn An',
    last: 'Đã nhận hàng, cảm ơn shop!',
    unread: 0,
    online: false,
    time: '12:10'
  }, {
    id: 't3',
    name: 'Lê Hoàng Phúc',
    last: '[Hình ảnh]',
    unread: 0,
    online: true,
    time: 'Hôm qua'
  }];
  const MSGS = [{
    from: 'them',
    kind: 'text',
    text: 'Chào shop, tai nghe ANC Pro 5 còn hàng màu đen không ạ?'
  }, {
    from: 'them',
    kind: 'product',
    title: 'Tai nghe Bluetooth ANC Pro 5',
    img: 'headphones',
    price: 389000
  }, {
    from: 'me',
    kind: 'text',
    text: 'Dạ chào bạn, sản phẩm còn đủ màu đen nhé. Bên mình freeship đơn từ 199k ạ.'
  }, {
    from: 'them',
    kind: 'text',
    text: 'Mình muốn xem thực tế sản phẩm được không shop?'
  }, {
    from: 'me',
    kind: 'image',
    img: 'headphones'
  }, {
    from: 'me',
    kind: 'text',
    text: 'Đây là ảnh thật bên mình chụp ạ. Bạn đặt mình gói cẩn thận gửi liền trong hôm nay nhé!'
  }, {
    from: 'them',
    kind: 'text',
    text: 'Ok shop, mình đặt luôn đây 🧡'
  }];
  function Bubble({
    m
  }) {
    const mine = m.from === 'me';
    const base = {
      maxWidth: 300,
      borderRadius: 'var(--radius-lg)',
      padding: '9px 13px',
      font: 'var(--type-body)',
      lineHeight: 1.45
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start',
        marginBottom: 10
      }
    }, !mine && /*#__PURE__*/React.createElement(Avatar, {
      name: "Tr\u1EA7n Th\u1ECB Mai",
      size: 28,
      style: {
        marginRight: 8,
        alignSelf: 'flex-end'
      }
    }), m.kind === 'text' && /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        background: mine ? 'var(--color-primary)' : '#fff',
        color: mine ? '#fff' : 'var(--text-body)',
        border: mine ? 'none' : '1px solid var(--border-subtle)'
      }
    }, m.text), m.kind === 'image' && /*#__PURE__*/React.createElement("img", {
      src: '../../assets/img/' + m.img + '.jpg',
      style: {
        width: 160,
        height: 160,
        objectFit: 'cover',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }
    }), m.kind === 'product' && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 230,
        background: '#fff',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: '../../assets/img/' + m.img + '.jpg',
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-sm)',
        objectFit: 'cover',
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-body)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, m.title), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 14px var(--font-sans)',
        color: 'var(--text-price)',
        marginTop: 3
      }
    }, formatVND(m.price)))), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid var(--border-subtle)',
        padding: '7px 10px',
        font: 'var(--weight-semibold) var(--text-xs) var(--font-sans)',
        color: 'var(--text-link)',
        textAlign: 'center'
      }
    }, "Xem s\u1EA3n ph\u1EA9m")));
  }
  function Chat() {
    const [active, setActive] = React.useState('t1');
    const [draft, setDraft] = React.useState('');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        height: 'calc(100vh - 152px)',
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14,
        borderBottom: '1px solid var(--border-subtle)',
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Tin nh\u1EAFn"), THREADS.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setActive(t.id),
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '12px 14px',
        border: 0,
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        textAlign: 'left',
        background: active === t.id ? 'var(--color-primary-tint)' : '#fff'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: t.name,
      size: 42,
      online: t.online
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px var(--font-sans)',
        color: 'var(--text-strong)',
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, t.name), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '11px var(--font-sans)',
        color: 'var(--text-subtle)'
      }
    }, t.time)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '12px var(--font-sans)',
        color: 'var(--text-muted)',
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, t.last), t.unread > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        background: 'var(--flash-500)',
        color: '#fff',
        font: '700 10px var(--font-sans)',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        display: 'grid',
        placeItems: 'center',
        padding: '0 4px'
      }
    }, t.unread)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Tr\u1EA7n Th\u1ECB Mai",
      size: 36,
      online: true
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Tr\u1EA7n Th\u1ECB Mai"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '11px var(--font-sans)',
        color: 'var(--mint-600)'
      }
    }, "\u25CF \u0110ang ho\u1EA1t \u0111\u1ED9ng")), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: "circle-help",
      style: {
        marginLeft: 'auto'
      }
    }, "\u0110\u01A1n h\xE0ng")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 18,
        background: 'var(--gray-50)'
      }
    }, MSGS.map((m, i) => /*#__PURE__*/React.createElement(Bubble, {
      key: i,
      m: m
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderTop: '1px solid var(--border-default)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: iconBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "image",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      style: iconBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "paperclip",
      size: 20
    })), /*#__PURE__*/React.createElement("input", {
      value: draft,
      onChange: e => setDraft(e.target.value),
      placeholder: "Nh\u1EADp tin nh\u1EAFn\u2026",
      style: {
        flex: 1,
        height: 42,
        border: '1.5px solid var(--border-default)',
        borderRadius: 'var(--radius-pill)',
        padding: '0 16px',
        font: 'var(--type-body)',
        outline: 'none'
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: {
        ...iconBtn,
        background: 'var(--color-primary)',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 20
    })))));
  }
  const iconBtn = {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: 0,
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    flex: 'none'
  };
  window.LZVChat = Chat;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/Chat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/Fulfillment.jsx
try { (() => {
/* Vendor: order fulfillment — prepare PAID orders, request 3PL pickup,
   generate + print waybill with tracking code. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Avatar,
    Modal,
    Money,
    Tabs
  } = DS;
  const formatVND = Money.format;
  const ORDERS = [{
    id: 'ORD-2412-0041',
    customer: 'Trần Thị Mai',
    addr: 'Q1, TP.HCM',
    items: [['Tai nghe ANC Pro 5', 'Đen / Pro', 1, 389000], ['Serum Vitamin C', '30ml', 1, 178000]],
    total: 778000,
    status: 'PAID'
  }, {
    id: 'ORD-2412-0040',
    customer: 'Nguyễn Văn An',
    addr: 'Cầu Giấy, Hà Nội',
    items: [['Đồng hồ Watch S2', 'Navy', 1, 690000]],
    total: 690000,
    status: 'PAID'
  }, {
    id: 'ORD-2412-0038',
    customer: 'Lê Hoàng Phúc',
    addr: 'Hải Châu, Đà Nẵng',
    items: [['Bàn phím cơ RGB', 'Đen/Blue', 1, 459000]],
    total: 459000,
    status: 'SHIPPED',
    waybill: 'VN931042771',
    carrier: 'Lazadee Express'
  }];
  function Fulfillment() {
    const [tab, setTab] = React.useState('PAID');
    const [waybill, setWaybill] = React.useState(null); // order being shipped
    const [shipped, setShipped] = React.useState({});
    const list = ORDERS.filter(o => tab === 'PAID' ? o.status === 'PAID' && !shipped[o.id] : tab === 'SHIPPED' ? o.status === 'SHIPPED' || shipped[o.id] : true);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1000
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'PAID',
        label: 'Chờ chuẩn bị',
        badge: ORDERS.filter(o => o.status === 'PAID' && !shipped[o.id]).length
      }, {
        id: 'SHIPPED',
        label: 'Đang giao'
      }, {
        id: 'ALL',
        label: 'Tất cả'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, list.map(o => {
      const isShipped = o.status === 'SHIPPED' || shipped[o.id];
      return /*#__PURE__*/React.createElement("div", {
        key: o.id,
        style: {
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--gray-25)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "code",
        style: {
          font: '13px var(--font-mono)',
          fontWeight: 600,
          color: 'var(--text-strong)'
        }
      }, o.id), /*#__PURE__*/React.createElement(StatusBadge, {
        status: isShipped ? 'SHIPPED' : 'PAID'
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: o.customer,
        size: 26
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-body-sm)',
          color: 'var(--text-body)'
        }
      }, o.customer, " \xB7 ", o.addr))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '14px 18px'
        }
      }, o.items.map(([n, v, q, p], i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 0',
          font: 'var(--type-body-sm)',
          color: 'var(--text-body)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "package",
        size: 15,
        style: {
          color: 'var(--text-subtle)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, n, " ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, "\xB7 ", v)), /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, "x", q), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 110,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600
        }
      }, formatVND(p))))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 18px',
          borderTop: '1px solid var(--border-subtle)'
        }
      }, isShipped ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Badge, {
        variant: "mint",
        icon: "truck"
      }, o.carrier || 'Lazadee Express'), /*#__PURE__*/React.createElement("span", {
        className: "code",
        style: {
          font: '13px var(--font-mono)',
          color: 'var(--text-body)'
        }
      }, "M\xE3 V\u0110: ", o.waybill || 'VN' + Math.floor(900000000 + Math.random() * 99999999)), /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconLeft: "printer",
        style: {
          marginLeft: 'auto'
        },
        onClick: () => setWaybill(o)
      }, "In l\u1EA1i v\u1EADn \u0111\u01A1n")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-body-sm)',
          color: 'var(--text-muted)'
        }
      }, "T\u1ED5ng \u0111\u01A1n: ", /*#__PURE__*/React.createElement("b", {
        style: {
          color: 'var(--text-price)'
        }
      }, formatVND(o.total))), /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        iconLeft: "truck",
        style: {
          marginLeft: 'auto'
        },
        onClick: () => setWaybill(o)
      }, "Y\xEAu c\u1EA7u l\u1EA5y h\xE0ng (3PL)"))));
    })), /*#__PURE__*/React.createElement(Modal, {
      open: !!waybill,
      onClose: () => setWaybill(null),
      width: 420,
      title: "V\u1EADn \u0111\u01A1n 3PL",
      footer: waybill && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setWaybill(null)
      }, "\u0110\xF3ng"), /*#__PURE__*/React.createElement(Button, {
        iconLeft: "printer",
        onClick: () => {
          setShipped(s => ({
            ...s,
            [waybill.id]: true
          }));
          setWaybill(null);
        }
      }, "In & x\xE1c nh\u1EADn giao"))
    }, waybill && (() => {
      const wb = waybill.waybill || 'VN931042771';
      return /*#__PURE__*/React.createElement("div", {
        style: {
          border: '2px dashed var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: 18
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 12,
          borderBottom: '1px solid var(--border-default)'
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: "../../assets/logomark.svg",
        width: "28",
        height: "28",
        alt: ""
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '800 16px var(--font-sans)',
          color: 'var(--text-strong)'
        }
      }, "Lazadee Express"), /*#__PURE__*/React.createElement(Badge, {
        variant: "primary",
        style: {
          marginLeft: 'auto'
        }
      }, "COD")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 1.5,
          height: 54,
          margin: '14px 0 6px',
          alignItems: 'stretch'
        }
      }, Array.from({
        length: 48
      }).map((_, i) => /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          flex: i * 7 % 3 + 1,
          background: i % 2 ? '#fff' : 'var(--ink-900)'
        }
      }))), /*#__PURE__*/React.createElement("div", {
        className: "code",
        style: {
          textAlign: 'center',
          font: '700 16px var(--font-mono)',
          letterSpacing: '.12em',
          color: 'var(--text-strong)',
          marginBottom: 14
        }
      }, wb), /*#__PURE__*/React.createElement(Row, {
        k: "Ng\u01B0\u1EDDi nh\u1EADn",
        v: waybill.customer
      }), /*#__PURE__*/React.createElement(Row, {
        k: "\u0110\u1ECBa ch\u1EC9",
        v: waybill.addr
      }), /*#__PURE__*/React.createElement(Row, {
        k: "Ki\u1EC7n h\xE0ng",
        v: waybill.items.length + ' sản phẩm'
      }), /*#__PURE__*/React.createElement(Row, {
        k: "Thu h\u1ED9 (COD)",
        v: formatVND(waybill.total),
        strong: true
      }));
    })()));
  }
  function Row({
    k,
    v,
    strong
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        font: 'var(--type-body-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)'
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        color: strong ? 'var(--text-price)' : 'var(--text-body)',
        fontWeight: strong ? 700 : 500,
        fontVariantNumeric: 'tabular-nums'
      }
    }, v));
  }
  window.LZVFulfillment = Fulfillment;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/Fulfillment.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/Onboarding.jsx
try { (() => {
/* Vendor: KYC onboarding — upload ID / business license (PDF/JPG/PNG, <10MB),
   status states PENDING / VERIFIED / REJECTED with reason. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Input,
    Select
  } = DS;

  // Try these to preview each state: 'PENDING' | 'VERIFIED' | 'REJECTED'
  function Onboarding() {
    const [state, setState] = React.useState('VERIFIED');
    const docs = [{
      key: 'id_front',
      label: 'CCCD / CMND — mặt trước',
      done: true,
      file: 'cccd-truoc.jpg',
      size: '2,1 MB'
    }, {
      key: 'id_back',
      label: 'CCCD / CMND — mặt sau',
      done: true,
      file: 'cccd-sau.jpg',
      size: '1,9 MB'
    }, {
      key: 'license',
      label: 'Giấy phép kinh doanh',
      done: state !== 'REJECTED',
      file: 'gpkd.pdf',
      size: '3,4 MB'
    }];
    const banner = {
      PENDING: {
        v: 'warning',
        icon: 'clock',
        t: 'Hồ sơ đang chờ duyệt',
        s: 'Đội ngũ Lazadee sẽ xét duyệt trong vòng 24 giờ. Bạn chưa thể đăng bán cho đến khi được duyệt.'
      },
      VERIFIED: {
        v: 'success',
        icon: 'badge-check',
        t: 'Hồ sơ đã được xác minh',
        s: 'Tài khoản của bạn đã VERIFIED — bạn có thể đăng bán sản phẩm và nhận thanh toán.'
      },
      REJECTED: {
        v: 'danger',
        icon: 'triangle-alert',
        t: 'Hồ sơ bị từ chối',
        s: 'Lý do: Ảnh giấy phép kinh doanh bị mờ, không đọc được. Vui lòng tải lại và gửi duyệt.'
      }
    }[state];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 680
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 16,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-subtle)'
      }
    }, "Xem tr\u1EA1ng th\xE1i (demo):"), ['PENDING', 'VERIFIED', 'REJECTED'].map(s => /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: () => setState(s),
      style: {
        height: 28,
        padding: '0 12px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid ' + (state === s ? 'var(--color-primary)' : 'var(--border-default)'),
        background: state === s ? 'var(--color-primary-tint)' : '#fff',
        color: state === s ? 'var(--orange-700)' : 'var(--text-muted)',
        font: '600 12px var(--font-sans)',
        cursor: 'pointer'
      }
    }, s))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        background: `var(--${banner.v === 'success' ? 'green' : banner.v === 'warning' ? 'amber' : 'red'}-50)`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: banner.icon,
      size: 22,
      style: {
        color: `var(--${banner.v === 'success' ? 'green' : banner.v === 'warning' ? 'amber' : 'red'}-600)`,
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, banner.t), /*#__PURE__*/React.createElement(StatusBadge, {
      status: state
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-body)',
        marginTop: 4
      }
    }, banner.s))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 22,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 16
      }
    }, "Th\xF4ng tin ng\u01B0\u1EDDi b\xE1n"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "T\xEAn shop",
      defaultValue: "TechZone Official",
      required: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Lo\u1EA1i h\xECnh",
      defaultValue: "Doanh nghi\u1EC7p"
    }, /*#__PURE__*/React.createElement("option", null, "C\xE1 nh\xE2n"), /*#__PURE__*/React.createElement("option", null, "H\u1ED9 kinh doanh"), /*#__PURE__*/React.createElement("option", null, "Doanh nghi\u1EC7p")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "S\u1ED1 CCCD / MST",
      defaultValue: "0312xxxxxx",
      required: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Ng\u01B0\u1EDDi \u0111\u1EA1i di\u1EC7n",
      defaultValue: "\u0110\u1EB7ng Qu\u1ED1c Huy",
      required: true
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 22,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Gi\u1EA5y t\u1EDD \u0111\u1ECBnh danh"), /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, "PDF / JPG / PNG \xB7 < 10MB")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 12
      }
    }, docs.map(d => /*#__PURE__*/React.createElement("div", {
      key: d.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        border: '1.5px dashed ' + (d.done ? 'var(--mint-500)' : 'var(--border-strong)'),
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        background: d.done ? 'var(--mint-50)' : 'var(--gray-25)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: d.done ? 'circle-check' : 'upload',
      size: 22,
      style: {
        color: d.done ? 'var(--mint-600)' : 'var(--text-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, d.label), d.done ? /*#__PURE__*/React.createElement("div", {
      className: "code",
      style: {
        font: '12px var(--font-mono)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, d.file, " \xB7 ", d.size) : /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-subtle)',
        marginTop: 2
      }
    }, "K\xE9o th\u1EA3 ho\u1EB7c b\u1EA5m \u0111\u1EC3 t\u1EA3i l\xEAn")), /*#__PURE__*/React.createElement(Button, {
      variant: d.done ? 'ghost' : 'secondary',
      size: "sm",
      iconLeft: d.done ? 'refresh-cw' : 'upload'
    }, d.done ? 'Thay đổi' : 'Tải lên'))))), state !== 'VERIFIED' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost"
    }, "L\u01B0u nh\xE1p"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: "send"
    }, state === 'REJECTED' ? 'Gửi lại hồ sơ' : 'Gửi duyệt KYC')));
  }
  window.LZVOnboarding = Onboarding;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/Onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/Overview.jsx
try { (() => {
/* Vendor overview: KPI stats, 7-day sales chart, recent orders, KYC banner. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Money
  } = DS;
  const formatVND = Money.format;
  const {
    WALLET,
    SALES_7D,
    ORDERS
  } = window.LZV;
  function Stat({
    icon,
    label,
    value,
    delta,
    tone
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '16px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        background: tone.bg,
        color: tone.fg,
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 17
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 13px var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, label)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 26px var(--font-sans)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), delta && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        font: '600 12px var(--font-sans)',
        color: 'var(--green-600)',
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up-right",
      size: 13
    }), " ", delta));
  }
  function Overview({
    onNav
  }) {
    const max = Math.max(...SALES_7D.map(d => d.v));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--green-50)',
        border: '1px solid #BCEBCF',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check",
      size: 20,
      style: {
        color: 'var(--green-600)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-body)'
      }
    }, "T\xE0i kho\u1EA3n \u0111\xE3 ", /*#__PURE__*/React.createElement("b", null, "x\xE1c minh KYC"), " \u2014 b\u1EA1n c\xF3 th\u1EC3 \u0111\u0103ng b\xE1n v\xE0 nh\u1EADn thanh to\xE1n."), /*#__PURE__*/React.createElement(StatusBadge, {
      status: "VERIFIED"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        marginLeft: 'auto'
      },
      iconRight: "chevron-right"
    }, "Xem h\u1ED3 s\u01A1")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      icon: "banknote",
      label: "Doanh thu th\xE1ng",
      value: formatVND(WALLET.monthRevenue),
      delta: '+' + WALLET.monthGrowth + '%',
      tone: {
        bg: 'var(--color-primary-tint)',
        fg: 'var(--color-primary)'
      }
    }), /*#__PURE__*/React.createElement(Stat, {
      icon: "wallet",
      label: "S\u1ED1 d\u01B0 kh\u1EA3 d\u1EE5ng",
      value: formatVND(WALLET.available),
      tone: {
        bg: 'var(--mint-50)',
        fg: 'var(--mint-600)'
      }
    }), /*#__PURE__*/React.createElement(Stat, {
      icon: "lock",
      label: "\u0110ang gi\u1EEF (Escrow)",
      value: formatVND(WALLET.held),
      tone: {
        bg: 'var(--amber-50)',
        fg: 'var(--amber-600)'
      }
    }), /*#__PURE__*/React.createElement(Stat, {
      icon: "package",
      label: "\u0110\u01A1n c\u1EA7n x\u1EED l\xFD",
      value: "2",
      tone: {
        bg: 'var(--blue-50)',
        fg: 'var(--blue-600)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '18px 20px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Doanh thu 7 ng\xE0y"), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        font: 'var(--type-caption)',
        color: 'var(--text-muted)'
      }
    }, "\u0110\u01A1n v\u1ECB: tri\u1EC7u \u20AB")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 14,
        height: 180,
        padding: '0 4px'
      }
    }, SALES_7D.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 11px var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, d.v), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: d.v / max * 140,
        borderRadius: '6px 6px 0 0',
        background: i === SALES_7D.length - 2 ? 'var(--color-primary)' : 'var(--orange-200)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, d.d))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '18px 20px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "D\xF2ng ti\u1EC1n Escrow"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        marginTop: 16
      }
    }, [{
      ic: 'credit-card',
      t: 'Khách thanh toán',
      s: 'Tiền vào escrow của sàn',
      c: 'var(--blue-600)',
      bg: 'var(--blue-50)'
    }, {
      ic: 'package',
      t: 'Shop giao hàng',
      s: 'Tạo waybill + mã vận đơn',
      c: 'var(--purple-500)',
      bg: 'var(--purple-50)'
    }, {
      ic: 'circle-check',
      t: 'Khách xác nhận',
      s: 'Đơn chuyển COMPLETED',
      c: 'var(--mint-600)',
      bg: 'var(--mint-50)'
    }, {
      ic: 'hand-coins',
      t: 'Giải ngân về ví',
      s: 'Net = Gross − hoa hồng',
      c: 'var(--green-600)',
      bg: 'var(--green-50)'
    }].map((s, i, arr) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: s.bg,
        color: s.c,
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.ic,
      size: 17
    })), i < arr.length - 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 2,
        flex: 1,
        background: 'var(--border-default)',
        margin: '2px 0'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: i < arr.length - 1 ? 14 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, s.t), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, s.s))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        marginTop: 16,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "\u0110\u01A1n h\xE0ng g\u1EA7n \u0111\xE2y"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        marginLeft: 'auto'
      },
      iconRight: "chevron-right",
      onClick: () => onNav('orders')
    }, "Xem t\u1EA5t c\u1EA3")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        font: '600 12px var(--font-sans)',
        color: 'var(--text-muted)',
        textAlign: 'left',
        background: 'var(--gray-25)'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "M\xE3 \u0111\u01A1n"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Kh\xE1ch h\xE0ng"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "SP"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Gi\xE1 tr\u1ECB"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Th\u1EDDi gian"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Tr\u1EA1ng th\xE1i"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Thao t\xE1c"))), /*#__PURE__*/React.createElement("tbody", null, ORDERS.map(o => /*#__PURE__*/React.createElement("tr", {
      key: o.id,
      style: {
        borderTop: '1px solid var(--border-subtle)',
        font: '13px var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        fontSize: 12
      }
    }, o.id)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, o.customer), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-muted)'
      }
    }, o.items), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }
    }, formatVND(o.total)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-muted)',
        fontSize: 12
      }
    }, o.when), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: o.status
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, o.status === 'PAID' ? /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "truck"
    }, "Chu\u1EA9n b\u1ECB") : /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Chi ti\u1EBFt"))))))));
  }
  const th = {
    padding: '10px 18px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '12px 18px',
    whiteSpace: 'nowrap'
  };
  window.LZVOverview = Overview;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/Overview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/Products.jsx
try { (() => {
/* Vendor: product management with SKU variants (price>0, stock>=0), draft vs
   published. Publish is blocked until shop KYC is VERIFIED. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    Input,
    Switch,
    Money,
    Tabs
  } = DS;
  const formatVND = Money.format;
  const PRODUCTS = [{
    name: 'Tai nghe Bluetooth ANC Pro 5',
    img: 'headphones',
    skus: 4,
    price: 389000,
    stock: 38,
    sold: '2,1k',
    state: 'PUBLISHED'
  }, {
    name: 'Đồng hồ thông minh Watch S2',
    img: 'watch',
    skus: 3,
    price: 690000,
    stock: 12,
    sold: '986',
    state: 'PUBLISHED'
  }, {
    name: 'Loa bluetooth mini IPX7',
    img: 'speaker',
    skus: 2,
    price: 320000,
    stock: 0,
    sold: '2,6k',
    state: 'PUBLISHED'
  }, {
    name: 'Bàn phím cơ RGB switch blue',
    img: 'keyboard',
    skus: 6,
    price: 459000,
    stock: 54,
    sold: '1,9k',
    state: 'DRAFT'
  }, {
    name: 'Camera Mirrorless X-100 (bản mới)',
    img: 'camera',
    skus: 1,
    price: 12990000,
    stock: 8,
    sold: '—',
    state: 'DRAFT'
  }];
  function VariantRow({
    color,
    size,
    price,
    stock,
    onErr
  }) {
    const [p, setP] = React.useState(price);
    const [s, setS] = React.useState(stock);
    const priceErr = Number(p) <= 0;
    const stockErr = Number(s) < 0;
    return /*#__PURE__*/React.createElement("tr", {
      style: {
        borderTop: '1px solid var(--border-subtle)',
        font: '13px var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px'
      }
    }, color), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px'
      }
    }, size), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px',
        width: 170
      }
    }, /*#__PURE__*/React.createElement(Input, {
      value: p,
      onChange: e => setP(e.target.value.replace(/\D/g, '')),
      iconRight: "banknote",
      invalid: priceErr
    }), priceErr && /*#__PURE__*/React.createElement("div", {
      style: {
        font: '11px var(--font-sans)',
        color: 'var(--red-600)',
        marginTop: 3
      }
    }, "Gi\xE1 ph\u1EA3i > 0")), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px',
        width: 120
      }
    }, /*#__PURE__*/React.createElement(Input, {
      value: s,
      onChange: e => setS(e.target.value.replace(/[^0-9-]/g, '')),
      invalid: stockErr
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px',
        width: 150
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "code",
      style: {
        fontSize: 12,
        color: 'var(--text-muted)'
      }
    }, "SKU\xB7", color.slice(0, 2).toUpperCase(), "\xB7", size)));
  }
  function Editor({
    onClose
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 760
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: 0,
        background: 'transparent',
        color: 'var(--text-muted)',
        font: 'var(--type-body-sm)',
        cursor: 'pointer',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 16
    }), " Quay l\u1EA1i danh s\xE1ch"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 22,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 16
      }
    }, "Th\xF4ng tin c\u01A1 b\u1EA3n"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "T\xEAn s\u1EA3n ph\u1EA9m",
      defaultValue: "B\xE0n ph\xEDm c\u01A1 RGB switch blue",
      required: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Danh m\u1EE5c",
      defaultValue: "\u0110i\u1EC7n t\u1EED > Ph\u1EE5 ki\u1EC7n m\xE1y t\xEDnh"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Th\u01B0\u01A1ng hi\u1EC7u",
      defaultValue: "No Brand"
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 22,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Ph\xE2n lo\u1EA1i (SKU)"), /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, "Gi\xE1 > 0 \xB7 T\u1ED3n \u2265 0"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: "plus",
      style: {
        marginLeft: 'auto'
      }
    }, "Th\xEAm ph\xE2n lo\u1EA1i")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        font: '600 12px var(--font-sans)',
        color: 'var(--text-muted)',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '0 14px 8px'
      }
    }, "M\xE0u"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '0 14px 8px'
      }
    }, "Switch"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '0 14px 8px'
      }
    }, "Gi\xE1 (\u20AB)"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '0 14px 8px'
      }
    }, "T\u1ED3n kho"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '0 14px 8px'
      }
    }, "M\xE3 SKU"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement(VariantRow, {
      color: "\u0110en",
      size: "Blue",
      price: "459000",
      stock: "30"
    }), /*#__PURE__*/React.createElement(VariantRow, {
      color: "\u0110en",
      size: "Red",
      price: "479000",
      stock: "24"
    }), /*#__PURE__*/React.createElement(VariantRow, {
      color: "Tr\u1EAFng",
      size: "Blue",
      price: "489000",
      stock: "0"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: "file-text"
    }, "L\u01B0u nh\xE1p"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: "check"
    }, "\u0110\u0103ng b\xE1n"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--type-caption)',
        color: 'var(--mint-600)',
        marginLeft: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check",
      size: 14
    }), " Shop \u0111\xE3 VERIFIED \u2014 \u0111\u01B0\u1EE3c ph\xE9p \u0111\u0103ng b\xE1n")));
  }
  function Products() {
    const [tab, setTab] = React.useState('all');
    const [editing, setEditing] = React.useState(false);
    if (editing) return /*#__PURE__*/React.createElement(Editor, {
      onClose: () => setEditing(false)
    });
    const list = PRODUCTS.filter(p => tab === 'all' || (tab === 'pub' ? p.state === 'PUBLISHED' : p.state === 'DRAFT'));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1040
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Tất cả',
        badge: PRODUCTS.length
      }, {
        id: 'pub',
        label: 'Đang bán',
        badge: PRODUCTS.filter(p => p.state === 'PUBLISHED').length
      }, {
        id: 'draft',
        label: 'Bản nháp',
        badge: PRODUCTS.filter(p => p.state === 'DRAFT').length
      }]
    })), /*#__PURE__*/React.createElement(Button, {
      iconLeft: "plus-circle",
      onClick: () => setEditing(true)
    }, "Th\xEAm s\u1EA3n ph\u1EA9m")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        font: '600 12px var(--font-sans)',
        color: 'var(--text-muted)',
        textAlign: 'left',
        background: 'var(--gray-25)'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "S\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "SKU"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Gi\xE1"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Kho"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "\u0110\xE3 b\xE1n"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Tr\u1EA1ng th\xE1i"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }))), /*#__PURE__*/React.createElement("tbody", null, list.map(p => /*#__PURE__*/React.createElement("tr", {
      key: p.name,
      style: {
        borderTop: '1px solid var(--border-subtle)',
        font: '13px var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: '../../assets/img/' + p.img + '.jpg',
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-md)',
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 13px var(--font-sans)',
        color: 'var(--text-strong)',
        maxWidth: 280,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, p.name))), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-muted)'
      }
    }, p.skus, " lo\u1EA1i"), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        fontWeight: 600,
        color: 'var(--text-price)'
      }
    }, formatVND(p.price)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        color: p.stock === 0 ? 'var(--red-600)' : 'var(--text-body)',
        fontWeight: p.stock === 0 ? 600 : 400
      }
    }, p.stock === 0 ? 'Hết' : p.stock), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        color: 'var(--text-muted)'
      }
    }, p.sold), /*#__PURE__*/React.createElement("td", {
      style: td
    }, p.state === 'PUBLISHED' ? /*#__PURE__*/React.createElement(Badge, {
      variant: "success",
      icon: "circle-check"
    }, "\u0110ang b\xE1n") : /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral",
      icon: "file-text"
    }, "Nh\xE1p")), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: "pencil",
      onClick: () => setEditing(true)
    }, "S\u1EEDa")))))))));
  }
  const th = {
    padding: '11px 16px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '12px 16px',
    whiteSpace: 'nowrap'
  };
  window.LZVProducts = Products;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/Products.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/VendorShell.jsx
try { (() => {
/* Vendor dashboard shell: dark sidebar nav + topbar. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Badge,
    StatusBadge
  } = DS;
  const {
    NAV,
    SHOP
  } = window.LZV;
  function VendorShell({
    active,
    onNav,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '232px 1fr',
        minHeight: '100vh',
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("aside", {
      style: {
        background: 'var(--ink-900)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '18px 18px 16px'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      width: "32",
      height: "32",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.05
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 18px var(--font-sans)',
        letterSpacing: '-0.02em',
        color: '#fff'
      }
    }, "lazadee"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 9px var(--font-sans)',
        letterSpacing: '.14em',
        color: 'var(--orange-400)',
        textTransform: 'uppercase'
      }
    }, "Seller Center"))), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '0 12px 12px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,.06)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-primary)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        font: '800 15px var(--font-sans)',
        flex: 'none'
      }
    }, "T"), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px var(--font-sans)',
        color: '#fff',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, SHOP.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        font: '11px var(--font-sans)',
        color: 'var(--mint-500)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "badge-check",
      size: 12
    }), " \u0110\xE3 x\xE1c minh"))), /*#__PURE__*/React.createElement("nav", {
      style: {
        flex: 1,
        padding: '4px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
      }
    }, NAV.map(n => {
      const on = n.id === active;
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        onClick: () => onNav(n.id),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 12px',
          height: 44,
          borderRadius: 'var(--radius-md)',
          border: 0,
          cursor: 'pointer',
          textAlign: 'left',
          background: on ? 'var(--color-primary)' : 'transparent',
          color: on ? '#fff' : 'rgba(255,255,255,.66)',
          font: (on ? '600' : '500') + ' 14px var(--font-sans)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: n.icon,
        size: 19
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, n.name), n.badge && /*#__PURE__*/React.createElement("span", {
        style: {
          background: on ? 'rgba(255,255,255,.25)' : 'var(--flash-500)',
          color: '#fff',
          font: '700 11px var(--font-sans)',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          display: 'grid',
          placeItems: 'center',
          padding: '0 5px'
        }
      }, n.badge));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNav('overview'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '0 12px',
        height: 44,
        width: '100%',
        borderRadius: 'var(--radius-md)',
        border: 0,
        cursor: 'pointer',
        background: 'transparent',
        color: 'rgba(255,255,255,.5)',
        font: '500 14px var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 19
    }), " \u0110\u0103ng xu\u1EA5t"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        height: 64,
        background: '#fff',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--weight-bold) var(--text-2xl) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, (NAV.find(n => n.id === active) || {}).name), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 12,
        color: 'var(--text-subtle)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    })), /*#__PURE__*/React.createElement("input", {
      placeholder: "T\xECm \u0111\u01A1n, s\u1EA3n ph\u1EA9m\u2026",
      style: {
        width: 260,
        height: 40,
        paddingLeft: 36,
        border: '1.5px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        font: 'var(--type-body-sm)',
        outline: 'none'
      }
    })), /*#__PURE__*/React.createElement("button", {
      style: ico
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      style: ico
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-help",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        height: 28,
        background: 'var(--border-default)',
        margin: '0 4px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'var(--ink-800)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        font: '700 14px var(--font-sans)'
      }
    }, "T"))), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        padding: '24px 28px 60px',
        minWidth: 0
      }
    }, children)));
  }
  const ico = {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    border: 0,
    background: 'transparent',
    color: 'var(--text-body)',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center'
  };
  window.LZVShell = VendorShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/VendorShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/Wallet.jsx
try { (() => {
/* Vendor escrow wallet: held vs available balances, commission breakdown,
   append-only transaction ledger, withdrawal request. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const {
    Icon,
    Button,
    Badge,
    StatusBadge,
    Money
  } = DS;
  const formatVND = Money.format;
  const {
    WALLET,
    LEDGER
  } = window.LZV;
  const TYPE_BADGE = {
    SALE: ['warning', 'Bán hàng'],
    RELEASE: ['success', 'Giải ngân'],
    PAYOUT: ['neutral', 'Rút tiền'],
    REFUND: ['danger', 'Hoàn tiền']
  };
  function Wallet() {
    const [show, setShow] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...bal,
        background: 'linear-gradient(135deg, var(--ink-800), var(--ink-900))',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "wallet",
      size: 18,
      style: {
        color: 'var(--mint-500)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px var(--font-sans)',
        color: 'rgba(255,255,255,.78)'
      }
    }, "S\u1ED1 d\u01B0 kh\u1EA3 d\u1EE5ng")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 30px var(--font-sans)',
        margin: '12px 0 4px',
        fontVariantNumeric: 'tabular-nums'
      }
    }, formatVND(WALLET.available)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'rgba(255,255,255,.6)'
      }
    }, "C\xF3 th\u1EC3 r\xFAt v\u1EC1 ng\xE2n h\xE0ng"), /*#__PURE__*/React.createElement(Button, {
      block: true,
      style: {
        marginTop: 16
      },
      iconLeft: "hand-coins"
    }, "Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...bal,
        border: '1px solid var(--amber-200, #FCE3B0)',
        background: 'var(--amber-50)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 18,
      style: {
        color: 'var(--amber-600)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px var(--font-sans)',
        color: 'var(--amber-600)'
      }
    }, "\u0110ang gi\u1EEF (Escrow)")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 30px var(--font-sans)',
        margin: '12px 0 4px',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, formatVND(WALLET.held)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Gi\u1EA3i ng\xE2n khi \u0111\u01A1n chuy\u1EC3n COMPLETED"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        font: '12px var(--font-sans)',
        color: 'var(--amber-600)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14
    }), " T\u1EF1 \u0111\u1ED9ng gi\u1EA3i ng\xE2n sau khi kh\xE1ch x\xE1c nh\u1EADn")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...bal,
        border: '1px solid var(--border-subtle)',
        background: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chart-column",
      size: 18,
      style: {
        color: 'var(--color-primary)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Doanh thu th\xE1ng 6")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 30px var(--font-sans)',
        margin: '12px 0 4px',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, formatVND(WALLET.monthRevenue)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        font: '600 12px var(--font-sans)',
        color: 'var(--green-600)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up-right",
      size: 14
    }), " +", WALLET.monthGrowth, "% so v\u1EDBi th\xE1ng tr\u01B0\u1EDBc"))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '18px 20px',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "receipt",
      size: 18,
      style: {
        color: 'var(--color-primary)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "C\xE1ch t\xEDnh ti\u1EC1n v\u1EC1 v\xED"), /*#__PURE__*/React.createElement(Badge, {
      variant: "outline"
    }, "Ph\xED s\xE0n 5%")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Flow, {
      label: "T\u1ED5ng ti\u1EC1n h\xE0ng (Gross)",
      value: "778.000\u20AB",
      tone: "var(--text-strong)"
    }), /*#__PURE__*/React.createElement(Op, null, "\u2212"), /*#__PURE__*/React.createElement(Flow, {
      label: "Ph\xED hoa h\u1ED3ng (5%)",
      value: "38.900\u20AB",
      tone: "var(--gray-500)"
    }), /*#__PURE__*/React.createElement(Op, null, "="), /*#__PURE__*/React.createElement(Flow, {
      label: "Th\u1EF1c nh\u1EADn (Net) \u2192 Escrow",
      value: "739.100\u20AB",
      tone: "var(--amber-600)",
      bg: "var(--amber-50)"
    }), /*#__PURE__*/React.createElement(Op, null, "\u2192"), /*#__PURE__*/React.createElement(Flow, {
      label: "Gi\u1EA3i ng\xE2n khi ho\xE0n t\u1EA5t",
      value: "739.100\u20AB",
      tone: "var(--green-600)",
      bg: "var(--green-50)"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--text-base) var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "S\u1ED5 giao d\u1ECBch v\xED"), /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 11
    }), " Append-only"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: "sliders-horizontal"
    }, "L\u1ECDc"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: "download"
    }, "Xu\u1EA5t CSV"))), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        font: '600 12px var(--font-sans)',
        color: 'var(--text-muted)',
        textAlign: 'left',
        background: 'var(--gray-25)'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Th\u1EDDi gian"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "M\xE3 tham chi\u1EBFu"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Lo\u1EA1i"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Di\u1EC5n gi\u1EA3i"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Gross"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Hoa h\u1ED3ng"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "Net"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'center'
      }
    }, "Tr\u1EA1ng th\xE1i"))), /*#__PURE__*/React.createElement("tbody", null, LEDGER.map((r, i) => {
      const [bv, bl] = TYPE_BADGE[r.type];
      const neg = r.net < 0;
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderTop: '1px solid var(--border-subtle)',
          font: '13px var(--font-sans)',
          color: 'var(--text-body)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          color: 'var(--text-muted)',
          fontSize: 12
        }
      }, r.date), /*#__PURE__*/React.createElement("td", {
        style: td
      }, /*#__PURE__*/React.createElement("span", {
        className: "code",
        style: {
          fontSize: 12
        }
      }, r.ref)), /*#__PURE__*/React.createElement("td", {
        style: td
      }, /*#__PURE__*/React.createElement(Badge, {
        variant: bv
      }, bl)), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          color: 'var(--text-muted)'
        }
      }, r.label), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          textAlign: 'right',
          fontWeight: 500
        }
      }, r.gross ? formatVND(r.gross) : '—'), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          textAlign: 'right',
          color: 'var(--gray-500)'
        }
      }, r.commission ? formatVND(-Math.abs(r.commission)) : '—'), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          textAlign: 'right',
          fontWeight: 700,
          color: neg ? 'var(--red-600)' : 'var(--green-600)'
        }
      }, neg ? '' : '+', formatVND(r.net)), /*#__PURE__*/React.createElement("td", {
        style: {
          ...td,
          textAlign: 'center'
        }
      }, r.bucket === 'HELD' && /*#__PURE__*/React.createElement(StatusBadge, {
        status: "HELD",
        label: "Escrow",
        dot: false
      }), r.bucket === 'AVAILABLE' && /*#__PURE__*/React.createElement(StatusBadge, {
        status: "AVAILABLE",
        label: "Kh\u1EA3 d\u1EE5ng",
        dot: false
      }), r.bucket === 'PAYOUT' && /*#__PURE__*/React.createElement(Badge, {
        variant: "neutral"
      }, "\u0110\xE3 r\xFAt"), r.bucket === 'REFUND' && /*#__PURE__*/React.createElement(Badge, {
        variant: "danger"
      }, "Ho\xE0n")));
    })))));
  }
  function Flow({
    label,
    value,
    tone,
    bg
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: bg || 'var(--gray-50)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        minWidth: 150
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '12px var(--font-sans)',
        color: 'var(--text-muted)',
        marginBottom: 4
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 18px var(--font-sans)',
        color: tone,
        fontVariantNumeric: 'tabular-nums'
      }
    }, value));
  }
  const Op = ({
    children
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 20px var(--font-sans)',
      color: 'var(--text-subtle)'
    }
  }, children);
  const bal = {
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
    boxShadow: 'var(--shadow-sm)'
  };
  const th = {
    padding: '10px 16px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '12px 16px',
    whiteSpace: 'nowrap'
  };
  window.LZVWallet = Wallet;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/Wallet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vendor/data.jsx
try { (() => {
/* Mock data for the Lazadee vendor dashboard (escrow wallet focus). */
(function () {
  const SHOP = {
    name: 'TechZone Official',
    kyc: 'VERIFIED',
    mall: true,
    rating: 4.9,
    commissionRate: 0.05
  };
  const WALLET = {
    available: 12450000,
    held: 8230000,
    // in escrow, not yet released
    monthRevenue: 45800000,
    monthGrowth: 18.4,
    pendingPayout: 5000000
  };

  // Append-only ledger (newest first). gross − commission = net.
  const LEDGER = [{
    date: '08/06/2026 14:22',
    ref: 'ORD-2412-0041',
    type: 'SALE',
    label: 'Bán hàng — vào escrow',
    gross: 778000,
    commission: 38900,
    net: 739100,
    bucket: 'HELD'
  }, {
    date: '08/06/2026 09:10',
    ref: 'ORD-2412-0040',
    type: 'SALE',
    label: 'Bán hàng — vào escrow',
    gross: 690000,
    commission: 34500,
    net: 655500,
    bucket: 'HELD'
  }, {
    date: '07/06/2026 18:46',
    ref: 'ORD-2412-0039',
    type: 'RELEASE',
    label: 'Giải ngân — đơn hoàn tất',
    gross: 1245000,
    commission: 0,
    net: 1245000,
    bucket: 'AVAILABLE'
  }, {
    date: '07/06/2026 11:03',
    ref: 'ORD-2412-0037',
    type: 'RELEASE',
    label: 'Giải ngân — đơn hoàn tất',
    gross: 459000,
    commission: 0,
    net: 459000,
    bucket: 'AVAILABLE'
  }, {
    date: '06/06/2026 16:30',
    ref: 'PAYOUT-0008',
    type: 'PAYOUT',
    label: 'Rút tiền về ngân hàng',
    gross: -5000000,
    commission: 0,
    net: -5000000,
    bucket: 'PAYOUT'
  }, {
    date: '06/06/2026 08:15',
    ref: 'ORD-2412-0035',
    type: 'REFUND',
    label: 'Hoàn tiền — khách trả hàng',
    gross: -178000,
    commission: -8900,
    net: -169100,
    bucket: 'REFUND'
  }, {
    date: '05/06/2026 20:01',
    ref: 'ORD-2412-0034',
    type: 'SALE',
    label: 'Bán hàng — vào escrow',
    gross: 12990000,
    commission: 649500,
    net: 12340500,
    bucket: 'HELD'
  }, {
    date: '05/06/2026 13:27',
    ref: 'ORD-2412-0031',
    type: 'RELEASE',
    label: 'Giải ngân — đơn hoàn tất',
    gross: 320000,
    commission: 0,
    net: 320000,
    bucket: 'AVAILABLE'
  }];
  const SALES_7D = [{
    d: 'T2',
    v: 4.2
  }, {
    d: 'T3',
    v: 5.8
  }, {
    d: 'T4',
    v: 5.1
  }, {
    d: 'T5',
    v: 7.4
  }, {
    d: 'T6',
    v: 9.2
  }, {
    d: 'T7',
    v: 11.6
  }, {
    d: 'CN',
    v: 8.9
  }];
  const ORDERS = [{
    id: 'ORD-2412-0041',
    customer: 'Trần T. Mai',
    items: 2,
    total: 778000,
    status: 'PAID',
    when: '14:22 hôm nay'
  }, {
    id: 'ORD-2412-0040',
    customer: 'Nguyễn V. An',
    items: 1,
    total: 690000,
    status: 'PAID',
    when: '09:10 hôm nay'
  }, {
    id: 'ORD-2412-0038',
    customer: 'Lê H. Phúc',
    items: 3,
    total: 1459000,
    status: 'SHIPPED',
    when: 'Hôm qua'
  }, {
    id: 'ORD-2412-0039',
    customer: 'Phạm T. Hà',
    items: 1,
    total: 1245000,
    status: 'COMPLETED',
    when: '2 ngày trước'
  }, {
    id: 'ORD-2412-0035',
    customer: 'Vũ M. Quân',
    items: 1,
    total: 178000,
    status: 'CANCELLED',
    when: '3 ngày trước'
  }];
  const NAV = [{
    id: 'overview',
    name: 'Tổng quan',
    icon: 'layout-dashboard'
  }, {
    id: 'orders',
    name: 'Đơn hàng',
    icon: 'package',
    badge: 2
  }, {
    id: 'products',
    name: 'Sản phẩm',
    icon: 'boxes'
  }, {
    id: 'wallet',
    name: 'Ví & Escrow',
    icon: 'wallet'
  }, {
    id: 'kyc',
    name: 'Hồ sơ KYC',
    icon: 'shield-check'
  }, {
    id: 'promo',
    name: 'Khuyến mãi',
    icon: 'megaphone'
  }, {
    id: 'chat',
    name: 'Chat',
    icon: 'message-circle',
    badge: 5
  }, {
    id: 'reviews',
    name: 'Đánh giá',
    icon: 'star'
  }, {
    id: 'stats',
    name: 'Phân tích',
    icon: 'chart-column'
  }, {
    id: 'settings',
    name: 'Cài đặt',
    icon: 'settings'
  }];
  window.LZV = {
    SHOP,
    WALLET,
    LEDGER,
    SALES_7D,
    ORDERS,
    NAV
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vendor/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PriceVND = __ds_scope.PriceVND;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.VendorChip = __ds_scope.VendorChip;

__ds_ns.VoucherTag = __ds_scope.VoucherTag;

__ds_ns.Money = __ds_scope.Money;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
