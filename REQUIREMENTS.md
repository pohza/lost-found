# Lost & Found – Requirements Checklist

## User Requirements

### Finder (ผู้พบเจอของ)
| รายการ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| ลงประกาศของที่พบได้ง่าย พร้อมรูป/รายละเอียดสำคัญ | ✅ | หน้า Report Found: Item Name, Location, Date & Time, Description, Upload Photo |
| เลือก "ส่งมอบให้จุดรับของกลาง/เก็บไว้เองชั่วคราว" และแจ้งวิธีรับคืน | ✅ | ช่องส่งมอบของ (radio) + ช่องวิธีรับคืน |
| แก้ไข/ปิดประกาศได้เมื่อส่งคืนแล้ว | ✅ | หน้า My Posts: แก้ไข, ปิดประกาศ, ลบ; หน้า Item Detail แสดงปุ่มแก้ไขเมื่อเป็นเจ้าของ (isOwner) |

### Owner (เจ้าของ)
| รายการ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| ดูรายละเอียดและรูปได้ชัดเจน | ✅ | หน้า Item Detail |
| ส่งคำขอรับคืน (Claim) พร้อมหลักฐานความเป็นเจ้าของ | ✅ | หน้า Claim: Description, Serial number (ถ้ามี), รูปหลักฐาน (optional) |

---

## System Requirements

| รายการ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| จัดการผู้ใช้ (Register/Login/Role) | ✅ | สมัครด้วยอีเมล, Login, Logout (Role = behavioral Finder/Owner) |
| รองรับการลงประกาศของที่พบ พร้อมรูปและรายละเอียด | ✅ | Report Found/Lost |
| รองรับการค้นหา | ✅ | Home: search, filter สถานที่/วันที่, sort ล่าสุด/ใกล้วันพบ/ยอดเข้าชม |
| กระบวนการ Claim พร้อมสถานะ | ✅ | Submitted, Need More Info, Completed, Canceled |
| ระบบแจ้งเตือนเมื่อมี claim หรือสถานะเปลี่ยน | ✅ | หน้า Notifications + Notification Detail (backend ส่งข้อมูล) |

---

## Functional Requirements

### 1. User & Authentication
| รายการ | สถานะ |
|--------|--------|
| สมัครสมาชิกด้วยอีเมล | ✅ Signup |
| เข้าสู่ระบบ/ออกจากระบบได้ | ✅ Login, Profile Log out |

### 2. Found Item Post
| รายการ | สถานะ |
|--------|--------|
| สร้างประกาศของที่พบ: ประเภท, คำอธิบาย, สถานที่พบ, วันที่/เวลา, รูปภาพ | ✅ Report Found |
| แก้ไข/ลบ/ปิดประกาศของตนเองได้ | ✅ My Posts: แก้ไข (PUT), ปิดประกาศ (POST close), ลบ (DELETE); หน้าแก้ไขเรียก PUT /api/items/:id จริง |
| ค้นหาด้วย keyword และตัวกรอง (ประเภท/สถานที่/วันที่) | ✅ Home: search, type tabs, location, dateFrom/dateTo |
| แสดง Feed และดูรายละเอียดแต่ละรายการ | ✅ Home, Item Detail |
| จัดเรียง (ล่าสุด/ใกล้วันพบ/ยอดเข้าชม) | ✅ Home sort dropdown |

### 3. Claim Workflow
| รายการ | สถานะ |
|--------|--------|
| Owner ส่งคำขอรับคืนได้ | ✅ Claim page |
| แนบหลักฐาน: รายละเอียดเฉพาะ, รูปหลักฐาน, serial number | ✅ Description, evidence image upload, serial number |
| สถานะ: Submitted, Need More Info, Completed | ✅ หน้า Claims (Submitted / Status) แสดงครบ |

### 4. Communication & Notification
| รายการ | สถานะ |
|--------|--------|
| ช่องทางติดต่อปลอดภัย (แบบฟอร์มในระบบ) ไม่เปิดเผยข้อมูลส่วนตัว | ✅ Claim form, Notification, หน้า Messages (รายการข้อความ + ส่งข้อความในระบบ) |
| แจ้งเตือน: claim ใหม่, อนุมัติ/ปฏิเสธ, นัดรับคืน | ✅ หน้า Notifications (backend ส่งข้อมูล) |

---

## Non-Functional Requirements

| รายการ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| ลงประกาศได้ภายในไม่เกิน 3 นาที | ✅ UI | ฟอร์มตรงไปตรงมา |
| UI รองรับมือถือ (Responsive) | ✅ | Media queries 768px, 640px |
| รองรับ 200+ concurrent users | ⚪ Backend | ฝั่ง server |
| ควบคุมสิทธิ์ (ไม่ให้แก้/ลบโพสต์คนอื่น) | ⚪ Backend | Frontend แสดงปุ่มแก้ไขเมื่อ isOwner จาก API |
| ทดสอบฟังก์ชันก่อนใช้งานจริง | ⚪ | ต้องมีชุดทดสอบ |
| ไม่เผยแพร่ข้อมูลส่วนตัวต่อสาธารณะ | ✅ | เบอร์/อีเมลใช้ใน flow Claim–Notification เท่านั้น |
| โครงสร้างแยกส่วน (auth, posts, claims) | ✅ | แยกหน้า/route ชัด |
| สไตล์ใช้งานง่าย อ่านง่าย | ✅ | ตาม design ที่มี |

---

## Backend API ที่ต้องมี (สำหรับ frontend ที่ทำไว้)

- `POST /api/auth/register` – สมัคร (อีเมล + รหัสผ่าน ฯลฯ)
- `POST /api/auth/login` – เข้าสู่ระบบ
- `GET /api/me`, `PATCH /api/me` – โปรไฟล์
- `GET /api/me/items` – รายการประกาศของฉัน (สำหรับ My Posts)
- `GET /api/items` – รายการ (query: type, search, location, dateFrom, dateTo, sort)
- `GET /api/items/:id` – รายละเอียด (คืน isOwner ถ้าเป็นเจ้าของ)
- `POST /api/items` – สร้างประกาศ (found/lost)
- `PUT /api/items/:id` – แก้ไขประกาศ
- `DELETE /api/items/:id` – ลบประกาศ
- `POST /api/items/:id/close` – ปิดประกาศ
- `POST /api/items/:id/claim` – ส่งคำขอรับคืน (JSON หรือ FormData ถ้ามีรูปหลักฐาน)
- `GET /api/claims`, `GET /api/claims?status=...` – รายการ claim
- `GET /api/notifications`, `GET /api/notifications/:id` – แจ้งเตือน
- `POST /api/notifications/:id/approve`, `POST /api/notifications/:id/cancel` – อนุมัติ/ยกเลิก (ตาม flow ที่ออกแบบ)
- `GET /api/me/messages` – รายการข้อความ (threads)
- `GET /api/me/messages/:id` – รายละเอียดข้อความในหัวข้อ (messages array)
- `POST /api/me/messages/:id` – ส่งข้อความในหัวข้อ (body: { text })

---

**สรุป:** ฝั่ง frontend ปรับให้ครบตาม requirements แล้ว ส่วนที่เหลือเป็นฝั่ง backend (API, auth, authorization, testing).
