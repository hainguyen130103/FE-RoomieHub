# Hướng dẫn setup Google Maps API

## 1. Tạo Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào "APIs & Services" > "Library"
4. Tìm và enable các API sau:
   - Maps JavaScript API
   - Places API
   - Geocoding API

## 2. Tạo API Key

1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy API key được tạo

## 3. Cấu hình trong dự án

1. Tạo file `.env` trong thư mục gốc của dự án
2. Thêm dòng sau vào file `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```
3. Thay `YOUR_API_KEY_HERE` bằng API key thực tế

## 4. Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API key vừa tạo
2. Trong phần "Application restrictions", chọn "HTTP referrers"
3. Thêm domain của bạn (ví dụ: `localhost:5173/*` cho development)
4. Trong phần "API restrictions", chọn "Restrict key"
5. Chọn các API đã enable ở bước 1

## 5. Test

1. Chạy dự án: `npm run dev`
2. Vào trang Profile
3. Click "Chọn vị trí trên bản đồ"
4. Kiểm tra xem map có hiển thị không

## Lưu ý

- API key sẽ được hiển thị trong browser, nên cần restrict theo domain
- Trong production, nên sử dụng backend để bảo vệ API key
- Google Maps API có giới hạn request, kiểm tra quota trong Google Cloud Console 