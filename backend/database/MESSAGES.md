# Thông điệp cộng đồng

- Dữ liệu chính nằm trong SQL Server, bảng `dbo.community_messages`.
- Backend tạo bảng nếu chưa tồn tại. Nếu tài khoản SQL không có quyền tạo bảng,
  chạy `community_messages.sql` trong database của project bằng tài khoản triển khai.
- `GET /api/messages`: chỉ trả thông điệp `VISIBLE`.
- `POST /api/messages`: lưu nội dung 1–500 ký tự, ID và thời gian UTC do server tạo.
- `GET /api/admin/messages`: chỉ admin, gồm cả thông điệp đã ẩn.
- `PATCH /api/admin/messages/{id}`: chỉ admin, body `{"status":"HIDDEN"}` hoặc `{"status":"VISIBLE"}`.
- `DELETE /api/admin/messages/{id}`: chỉ admin, xóa vĩnh viễn sau xác nhận trên UI.
- Trang admin: `/admin/messages`. Trang cộng đồng cập nhật mỗi 15 giây và khi trở lại tab;
  các tab cùng trình duyệt nhận thông báo làm mới sau thao tác kiểm duyệt.
- Dữ liệu cũ trong `nhaminh-messages` không tự động công khai. Người dùng chọn bản cũ
  đưa vào ô soạn thảo rồi bấm chia sẻ. Chỉ sau khi database xác nhận lưu thành công,
  bản cũ tương ứng mới được dọn khỏi trình duyệt.
- `mvn test` kiểm tra lưu/ẩn/hiện/xóa và phân quyền. `test-messages.ps1` kiểm tra
  API trên database thật bằng admin cấu hình trong `.env.local`, chỉ tạo và xóa
  một thông điệp kiểm thử riêng, không sửa nội dung người dùng.

Không dùng localStorage làm nguồn dữ liệu cho danh sách công khai hoặc trang admin.
