# Nha Minh

Dự án được tách thành hai phần độc lập:

- `frontend/`: giao diện React + Vite, giữ nguyên các màn hình và component hiện có.
- `backend/`: API Spring Boot chạy ở cổng `8080`.

## Chạy frontend

```powershell
cd frontend
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Chạy backend

Yêu cầu Java 17+ và Maven.

```powershell
cd backend
mvn spring-boot:run
```

API kiểm tra trạng thái: `http://localhost:8080/api/health`.

Frontend đã cấu hình proxy `/api` tới backend, nên sau này có thể gọi API bằng đường dẫn tương đối như `/api/products`.
