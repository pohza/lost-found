import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { authHeaders } from "../api";
import type { FormEvent } from "react";

const AUTO_SAVE_DELAY_MS = 800;

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Z" stroke="#1E3A5F" strokeWidth="1.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="#1E3A5F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 7.5h15v9h-15v-9Z" stroke="#1E3A5F" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5.5 8.5 12 13l6.5-4.5" stroke="#1E3A5F" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as { fullName?: string; email?: string };
          if (!cancelled) {
            setFullName(data.fullName ?? "");
            setEmail(data.email ?? "");
          }
        }
      } catch {
        // ไม่มี backend หรือเครือข่ายผิดพลาด
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const saveProfile = useCallback(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ fullName, email }),
        });
        if (res.ok) {
          setSavedMessage(true);
          setTimeout(() => setSavedMessage(false), 2000);
        }
      } catch {
        // แสดง error ได้ถ้าต้องการ
      }
    })();
  }, [fullName, email]);

  useEffect(() => {
    if (loading) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(saveProfile, AUTO_SAVE_DELAY_MS);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [fullName, email, loading, saveProfile]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner home-topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <nav className="home-nav">
            <Link to="/home" className="home-nav-link">HOME</Link>
            <Link to="/claims" className="home-nav-link">CLAIM</Link>
            <Link to="/report" className="home-nav-link">REPORT</Link>
            <Link to="/notifications" className="home-nav-link">NOTIFICATION</Link>
            <Link to="/messages" className="home-nav-link">MESSAGES</Link>
            <Link to="/profile" className="home-avatar-link">
              <img src={profileAvatar} alt="Profile" className="home-avatar-image" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="profile-section">
          <div className="profile-header">My Profile</div>
          <div className="profile-card">
            <div className="profile-avatar-wrap">
              <img src={profileAvatar} alt="" className="profile-avatar" />
            </div>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-links">
                <Link to="/my-posts" className="profile-myposts-link">
                  ประกาศของฉัน (My Posts)
                </Link>
              </div>
              {loading && <p className="detail-message">กำลังโหลด...</p>}
              {savedMessage && <p className="claim-submit-ok">บันทึกแล้ว</p>}
              <label className="report-field">
                <span className="report-field-label">Full Name</span>
                <div className="claim-input-with-icon">
                  <span className="claim-input-icon"><IconUser /></span>
                  <input
                    type="text"
                    className="report-input"
                    placeholder="Placeholder"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </label>
              <label className="report-field">
                <span className="report-field-label">Email</span>
                <div className="claim-input-with-icon">
                  <span className="claim-input-icon"><IconMail /></span>
                  <input
                    type="email"
                    className="report-input"
                    placeholder="Placeholder"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>
              <div className="profile-actions">
                <button type="submit" className="profile-save-button">
                  บันทึก
                </button>
                <button type="button" className="profile-logout" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ProfilePage;
