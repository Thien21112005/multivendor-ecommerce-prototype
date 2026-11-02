---
target: toàn bộ UI lazadee/ui_kits
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:D:\\Tu-hoc\\project\\MultivendorEcommercePrototype\\lazadee\\ui_kits"
timestamp: 2026-11-02T10-04-07Z
slug: lazadee-ui-kits
---
# Critique: lazadee/ui_kits (storefront, vendor, admin)
Method: dual-agent. Browser overlay skipped (no browser tool).
Score 27/40. H1 3, H2 3, H3 3, H4 2, H5 3, H6 2, H7 3, H8 2, H9 3, H10 3.
Specificity: about 60% authored (money promise, rail, money chips, seals, ink prices). About 40% template (glass blur over photos, blue gradient and glow fields, gradient droplet logo, pill everything, hero template, identical tile rows). Blue covers about 45-50% of Home and overlaps Tiki's territory.
Detector: 19 findings (15 design-system-color, 2 font-size, 1 radius, 1 font warning at Checkout.jsx:21). #F3B0A8 is a false positive (token bypass of --red-200).
## Priority issues
- [P1] Blue saturation and eye strain. Shrink .tr-sky to the header only. Move the flash band to paper. Drop the glows. Use a warm paper ground #FAF7F0. Add one accent (marigold #FFC21A recommended). Conflicts with PRODUCT.md brand colors, needs the owner's decision. Commands: colorize, then quieter.
- [P1] Admin banners are invisible. Home.jsx:35 has no seed fallback. Banners.jsx:9 does not persist the seed. CATEGORY_TOP is never rendered. imageMobile is ignored. The carousel shows [0] only. 160px crop. No preview link. Command: harden.
- [P1] Voucher chips (1.27-1.96:1) and chat FAB (1.21-1.82:1, badge 2.39:1) fail non-text contrast on the blue band. The FAB overlaps "Xem tất cả" because .tr-flash__head has no right padding. "Lưu" and "Đã lưu" look alike. Commands: audit, then polish.
- [P2] Hero template: glass smear, unlabeled shelf photos, rail covers 84px, autoplay every 3.6s, 92px display. Command: bolder or distill.
- [P2] Dashboards are mono-blue: status BarList scaled to Hoàn thành, 4-up tiles. Proposed: neutral-first charts, a status pipeline, a stacked escrow liability bar, bullet charts for health metrics, sparklines, and an accent bar for admin active nav. Command: colorize.
## Personas
Casey: FAB overlap, cropped banner, hint hidden on mobile, blur cost. Scam-wary buyer: countdown resets (Home.jsx:9), "-60%" banner copy, verified shops placed last. Jordan: too many entry points, vouchers buried. Sam: chips about 3.2:1 on the glow, no motion pause.
## Minor
Shop cover overlay .78-.85 (Shop.jsx:45). Weight 800 used everywhere. Info cyan looks like brand. Auth gradient. Vendor red gradient banner. "Voucher" listed as a category.
