# Frontend System Manual

## 1. Overview

Frontend ของระบบ Lost & Found สร้างด้วย **React + TypeScript + Vite** ในรูปแบบ Single Page Application (SPA)

เป้าหมายหลัก:
- แยกความรับผิดชอบของแต่ละหน้า (page-based routing)
- เรียกใช้งาน Backend ผ่าน REST API ที่ `/api/*`
- จัดการ authentication ผ่าน Bearer Token โดยใช้ helper กลาง

## 2. Project Structure (Frontend)

โครงสร้างหลักของฝั่ง frontend:

```text
src/
  api.ts            # authHeaders helper สำหรับแนบ Authorization header
  App.tsx           # กำหนด routes ของแอปทั้งหมด
  App.css           # global styles
  index.css         # base styles
  main.tsx          # React root entry point
  pages/            # หน้าแต่ละหน้าของระบบ
    Home.tsx
    Login.tsx
    Signup.tsx
    Report.tsx
    ReportLost.tsx
    ReportFound.tsx
    ItemDetail.tsx
    Claim.tsx
    ClaimsSubmitted.tsx
    ClaimsStatus.tsx
    MyPosts.tsx
    Notifications.tsx
    NotificationDetail.tsx
    Messages.tsx
    MessageDetail.tsx
    Profile.tsx
```

## 3. Routing Design

ใช้ `react-router-dom` สำหรับจัดการเส้นทาง (routing):

ตัวอย่างบางส่วนจาก `App.tsx`:

- `/login` → `LoginPage`
- `/signup` → `SignupPage`
- `/home` → `HomePage`
- `/report` → เลือกประเภทการลงประกาศ (lost/found)
- `/report/lost` → `ReportLostPage`
- `/report/found` → `ReportFoundPage`
- `/items/:id` → `ItemDetailPage`
- `/claim/:id` → `ClaimPage`
- `/my-posts` → `MyPostsPage`
- `/notifications` → `NotificationsPage`
- `/notifications/:id` → `NotificationDetailPage`
- `/messages` → `MessagesPage`
- `/messages/:id` → `MessageDetailPage`
- `/profile` → `ProfilePage`

**Design pattern:** ใช้ **page-based routing pattern** แยกหน้าตาม use case ชัดเจน

## 4. API Integration & authHeaders Helper

ไฟล์ `src/api.ts` มี helper ฟังก์ชัน `authHeaders()`:

- ดึง token จาก `localStorage`
- คืนค่า headers ที่มี `Authorization: Bearer <token>` เมื่อมี token
- ใช้รวมกับ headers อื่น เช่น `Content-Type: application/json`

ตัวอย่างการใช้งานในหน้า `ProfilePage`:

```ts
const res = await fetch("/api/me", { headers: authHeaders() });
```

**Design pattern:** แยก concern ของการแนบ auth header ออกจากแต่ละหน้า → เป็นรูปแบบ **abstraction/helper pattern** เพื่อลด duplication

## 5. State Management Pattern

ใช้ **React useState/useEffect** เป็นหลัก (ไม่ใช้ global state library เพื่อให้เรียบง่าย)

แนวทางร่วมกันของทุกหน้า:
- มี state `loading` และ `error` สำหรับจัดการสถานะโหลดข้อมูล
- ใช้ `useEffect` ดึงข้อมูลจาก API เมื่อ component mount หรือ dependency เปลี่ยน
- ใช้ early-return / เงื่อนไขแสดงผลตาม `loading` และ `error`

ตัวอย่าง (ย่อ) จาก `HomePage`:
- `useState` สำหรับ filters (search, location, date, sort)
- คำนวณ query string แล้ว `fetch("/api/items?...")`
- แสดงข้อความ "กำลังโหลด..." หรือ "โหลดไม่สำเร็จ" ตามสถานะ

## 6. Key Pages & Responsibilities

### 6.1 HomePage
- แสดงรายการประกาศ (lost/found)
- Search + filter + sort
- Design: แยก logic filter ผ่าน `URLSearchParams` ก่อนยิง API → backend สามารถ reuse logic บน server ได้

### 6.2 ReportLost / ReportFound
- ฟอร์มลงประกาศของหาย/ของพบ
- รองรับทั้ง JSON และ FormData (กรณีมีรูป)
- ถ้าแก้ไขประกาศ (มี `:id/edit`) จะโหลดข้อมูลเดิมแล้วส่ง `PUT /api/items/:id`

### 6.3 Claim / ClaimsSubmitted / ClaimsStatus
- `ClaimPage` ส่งคำขอรับคืนผ่าน `POST /api/items/:id/claim`
- หน้า `ClaimsSubmitted` / `ClaimsStatus` ใช้ดึงรายการ claim ทั้งหมด/ตามสถานะ

### 6.4 Notifications / NotificationDetail
- แสดงรายการแจ้งเตือน (เช่น มีคนส่ง claim)
- หน้า detail รองรับปุ่ม `Approved` / `Canceled` → เรียก `POST /api/notifications/:id/approve|cancel`

### 6.5 Messages / MessageDetail
- แสดง message thread ที่เกี่ยวข้องกับ claim/การติดต่อ
- Thread ถูกสร้างโดย backend เมื่อมีเหตุการณ์ (เช่น claim)
- `MessageDetail` แสดงข้อความใน thread และส่งข้อความใหม่ผ่าน `POST /api/me/messages/:id`

### 6.6 Profile
- แสดง/แก้ไขข้อมูลผู้ใช้ (`GET` / `PATCH /api/me`)
- มีปุ่ม `Log out` ที่ล้าง token ใน `localStorage` แล้ว redirect ไป `/login`

## 7. Design Patterns Summary (Frontend)

- **Component-based architecture**: แยกแต่ละหน้าตาม use case ชัดเจน
- **Page-based routing pattern**: ใช้ react-router-dom จัดการ navigation
- **Helper/Abstraction pattern**: `authHeaders()` รวม logic การแนบ token แทนการเขียนซ้ำทุกหน้า
- **Separation of concerns**:
  - หน้า UI แต่ละหน้าโฟกัสที่การแสดงผลและจัดการ state ของตัวเอง
  - รายละเอียดของ auth header ถูกซ่อนอยู่ใน `api.ts`

## 8. How to Extend

- ถ้าต้องเพิ่ม global state (เช่น user profile ทั่วแอป) สามารถเพิ่ม Context/Redux/MobX ได้โดยไม่กระทบโครงสร้างปัจจุบัน
- ถ้าต้องการ share logic การดึงข้อมูล list หลายหน้า สามารถ extract เป็น custom hook เช่น `useFetchList` ภายหลังได้ง่าย

