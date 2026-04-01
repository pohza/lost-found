import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import profileImage from "./../assets/profile.jpg";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHeaders } from "../api";
import { API_URL } from "../lib/api";

interface NotificationDetailData {
  id: string;
  type: "lost" | "found";
  title: string;
  time: string;
  date: string;
  location: string;
  imageUrl: string;
  fullName: string;
  contactEmail: string;
  contactNumber: string;
  description: string;
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

function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NotificationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ไม่พบรายการ");
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/notifications/${id}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as NotificationDetailData;
        if (!cancelled) setItem(data);
      } catch {
        if (!cancelled) {
          setItem(null);
          setError("ไม่พบรายการ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const [actionLoading, setActionLoading] = useState(false);

  const handleApproved = async () => {
    if (!item || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications/${item.id}/approve`, { method: "POST", headers: authHeaders() });
      if (res.ok) setItem(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCanceled = async () => {
    if (!item || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications/${item.id}/cancel`, { method: "POST", headers: authHeaders() });
      if (res.ok) setItem(null);
    } finally {
      setActionLoading(false);
    }
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
          {error && !loading && <p className="detail-message">{error}</p>}

          {item && !loading && (
            <div className="notif-detail-card">
              <div className="notif-detail-top">
                <div className="claim-image-frame">
                  <img src={item.imageUrl || profileImage} alt={item.title} className="claim-image" />
                </div>
                <div className="claim-summary">
                  <h1 className="claim-title">{item.title}</h1>
                  {item.type === "found" ? (
                    <>
                      <p className="claim-meta">เจอเวลา: {item.time} วันที่: {item.date}</p>
                      <p className="claim-meta">เจอสถานที่: {item.location}</p>
                    </>
                  ) : (
                    <>
                      <p className="claim-meta">หายเมื่อ: {item.time} วันที่: {item.date}</p>
                      <p className="claim-meta">หายที่: {item.location}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="claim-form">
                <label className="report-field">
                  <span className="report-field-label">Full Name</span>
                  <div className="claim-input-with-icon">
                    <span className="claim-input-icon"><IconUser /></span>
                    <input type="text" className="report-input" placeholder="Placeholder" value={item.fullName} readOnly />
                  </div>
                </label>
                <div className="claim-field-row">
                  <label className="report-field">
                    <span className="report-field-label">Contact Email</span>
                    <div className="claim-input-with-icon">
                      <span className="claim-input-icon"><IconMail /></span>
                      <input type="text" className="report-input" placeholder="Placeholder" value={item.contactEmail} readOnly />
                    </div>
                  </label>
                  <label className="report-field">
                    <span className="report-field-label">Contact Number</span>
                    <div className="claim-input-with-icon">
                      <span className="claim-input-icon"><IconPhone /></span>
                      <input type="text" className="report-input" placeholder="Placeholder" value={item.contactNumber} readOnly />
                    </div>
                  </label>
                </div>
                <label className="report-field">
                  <span className="report-field-label">Description</span>
                  <div className="detail-description-box">{item.description || "—"}</div>
                </label>
                <div className="notif-detail-actions">
                  <button type="button" className="notif-btn-approved" onClick={handleApproved} disabled={actionLoading}>
                    Approved
                  </button>
                  <button type="button" className="notif-btn-canceled" onClick={handleCanceled} disabled={actionLoading}>
                    Canceled
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default NotificationDetailPage;
