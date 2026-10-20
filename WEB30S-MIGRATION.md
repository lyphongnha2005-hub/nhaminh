# Chuyển website Nhà Mình sang Web30s

## Phiên bản code được giữ lại

- Commit trước khi dựng Web30s: `ebeb477`.
- Tag khôi phục dự kiến: `backup/before-web30s-2026-10-20` (kiểm tra trên GitHub trước khi sử dụng).
- Bản ZIP source local: `.backups/before-web30s-ebeb477/source-ebeb477.zip`.
- SHA256 của ZIP: `E79B948A74A033BD2775F6B6B390AE83AE487D643E260A003A7574E9AFF40EA2`.
- ZIP đã được mở và kiểm tra 153 mục, gồm frontend, backend và các script database.
- Cấu hình local và ảnh upload được giữ riêng ở `.backups/before-web30s-ebeb477/local-private/`.
- Logo và ảnh đi kèm frontend: `.backups/before-web30s-ebeb477/frontend-public/`.
- Dữ liệu sản phẩm để đối chiếu khi nhập: `.backups/before-web30s-ebeb477/catalog.json`.

Thư mục `.backups/` được Git bỏ qua. Không tải thư mục `local-private` lên GitHub hoặc Web30s.
Sao chép thêm bản ZIP ra ổ khác nếu muốn lưu độc lập với máy hiện tại.
Database SQL Server gốc được giữ nguyên. Bản xuất catalog chỉ gồm sản phẩm, danh mục,
giá, tồn kho, ảnh và biến thể; không phải bản sao lưu đầy đủ database.

## Dựng Web30s riêng

1. Mở dịch vụ Web30s tại P.A → Bảng điều khiển để lấy địa chỉ quản trị chính xác.
   Tên miền chính hiện trỏ Vercel; cần dùng link quản trị/xem trước do P.A cung cấp nếu link theo tên miền không mở.
2. Kiểm tra các chức năng thực tế trong gói: sửa giao diện, danh mục, sản phẩm,
   giỏ hàng, nhận đơn, tài khoản khách hàng, vận chuyển và thanh toán.
3. Dựng trang chủ theo website hiện tại: logo Nhà Mình, màu nâu/kem/xanh,
   giới thiệu đồ decor tái chế, danh mục, sản phẩm, thông điệp và chân trang.
4. Tạo danh mục và nhập sản phẩm theo `catalog.json`. Hiện có 1 sản phẩm.
   Tệp JSON là dữ liệu đối chiếu, không giả định Web30s có thể import trực tiếp.
   Nếu Web30s có nhập Excel, lấy mẫu từ chính trang quản trị rồi ánh xạ dữ liệu vào mẫu đó.
5. Upload logo, ảnh và ảnh sản phẩm. Không dùng đường dẫn `/uploads/...` cũ làm URL ảnh Web30s;
   tải file tương ứng lên thư viện ảnh Web30s và dùng URL mới của hệ thống.
6. Kiểm tra biến thể và tồn kho. Không coi biến thể màu/kích thước/phụ kiện là các sản phẩm riêng
   trước khi xác định Web30s hỗ trợ biến thể theo cách nào.
7. Cấu hình thông tin liên hệ, nhận đơn, vận chuyển và phương thức thanh toán theo thông tin chủ website cung cấp.
8. Kiểm tra trang trên máy tính/điện thoại, tìm kiếm, chi tiết sản phẩm, giỏ hàng,
   đặt thử đơn và xác nhận đơn trong quản trị.

Không nhập tài khoản hoặc đơn hàng cũ trước khi kiểm tra công cụ import của Web30s và được chủ website xác nhận.
Không thể giả định hash mật khẩu BCrypt của ứng dụng Java dùng được cho tài khoản Web30s.

## Đưa tên miền sang Web30s sau khi kiểm tra

- Giữ DNS hiện tại trỏ Vercel trong thời gian dựng và xem trước.
- Khi website Web30s sẵn sàng, lấy IP/đích DNS và hướng dẫn HTTPS hiện tại từ P.A.
- Không tự dùng lại IP Web30s cũ nếu P.A chưa xác nhận.
- Chỉ đổi bản ghi web `@` và `www` theo cấu hình P.A cung cấp. Giữ MX/TXT và các bản ghi email.
- Kiểm tra cả `https://nhaminh.id.vn` và `https://www.nhaminh.id.vn` sau chuyển đổi.
- Website React vẫn được giữ tại project Vercel và mã nguồn vẫn ở GitHub.

## Xem lại code cũ mà không ghi đè công việc mới

```powershell
git fetch origin --tags
git worktree add ../nhaminh-before-web30s backup/before-web30s-2026-10-20
```

Lệnh trên tạo thư mục riêng để xem/chạy code cũ; không dùng `git reset --hard`.
Thư mục mới cần cấu hình local riêng nếu muốn chạy backend. Không chép mật khẩu vào source.
