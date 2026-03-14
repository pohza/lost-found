# Risk Management - Lost & Found Project

เอกสารนี้สรุปความเสี่ยงหลัก ๆ ของระบบ และแนวทางลดความเสี่ยง (mitigation) โดยมุมมองฝั่ง frontend เป็นหลัก และเชื่อมกับ backend

## ตารางความเสี่ยงหลัก

| ID | ความเสี่ยง (Risk) | ผลกระทบ (Impact) | โอกาสเกิด (Likelihood) | ระดับความเสี่ยง | แนวทางลดความเสี่ยง (Mitigation) |
|----|---------------------|--------------------|--------------------------|-------------------|------------------------------------|
| R1 | Backend API ยังไม่เสร็จหรือเปลี่ยนสัญญา (contract) | หน้าเว็บเรียก API ไม่ได้ / error บ่อย | ปานกลางถึงสูง | สูง | - แยก `REQUIREMENTS.md` เป็นสัญญา API ชัดเจน  \n- Mock flow จาก frontend ให้ backend ดู  \n- ใช้ error handling ใน frontend (แสดงข้อความ, ไม่ให้แอปล่ม) |
| R2 | ปัญหา Auth token หมดอายุ / หาย | ผู้ใช้ถูกเด้งออก, เรียก API แล้ว 401 | ปานกลาง | กลาง | - รวมการจัดการ token ไว้ใน helper (`authHeaders`)  \n- หาก API ตอบ 401 ให้ redirect ไปหน้า Login |
| R3 | UI แสดงผลผิดบนจอเล็ก (mobile) | ผู้ใช้ใช้งานลำบาก, อ่านไม่ออก | กลาง | กลาง | - ออกแบบ CSS ให้ responsive (media queries)  \n- ทดสอบบนความกว้างจอ 375–414px (ดู QA Plan) |
| R4 | Bug ฝั่ง frontend ทำให้ส่งฟอร์มผิดพลาด | ข้อมูลที่ส่งให้ backend ไม่ครบ/ผิด | กลาง | กลาง | - ใช้ TypeScript เพื่อลด type error  \n- เพิ่ม validation เบื้องต้นในฟอร์ม (field บังคับ, format email)  \n- เขียน QA Plan + UAT Scenario เพื่อทดสอบ flow สำคัญ |
| R5 | ผู้ใช้กรอกข้อมูลไม่ครบหรือผิด format | เกิด error ฝั่ง backend หรือ reject request | กลาง | กลาง | - แสดง placeholder / label ชัดเจนในทุก field  \n- ใช้ input type ที่เหมาะสม (email, datetime-local)  \n- แสดงข้อความ error/validation บนหน้าเว็บ |
| R6 | การสื่อสารระหว่างทีม Frontend/Backend ไม่ตรงกัน | API เปลี่ยนแต่ frontend ไม่อัปเดต | สูง | กลางถึงสูง | - ใช้ `REQUIREMENTS.md` เป็น single source of truth  \n- ใช้ Git/GitHub issue/PR เพื่อแจ้งการเปลี่ยนแปลง  \n- มีช่วง UAT ร่วมกันก่อนส่งงาน |
| R7 | การ deploy frontend ด้วย Docker ผิดพลาด | ระบบ production ใช้งานไม่ได้ | กลาง | ต่ำ-กลาง | - มี Dockerfile + docker-compose ที่ทดสอบแล้ว  \n- เขียนวิธีใช้งานใน README ชัดเจน  \n- ทดสอบรัน container บนเครื่อง dev ก่อนขึ้นจริง |

## สรุปแนวทางบริหารความเสี่ยง

- ใช้เอกสารกลาง (`REQUIREMENTS.md`, `README.md`, docs ต่าง ๆ) เป็นตัวกลางระหว่าง frontend และ backend
- เขียน test plan (QA) และ UAT scenario ชัดเจน เพื่อลด bug ที่เกิดจากการใช้งานจริง
- ใช้ Git/GitHub ในการ track การเปลี่ยนแปลง (ทั้ง code และเอกสาร) เพื่อย้อนดูได้ว่ามีอะไรเปลี่ยนไปเมื่อไร
- ใช้ Docker สำหรับ frontend เพื่อลดความเสี่ยงเรื่อง environment ไม่ตรงกันระหว่างเครื่อง dev กับเครื่อง deploy

