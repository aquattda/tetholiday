# 🏮 Ai Là Triệu Phú - Phiên Bản Tết 2026

Trò chơi **Ai Là Triệu Phú** phiên bản đặc biệt chủ đề **Tết Nguyên Đán Bính Ngọ 2026** 🐴

## 🎮 Tính năng

- **15 câu hỏi** về phong tục, văn hóa Tết Việt Nam với độ khó tăng dần
- **2 bộ câu hỏi**: Em bé (2-10 tuổi) và Người lớn (11-22 tuổi)
- **3 quyền trợ giúp**:
  - 👨‍👩‍👧‍👦 Nhờ người thân (cộng 30 giây)
  - ✂️ Giảm 50% (loại 2 đáp án sai)
  - 🔄 Đổi câu hỏi khác
- **Đồng hồ 30 giây** cho mỗi câu hỏi
- **2 mốc an toàn** (câu 5: 2.000.000đ, câu 10: 22.000.000đ)
- **Giải thưởng lên đến 150.000.000đ**
- 🌸 Giao diện chủ đề Tết với hoa đào rơi, đèn lồng, tông màu đỏ - vàng

## 🛠 Công nghệ

- **Frontend & Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB (tùy chọn)
- **Language**: TypeScript
- **Deploy**: Heroku

## 🚀 Cài đặt & Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang web.

### 3. Build cho production

```bash
npm run build
npm start
```

## 🗄 Cấu hình MongoDB (Tùy chọn)

Game hoạt động không cần MongoDB (sử dụng dữ liệu tĩnh). Nếu muốn dùng MongoDB:

1. Tạo file `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tet-trieu-phu
```

2. Seed dữ liệu bằng cách gọi API:
```
POST /api/seed
```

## 🚢 Deploy lên Heroku

```bash
# Đăng nhập Heroku
heroku login

# Tạo app
heroku create ten-app-cua-ban

# Thêm MongoDB addon (hoặc dùng MongoDB Atlas)
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main

# Mở app
heroku open
```

## 📝 Cập nhật câu hỏi

Chỉnh sửa file `src/data/questions.ts` để thêm/sửa/xóa câu hỏi.

Mỗi câu hỏi có cấu trúc:

```typescript
{
  id: number,          // ID duy nhất
  content: string,     // Nội dung câu hỏi
  options: string[],   // 3 phương án trả lời
  correctAnswer: number, // Index đáp án đúng (0, 1, hoặc 2)
  category: 'adult' | 'kids', // Loại câu hỏi
  difficulty: 'easy' | 'medium' | 'hard', // Độ khó
}
```

## 📊 Cấu trúc giải thưởng

| Câu | Phần thưởng | Ghi chú |
|-----|-------------|---------|
| 1   | 200.000đ    |         |
| 2   | 400.000đ    |         |
| 3   | 600.000đ    |         |
| 4   | 1.000.000đ  |         |
| 5   | 2.000.000đ  | ★ Mốc 1 |
| 6   | 3.000.000đ  |         |
| 7   | 6.000.000đ  |         |
| 8   | 10.000.000đ |         |
| 9   | 14.000.000đ |         |
| 10  | 22.000.000đ | ★ Mốc 2 |
| 11  | 30.000.000đ |         |
| 12  | 40.000.000đ |         |
| 13  | 60.000.000đ |         |
| 14  | 85.000.000đ |         |
| 15  | 150.000.000đ| 🏆 Triệu Phú! |

---

🧧 **Chúc Mừng Năm Mới Bính Ngọ 2026!** 🐴
