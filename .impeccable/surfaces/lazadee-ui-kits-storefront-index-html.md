---
version: 1
slug: "lazadee-ui-kits-storefront-index-html"
primary_target: "lazadee/ui_kits/storefront/index.html"
related_targets: []
---

# Storefront Trao

Scope: toàn bộ storefront người mua. Mode: Persuade ở trang chủ, các màn hình mua hàng giữ độ dễ quét của Operate. Đối tượng: người mua Việt Nam và hội đồng TLCN. Không đổi chức năng hiện có. Vendor và Admin chỉ nhận màu và tên.

Nguồn hướng: chủ dự án ghim liquid glass, trắng để làm nổi nội dung, và giao quyền chọn phần còn lại. Tháng 11/2026 chủ dự án yêu cầu bớt xanh, phối thêm màu: trường xanh đậm đổi thành trường sáng trời-sang-giấy, thêm vàng hoa cúc cho tiền. Hướng bốc thăm Sổ giữ tiền giữ lại cấu trúc (dòng trạng thái tiền, con dấu shop, bước tiếp theo hiện trước), vật liệu in chống giả được dịch sang kính.

Chưa quyết: tên và logo chính thức.

## Direction contract

THESIS: Trang mở bằng lời hứa về tiền, chứng minh ngay bằng một đường ray tiền hoạt động. Từ chối bố cục banner carousel, danh mục tròn, voucher, flash sale của các sàn.

OWN-WORLD: Trường sáng xanh trời tan vào nền giấy ấm, một quầng nắng vàng hoa cúc; kính trắng mờ có viền sáng cho lớp điều hướng và đường ray; tờ nội dung trắng đặc cho sản phẩm và giá; giá màu mực, đỏ chỉ cho giảm giá; con dấu đường nét sinh từ mã shop.

STORY: Người mua hiểu sàn giữ tiền đến khi họ nhận hàng, tin rằng shop đã được xác minh, rồi tìm và mua. Lời hứa lặp lại ở trang sản phẩm, giỏ, thanh toán và biên nhận.

FIRST VIEWPORT: Thanh kính nổi trên cùng chứa logo, ô tìm kiếm hoạt động, giỏ và tài khoản; hàng danh mục; tiêu đề tối đa 72px màu mực, nửa câu về tiền nằm trên nét dạ quang vàng; kệ 6 ảnh sản phẩm có giá, bấm được; đường ray kính đè lên kệ, đồng xu vàng chạy một lượt qua 4 bước rồi dừng. Hành động chính là tìm kiếm và bấm sản phẩm.

FORM: Sổ giữ tiền, vị trí 3 trong danh sách, vật liệu dịch sang kính theo yêu cầu ghim. Tương tác đặc trưng: đồng xu vàng chạy trên đường ray một lượt rồi dừng, người dùng bấm để điều khiển, tắt khi giảm chuyển động. seed:2e99f4bb69527ac2

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Theme round (đang chờ chủ dự án chốt)

Chủ dự án yêu cầu xem 5 theme chạy thật trên mọi màn hình rồi tự chọn, thay cho trang quyết định; lựa chọn của người dùng thắng lượt bốc thăm. Lượt bốc thăm direction: seed:57b789465f5618cc, giao ứng viên số 3.

Danh sách theo độ cộng hưởng: 1 Tiền polymer (lựa chọn của Impeccable), 2 Tem bưu chính, 3 Giấy điệp Đông Hồ (được giao), 4 Mái bạt Sài Gòn, 5 Đèn lồng chợ đêm, 6 Lụa Vạn Phúc, 7 Đèn thần Genie (nghĩa đen, dồn vào logo). Thách thức: bìa đĩa than jazz (cạnh tranh, được dựng thành theme 5); khung arcade, chợ bóng trăng, lọ dưa muối, buồng tối, cổng WebGL bị loại (tối, khó đọc hoặc nặng).

Theme dựng trong `lazadee/ui_kits/storefront/themes.css` + `themes.js`, chọn bằng `?theme=` hoặc dock của launcher: genie, hoian, dongho, dongson, polymer, buudien, saigon, sleeve, classic (bản cũ để đối chiếu). dongson (Trống đồng Đông Sơn) do chủ dự án chỉ định thêm; mặt trống vẽ bằng `tools/dongson-drum.mjs`. Header và hàng danh mục dính thành một khối `.tr-top`, nền đặc theo `--top-bg` của từng theme khi cuộn. Khi chủ dự án chốt: ghi Direction contract mới cho theme đó, gỡ các theme còn lại, chạy finish review và viết lại DESIGN.md từ bản đã dựng.

genie (Đèn thần) do chủ dự án yêu cầu "chuẩn tên Genie", giữ liquid glass; hình hero là đèn và khói (bỏ đồng xu) `lazadee/assets/brand/genie-lamp.svg` dựng từ `logo/Logo.svg`. Logo đồng xu (`logo/Webicon.svg`) vẽ inline trong Header.jsx, màu theo `--mark-1..3` và `--mark-ink` của từng theme. Tháng 11/2026 chủ dự án cho khách tự chọn theme: nút bảng màu trên thanh header mở danh sách theme, lưu vào localStorage `genie_theme`. hoian (Phố Hội) lấy từ ứng viên số 5 của danh sách (đèn lồng chợ đêm), dịch sang ban ngày cho sáng; đèn lồng vẽ bằng `tools/hoian-lanterns.mjs`.
