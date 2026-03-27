import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import profileImage from "./../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { authHeaders } from "../api";
import type { ClaimListItem } from "./ClaimsSubmitted";

function ClaimsStatusPage() {
  const [claims, setClaims] = useState<ClaimListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadClaims() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/api/claims", { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed");
        const data = (await res.json()) as unknown;
        if (!cancelled) setClaims(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setClaims([]);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadClaims();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleClaims = useMemo(
    () => claims.filter((c) =>
      c.status === "approved" || c.status === "canceled" || c.status === "completed" || c.status === "need_more_info"),
    [claims],
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner home-topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          <nav className="home-nav">
            <Link to="/home" className="home-nav-link">
              HOME
            </Link>
            <Link to="/claims" className="home-nav-link active">
              CLAIM
            </Link>
            <Link to="/report" className="home-nav-link">
              REPORT
            </Link>
            <Link to="/notifications" className="home-nav-link">
              NOTIFICATION
            </Link>
            <Link to="/messages" className="home-nav-link">
              MESSAGES
            </Link>
            <Link to="/profile" className="home-avatar-link">
              <img
                src={profileAvatar}
                alt="Profile"
                className="home-avatar-image"
              />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="claims-section">
          <div className="claims-header">My Claim</div>

          {loading && <p className="detail-message">กำลังโหลด...</p>}
          {!loading && error && <p className="detail-message">{error}</p>}

          {!loading && !error && (
            <div className="claims-list">
              {visibleClaims.length === 0 ? (
                <p className="detail-message">ยังไม่มีรายการ Claim</p>
              ) : (
                visibleClaims.map((c) => (
                  <div key={c.claimId} className="claims-card static">
                    <div className="claims-image-frame">
                      <img
                        src={c.imageUrl || profileImage}
                        alt={c.title}
                        className="claims-image"
                      />
                    </div>

                    <div className="claims-content">
                      <h2 className="claims-title">{c.title}</h2>
                      <p className="claims-meta">
                        เจอเวลา: {c.time} วันที่: {c.date}
                      </p>
                      <p className="claims-meta">
                        เจอสถานที่: {c.location}
                      </p>
                    </div>

                    <div className="claims-status">
                      {c.status === "approved" || c.status === "completed" ? (
                        <span className="status-pill status-approved">
                          Status: {c.status === "completed" ? "Completed" : "Approved"}
                        </span>
                      ) : c.status === "need_more_info" ? (
                        <span className="status-pill status-need-more-info">
                          Status: Need More Info
                        </span>
                      ) : (
                        <span className="status-pill status-canceled">
                          Status: Canceled
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="claims-links">
            <Link to="/claims" className="claims-link">
              กลับไปหน้า Submitted
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ClaimsStatusPage;

