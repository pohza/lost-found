import "./../App.css";
import logo from "./../assets/logo.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { resetPassword } from "../services/auth";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token") || "";
    setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!token.trim()) {
      setError("ลิงก์ไม่ถูกต้อง — ขาด token");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== password2) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token.trim(), password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ตั้งรหัสไม่สำเร็จ");
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
          <h1 className="login-title">ตั้งรหัสผ่านใหม่</h1>

          {done && <p className="detail-message">ตั้งรหัสสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...</p>}
          {error && !done && (
            <p className="login-error" style={{ color: "#c00", marginBottom: "0.5rem" }}>{error}</p>
          )}

          {!done && (
            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">รหัสผ่านใหม่</span>
                <input
                  type="password"
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">ยืนยันรหัสผ่าน</span>
                <input
                  type="password"
                  className="field-input"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึกรหัสใหม่"}
              </button>
            </form>
          )}

          <p className="signup-hint">
            <Link to="/login">กลับไปเข้าสู่ระบบ</Link>
          </p>
        </section>
      </main>
      <footer className="footer" />
    </div>
  );
}

export default ResetPasswordPage;
