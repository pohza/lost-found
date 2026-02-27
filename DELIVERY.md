# 📦 คำแนะนำสำหรับ Backend Developer

## วิธีรับโฟลเดอร์นี้

### Option 1: ผ่าน Git (แนะนำ)
```bash
git clone <repository-url>
cd lost-found
npm install
npm run dev
```

### Option 2: รับโฟลเดอร์โดยตรง
1. รับโฟลเดอร์ (zip หรือ copy)
2. เปิด terminal ในโฟลเดอร์
3. รัน:
   ```bash
   npm install
   npm run dev
   ```

## ⚠️ สิ่งสำคัญ

- **`node_modules` และ `dist` ถูกลบออกแล้ว** - ต้องรัน `npm install` ก่อน
- **ดู `README.md`** สำหรับรายละเอียด API endpoints
- **ดู `REQUIREMENTS.md`** สำหรับรายละเอียด requirements

## 🔌 Backend Setup

Frontend เรียก API ที่ `/api/*` ดังนั้น backend ต้อง:

1. **Setup CORS** ให้รองรับ frontend origin
2. **Implement API endpoints** ตาม `REQUIREMENTS.md`
3. **Authentication**: ใช้ Bearer Token (ดู `src/api.ts`)

## 📝 Quick Start

```bash
# Install dependencies
npm install

# Run development server (port 5173)
npm run dev

# Build for production
npm run build
```

Frontend จะรันที่ `http://localhost:5173` และเรียก API ที่ `/api/*`

---

**Note**: ถ้า backend ต้องการ proxy API requests ใน development mode สามารถ setup ใน `vite.config.ts` (ดู README.md)
