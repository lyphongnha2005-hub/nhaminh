# Nha Minh

Hướng dẫn triển khai GitHub + Vercel + backend online, chuyển SQL Server và giữ ảnh sản phẩm: [DEPLOY.md](DEPLOY.md).

Dự án được tách thành hai phần độc lập:

- `frontend/`: giao diện React + Vite, giữ nguyên các màn hình và component hiện có.
- `backend/`: API Spring Boot chạy ở cổng `8080`.

## Chạy frontend

```powershell
cd frontend
npm install
npm run dev
```

Trình duyệt tự mở `http://localhost:3000/login` để customer đăng nhập. Trang đăng nhập riêng của admin nằm tại `http://localhost:3000/login/admin`; sau khi admin đăng nhập thành công, hệ thống chuyển đến `/admin/dashboard`. Trang bán hàng công khai vẫn ở `http://localhost:3000/`.

## Chạy backend

Yêu cầu Java 17+ và Maven.

```powershell
cd backend
.\run-local.ps1
```

Script này tự kiểm tra cổng `8080` và không khởi động thêm instance nếu backend Nhà Mình đã chạy. Không chạy `mvn spring-boot:run` lần thứ hai trong một terminal khác khi backend đã chạy.

API kiểm tra trạng thái: `http://localhost:8080/api/health`.

Frontend đã cấu hình proxy `/api` tới backend, nên sau này có thể gọi API bằng đường dẫn tương đối như `/api/products`.

## Cấu hình đăng nhập và SQL Server

Tạo database bằng cách chạy `backend/database/nhaminh_database.sql` trong SSMS, sau đó đặt biến môi trường trước khi chạy backend:

Cho môi trường local, sửa `backend/.env.local` rồi chạy:

```powershell
cd backend
.\run-local.ps1
```

Bạn cũng có thể chạy trực tiếp `mvn spring-boot:run`; ứng dụng sẽ tự nạp `.env.local` khi file này tồn tại trong thư mục `backend`.

File `.env.local` chứa mật khẩu local và được Git bỏ qua. Không force-add file này vào repository.

```powershell
$env:DB_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName=NhaMinhDb;encrypt=true;trustServerCertificate=true;loginTimeout=10'
$env:DB_USERNAME='sa'
$env:DB_PASSWORD='mat-khau-sql-server'
$env:JWT_SECRET='chuoi-bi-mat-ngau-nhien-it-nhat-32-byte'
$env:ADMIN_EMAIL='admin@example.com'
$env:ADMIN_PASSWORD='MatKhau@Manh123'
$env:ADMIN_FULL_NAME='Quản trị Nhà Mình'
$env:CORS_ALLOWED_ORIGINS='http://localhost:3000,https://nhaminh-flame.vercel.app'
cd backend
mvn spring-boot:run
```

Backend tự tạo hai role và tài khoản admin theo cách idempotent. Nếu không đặt cả ba biến `ADMIN_*`, admin không được tạo; cấu hình thiếu một phần làm ứng dụng dừng với lỗi rõ ràng.

Frontend hiện dùng access token JWT trong `localStorage`, tuyệt đối không lưu mật khẩu. Đây là giới hạn của phiên bản đầu: chưa có refresh token/revocation list; đăng xuất xóa token phía trình duyệt. Backend vẫn kiểm tra trạng thái user trên mọi request nên token của tài khoản vừa bị khóa bị từ chối ngay. Với production nên chuyển access token sang cookie `HttpOnly`, `Secure`, `SameSite` và bổ sung refresh-token rotation/revocation.
