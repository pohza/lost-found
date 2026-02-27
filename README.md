# Lost & Found - Frontend

Frontend application สำหรับระบบ Lost & Found (ของหาย/ของพบ) สร้างด้วย React + TypeScript + Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ และ npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Development server จะรันที่ `http://localhost:5173` (หรือ port อื่นที่ Vite จัดหาให้)

## 📁 Project Structure

```
src/
├── api.ts              # Helper สำหรับส่ง Authorization token
├── App.tsx             # Main app component และ routing
├── App.css             # Global styles
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Home.tsx        # หน้าแสดงรายการประกาศ (Lost/Found)
│   ├── ItemDetail.tsx  # รายละเอียดประกาศ
│   ├── Report.tsx      # หน้าเลือกประเภท (Lost/Found)
│   ├── ReportLost.tsx  # ฟอร์มลงประกาศของหาย
│   ├── ReportFound.tsx # ฟอร์มลงประกาศของพบ
│   ├── Claim.tsx       # ฟอร์มส่งคำขอรับคืน
│   ├── ClaimsSubmitted.tsx
│   ├── ClaimsStatus.tsx
│   ├── MyPosts.tsx     # ประกาศของฉัน (แก้ไข/ปิด/ลบ)
│   ├── Notifications.tsx
│   ├── NotificationDetail.tsx
│   ├── Messages.tsx    # รายการข้อความ
│   ├── MessageDetail.tsx
│   └── Profile.tsx
└── assets/             # Images และ static assets
```

## 🔌 Backend API Integration

Frontend เรียก API ที่ `/api/*` ทั้งหมด (relative path) ดังนั้น backend ต้อง:

1. **Setup CORS** ให้รองรับ frontend origin
2. **Proxy หรือ serve** frontend build files (ใน production)
3. **Implement API endpoints** ตาม `REQUIREMENTS.md`

### Authentication

Frontend ใช้ **Bearer Token** authentication:
- Login/Signup: เก็บ token จาก response ใน `localStorage.setItem("token", token)`
- ทุก API call ที่ต้อง auth จะส่ง `Authorization: Bearer <token>` header
- Logout: `localStorage.removeItem("token")`

Helper function: `src/api.ts` → `authHeaders()` ใช้สำหรับเพิ่ม Authorization header

### API Endpoints ที่ Frontend ใช้

ดูรายละเอียดครบใน `REQUIREMENTS.md` แต่สรุปคร่าวๆ:

#### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

#### Items (ประกาศ)
- `GET /api/items` - รายการประกาศ (query: type, search, location, dateFrom, dateTo, sort)
- `GET /api/items/:id` - รายละเอียดประกาศ
- `POST /api/items` - สร้างประกาศ (JSON หรือ FormData ถ้ามีรูป)
- `PUT /api/items/:id` - แก้ไขประกาศ
- `DELETE /api/items/:id` - ลบประกาศ
- `POST /api/items/:id/close` - ปิดประกาศ

#### Claims (คำขอรับคืน)
- `POST /api/items/:id/claim` - ส่งคำขอรับคืน (JSON หรือ FormData ถ้ามีรูปหลักฐาน)
- `GET /api/claims` - รายการ claims
- `GET /api/claims?status=submitted` - รายการ claims ที่ส่งแล้ว

#### Notifications
- `GET /api/notifications` - รายการแจ้งเตือน
- `GET /api/notifications/:id` - รายละเอียดแจ้งเตือน
- `POST /api/notifications/:id/approve` - อนุมัติ claim
- `POST /api/notifications/:id/cancel` - ยกเลิก claim

#### Messages
- `GET /api/me/messages` - รายการ message threads
- `GET /api/me/messages/:id` - ข้อความใน thread
- `POST /api/me/messages/:id` - ส่งข้อความ (body: `{ text }`)

#### User Profile
- `GET /api/me` - ข้อมูลโปรไฟล์
- `PATCH /api/me` - แก้ไขโปรไฟล์
- `GET /api/me/items` - ประกาศของฉัน

## 🛠️ Development

### Environment Variables

Frontend ไม่ใช้ environment variables ตอนนี้ แต่ถ้าต้องการ config API base URL สามารถเพิ่มใน `vite.config.ts`:

```typescript
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### Build Output

`npm run build` จะสร้างไฟล์ใน `dist/` folder:
- `dist/index.html`
- `dist/assets/*.js` (bundled JavaScript)
- `dist/assets/*.css` (bundled CSS)
- `dist/assets/*.png` (images)

## 📝 Notes for Backend Developers

1. **CORS**: ต้องตั้งค่า CORS ให้รองรับ frontend origin (development: `http://localhost:5173`)

2. **Authentication**: 
   - Login/Signup response ควรมี `{ token: "..." }`
   - ทุก API ที่ต้อง auth ต้องตรวจสอบ `Authorization: Bearer <token>` header

3. **File Uploads**:
   - `POST /api/items` และ `PUT /api/items/:id` รองรับ FormData สำหรับอัปโหลดรูป
   - `POST /api/items/:id/claim` รองรับ FormData สำหรับอัปโหลดรูปหลักฐาน

4. **Error Handling**:
   - Frontend จัดการ error โดยแสดงข้อความหรือ fallback เป็น empty array/object
   - Backend ควร return HTTP status codes ที่ถูกต้อง (200, 400, 401, 404, 500)

5. **Message Threads**:
   - Message threads ควรถูกสร้างโดย backend เมื่อมี claim หรือ notification
   - Frontend ไม่ได้สร้าง thread เอง แค่แสดงและส่งข้อความ

## 📄 License

Private project
