import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHeaders } from "../api";

export interface NotificationListItem {
  id: string;
  type: "lost" | "found";
  title: string;
  fullName: string;
  contactEmail: string;
  contactNumber: string;
}

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

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.2 3.8 6.7 5.3c-.7.7-.9 1.8-.5 2.7 1.2 2.7 3.3 5.9 6.7 9.3s6.6 5.5 9.3 6.7c.9.4 2 .2 2.7-.5l1.5-1.5c.5-.5.5-1.3 0-1.8l-2.4-2.4c-.4-.4-1-.5-1.5-.2l-1.8 1c-.6.3-1.3.3-1.9 0-1.4-.7-3.3-2-5.4-4.1s-3.4-4-4.1-5.4c-.3-.6-.3-1.3 0-1.9l1-1.8c.3-.5.2-1.1-.2-1.5L10 3.8c-.5-.5-1.3-.5-1.8 0Z" stroke="#1E3A5F" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function NotificationsPage() {
  const [list, setList] = useState<NotificationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/notifications", { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as unknown;
          if (!cancelled) setList(Array.isArray(data) ? data : []);
        }
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
            <Link to="/notifications" className="home-nav-link active">NOTIFICATION</Link>
            <Link to="/messages" className="home-nav-link">MESSAGES</Link>
            <Link to="/profile" className="home-avatar-link">
              <img src={profileAvatar} alt="Profile" className="home-avatar-image" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="notif-section">
          <div className="notif-banner">Notification</div>
          {loading && <p className="detail-message">กำลังโหลด...</p>}
          {!loading && (
            <div className="notif-list">
              {list.length === 0 ? (
                <p className="detail-message">ยังไม่มีรายการแจ้งเตือน</p>
              ) : (
                list.map((n) => (
                  <div key={n.id} className="notif-card">
                    <h2 className="notif-card-title">
                      {n.title}
                    </h2>
                    <label className="report-field">
                      <span className="report-field-label">Full Name</span>
                      <div className="claim-input-with-icon">
                        <span className="claim-input-icon"><IconUser /></span>
                        <input type="text" className="report-input" placeholder="Placeholder" value={n.fullName} readOnly />
                      </div>
                    </label>
                    <div className="claim-field-row">
                      <label className="report-field">
                        <span className="report-field-label">Contact Email</span>
                        <div className="claim-input-with-icon">
                          <span className="claim-input-icon"><IconMail /></span>
                          <input type="text" className="report-input" placeholder="Placeholder" value={n.contactEmail} readOnly />
                        </div>
                      </label>
                      <label className="report-field">
                        <span className="report-field-label">Contact Number</span>
                        <div className="claim-input-with-icon">
                          <span className="claim-input-icon"><IconPhone /></span>
                          <input type="text" className="report-input" placeholder="Placeholder" value={n.contactNumber} readOnly />
                        </div>
                      </label>
                    </div>
                    <div className="notif-card-actions">
                      <Link to={`/notifications/${n.id}`} className="notif-view-details">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default NotificationsPage;
