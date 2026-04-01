import "./../App.css";
import logo from "./../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import { forgotPassword } from "../services/auth";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLink, setDebugLink] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setDebugLink(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      const data = (await forgotPassword(email.trim())) as {
        message?: string;
        debugResetLink?: string;
      };
      setMessage(data.message || "ถ้ามีบัญชีนี้ ระบบจะส่งขั้นตอนตั้งรหัสใหม่ให้ทางอีเมล");
      if (data.debugResetLink) setDebugLink(data.debugResetLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : "คำขอล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <Link to="/login">
            <button type="button" className="topbar-signup">
              Log in
            </button>
          </Link>
        </div>
      </header>

      <main className="main">
        <section className="login-card">
          <h1 className="login-title">ลืมรหัสผ่าน</h1>
          <p className="signup-hint" style={{ marginBottom: "1rem" }}>
            กรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์ตั้งรหัสใหม่ (ถ้ามีบัญชี) สำหรับการใช้งานจริงควรตั้งค่า SMTP บนเซิร์ฟเวอร์
          </p>

          {error && <p className="login-error" style={{ color: "#c00", marginBottom: "0.5rem" }}>{error}</p>}
          {message && <p className="detail-message" style={{ marginBottom: "0.5rem" }}>{message}</p>}
          {debugLink && (
            <p className="detail-message" style={{ wordBreak: "break-all", fontSize: "0.85rem" }}>
              <strong>โหมดทดสอบ:</strong>{" "}
              <a href={debugLink}>เปิดลิงก์ตั้งรหัสใหม่</a>
            </p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">อีเมล</span>
              <input
                type="email"
                className="field-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
            </button>
          </form>

          <p className="signup-hint">
            <Link to="/login">กลับไปเข้าสู่ระบบ</Link>
          </p>
        </section>
      </main>
      <footer className="footer" />
    </div>
  );
}

export default ForgotPasswordPage;
