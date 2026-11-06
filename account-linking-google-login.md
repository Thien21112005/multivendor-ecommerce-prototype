# Liên kết tài khoản (Account Linking) khi đăng nhập Google

> Mục tiêu: một người dùng chỉ có **một tài khoản**, dù họ đăng ký bằng email + mật khẩu hay đăng nhập bằng Google.

---

## 1. Vấn đề cần giải quyết

Cùng một người, cùng một email `thien@gmail.com`, nhưng có thể vào hệ thống bằng 2 đường:

- **Đường 1:** đăng ký thường (email + mật khẩu)
- **Đường 2:** bấm "Đăng nhập bằng Google"

Nếu không xử lý, hệ thống sẽ tạo ra **2 tài khoản trùng email** (hoặc báo lỗi duplicate). Account linking là cách để gom 2 đường này về **1 user duy nhất**.

---

## 2. Ý tưởng cốt lõi

**Link = gắn `google_id` vào user đã có sẵn, rồi cho đăng nhập.**

```
TRƯỚC KHI LINK
users:  id=1 | email=thien@gmail.com | password_hash=xxx | google_id=NULL

SAU KHI LINK
users:  id=1 | email=thien@gmail.com | password_hash=xxx | google_id=1098234...
```

Sau đó user có thể đăng nhập bằng **cả 2 cách**, nhưng luôn vào đúng user `id=1`.

> `google_id` chính là trường `sub` trong token Google trả về. Đây là ID **cố định, không đổi** của tài khoản Google, nên dùng nó để nhận diện chứ **đừng chỉ dựa vào email**.

---

## 3. Luồng xử lý khi user bấm "Đăng nhập bằng Google"

```
Google trả về: { sub, email, email_verified, name, picture }
        │
        ▼
[1] Tìm user theo google_id
        │
        ├── Có  ──────────────────────────► Đăng nhập luôn (user cũ đã link)
        │
        └── Không
              │
              ▼
[2] Kiểm tra email_verified == true ?
              │
              ├── Không ──► TỪ CHỐI (không được link, tránh bị chiếm tài khoản)
              │
              └── Có
                    │
                    ▼
[3] Tìm user theo email
                    │
                    ├── Có  ──► LINK: gắn google_id vào user đó ──► Đăng nhập
                    │
                    └── Không ──► TẠO USER MỚI (password_hash = NULL) ──► Đăng nhập
```

---

## 4. Ví dụ từng bước

### Ví dụ A: Đăng ký thường trước, Google sau (link)

| Bước | Hành động | Kết quả trong DB |
|---|---|---|
| 1 | Đăng ký email `thien@gmail.com` + mật khẩu | `id=1, password_hash=xxx, google_id=NULL` |
| 2 | Hôm sau bấm "Đăng nhập Google", chọn `thien@gmail.com` | Không thấy `google_id` → thấy email trùng → **link** |
| 3 | Kết quả | `id=1, password_hash=xxx, google_id=1098...` |

### Ví dụ B: Đăng nhập Google trước, chưa có mật khẩu

| Bước | Hành động | Kết quả trong DB |
|---|---|---|
| 1 | Bấm "Đăng nhập Google" lần đầu | Không thấy gì → **tạo user mới**: `id=2, password_hash=NULL, google_id=2201...` |
| 2 | Vào Cài đặt → bấm "Thiết lập mật khẩu" | `password_hash` được điền giá trị |
| 3 | Kết quả | Từ giờ đăng nhập được cả Google lẫn email + mật khẩu |

---

## 5. Nút "Thiết lập mật khẩu" / "Đổi mật khẩu"

**Một tài khoản chỉ có 1 mật khẩu.** UI nên hiển thị theo trạng thái:

| `password_hash` | Hiển thị | Yêu cầu |
|---|---|---|
| `NULL` (chỉ có Google) | **"Thiết lập mật khẩu"** | Chỉ cần nhập mật khẩu mới (đã đăng nhập Google = đã xác thực) |
| Có giá trị | **"Đổi mật khẩu"** | Phải nhập **mật khẩu cũ** + mật khẩu mới |

Hiểu đúng là: có **2 phương thức đăng nhập** cùng trỏ về **1 tài khoản**, chứ không phải 2 mật khẩu.

---

## 6. Bảo mật: những điều BẮT BUỘC kiểm tra

### 6.1. Chỉ link khi `email_verified = true`

Nếu bỏ qua bước này, kẻ tấn công có thể:

1. Tạo tài khoản Google (hoặc IdP khác) với email của nạn nhân nhưng **chưa xác minh**.
2. Đăng nhập vào Lazadee bằng tài khoản đó.
3. Hệ thống thấy email trùng → link → kẻ tấn công **chiếm luôn tài khoản của nạn nhân**.

Với Google thì `email_verified` gần như luôn là `true`, nhưng vẫn nên check để an toàn và để sau này thêm provider khác không bị lỗ hổng.

### 6.2. Nhận diện bằng `google_id`, không phải email

Email trên Google có thể bị đổi. `sub` thì không. Sau khi đã link, các lần đăng nhập sau **tìm theo `google_id` trước**.

### 6.3. Kiểm tra tài khoản bị khóa

Dù link hay đăng nhập thường, vẫn phải check `status` (bị ban, chưa kích hoạt...) trước khi cấp token.

### 6.4. Một `google_id` chỉ link được với một user

Thêm ràng buộc `UNIQUE` để tránh 2 user cùng trỏ về một tài khoản Google.

---

## 7. Thiết kế DB

### Cách đơn giản (1 provider: chỉ Google)

```sql
CREATE TABLE users (
    id             BIGINT PRIMARY KEY AUTO_INCREMENT,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NULL,          -- NULL nếu chỉ dùng Google
    google_id      VARCHAR(255) NULL UNIQUE,   -- NULL nếu chưa link
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    -- ... các cột khác
);
```

### Cách mở rộng (nhiều provider: Google, Facebook, Apple...)

```sql
CREATE TABLE users (
    id             BIGINT PRIMARY KEY AUTO_INCREMENT,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NULL,
    -- ...
);

CREATE TABLE user_identities (
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id          BIGINT NOT NULL,
    provider         VARCHAR(30) NOT NULL,       -- 'google', 'facebook'...
    provider_user_id VARCHAR(255) NOT NULL,      -- google sub
    created_at       DATETIME NOT NULL,
    UNIQUE (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

> Nếu chỉ làm Google thì cách đơn giản là đủ. Nếu dự định thêm provider khác thì dùng `user_identities` ngay từ đầu, đỡ phải migrate sau.

---

## 8. Code mẫu (Java, logic service)

```java
@Transactional
public User loginWithGoogle(GoogleUserInfo info) {

    // [1] Tìm theo google_id (user đã link từ trước)
    Optional<User> byGoogleId = userRepository.findByGoogleId(info.getSub());
    if (byGoogleId.isPresent()) {
        return checkActive(byGoogleId.get());
    }

    // [2] Email chưa được Google xác minh -> không tin được
    if (!info.isEmailVerified()) {
        throw new AuthException("Email Google chưa được xác minh");
    }

    // [3] Tìm theo email
    Optional<User> byEmail = userRepository.findByEmail(info.getEmail());
    if (byEmail.isPresent()) {
        User user = byEmail.get();
        user.setGoogleId(info.getSub());   // LINK
        user.setEmailVerified(true);
        return checkActive(userRepository.save(user));
    }

    // [4] Chưa có gì -> tạo user mới (không có mật khẩu)
    User newUser = new User();
    newUser.setEmail(info.getEmail());
    newUser.setGoogleId(info.getSub());
    newUser.setFullName(info.getName());
    newUser.setPasswordHash(null);
    newUser.setEmailVerified(true);
    return userRepository.save(newUser);
}

private User checkActive(User user) {
    if (user.getStatus() == UserStatus.BANNED) {
        throw new AuthException("Tài khoản đã bị khóa");
    }
    return user;
}
```

### Thiết lập / đổi mật khẩu

```java
public void setOrChangePassword(User user, String oldPassword, String newPassword) {
    if (user.getPasswordHash() == null) {
        // Tài khoản Google, chưa có mật khẩu -> thiết lập lần đầu
        user.setPasswordHash(passwordEncoder.encode(newPassword));
    } else {
        // Đã có mật khẩu -> bắt buộc xác nhận mật khẩu cũ
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new AuthException("Mật khẩu cũ không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }
    userRepository.save(user);
}
```

Ngoài ra, ở luồng đăng nhập bằng email + mật khẩu, nhớ xử lý trường hợp `password_hash == null`:

```java
if (user.getPasswordHash() == null) {
    throw new AuthException("Tài khoản này đăng ký bằng Google. Hãy đăng nhập bằng Google hoặc thiết lập mật khẩu.");
}
```

---

## 9. Các tình huống đặc biệt (edge cases)

| Tình huống | Cách xử lý đề xuất |
|---|---|
| Đăng ký thường nhưng **chưa xác minh email**, sau đó Google login cùng email | Link được vì Google đã verify, đồng thời đánh dấu `email_verified = true` |
| User Google login nhưng email đó đã có tài khoản **bị khóa** | Từ chối đăng nhập, không link |
| Quên mật khẩu với tài khoản chỉ có Google | Cho phép "đặt mật khẩu" qua link gửi email, hoặc báo dùng Google để đăng nhập |
| User muốn **gỡ liên kết** Google | Chỉ cho gỡ khi đã có `password_hash`, nếu không sẽ mất đường đăng nhập |
| User đổi email trong Google | Vẫn đăng nhập được vì tìm theo `google_id`, email trong DB giữ nguyên |
| Cùng một người nhưng dùng 2 email khác nhau (1 thường, 1 Google) | Hệ thống coi là 2 tài khoản khác nhau (đúng hành vi mong đợi) |

---

## 10. Checklist triển khai

- [ ] `email` có `UNIQUE`
- [ ] `password_hash` cho phép `NULL`
- [ ] `google_id` có `UNIQUE` (hoặc bảng `user_identities` với `UNIQUE(provider, provider_user_id)`)
- [ ] Luôn tìm theo `google_id` trước, email sau
- [ ] Chỉ link khi `email_verified = true`
- [ ] Check trạng thái tài khoản (ban, inactive) trước khi cấp token
- [ ] Đăng nhập thường: xử lý `password_hash == null`
- [ ] UI: hiện "Thiết lập mật khẩu" hoặc "Đổi mật khẩu" tùy `password_hash`
- [ ] Đổi mật khẩu: bắt buộc mật khẩu cũ nếu đã có
- [ ] Gỡ liên kết Google: chỉ cho phép khi user còn phương thức đăng nhập khác

---

## 11. Tóm tắt

1. Một người = một tài khoản = một mật khẩu (có thể rỗng).
2. Google chỉ là **thêm một cách đăng nhập**, không tạo tài khoản thứ hai.
3. Link bằng cách gắn `google_id` vào user có cùng email, **với điều kiện** `email_verified = true`.
4. Lần sau luôn nhận diện bằng `google_id`.
5. "Thiết lập mật khẩu" chỉ xuất hiện khi tài khoản chưa có mật khẩu.
