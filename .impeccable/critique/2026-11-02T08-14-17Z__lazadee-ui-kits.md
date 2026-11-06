---
target: toan bo giao dien Trao (sau 9 buoc)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:D:\\Tu-hoc\\project\\MultivendorEcommercePrototype\genie\ui_kits"
timestamp: 2026-11-02T08-14-17Z
slug: lazadee-ui-kits
---
Method: dual-agent (A: design review · B: detector, axe, browser measurements)

# Critique 2: Trao, after rebrand, storefront redesign, dashboards, mobile, accessibility, copy, polish

Score 24/40, same total as run 1, different failures. Visible quality much better; data integrity across apps now the main weakness.

## Heuristics
| # | Heuristic | Run 1 | Run 2 | Key issue |
|---|---|---|---|---|
| 1 | Status | 3 | 3 | Order list never shows whether money is held or released |
| 2 | Real world | 2 | 3 | Buyer side clean; seller side still "Ví & Escrow", "Net" |
| 3 | Control | 3 | 3 | Dialogs not closable by Escape |
| 4 | Consistency | 2 | 1 | Order codes collide across apps |
| 5 | Error prevention | 3 | 3 | Admin KYC reject is filled red next to approve |
| 6 | Recognition | 3 | 3 | Search card prints shop name twice |
| 7 | Flexibility | 1 | 2 | No bulk confirm; 16-item admin sidebar |
| 8 | Minimalism | 2 | 3 | Home disciplined; product page 4,362px |
| 9 | Recovery | 3 | 3 | Empty search says "khớp bộ lọc" with no filter |
| 10 | Help | 2 | 2 | 7-day window not explained in flow |

## Evidence
axe-core 0 WCAG violations (run 1: 150). No horizontal overflow at 390px. Buy, cart and checkout CTAs in the first phone viewport. No internal codes, no "escrow", no orange on buyer screens. Detector 18 advisories: 11 false positives (mock document art, shadows, icon glyph), 7 minor drift. Overlay: spring easing on switches, 9-10px sidebar text, 4.4:1 placeholder on checkout notes, nested cards on account.

## Priority issues
- [P0] Data contradicts positioning: checkout reuses existing order codes (000040-000046 mean different orders in account and vendor); Boutique Sài Gòn pending KYC but listed under verified shops; TravelGear verified but payout blocked for KYC. Fix: one shared shop/order seed, new codes after the highest, "verified" derived from KYC. Command: harden. Disputed: admin GMV vs top-7 shops sum is a top list, not the whole platform.
- [P1] Modal (_ds_bundle.js:549) lacks role=dialog, initial focus, focus trap, Escape, focus return; every money action uses it. Command: harden.
- [P1] Product page, cart footer and order list keep Shopee anatomy (uppercase spec sheets, star chips, footer line, 7 tabs, CHÍNH HÃNG). Fix: hold and return window beside specs, money state on order cards, verification proof instead of CHÍNH HÃNG. Commands: shape, bolder.
- [P2] Phone: tracking stepper wraps; vendor/admin sidebar strip cut off, KYC demo control wraps. Command: adapt.
- [P2] KYC demo control in vendor header and duplicated on KYC page; shop banner stats unreadable over light photo; admin role select has outline none. Command: polish.

## Personas
Casey: tracking stepper wraps; hold note below fold on product. Riley: order code collisions; receipt modal silent on returns after release; every review "Hữu ích (24)". Jordan: unexplained line allocations like -37.635₫; "Voucher Sàn phân bổ". Alex: no bulk confirm. Sam: dialogs without focus management.

## Questions
1. Why does the order list never say where each order's money is?
2. What would the product page be if designed from "chứng minh thay vì tuyên bố"?
3. Should the VNPay/VietQR handoff become the second signature moment?
