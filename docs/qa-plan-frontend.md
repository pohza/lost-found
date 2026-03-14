# QA Plan - Frontend (Lost & Found)

## 1. เป้าหมาย

ตรวจสอบว่าหน้าเว็บฝั่ง frontend ทำงานถูกต้อง ใช้งานง่าย และไม่มี bug หลัก ๆ ใน flow สำคัญ:
- Login / Signup
- ลงประกาศ (Report Lost/Found)
- ดูรายละเอียด / ส่ง Claim
- Notifications / Messages
- My Posts / Profile

## 2. ขอบเขตการทดสอบ

- Browser: Chrome ล่าสุด (ขั้นต่ำ 1 ตัว), สามารถขยายไป Edge/Firefox ได้
- Device: Desktop + จอแคบ (mobile width ~375–414px) เพื่อตรวจสอบ responsive

## 3. รูปแบบการทดสอบ

- Manual testing โดยใช้ test case ด้านล่าง
- บันทึกผลเป็น: ผ่าน (Pass) / ไม่ผ่าน (Fail) / หมายเหตุ (Notes)

## 4. Test Cases หลัก (Frontend)

### 4.1 Login / Signup

1. Login ด้วยข้อมูลถูกต้อง → ระบบพาไปหน้า Home
2. Login ด้วยรหัสผ่านผิด → แสดงข้อความ error / ไม่เปลี่ยนหน้า
3. Signup ด้วยข้อมูลครบถ้วน → ระบบ login ให้อัตโนมัติและพาไปหน้า Home
4. ปุ่ม "Log in" / "Sign Up" บน header ทำงานถูกต้อง (สลับหน้าได้)

### 4.2 หน้า Home

1. เปิดหน้า Home ครั้งแรก → แสดงรายการประกาศ (อย่างน้อย 1 รายการที่ backend เตรียม)
2. เปลี่ยนแท็บ Lost/Found → รายการเปลี่ยนตามประเภท
3. ใช้ช่อง Search พิมพ์ keyword ที่มีในข้อมูล → รายการถูกกรองถูกต้อง
4. ใช้ filter Location / Date จาก–ถึง → รายการเปลี่ยนตาม filter
5. เปลี่ยน sort (ล่าสุด / ใกล้วันพบ / ยอดเข้าชม) → ลำดับรายการเปลี่ยนตาม
6. คลิกที่รายการ → ไปหน้า Item Detail ของ item นั้น

### 4.3 Report Lost / Report Found

1. เปิดหน้า Report Lost → ฟอร์มแสดงทุก field ครบ
2. ไม่กรอก field บังคับแล้วกด Submit → ขึ้น validation ตามที่กำหนด (ถ้ามี)
3. กรอกข้อมูลครบถ้วน + แนบรูป → Submit แล้วไม่มี error บน frontend
4. หลัง Submit สำเร็จ → redirect ไปหน้า My Posts หรือหน้าอื่นตามที่ออกแบบ
5. ทดสอบแก้ไข (edit) ประกาศจาก My Posts → ฟอร์มโหลดข้อมูลเดิมขึ้นมา → แก้ไขแล้ว Submit ได้

### 4.4 Item Detail / Claim

1. จากหน้า Home คลิก item → หน้า Item Detail แสดงรูป/ชื่อ/เวลา/สถานที่/description ถูกต้อง
2. ถ้า user ไม่ใช่เจ้าของโพสต์ → มีปุ่ม Submit Claim
3. กด Submit Claim → ไปหน้า Claim ของ item นั้น
4. ในหน้า Claim กรอกข้อมูลครบ → Submit แล้วไม่มี error ฝั่ง UI

### 4.5 My Posts

1. เข้า My Posts → เห็นรายการประกาศของ user ที่ login อยู่
2. ปุ่ม Edit → ไปหน้า Report Lost/Found (edit) พร้อมข้อมูลเดิม
3. ปุ่ม Close → สถานะประกาศเปลี่ยนเป็นปิด (isClosed = true) และ UI แสดงผลเปลี่ยน
4. ปุ่ม Delete → แสดง confirm → กดตกลงแล้วประกาศหายไปจาก list

### 4.6 Notifications / Messages

1. มีข้อมูลตัวอย่างจาก backend:
   - มี notification อย่างน้อย 1 รายการ
   - มี message thread อย่างน้อย 1 รายการ
2. หน้า Notifications แสดงรายการ และคลิกเข้า Notification Detail ได้
3. ใน Notification Detail แสดงข้อมูลผู้ส่ง claim ครบถ้วน (ชื่อ, email, เบอร์, description)
4. ปุ่ม Approved / Canceled กดแล้ว disable ชั่วคราวระหว่างโหลด และผลลัพธ์สะท้อนใน UI (ตามการออกแบบ backend)
5. หน้า Messages แสดง threads พร้อมจำนวนข้อความใหม่ (ถ้ามี)
6. หน้า Message Detail แสดงประวัติข้อความ และส่งข้อความใหม่ได้ (ปุ่มส่ง disabled ระหว่างส่ง)

### 4.7 Profile / Logout

1. หน้า Profile แสดงชื่อและ email ปัจจุบันของ user จาก `/api/me`
2. แก้ไขชื่อหรือ email แล้วหยุดพิมพ์สักครู่ → ระบบส่ง PATCH `/api/me` และแสดงข้อความ Saved (ถ้ามี)
3. ปุ่ม Log out → ล้าง token ใน localStorage และพากลับไปหน้า Login

## 5. Responsive Testing

ทดสอบบนความกว้างจอประมาณ 375–414px:
- Header และเมนูยังใช้งานได้ (ไม่ล้น/ทับกัน)
- ฟอร์มต่าง ๆ (Login, Report, Claim) ยังอ่านง่ายและเลื่อนใช้งานสะดวก
- การ์ดรายการ (Home, Notifications, Messages, My Posts) แสดงผลเป็นคอลัมน์เดียวอ่านง่าย

## 6. การบันทึกผลการทดสอบ

แนะนำให้ทำตาราง Excel/Google Sheets แยกคอลัมน์:
- Test Case ID
- Description
- Steps
- Expected Result
- Actual Result
- Status (Pass/Fail)
- Notes

และแนบเป็นหลักฐานในรายงาน/สไลด์ช่วง QA/UAT

