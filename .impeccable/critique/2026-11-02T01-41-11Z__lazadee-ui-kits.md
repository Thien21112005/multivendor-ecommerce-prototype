---
target: toan bo giao dien Lazadee
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:D:\\Tu-hoc\\project\\MultivendorEcommercePrototype\\lazadee\\ui_kits"
timestamp: 2026-11-02T01-41-11Z
slug: lazadee-ui-kits
closed: true
---
Method: dual-agent (A: design review · B: detector + browser evidence)

# Critique: Lazadee, whole interface (storefront, vendor, admin, auth, shell)

Owner brief: looks too much like Shopee; move from orange to blue or sky blue; dashboards "not right". Assessment only, no code changed.

## Design Health Score: 24/40 (Acceptable)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Tracking and hold timers strong; dashboards lack period and as-of |
| 2 | Match real world | 2 | Raw enums and jargon: PENDING, PAYMENT_FAILED, "Đơn chuyển COMPLETED", "Net = Gross" |
| 3 | User control | 3 | "Duyệt chi" changes payout state in one click, no confirmation |
| 4 | Consistency | 2 | "+12.6%" beside "+9,2%"; KPI tile built 4 separate ways |
| 5 | Error prevention | 3 | KYC and OTP blocks good; KYC approve/reject adjacent, both solid, near hue |
| 6 | Recognition | 3 | RBAC permission meanings hover-only |
| 7 | Flexibility | 1 | No shortcuts; bulk only for price/stock |
| 8 | Minimalism | 2 | Categories twice on home; quick links repeat sidebar |
| 9 | Error recovery | 3 | Payment failure copy good; raw code still shown |
| 10 | Help | 2 | Help pages exist; little contextual help at escrow and KYC |

Per surface (estimate): storefront 26, vendor 24, admin 23, auth about 29 (login only). Cognitive load high: 4 of 8 fail.

## Design specificity

Storefront is category-interchangeable and Shopee-derived beyond colour: logo, home sequence, card anatomy, density, Xu/Mall/Kho Voucher/Đơn mua naming. "Lazadee" and LZD- echo Lazada. The money and trust layer (escrow, split orders, KYC, wallet) is authored but buried; home hero leads with 60% off (Home.jsx:79). Keep category conventions: search-first header, cart by shop, vouchers, flash sale mechanic, order statuses.

Detector: CLI 1 finding (side-tab, admin/Disputes.jsx:180). Browser 6-90 per page, mainly low-contrast; some false positives (disabled text, separators, text over progress fill). Headless, so no user-visible overlay.

## Orange to blue

Override of 6 stops removes most orange (cart 131 to 1, home 114 to 19). Tweak in shell.jsx:40-50 omits stops 100, 300, 800, 900 and --shadow-lift. Survivors: logomark.svg gradient, hardcoded avatar palette and shop logo, discount badge text. About 150 direct --orange-* references. Collisions: --blue-500 equals proposed brand; paid status, links, info and admin identity already blue; --text-price is brand colour; warm grays. --blue-200 used 7 times, undefined. White contrast: #F5511E 3.45, #0EA5E9 2.77, #0284C7 4.10, #0369A1 5.93, #2563EB 5.17. Recommendation: deep blue for fills, sky for tints and accents.

## Priority issues

- [P1] Dashboard numbers contradict: month revenue 45.8M vs 7-day 52.2M vs 30-day 140M (vendor/data.jsx); liabilities 1.187B defined as including escrow 3.265B (admin/Dashboard.jsx:98-99). Fix: single mock source, derived figures, stated periods. Commands: harden, clarify. (Assessment A rated P0; lowered because it does not block task completion.)
- [P1] Recolour without structure stays a clone. Fix: decide brand stance, then logo, hero, cards, naming, then colour. Commands: shape, colorize.
- [P1] Dashboards are KPI inventories. Fix: needs-action queue first, clickable counts, one revenue story with comparison, one StatTile, no decorative colour; Wallet.jsx is the pattern. Commands: layout, distill.
- [P1] Mobile is compressed desktop: 453px header (54% of first screen), Mua ngay at y=1791, checkout CTA at y=4271, about 2/3 to 4/5 of targets under 44px, launcher broken at 390px. Fix: mobile header, bottom action bar, stacked cart row. Command: adapt.
- [P2] Accessibility and demo leakage: mouse-only elements, #A8A299 on white 2.53, white on mint 2.59, amber on amber-50 2.58, simulation buttons under pay CTA (Checkout.jsx:248-253). Commands: audit, harden.

## Persona red flags

- Casey: header over half the screen, no sticky buy bar, cart title cut to "Tai ng…".
- Riley: period selectors desync figures; success date uses real clock, data is June 2026.
- Jordan: Escrow, Xu, Mall, SePay unexplained; seeded 11-item, 5-shop cart.
- Alex: 18 flat admin nav items, no shortcuts, no batch payouts.
- Sam: header links are span onClick, search suggestions lack arrow keys, no skip link.

## Minor observations

Flash-sale progress bars misaligned; hero promotes 12.12 while data is June; admin tables mix English enums and Vietnamese; KYC commission input clips "Theo ngành"; no favicon declared and existing file is not the Lazadee mark.

## Questions to consider

1. If escrow is the reason to choose Lazadee, why does home lead with 60% off?
2. Credible new brand, or thesis demo of marketplace mechanics?
3. What should an admin do in the first 30 seconds, and why read nine numbers to find it?

## Coverage limits

Not exercised: full buy-to-success journey, OTP/lockout, registration, onboarding submission, dispute and KYC reject modals, VietQR. Captured but not visually reviewed: shop page, vendor promo/chat, admin COD/commission/RBAC/moderation.
