import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHeaders } from "../api";
import { API_URL } from "../lib/api";

/** ข้อความ/การติดต่อในระบบ (ไม่เปิดเผยเบอร์/อีเมลสาธารณะ) */
export interface MessageThread {
  id: string;
  subject: string;
  itemId: string;
  itemTitle: string;
  lastMessageAt: string;
  unread: number;
}

function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_URL}/me/messages`, { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as unknown;
          if (!cancelled) setThreads(Array.isArray(data) ? data : []);
        } else {
          if (!cancelled) setThreads([]);
        }
      } catch {
        if (!cancelled) setThreads([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
            <Link to="/messages" className="home-nav-link active">MESSAGES</Link>
            <Link to="/profile" className="home-avatar-link">
              <img src={profileAvatar} alt="Profile" className="home-avatar-image" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="notif-section">
          <div className="notif-banner">ข้อความ (Messages)</div>
          <p className="myposts-hint">
            ช่องทางติดต่อในระบบ เกี่ยวกับคำขอรับคืน — ข้อมูลส่วนตัวไม่แสดงต่อสาธารณะ
          </p>

          {loading && <p className="detail-message">กำลังโหลด...</p>}
          {!loading && threads.length === 0 && (
            <p className="detail-message">ยังไม่มีข้อความ</p>
          )}

          {!loading && threads.length > 0 && (
            <div className="notif-list">
              {threads.map((t) => (
                <Link
                  key={t.id}
                  to={`/messages/${t.id}`}
                  className="notif-card messages-card-link"
                >
                  <h2 className="notif-card-title">{t.subject || t.itemTitle}</h2>
                  <p className="messages-meta">ประกาศ: {t.itemTitle}</p>
                  {t.unread > 0 && (
                    <span className="messages-unread">{t.unread} ข้อความใหม่</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default MessagesPage;
