# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Người mua Việt Nam** mua sắm online trên điện thoại và máy tính, từng lo ngại trả tiền rồi nhận hàng lỗi hoặc gặp shop không đáng tin. Việc của họ: tìm hàng, tin được người bán, thanh toán, theo dõi và nhận hàng.
- **Hội đồng đánh giá đồ án TLCN** xem bản demo và cần nhận ra ngay cơ chế riêng của sản phẩm cùng các luồng nghiệp vụ đằng sau nó. Giao diện phải trông như một sàn thật có thể dùng được, không phải một bài trình diễn.
- **Người bán và nhân viên sàn** dùng Kênh người bán và Admin Console. Hai phân hệ này nằm ngoài đợt làm lại storefront, nhưng dùng chung màu và tên thương hiệu.

## Product Purpose

Sàn thương mại điện tử đa người bán tại Việt Nam, hiện là nguyên mẫu tương tác chạy bằng dữ liệu mock. Thành công nghĩa là người mua dám đặt hàng từ một shop họ chưa từng biết, và hội đồng thấy được cơ chế thanh toán, ký quỹ và vận hành được mô hình hóa nghiêm túc.

## Positioning

Sàn giữ tiền của người mua và chỉ chuyển cho shop sau khi người mua nhận hàng hoặc hết thời hạn đổi trả 7 ngày; người bán phải qua xác minh danh tính (KYC) mới được bán. An tâm về tiền là lý do chọn sản phẩm này, không phải mức giảm giá.

## Operating Context

- Mua nhiều shop trong một giỏ, tách thành các đơn riêng, thanh toán gộp một lần.
- Thanh toán VNPay, VietQR, COD. Giữ hàng 15 phút khi chờ thanh toán.
- Vòng đời đơn từ thanh toán đến hoàn tất, yêu cầu trả hàng có bằng chứng, khiếu nại lên sàn.
- Prototype được mở trực tiếp qua launcher shell khi demo.

## Capabilities and Constraints

- Stack hiện có: React 18 UMD và Babel chạy trong trình duyệt, không có bước build, CSS tokens tại `lazadee/tokens/`. Kit dùng thêm `lazadee/_ds_bundle.js`.
- Toàn bộ dữ liệu là mock; QR, cổng thanh toán, OTP và đơn vị vận chuyển chỉ được giả lập.
- Phải giữ nguyên chức năng hiện có của storefront: tìm kiếm, giỏ nhiều shop, ba tầng voucher cộng điểm thưởng, thanh toán, theo dõi đơn, tài khoản, chat, các trạng thái biên.
- Mã yêu cầu nghiệp vụ và tên thực thể trong tài liệu `TLCN/` chưa đổi theo tên tạm.

## Brand Commitments

- **Tên chính thức là "Genie"** (chốt tháng 11/2026). Logo là cây đèn thần vẽ bằng khối, khói bốc từ vòi đèn; thân và khói nhận màu theo theme. Mã đơn vẫn giữ tiền tố `TR-` cho đến khi chủ dự án muốn đổi (`node tools/rebrand.mjs Genie Genie --code XX`). Chưa kiểm tra nhãn hiệu.
- Không dùng lại tên Lazadee, Xu, Mall và tiền tố `LZD-` trên giao diện. Thư mục và biến nội bộ có thể giữ tên cũ cho đến khi chốt tên chính thức.
- Màu chủ đạo (đổi tháng 11/2026 theo yêu cầu chủ dự án vì toàn xanh gây mỏi mắt và giống Tiki): mực xanh navy cho chữ và vùng tối nhỏ, xanh dương đậm chỉ cho nút và link, vàng hoa cúc (marigold) làm màu nhấn cho tiền và điểm cần nhìn, nền giấy ấm, xanh da trời chỉ làm ánh sáng nền. Không tô dải lớn bằng xanh dương. Không dùng cam làm màu thương hiệu.
- Không được trông như Shopee, Lazada hay Tiki.

## Evidence on Hand

- Ảnh sản phẩm và banner mẫu tại `lazadee/assets/img/`, logo cổng thanh toán tại `lazadee/assets/payments/`.
- Đặc tả nghiệp vụ tại `TLCN/document/Document_Vi.md`, phạm vi tại `TLCN/BAO_CAO_PHAM_VI_MVP.md`.
- Chưa có khách hàng, đánh giá, số liệu hay báo chí thật. Mọi con số và đánh giá trên giao diện là dữ liệu mẫu, không được trình bày như thành tích thật.

## Product Principles

1. **An tâm trước, giá sau.** Trạng thái tiền của người mua luôn nhìn thấy được ở những lúc quyết định.
2. **Chứng minh thay vì tuyên bố.** Cho thấy cơ chế đang chạy trên đơn hàng cụ thể, không chỉ viết khẩu hiệu.
3. **Nói bằng tiếng của người mua.** Không để lộ mã kỹ thuật hay thuật ngữ tài chính chưa giải thích.
4. **Mua hàng vẫn phải nhanh.** Bản sắc không được cản việc tìm, so sánh và thanh toán.

## Accessibility & Inclusion

Mục tiêu WCAG AA về tương phản và thao tác bàn phím. Người dùng chủ yếu đọc tiếng Việt, nên font phải hiển thị tốt dấu tiếng Việt.
