import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import profileImage from "./../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { authHeaders } from "../api";

export type ClaimStatus = "submitted" | "need_more_info" | "completed" | "approved" | "canceled";

export interface ClaimListItem {
  claimId: string;
  itemId: string;
  title: string;
  time: string;
  date: string;
  location: string;
  imageUrl: string;
  status: ClaimStatus;
}

function ClaimsSubmittedPage() {
  const [claims, setClaims] = useState<ClaimListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadClaims() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/claims?status=submitted", { headers: authHeaders() });
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
    () => claims.filter((c) => c.status === "submitted" || c.status === "need_more_info"),
    [claims],
  );

  useEffect(() => {
    if (!selectedClaimId && visibleClaims.length > 0) {
      setSelectedClaimId(visibleClaims[0].claimId);
    }
  }, [selectedClaimId, visibleClaims]);

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
                  <button
                    key={c.claimId}
                    type="button"
                    className={`claims-card ${
                      selectedClaimId === c.claimId ? "selected" : ""
                    }`}
                    onClick={() => setSelectedClaimId(c.claimId)}
                  >
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
                      {c.status === "need_more_info" ? (
                        <span className="status-pill status-need-more-info">
                          Status: Need More Info
                        </span>
                      ) : (
                        <span className="status-pill status-submitted">
                          Status: Submitted
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          <div className="claims-links">
            <Link to="/claims/status" className="claims-link">
              ดูสถานะ Approved / Canceled
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ClaimsSubmittedPage;

