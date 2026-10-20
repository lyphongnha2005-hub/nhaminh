# Đưa Nhà Mình lên online

## Kết quả kiểm tra ngày 20/10/2026

SQL Server local kết nối được tại `127.0.0.1:1433`, database `NhaMinhDb`, máy `DESKTOP-LRCFBMK`.
Có 1 sản phẩm ACTIVE, 2 khách hàng, 1 admin, 1 ảnh sản phẩm và 1 đơn hàng.
Đây là database trên máy cá nhân, chưa phải địa chỉ database cloud.
`127.0.0.1` trên Render/Vercel chỉ chính máy chủ của họ, không chỉ máy của bạn.

Khi triển khai xong:

- Khách hàng: https://nhaminh-flame.vercel.app/
- Admin đăng nhập: https://nhaminh-flame.vercel.app/login/admin
- Quản trị: https://nhaminh-flame.vercel.app/admin/dashboard
- Hai giao diện cùng gọi backend và dùng chung database. Không cần chạy terminal local.

## 1. Đưa database hiện có lên cloud

Có thể dùng Azure SQL Database hoặc một SQL Server được quản lý trên cloud.
Nếu muốn giữ dữ liệu hiện tại, phải chuyển cả schema VÀ dữ liệu; push GitHub không chuyển database.

Với Azure SQL:

1. Trong SSMS, bấm phải database `NhaMinhDb` → Tasks → Export Data-tier Application, xuất `.bacpac`.
2. Import `.bacpac` vào Azure SQL bằng SSMS hoặc Azure Portal. Tạo database đích mới cho lần chuyển đầu.
3. Thiết lập firewall database để cho phép địa chỉ outbound của backend Render; không mở toàn bộ Internet.
4. Kiểm tra số lượng bản ghi của `products`, `customers`, `admins`, `orders`, `product_images` tại đích.
5. Đặt thông tin kết nối database đích trong Environment của backend:

```dotenv
DB_URL=jdbc:sqlserver://YOUR_SERVER.database.windows.net:1433;databaseName=NhaMinhDb;encrypt=true;trustServerCertificate=false;loginTimeout=30
DB_USERNAME=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
```

Không dùng `127.0.0.1` cho backend online. Không commit `.bacpac`, `.bak`, `.env.local` hoặc mật khẩu.
Nếu chuyển nguyên database, admin và khách hàng cũ vẫn đăng nhập bằng thông tin hiện có.
Backend chạy `ddl-auto=validate`: không tự tạo toàn bộ schema.
Các script trong `backend/database/` dành cho tạo database trống hoặc bổ sung bảng;
không chạy lại script tạo bảng lên database đã có dữ liệu.

Tài liệu chuyển dữ liệu: https://learn.microsoft.com/en-us/azure/azure-sql/database/database-import

## 2. Triển khai backend Spring Boot trên Render

Repository đã có `backend/Dockerfile` và Blueprint `render.yaml`.
Blueprint sử dụng **gói Starter và persistent disk có phí** để giữ ảnh qua các lần deploy.
Xem giá tại Render trước khi bấm tạo; cấu hình trong repo không tự mua dịch vụ.

1. Đăng nhập Render, chọn New → Blueprint, kết nối repository `lyphongnha2005-hub/nhaminh`, branch `main`.
2. Xem cấu hình trong `render.yaml`, nhập `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` cho database cloud.
3. Render tạo `JWT_SECRET` ngẫu nhiên. `CORS_ALLOWED_ORIGINS` đã là `https://nhaminh-flame.vercel.app`.
4. Nếu đã chuyển admin từ database cũ, bỏ trống cả ba biến `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME`.
   Nếu tạo admin mới, nhập đủ cả ba; mật khẩu tối thiểu 8 ký tự. Không nhập thông tin này vào frontend.
5. Sau khi deploy, lấy URL HTTPS thực tế của backend. Mở `/api/health` phải có `status: ok`.
6. Mở `/api/products` trên backend phải trả JSON chứa sản phẩm, không trả HTML.

Nếu tạo Web Service thủ công: Root Directory `backend`, Runtime Docker, Dockerfile `./Dockerfile`,
Health Check `/api/health`, Persistent Disk mount `/app/uploads`, biến `UPLOAD_DIR=/app/uploads`.
Backend tự đọc cổng `PORT` do host cung cấp.

Ảnh cũ không nằm trong GitHub: chép `backend/uploads/products/` vào `/app/uploads/products/`
trên persistent disk, giữ nguyên tên file; hoặc tải ảnh lên lại từ trang admin.
Nếu tạo ảnh mới thay thế, kiểm tra và gỡ mục ảnh cũ đã mất trong admin.
Không dùng filesystem tạm của gói miễn phí để lưu ảnh lâu dài.

Tài liệu: https://render.com/docs/docker và https://render.com/docs/disks

## 3. Kết nối frontend Vercel với backend

Trong project đang giữ domain `nhaminh-flame.vercel.app`:

1. Git repository: `lyphongnha2005-hub/nhaminh`, Production Branch: `main`.
2. Root Directory: **frontend**, Framework: **Vite**.
3. Install Command: `npm ci`, Build Command: `npm run build`, Output Directory: `dist`.
4. Settings → Environment Variables, đặt `VITE_API_URL` bằng URL HTTPS thực tế của backend.
   Ví dụ minh họa: `https://your-backend.onrender.com` — thay bằng URL của bạn, không thêm `/api`.
5. Chọn Production; nếu cần Preview cũng dùng được thì thêm domain preview chính xác vào CORS của backend.
6. Redeploy. Biến `VITE_*` được đóng vào bundle lúc build, nên đổi biến phải build lại.

Nếu project hiện dùng Root Directory là repository root, file `vercel.json` ở gốc cũng có lệnh build tương ứng.
Ưu tiên cấu hình `frontend` ở trên. Không dùng `localhost:8080` trong Environment của Vercel.
Vercel build sẽ báo lỗi rõ ràng nếu thiếu `VITE_API_URL`, tránh phát hành giao diện không kết nối API.
SPA rewrite cho phép tải trực tiếp `/login/admin` và `/admin/dashboard`.
Ảnh `/uploads/...` được lấy từ backend; logo và ảnh đi kèm frontend vẫn lấy từ Vercel.

## 4. Push các thay đổi lần sau

Chạy tại thư mục repository:

```powershell
git status
git add .
git diff --cached --stat
git commit -m "Configure production deployment"
git push origin main
```

Kiểm tra danh sách file trước commit; file môi trường chứa mật khẩu đã được `.gitignore` bỏ qua.
Khi kết nối Git đã hoạt động, Vercel và Render nhận các commit mới theo cấu hình tự deploy của từng dịch vụ.

## 5. Kiểm tra hoàn tất

1. Backend `/api/health` và `/api/products` trả JSON đúng.
2. Trang chủ hiện sản phẩm và ảnh thật; tải lại vẫn hiện.
3. Đăng nhập khách hàng, thêm giỏ hàng/yêu thích, tải lại để kiểm tra dữ liệu được giữ.
4. Đăng nhập admin ở `/login/admin`, kiểm tra sản phẩm, khách hàng và đơn hàng.
5. Cập nhật một sản phẩm trong admin, tải lại trang khách hàng và xác nhận thay đổi.
6. Upload ảnh từ admin, redeploy backend rồi mở lại để xác nhận ảnh được lưu trên persistent disk.
7. Tắt frontend/backend local và mở website từ điện thoại bằng mạng di động.

Nếu chỉ lỗi kết nối API: kiểm tra Network trong DevTools. Request phải đi tới URL backend HTTPS;
lỗi CORS kiểm tra `CORS_ALLOWED_ORIGINS`, lỗi 5xx kiểm tra log backend và firewall database.
API trả `[]` nghĩa là database đích chưa có sản phẩm ACTIVE, không phải lỗi hiển thị frontend.
